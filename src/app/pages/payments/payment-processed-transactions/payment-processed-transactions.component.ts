import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { FormModel } from 'app/@core/model/dto/formModel';
import { PopupInputModel, PopupOutputModel } from 'app/@core/model/dto/popup.model';
import {
  BillProcessedTransactionsReq
} from 'app/@core/model/rest/payments/bill-processed-transactions/bill-processed-transactions-req';
import {
  EsalProcessedTransactionsReq
} from 'app/@core/model/rest/payments/esal-payment/esal-processed-transactions/esal-processed-transactions-req';
import {
  GovProcessedTransactionsReq
} from 'app/@core/model/rest/payments/government/gov-processed-transactions/gov-processed-transactions-req';
import { BreadcrumbService } from 'app/@core/service/base/breadcrumb.service';
import { ModelAndListService } from 'app/@core/service/base/modelAndList.service';
import { PopupService } from 'app/@core/service/base/popup.service';
import { AddBillService } from 'app/@core/service/payments/add-bill/add-bill.service';
import {
  BillProcessedTransactionsService
} from 'app/@core/service/payments/bill-processed-transactions/bill-processed-transactions.service';
import {
  EsalProcessedTransactionsService
} from 'app/@core/service/payments/esal-payment/esal-processed-transactions/esal-processed-transactions.service';
import {
  GovProcessedTransactionsService
} from 'app/@core/service/payments/government/gov-processed-transactions/gov-processed-transactions.service';
import {
  ProcessedTransactionsService
} from 'app/@core/service/transfer/processed-transactions/processed-transactions.service';
import { TableHeaderType } from 'arb-design-library';
import { PaginationValueModel } from "arb-design-library/model/pagination.model";
import { TabModel } from "arb-design-library/model/tab.model";
import { TableHeaderModel } from 'arb-design-library/model/table-header.model';
import { take } from 'rxjs';
import { SelectionTypeNamesP, SelectionTypeNamesR } from '../government-payment/government-payment-controls';
import { MOI_PAYMENTS_FORMS_FIELDS_CONFIGS } from '../government-payment/MOI_payment';
import { MOI_REFUNDS_FORMS_FIELDS_CONFIGS } from '../government-payment/MOI_refund';
import {
  getBillSearchForm,
  getDetailForm,
  getEsalSearchForm,
  getGovSearchForm
} from './payment-processed-transactions-controls';
import { Utils } from "../../../@core/utility/Utils";
import { TableButtonOutputModel } from 'arb-design-library/model/table-button-output.model';


@Component({
  selector: 'app-payment-processed',
  templateUrl: './payment-processed-transactions.component.html',
  styleUrls: []
})
export class PaymentProcessedTransactionsComponent implements OnInit {

  tabs: TabModel[] = [];
  type: string = "";
  headers: TableHeaderModel[] = [];
  data: any[] | undefined;
  total: number = 0;
  detailsForm: PopupInputModel = getDetailForm();
  billSearchForm: FormModel = getBillSearchForm();
  billProcessedReq!: BillProcessedTransactionsReq;
  govSearchForm: FormModel = getGovSearchForm();
  govProcessedReq!: GovProcessedTransactionsReq;
  esalSearchForm: FormModel = getEsalSearchForm();
  esalProcessedReq!: EsalProcessedTransactionsReq;
  dropsData: any;
  exportFileName: string = '';

  constructor(private router: Router, private translate: TranslateService, private route: ActivatedRoute, private location: Location, private addBillService: AddBillService, private processedTransactionsService: ProcessedTransactionsService,
              private modelAndListService: ModelAndListService, private govProcessedTransactionsService: GovProcessedTransactionsService, private esalProcessedTransactionsService: EsalProcessedTransactionsService,
              private popupService: PopupService, private billProcessedTransactionsService: BillProcessedTransactionsService, private breadcrumbService: BreadcrumbService) {
    this.setTabs();
  }

  onTableButtonClick(tableRow: TableButtonOutputModel): void {
    switch (tableRow.buttonId) {
      case 'idNumber':
        this.router.navigateByUrl("/payments/processed-details", { state: {row: tableRow} }).then(() => { });

        break;

    }
  }

