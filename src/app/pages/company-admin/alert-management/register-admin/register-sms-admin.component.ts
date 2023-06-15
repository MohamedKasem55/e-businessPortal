import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormResult, PageModel } from "app/@core/model/dto/formModel";
import { ResultModal } from "app/@core/model/dto/result.modal";
import { ResponseException } from "app/@core/service/base/responseException";
import { SmsAlertService } from "app/@core/service/company-admin/alert-mangement/sms-alert.service";
import { FormButtonClickOutput } from "app/shared/form/form.component";
import { SummaryModel } from "arb-design-library/model/summary.model";
import { CompanyAdminBaseComponent } from "../../company-admin-base/company-admin-base.component";
import { TitleModel } from "arb-design-library/model/title.model";
import {
  getAlertManagementButton,
  getDashboardButton,
  getUserBaseCancelButton,
  getUserBaseConfirmButton,
  getUserBasePageTitle
} from "../../company-admin-base/company-admin-base.controls";
import { ButtonModel } from "arb-design-library/model/button.model";
import { SmsAlertSoloPropertyRes } from "app/@core/model/rest/company-admin/alert-management/sms-solo-property-res";
import { SmsRegistrationReq, UserData } from "app/@core/model/rest/company-admin/alert-management/sms-register-req";
import { getAdminAccountSummaryForm } from "./register-sms-admin-controls";
import { UserProfileService } from "app/@core/service/user-profile/user-profile.service";
import { Account } from "app/@core/model/rest/common/account";

@Component({
  selector: 'app-alert-management-register-admin',
  templateUrl: '../../company-admin-base/company-admin-base.component.html',
  styleUrls: []
})
export class AlertManagmentAdminRegisterationComponent extends CompanyAdminBaseComponent implements OnInit {


  soloPropertyRes!: SmsAlertSoloPropertyRes;
  override pageTitle: TitleModel = getUserBasePageTitle();
  override confirmButton: ButtonModel = getUserBaseConfirmButton();

  cancelButton: ButtonModel = getUserBaseCancelButton();
  alertManagementButton: ButtonModel = getAlertManagementButton();
  dashboardButton: ButtonModel = getDashboardButton();
  selectedAccount!: Account;

  constructor(
    public override router: Router,
    private alertService: SmsAlertService,
    private userProfileService: UserProfileService) {
    super();
    this.setBreadcrumb([
      {
        text: 'company-admin.name',
        url: '/company-admin',
      },
      {
        text: 'company-admin.alert-management.alert-management-name',
        url: '/company-admin/alert-management',
        queryParams: { type: 'subscribed' }
      },
      {
        text: 'company-admin.alert-management.sms-register',
        url: ''
      }
    ]);

    this.pageTitle.id = "alert-management-register-admin";
    this.pageTitle.showArrow = true;
    this.pageTitle.title = "company-admin.alert-management.sms-register";
    this.pageTitle.stepper!.steps = ["", ""];

    this.endButtons = [this.confirmButton];
    this.endButtons[0].isDisable = false;
    this.startButtons = [this.cancelButton];
  }

  ngOnInit(): void {
    this.soloPropertyRes = JSON.parse(JSON.stringify(history.state))
    if (!this.soloPropertyRes.user) {
      this.router
        .navigate(['/company-admin/alert-management'], { queryParams: { type: 'subscribed' } })
        .then(() => {
        });
    }
    this.drawPages();
  }


  drawPages() {

    this.userProfileService.getSARAccountList().subscribe(data => {

      if (data.listAlertsPermissionAccount.length > 0) {
        this.selectedAccount = data.listAlertsPermissionAccount[0];
      }
      let page: PageModel = new PageModel(1);
      page.addForm(getAdminAccountSummaryForm());
      this.pages.push(page);
      this.getControl(0, 0, "accountDetailsTitle").controlOptions.title = this.soloPropertyRes.user.userName
      this.getControl(0, 0, "accountDetailsTitle").controlOptions.subTitle = this.soloPropertyRes.user.userId
      this.getControl(0, 0, "mobileNumber").setValue(this.soloPropertyRes.user.mobileNumber);
      this.getControl(0, 0, "fees").setValue(this.soloPropertyRes.user.userFee);
      this.getControl(0, 0, "maxSmsCount").setValue(this.soloPropertyRes.user.maxSmsCount);
      this.getControl(0, 0, "registrationDate").setValue(this.soloPropertyRes.user.registrationDate);
      this.getControl(0, 0, "expiryDate").setValue(this.soloPropertyRes.user.expiryDate);
      this.endButtons[0].showLoading = false;
      this.endButtons[0].isDisable = false;
    })
  }

