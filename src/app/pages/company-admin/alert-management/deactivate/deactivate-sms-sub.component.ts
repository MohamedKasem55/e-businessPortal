import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormResult, PageModel } from "app/@core/model/dto/formModel";
import { ResultModal } from "app/@core/model/dto/result.modal";
import { SmsAlertListRes } from "app/@core/model/rest/company-admin/alert-management/sms-alert-list-res";
import { SmsDeactivateReq } from "app/@core/model/rest/company-admin/alert-management/sms-deactivate-req";
import { ResponseException } from "app/@core/service/base/responseException";
import { SmsAlertService } from "app/@core/service/company-admin/alert-mangement/sms-alert.service";
import { FormButtonClickOutput } from "app/shared/form/form.component";
import { TableHeaderType } from "arb-design-library";
import { SummaryTable } from "arb-design-library/model/summary-section.model";
import { SummaryModel } from "arb-design-library/model/summary.model";
import { TableHeaderModel } from "arb-design-library/model/table-header.model";
import { selectedDeactivateSMSUserForm } from "./deactivate-sms-sub-controls";
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

@Component({
  selector: 'app-alert-management-deactivate',
  templateUrl: '../../company-admin-base/company-admin-base.component.html',
  styleUrls: []
})
export class AlertManagmentDeactivateComponent extends CompanyAdminBaseComponent implements OnInit {


  override pageTitle: TitleModel = getUserBasePageTitle();
  override backButton: ButtonModel = getUserBaseBackButton();
  override nextButton: ButtonModel = getUserBaseNextButton();
  override confirmButton: ButtonModel = getUserBaseConfirmButton();
  override editButton: ButtonModel = getUserBaseEditConfirmButton();
  override deleteButton: ButtonModel = getUserBaseDeleteButton();

  cancelButton: ButtonModel = getUserBaseCancelButton();
  alertManagementButton: ButtonModel = getAlertManagementButton();
  dashboardButton: ButtonModel = getDashboardButton();

  selectedDetails!: SmsAlertListRes;

  headers: TableHeaderModel[] = []

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
        queryParams: { type: 'subscribed' }
      },
      {
        text: 'company-admin.alert-management.deactivate-subscription',
        url: ''
      },
    ]);

    this.pageTitle.id = "alert-management-deactivate";
    this.pageTitle.showArrow = true;
    this.pageTitle.title = "company-admin.alert-management.deactivate-subscription";
    this.pageTitle.endButtons = []
    this.pageTitle.stepper!.steps = ["", "", ""];


    this.endButtons = [this.cancelButton, this.confirmButton];
    this.endButtons[0].isDisable = false;
    this.startButtons = [];

    this.headers = [
      {
        type: TableHeaderType.TEXT,
        title: "company-admin.alert-management.user-id",
        fieldName: "userId"
      },
      {
        type: TableHeaderType.TEXT,
        title: "company-admin.alert-management.name",
        fieldName: "userName"
      },
      {
        type: TableHeaderType.TEXT,
        title: "company-admin.alert-management.mobile-number",
        fieldName: "mobileNumber"
      },
      {
        type: TableHeaderType.CHECK_BOX,
        title: "company-admin.alert-management.alert-privilage",
        fieldName: "alertPrivilegesFlag",
        //mapObject: privilegeMapping,
      },
      {
        type: TableHeaderType.DATE_TEXT,
        title: "company-admin.alert-management.reg-date",
        fieldName: "registrationDate",
        controlOptions: { format: "dd/MM/yyyy" }
      },
      {
        type: TableHeaderType.DATE_TEXT,
        title: "company-admin.alert-management.renewal-date",
        fieldName: "renewalDate",
        controlOptions: { format: "dd/MM/yyyy" }
      },
      {
        type: TableHeaderType.DATE_TEXT,
        title: "company-admin.alert-management.expiry-date",
        fieldName: "expiryDate",
        controlOptions: { format: "dd/MM/yyyy" }
      }
    ]

  }

  ngOnInit(): void {
    this.selectedDetails = JSON.parse(JSON.stringify(history.state))
    if (!this.selectedDetails.reportList) {
      this.router
        .navigate(['/company-admin/alert-management'], { queryParams: { type: 'subscribed' } })
        .then(() => {
        });
    }
    this.drawPages();
  }


  drawPages() {
    this.stepperMoveNext();
    //this.stepperMoveNext();
    let page: PageModel = new PageModel(2);
    page.addForm(selectedDeactivateSMSUserForm());
    this.pages.push(page);
    this.pages[0].forms[0].controls['selectedUserTable'].controlOptions.data = this.selectedDetails.reportList;
    this.pages[0].forms[0].controls['selectedUserTable'].controlOptions.count = this.selectedDetails.reportList.length;

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
      case 'Dashboard':
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

  nextClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 2:
        this.confirmDeactivate();
        break;
    }
  }

  backClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        break;
      case 2:
        this.router
          .navigate(['/company-admin/alert-management'], { queryParams: { type: 'subscribed' } })
          .then(() => {
          });
        break;
      case 3:
        break;
    }
  }

  buildDeactivateReq(): SmsDeactivateReq {
    return {
      reportList: this.selectedDetails.reportList
    }

  }

  confirmDeactivate() {

    this.alertService.addSMSDeactivateRequest(this.buildDeactivateReq()).subscribe(
      {
        next: (res) => {
          this.stepperMoveNext();
          this.endButtons = [];
          this.startButtons = [];
          this.summary = {};
          this.result = this.fillSuccessResult();
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


  fillSummary(): SummaryModel {
    this.pageTitle.title = "Deactivate Subscription";
    return {
      title: {
        id: 'SummaryTitle',
        title: 'public.summary',
      },
      sections: [
        {
          table: this.getSummaryTable(this.selectedDetails.reportList, this.headers),
        }
      ]
    }
  }

  getSummaryTable(data: any, headers: TableHeaderModel[]): SummaryTable {
    return {
      columnId: "batchPk",
      headers: headers,
      maxDisplayRow: 5,
      isDisabled: true,
      data,
    }
  }

  fillSuccessResult(): ResultModal {
    this.endButtons = [this.alertManagementButton];
    this.startButtons = [this.dashboardButton];
    return {
      type: 'Success',
      title: "company-admin.alert-management.sms-service",
      subTitle: this.translate.instant("company-admin.alert-management.deactivates-sucess", { "0": this.selectedDetails.reportList.length }),
      summary: this.fillSummary(),
    };
  }

  fillErrorResult(errString: string): ResultModal {
    this.endButtons = [this.alertManagementButton];
    this.startButtons = [this.dashboardButton];
    return {
      type: 'Error',
      title: errString,
      summary: this.fillSummary(),
    };
  }
}