  setTabs() {
    this.tabs.push({ text: "payments.processed.billTab", value: "bill" });
    this.tabs.push({
      text: "payments.processed.governmentPaymentsTab",
      value: "government-payments"
    });
    this.tabs.push({
      text: "payments.processed.governmentRefundsTab",
      value: "government-refunds"
    });
    this.tabs.push({ text: "payments.processed.esalTab", value: "esal" });
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe((params: any) => {
          this.tabChanged(params.type);
        }
      );

    this.breadcrumbService.setBreadcrumb([
      {
        text: "payments.payment",
        url: 'payments'
      },
      {
        text: "payments.processed.title",
        url: ''
      }]);
  }

  onTitleButtonClick(id: string) {
    if (id == 'arrowTitle') {
      this.router.navigateByUrl("/payments").then(() => {
      });
    }
  }

  getBillPayments() {
    this.modelAndListService.getList(['errors', 'processTransactionStatus']).subscribe(data => {
      const statusList = Utils.getErrorsWithErrorTable(data['errors'], this.translate);
      this.billSearchForm.controls["status"].controlOptions.options = Object.keys(data['processTransactionStatus']).map(key => {
        return { key: key, value: data['processTransactionStatus'][key] }
      });

      this.headers = [];
      let headers: TableHeaderModel[] = [];

      headers.push({
        title: "payments.bill-processed.biller-name",
        type: TableHeaderType.TEXT,
        fieldName: "description"
      });
      headers.push({ title: "payments.bill-processed.bill-nickname", type: TableHeaderType.TEXT, fieldName: "nickname" });
      headers.push({ title: "payments.bill-processed.bill-reference", type: TableHeaderType.TEXT, fieldName: "billRef" });
      headers.push({
        title: "payments.bill-processed.account-name",
        type: TableHeaderType.TEXT,
        fieldName: "accountAlias"
      });
      headers.push({
        title: "payments.bill-processed.account-number",
        type: TableHeaderType.TEXT,
        fieldName: "accountNumber"
      });
      headers.push({
        title: "payments.bill-processed.amount",
        type: TableHeaderType.AMOUNT_TEXT,
        fieldName: "amount",
        controlOptions: { currency: 'currency' }
      });
      headers.push({
        title: "payments.bill-processed.payment-type",
        type: TableHeaderType.TEXT,
        fieldName: "paymentType"
      });
      headers.push({
        title: "payments.bill-processed.status",
        type: TableHeaderType.TEXT,
        fieldName: "beStatus",
        mapObject: statusList
      });
      headers.push({
        title: "payments.bill-processed.initiated-by",
        type: TableHeaderType.TEXT,
        fieldName: "initiatedBy"
      });
      headers.push({
        title: "payments.bill-processed.initiated-date",
        type: TableHeaderType.DATE_TEXT,
        fieldName: "initiationDate",
        controlOptions: { format: 'dd/MM/yyyy' }
      });
      headers.push({ title: "payments.bill-processed.executed-by", type: TableHeaderType.TEXT, fieldName: "executedBy" });
      headers.push({
        title: "payments.bill-processed.executed-date",
        type: TableHeaderType.DATE_TEXT,
        fieldName: "executedDate",
        controlOptions: { format: 'dd/MM/yyyy' }
      });

      this.headers = headers;
    });

    this.addBillService.getProvidersDetails(false).subscribe((data) => {
      this.billSearchForm.controls["billers"].controlOptions.textField = this.translate.currentLang !== 'ar' ? 'addDescriptionEn' : 'addDescriptionAr';
      this.billSearchForm.controls["billers"].controlOptions.options = data.billCodesList.billsList;
    })
    this.processedTransactionsService.getAccountsComboData({
      order: "",
      orderType: "",
      page: 1,
      rows: 100,
      txType: "ECIA"
    }).subscribe((data) => {
      this.billSearchForm.controls["account"].controlOptions.options = data;
    })
    this.processedTransactionsService.getUsersComboData().subscribe((data) => {
      this.billSearchForm.controls["approvedBy"].controlOptions.options = Object.entries(data).map(entry => {
        return { "key": [entry[0]], "value": entry[1] };
      });
      this.billSearchForm.controls["initiatedBy"].controlOptions.options = Object.entries(data).map(entry => {
        return { "key": [entry[0]], "value": entry[1] };
      });
    })
  }

  openSearch() {
    switch (this.type) {
      case "bill":
        this.openBillSearch()
        break;
      case "government-payments":
      case "government-refunds":
        this.openGovSearch()
        break;
      case "esal":
        this.openEsalSearch()
        break;
    }
  }

