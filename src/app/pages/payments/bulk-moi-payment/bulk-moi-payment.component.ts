import {Component, OnInit} from '@angular/core';
import {FormResult, PageModel} from 'app/@core/model/dto/formModel';
import {ResultModal} from 'app/@core/model/dto/result.modal';
import {AccountsReq} from 'app/@core/model/rest/accounts/accounts-req';
import {Account} from 'app/@core/model/rest/common/account';
import {
  GenerateChallengeAndOTP,
  RequestValidate,
} from 'app/@core/model/rest/common/otp.model';
import {
  AlienControlReq,
  BulkMoiPaymentAlienControlReq,
  BulkMoiPaymentConfirmReq,
} from 'app/@core/model/rest/payments/bulk-moi-payment/bulk-moi-payment-req';
import {BulkMoiPaymentTableData} from 'app/@core/model/rest/payments/bulk-moi-payment/bulk-moi-payment-res';
import {AccountsCommonService} from 'app/@core/service/accounts/accounts-common.service';
import {ModelAndListService} from 'app/@core/service/base/modelAndList.service';
import {ResponseException} from 'app/@core/service/base/responseException';
import {VerificationService} from 'app/@core/service/base/verification.service';
import {BulkMoiPaymentService} from 'app/@core/service/payments/bulk-moi-payments/bulk-moi-payment.service';
import {FormButtonClickOutput} from 'app/shared/form/form.component';
import {SummaryTable} from 'arb-design-library/model/summary-section.model';
import {SummaryModel} from 'arb-design-library/model/summary.model';
import {TableHeaderModel} from 'arb-design-library/model/table-header.model';
import {PaymentBaseComponent} from '../payment-base/payment-base.component';
import {
  AccountsForm,
  getEndButtons,
  PaymentOptionsForm,
  summaryHeaders,
  UploadBulkMoiPaymentTemplate,
} from './bulk-moi-payment-control';
import {take} from 'rxjs';
import {Utils} from '../../../@core/utility/Utils';

