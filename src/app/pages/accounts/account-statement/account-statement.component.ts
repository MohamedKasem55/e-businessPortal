import {Component} from '@angular/core';
import {ButtonModel} from "arb-design-library/model/button.model";
import {
  getPageTitle,
  getSelectAccountControl,
  getStatementTable,
  getTableTitle,
  getTrnxDtlsPopup,
  getTrnxFilterPopup
} from "./account-statement.component.controls";
import {TranslateService} from "@ngx-translate/core";
import {FormModel} from "../../../@core/model/dto/formModel";
import {AccountsService} from "../../../@core/service/accounts/accounts.service";
import {AccountsReq} from "../../../@core/model/rest/accounts/accounts-req";
import {Account} from "../../../@core/model/rest/common/account";
import {AccountStatementReq} from "../../../@core/model/rest/accounts/account-statement-req";
import {Router} from "@angular/router";
import {ModelAndListService} from "../../../@core/service/base/modelAndList.service";
import {PaginationValueModel} from "arb-design-library/model/pagination.model";
import {TableControl} from "../../../@core/model/dto/control/table-control";
import {PopupService} from "../../../@core/service/base/popup.service";
import {PopupInputModel} from "../../../@core/model/dto/popup.model";
import {StatementReq} from "../../../@core/model/rest/accounts/statement-req";
import {TableButtonOutputModel} from "arb-design-library/model/table-button-output.model";
import {DatePipe} from "@angular/common";
import {ServiceLocator} from "../../../@core/service/base/service-locator.service";
import {BreadcrumbService} from "../../../@core/service/base/breadcrumb.service";
import {BfmBaseRequest} from "../../../@core/model/rest/accounts/bfm/bfm-base-request";
import {ChartConfiguration, ChartOptions} from "chart.js";
import {AccountsConstants} from "../../../@core/service/accounts/accounts-constants";
import {AccountsCommonService} from "../../../@core/service/accounts/accounts-common.service";
import {Utils} from "../../../@core/utility/Utils";
import {AuthenticationUtils} from "../../../@core/utility/authentication-utils";
import { AccountDetailsRes } from 'app/@core/model/rest/accounts/account-details-res';
import { AccountDetailsReq } from 'app/@core/model/rest/accounts/account-details-req';
import { SummaryItemControl } from 'app/@core/model/dto/control/sumery-item-control';
import { AnyFn } from '@ngrx/store/src/selector';
import { ButtonControl } from 'app/@core/model/dto/control/button-control';
import { EmptyControl } from 'app/@core/model/dto/control/empty-control';
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html'
})
export class AccountStatementComponent {
  selectedPeriodType = {id: 2, text: "accounts.curr-month"}
  pageTitleButtons: ButtonModel[] = [];
  onlineStatement: ButtonModel[] = [];
  tableForm: FormModel[] = [];
  selectAccountControl: FormModel[] = [];
  selectedAccount!: Account;
  company: any;
  accountStmtDetailsMapObj:any={}

  showChart = false
  actualReq: BfmBaseRequest = {
    IBAN: null,
    periodType: 2,
    currency: "SAR",
  }
  lineChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        type: "line",
        data: [],
        fill: true,
        tension: 0.5,
        backgroundColor: 'rgba(166, 185, 255, 1)',
        borderColor: 'rgba(77, 114, 255, 1)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBackgroundColor: 'rgba(77, 114, 255, 1)',
        pointHoverBorderColor: 'rgba(255, 255, 255, 1)'
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
  selectedStatement: any;
  private breadcrumbService: BreadcrumbService;
  eligibleJuridicalState = AuthenticationUtils.isSolePropertyCompany;
  filterForm = getTrnxFilterPopup()
  fromAmount: null | string = null;
  toAmount: null | string = null;
  toDate: string = "";
  fromDate: string = "";
  filterBy: string = "000";
  typeTransaction = "0";

