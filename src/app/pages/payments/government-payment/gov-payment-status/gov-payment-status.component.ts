import { Component, OnInit } from '@angular/core';
import { SummaryModel } from 'arb-design-library/model/summary.model';
import { ResultModal } from 'app/@core/model/dto/result.modal';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { ValidateResModel } from 'app/@core/model/rest/cards/user-approval/validate-res.model';
import { ResponseException } from 'app/@core/service/base/responseException';
import { ActivatedRoute } from '@angular/router';
import { PaymentBaseComponent } from '../../payment-base/payment-base.component';
import {
  getPaymentStatusForm,
  getPaymentSummaryForm,
} from './gov-payment-status-control';
import { ModelAndListService } from 'app/@core/service/base/modelAndList.service';
import { BatchItem } from 'app/@core/model/rest/payments/user-approval/government-user-approval-res';
import { DatePipe } from '@angular/common';
import { GovPaymentDeleteReq } from 'app/@core/model/rest/payments/gov-payment/gov-payment-delete-req';
import { GovPaymentService } from 'app/@core/service/payments/gov-payments/gov-payment.service';
import { FormButtonClickOutput } from '../../../../shared/form/form.component';
import { PageModel } from '../../../../@core/model/dto/formModel';

@Component({
  selector: 'app-card-reject',
  templateUrl: '../../payment-base/payment-base.component.html',
  styleUrls: [],
})
export class GovPaymentStatusComponent
  extends PaymentBaseComponent
  implements OnInit
{
  paymentDetails!: BatchItem;
  validateResponse!: ValidateResModel;
  StatusMapper: any;
  eGovApplicationTypeMapper: any;
  eGovSadadServiceTypeMapper: any;
  eGovProcessTransactionTypeMapper: any;

  override deleteButton: ButtonModel = {
    id: 'Delete',
    text: 'public.delete',
    type: 'danger',
  };

  deleteConfirmButton: ButtonModel = {
    id: 'DeleteConfirm',
    text: 'public.confirm',
    type: 'primary',
  };
  initiateButton: ButtonModel = {
    id: 'Initiate',
    text: 'status.initiate',
    type: 'primary',
  };

  constructor(
    private route: ActivatedRoute,
    private modelAndListService: ModelAndListService,
    private datePipe: DatePipe,
    private govPaymentService: GovPaymentService
  ) {
    super();

    this.setBreadcrumb([
      {
        text: 'payments.payment',
        url: 'payments',
      },
      {
        text: 'payments.userApproval.payment-user-approval',
        url: decodeURIComponent('payments/approval?type=government-payments'),
      },
      {
        text: 'public.status',
        url: '',
      },
    ]);

    this.pageTitle.id = 'complete-details';
    this.pageTitle.title = 'public.details';
    this.pageTitle.stepper = {
      steps: ['', '', ''],
      stepCounter: 1,
      stepText: 'public.step',
      ofText: 'public.of',
    };
    this.pageTitle.showArrow = true;
    this.pageTitle.endButtons = [];
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.paymentDetails = JSON.parse(JSON.stringify(history.state));
    if (!this.paymentDetails.batchPk) {
      this.router.navigateByUrl('payments/approval?type=government-payments');
    }
    this.StatusMapper = {
      P: this.translate.instant('payments.userApproval.pending'),
      A: this.translate.instant('payments.userApproval.approved'),
      R: this.translate.instant('payments.userApproval.rejected'),
    };
    this.modelAndListService
      .getList(['eGovApplicationTypeAll', 'eGovSadadType', 'eGovProcess'])
      .subscribe((data) => {
        this.eGovApplicationTypeMapper = data['eGovApplicationTypeAll'];
        this.eGovSadadServiceTypeMapper = data['eGovSadadType'];
        this.eGovProcessTransactionTypeMapper = data['eGovProcess'];
        this.drawPage();

        this.getControl(0, 0, 'transactionType').setValue(
          this.eGovProcessTransactionTypeMapper[
            this.paymentDetails.transactionType
          ]
        );
        this.getControl(0, 0, 'serviceType').setValue(
          this.eGovSadadServiceTypeMapper[this.paymentDetails.serviceType]
        );
        this.getControl(0, 0, 'applicationType').setValue(
          this.eGovApplicationTypeMapper[this.paymentDetails.applicationType]
        );
        this.getControl(0, 0, 'initiatedBy').setValue(
          this.paymentDetails.securityLevelsDTOList[0].updater
        );
        this.getControl(0, 0, 'initiatedDate').setValue(
          this.datePipe.transform(
            this.paymentDetails.initiationDate,
            'MM/dd/YYYY'
          )
        );
        this.getControl(0, 0, 'initiatedTime').setValue(
          this.datePipe.transform(
            this.paymentDetails.initiationDate,
            'h:mm:ss a'
          )
        );
        this.getControl(0, 0, 'status').setValue(
          this.StatusMapper[this.paymentDetails.status]
        );
        this.getControl(0, 0, 'amount').setValue(this.paymentDetails.amount);
        this.getControl(0, 0, 'account').setValue(
          this.paymentDetails.accountAlias +
            ' ' +
            this.paymentDetails.accountNumber
        );
        this.getControl(0, 0, 'refrenceNumber').setValue(
          this.paymentDetails.paymentId
        );
        this.getControl(0, 0, 'sponsorId').setValue(this.getSponsorId());

        this.getControl(0, 1, 'currentLevel').setValue(
          this.getCurrentLevelForGivenAccount()
        );
        this.getControl(0, 1, 'nextLevel').setValue(
          this.getNextLevelForGivenAccount()
        );
      });
  }

  getSponsorId(): string {
    return this.paymentDetails.details && this.paymentDetails.details.length > 0
      ? this.paymentDetails.details[0].value
      : '';
  }

  drawPage() {
    this.pages = [];
    this.pages = [
      new PageModel(
        1,
        getPaymentSummaryForm(this.translate, this.paymentDetails),
        getPaymentStatusForm(this.translate, this.paymentDetails)
      ),
    ];

    this.addEndButtons();

    //this.getAndFillAccountList();
    //this.registerChangeValueEvents();
    //this.setDefaultValueWhileAtInitialization()
  }

  addEndButtons() {
    this.endButtons = [];
    if (this.paymentDetails.status == 'A') {
      this.endButtons.push(this.deleteButton);
    } else if (this.paymentDetails.status == 'R') {
      this.endButtons.push(this.deleteButton);
      this.endButtons.push(this.initiateButton);
    }
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    super.onButtonClick(formButtonClickOutput);

    switch (formButtonClickOutput.buttonId) {
      case 'Back':
        this.onClickBackButton();
        break;
      case 'arrowTitle':
        this.onClickBackButton();
        break;
      case 'Confirm':
        break;
      case 'Delete':
        this.onClickDeleteButtonActionWithSteperOne();
        break;
      case 'DeleteConfirm':
        this.onClickConfirmDeleteButton(formButtonClickOutput.buttonId);
        break;
    }
  }

  onClickBackButton() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.router.navigateByUrl('payments/approval?type=government-payments');
        break;
      case 2:
        this.stepperMoveBack();
        this.addEndButtons();
        break;
    }
  }

  getCurrentLevelForGivenAccount(): string {
    let currentLevels: any[] = [];
    if (this.paymentDetails.pdfSecurityLevelsDTOList.length > 0) {
      this.paymentDetails.pdfSecurityLevelsDTOList.forEach((element: any) => {
        if (element.status === 'I' || element.status === 'A') {
          const textLevel = this.translate.instant('public.level');
          const level = element.level;
          currentLevels.push(textLevel + level);
        }
      });
    }
    if (currentLevels.length == 0) {
      return '-';
    } else {
      return currentLevels ? currentLevels.join() : '';
    }
  }

  getNextLevelForGivenAccount(): string {
    let nextLevels: any[] = [];
    if (this.paymentDetails.pdfSecurityLevelsDTOList.length > 0) {
      this.paymentDetails.pdfSecurityLevelsDTOList.forEach((element: any) => {
        if (element.status === 'P') {
          const textLevel = this.translate.instant('public.level');
          const level = element.level;
          nextLevels.push(textLevel + level);
        }
      });
    }

    if (nextLevels.length == 0) {
      return '-';
    } else {
      return nextLevels ? nextLevels.join() : '';
    }
  }

  onClickDeleteButtonActionWithSteperOne() {
    this.stepperMoveNext();
    this.summary = this.fillSummary();
    this.endButtons = [this.deleteConfirmButton];
  }

  onClickConfirmDeleteButton(id: string) {
    this.govPaymentService
      .deleteGovPayment(this.buildpDeleteRequest())
      .subscribe({
        next: (res) => {
          this.summaryResult(false, '');
        },
        error: (error: ResponseException) => {
          this.summaryResult(true, error.ErrorResponse.errorDescription!);
        },
      });
  }

  buildpDeleteRequest(): GovPaymentDeleteReq {
    return {
      batch: this.paymentDetails,
    };
  }

  summaryResult(error: boolean, errorMessage: string) {
    this.stepperMoveNext();
    this.endButtons = [];
    this.startButtons = [];
    this.summary = {};
    this.result = error
      ? this.fillErrorResult(errorMessage)
      : this.fillSuccessResult();
  }

  fillSuccessResult(): ResultModal {
    return {
      type: 'Success',
      title: 'payments.userApproval.govStatus.success',
      subTitle: '',
      summary: this.fillSummary(),
    };
  }

  fillErrorResult(errString: string): ResultModal {
    return {
      type: 'Error',
      title: errString,
      summary: this.fillSummary(),
    };
  }

  fillSummary(): SummaryModel {
    return {
      sections: [
        {
          title: {
            id: 'paymentSummary',
            title: 'payments.userApproval.govStatus.paymentSummary',
          },
          items: [
            {
              title: 'payments.userApproval.govStatus.transactiontype',
              subTitle: this.getControl(0, 0, 'transactionType').value,
            },
            {
              title: 'payments.userApproval.govStatus.serviceType',
              subTitle: this.getControl(0, 0, 'serviceType').value,
            },
            {
              title: 'payments.userApproval.govStatus.applicationtype',
              subTitle: this.getControl(0, 0, 'applicationType').value,
            },
            {
              title: 'payments.userApproval.govStatus.initiatedBy',
              subTitle: this.getControl(0, 0, 'initiatedBy').value,
            },
            {
              title: 'payments.userApproval.govStatus.initiatedDate',
              subTitle: this.getControl(0, 0, 'initiatedDate').value,
            },
            {
              title: 'payments.userApproval.govStatus.initiatedTime',
              subTitle: this.getControl(0, 0, 'initiatedTime').value,
            },
            {
              title: 'payments.userApproval.govStatus.referenceNumber',
              subTitle: this.getControl(0, 0, 'refrenceNumber').value,
            },
            {
              title: 'payments.userApproval.govStatus.sponsorId',
              subTitle: this.getControl(0, 0, 'sponsorId').value,
            },
            {
              title: 'payments.userApproval.govStatus.numberVisa',
              subTitle: this.getControl(0, 0, 'numberOfVisa').value,
            },
            {
              title: 'payments.userApproval.govStatus.status',
              subTitle: this.getControl(0, 0, 'status').value,
            },
            {
              title: 'payments.userApproval.govStatus.account',
              subTitle: this.getControl(0, 0, 'account').value,
            },
            {
              title: 'payments.userApproval.govStatus.amount',
              subTitle: this.getControl(0, 0, 'amount').value,
            },
          ],
        },
        {
          title: {
            id: 'paymentStatus',
            title: 'payments.userApproval.govStatus.status',
          },
          items: [
            {
              title: 'payments.userApproval.govStatus.currentLevel',
              subTitle: this.getControl(0, 1, 'currentLevel').value,
            },
            {
              title: 'payments.userApproval.govStatus.nextLevel',
              subTitle: this.getControl(0, 1, 'nextLevel').value,
            },
          ],
        },
      ],
    };
  }
}
