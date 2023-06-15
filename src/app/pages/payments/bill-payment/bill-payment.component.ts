import { Subject, take, takeUntil } from 'rxjs';
import { TableControl } from 'app/@core/model/dto/control/table-control';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PaymentBaseComponent } from '../payment-base/payment-base.component';
import {
  buildBillPaymentForm,
  getFilterBillsForm,
  filterControls,
  getDeleteBillsForm,
} from './bill-payment-controls';
import { PaymentsService } from '../../../@core/service/payments/payments.service';
import { SearchBillReq } from '../../../@core/model/rest/payments/billPayment/search-bill-req';
import {
  FormModel,
  FormResult,
  PageModel,
} from '../../../@core/model/dto/formModel';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { FormButtonClickOutput } from '../../../shared/form/form.component';
import { ModelAndListService } from '../../../@core/service/base/modelAndList.service';
import { PopupOutputModel } from 'app/@core/model/dto/popup.model';
import { PopupService } from 'app/@core/service/base/popup.service';
import { BillDeleteReq } from 'app/@core/model/rest/payments/billPayment/bill-delete-req';
import { ResponseException } from 'app/@core/service/base/responseException';
import { BillPaymentService } from 'app/@core/service/payments/bill-payments/bill-payment.service';
import { AlertModel } from 'app/@core/model/dto/alert.model';

