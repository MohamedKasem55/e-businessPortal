import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { PillControl } from "app/@core/model/dto/control/pill-control";
import { SummaryItemControl } from "app/@core/model/dto/control/sumery-item-control";
import { FormModel, FormResult, PageModel } from "app/@core/model/dto/formModel";
import { ResultModal } from "app/@core/model/dto/result.modal";
import { SmsAlertListRes } from "app/@core/model/rest/company-admin/alert-management/sms-alert-list-res";
import { SmsRenewalReq } from "app/@core/model/rest/company-admin/alert-management/sms-renewal-req";
import { ResponseException } from "app/@core/service/base/responseException";
import { SmsAlertService } from "app/@core/service/company-admin/alert-mangement/sms-alert.service";
import { FormButtonClickOutput } from "app/shared/form/form.component";
import { SummarySectionModel } from "arb-design-library/model/summary-section.model";
import { SummaryModel } from "arb-design-library/model/summary.model";
import { getAccountForm, pillControl, summaryControl, summaryCurrentControl } from "./renew-sms-subscription-controls";
import { CompanyAdminBaseComponent } from "../../company-admin-base/company-admin-base.component";
import { TitleModel } from "arb-design-library/model/title.model";
import {
  getAlertManagementButton,
  getDashboardButton,
  getUserBaseBackButton, getUserBaseConfirmButton, getUserBaseDeleteButton, getUserBaseEditConfirmButton,
  getUserBaseNextButton,
  getUserBasePageTitle
} from "../../company-admin-base/company-admin-base.controls";
import { ButtonModel } from "arb-design-library/model/button.model";

@Component({
  selector: 'app-alert-management-renew',
  templateUrl: '../../company-admin-base/company-admin-base.component.html',
  styleUrls: []
})
export class AlertManagmentRenewalComponent extends CompanyAdminBaseComponent implements OnInit {

  selectedDetails!: SmsAlertListRes;

  override pageTitle: TitleModel = getUserBasePageTitle();
  override backButton: ButtonModel = getUserBaseBackButton();
  override nextButton: ButtonModel = getUserBaseNextButton();
  override confirmButton: ButtonModel = getUserBaseConfirmButton();
  override editButton: ButtonModel = getUserBaseEditConfirmButton();
  override deleteButton: ButtonModel = getUserBaseDeleteButton();
  alertManagementButton: ButtonModel = getAlertManagementButton();
  dashboardButton: ButtonModel = getDashboardButton();

