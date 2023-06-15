import { Component, OnInit, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormModel } from 'app/@core/model/dto/formModel';
import { AccountsReq } from 'app/@core/model/rest/accounts/accounts-req';
import { BfmBaseRequest } from 'app/@core/model/rest/accounts/bfm/bfm-base-request';
import { Account } from 'app/@core/model/rest/common/account';
import { BreadcrumbService } from 'app/@core/service/base/breadcrumb.service';
import { AmountModel } from 'arb-design-library/model/amount.model';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { ActiveElement, Chart, ChartConfiguration, ChartOptions } from 'chart.js';
import { forkJoin, lastValueFrom, map, take } from 'rxjs';
import {
  balanceChartConfig,
  barChartConfig,
  cashFlowChartConfig,
  chartOptions,
  doughnutChartConfig,
  doughnutChartOptions,
  financialInstitutionOption,
  financialInstitutionsRes,
  getSelectAccountControl,
  initialAmount,
  initialAmountPositive,
  initialAmountWarning,
  periodsTypeList,
  showIncomeDetailsBtn,
  showOutcomeDetailsBtn,
  tryAgainLinCard,
} from './bfm-dashboard-controls';
import { AccountsCommonService } from "../../../../@core/service/accounts/accounts-common.service";
import { StyleColorChart } from 'styleColorChart';
import { TopByCategoryRequest } from 'app/@core/model/rest/accounts/bfm/top-by-category-request';
import { TopBySubCategoryRequest } from 'app/@core/model/rest/accounts/bfm/top-by-sub-category-request';
import { POSLocation } from 'app/@core/model/rest/accounts/bfm/p-o-s-location';
import { LineCardModel } from 'arb-design-library/model/line-card.model';
import { AuthenticationUtils } from "../../../../@core/utility/authentication-utils";
import { CategoryResponse } from 'app/@core/model/rest/accounts/bfm/category-response';
import { ThemeService } from 'app/theme/theme.service';
import { TitleModel } from 'arb-design-library/model/title.model';
import { connectBankForm } from 'app/shared/connect-bank/open-banking-landing.controls';
import { PopupService } from 'app/@core/service/base/popup.service';

@Component({
  selector: 'app-bfm-dashboard',
  templateUrl: './bfm-dashboard.component.html',
})
export class BFMDashboardComponent implements OnInit {
  chosenBank:{id:string,name:string}={id:"",name:""}
  popupForm: FormModel = new FormModel()
  currentBreadCrumbs:any=[]
  selectAccountControl: FormModel[] = [];
  selectedPeriodType: any;
  periodsTypeList: ButtonModel = periodsTypeList;
  showIncomeDetailsBtn: ButtonModel = showIncomeDetailsBtn;
  showOutcomeDetailsBtn: ButtonModel = showOutcomeDetailsBtn;
  totalCashFlow: AmountModel = initialAmount;
  actualIncome: AmountModel = initialAmountPositive;
  actualExpenses: AmountModel = initialAmountWarning;
  expectedIncome: AmountModel = initialAmount;
  expectedExpenses: AmountModel = initialAmount;
  selectedAccount!: Account;
  showBalanceChart = false;
  showCashFlowChart = false;
  bfmDataReq: BfmBaseRequest = {
    IBAN: null,
    periodType: 2,
    currency: "SAR",
  }

  topByCategoryReq: TopByCategoryRequest = {
    IBAN: null,
    periodType: 2,
    currency: "SAR",
    noOfCats: 5
  }

  balanceChartData: ChartConfiguration<any>['data'] = balanceChartConfig;
  cashFlowChartData: ChartConfiguration<any>['data'] = cashFlowChartConfig;
  chartOptions: ChartOptions<'line'> = chartOptions;
  eligibleJuridicalState = AuthenticationUtils.isSolePropertyCompany;

