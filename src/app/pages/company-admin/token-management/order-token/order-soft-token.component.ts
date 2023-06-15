import { Component, OnInit } from '@angular/core';
import { FormResult, PageModel } from 'app/@core/model/dto/formModel';
import {
  accountDetailsForm, getGoToDashboarButton, getTokenManagementBackButton, getTokenOrderCancelButton
} from './order-soft-token-control';
import { CompanyAdminBaseComponent } from '../../company-admin-base/company-admin-base.component';
import { TokenManagmentService } from 'app/@core/service/company-admin/token-management/token-management.service';
import { Router } from '@angular/router';
import { PaginationListReq } from 'app/@core/model/rest/payments/pagination-list-req';
import { TitleModel } from 'arb-design-library/model/title.model';
import { getUserBaseBackButton, getUserBaseNextButton, getUserBasePageTitle } from '../../company-admin-base/company-admin-base.controls';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { VerificationService } from 'app/@core/service/base/verification.service';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { ValidateTokenOrderReq } from 'app/@core/model/rest/company-admin/token-management/validate-token-order-req';
import { ControlBase } from 'app/@core/model/dto/control/control.model';
import { UserProfileService } from 'app/@core/service/user-profile/user-profile.service';
import { ResponseException } from 'app/@core/service/base/responseException';
import { ValidateTokenOrderRes } from 'app/@core/model/rest/company-admin/token-management/validate-token-order-res';
import { SummaryModel } from 'arb-design-library/model/summary.model';
import { RequestValidate } from 'app/@core/model/rest/common/otp.model';
import { ConfirmTokenOrderReq } from 'app/@core/model/rest/company-admin/token-management/confirm-token-order-req';
import { ResultModal } from 'app/@core/model/dto/result.modal';

@Component({
  selector: 'app-order-soft-token',
  templateUrl: '../../company-admin-base/company-admin-base.component.html',
  styleUrls: []
})
export class OrderSoftTokenComponent extends CompanyAdminBaseComponent implements OnInit {

  override pageTitle: TitleModel = getUserBasePageTitle();
  override backButton: ButtonModel = getUserBaseBackButton();
  override nextButton: ButtonModel = getUserBaseNextButton();

  tokenManagementReq!: PaginationListReq;

  tokenOrderValidateResponse!: ValidateTokenOrderRes;

  constructor(
    public override router: Router,
    private userProfileService: UserProfileService,
    private tokenManagmentService: TokenManagmentService,
    private otpService: VerificationService) {

    super();
    this.setBreadcrumb([
      {
        text: "company-admin.name",
        url: '/company-admin'
      },
      {
        text: "company-admin.token-management.name",
        url: '/token-management'
      },
      {
        text: "company-admin.token-management.order-name",
        url: ''
      }
    ]);

    this.pageTitle.id = "order-token";
    this.pageTitle.title = "company-admin.token-management.order-title";
    this.pageTitle.showArrow = true;
    this.pageTitle.endButtons = [];
    this.pageTitle.stepper!.steps = ["", "", ""];
    this.endButtons = [getTokenOrderCancelButton(), this.nextButton];
    this.startButtons = [this.backButton];
    this.pages = [new PageModel(1, accountDetailsForm())];
    this.getAndFillAccountList(this.getControl(0, 0, "fromAccount"));

  }

  ngOnInit(): void {
  }


  override onResultChanged(data: FormResult[]): void {
    let valid = true;
    data.forEach(item => {
      valid = valid && item.valid;
    })
    this.endButtons[1].isDisable = !valid;
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    console.log(formButtonClickOutput.buttonId)
    switch (formButtonClickOutput.buttonId) {
      case 'Next':
      case 'Confirm':
        this.handleClickEventWRTSetp();
        break;
      case 'arrowTitle':
      case 'Back':
        this.backClick();
        break;
      case 'GoBackToTokenManagement':
        this.router
          .navigate(['/company-admin/token-management'])
          .then(() => {
          });
        break;
      case 'GoToDashBoard':
        this.router
          .navigate(['/dashboard'])
          .then(() => {
          });
        break;
      case 'Cancel':
        this.router
          .navigate(['/company-admin'])
          .then(() => {
          });
        break;
    }
  }

  handleClickEventWRTSetp() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.validateSinglePayment();
        break;
      case 2:

        if (this.tokenOrderValidateResponse.batch.futureStatus === "PROCESS") {
          this.showOtp();
        } else {
          this.confirmTokenOrder();
        }

