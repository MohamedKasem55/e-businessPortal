import {Component} from '@angular/core';
import {
  getAccountListFilterPopupModel,
  getAccountsTable,
  getBoxes,
  getPageTitleButton,
  getTableTitle,
  vatPopupForm,
  vatSucessPopupForm
} from "./account-landing.component.controls";
import {ButtonModel} from "arb-design-library/model/button.model";
import {TranslateService} from "@ngx-translate/core";
import {FormModel} from "../../../@core/model/dto/formModel";
import {AccountsReq} from "../../../@core/model/rest/accounts/accounts-req";
import {ModelAndListService} from "../../../@core/service/base/modelAndList.service";
import {AccountsRes} from "../../../@core/model/rest/accounts/accounts-res";
import {CurrencyPipe} from "../../../@core/pipe/currency.pipe";
import {KeyValue} from "@angular/common";
import {BoxModel} from "arb-design-library/model/box.model";
import {Router} from "@angular/router";
import {PaginationValueModel} from "arb-design-library/model/pagination.model";
import {TableControl} from "../../../@core/model/dto/control/table-control";
import {AccountModel} from "arb-design-library/model/account.model";
import {BalanceModel} from "arb-design-library/model/balance.model";
import {BfmBaseRequest} from "../../../@core/model/rest/accounts/bfm/bfm-base-request";
import {AccountsConstants} from "../../../@core/service/accounts/accounts-constants";
import {ChartConfiguration, ChartOptions} from "chart.js";
import {ServiceLocator} from "../../../@core/service/base/service-locator.service";
import {BreadcrumbService} from "../../../@core/service/base/breadcrumb.service";
import {PopupService} from "../../../@core/service/base/popup.service";
import {Utils} from "../../../@core/utility/Utils";
import {KeyValueModel} from "../../../@core/model/rest/common/key-value.model";
import {AccountsCommonService} from "../../../@core/service/accounts/accounts-common.service";
import {StyleColorChart} from "../../../../styleColorChart";
import {PopupOutputModel} from 'app/@core/model/dto/popup.model';
import {ButtonControl} from 'app/@core/model/dto/control/button-control';
import {
  CompanyConfigurationService
} from 'app/@core/service/company-admin/company-configuration/company-configuration.service';
import {CompanyParametersReq} from 'app/@core/model/rest/company-admin/company-configuration/company-workflow-type-res';
import {AuthenticationUtils} from "../../../@core/utility/authentication-utils";
import {Subject, takeUntil} from "rxjs";
import { ThemeService } from 'app/theme';

@Component({
  selector: 'app-accounts-landing',
  templateUrl: './accounts-landing.component.html',
  styleUrls: ['./accounts-landing.component.scss']
})
export class AccountsLandingComponent {
  selectedPeriodType = {id: 2, text: "accounts.curr-month"}
  pageTitleButtons: ButtonModel[] = [];
  forms: FormModel[] = [];
  dashboardResponse!: AccountsRes;
  accountsCurrencies!: KeyValue<any, any>[];
  accountList: ButtonModel[] = [];
  boxDtls: BoxModel[] = [];
  balance!: BalanceModel;
  accounts: AccountModel[] = []
  eligibleJuridicalState = AuthenticationUtils.isSolePropertyCompany;

