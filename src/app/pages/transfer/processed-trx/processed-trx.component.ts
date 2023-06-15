import {Component, OnInit} from '@angular/core';
import {ModelAndListService} from 'app/@core/service/base/modelAndList.service';
import {
  ProcessedTransactionsService
} from 'app/@core/service/transfer/processed-transactions/processed-transactions.service';
import {TableHeaderModel} from 'arb-design-library/model/table-header.model';
import {TitleModel} from 'arb-design-library/model/title.model';
import {take} from 'rxjs';
import {PaginationValueModel} from 'arb-design-library/model/pagination.model';
import {TableButtonOutputModel} from 'arb-design-library/model/table-button-output.model';
import {Router} from '@angular/router';
import {PopupService} from 'app/@core/service/base/popup.service';
import {FormModel} from 'app/@core/model/dto/formModel';
import {PopupOutputModel} from 'app/@core/model/dto/popup.model';
import {
  getProcessedTrxSectionTitleModel,
  getProcessedTrxTableHeader,
  getProcessedTrxTitleModel,
  getSearchForm
} from './processed-trx-controls';
import {ProcessedTransactionsReq} from 'app/@core/model/rest/processed-transactions/list-req';
import {Utils} from "../../../@core/utility/Utils";
import {AuthenticationUtils} from "../../../@core/utility/authentication-utils";

@Component({
  selector: 'processed-trx',
  templateUrl: './processed-trx.component.html',
})
export class ProcessedTrxComponent implements OnInit {

  pageTitle: TitleModel = getProcessedTrxTitleModel();
  sectionTitle: TitleModel = getProcessedTrxSectionTitleModel();
  searchForm: FormModel = getSearchForm();

  processedTransactionsList!: any[];
  headers: TableHeaderModel[] = [];
  total: number = 0;
  transferTypeList: object = {};
  countryNameList: object = {};
  transferStatusList: object = {};
  currencyList: object = {};
  accountsList: any[] = [];
  UsersList: any[] = [];
  reqParams: ProcessedTransactionsReq = {page: 1, rows: 10};
  showPendingActions: boolean = AuthenticationUtils.showPendingActions;

  constructor(
    private service: ProcessedTransactionsService,
    private modelAndListService: ModelAndListService,
    private router: Router,
    private popupService: PopupService
  ) {

  }

  ngOnInit(): void {
    Utils.setBreadcrumb([
      {
        text: 'transfer.transfer',
        url: '/transfer'
      },
      {
        text: 'transfer.processedTrnx.name',
        url: ''
      }
    ])
    this.modelAndListService.getList(['transferPaymentType',
      'transferStatus',
      'errors', 'backEndCountryCode', 'countryName', 'currency']).subscribe((data) => {
      const countryCode = data['backEndCountryCode'];
      const errorTable = Utils.getErrorsWithoutErrorTable(data['errors']);
      const transferType = data['transferPaymentType'];
      transferType['1']='transfer.processedTrnx.transferRahji'
      this.transferTypeList = transferType;
      this.countryNameList = data['countryName'];
      this.transferStatusList = data['transferStatus'];
      this.currencyList = data['currency'];
      this.service.getAccountsComboData({order: "", orderType: "", page: 1, rows: 100, txType: "ECIA"}).subscribe({
        next: (res) => {
          this.accountsList = res;
        }
      });
      this.service.getUsersComboData().subscribe({next: res => this.UsersList = res});
      this.headers = getProcessedTrxTableHeader(transferType, countryCode, errorTable);
    });
    this.getProcessedTransactions();
  }

  getProcessedTransactions() {
    this.service.getProcessedTransactionsList(this.reqParams).pipe(take(1)).subscribe({
      next: (res) => {
        res.items.forEach(item => {
          if (!item["feesCurrency"]) {
            item["feesCurrency"] = "608";
          }
          item['sarCurrency'] = "608";
        });
        this.processedTransactionsList = res.items;
        this.total = res.total
      },
      error: () => {
        this.processedTransactionsList = [];
      }
    })
  }

  onTabelButtonClick(data: TableButtonOutputModel): void {
    this.router.navigateByUrl('/transfer/processed-trx-details', {state: {details: data}});
  }

  pagination(value: PaginationValueModel) {
    this.reqParams.page = value.page;
    this.reqParams.rows = value.size;
    this.getProcessedTransactions();
  }

