import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { PillControl } from "app/@core/model/dto/control/pill-control";
import { SummaryItemControl } from "app/@core/model/dto/control/sumery-item-control";
import { FormModel, FormResult, PageModel } from "app/@core/model/dto/formModel";
import { ResultModal } from "app/@core/model/dto/result.modal";
import { SmsAlertListRes, SmsAlertUser } from "app/@core/model/rest/company-admin/alert-management/sms-alert-list-res";
import { ResponseException } from "app/@core/service/base/responseException";
import { SmsAlertService } from "app/@core/service/company-admin/alert-mangement/sms-alert.service";
import { FormButtonClickOutput } from "app/shared/form/form.component";
import { SummarySectionModel } from "arb-design-library/model/summary-section.model";
import { SummaryModel } from "arb-design-library/model/summary.model";
import { getAccountForm, pillControl, unsubscribedUserForm, summaryControl, summaryCurrencyControl, getSubscribeSmsMessagesButton } from "./register-sms-controls";
import { CompanyAdminBaseComponent } from "../../company-admin-base/company-admin-base.component";
import { TitleModel } from "arb-design-library/model/title.model";
import {
  getAlertManagementButton,
  getDashboardButton,
  getUserBaseBackButton, getUserBaseCancelButton, getUserBaseConfirmButton, getUserBaseDeleteButton, getUserBaseEditConfirmButton,
  getUserBaseNextButton,
  getUserBasePageTitle
} from "../../company-admin-base/company-admin-base.controls";
import { ButtonModel } from "arb-design-library/model/button.model";
import { SmsAlertSoloPropertyRes } from "app/@core/model/rest/company-admin/alert-management/sms-solo-property-res";
import { SmsRegistrationReq, UserData } from "app/@core/model/rest/company-admin/alert-management/sms-register-req";

@Component({
  selector: 'app-alert-management-register',
  templateUrl: '../../company-admin-base/company-admin-base.component.html',
  styleUrls: []
})
export class AlertManagmentRegisterationComponent extends CompanyAdminBaseComponent implements OnInit {

  override pageTitle: TitleModel = getUserBasePageTitle();
  override backButton: ButtonModel = getUserBaseBackButton();
  override nextButton: ButtonModel = getUserBaseNextButton();
  override confirmButton: ButtonModel = getUserBaseConfirmButton();
  override editButton: ButtonModel = getUserBaseEditConfirmButton();

  cancelButton: ButtonModel = getUserBaseCancelButton();
  alertManagementButton: ButtonModel = getAlertManagementButton();
  subSMSMessagesButton: ButtonModel = getSubscribeSmsMessagesButton();
  dashboardButton: ButtonModel = getDashboardButton();
  
  selectedDetails!: SmsAlertListRes;
  soloPropertyRes!: SmsAlertSoloPropertyRes;
  selectedRows!: SmsAlertUser[];
  responseFormService!: SmsAlertListRes;
  reqParams: any = {};
  containsOperatorFields: string[] = ["userId", "userName", "mobileNumber"]
  fieldMapping = new Map<string, string>([
    ["userId", "userId"],
    ["userName", "userName"],
    ["mobileNumber", "mobileNumber"]])
  constructor(
    public override router: Router,
    private alertService: SmsAlertService,) {
    super();
    this.setBreadcrumb([
      {
        text: 'company-admin.name',
        url: '/company-admin',
      },
      {
        text: 'company-admin.alert-management.alert-management-name',
        url: '/company-admin/alert-management',
        queryParams: { type: 'expired' }
      },
      {
        text: 'company-admin.alert-management.register',
        url: ''
      },
    ]);

    this.pageTitle.id = "alert-management-register";
    this.pageTitle.showArrow = true;
    this.pageTitle.title = "company-admin.alert-management.alert-management-name";
    this.pageTitle.endButtons = []
    this.pageTitle.stepper!.steps = ["", "", "", ""];
    this.endButtons = [this.subSMSMessagesButton];
    this.startButtons = [];

    this.pages = [new PageModel(1, unsubscribedUserForm())];
    this.fatechAndSetBeneficiaryTableDataSource();
    this.registerBeneficiaryTableEventListeners();
    this.endButtons[0].isDisable = false;

  }