  showChart = false
  actualReq: BfmBaseRequest = {
    IBAN: null,
    periodType: 2,
    currency: "SAR",
  }
  lineChartData: ChartConfiguration<any>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        type: "line",
        fill: true,
        tension: 0.5,
        backgroundColor: "",
        borderColor: "",
        pointBorderColor: "",
        pointBackgroundColor: "",
        pointHoverBackgroundColor: "",
        pointHoverBorderColor: "",
      }
    ],

  };
  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    }
  };
  totalCashFlow!: number;
  breadcrumbService!: BreadcrumbService;
  currencyList!: KeyValueModel[];
  branchesList!: KeyValueModel[];
  warraningImage = "assets/img/warning.svg"
  vatPopupForm: FormModel = vatPopupForm()


  constructor(private translate: TranslateService,
              private modelService: ModelAndListService,
              private accountsService: AccountsCommonService,
              private companyConfigService: CompanyConfigurationService,
              private popupService: PopupService,
              private currencyPipe: CurrencyPipe,
              private router: Router,
              private themeService: ThemeService
  ) {
    this.drawPageAndSubscribeEvents();
    this.setLineCahrtColorConfig();
  }

  setLineCahrtColorConfig() {
    
    this.lineChartData.datasets[0].backgroundColor = this.themeService.getActiveTheme().properties['--arb-transparent']
    this.lineChartData.datasets[0].borderColor = this.themeService.getActiveTheme().properties['--arb-primaryColor']
    this.lineChartData.datasets[0].pointBorderColor = this.themeService.getActiveTheme().properties['--arb-transparent']
    this.lineChartData.datasets[0].pointBackgroundColor = this.themeService.getActiveTheme().properties['--arb-transparent']
    this.lineChartData.datasets[0].pointHoverBackgroundColor = this.themeService.getActiveTheme().properties['--arb-primaryColor']
    this.lineChartData.datasets[0].pointHoverBorderColor = this.themeService.getActiveTheme().properties['--arb-primaryColor']
  }

  private drawPageAndSubscribeEvents() {

    this.drawPage();
    if (AuthenticationUtils.hasAccess('AccountsMenu')) {
      this.subscribeEvents();
    }

    const disclaimerList: [] = JSON.parse(sessionStorage.getItem('disclaimerList')!)
    if (!disclaimerList) {
      return
    }
    disclaimerList.forEach((item: any) => {
      if (item.type === 'vatTries' && item.show === true) {
        this.showVATPopup()
      }
    })
  }

  showVATPopup() {
    this.vatPopupForm?.controls['vatNumber']
      .valueChanges.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      console.log(res)
      if (res.value.length === 15) {
        this.vatPopupForm?.controls['proceedButton'].enable()
      }
    })
    this.popupService
      .showPopup({
        image: this.warraningImage,
        form: this.vatPopupForm,
      }).pipe(takeUntil(this.destroy$)).subscribe((res: PopupOutputModel) => {
      if (res.buttonId == 'close') {
        this.updateVATPopupStateInSessionStorage()
        this.popupService.dismiss();
      } else if (res.buttonId == 'notEligible') {
        this.companyConfigService.incrementTries({'name': 'VAT', 'notEligible': true}).subscribe(() => {
          this.popupService.dismiss();
        })
      } else if (res.buttonId == 'proceed') {
        const data: CompanyParametersReq = {
          vatNumber: this.vatPopupForm?.controls['vatNumber'].value,
        }
        this.popupService.dismiss();
        this.companyConfigService.updateCompanyParameters(data).subscribe((result) => {
          this.showVATSucessPopup();
        })
      } else {
        this.popupService.dismiss();
      }
    });
    this.vatPopupForm?.controls['proceedButton'].disable();
  }

  showVATSucessPopup() {
    this.popupService
      .showPopup({
        image: this.warraningImage,
        form: vatSucessPopupForm(),
      }).pipe(takeUntil(this.destroy$))
      .subscribe((res: PopupOutputModel) => {
        if (res.buttonId == 'finish') {
          this.popupService.dismiss();
          this.updateVATPopupStateInSessionStorage();
        } else {
          this.popupService.dismiss();
          this.updateVATPopupStateInSessionStorage();
        }
      });
  }

  updateVATPopupStateInSessionStorage() {
    const disclaimerList: [] = JSON.parse(sessionStorage.getItem('disclaimerList')!);
    disclaimerList.forEach((item: any) => {
      if (item.type === 'vatTries') {
        item.show = false
      }
    })
    sessionStorage.setItem('disclaimerList', JSON.stringify(disclaimerList))
  }

  private drawPage() {
    if (AuthenticationUtils.hasAccess('companyAdmin')) {
      this.pageTitleButtons = getPageTitleButton();
    }
    this.accountList = getTableTitle();
    this.boxDtls = getBoxes();
    this.breadcrumbService = ServiceLocator.injector.get(BreadcrumbService);
    this.breadcrumbService.setBreadcrumb([{
      text: 'accounts.acc',
      url: '/accounts'
    }]);
  }

  private subscribeEvents() {
    this.forms.push(getAccountsTable());
    (this.forms[0].controls['accounts'] as TableControl)
      .buttonClicked?.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.onAccountSelection(res)
    });
    (this.forms[0].controls['accounts'] as TableControl)
      .onFilterClick?.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.currencyList && this.branchesList && this.currencyList.length > 0 && this.branchesList.length > 0) {
        this.filterAccounts();
      } else {
        this.modelService.getList(["currency", "branchRbs5"]).subscribe({
          next: (models) => {
            for (let key of Object.keys(models)) {
              switch (key) {
                case "currency":
                  this.currencyList = Utils.getModelList(models[key])
                  break;
                case "branchRbs5":
                  this.branchesList = Utils.getModelList(models[key])
                  break;
              }
            }
            this.filterAccounts();
          }
        })
      }
    });
    this.getAllEligibleAccounts({page: 1, size: 10});
    (this.forms[0].controls['accounts'] as TableControl)
      .externalPagination?.pipe(takeUntil(this.destroy$)).subscribe((page: PaginationValueModel) => {
      this.getAllEligibleAccounts(page);
    })
  }

  getAllEligibleAccounts(page: PaginationValueModel, accountsReq?: AccountsReq) {
    let request: AccountsReq = {
      ...accountsReq,
      page: page.page,
      rows: page.size,
      txType: "ECAL"
    }
    this.accountsService.getAllEligibleAccounts(request, true).subscribe({
      next: (res) => {
        this.dashboardResponse = res;
        this.modelService.getModel('currency').subscribe({
          next: (currencies) => {
            this.accountsCurrencies =
              Object.keys(this.dashboardResponse.currencyBalance).map((key) => {
                let KeyValue: KeyValue<any, any> = {key: key, value: this.currencyPipe.transform(key)}
                return KeyValue;
              });
            if (this.eligibleJuridicalState) {
              this.getBfmChartData();
            }
            this.fillTable(currencies);
          }
        })
      },
      error: () => {
        this.forms[0].controls['accounts'].controlOptions.data = [];
      }
    })
  }

  onAccountSelection(rowDetails: any) {
    this.accountsService.selectedRow = rowDetails.row;
    this.router.navigate(['accounts/statement'], {state: {selectedRow: rowDetails.row}})
  }

  onBoxClick(boxId: string) {
    if (boxId === 'documents')
      this.router.navigate(['accounts/documents']).then();
    if (boxId === 'vat')
      this.router.navigate(['accounts/vat']).then();
    if (boxId === 'cheques')
      this.router.navigate(['cheques']).then();
  }

  private fillTable(currencies: any) {
    this.forms[0].controls['accounts'].controlOptions.data = this.dashboardResponse.listAccount;
    this.forms[0].controls['accounts'].controlOptions.total = this.dashboardResponse.total;
    this.forms[0].controls['accounts'].controlOptions.headers[4].mapObject = currencies['currency'];
  }

  selectPeriodType() {
    this.selectedPeriodType = AccountsConstants.PERIOD_TYPES.filter((periodType) => {
      return periodType.id !== this.selectedPeriodType.id;
    })[0];
    this.actualReq.periodType = this.selectedPeriodType.id;
    this.getBfmChartData();
  }

  private getBfmChartData() {
    this.showChart = false;
    this.lineChartData.labels = [];
    this.lineChartData!.datasets[0].data = [];
    this.accountsService.getActualExpected(this.actualReq).subscribe({
        next: (value) => {
          this.totalCashFlow = value.actual.income.total - value.actual.expense.total;
          this.accountsService.getBalanceAndCashFlow(this.actualReq).subscribe({
            next: (response) => {
              for (const res of response.cashFlow) {
                this.eligibleJuridicalState = true;
                this.lineChartData.labels!.push(res.dateTime);
                this.lineChartData!.datasets[0].data.push(res.cashFlow);
              }
              this.showChart = true;
            }
          })
        },
        error: () => {
          this.showChart = true;
        }
      }
    )

  }

  doButtonClick(id: any) {
    if (id === "arrowTitle") {
      this.router.navigate(['/dashboard'])
      this.breadcrumbService.setBreadcrumb([]);
    } else if (id === 'open-new-acc') {
      this.router.navigate(['/accounts/add-account'])
      this.breadcrumbService.setBreadcrumb([]);
    }
  }

  private filterAccounts() {
    this.popupService
      .showPopup(getAccountListFilterPopupModel(this.translate, this.currencyList, this.branchesList))
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {

        if (response.buttonId === 'close') {
          this.popupService.dismiss();
        } else if (response.buttonId === 'reset') {
          this.getAllEligibleAccounts({page: 1, size: 10});
          this.popupService.dismiss();
        } else if (response.buttonId === 'search') {
          let accountsReq: AccountsReq = {
            page: 1,
            rows: 10,
            txType: "ECAL"
          }
          if (response.controls['nickname'].value.length > 0) {
            accountsReq = {
              accountNickname: response.controls['nickname'].value,
              page: 1,
              rows: 10,
              txType: "ECAL",
              search: true
            }
          }
          if (response.controls['branch'].value) {
            accountsReq = {
              ...accountsReq,
              branchid: response.controls['branch'].value.key,
              page: 1,
              rows: 10,
              txType: "ECAL",
              search: true
            }
          }
          if (response.controls['currency'].value) {
            accountsReq = {
              ...accountsReq,
              currency: response.controls['currency'].value.key,
              page: 1,
              rows: 10,
              txType: "ECAL",
              search: true
            }
          }
          this.getAllEligibleAccounts({page: 1, size: 10}, accountsReq);
          this.popupService.dismiss();
        }
      })
  }
  destroy$ = new Subject();
  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