  openGovSearch() {
    this.popupService.showPopup({ image: '', form: this.govSearchForm }).subscribe((res: PopupOutputModel) => {
      if (res.buttonId == "search") {
        this.popupService.dismiss();
        this.setGovProcessedReq({
          page: 1,
          rows: 50,
          accountNumber: res.controls['account'].value ? res.controls['account'].value.value : null,
          amountFrom: res.controls!["paidFrom"].value ? res.controls!["paidFrom"].value : null,
          amountTo: res.controls!["paidTo"].value ? res.controls!["paidTo"].value : null,
          approvedBy: res.controls!["approvedBy"].value ? res.controls!["approvedBy"].value.value : null,
          serviceType: res.controls!["serviceType"].value ? res.controls!["serviceType"].value.key : null,
          applicationType: res.controls!["applicationType"].value ? res.controls!["applicationType"].value.key : null,
          idNumber: res.controls!["idNumber"].value ? res.controls!["idNumber"].value : null,
          executedDateFrom: res.controls!["executedFrom"].value ? new Date(res.controls!["executedFrom"].value.year, res.controls!["executedFrom"].value.month - 1, res.controls!["executedFrom"].value.day) : undefined,
          executedDateTo: res.controls!["executedTo"].value ? new Date(res.controls!["executedTo"].value.year, res.controls!["executedTo"].value.month - 1, res.controls!["executedTo"].value.day) : undefined,
          initiatedBy: res.controls!["initiatedBy"].value ? res.controls!["initiatedBy"].value.value : null,
          initiatedDateFrom: res.controls!["initiatedFrom"].value ? new Date(res.controls!["initiatedFrom"].value.year, res.controls!["initiatedFrom"].value.month - 1, res.controls!["initiatedFrom"].value.day) : undefined,
          initiatedDateTo: res.controls!["initiatedTo"].value ? new Date(res.controls!["initiatedTo"].value.year, res.controls!["initiatedTo"].value.month - 1, res.controls!["initiatedTo"].value.day) : undefined,
          status: res.controls!["status"].value ? res.controls!["status"].value.key : null
        });
        this.getGovProcessed();
      } else if (res.buttonId == "reset") {
        this.popupService.dismiss();
        this.resetGov()
        this.setGovProcessedReq({
          page: 1,
          rows: 50,
        });
        this.getGovProcessed();
      } else {
        this.popupService.dismiss();
      }
    });
  }

  openEsalSearch() {
    this.popupService.showPopup({ image: '', form: this.esalSearchForm }).subscribe((res: PopupOutputModel) => {
      if (res.buttonId == "search") {
        this.popupService.dismiss();
        this.setEsalProcessedReq({
          page: 1,
          rows: 50,
          accountNumber: res.controls['account'].value ? res.controls['account'].value.value : null,
          amountFrom: res.controls!["paidFrom"].value ? res.controls!["paidFrom"].value : null,
          amountTo: res.controls!["paidTo"].value ? res.controls!["paidTo"].value : null,
          approvedBy: res.controls!["approvedBy"].value ? res.controls!["approvedBy"].value.value : null,
          invoiceNumber: res.controls!["invoiceNumber"].value ? res.controls!["invoiceNumber"].value : null,
          supplierId: res.controls!["supplierId"].value ? res.controls!["supplierId"].value : null,
          supplierName: res.controls!["supplierName"].value ? res.controls!["supplierName"].value : null,
          buyerName: res.controls!["buyerName"].value ? res.controls!["buyerName"].value : null,
          executedDateFrom: res.controls!["executedFrom"].value ? new Date(res.controls!["executedFrom"].value.year, res.controls!["executedFrom"].value.month - 1, res.controls!["executedFrom"].value.day) : undefined,
          executedDateTo: res.controls!["executedTo"].value ? new Date(res.controls!["executedTo"].value.year, res.controls!["executedTo"].value.month - 1, res.controls!["executedTo"].value.day) : undefined,
          initiatedBy: res.controls!["initiatedBy"].value ? res.controls!["initiatedBy"].value.value : null,
          initiatedDateFrom: res.controls!["initiatedFrom"].value ? new Date(res.controls!["initiatedFrom"].value.year, res.controls!["initiatedFrom"].value.month - 1, res.controls!["initiatedFrom"].value.day) : undefined,
          initiatedDateTo: res.controls!["initiatedTo"].value ? new Date(res.controls!["initiatedTo"].value.year, res.controls!["initiatedTo"].value.month - 1, res.controls!["initiatedTo"].value.day) : undefined,
          status: res.controls!["status"].value ? res.controls!["status"].value.key : null
        });
        this.getEsalProcessed();
      } else if (res.buttonId == "reset") {
        this.popupService.dismiss();
        res.controls!['account'].setValue('')
        res.controls!["paidFrom"].setValue('')
        res.controls!["paidTo"].setValue('')
        res.controls!["approvedBy"].setValue('')
        res.controls!["supplierName"].setValue('')
        res.controls!["supplierId"].setValue('')
        res.controls!["invoiceNumber"].setValue('')
        res.controls!["buyerName"].setValue('')
        res.controls!["executedFrom"].setValue('')
        res.controls!["executedTo"].setValue('')
        res.controls!["initiatedBy"].setValue('')
        res.controls!["initiatedFrom"].setValue('')
        res.controls!["initiatedTo"].setValue('')
        res.controls!["status"].setValue('')
        this.setEsalProcessedReq({
          page: 1,
          rows: 50,
        });
        this.getEsalProcessed();
      } else {
        this.popupService.dismiss();
      }
    });
  }