  showCashFlowCharts: boolean = true;
  inOutflowBarChartData: ChartConfiguration<any>['data'] = structuredClone(barChartConfig);
  inOutflowDoughnutChartData: ChartConfiguration<any>['data'] = structuredClone(doughnutChartConfig);
  inOutflowBarChartDrillDownOptions: ChartOptions<'bar'> = {
    responsive: true,
    onClick: (event: any, elements: ActiveElement[], chart: Chart) => {
      if (this.enableDrillDownFlowChart) {
        return;
      }
      const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
      if (points.length) {
        const firstPoint = points[0];
        if (chart.data.labels && chart.data.labels.length > 0) {
          const label = chart.data.labels[firstPoint.index]
          if (this.currentView === "inflow") {
            this.loadInflowCategoryAndSubCategoryGraphs(label, true);
          } else if (this.currentView === "outflow") {
            this.loadOutflowCategoryAndSubCategoryGraphs(label, true);
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || '';
            if (context.parsed.y !== null) {
              label = context.parsed.y + " " + sessionStorage.getItem("bfmSelectedCurrecny")
            }
            return label;
          }
        }
      },
      legend: {
        display: false
      },
    },
  };

  inOutflowDoughnutChartOptions: ChartOptions<'doughnut'> = doughnutChartOptions;
  showInflowChart: boolean = false;
  enableDrillDownFlowChart: boolean = false;
  chartAmmoutOptions: ChartAmountOptions = {
    amount: "",
    showAmount: false,
    currency: "608"
  }

  locationChartAmmoutOptions: ChartAmountOptions = {
    amount: "",
    showAmount: false,
    currency: "608"
  }

  tryAgainBar: LineCardModel[] = structuredClone(tryAgainLinCard)
  tryAgainDougnet: LineCardModel[] = structuredClone(tryAgainLinCard)
  showTryAgain: boolean = false;

  showCashFlowSection: boolean = true;
  chartPageTitle: string = 'accounts.cashflow-overview';
  showArrow = false;
  currentView: string = '';
  showLocationGrah = false
  locationDoughnutChartData: ChartConfiguration<any>['data'] = structuredClone(doughnutChartConfig);

  cashInFlowDataResponse!: CategoryResponse
  
  manageTitle: TitleModel = {
    id: "manageTitle",
    type: "Section",
    "title": "Select your BFM Preference",
    endButtons: [
      {
        id: "manage-id",
        type: "secondary",
        text: "Manage",

      }
    ]
  }

  connectTitle: TitleModel = {
    id: "connectTitle1",
    type: "Section",
    "title": "Benefit more from BFM through Open Banking",
    endButtons: [
      {
        id: "connect-id",
        type: "secondary",
        text: "Connect Bank Account",

      }
    ],
    subTitle: "Your finance manager keep you watch know about all details for your finance"
  }
  constructor(
    private accountsService: AccountsCommonService,
    private translate: TranslateService,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private themeService: ThemeService,
    private popupService:PopupService
  ) {
    this.initiatePage();
    this.intiateAccounts();
    this.setBalanceChartConfigColor();
    this.setCashFlowChartDataConfigColor();
  }
//TODO FARAH
  getLinkedAccounts():boolean{
    //if first time (Connect to Bank)
    //return false;
    //else (Manage Bans)
    return false;

  }
  
  getFinancialInstitutions():boolean{
    //if first time (Connect to Bank)
    //return false;
    //else (Manage Bans)
    let body={
      "financialInstitutionId":null,
      "financialInstitutionName":null,
      "page":null,
      "isActive":null
  }
    this.accountsService.getFinancialInstitutions().subscribe({
      next:(res)=>console.log(res),
      error:(err)=>console.log(err)
    })
    return false;

  }

  manageButtonClick(){
    this.router.navigate(['/accounts/bfm/manage-consents'])
  }
  BanksList=[
  {
    description: "All Banks",
    selected: true,
    isDisabled: true,
  },
  {
    description: "option 1",
    selected: false,
    isDisabled: false,
  },
  {
    description: "option 2",
    selected: false,
    isDisabled: false,
  }
]

AccountsList=[
  {
    description: "Account 1",
  },
  {
    description: "Account 2",
  }
]