@Component({
  selector: 'app-bill-payment',
  templateUrl: '../payment-base/payment-base.component.html',
  styleUrls: [],
})
export class BillPaymentComponent
  extends PaymentBaseComponent
  implements OnInit, OnDestroy
{
  billsData!: any;
  statusList: any;
  override deleteButton: ButtonModel = {
    id: 'delete-bill',
    text: 'payments.bill-payment.delete-bill',
    type: 'danger',
    isDisable: true,
    prefixIcon: ' arb-icon-Trash',
  };
  payButton: ButtonModel = {
    id: 'pay-bill',
    text: 'payments.bill-payment.pay-bill',
    type: 'primary',
    isDisable: true,
  };
  filterBillsForm: FormModel;
  destroy$ = new Subject();
  override alert!: AlertModel;

  constructor(
    private paymentsService: PaymentsService,
    private billPaymentService: BillPaymentService,
    private modelAndListService: ModelAndListService,
    private popupService: PopupService
  ) {
    super();
    this.setBreadcrumb([
      {
        text: 'payments.name',
        url: '/payments',
      },
      { text: 'payments.bill-payment.name', url: '' },
    ]);
    this.pageTitle.id = 'bill-payment';
    this.pageTitle.title = 'payments.bill-payment.name';
    this.endButtons = [this.deleteButton, this.payButton];
    this.endButtons[1].showLoading = true;
    this.pageTitle.endButtons!.unshift({
      id: 'feedbackFiles',
      type: 'secondary',
      text: 'payments.feedback-files.title',
    });
    this.pages = [new PageModel(1, buildBillPaymentForm(this.translate))];
    this.filterBillsForm = getFilterBillsForm(this.translate);
  }

  override ngOnInit(): void {
    this.getBillList(history.state.billRef);
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'UserApprovalStatus':
        this.router
          .navigate(['/payments/approval'], { queryParams: { type: 'bill' } })
          .then(() => {});
        break;
      case 'pay-bill':
        void this.router.navigateByUrl(
          '/payments/' + formButtonClickOutput.buttonId,
          {
            state: {
              selectedBills: this.getControl(0, 0, 'billTable').value,
              accounts: this.billsData.accountsWithSaudiRials,
            },
          }
        );
        break;
      case 'feedbackFiles':
        this.router
          .navigate(['/payments/feedback-files'], {
            queryParams: { type: 'bill' },
          })
          .then(() => {});
        break;
      case 'Back':
        this.goToPayments();
        break;
      case 'PendingActions':
        void this.router.navigate(['/pendingActions/pending-actions-list']);
        break;
      case 'add-bill':
        void this.router.navigateByUrl(
          '/payments/' + formButtonClickOutput.buttonId
        );
        break;
      case 'delete-bill':
        if (this.getControl(0, 0, 'billTable').value) {
          this.openDeletePopup();
        }
        break;
      case 'Payments':
        this.goToPayments();
        break;
      case 'ProcessedTransactions':
        this.router
          .navigate(['/payments/processed'], { queryParams: { type: 'bill' } })
          .then(() => {});
        break;
    }
  }

  getBillList(billRef?: string) {
    let data: SearchBillReq = new SearchBillReq();
    data.searchBillRef = billRef;
    this.modelAndListService.getList(['billStatus']).subscribe((listRes) => {
      this.statusList = listRes;
      this.paymentsService
        .getBillList(data)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            this.billsData = res;
            this.formatBillStatus();
            this.fillTable(this.billsData);
            this.addFilterBillsPressAction();
          },
          error: () => {
            this.getControl(0, 0, 'billTable').controlOptions.data = [];
          },
        });
    });
  }

  fillTable(data: any) {
    if (data) {
      data.searchBillList.billsList.forEach((item: any) => {
        item.logo =
          'assets/billerIcon/' +
          item.billCode.substring(
            item.billCode.length - 3,
            item.billCode.length
          ) +
          '.png';
      });
    }

    this.getControl(0, 0, 'billTable').controlOptions.data =
      data.searchBillList.billsList;
    this.endButtons[1].showLoading = false;
    if (history.state.selectedBills) {
      this.getControl(0, 0, 'billTable').setValue(history.state.selectedBills);
      this.endButtons[1].isDisable = false;
      this.endButtons[0].isDisable = false;
    }
  }

  formatBillStatus() {
    for (let bill of this.billsData.searchBillList.billsList) {
      let status1;
      if (bill.amount > 0) {
        status1 = 'D';
      } else {
        if (bill.advanced) {
          status1 = 'A';
        } else {
          status1 = 'P';
        }
      }
      bill.status = this.statusList.billStatus[status1];
    }
  }

  addFilterBillsPressAction() {
    this.filterBillsForm.controls['billerName'].controlOptions.options =
      this.billsData.billCodeList;
    this.onFilterFormValuesChange();
    (this.getControl(0, 0, 'billTable') as TableControl).onFilterClick
      ?.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.openFilterPopup();
      });
  }

  onFilterFormValuesChange() {
    const controls = filterControls;
    controls.forEach((control) => {
      this.filterBillsForm.controls[control].valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.resetFilterFormValues(control);
        });
    });
  }

  resetFilterFormValues(changedControl: string) {
    let controls = [...filterControls];
    switch (changedControl) {
      case 'amountFrom':
      case 'amountTo':
        controls.splice(controls.indexOf('amountFrom'), 1);
        controls.splice(controls.indexOf('amountTo'), 1);
        break;
      case 'dateFrom':
      case 'dateTo':
        controls.splice(controls.indexOf('dateFrom'), 1);
        controls.splice(controls.indexOf('dateTo'), 1);
        break;
      default:
        controls.splice(controls.indexOf(changedControl), 1);
        break;
    }
    controls.forEach((control) => {
      if (this.filterBillsForm.controls[control].value !== '') {
        this.filterBillsForm.controls[control].setValue('');
      }
    });
  }

  openFilterPopup() {
    this.popupService
      .showPopup({ form: this.filterBillsForm })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: PopupOutputModel) => {
        if (res.buttonId == 'filterBills') {
          this.popupService.dismiss();
          const filterData = this.getSelectedFilterResults(res);
          this.getFilteredBills(filterData);
        } else if (res.buttonId == 'reset') {
          this.popupService.dismiss();
          this.resetAllBillsFilterValues();
          this.getFilteredBills({});
        } else {
          this.popupService.dismiss();
        }
      });
  }

  getFilteredBills(filterData: SearchBillReq) {
    this.paymentsService
      .getBillList(filterData)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.billsData = res;
          this.formatBillStatus();
          this.fillTable(this.billsData);
          this.getControl(0, 0, 'billTable').controlOptions.filterIsActive =
            true;
        },
        error: () => {
          this.getControl(0, 0, 'billTable').controlOptions.data = [];
        },
      });
  }

  resetAllBillsFilterValues() {
    let controls = filterControls;
    controls.forEach((control) => {
      this.filterBillsForm.controls[control].setValue('');
    });
  }

  getSelectedFilterResults(res: PopupOutputModel): SearchBillReq {
    let data: SearchBillReq = new SearchBillReq();
    if (res.controls['billerName'].value.billCode) {
      data.searchBillCode = res.controls['billerName'].value.billCode;
    }
    if (res.controls['amountFrom'].value) {
      data.searchAmountFrom = res.controls['amountFrom'].value;
    }
    if (res.controls['amountTo'].value) {
      data.searchAmountTo = res.controls['amountTo'].value;
    }
    if (res.controls['referenceNumber'].value) {
      data.searchBillRef = res.controls['referenceNumber'].value;
    }
    if (res.controls['nickname'].value) {
      data.searchNickname = res.controls['nickname'].value;
    }
    if (res.controls['dateFrom'].value) {
      data.searchDateFrom = res.controls['dateFrom'].value;
    }
    if (res.controls['dateTo'].value) {
      data.searchDateTo = res.controls['dateTo'].value;
    }

    return data;
  }

  openDeletePopup() {
    this.popupService
      .showPopup({
        image: 'assets/img/warning.svg',
        form: getDeleteBillsForm(),
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: PopupOutputModel) => {
        if (res.buttonId == 'delete') {
          this.popupService.dismiss();
          this.deleteSelectedBills(this.getControl(0, 0, 'billTable').value);
        } else {
          this.popupService.dismiss();
        }
      });
  }

  deleteSelectedBills(selectedBills: any) {
    let billDeleteReqs: BillDeleteReq = { billsToDelete: [] };
    selectedBills.forEach((value: any) => {
      billDeleteReqs.billsToDelete.push({
        billCode: value.billCode,
        billCodeSelected: value.billCode,
        billReference: value.billRef.trim(),
      });
    });
    this.billPaymentService.deleteBills(billDeleteReqs).subscribe({
      next: () => {
        this.alert = {
          id: 'delete-bills',
          type: 'Success',
          message: 'payments.delete-bill.delete-successfully',
          showClose: true,
        };
        this.getBillList(history.state.billRef);
      },
      error: (error: ResponseException) => {
        this.alert = {
          id: 'delete',
          type: 'Critical',
          message: error.message,
          showClose: true,
        };
      },
    });
  }

  override onResultChanged(data: FormResult[]): void {
    let valid = true;
    data.forEach((item) => {
      valid = valid && item.valid;
    });
    for (const button of this.endButtons) {
      button.isDisable = !valid;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