        break;
    }
  }


  backClick() {
    console.log(this.pageTitle.stepper?.stepCounter);
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.router
          .navigate(['/company-admin/token-management'])
          .then(() => {
          });
        break;
      case 2:
        this.stepperMoveBack()
        this.endButtons = [getTokenOrderCancelButton(), this.nextButton];
        break;
    }

  }

  validateSinglePayment() {
    this.tokenManagmentService.orderTokenValidation(this.buildTokenOrderValidateReq()).subscribe(
      {
        next: (res) => {
          this.stepperMoveNext();
          this.tokenOrderValidateResponse = res;
          this.endButtons = [getTokenOrderCancelButton(), this.confirmButton];
          this.startButtons = [this.backButton];
          this.summary = this.fillSummary();
          window.scrollTo(0, 0);
        },
        error: (error: ResponseException) => {
          this.stepperMoveNext();
          this.endButtons = [];
          this.startButtons = [];
          this.summary = {};
          this.result = this.fillErrorResult(error.ErrorResponse.errorDescription!);
          window.scrollTo(0, 0);
        }
      })
  }

  confirmTokenOrder(requestValidate?: RequestValidate) {
    this.tokenManagmentService.orderTokenConfirmation(this.buildTokenOrdertConfirmReq(requestValidate)).subscribe(
      {
        next: (res) => {
          this.stepperMoveNext();
          this.endButtons = [getGoToDashboarButton(), getTokenManagementBackButton()];
          this.startButtons = [];
          this.summary = {};
          this.result = this.fillSuccessResult();
          window.scrollTo(0, 0);
        },
        error: (error: ResponseException) => {
          this.stepperMoveNext();
          this.endButtons = [getGoToDashboarButton(), getTokenManagementBackButton()];
          this.startButtons = [];
          this.summary = {};
          this.result = this.fillErrorResult(error.ErrorResponse.errorDescription!);
          window.scrollTo(0, 0);
        }
      })
  }

  buildTokenOrdertConfirmReq(requestValidate?: any): ConfirmTokenOrderReq {
    return {
      batch: this.tokenOrderValidateResponse.batch,
      requestValidate: requestValidate
    }
  }

  buildTokenOrderValidateReq(): ValidateTokenOrderReq {
    return {
      tokenNumber: this.getControl(0, 0, "softTokenCount").value,
      account: this.getControl(0, 0, "fromAccount").value.fullAccountNumber,
    }
  }

  getAndFillAccountList(control: ControlBase<any>, accountNumber?: string) {
    this.userProfileService.getSARAccountList().subscribe(data => {
      control.controlOptions.options = data.listAlertsPermissionAccount;
      if (data.listAlertsPermissionAccount.length > 0) {

        if (accountNumber) {
          let matchAccount = data.listAlertsPermissionAccount.find((obj) => {
            return obj.fullAccountNumber === accountNumber;
          });
          control.setValue(matchAccount ? matchAccount : data.listAlertsPermissionAccount[0]);
        } else {
          control.setValue(data.listAlertsPermissionAccount[0]);
        }
      }
    })
  }

  fillSummary(showEditButton: boolean = true): SummaryModel {
    return {
      sections: [
        {
          title: {
            id: 'request-details',
            title: "company-admin.token-management.request-details",
          },
          items: [
            {
              title: 'company-admin.token-management.num-soft-token',
              subTitle: this.getControl(0, 0, "softTokenCount").value,
            },
            {
              title: 'public.account',
              subTitle: this.getControl(0, 0, "fromAccount").value.fullAccountNumber
            }
          ]
        }, {
          title: {
            id: 'total-ammount',
            title: "public.total-amount",
          },
          items: [
            {
              title: 'company-admin.token-management.total-fee',
              subTitle: this.tokenOrderValidateResponse.batch.totalAmount.toString(),
              currency: "608"
            }
          ]
        }
      ]
    }
  }

  fillSuccessResult(): ResultModal {
    return {
      type: 'Success',
      title: this.isPendingAuthorization() ? 'payments.aramco-payment.peandingAuthMessage' : 'company-admin.token-management.order-token-sucess',
      subTitle: "",
      summary: undefined,
    };
  }

  fillErrorResult(errString: string): ResultModal {
    return {
      type: 'Error',
      title: errString,
      summary: undefined
    };
  }

  showOtp() {
    this.otpService.showVerification(structuredClone(this.tokenOrderValidateResponse.generateChallengeAndOTP)).subscribe((requestValidate: RequestValidate) => {
      this.confirmTokenOrder(requestValidate);
    });
  }

  isPendingAuthorization(): boolean {
    return this.tokenOrderValidateResponse.batch.futureStatus === "PENDING";
  }

}