  setCashFlowChartDataConfigColor() {
    this.cashFlowChartData.datasets[0].pointBackgroundColor = this.themeService.getActiveTheme().properties['--arb-primaryText']
    this.cashFlowChartData.datasets[0].borderColor = this.themeService.getActiveTheme().properties['--arb-primaryText']
    this.cashFlowChartData.datasets[0].pointHoverBackgroundColor = this.themeService.getActiveTheme().properties['--arb-primaryColor']
    this.cashFlowChartData.datasets[0].pointHoverBorderColor = this.themeService.getActiveTheme().properties['--arb-primaryColor']

    this.cashFlowChartData.datasets[1].backgroundColor = this.themeService.getActiveTheme().properties['--arb-positiveText']
    this.cashFlowChartData.datasets[1].hoverBackgroundColor = this.themeService.getActiveTheme().properties['--arb-positiveText']
    this.cashFlowChartData.datasets[1].hoverBorderColor = this.themeService.getActiveTheme().properties['--arb-positiveText']

    this.cashFlowChartData.datasets[2].backgroundColor = this.themeService.getActiveTheme().properties['--arb-negativeText']
    this.cashFlowChartData.datasets[2].hoverBackgroundColor = this.themeService.getActiveTheme().properties['--arb-negativeText']
    this.cashFlowChartData.datasets[2].hoverBorderColor = this.themeService.getActiveTheme().properties['--arb-negativeText']
  }

  setBalanceChartConfigColor() {
    this.balanceChartData.datasets[0].backgroundColor = this.themeService.getActiveTheme().properties['--arb-transparent']
    this.balanceChartData.datasets[0].borderColor = this.themeService.getActiveTheme().properties['--arb-primaryColor']
    this.balanceChartData.datasets[0].pointBorderColor = this.themeService.getActiveTheme().properties['--arb-transparent']
    this.balanceChartData.datasets[0].pointBackgroundColor = this.themeService.getActiveTheme().properties['--arb-transparent']
    this.balanceChartData.datasets[0].pointHoverBackgroundColor = this.themeService.getActiveTheme().properties['--arb-primaryColor']
    this.balanceChartData.datasets[0].pointHoverBorderColor = this.themeService.getActiveTheme().properties['--arb-primaryColor']

  }

  initiatePage() {
    this.currentBreadCrumbs=[{
      text: this.translate.instant('accounts.acc'),
      url: '/accounts'
    }, {
      text: this.translate.instant('accounts.bfm-title'),
      url: '/accounts/bfm'
    }]
    this.breadcrumbService.setBreadcrumb(this.currentBreadCrumbs);

    this.selectedPeriodType = this.periodsTypeList.options![1];
    if (this.selectedPeriodType)
      this.periodsTypeList.text = this.selectedPeriodType.text;

  }
  intiateAccounts() {
    this.selectAccountControl.push(getSelectAccountControl());
    this.getAllEligibleAccounts();
    this.selectAccountControl[0].controls[
      'selectAccount'
    ].valueChanges.subscribe((accountSelected) => {
      this.selectedAccount = accountSelected.value;
      this.setSelectedAccountCurrencyInSessionStorage()
      this.getBfmChartData();
    });
  }

  ngOnInit(): void {
  }

  onTitleButtonsClick(titleButtonId: string) {
    if (titleButtonId === 'arrowTitle')
      this.router.navigate(['/accounts']);
  }
  