@Component({
  selector: 'app-bulk-moi-payment',
  templateUrl: '../payment-base/payment-base.component.html',
  styleUrls: [],
})
export class BulkMoiPaymentComponent
  extends PaymentBaseComponent
  implements OnInit {
  payload: AccountsReq = {
    order: '',
    orderType: '',
    page: 1,
    rows: 50,
    txType: 'ECIA',
  };
  uploadedFile!: File;
  selectedAccount!: Account;
  generateChallengeAndOTP!: GenerateChallengeAndOTP;
  applicationsType: { key: string; value: string }[] = [];
  applicationType: string = '';
  jobsCategory: { key: string; value: string }[] = [];
  jobCategory: string = '';
  jobCategoryCode!: number | undefined;
  fileData!: any;
  tableDataReq: AlienControlReq[] = [];
  listsParams!: BulkMoiPaymentAlienControlReq;
  data!: BulkMoiPaymentTableData[];
  batchData!: any;
  amount: number = 0;
  sponsorId: number | undefined = 0;
  iqamaDuration: string | undefined = '';
  payloadData: AlienControlReq[] = [];
  fullData!: any;
  isValidFile: boolean = false;
  batchRes!: any;
  allowFillSum: boolean = false;
  public columns = [
    'ServiceCode',
    'JobCategoryCode',
    'ServiceName',
    'IqamaID',
    'IqamaDuration',
    'VisaDuration',
    'SponsorID',
    'JobCategory',
    'Amount',
  ];

  constructor(
    private account: AccountsCommonService,
    private bulkMoiPaymentService: BulkMoiPaymentService,
    private otpService: VerificationService,
    private modelAndListService: ModelAndListService
  ) {
    super();

    this.setBreadcrumb([
      {
        text: 'payments.name',
        url: '/payments',
      },
      {
        text: 'payments.bulk-payment.title',
        url: '/payments/bulk-payment',
      },
    ]);
    this.pageTitle.id = 'BulkMoiPaymentTitle';
    this.pageTitle.title = 'payments.bulk-payment.new-bulk-payment';
    this.pageTitle.stepper!.steps = ['', '', ''];
    this.pageTitle.endButtons = [];
    this.endButtons = [getEndButtons()[0], this.nextButton];

    this.modelData();
    this.drawPage();
  }

  drawPage() {
    this.account.getSarAccounts().subscribe((accounts) => {
      this.pages = [];
      this.pages = [
        new PageModel(
          1,
          PaymentOptionsForm(),
          AccountsForm(accounts.listAlertsPermissionAccount),
          UploadBulkMoiPaymentTemplate()
        ),
      ];
      this.getControl(0, 1, 'fromAccount').valueChanges.subscribe((val) => {
        this.selectedAccount = val.value;
      });
      this.getControl(0, 2, 'bulkPaymentTemplate').valueChanges.subscribe(
        (val) => {
          this.uploadedFile = val.value;
        }
      );
    });
  }

  override onResultChanged(data: FormResult[]) {
    this.endButtons[1].isDisable = !data[1].valid || !data[2].valid;
    if (data[1].valid && data[2].valid) {
      this.isValidFile = false;
      this.getFileData(this.uploadedFile);
    }
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'Next':
        this.nextClick();
        break;
      case 'Confirm':
        this.nextClick();
        break;
      case 'cancel':
        this.pages = [];
        void this.router.navigate(['/payments']);
        break;
      case 'Back':
        this.backClick();
        break;
      case 'goToDashboard':
        this.setBreadcrumb([]);
        void this.router.navigate(['/dashboard']);
        break;
      case 'createNewBulkPayment':
        this.pages = [];
        void this.router.navigate(['/payments']);
        break;
      case 'download':
        const params: { name: string } = {name: 'MOI-Bulk_payment-en.xlsx'};
        this.bulkMoiPaymentService.downloadTemplate(params);
        break;
    }
  }

  nextClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.getPayloadData();
        this.stepperMoveNext();
        break;
      case 2:
        this.generateChallengeAndOTP &&
        this.generateChallengeAndOTP.typeAuthentication
          ? this.showOtp()
          : this.confirmBulkPayment();
        break;
      case 3:
        break;
    }
  }

  fillSummary(): SummaryModel {
    let dataList: any[] = [];
    this.summary = {};
    this.data = [];

    this.batchData.forEach((item: any) => {
      this.applicationsType.find((appType: { key: any; value: string }) => {
        if (appType.key == item.applicationType) {
          this.applicationType = appType.value;
        }
      });

      this.tableDataReq.find((element) => {
        if (element.iqamaId == item.details[0].value) {
          item.amount = element?.amount;
          this.sponsorId = element?.sponsorId || undefined;
          this.iqamaDuration = element?.iqamaDuration || undefined;
          this.jobCategoryCode = element?.jobCategory || undefined;
        }
      });

      const object = {
        applicationsType: this.applicationType,
        account: item.accountNumber,
        iqamaId: item.details[0].value,
        visaDuration: item.details[1].value,
        sponsorId: this.sponsorId,
        jobCategory: this.jobCategoryCode,
        amount: item.amount,
      };
      dataList.push(object);
    });

    this.data = dataList;

    this.summary = {
      title: {
        id: 'summaryTitle',
        title: 'payments.bulk-payment.payment-datails',
      },
      sections: [
        {
          table: this.getSummaryTableData(
            this.data,
            summaryHeaders(this.applicationsType, this.jobsCategory)
          ),
        },
      ],
    };
    return this.summary;
  }

  getSummaryTableData(data: any, headers: TableHeaderModel[]): SummaryTable {
    return {
      columnId: 'batchPk',
      headers: headers,
      maxDisplayRow: 5,
      data,
    };
  }

  getPayloadData() {
    this.batchData = [];
    this.bulkMoiPaymentService
      .bulkMoiPaymentSummary(this.payloadData)
      .subscribe({
        next: (res) => {
          this.batchData = res.batch;
          this.setAmount();

          if (res) {
            this.validateBulkPayment();
          }
        },
        error: (error: ResponseException) => {
        },
      });
  }

  validateBulkPayment() {
    this.bulkMoiPaymentService
      .bulkMoiPaymentValidate(this.batchData)
      .subscribe({
        next: (res: any) => {
          this.generateChallengeAndOTP = res.generateChallengeAndOTP;
          this.batchRes = res;
          this.fillSummary();
        },
        error: (error: ResponseException) => {
        },
      });
  }

  setAmount() {
    this.batchData.forEach((item: any) => {
      this.tableDataReq.forEach((data: any) => {
        item.amount = data.amount;
        item.fees = this.setFess(data.applicationType, data.amount);
      });
    });
  }

  setFess(applicationType: any, amount: any) {
    let fees = [
      {
        batch: null,
        egovSadadFeesPk: null,
        feeAmount: amount,
        feeType: '',
      },
    ];
    switch (applicationType) {
      case '002':
        fees[0].feeType = 'Issue Iqamah Fees';
        break;
      case '003':
        fees[0].feeType = 'Renew Iqamah Fees';
        break;
      case '004':
        fees[0].feeType = 'Issue Single Exit/reentry Visa';
        break;
      case '005':
        fees[0].feeType = 'Issue multiple exit/reentry visa';
        break;
    }
    return fees;
  }

  showOtp() {
    this.otpService
      .showVerification(this.generateChallengeAndOTP)
      .subscribe((requestValidate: RequestValidate) => {
        this.confirmBulkPayment(requestValidate);
      });
  }

  confirmBulkPayment(requestValidate?: RequestValidate) {
    this.stepperMoveNext();

    this.bulkMoiPaymentService
      .bulkMoiPaymentConfirm(
        this.returnRequestConfirmBulkPayment(requestValidate)
      )
      .subscribe({
        next: (res: any) => {
          this.startButtons = [];
          this.endButtons = [getEndButtons()[1], getEndButtons()[2]];
          this.result = this.fillSuccessResult();
        },
        error: (error: ResponseException) => {
          this.startButtons = [];
          this.endButtons = [getEndButtons()[1], getEndButtons()[2]];
          this.summary = {};
          this.result = this.fillErrorResult(
            error.ErrorResponse.errorDescription!
          );
        },
      });
  }

  returnRequestConfirmBulkPayment(
    requestValidate?: RequestValidate
  ): BulkMoiPaymentConfirmReq {
    let payload = {
      batchList: this.batchRes.batchList,
      requestValidate: requestValidate ? requestValidate : {},
    };
    return payload;
  }

  fillSuccessResult(): ResultModal {
    return {
      type: this.batchRes.batchList.toAuthorize?.length ? 'Pending' : 'Success',
      title: this.batchRes.batchList.toAuthorize?.length ? 'payments.aramco-payment.peandingAuthMessage' : 'payments.bulk-payment.success-msg',
      summary: this.summary,
    };
  }

  fillErrorResult(errString: string): ResultModal {
    return {
      type: 'Error',
      title: errString,
      summary: this.summary,
    };
  }

  backClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        void this.router.navigate(['/payments']);
        break;
      case 2:
        this.stepperMoveBack();
        this.summary = {};
        this.data = [];
        this.payloadData = [];
        this.tableDataReq = [];
        break;
    }
  }

  getFileData(file: File) {
    this.fullData = {};
    this.tableDataReq = [];
    let payload = {};

    this.fileData = Utils.convertExcelToJson(file, this.columns).then(
      (result: any) => {
        result.forEach((row: any) => {
          if (row.IqamaID && row.Amount) {
            this.isValidFile = true;
          }

          if (row.IqamaID) {
            this.fullData = {
              accountNumber: this.selectedAccount.fullAccountNumber,
              serviceType: row.ServiceCode.split('-', 2)[0],
              applicationType: row.ServiceCode.split('-', 2)[1],
              transactionType: 'P',
              iqamaId: row.IqamaID,
              amount: row.Amount,
              visaDuration: row.VisaDuration,
              jobCategory: row.JobCategory,
              iqamaDuration: row.IqamaDuration,
              sponsorId: row.SponsorID,
            };

            payload = {
              accountNumber: this.fullData.accountNumber,
              serviceType: this.fullData.serviceType,
              applicationType: this.fullData.applicationType,
              transactionType: this.fullData.transactionType,
              iqamaId: this.fullData.iqamaId,
              amount: this.fullData.amount,
              visaDuration: this.fullData.visaDuration,
            };

            this.payloadData.push(payload as any);
            this.tableDataReq.push(this.fullData);
          }
        });
      }
    );
  }

  modelData() {
    this.modelAndListService
      .getList(['eGovApplicationTypeAll', 'eGovSadadJobCategory'])
      .pipe(take(1))
      .subscribe((res) => {
        this.applicationsType = this.objectToKeyValue(
          res.eGovApplicationTypeAll
        );
        this.jobsCategory = this.objectToKeyValue(res.eGovSadadJobCategory);
      });
  }
}