  openBillSearch() {
    this.popupService.showPopup({ image: '', form: this.billSearchForm }).subscribe((res: PopupOutputModel) => {
      if (res.buttonId == "search") {
        this.popupService.dismiss();
        this.setBillProcessedReq({
          page: 1,
          rows: 50,
          accountNumber: res.controls['account'].value ? res.controls['account'].value.value : null,
          amountFrom: res.controls!["paidFrom"].value ? res.controls!["paidFrom"].value : null,
          amountTo: res.controls!["paidTo"].value ? res.controls!["paidTo"].value : null,
          approvedBy: res.controls!["approvedBy"].value ? res.controls!["approvedBy"].value.value : null,
          biller: res.controls!["billers"].value ? res.controls!["billers"].value.billCode : null,
          billNickname: res.controls!["billNickname"].value ? res.controls!["billNickname"].value : null,
          billReference: res.controls!["billRef"].value ? res.controls!["billRef"].value : null,
          executedDateFrom: res.controls!["executedFrom"].value ? new Date(res.controls!["executedFrom"].value.year, res.controls!["executedFrom"].value.month - 1, res.controls!["executedFrom"].value.day) : undefined,
          executedDateTo: res.controls!["executedTo"].value ? new Date(res.controls!["executedTo"].value.year, res.controls!["executedTo"].value.month - 1, res.controls!["executedTo"].value.day) : undefined,
          initiatedBy: res.controls!["initiatedBy"].value ? res.controls!["initiatedBy"].value.value : null,
          initiatedDateFrom: res.controls!["initiatedFrom"].value ? new Date(res.controls!["initiatedFrom"].value.year, res.controls!["initiatedFrom"].value.month - 1, res.controls!["initiatedFrom"].value.day) : undefined,
          initiatedDateTo: res.controls!["initiatedTo"].value ? new Date(res.controls!["initiatedTo"].value.year, res.controls!["initiatedTo"].value.month - 1, res.controls!["initiatedTo"].value.day) : undefined,
          status: res.controls!["status"].value ? res.controls!["status"].value.key : null
        });
        this.getBillProcessed();
      } else if (res.buttonId == "reset") {
        this.popupService.dismiss();
        res.controls['account'].setValue('')
        res.controls!["paidFrom"].setValue('')
        res.controls!["paidTo"].setValue('')
        res.controls!["approvedBy"].setValue('')
        res.controls!["billers"].setValue('')
        res.controls!["billNickname"].setValue('')
        res.controls!["billRef"].setValue('')
        res.controls!["executedFrom"].setValue('')
        res.controls!["executedTo"].setValue('')
        res.controls!["initiatedBy"].setValue('')
        res.controls!["initiatedFrom"].setValue('')
        res.controls!["initiatedTo"].setValue('')
        res.controls!["status"].setValue('')
        this.setBillProcessedReq({
          page: 1,
          rows: 50,
        });
        this.getBillProcessed();
      } else {
        this.popupService.dismiss();
      }
    });
  }