  makeConnectionHandler(btn:any) {
    /* 
    1) fetch api of banks
    2) update the popupform
    3) push form in popup
    4) listen to drop down changes
    */

    this.accountsService.getFinancialInstitutions().subscribe({ //fetch api of banks
      next:(res:financialInstitutionsRes)=>{
        let lang=this.translate.currentLang
        let financialInstitutions:Array<financialInstitutionOption>=this.accountsService.mapFinancialInstitutions(res.financialInstitutionsList,lang)
        this.popupForm=connectBankForm(financialInstitutions) //update the form
        this.showPopup()  // push the form to the popup modal and listen to button clicks
        this.updatechosenBank() //listen to drop down changes
      },
      error:()=>{}
    })
    
}
  updatechosenBank(){
    this.popupForm.controls['dropDown'].valueChanges.subscribe(res => {
      this.chosenBank.id = res.value.value
      this.chosenBank.name = res.value.key
      this.popupForm.controls['next'].controlOptions.isDisable = false
    },)
  }
  showPopup(){
    this.popupService.showPopup({ form: this.popupForm }).subscribe(res => {
      if (res.buttonId === "next")
      this.router.navigate(['connectBankReview'], {queryParams:{chosenBankId:this.chosenBank.id,chosenBankName:this.chosenBank.name,previousRoute:'BFM'},})
      this.popupForm.controls['next'].controlOptions.isDisable = true
      this.popupForm.controls['dropDown'].setValue("")
      this.popupService.dismiss()
    })
  }
  setSelectedAccountCurrencyInSessionStorage() {
    sessionStorage.setItem("bfmSelectedCurrecny", this.getSelectedAccountCurrency())
  }

  getAllEligibleAccounts() {
    let accountsReq: AccountsReq = {
      order: "",
      orderType: "",
      page: 1,
      rows: null,
      txType: "ECAL"
    };
    this.accountsService.getAllEligibleAccounts(accountsReq).subscribe({
      next: (res) => {
        var totalSARAmount = 0.00;
        var totalUSDAmount = 0.00;
        res.listAccount.forEach(item => {
          if (item.currency === '608') {
            totalSARAmount = totalSARAmount + item.availableBalance;
          } else if (item.currency === '752') {
            totalUSDAmount = totalUSDAmount + item.availableBalance;
          }
        })
        var accountPk = res.listAccount[0].accountPk;
        if (totalUSDAmount > 0)
          res.listAccount.unshift(this.createCloneOfAccountObj("All USD Accounts", accountPk - 1, '752', totalUSDAmount, res.listAccount[0]));
        if (totalSARAmount > 0)
          res.listAccount.unshift(this.createCloneOfAccountObj("All SAR Accounts", accountPk - 2, '608', totalSARAmount, res.listAccount[0]));
        this.selectAccountControl[0].controls[
          'selectAccount'
        ].controlOptions.options = res.listAccount;
        this.selectAccountControl[0].controls['selectAccount'].setValue(
          res.listAccount[0]
        );
        this.selectedAccount = res.listAccount[0];
        this.setSelectedAccountCurrencyInSessionStorage();
        if (this.eligibleJuridicalState) {
          this.getBfmChartData();
        }
      },
      error: () => {
      },
    });
  }

  createCloneOfAccountObj(alis: string, accountPk: number, currency: string, balance: number, refObj: Account): Account {
    const myClonedObject = Object.assign({}, refObj);
    myClonedObject.alias = alis;
    myClonedObject.account18Length = "";
    myClonedObject.branchid = '';
    myClonedObject.ccdmAlias = '';
    myClonedObject.checkDigit = '';

    myClonedObject.companyPk != null;
    myClonedObject.erNumber = '';
    myClonedObject.ibanNumber = '';
    myClonedObject.numberAccount = '';
    myClonedObject.typeAccount = '';
    myClonedObject.currency = currency;

    myClonedObject.availableSarBalance = currency === '608' ? balance : 0;
    myClonedObject.fullAccountNumber = "";
    myClonedObject.availableBalance = balance;
    myClonedObject.accountPk = accountPk;
    return myClonedObject;
  }

  onSelectOption(periodId: string) {
    console.log(periodId)
    this.selectedPeriodType = this.periodsTypeList.options!.find((periodType: any) => {
      return periodType.id === periodId;
    });
    this.periodsTypeList.text = this.selectedPeriodType.text;
    this.bfmDataReq.periodType = Number(periodId);
    this.getBfmChartData();
  }