  constructor(private translate: TranslateService,
              private router: Router,
              private datePipe: DatePipe,
              private accountsService: AccountsService,
              private accountsCommonService: AccountsCommonService,
              private popupService: PopupService,
              private modelAndListService: ModelAndListService) {
    this.company = JSON.parse(sessionStorage.getItem('company')!)
    this.selectAccountControl.push(getSelectAccountControl())
    this.pageTitleButtons = getPageTitle();
    this.onlineStatement = getTableTitle();
    this.tableForm.push(getStatementTable());
    (this.tableForm[0].controls[`accountStatement`] as TableControl).onFilterClick?.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.modelAndListService.getModel('filterType').subscribe((res) => {
          const filterTypeList: any[] = Utils.getOrderFilterType(res.filterType);
          this.filterForm.form!.controls['searchBy'].controlOptions.options = filterTypeList;
          this.filterClick()
        })
      })

    this.selectAccountControl[0].controls['selectAccount']
      .valueChanges.pipe(takeUntil(this.destroy$)).subscribe((accountSelected) => {
      this.selectedAccount = accountSelected.value;
      this.getStatements({page: 1, size: 10});
    });
    (this.tableForm[0].controls['accountStatement'] as TableControl)
      .buttonClicked?.pipe(takeUntil(this.destroy$)).subscribe(
      (row) => {
        if (row.buttonId === "description") {
          this.showDetailsModal(row)
        }
      });

    (this.tableForm[0].controls['accountStatement'] as TableControl)
      .externalPagination?.pipe(takeUntil(this.destroy$)).subscribe((page: PaginationValueModel) => {
      this.getStatements(page);
    });

    this.getAllEligibleAccounts();
    this.breadcrumbService = ServiceLocator.injector.get(BreadcrumbService);
    this.breadcrumbService.setBreadcrumb([{
      text: 'accounts.acc',
      url: '/accounts'
    }, {
      text: 'accounts.online-statement',
      url: '/accounts/statement'
    }]);

    this.modelAndListService.getList(["accountStmtDetailsFieldName"]).subscribe((model:any) => {
      this.accountStmtDetailsMapObj=model.accountStmtDetailsFieldName
    })
  }

  selectPeriodType() {
    this.selectedPeriodType = AccountsConstants.PERIOD_TYPES.filter((periodType) => {
      return periodType.id !== this.selectedPeriodType.id;
    })[0];
    this.actualReq.periodType = this.selectedPeriodType.id;
    this.getBfmChartData();
  }

  onTitleButtonsClick(titleButtonId: string) {
    if (titleButtonId === 'payments')
      this.router.navigate(['/payments']).then();
    if (titleButtonId === 'transfers')
      this.router.navigate(['/transfer']).then();
    if (titleButtonId === 'arrowTitle')
      this.router.navigate(['/accounts']).then();
    if (titleButtonId === 'nickname')
      this.router.navigate(['/accounts/nickname'], {state: {selectedAccount: this.selectedAccount}});
  }

  onCopyPress(icon: string, ibanNumber: string) {
    navigator.clipboard.writeText(ibanNumber).then().catch(e => console.log(e));
  }

  formatHour(time: any) {
    let time24H = this.datePipe.transform(time, 'H:mm')
    return (time24H) ? time24H : ""
  }

  filterClick() {
    this.popupService.showPopup(this.filterForm).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.fromAmount = null;
      this.toAmount = null;
      this.fromDate = "";
      this.toDate = "";
      this.filterBy = "000";
      this.typeTransaction = "0";

      if (res.buttonId === 'close') {
        this.popupService.dismiss();
      }
      if (res.buttonId === 'reset') {
        this.filterForm.form?.controls["amountFrom"].setValue(null)
        this.filterForm.form?.controls["amountTo"].setValue(null)
        this.filterForm.form?.controls["fromDate"].setValue(null)
        this.filterForm.form?.controls["toDate"].setValue(null)
        this.filterForm.form?.controls["searchBy"].setValue(null)
        this.filterForm.form?.controls["transType"].setValue(null)

        this.getStatements({page: 1, size: 10});
        this.popupService.dismiss();
      }
      if (res.buttonId === 'search') {
        this.fromAmount = (this.filterForm.form?.controls["amountFrom"].value) ?
          this.filterForm.form?.controls["amountFrom"].value : null;

        this.toAmount = (this.filterForm.form?.controls["amountTo"].value) ?
          this.filterForm.form?.controls["amountTo"].value : null;

        this.fromDate = (this.filterForm.form?.controls["fromDate"].value) ?
          this.filterForm.form?.controls["fromDate"].value.year + '-' +
          this.filterForm.form?.controls["fromDate"].value.month + '-' +
          this.filterForm.form?.controls["fromDate"].value.day : "";

        this.toDate = (this.filterForm.form?.controls["toDate"].value) ?
          this.filterForm.form?.controls["toDate"].value.year + '-' +
          this.filterForm.form?.controls["toDate"].value.month + '-' +
          this.filterForm.form?.controls["toDate"].value.day : "";

        this.filterBy = (this.filterForm.form?.controls["searchBy"].value) ?
          this.filterForm.form?.controls["searchBy"].value.key : "000";

        this.typeTransaction = (this.filterForm.form?.controls["transType"].value) ?
          this.filterForm.form?.controls["transType"].value.key : "0";

        this.getStatements({page: 1, size: 10});
        this.popupService.dismiss();
      }
    })
  }

  onDownloadClick() {
    const req: AccountStatementReq = {
      accountNumber: this.selectedAccount.fullAccountNumber,
      billType: null,
      dateFrom: "",
      dateTo: "",
      filterBy: "000",
      govPay: null,
      govPayType: null,
      page: null,
      rows: null,
      statementsOrder: 0,
      typeTransaction: "0"
    };
    this.accountsService.getAccountStatementPDF(req).subscribe((response) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(response);
      link.download = this.selectedAccount.fullAccountNumber + "_statement";
      link.click();
      link.remove();
    })
  }

  private getBfmChartData() {
    this.showChart = false;
    this.lineChartData.labels = [];
    this.lineChartData!.datasets[0].data = [];
    this.actualReq.IBAN = this.selectedAccount.ibanNumber;
    this.accountsCommonService.getActualExpected(this.actualReq).subscribe({
        next: (value) => {
          this.totalCashFlow = value.actual.income.total - value.actual.expense.total;
          this.accountsCommonService.getBalanceAndCashFlow(this.actualReq).subscribe({
            next: (response) => {
              for (const res of response.cashFlow) {
                this.eligibleJuridicalState = true;
                this.lineChartData.labels!.push(res.dateTime);
                this.lineChartData!.datasets[0].data.push(res.cashFlow);
              }
              this.showChart = true;
            }
          })
        }
      }
    )

  }

  private getStatements(page: PaginationValueModel) {
    const req: AccountStatementReq = {
      accountNumber: this.selectedAccount.fullAccountNumber,
      amountFrom: this.fromAmount,
      amountTo: this.toAmount,
      dateFrom: this.fromDate,
      dateTo: this.toDate,
      filterBy: this.filterBy,
      billType: null,
      govPay: null,
      govPayType: null,
      page: page.page,
      rows: page.size,
      statementsOrder: 0,
      typeTransaction: this.typeTransaction
    };

    this.accountsService.getAccountStatement(req).subscribe({
        next: (statements) => {
          this.modelAndListService.getModel("channelType").subscribe((res) => {

            for (const d of statements.accstmtDTO.items) {
              d.debit = d.amount < 0 ? d.amount : ''
              d.credit = d.amount > 0 ? d.amount : ''
              d.dateGroup = d.date.replace(/-/g, "")
              d.hour = this.formatHour("2000-01-01 " + d.time)
              d.date = d.date + ' ' + d.time
              d.txId = d.txId +'+'+ d.hour + d.hijraDate + d.date
            }

            this.tableForm[0].controls['accountStatement'].controlOptions.data = statements.accstmtDTO.items;
            this.tableForm[0].controls['accountStatement'].controlOptions.total = statements.accstmtDTO.total;
            this.tableForm[0].controls['accountStatement'].controlOptions.headers[3].mapObject = res['channelType'];

          })
        },
        error: () => {
          this.tableForm[0].controls['accountStatement'].controlOptions.data = [];
        }
      }
    );
  }

  private getAllEligibleAccounts() {
    let accountsReq: AccountsReq = {
      order: "",
      orderType: "",
      page: 1,
      rows: null,
      txType: "ECAL"
    };
    this.accountsCommonService.getAllEligibleAccounts(accountsReq).subscribe({
      next: (res) => {
        this.selectAccountControl[0].controls['selectAccount'].controlOptions.options = res.listAccount;
        if (history.state.selectedRow) {
          this.selectAccountControl[0].controls['selectAccount'].setValue(history.state.selectedRow)
          this.selectedAccount = history.state.selectedRow;
        } else {
          this.selectAccountControl[0].controls['selectAccount'].setValue(res.listAccount[0])
          this.selectedAccount = res.listAccount[0]
        }
        if (this.eligibleJuridicalState) {
          this.getBfmChartData();
        }
        this.getStatements({page: 1, size: 10})
      },
      error: () => {
      },
    });
  }

