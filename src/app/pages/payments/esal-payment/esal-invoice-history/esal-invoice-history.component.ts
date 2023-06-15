import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormModel } from 'app/@core/model/dto/formModel';
import { BreadcrumbService } from 'app/@core/service/base/breadcrumb.service';
import { ModelAndListService } from 'app/@core/service/base/modelAndList.service';
import { EsalInvoiceHistoryService } from 'app/@core/service/payments/esal-payment/esal-invoice-history/esal-invoice-history.service';
import { TableHeaderType } from 'arb-design-library';
import { PaginationValueModel } from 'arb-design-library/model/pagination.model';
import { TableHeaderModel } from 'arb-design-library/model/table-header.model';
import {
  EsalParamsReq,
  getEsalInvoiceHistoryForm,
  getTrnxFilterPopup,
} from './esal-invoice-history-controls';
import { take } from 'rxjs';
import { PopupService } from 'app/@core/service/base/popup.service';
import { MapElement } from '../../feedback-files/feedback-file-details/feedback-file-details.component';
import { Utils } from 'app/@core/utility/Utils';

@Component({
  selector: 'app-esal-invoice-history',
  templateUrl: './esal-invoice-history.component.html',
})
export class EsalInvoiceHistoryComponent implements OnInit {
  esalInvoiceHistoryForm: FormModel = getEsalInvoiceHistoryForm();
  headers: TableHeaderModel[] = [];
  paginationValue: PaginationValueModel = { page: 1, size: 10 };
  errorList: Array<MapElement> = [];
  data!: Object[];
  total: number = 0;
  exportFileName: string;
  filterForm = getTrnxFilterPopup();
  params: EsalParamsReq = {
    invoiceNumber: '',
    billerName: '',
    payDateFrom: '',
    payDateTo: '',
    amountFrom: null,
    amountTo: null,
    page: this.paginationValue.page,
    rows: this.paginationValue.size,
  };

  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private translate: TranslateService,
    private modelAndListService: ModelAndListService,
    private esalInvoiceHistoryService: EsalInvoiceHistoryService,
    private popupService: PopupService
  ) {
    this.breadcrumbService.setBreadcrumb([
      {
        text: this.translate.instant('payments.name'),
        url: '/payments',
      },
      {
        text: this.translate.instant('payments.esal.title'),
        url: '/payments/esal-payment',
      },
      {
        text: this.translate.instant('payments.esal.invoice-history.title'),
        url: '',
      },
    ]);

    this.exportFileName = 'Alrajhi Esal Invoice History';
  }

  ngOnInit(): void {
    this.setEsalInvoiceHistoryTable();
    this.getEsalInvoiceHistoryTableData(this.paginationValue);
  }

  onTitleButtonClick(id: string) {
    switch (id) {
      case 'arrowTitle':
        this.router.navigateByUrl('/payments/esal-payment').then(() => {});
        break;
    }
  }

  setEsalInvoiceHistoryTable() {
    this.modelAndListService.getList(['errors']).subscribe((data) => {
      this.errorList = Utils.getErrorsWithoutErrorTable(data.errors);

      this.headers = [];
      let headers: TableHeaderModel[] = [];

      headers.push({
        title: this.translate.instant(
          'payments.esal.invoice-history.invoice-number'
        ),
        type: TableHeaderType.TEXT,
        fieldName: 'invoiceNumber',
      });
      headers.push({
        title: this.translate.instant(
          'payments.esal.invoice-history.supplier-name'
        ),
        type: TableHeaderType.TEXT,
        fieldName: 'supplierName',
      });
      headers.push({
        title: this.translate.instant('payments.esal.supplier-id'),
        type: TableHeaderType.TEXT,
        fieldName: 'supplierId',
      });
      headers.push({
        title: this.translate.instant(
          'payments.esal.invoice-history.buyer-name'
        ),
        type: TableHeaderType.TEXT,
        fieldName: 'buyerName',
      });
      headers.push({
        title: this.translate.instant(
          'payments.esal.invoice-history.account-number'
        ),
        type: TableHeaderType.TEXT,
        fieldName: 'accountNumber',
      });
      headers.push({
        title: this.translate.instant('payments.esal.invoice-history.amount'),
        type: TableHeaderType.AMOUNT_TEXT,
        fieldName: 'amount',
        controlOptions: {
          currency: 'currency' /*Account Currency*/,
        },
      });
      headers.push({
        title: this.translate.instant('payments.esal.invoice-history.status'),
        type: TableHeaderType.TEXT,
        fieldName: 'status',
        mapObject: this.errorList,
      });

      this.headers = headers;
    });
  }

  onFilterClick() {
    this.popupService.showPopup(this.filterForm).subscribe((res) => {
      if (res.buttonId === 'close') {
        this.popupService.dismiss();
      }
      if (res.buttonId === 'reset') {
        this.filterForm.form?.controls['invoiceNumber'].setValue(null);
        this.filterForm.form?.controls['billerName'].setValue(null);
        this.filterForm.form?.controls['amountFrom'].setValue(null);
        this.filterForm.form?.controls['amountTo'].setValue(null);
        this.filterForm.form?.controls['payDateFrom'].setValue(null);
        this.filterForm.form?.controls['payDateTo'].setValue(null);

        this.params = {
          invoiceNumber: '',
          billerName: '',
          payDateFrom: '',
          payDateTo: '',
          amountFrom: null,
          amountTo: null,
          page: this.paginationValue.page,
          rows: this.paginationValue.size,
        };

        this.getEsalInvoiceHistoryTableData(this.paginationValue);
        this.popupService.dismiss();
      }
      if (res.buttonId === 'search') {
        this.params.invoiceNumber = this.filterForm.form?.controls[
          'invoiceNumber'
        ].value
          ? this.filterForm.form?.controls['invoiceNumber'].value
          : null;

        this.params.billerName = this.filterForm.form?.controls['billerName']
          .value
          ? this.filterForm.form?.controls['billerName'].value
          : '';

        this.params.amountFrom = res.controls['amountFrom'].value
          ? res.controls['amountFrom'].value
          : null;

        this.params.amountTo = res.controls['amountTo'].value
          ? res.controls['amountTo'].value
          : null;

        this.params.payDateFrom = this.filterForm.form?.controls['payDateFrom']
          .value
          ? res?.controls['payDateFrom'].value.year +
            '-' +
            res?.controls['payDateFrom'].value.month +
            '-' +
            res?.controls['payDateFrom'].value.day
          : '';

        this.params.payDateTo = this.filterForm.form?.controls['payDateTo']
          .value
          ? res.controls['payDateTo'].value.year +
            '-' +
            res.controls['payDateTo'].value.month +
            '-' +
            res.controls['payDateTo'].value.day
          : '';

        this.getEsalInvoiceHistoryTableData(this.paginationValue);
        this.popupService.dismiss();
      }
    });
  }

  getEsalInvoiceHistoryTableData(page: PaginationValueModel) {
    this.esalInvoiceHistoryService
      .getEsalInvoiceHistoryList(this.params)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          if (res.sadadInvoicePagedResults.size) {
            const list: Array<any> = [];
            res.sadadInvoicePagedResults.items.forEach((item) => {
              const object = {
                invoiceNumber: item.invoiceId,
                supplierName: item.billerName,
                supplierId: item.billerId,
                buyerName: item.buyerName,
                bankName: '',
                accountNumber: item.accountNumber,
                amount: item.amountPayment,
                status: item.returnCode,
              };
              list.push(object);
            });
            this.data = list;
            this.total = res.sadadInvoicePagedResults.total;
          } else {
            this.data = [];
          }
        },
        error: () => {
          this.data = [];
          this.total = 0;
        },
      });
  }

  pagination(value: PaginationValueModel) {
    this.paginationValue = {
      page: value.page,
      size: value.size,
    };
    this.getEsalInvoiceHistoryTableData(this.paginationValue);
  }
}