  getSelectedAccountCurrency(): string {
    let currency = "SAR"
    if (this.selectedAccount.currency === "608") {
      currency = "SAR";
    } else if (this.selectedAccount.currency === "752") {
      currency = "USD";
    }
    return currency
  }

  async getBfmChartData() {
    this.resetChartsData();
    if (this.selectedAccount.ibanNumber.trim().length > 0)
      this.bfmDataReq.IBAN = this.selectedAccount.ibanNumber;
    else
      this.bfmDataReq.IBAN = null;
    this.bfmDataReq.currency = this.getSelectedAccountCurrency();

    try {
      this.resetFlowGraphs()
      this.loadActualExpectedBalances()
      if(this.bfmDataReq.periodType !== 1) {
        this.loadcashFlowAndBalanceChart();
        this.showCashFlowSection = true;
      } else if(this.bfmDataReq.periodType === 1){
        this.showCashFlowChart = true;
        this.showCashFlowSection = false;
        this.showTryAgain = false;
        this.showIncomeDetailsBtn.isDisable = true;
        this.showOutcomeDetailsBtn.isDisable = true;
      }
    } catch (error) {

    }
  }

  async loadActualExpectedBalances() {

    this.chartPageTitle = 'accounts.cashflow-overview';
    this.showOutcomeDetailsBtn.isDisable = false
    this.showIncomeDetailsBtn.isDisable = false

    const result = await lastValueFrom(
      this.accountsService.getActualExpected(this.bfmDataReq).pipe(take(1))
    );

    this.totalCashFlow.amount = (result?.actual.income.total - result?.actual.expense.total).toString();
    this.totalCashFlow.currency = result.actual.income.currency;

    this.actualIncome = {
      ...this.actualIncome,
      amount: result.actual.income.total.toString(),
      currency: result.actual.income.currency,
      color: 'color-arb-positiveText'
    };

    this.actualExpenses = {
      ...this.actualExpenses,
      amount: result.actual.expense.total > 0 ? result.actual.expense.total.toString() : (result.actual.expense.total * -1).toString(),
      currency: result.actual.expense.currency,
      color: 'color-arb-negativeText'
    };
    this.expectedIncome = {
      ...this.expectedIncome,
      amount: result.expected.income.total.toString(),
      currency: result.expected.income.currency,
    };
    this.expectedExpenses = {
      ...this.expectedExpenses,
      amount: result.expected.expense.total > 0 ? result.expected.expense.total.toString() : (result.expected.expense.total * -1).toString(),
      currency: result.expected.expense.currency,
    };
  }

  loadcashFlowAndBalanceChart() {
    this.accountsService.getBalanceAndCashFlow(this.bfmDataReq).subscribe(
      {
        next: (results) => {
          for (const cash of results.cashFlow) {
            this.cashFlowChartData.labels!.push(cash.dateTime);
            this.cashFlowChartData.datasets[0].data.push(cash.cashFlow);
            this.cashFlowChartData.datasets[1].data.push(cash.totalIncome)
            this.cashFlowChartData.datasets[2].data.push(
              cash.totalExpense > 0 ? -1 * cash.totalExpense : cash.totalExpense
            );
          }
          this.showCashFlowChart = true;
          for (const balance of results.balance) {
            this.balanceChartData.labels?.push(balance.lasTransactionTime);
            this.balanceChartData!.datasets[0].data.push(balance.balance);
          }
          if (this.balanceChartData.labels?.length == 1) {
            this.balanceChartData!.datasets[0].pointBackgroundColor = this.themeService.getActiveTheme().properties['--arb-primaryColor'];
          }
          this.showBalanceChart = true;
          if (this.balanceChartData.labels!.length === 0) {
            this.showTryAgain = true;
          } else {
            this.showTryAgain = false;
          }
        },
        error: (err: any) => {
          if (this.balanceChartData.labels!.length === 0) {
            this.showTryAgain = true;
          } else {
            this.showTryAgain = false;
          }
          console.log('Here is the error...', err.status);
        },
      });
  }