  setBillProcessedReq(options: BillProcessedTransactionsReq = {
    page: 1,
    rows: 50
  }) {
    this.billProcessedReq = {
      accountNumber: options.accountNumber,
      amountFrom: options.amountFrom,
      amountTo: options.amountTo,
      approvedBy: options.approvedBy,
      biller: options.biller,
      billNickname: options.billNickname,
      billReference: options.billReference,
      executedDateFrom: options.executedDateFrom,
      executedDateTo: options.executedDateTo,
      initiatedBy: options.initiatedBy,
      initiatedDateFrom: options.initiatedDateFrom,
      initiatedDateTo: options.initiatedDateTo,
      status: options.status,
      page: options.page || 1,
      rows: options.rows || 50,
    };
  }

  getBillProcessed() {
    this.billProcessedTransactionsService.getBillProcessedTransactions(this.billProcessedReq).pipe(take(1)).subscribe({
      next: (res) => {
        if (res.processedTransactionList?.size) {
          const list: any = [];
          res.processedTransactionList.items.forEach(element => {
            const object = {
              description: this.translate.currentLang != 'ar' ? element.addDescriptionEn : element.addDescriptionAr,
              nickname: element.nickname,
              billRef: element.billRef,
              accountAlias: element.accountAlias,
              accountNumber: element.accountNumber,
              amount: element.amount,
              paymentType: element.paymentType,
              beStatus: 'errorTable.' + element.beStatus,
              initiatedBy: element.securityLevelsDTOList[0].updater,
              initiationDate: element.initiationDate,
              executedBy: element.securityLevelsDTOList[element.securityLevelsDTOList.length - 1].updater,
              executedDate: element.securityLevelsDTOList[element.securityLevelsDTOList.length - 1].updateDate
            };
            list.push(object);
          });
          this.data = list
          this.total = res.processedTransactionList.total;
        } else {
          this.data = [];
        }
      },
      error: () => {
        this.data = [];
        this.total = 0;
      }
    });
  }

  getEsal() {
    this.modelAndListService.getList(['errors', 'processTransactionStatus']).subscribe(data => {
      const statusList = Utils.getErrorsWithErrorTable(data['errors'], this.translate);
      this.esalSearchForm.controls["status"].controlOptions.options = Object.keys(data['processTransactionStatus']).map(key => {
        return { key: key, value: data['processTransactionStatus'][key] }
      });

      this.headers = [];
      let headers: TableHeaderModel[] = [];

      headers.push({
        title: "payments.esal-processed.invoiceNumber",
        type: TableHeaderType.TEXT,
        fieldName: "invoiceNumber"
      });
      headers.push({ title: "payments.esal-processed.supplierID", type: TableHeaderType.TEXT, fieldName: "supplierId" });
      headers.push({
        title: "payments.esal-processed.supplierName",
        type: TableHeaderType.TEXT,
        fieldName: "supplierName"
      });
      headers.push({ title: "payments.esal-processed.buyerName", type: TableHeaderType.TEXT, fieldName: "buyerName" });
      // headers.push({title: "payments.esal-processed.bankName", type: TableHeaderType.TEXT, fieldName: "beneficiaryName"});
      headers.push({
        title: "payments.esal-processed.accountNumber",
        type: TableHeaderType.TEXT,
        fieldName: "accountNumber"
      });
      headers.push({ title: "payments.esal-processed.nickname", type: TableHeaderType.TEXT, fieldName: "accountAlias" });
      headers.push({
        title: "payments.esal-processed.amount",
        type: TableHeaderType.AMOUNT_TEXT,
        fieldName: "amount",
        controlOptions: { currency: 'currency' }
      });
      headers.push({
        title: "payments.esal-processed.status",
        type: TableHeaderType.TEXT,
        fieldName: "beStatus",
        mapObject: statusList
      });
      headers.push({
        title: "payments.esal-processed.initiated-by",
        type: TableHeaderType.TEXT,
        fieldName: "initiatedBy"
      });
      headers.push({
        title: "payments.esal-processed.initiated-date",
        type: TableHeaderType.DATE_TEXT,
        fieldName: "initiationDate",
        controlOptions: { format: 'dd/MM/yyyy' }
      });
      headers.push({ title: "payments.esal-processed.executed-by", type: TableHeaderType.TEXT, fieldName: "executedBy" });
      headers.push({
        title: "payments.esal-processed.executed-date",
        type: TableHeaderType.DATE_TEXT,
        fieldName: "executedDate",
        controlOptions: { format: 'dd/MM/yyyy' }
      });

      this.headers = headers;
    });

    this.processedTransactionsService.getAccountsComboData({
      order: "",
      orderType: "",
      page: 1,
      rows: 100,
      txType: "ECIA"
    }).subscribe((data) => {
      this.esalSearchForm.controls["account"].controlOptions.options = data;
    })
    this.processedTransactionsService.getUsersComboData().subscribe((data) => {
      this.esalSearchForm.controls["approvedBy"].controlOptions.options = Object.entries(data).map(entry => {
        return { "key": [entry[0]], "value": entry[1] };
      });
      this.esalSearchForm.controls["initiatedBy"].controlOptions.options = Object.entries(data).map(entry => {
        return { "key": [entry[0]], "value": entry[1] };
      });
    })
  }

