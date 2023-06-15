import { Component, OnInit } from '@angular/core';
import { FormResult, PageModel } from 'app/@core/model/dto/formModel';
import {
  editTokenForm, getGoToDashboarButton, getTokenManagementBackButton, getTokenEditCancelButton, tokenStatusOptions
} from './edit-token-control';
import { CompanyAdminBaseComponent } from '../../company-admin-base/company-admin-base.component';
import { TokenManagmentService } from 'app/@core/service/company-admin/token-management/token-management.service';
import { Router } from '@angular/router';
import { TitleModel } from 'arb-design-library/model/title.model';
import { getUserBaseBackButton, getUserBaseNextButton, getUserBasePageTitle } from '../../company-admin-base/company-admin-base.controls';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { ValidateTokenOrderReq } from 'app/@core/model/rest/company-admin/token-management/validate-token-order-req';
import { ResponseException } from 'app/@core/service/base/responseException';
import { SummaryModel } from 'arb-design-library/model/summary.model';
import { ResultModal } from 'app/@core/model/dto/result.modal';
import { TokenAssignmentStatusRes } from 'app/@core/model/rest/company-admin/token-management/token-assignment-status-res';

@Component({
  selector: 'app-edit-token',
  templateUrl: '../../company-admin-base/company-admin-base.component.html',
  styleUrls: []
})
export class EditTokenComponent extends CompanyAdminBaseComponent implements OnInit {

  override pageTitle: TitleModel = getUserBasePageTitle();
  override backButton: ButtonModel = getUserBaseBackButton();
  override nextButton: ButtonModel = getUserBaseNextButton();

  tokenStatusDetails!: TokenAssignmentStatusRes;
  selectedTokenStatus!: any;

  constructor(
    public override router: Router,
    private tokenManagmentService: TokenManagmentService) {
    super();
  }

  ngOnInit(): void {
    this.tokenStatusDetails = JSON.parse(JSON.stringify(history.state))
    if (!this.tokenStatusDetails.assignmentStatus) {
      this.router.navigateByUrl("/company-admin/token-management");
    }
    this.drawPage();
  }

  drawPage() {
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
        text: "company-admin.token-management.edit-token-status",
        url: ''
      }
    ]);

    this.pageTitle.id = "edit-token";
    this.pageTitle.title = "company-admin.token-management.edit-token-status";
    this.pageTitle.showArrow = true;
    this.pageTitle.endButtons = [];
    this.pageTitle.stepper!.steps = ["", "", ""];
    this.endButtons = [getTokenEditCancelButton(), this.nextButton];
    this.startButtons = [this.backButton];
    this.pages = [new PageModel(1, editTokenForm())];

    let mapObj = Object.entries(tokenStatusOptions).map(([key, value]) => ({ key, value }));
    mapObj.forEach((item, index) => {
      if (item.key === this.tokenStatusDetails.assignmentStatus.tokenStatus) {
        mapObj.splice(index, 1)
      }
    })
    this.getControl(0, 0, "tokenNewStatus").controlOptions.options = mapObj;
    this.getControl(0, 0, "tokenSerialNumber").setValue(this.tokenStatusDetails.assignmentStatus.tokenSerialNumber);
    this.getControl(0, 0, "tokenType").setValue(this.tokenStatusDetails.assignmentStatus.tokenType);
    this.getControl(0, 0, "userId").setValue(this.tokenStatusDetails.assignmentStatus.userId);
    this.getControl(0, 0, "userName").setValue(this.tokenStatusDetails.assignmentStatus.userName);
    this.getControl(0, 0, "tokenCurrentStatus").setValue(this.tokenStatusDetails.assignmentStatus.tokenStatus);
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
        this.validateEditToken();
        break;
      case 2:
        this.confirmEditToken();
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
        this.endButtons = [getTokenEditCancelButton(), this.nextButton];
        break;
    }

  }

  validateEditToken() {
    this.stepperMoveNext();
    this.selectedTokenStatus = this.getControl(0, 0, "tokenNewStatus").value;
    this.endButtons = [getTokenEditCancelButton(), this.confirmButton];
    this.startButtons = [this.backButton];
    this.summary = this.fillSummary();
    window.scrollTo(0, 0);

  }

  confirmEditToken() {
    this.tokenManagmentService.updateTokenAssignmentStatus(
      this.tokenStatusDetails.assignmentStatus.tokenSerialNumber, this.selectedTokenStatus.key).subscribe(
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

  buildTokenOrderValidateReq(): ValidateTokenOrderReq {
    return {
      tokenNumber: this.getControl(0, 0, "softTokenCount").value,
      account: this.getControl(0, 0, "fromAccount").value.fullAccountNumber,
    }
  }

  fillSummary(showEditButton: boolean = true): SummaryModel {
    return {
      sections: [
        {
          title: {
            id: 'request-details',
            title: "public.summary",
          },
          items: [
            {
              title: 'company-admin.token-management.token-serial',
              subTitle: this.getControl(0, 0, "tokenSerialNumber").value,
            },
            {
              title: 'company-admin.token-management.token-status',
              subTitle: this.getControl(0, 0, "tokenCurrentStatus").value,
            },
            {
              title: 'company-admin.token-management.new-status',
              subTitle: this.selectedTokenStatus.displayText,
            },
            {
              title: 'company-admin.token-management.token-type',
              subTitle: this.getControl(0, 0, "tokenType").value,
            },
            {
              title: 'company-admin.token-management.user-id',
              subTitle: this.getControl(0, 0, "userId").value,
            },
            {
              title: 'company-admin.token-management.user-name',
              subTitle: this.getControl(0, 0, "userName").value,
            }
          ]
        }
      ]
    }
  }

  fillSuccessResult(): ResultModal {
    return {
      type: 'Success',
      title: 'company-admin.token-management.token-edit-sucess',
      subTitle: '' ,
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

}