  resetChartsData() {
    this.enableDrillDownFlowChart = false;
    this.showBalanceChart = false;
    this.showCashFlowChart = false;
    this.balanceChartData.labels = [];
    this.balanceChartData!.datasets[0].data = [];
    this.cashFlowChartData.labels = [];
    this.cashFlowChartData.datasets[0].data = [];
    this.cashFlowChartData.datasets[1].data = [];
    this.cashFlowChartData.datasets[2].data = [];
  }

  onInflowDetailsClick(event: any) {
    console.log(event);
    if (event === "show-outcome-details") {
      sessionStorage.setItem("bfmSelectedGraph", "Outflow");
      this.setColorConfigForInOutFlowCharts([
        StyleColorChart.colors.orange800,
        StyleColorChart.colors.orange700,
        StyleColorChart.colors.orange600,
        StyleColorChart.colors.orange500,
        StyleColorChart.colors.orange400,
        StyleColorChart.colors.orange300,
        StyleColorChart.colors.orange200,
        StyleColorChart.colors.orange100,
        StyleColorChart.colors.orange50
      ])
      this.currentView = "outflow";
      this.showCashFlowChart = false
      this.enableDrillDownFlowChart = false;
      this.showLocationGrah = false;
      this.chartPageTitle = 'public.out-flow';
      this.loadOutflowCategoryAndSubCategoryGraphs();
    } else if (event === "show-income-details") {
      sessionStorage.setItem("bfmSelectedGraph", "Inflow");
      this.setColorConfigForInOutFlowCharts([
        StyleColorChart.colors.violet800,
        StyleColorChart.colors.violet700,
        StyleColorChart.colors.violet600,
        StyleColorChart.colors.violet500,
        StyleColorChart.colors.violet400,
        StyleColorChart.colors.violet300,
        StyleColorChart.colors.violet200,
        StyleColorChart.colors.violet100,
        StyleColorChart.colors.violet50,
      ])
      this.currentView = "inflow"
      this.showCashFlowChart = false
      this.enableDrillDownFlowChart = false;
      this.showLocationGrah = false;
      this.chartPageTitle = 'public.in-flow';
      this.loadInflowCategoryAndSubCategoryGraphs();
      this.loadLocationGraphs();
    }

  }

  onTitleButtonClick(event: any) {
    console.log(event);
    if (event === 'arrowTitle' && this.currentView === 'inflow') {
      this.onInflowDetailsClick("show-income-details")
    } else if (event === 'arrowTitle' && this.currentView === 'outflow') {
      this.onInflowDetailsClick("show-outcome-details")
    }
  }

  buildCategoryRequest(): TopByCategoryRequest {
    return {
      IBAN: (this.selectedAccount && this.selectedAccount.ibanNumber.trim().length > 0) ? this.selectedAccount.ibanNumber : null,
      periodType: Number(this.selectedPeriodType!.id),
      currency: this.getSelectedAccountCurrency(),
      noOfCats: 5
    }
  }

  buildSubCategoryRequest(category: string): TopBySubCategoryRequest {
    return {
      IBAN: null,
      periodType: Number(this.selectedPeriodType!.id),
      currency: this.getSelectedAccountCurrency(),
      noOfSubCats: 5,
      codes: category
    }
  }