  setEsalProcessedReq(options: EsalProcessedTransactionsReq = {
    page: 1,
    rows: 50
  }) {
    this.esalProcessedReq = {
      accountNumber: options.accountNumber,
      amountFrom: options.amountFrom,
      amountTo: options.amountTo,
      approvedBy: options.approvedBy,
      buyerName: options.buyerName,
      invoiceNumber: options.invoiceNumber,
      supplierId: options.supplierId,
      supplierName: options.supplierName,
      executedDateFrom: options.executedDateFrom,
      executedDateTo: options.executedDateTo,
      initiatedBy: options.initiatedBy,
      initiatedDateFrom: options.initiatedDateFrom,
      initiatedDateTo: options.initiatedDateTo,
      status: options.status,
      page: options.page || 1,
      rows: options.rows || 50,
    };
  }

  getEsalProcessed() {
    this.esalProcessedTransactionsService.getEsalProcessedTransactions(this.esalProcessedReq).pipe(take(1)).subscribe({
      next: (res) => {
        if (res.processedTransactionList?.size) {
          const list: any = [];
          res.processedTransactionList.items.forEach(element => {
            const object = {
              buyerName: element.buyerName,
              invoiceNumber: element.invoiceId,
              supplierId: element.billerId,
              supplierName: element.billerName,
              accountAlias: element.accountAlias,
              accountNumber: element.accountNumber,
              amount: element.amount,
              beStatus: 'errorTable.' + element.beStatus,
              initiatedBy: element.securityLevelsDTOList[0].updater,
              initiationDate: element.initiationDate,
              executedBy: element.securityLevelsDTOList[element.securityLevelsDTOList.length - 1].updater,
              executedDate: element.securityLevelsDTOList[element.securityLevelsDTOList.length - 1].updateDate
            };
            list.push(object);
          });
          this.data = list
          this.total = res.processedTransactionList.total;
        } else {
          this.data = [];
        }
      },
      error: () => {
        this.data = [];
        this.total = 0;
      }
    });
  }

  getData(): string {
    let serviceType: '';
    if (this.dropsData) {
      serviceType = this.type === 'government-payments' ? this.dropsData.eGovSadadType : this.dropsData.eGovSadadRType;
    }
    else {
      serviceType = ''
    }
    return serviceType;
  }