  registerBeneficiaryTableEventListeners() {
    this.getControl(0, 0, "unsubscribedUserTable").valueChanges.subscribe(value => {
      this.selectedRows = value.value;
      this.endButtons[0].isDisable = this.selectedRows.length <= 0;
    });
  }

  fatechAndSetBeneficiaryTableDataSource() {
   
    this.alertService.getSmsUnsubscribedUserList().subscribe({
      next: data => {
        this.responseFormService = data;
        this.getControl(0, 0, "unsubscribedUserTable").controlOptions.data = data.reportList;
        this.getControl(0, 0, "unsubscribedUserTable").controlOptions.total = data.reportList.length
        this.getControl(0, 0, "unsubscribedUserTable").controlOptions.title = this.pageTitle.title
        this.endButtons[0].showLoading = false;
      },
      error: () => {
        this.getControl(0, 0, "unsubscribedUserTable").controlOptions.data = [];
      }
    });

  }

  ngOnInit(): void {

  }


  drawPages() {

    if (this.pages[1]) {
      this.pages[1].deleteFrom(0, this.pages[1].forms.length);
      this.pages.splice(1, 1);
    }

    let page: PageModel = new PageModel(2);
    page.addForm(getAccountForm());
    let totalFee = 0;
    this.selectedRows.forEach((item, index) => {
      let form = new FormModel({
        id: 'alert-management-register-' + (index + 1),
        showDivider: true,
        controls: {
          "pillControl": new PillControl(structuredClone(pillControl)),
          "userIdSummaryControl": new SummaryItemControl(structuredClone(summaryControl)),
          "userNameSummaryControl": new SummaryItemControl(structuredClone(summaryControl)),
          "mobileNumberSummaryControl": new SummaryItemControl(structuredClone(summaryControl)),
          "subFeeSummaryControl": new SummaryItemControl(structuredClone(summaryCurrencyControl)),
        },
      });
      totalFee += item.userFee;
      form.controls["pillControl"].controlOptions.text = "User" + " #" + (index + 1);

      form.controls["userIdSummaryControl"].label = "company-admin.alert-management.user-id";
      form.controls["userIdSummaryControl"].setValue(item.userId);

      form.controls["userNameSummaryControl"].label = "company-admin.alert-management.name";
      form.controls["userNameSummaryControl"].setValue(item.userName);

      form.controls["mobileNumberSummaryControl"].label = "company-admin.alert-management.mobile-number";
      form.controls["mobileNumberSummaryControl"].setValue(item.mobileNumber);

      form.controls["subFeeSummaryControl"].label = "company-admin.alert-management.fee";
      form.controls["subFeeSummaryControl"].setValue(item.userFee);

      page.addForm(form);
    });
    this.pages.push(page);

    this.pages[1].forms[0].controls['fromAccount'].controlOptions.options = this.responseFormService.listAccountSAR;
    this.pages[1].forms[0].controls['totalFee'].setValue(totalFee);
    this.endButtons[0].showLoading = false;
    this.endButtons[0].isDisable = false;
    this.endButtons = [this.nextButton];
    this.startButtons = [this.cancelButton];
    this.stepperMoveNext();

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
      case 'SubSMSMessages':
      case 'Next':
        this.nextClick();
        break;
      case 'Confirm':
        this.nextClick();
        break;
      case 'Back':
      case 'arrowTitle':
      case 'Edit':
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
        this.drawPages();
        break;
      case 2:
        this.validateUser();
        break;
      case 3:
        this.confirmRenewal();
        break;
    }
  }

  backClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.router
          .navigate(['/company-admin/alert-management'], { queryParams: { type: 'subscribed' } })
          .then(() => {
          });
        break;
      case 2:
        this.stepperMoveBack();
        this.endButtons = [this.subSMSMessagesButton];
        this.startButtons = [];
        break;
      case 3:
        this.stepperMoveBack();
        this.endButtons = [this.nextButton];
        this.startButtons = [this.cancelButton];
        break;
    }
  }

  validateUser() {

    this.alertService.getSoloProperty().subscribe(
      {
        next: (res) => {
          this.soloPropertyRes = res;
          this.stepperMoveNext();
          this.endButtons = [this.backButton, this.confirmButton];
          this.startButtons = [this.cancelButton];
          this.summary = this.fillSummary(false);
          window.scrollTo(0, 0);

        },
        error: (error: ResponseException) => {
          this.stepperMoveNext();
          this.stepperMoveNext();
          this.endButtons = [];
          this.startButtons = [];
          this.summary = {};
          this.result = this.fillErrorResult(error.ErrorResponse.errorDescription!);
          window.scrollTo(0, 0);
        }
      })


  }

  buildRenewalReq(): SmsRegistrationReq {
    let reUserList = [] as UserData[];
    this.selectedRows.forEach((item) => {
      let user: UserData = {
        fees: item.userFee,
        user: {
          userPk: item.userPk,
          userId: item.userId,
          userName: item.userName,
          mobile: item.mobileNumber,
          email: item.email
        }
      }
      reUserList.push(user)
    });

    return {
      accountSelected: this.getControl(1, 0, "fromAccount").value,
      usersListData: reUserList
    }

  }

  confirmRenewal() {
    this.alertService.addSMSRegisterRequest(this.buildRenewalReq()).subscribe(
      {
        next: (res) => {
          this.stepperMoveNext();
          this.endButtons = [this.alertManagementButton];
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
          if (statusFaildCount === this.selectedRows.length) {
            this.result = this.fillErrorResult("Operation Not Available Now");
          } else {
            this.result = this.fillSuccessResult(this.selectedRows.length - statusFaildCount);
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
    let sections: SummarySectionModel[] = [];
    let totalAmount = 0;
    this.selectedRows.forEach((item, index) => {
      let fee = 0
      if(this.soloPropertyRes.user && this.soloPropertyRes.user.userId == item.userId){
        fee = this.soloPropertyRes.user.userFee
      } else {
        fee = item.userFee;
      }

      totalAmount += fee;
      sections.push(
        {
          pill: {
            text: 'company-admin.alert-management.user'+'#' + (index + 1),
            type: 'Neutral'
          },
          items: [
            {
              title: 'company-admin.alert-management.user-id',
              subTitle: item.userId,
            },
            {
              title: 'company-admin.alert-management.name',
              subTitle: item.userName,
            },
            {
              title: 'public.account',
              subTitle: this.getControl(1, 0, "fromAccount").value.fullAccountNumber,
            },
            {
              title: 'company-admin.alert-management.mobile-number',
              subTitle: item.mobileNumber,
            },
            {
              title: 'company-admin.alert-management.fee',
              subTitle: fee.toString(),
              currency: '608'
            },
            {
              title: 'company-admin.alert-management.max-sms-count',
              subTitle: this.soloPropertyRes.user ? this.soloPropertyRes.user.maxSmsCount : item.maxSmsCount,
            }
          ]
        });
    });
    return {
      title: {
        id: 'SummaryTitle',
        title: 'public.summary',
        subTitle: 'public.total-amount',
        amount: totalAmount.toString(),
        currency: 'SAR'
      },
      sections: sections
    }
  }

  fillSuccessResult(sucessCount: number): ResultModal {
    this.endButtons = [this.alertManagementButton];
    this.startButtons = [this.dashboardButton];
    return {
      type: 'Success',
      title: "company-admin.alert-management.sms-service",
      subTitle: this.translate.instant("company-admin.alert-management.sub-user-sucess", { "0": sucessCount }),
      summary: this.fillSummary(false),
    };
  }

  fillErrorResult(errString: string): ResultModal {
    this.endButtons = [this.alertManagementButton];
    this.startButtons = [this.dashboardButton];
    return {
      type: 'Error',
      title: errString,
      summary: this.fillSummary(false),
    };
  }

}