  loadInflowCategoryAndSubCategoryGraphs(selectedCategory?: any, isSubCategory = false) {
    this.showOutcomeDetailsBtn.isDisable = false
    if (isSubCategory && selectedCategory) {
      this.showLocationGrah = false;
      this.showIncomeDetailsBtn.isDisable = false;
      this.chartPageTitle = selectedCategory;
      this.showArrow = true;
      this.showInflowChart = false;
      this.enableDrillDownFlowChart = isSubCategory;
      this.resetFlowGraphs();
      let codes = this.getCodeAgainstCategory(selectedCategory, true);
      this.accountsService.getTopSubCategory(this.buildSubCategoryRequest(codes)).subscribe(
        {
          next: (results) => {
            setTimeout(() => {
              this.buildInflowGraphData(results, isSubCategory)
            }, 1000);
          },
          error: (err: any) => {
            this.buildInflowGraphData({}, isSubCategory)
            console.log('Here is the error...', err.status);
          },
        });
    } else {
      this.showIncomeDetailsBtn.isDisable = true;
      this.showArrow = false;
      this.enableDrillDownFlowChart = isSubCategory;
      this.showInflowChart = false;
      this.resetFlowGraphs();

      this.accountsService.getTopByCategory(this.buildCategoryRequest()).subscribe(
        {
          next: (results) => {
            this.cashInFlowDataResponse = results;
            this.buildInflowGraphData(results, isSubCategory)
          },
          error: (err: any) => {
            this.buildInflowGraphData({}, isSubCategory)
            console.log('Here is the error...', err.status);
          },
        });
    }

  }

  buildInflowGraphData(result: any, isSubCategory = false) {
    if (result && result.income.length > 0) {
      let totalAmount = 0
      for (const income of result.income) {
        totalAmount += income.total;
        this.inOutflowBarChartData.labels!.push(isSubCategory ? income.subCategoryName : income.categoryName);
        this.inOutflowBarChartData.datasets[0].data.push(income.total);
        this.inOutflowDoughnutChartData.labels!.push(isSubCategory ? income.subCategoryName : income.categoryName);
        this.inOutflowDoughnutChartData.datasets[0].data.push(income.total);
      }
      this.setChartTotalAmmount(totalAmount, this.chartAmmoutOptions);
    }
    this.showInflowChart = true;

    if (this.inOutflowBarChartData.labels!.length === 0) {
      this.showTryAgain = true;
    } else {
      this.showTryAgain = false;
    }
  }


  loadOutflowCategoryAndSubCategoryGraphs(selectedCategory?: any, isSubCategory = false) {

    this.showIncomeDetailsBtn.isDisable = false;
    let result = null
    if (isSubCategory && selectedCategory) {
      this.showOutcomeDetailsBtn.isDisable = false;
      this.chartPageTitle = selectedCategory;
      this.showArrow = true;
      this.showInflowChart = false;
      this.enableDrillDownFlowChart = isSubCategory;
      this.resetFlowGraphs();
      let codes = this.getCodeAgainstCategory(selectedCategory);
      this.accountsService.getTopSubCategory(this.buildSubCategoryRequest(codes)).subscribe(
        {
          next: (results) => {
            setTimeout(() => {
              this.buildOutflowGraphData(results, isSubCategory)
            },
              1000);

          },
          error: (err: any) => {
            this.buildOutflowGraphData({}, isSubCategory)
            console.log('Here is the error...', err.status);
          },
        });

    } else {
      this.showOutcomeDetailsBtn.isDisable = true;
      this.showArrow = false;
      this.enableDrillDownFlowChart = isSubCategory;
      this.showInflowChart = false;
      this.resetFlowGraphs();

      this.accountsService.getTopByCategory(this.buildCategoryRequest()).subscribe(
        {
          next: (results) => {
            this.cashInFlowDataResponse = results;
            this.buildOutflowGraphData(results, isSubCategory)
          },
          error: (err: any) => {
            this.buildOutflowGraphData({}, isSubCategory)
            console.log('Here is the error...', err.status);
          },
        });
    }

  }

  buildOutflowGraphData(result: any, isSubCategory = false) {
    if (result && result.expense) {
      let totalAmount = 0
      for (const expense of result.expense) {
        totalAmount += expense.total < 0 ? (-1 * expense.total) : expense.total;
        this.inOutflowBarChartData.labels!.push(isSubCategory ? expense.subCategoryName : expense.categoryName);
        this.inOutflowBarChartData.datasets[0].data.push(expense.total < 0 ? (-1 * expense.total) : expense.total);
        this.inOutflowDoughnutChartData.labels!.push(isSubCategory ? expense.subCategoryName : expense.categoryName);
        this.inOutflowDoughnutChartData.datasets[0].data.push(expense.total < 0 ? (-1 * expense.total) : expense.total);
      }
      this.setChartTotalAmmount(totalAmount, this.chartAmmoutOptions);
    }
    this.showInflowChart = true;

    if (this.inOutflowBarChartData.labels!.length === 0) {
      this.showTryAgain = true;
    } else {
      this.showTryAgain = false;
    }
  }