  getGovPayments() {
    const objPayments: any = {}
    const objRefunds: any = {}

    this.modelAndListService.getList(this.type === 'government-payments' ? SelectionTypeNamesP : SelectionTypeNamesR).subscribe(data => {
      delete data[this.type === 'government-payments' ? 'eGovSadadType' : 'eGovSadadRType']['000'];
      this.dropsData = data
      var output = Object.entries(this.type === 'government-payments' ? this.dropsData.eGovSadadType : this.dropsData.eGovSadadRType
      ).map(([key, value]) => ({ key, value }));

      for (const key in MOI_PAYMENTS_FORMS_FIELDS_CONFIGS) {
        const value = MOI_PAYMENTS_FORMS_FIELDS_CONFIGS[key];
        for (const key in value.applicationsTypes) {
          const ob = value.applicationsTypes[key];
          objPayments[key] = ob.title
        }
      }

      for (const key in MOI_REFUNDS_FORMS_FIELDS_CONFIGS) {
        const value = MOI_REFUNDS_FORMS_FIELDS_CONFIGS[key];
        for (const key in value.applicationsTypes) {
          const ob = value.applicationsTypes[key];
          objRefunds[key] = ob.title
        }
      }

      this.govSearchForm.controls["serviceType"].controlOptions.options = output;
      this.govSearchForm.controls["serviceType"].valueChanges.subscribe((value: any) => {
        if (value) {
          this.govSearchForm.controls!["applicationType"].setValue('')
          const applicationType = Object.entries(this.type === 'government-payments' ? MOI_PAYMENTS_FORMS_FIELDS_CONFIGS[this.govSearchForm.controls["serviceType"].value.key].applicationsTypes :
            MOI_REFUNDS_FORMS_FIELDS_CONFIGS[this.govSearchForm.controls["serviceType"].value.key].applicationsTypes)
            .map((key: any) => {
              return ({ key: key[1].key, value: key[1].title })
            })
          this.govSearchForm.controls["applicationType"].controlOptions.options = applicationType;
        }
      });
    })


    this.modelAndListService.getList(['errors', 'processTransactionStatus']).subscribe(data => {
      const statusList = Utils.getErrorsWithErrorTable(data['errors'], this.translate);
      this.govSearchForm.controls["status"].controlOptions.options = Object.keys(data['processTransactionStatus']).map(key => {
        return { key: key, value: data['processTransactionStatus'][key] }
      });

      this.headers = [];
      let headers: TableHeaderModel[] = [];

      headers.push({
        title: "payments.government-processed.serviceType",
        type: TableHeaderType.TEXT,
        fieldName: "serviceType",
        mapObject: this.getData()
      });
      headers.push({
        title: "payments.government-processed.subserviceType",
        type: TableHeaderType.TEXT,
        fieldName: "applicationType",
        mapObject: this.type === 'government-payments' ? objPayments : objRefunds
      });
      headers.push({
        title: "payments.government-processed.idNumber",
        type: TableHeaderType.BUTTON,
        fieldName: "idNumber",
        controlOptions: { id: "idNumber", text: "idNumber" }
      });
      headers.push({
        title: "payments.government-processed.beneficiaryName",
        type: TableHeaderType.TEXT,
        fieldName: "beneficiaryName"
      });
      headers.push({
        title: "payments.government-processed.accountNumber",
        type: TableHeaderType.TEXT,
        fieldName: "accountNumber"
      });
      headers.push({
        title: "payments.government-processed.nickname",
        type: TableHeaderType.TEXT,
        fieldName: "accountAlias"
      });
      headers.push({
        title: "payments.government-processed.amount",
        type: TableHeaderType.AMOUNT_TEXT,
        fieldName: "amount",
        controlOptions: { currency: 'currency' }
      });
      headers.push({
        title: "payments.government-processed.status",
        type: TableHeaderType.TEXT,
        fieldName: "beStatus",
        mapObject: statusList
      });
      headers.push({
        title: "payments.government-processed.initiated-by",
        type: TableHeaderType.TEXT,
        fieldName: "initiatedBy"
      });
      headers.push({
        title: "payments.government-processed.initiated-date",
        type: TableHeaderType.DATE_TEXT,
        fieldName: "initiationDate",
        controlOptions: { format: 'dd/MM/yyyy' }
      });
      headers.push({
        title: "payments.government-processed.executed-by",
        type: TableHeaderType.TEXT,
        fieldName: "executedBy"
      });
      headers.push({
        title: "payments.government-processed.executed-date",
        type: TableHeaderType.DATE_TEXT,
        fieldName: "executedDate",
        controlOptions: { format: 'dd/MM/yyyy' }
      });
      this.headers = headers;
    });

    this.processedTransactionsService.getAccountsComboData({
      order: "",
      orderType: "",
      page: 1,
      rows: 100,
      txType: "ECIA"
    }).subscribe((data) => {
      this.govSearchForm.controls["account"].controlOptions.options = data;
    })
    this.processedTransactionsService.getUsersComboData().subscribe((data) => {
      this.govSearchForm.controls["approvedBy"].controlOptions.options = Object.entries(data).map(entry => {
        return { "key": [entry[0]], "value": entry[1] };
      });
      this.govSearchForm.controls["initiatedBy"].controlOptions.options = Object.entries(data).map(entry => {
        return { "key": [entry[0]], "value": entry[1] };
      });
    })


  }