getDetailsReq(row: TableButtonOutputModel):AccountDetailsReq{
      const startIndex = row.row.txId.indexOf("+");
    return {
      accountNumber:this.selectedAccount.fullAccountNumber,
      statment: {...row.row, txId: row.row.txId.substring(0,startIndex)}
    }
  }

  showDetailsModal(row: TableButtonOutputModel) {

    this.accountsService.accountDetails(this.getDetailsReq(row)).subscribe((res: any) => {
      let data: PopupInputModel = getTrnxDtlsPopup();
      data.title = 'accounts.transaction-dtls';
      data.form!.controls['remarks'].label = this.translate.instant('accounts.remark');
      data.form!.controls['remarks'].setValue(row.row.remarks)
      row.row.date = row.row.date.split(' ')[0];

      Object.keys(res.accountStmtDetail).forEach((key:any) => {
        if (key.includes('Code')) {
          if(res.accountStmtDetail[key].length>0){
            data.form?.addControl(key,new SummaryItemControl({
              order: 2, columnCount: 4,
              label: this.accountStmtDetailsMapObj[res.accountStmtDetail[key]],
            }))
          }
        }
        if (key.includes('Value')) {
          if(res.accountStmtDetail[key.replace('Value', 'Code')].length>0){
            data.form?.controls[key.replace('Value', 'Code')].setValue(res.accountStmtDetail[key])
          }
        }

      });

      data.form?.addControl('empty',new SummaryItemControl({
        order: 2,
        columnCount: 12,
        label: '',
      }))
      data.form?.addControl('print',new ButtonControl({
        order: 2,
        columnCount: 4,
        controlOptions: {
          id: "print",
          type: 'secondary',
          text: "public.print",
          prefixIcon: 'arb-icon-Printer'
        }
      }))
      data.form?.addControl('pdf',new ButtonControl({
        order: 2,
        columnCount: 4,
        controlOptions: {
          id: "pdf",
          type: 'secondary',
          text: "public.pdf",
          prefixIcon: 'arb-icon-pdf'
        }
      }))
      data.form?.addControl('email',new ButtonControl({
        order: 2,
        columnCount: 4,
        controlOptions: {
          id: "email",
          type: 'secondary',
          text: "public.email",
          prefixIcon: 'arb-icon-envelope'
        }
      }))
      this.popupService.showPopup(data).subscribe((res) => {
        row.row.date = row.row.date.split(" ")[0];
        const startIndex = row.row.txId.indexOf("+");
        row.row.txId = row.row.txId.substring(0,startIndex);
        let emailStatementReq: StatementReq = {
          accountNumber: this.selectedAccount.fullAccountNumber,
          accountStmt: row.row
        }
        switch (res.buttonId) {
          case "print":
            this.accountsService.getStatementPDF(emailStatementReq).subscribe((res: any) => {
              const fileURL = URL.createObjectURL(res);
              window.open(fileURL, '_blank');
            })
            break;
          case "pdf":
            this.accountsService.getStatementPDF(emailStatementReq).subscribe((res) => {
              const link = document.createElement("a");
              link.href = URL.createObjectURL(res);
              link.download = "detailed-statement";
              link.click();
              link.remove();
            })
            break;
          case "email":
            this.accountsService.sendStatementEmail(emailStatementReq).subscribe(() => {
              data.alert = {
                id: "email-sent-id",
                type: "Success",
                showClose: false,
                message: "accounts.success-email"
              }
              data.showAlert = true;
            })
            break;
        }
      });
      this.selectedStatement = row.row;


  })

  }

  destroy$ = new Subject();

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

}