  buildLocationRequest(): POSLocation {
    return {
      IBAN: (this.selectedAccount && this.selectedAccount.ibanNumber.trim().length > 0) ? this.selectedAccount.ibanNumber : null,
      periodType: Number(this.selectedPeriodType!.id),
      currency: this.getSelectedAccountCurrency(),
      noOfCities: 5
    }
  }

  async loadLocationGraphs() {
    this.showLocationGrah = false;
    this.locationDoughnutChartData.labels = []
    this.locationDoughnutChartData.datasets[0].data = []
    const result = await lastValueFrom(
      this.accountsService.getPOSLocation(this.buildLocationRequest()).pipe(take(1))
    );
    if (result && Array.isArray(result) && result.length > 0) {
      let totalAmount = 0
      for (const income of result) {
        totalAmount += income.total;
        this.locationDoughnutChartData.labels!.push(income.city);
        this.locationDoughnutChartData.datasets[0].data.push(income.total);
      }
      this.setChartTotalAmmount(totalAmount, this.locationChartAmmoutOptions);
      this.showLocationGrah = true;
    }
  }

  setChartTotalAmmount(totalAmount: Number, chartAmmoutOptions: ChartAmountOptions) {
    if (totalAmount > 0) {
      chartAmmoutOptions.amount = totalAmount.toString();
      chartAmmoutOptions.showAmount = true;
      chartAmmoutOptions.currency = this.selectedAccount ? this.selectedAccount.currency : '608';
    } else {
      chartAmmoutOptions.showAmount = false;
    }
  }

  resetFlowGraphs() {
    this.inOutflowBarChartData.labels = []
    this.inOutflowBarChartData.datasets[0].data = []
    this.inOutflowDoughnutChartData.labels = []
    this.inOutflowDoughnutChartData.datasets[0].data = []
  }

  onTryAgainClick(event: any) {
    this.router
      .navigate(['/accounts/bfm'])
      .then(() => {
      });
  }

  getCodeAgainstCategory(category: string, income: boolean = false, isSubCategory: boolean = false): string {
    let result: any = null
    if (!income && this.cashInFlowDataResponse && this.cashInFlowDataResponse.expense) {
      result = this.cashInFlowDataResponse.expense.filter(obj => {
        if (!isSubCategory) {
          return obj.categoryName && obj.categoryName === category
        } else {
          return obj.subCategoryName && obj.subCategoryName === category
        }
      })
    } else if (income && this.cashInFlowDataResponse && this.cashInFlowDataResponse.income) {
      result = this.cashInFlowDataResponse.income.filter(obj => {
        if (!isSubCategory) {
          return obj.categoryName && obj.categoryName === category
        } else {
          return obj.subCategoryName && obj.subCategoryName === category
        }
      })
    }
    return result.length > 0 ? result[0].codes : undefined;
  }

  setColorConfigForInOutFlowCharts(colorList: string[]) {
    this.inOutflowBarChartData.datasets[0].backgroundColor = colorList;
    this.inOutflowBarChartData.datasets[0].hoverBackgroundColor = colorList
    this.inOutflowDoughnutChartData.datasets[0].backgroundColor = colorList;
    this.inOutflowDoughnutChartData.datasets[0].hoverBackgroundColor = colorList;
    this.inOutflowDoughnutChartData.datasets[0].borderColor = colorList;
    this.inOutflowDoughnutChartData.datasets[0].hoverBorderColor = colorList[0];
  }
}

type ChartAmountOptions = {
  showAmount: boolean
  amount: string
  currency: string
}
