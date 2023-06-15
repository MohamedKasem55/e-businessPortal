import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormModel,
  FormResult,
  PageModel,
} from 'app/@core/model/dto/formModel';
import { AccountsCommonService } from 'app/@core/service/accounts/accounts-common.service';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { map } from 'rxjs';
import { PopupInputModel } from '../../../@core/model/dto/popup.model';
import { RequestValidate } from '../../../@core/model/rest/common/otp.model';
import { BillPayConfirmReq } from '../../../@core/model/rest/payments/billPayment/bill-pay-confirm-req';
import { BillPaymentValidateRes } from '../../../@core/model/rest/payments/billPayment/bill-payment-validate-res';
import {
  Bill,
  BulkBillReq,
} from '../../../@core/model/rest/payments/bulk-payment/bulk-bill-req';
import { PopupService } from '../../../@core/service/base/popup.service';
import { VerificationService } from '../../../@core/service/base/verification.service';
import { BulkPaymentService } from '../../../@core/service/payments/bulk-payment/bulk-payment.service';
import { Utils } from '../../../@core/utility/Utils';
import { PaymentBaseComponent } from '../payment-base/payment-base.component';
import {
  bulkPaymentOrganizationForm,
  getBulkErrorTable,
  getBulkPaymentForm,
  getEndButtons,
} from './bulk-payment-controls.component';