  constructor(
    public override router: Router,
    private alertService: SmsAlertService,) {
    super();
    this.startButtons = [this.backButton];
    this.endButtons = [this.nextButton];
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
        text: 'company-admin.alert-management.renew-subscription',
        url: ''
      },
    ]);

    this.pageTitle.id = "alert-management-renew";
    this.pageTitle.showArrow = true;
    this.pageTitle.title = "company-admin.alert-management.renew-subscription";
    this.pageTitle.endButtons = []
    this.pageTitle.stepper!.steps = ["", "", ""];


    this.endButtons = [this.proceedButton];
    this.endButtons[0].isDisable = false;
    this.startButtons = [];
  }

  ngOnInit(): void {
    this.selectedDetails = JSON.parse(JSON.stringify(history.state))
    if (!this.selectedDetails.reportList) {
      this.router
        .navigate(['/company-admin/alert-management'], { queryParams: { type: 'expired' } })
        .then(() => {
        });
    }
    this.drawPages();
  }


  drawPages() {
    let page: PageModel = new PageModel(1);
    page.addForm(getAccountForm());

    this.selectedDetails.reportList.forEach((item, index) => {
      let form = new FormModel({
        id: 'alert-management-renewal-' + (index + 1),
        showDivider: true,
        controls: {
          "pillControl": new PillControl(structuredClone(pillControl)),
          "userIdSummaryControl": new SummaryItemControl(structuredClone(summaryControl)),
          "userNameSummaryControl": new SummaryItemControl(structuredClone(summaryControl)),
          "mobileNumberSummaryControl": new SummaryItemControl(structuredClone(summaryControl)),
          "maxSmsCountSummaryControl": new SummaryItemControl(structuredClone(summaryControl)),
          "subFeeSummaryControl": new SummaryItemControl(structuredClone(summaryCurrentControl)),
          "expiryDateSummaryControl": new SummaryItemControl(structuredClone(summaryControl))
        },
      });
      form.controls["pillControl"].controlOptions.text = "User" + " #" + (index + 1);
      form.controls["userIdSummaryControl"].label = "company-admin.alert-management.user-id";
      form.controls["userIdSummaryControl"].setValue(item.userId);
      form.controls["userNameSummaryControl"].label = "company-admin.alert-management.name";
      form.controls["userNameSummaryControl"].setValue(item.userName);

      form.controls["mobileNumberSummaryControl"].label = "company-admin.alert-management.mobile-number";
      form.controls["mobileNumberSummaryControl"].setValue(item.mobileNumber);

      form.controls["maxSmsCountSummaryControl"].label = "company-admin.alert-management.max-sms-count";
      form.controls["maxSmsCountSummaryControl"].setValue(this.selectedDetails.maxSmsEachReg);

      form.controls["subFeeSummaryControl"].label = "company-admin.alert-management.sub-fee";
      form.controls["subFeeSummaryControl"].setValue(this.selectedDetails.feeAmountEachReg);

      form.controls["expiryDateSummaryControl"].label = "company-admin.alert-management.expiry-date";
      form.controls["expiryDateSummaryControl"].setValue(item.expiryDate);
      page.addForm(form);
    });
    this.pages.push(page);

    this.pages[0].forms[0].controls['fromAccount'].controlOptions.options = this.selectedDetails.listAccountSAR;
    this.pages[0].forms[0].controls['amountForEachSubscribtion'].setValue(this.selectedDetails.feeAmountEachReg);
    this.endButtons[0].showLoading = false;
    this.endButtons[0].isDisable = false;
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
      case 'Proceed':
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
      case 'Payments':
        this.router.navigateByUrl('/payments');
        break;
      case 'AlertManagement':
        this.router
          .navigate(['/company-admin/alert-management'], { queryParams: { type: 'subscribed' } })
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
        this.attachedAccountNumber();
        break;
      case 2:
        this.confirmRenewal();
        break;
    }
  }

  backClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.router
          .navigate(['/company-admin/alert-management'], { queryParams: { type: 'expired' } })
          .then(() => {
          });
        break;
      case 2:
        this.stepperMoveBack();
        this.endButtons = [this.proceedButton];
        this.startButtons = [];
        break;
      case 3:
        break;
    }
  }

  attachedAccountNumber() {
    this.stepperMoveNext();
    this.endButtons = [this.confirmButton];
    this.startButtons = [this.backButton];
    this.summary = this.fillSummary();
    window.scrollTo(0, 0);
  }

  buildRenewalReq(): SmsRenewalReq {
    return {
      acc: this.getControl(0, 0, "fromAccount").value,
      listReports: this.selectedDetails.reportList
    }

  }

  confirmRenewal() {
    this.alertService.addSMSRenewalRequest(this.buildRenewalReq()).subscribe(
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
          if (statusFaildCount === this.selectedDetails.reportList.length) {
            this.result = this.fillErrorResult("Operation Not Available Now");
          } else {
            this.result = this.fillSuccessResult(this.selectedDetails.reportList.length - statusFaildCount);
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
    this.selectedDetails.reportList.forEach((item, index) => {
      totalAmount += this.selectedDetails.feeAmountEachReg;
      sections.push(
        {
          title: {
            id: 'alertManagementTitle' + (index + 1),
            title: item.userName,
            subTitle: this.translate.instant('company-admin.alert-management.user-id') + " " + item.userId,
            startButtons: showEditButton ? [this.editButton] : [],
          },
          items: [
            {
              title: 'public.account',
              subTitle: this.getControl(0, 0, "fromAccount").value.fullAccountNumber,
            },
            {
              title: 'company-admin.alert-management.mobile-number',
              subTitle: item.mobileNumber,
            },
            {
              title: 'company-admin.alert-management.max-sms-count',
              subTitle: this.selectedDetails.maxSmsEachReg.toString(),
            },
            {
              title: 'company-admin.alert-management.expiry-date',
              subTitle: item.expiryDate,
            },
            {
              title: 'company-admin.alert-management.sub-fee',
              subTitle: this.selectedDetails.feeAmountEachReg.toString(),
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
      subTitle: this.translate.instant("company-admin.alert-management.renew-sucess", { "0": sucessCount }),
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