  resetGov() {
    this.govSearchForm.controls!['account'].setValue('')
    this.govSearchForm.controls!["paidFrom"].setValue('')
    this.govSearchForm.controls!["paidTo"].setValue('')
    this.govSearchForm.controls!["approvedBy"].setValue('')
    this.govSearchForm.controls!["serviceType"].setValue('')
    this.govSearchForm.controls!["applicationType"].setValue('')
    this.govSearchForm.controls!["idNumber"].setValue('')
    this.govSearchForm.controls!["executedFrom"].setValue('')
    this.govSearchForm.controls!["executedTo"].setValue('')
    this.govSearchForm.controls!["initiatedBy"].setValue('')
    this.govSearchForm.controls!["initiatedFrom"].setValue('')
    this.govSearchForm.controls!["initiatedTo"].setValue('')
    this.govSearchForm.controls!["status"].setValue('')
  }

  setGovProcessedReq(options: GovProcessedTransactionsReq = {
    page: 1,
    rows: 50
  }) {
    this.govProcessedReq = {
      accountNumber: options.accountNumber,
      amountFrom: options.amountFrom,
      amountTo: options.amountTo,
      approvedBy: options.approvedBy,
      serviceType: options.serviceType,
      idNumber: options.idNumber,
      transactionType: this.type === 'government-payments' ? 'P' : 'R',
      applicationType: options.applicationType,
      executedDateFrom: options.executedDateFrom,
      executedDateTo: options.executedDateTo,
      initiatedBy: options.initiatedBy,
      initiatedDateFrom: options.initiatedDateFrom,
      initiatedDateTo: options.initiatedDateTo,
      status: options.status,
      page: options.page || 1,
      rows: options.rows || 50,
    };
  }

  getGovProcessed() {
    this.govProcessedTransactionsService.getGovProcessedTransactions(this.govProcessedReq).pipe(take(1)).subscribe({
      next: (res) => {
        if (res.requestStatusEgovSPList?.size) {

          const list: any = [];
          res.requestStatusEgovSPList.items.forEach(element => {
            const newObject:any = Object.assign({}, element);
            newObject['executedBy']=element.securityLevelsDTOList![element.securityLevelsDTOList!.length - 1].updater
            newObject['executedDate']=element.securityLevelsDTOList![element.securityLevelsDTOList!.length - 1].updateDate
            newObject['initiatedBy']=element.securityLevelsDTOList![0].updater
            newObject['beStatus']='errorTable.' + element.beStatus
            newObject['idNumber']= element.paymentId?element.paymentId:'No ID'

            list.push(newObject);
          });


          this.data = list
          this.total = res.requestStatusEgovSPList.total;
        } else {
          this.data = [];
        }
      },
      error: () => {
        this.data = [];
        this.total = 0;
      }
    });
  }

  tabChanged(id: string) {
    this.type = id;
    this.exportFileName = this.tabs.find(({value}) => value === this.type)?.text!
    this.data = undefined;
    switch (this.type) {
      case "bill":
        this.location.replaceState('/payments/processed?type=bill');
        this.getBillPayments();
        this.setBillProcessedReq();
        this.getBillProcessed();
        break;
      case "government-payments":
        this.location.replaceState('/payments/processed?type=government-payments');
        this.resetGov()
        this.getGovPayments();
        this.setGovProcessedReq();
        this.getGovProcessed();
        break;
      case "government-refunds":
        this.location.replaceState('/payments/processed?type=government-refunds');
        this.resetGov()
        this.getGovPayments();
        this.setGovProcessedReq();
        this.getGovProcessed();
        break;
      case "esal":
        this.location.replaceState('/payments/processed?type=esal');
        this.getEsal();
        this.setEsalProcessedReq();
        this.getEsalProcessed();
        break;
    }
  }


  externalPagination(data: PaginationValueModel) {
    switch (this.type) {
      case "bill":
        this.setBillProcessedReq({ page: data.page, rows: data.size });
        this.getBillProcessed();
        break;
      case "government-payments":
      case "government-refunds":
        this.setGovProcessedReq({ page: data.page, rows: data.size });
        this.getGovProcessed();
        break;
      case "esal":
        this.setEsalProcessedReq({ page: data.page, rows: data.size });
        this.getEsalProcessed();
        break;
    }
  }


}