  openSearch() {
    this.searchForm.controls['paymentType'].controlOptions.options = Object.entries(this.transferTypeList).map(entry => {
      return {"key": [entry[0]], "value": entry[1]};
    });
    this.searchForm.controls['country'].controlOptions.options = Object.entries(this.countryNameList).map(entry => {
      return {"key": [entry[0]], "value": entry[1]};
    });
    this.searchForm.controls["country"].valueChanges.subscribe((value: any) => {
      this.service.getBankNames({country: value['key'][0]}).subscribe(res => {
        this.searchForm.controls['beneficiaryBank'].controlOptions.options = res.banks
      });
    });
    this.searchForm.controls['status'].controlOptions.options = Object.entries(this.transferStatusList).map(entry => {
      return {"key": [entry[0]], "value": entry[1]};
    });
    this.searchForm.controls['currency'].controlOptions.options = Object.entries(this.currencyList).map(entry => {
      return {"key": [entry[0]], "value": entry[1]};
    });
    this.searchForm.controls['debitAccount'].controlOptions.options = this.accountsList;
    this.searchForm.controls['initiatedBy'].controlOptions.options = Object.entries(this.UsersList).map(entry => {
      return {"key": [entry[0]], "value": entry[1]};
    });
    this.searchForm.controls['ApprovedBy'].controlOptions.options = Object.entries(this.UsersList).map(entry => {
      return {"key": [entry[0]], "value": entry[1]};
    });

    this.popupService.showPopup({image: '', form: this.searchForm}).subscribe((res: PopupOutputModel) => {
      if (res.buttonId == "search") {
        this.reqParams = { page: 1, rows: 10 };
        let reqParams = this.reqParams;
        res.controls!["paymentType"].value ? reqParams.paymentType = res.controls!["paymentType"].value['key'][0] : null;
        res.controls!["debitAccount"].value ? reqParams.debitAccount = res.controls!["debitAccount"].value['value'] : null;
        res.controls!["country"].value ? reqParams.country = res.controls!["country"].value['key'][0] : null;
        res.controls!["beneficiaryBank"].value ? reqParams.debitAccount = res.controls!["beneficiaryBank"].value['value'] : null;
        res.controls!["amountRangeFrom"].value ? reqParams.amountFrom = res.controls!["amountRangeFrom"].value : null;
        res.controls!["amountRangeTo"].value ? reqParams.amountTo = res.controls!["amountRangeTo"].value : null;
        res.controls!["currency"].value ? reqParams.currency = res.controls!["currency"].value['key'][0] : null;
        res.controls!["status"].value ? reqParams.status = res.controls!["status"].value['key'][0] : null;
        res.controls!['lastApprovalDateFrom'].value
          ? (reqParams.lastApprovalDateFrom = Utils.getDateFormatted(
              res.controls['lastApprovalDateFrom']?.value,
              'yyyy-MM-dd'
            ))
          : null;
          res.controls!['lastApprovalDateTo'].value
            ? (reqParams.lastApprovalDateTo = Utils.getDateFormatted(
                res.controls['lastApprovalDateTo']?.value,
                'yyyy-MM-dd'
              ))
            : null;
        res.controls!["initiatedBy"].value ? reqParams.initiatedBy = res.controls!["initiatedBy"].value['key'][0] : null;
        res.controls!["ApprovedBy"].value ? reqParams.approvedBy = res.controls!["ApprovedBy"].value['key'][0] : null;
        this.reqParams = reqParams;
        this.getProcessedTransactions();
        this.popupService.dismiss();
      } else if (res.buttonId == "reset") {
        for (let key of Object.keys(this.searchForm.controls)) {
          if (key !== "searchButton" || 'reset' || "cancelButton") {
            this.searchForm.controls[key].setValue(null);
          }
        }
        this.reqParams = {page: 1, rows: 10};
        this.getProcessedTransactions();
        this.popupService.dismiss();

      } else {
        this.popupService.dismiss();
      }
    });
  }

  onButtonClick(key: string) {
    if (key === "arrowTitle")
      void this.router.navigate(['/transfer'])
    else if (key === "UserApprovalStatus")
      void this.router.navigate(['/transfer/approval'], {queryParams: {type: 'transfer'}})

  }
}