  override onResultChanged(data: FormResult[]): void {
    let valid = true;
    data.forEach(item => {
      valid = valid && item.valid;
    })
    this.endButtons[0].isDisable = !valid;
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput): void {
    console.log(formButtonClickOutput.buttonId);
    switch (formButtonClickOutput.buttonId) {
      case 'Confirm':
        this.nextClick();
        break;
      case 'Back':
      case 'arrowTitle':
        this.backClick();
        break;
      case 'AlertManagement':
        this.router
          .navigate(['/company-admin/alert-management'], { queryParams: { type: 'subscribed' } })
          .then(() => {
          });
        break;
      case 'Cancel':
        this.router
          .navigate(['/company-admin'])
          .then(() => {
          });
        break;
      case 'Dashboard':
        this.router
          .navigate(['/dashboard'])
          .then(() => {
          });
        break;
    }
  }

  nextClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.confirmRenewal();
        break;
    }
  }

  backClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.router
          .navigate(['/company-admin/alert-management-sms-register'])
          .then(() => {
          });
        break;
    }
  }

  buildRenewalReq(): SmsRegistrationReq {
    let reUserList = [] as UserData[];

    let user: UserData = {
      fees: this.soloPropertyRes.user.userFee,
      user: {
        userPk: this.soloPropertyRes.user.userPk,
        userId: this.soloPropertyRes.user.userId,
        userName: this.soloPropertyRes.user.userName,
        mobile: this.soloPropertyRes.user.mobileNumber,
        email: this.soloPropertyRes.user.email
      }
    }
    reUserList.push(user)
    return {
      accountSelected: this.selectedAccount,
      usersListData: reUserList
    }

  }

  confirmRenewal() {
    this.alertService.addSMSRegisterRequest(this.buildRenewalReq()).subscribe(
      {
        next: (res) => {
          this.stepperMoveNext();
          this.endButtons = [];
          this.startButtons = [];
          this.summary = {};
          let allStatusFaild = false;
          let statusFaildCount = 0;
          res.usersSelectedOk.forEach(item => {
            if (item.status === "999") {
              allStatusFaild = true;
              statusFaildCount = statusFaildCount + 1;
            }
          });
          if (statusFaildCount === 1) {
            this.result = this.fillErrorResult("Operation Not Available Now");
          } else {
            this.result = this.fillSuccessResult(1);
          }
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


  fillSummary(showEditButton: boolean = true): SummaryModel {
    this.startButtons = [this.dashboardButton];
    this.endButtons = [this.alertManagementButton];
    return {
      title: {
        id: 'SummaryTitle',
        title: 'public.summary',
      },
      sections: [
        {
          title: {
            id: 'company-admin-1',
            title: 'company-admin.name',
            subTitle: 'Id: ' + this.soloPropertyRes.user.userId,
            startButtons: showEditButton ? [this.editButton] : [],
          },
          items: [
            {
              title: 'company-admin.alert-management.name',
              subTitle: this.soloPropertyRes.user.userName,
            },
            {
              title: 'company-admin.alert-management.mobile-number',
              subTitle: this.soloPropertyRes.user.mobileNumber,
            },
            {
              title: 'company-admin.alert-management.fee',
              subTitle: this.soloPropertyRes.user.userFee.toString(),
            },
            {
              title: 'public.account',
              subTitle: this.selectedAccount.fullAccountNumber,
            },
            {
              title: 'company-admin.alert-management.max-sms-count',
              subTitle: this.soloPropertyRes.user.maxSmsCount.toString(),
            },
            {
              title: 'company-admin.alert-management.reg-date',
              subTitle: this.soloPropertyRes.user.registrationDate,
            },
            {
              title: 'company-admin.alert-management.expiry-date',
              subTitle: this.soloPropertyRes.user.expiryDate,
            }

          ]
        }
      ]
    }
  }

  fillSuccessResult(sucessCount: number): ResultModal {
    return {
      type: 'Success',
      title: "company-admin.alert-management.sms-service",
      subTitle: this.translate.instant("company-admin.alert-management.sub-admin-sucess"),
      summary: this.fillSummary(false),
    };
  }

  fillErrorResult(errString: string): ResultModal {
    return {
      type: 'Error',
      title: errString,
      summary: this.fillSummary(false),
    };
  }
}