@Component({
  selector: 'app-bulk-payment',
  templateUrl: '../payment-base/payment-base.component.html',
  styleUrls: [],
})
export class BulkPaymentComponent
  extends PaymentBaseComponent
  implements OnInit
{
  branchName: string;
  profileNumber: string;
  getBulkPaymentForm = getBulkPaymentForm();
  public columns = ['billCode', 'billName', 'billRef', 'amount'];
  private uploadedFile: any;
  private bulkBillReq!: BulkBillReq;

  constructor(
    private accountsCommonService: AccountsCommonService,
    private bulkPaymentService: BulkPaymentService,
    private datePipe: DatePipe,
    private otpService: VerificationService,
    private popService: PopupService
  ) {
    super();
    this.setBreadcrumb([
      {
        text: 'payments.name',
        url: '/payments',
      },
      {
        text: 'payments.bulkPayment.title',
        url: '/payments/bulk-payment',
      },
    ]);
    this.branchName = JSON.parse(
      sessionStorage.getItem('company')!
    ).companyName;
    this.profileNumber = JSON.parse(
      sessionStorage.getItem('company')!
    ).profileNumber;
    this.pageTitle.id = 'bulkPaymentTitle';
    this.pageTitle.title = 'payments.bulkPayment.title';
    this.pageTitle.stepper!.steps = ['', '', ''];
    this.pageTitle.endButtons = [];
    this.pageTitle.showArrow = true;
    this.endButtons[0].showLoading = false;
    this.nextButton.isDisable = false;
    this.pages = [
      new PageModel(
        1,
        bulkPaymentOrganizationForm(this.branchName, this.profileNumber),
        this.getBulkPaymentForm
      ),
    ];
  }

  override ngOnInit(): void {
    this.getServicesInit();
  }

  getServicesInit() {
    this.accountsCommonService.getSarAccounts().subscribe((res) => {
      this.getControl(0, 1, 'selectAccount').controlOptions.options =
        res.listAlertsPermissionAccount;
      this.getControl(0, 1, 'uploadInvoice').valueChanges.subscribe((val) => {
        this.uploadedFile = val.value;
      });
    });
  }

  download() {
    this.bulkPaymentService
      .downloadTemplate()
      .pipe(
        map((res) => {
          let output: any = {};
          output.file = res;
          output.fileName = 'BulkBillPayment.xls';
          return output;
        })
      )
      .subscribe({
        next: (res: any) => {
          if (res) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(res.file);
            link.download = res.fileName;
            link.click();
            link.remove();
          }
        },
      });
  }

  override onResultChanged(data: FormResult[]): void {
    let valid = true;
    data.forEach((item) => {
      valid = valid && item.valid;
    });
    this.endButtons[0].isDisable = !valid;
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'Next':
        this.nextClick();
        break;
      case 'buttonDownloadTemplate':
        this.download();
        break;
      case 'UserApprovalStatus':
        this.router.navigate(['/payments/approval?type=bill']);
        break;
      case 'Back':
      case 'Edit':
        this.backClick();
        break;
      case 'Confirm':
        this.validateBulkPayment(false);
        break;
      case 'goToDashboard':
        this.router.navigate(['/dashboard']).then();
        break;
      case 'goToPayAnotherBills':
        this.router.navigate(['/payments']);
        break;
      case 'arrowTitle':
        this.pageTitle.stepper!.stepCounter > 1
          ? this.backClick()
          : this.router.navigate(['/payments']);
        break;
    }
  }

  nextClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.nextBulkPayment();
        break;
    }
  }

  nextBulkPayment() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        Utils.convertExcelToJson(this.uploadedFile, this.columns)
          .then((res: any[]) => {
            if (res) {
              let bills = [];
              let errorList = [];
              for (let x = 0; x < res.length; x++) {
                let item = res[x];
                if (item.billCode) {
                  if (!item.billRef || !item.amount) {
                    item.key = x + 1;
                    errorList.push(item);
                  } else {
                    item.amount = item.amount ? item.amount : 1;
                    item.nickname = '';
                    item.dueDate = this.datePipe.transform(
                      new Date(),
                      'yyyy-MM-dd'
                    );
                    let code = item.billCode.split('(');
                    item.billCode = code[code.length - 1].replace(')', '');
                    bills.push(item);
                  }
                } else {
                  if (
                    item.amount ||
                    item.billCode ||
                    item.billName ||
                    item.billRef
                  ) {
                    item.key = x + 1;
                    errorList.push(item);
                  }
                }
              }
              if (errorList.length > 0) {
                let formModel: FormModel = getBulkErrorTable();
                let data: PopupInputModel = {
                  title: 'payments.bulkPayment.error-table',
                  form: formModel,
                };
                formModel.controls['table'].controlOptions.data = errorList;
                this.popService.showPopup(data);
              } else {
                this.validateBulkPayment(true, bills);
              }
            }
          })
          .catch((err) => {});
        break;
    }
  }

  validateBulkPayment(inquiry: boolean, reqBills?: any[]) {
    if (inquiry && reqBills) {
      let bills: Bill[] = [];
      for (let x = 0; x < reqBills.length; x++) {
        let bill = reqBills[x];
        bills.push({
          amountPaid: bill.amount,
          dueDate: bill.dueDate,
          nickName: '',
          billCodeSelected: bill.billCode,
          billReference: bill.billRef,
        });
      }
      this.bulkBillReq = {
        accountNumber: this.getControl(0, 1, 'selectAccount').value
          .fullAccountNumber,
        billSelected: bills,
        emailChecked: '0',
      };
    }

    this.bulkPaymentService
      .validateAddBulkBill(this.bulkBillReq!, inquiry)
      .subscribe((res) => {
        this.endButtons = [this.confirmButton];

        if (inquiry) {
          this.summary = this.fillBillSummary(inquiry, res);
          this.stepperMoveNext();
        } else {
          this.summary = this.fillBillSummary(inquiry, res);
          if (res.generateChallengeAndOTP?.typeAuthentication) {
            this.otpService
              .showVerification(res.generateChallengeAndOTP)
              .subscribe((value) => {
                this.confirmBulkPayment(res, value);
              });
          } else {
            this.confirmBulkPayment(res);
          }
        }
      });
  }

  confirmBulkPayment(res?: BillPaymentValidateRes, value?: RequestValidate) {
    let req: BillPayConfirmReq = {
      batchListsContainer: res?.batchListsContainer,
      emailChecked: '0',
      requestValidate: {},
    };
    if (value) {
      req.requestValidate = value;
    }
    this.bulkPaymentService.confirmPayBill(req).subscribe(() => {
      this.result = {
        type:
          res?.batchListsContainer.toAuthorize?.length! > 0
            ? 'Pending'
            : 'Success',
        title:
          res?.batchListsContainer.toAuthorize?.length! > 0
            ? 'payments.aramco-payment.peandingAuthMessage'
            : 'payments.bulk-payment.success-msg',
        summary: this.summary,
      };
      this.endButtons = getEndButtons();
      this.startButtons = [];
      this.stepperMoveNext();
    });
  }
  backClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        void this.router.navigate(['/payments']);
        break;
      case 2:
        this.stepperMoveBack();
        break;
      case 3:
        this.stepperMoveBack();
        break;
    }
  }
}
