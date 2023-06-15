import {TransactionFollowBase} from "../../../../../shared/transaction-follow-base/transaction-follow-base";
import {Component} from "@angular/core";
import {PopupInputModel, PopupOutputModel} from "../../../../../@core/model/dto/popup.model";
import {
  createBaseCheckerPageTitle,
  getBasicModel,
  getChangeWorkflowForm,
  getChangeWorkflowPopupForm,
  getKeepCurrentTypeButton,
  getMakerCheckerModel,
  getRecommendationMakerCheckerWarning,
  getWorkflowModel
} from "./change-workflow-controls";
import {CompanyUserList} from "../../../../../@core/model/rest/company-admin/user-management/users-list-res";
import {ButtonModel} from "arb-design-library/model/button.model";
import {PopupService} from "../../../../../@core/service/base/popup.service";
import {
  ChangeWorkflowService
} from "../../../../../@core/service/company-admin/workflow/change-workflow/change-workflow.service";
import {VerificationService} from "../../../../../@core/service/base/verification.service";
import {Utils} from "../../../../../@core/utility/Utils";
import {
  AuthenticationOperation,
  CompanyWorkflowTypeEnum
} from "../../../../../@core/model/rest/company-admin/workflow/company-workflow-type-enum";
import {
  ValidateChangeWorkflowRes
} from "../../../../../@core/model/rest/company-admin/workflow/change-workflow/validate-change-workflow-res";
import {GenericFeatureListModel} from "arb-design-library/model/generic-feature-list.model";
import {
  ValidateChangeWorkflowReq
} from "../../../../../@core/model/rest/company-admin/workflow/change-workflow/validate-change-workflow-req";
import {RequestValidate} from "../../../../../@core/model/rest/common/otp.model";
import {
  ChangeWorkflowReq,
  CompanyWorkFlowUserConfiguration
} from "../../../../../@core/model/rest/company-admin/workflow/change-workflow/change-workflow-req";
import {ResponseException} from "../../../../../@core/service/base/responseException";
import {ResultModal} from "../../../../../@core/model/dto/result.modal";
import {FormButtonClickOutput} from "../../../../../shared/form/form.component";
import {PageModel} from "../../../../../@core/model/dto/formModel";
import {
  GenericFeatureListGroupControl
} from "../../../../../@core/model/dto/control/generic-feature-list-group-control";
import {COM_AD, COM_AD_WORKFLOW_MAKER_CHECKER} from "../../../../../@core/constants/pages-urls-constants";
import {
  CompanyWorkflowEligible
} from "../../../../../@core/model/rest/company-admin/workflow/change-workflow/company-eligible-workflow-res";
import {
  UserManagementService
} from "../../../../../@core/service/company-admin/user-management/users-managment.service";
import {ControlBase} from "../../../../../@core/model/dto/control/control.model";

@Component({
  selector: 'change-workflow-base',
  templateUrl: './change-workflow-base.component.html',
})
export class ChangeWorkflowBaseComponent extends TransactionFollowBase {

  eligibleWorkflows: CompanyWorkflowEligible[] = [];
  userSelection!: string;
  changeWorkflowPopup: PopupInputModel = getChangeWorkflowPopupForm();
  data: CompanyUserList[] = [];
  companyWorkflowType!: CompanyWorkflowTypeEnum;
  validateChangeWorkflowRes!: ValidateChangeWorkflowRes;
  basicModel: GenericFeatureListModel = getBasicModel();
  makerCheckerModel: GenericFeatureListModel = getMakerCheckerModel();
  workflowModel: GenericFeatureListModel = getWorkflowModel();
  changeWorkflowForm = getChangeWorkflowForm();
  override endButtons: ButtonModel[] = [];
  override startButtons: ButtonModel[] = [];
  recommended: boolean = false;
  recommendedType!: CompanyWorkflowEligible;


  constructor(public popupService: PopupService,
              public changeWorkflowService: ChangeWorkflowService,
              public otpService: VerificationService,
              public userManagementService: UserManagementService,
  ) {
    super();
    this.pageTitle = createBaseCheckerPageTitle();
    Utils.setBreadcrumb([
      {
        text: 'company-admin.name',
        url: '/company-admin',
      },
      {
        text: 'workflow.change-workflow',
        url: 'change-workflow'
      },
    ]);
    this.changeWorkflowService.getCompanyEligibleWorkflow().subscribe(value => {
      this.eligibleWorkflows = value.eligibleWorkflows;
      this.companyWorkflowType = value.currentCompanyWF;
      this.setFeatureListModel();
    });
  }

  setFeatureListModel() {
    if (sessionStorage.getItem("recommendWorkflow")) {
      this.recommended = JSON.parse(sessionStorage.getItem("recommendWorkflow")!);
    }

    for (let type of this.eligibleWorkflows) {
      switch (type.companyWorkflowType) {
        case CompanyWorkflowTypeEnum.BASIC:
          this.setCurrentWorkflow(type, this.basicModel, 'workflow.currentIsBasic');
          break;
        case CompanyWorkflowTypeEnum.MAKER_CHECKER:
          this.setCurrentWorkflow(type, this.makerCheckerModel, 'workflow.currentIsCheckerMaker');
          break;
        case CompanyWorkflowTypeEnum.WORKFLOW:
          this.setCurrentWorkflow(type, this.workflowModel, 'workflow.currentIsWorkflow');
          break;
      }
    }

    this.pages.push(new PageModel(1, getChangeWorkflowForm()));
    let list = (this.pages[0].forms[0].controls['changeWorkflow'] as GenericFeatureListGroupControl);
    list.controlOptions.list.push(this.basicModel, this.makerCheckerModel, this.workflowModel);
    this.recommended ? this.checkRecommendation() : null;
  }

  checkRecommendation() {
    if (this.recommended) {
      let list = (this.pages[0].forms[0].controls['changeWorkflow'] as GenericFeatureListGroupControl);
      this.eligibleWorkflows?.forEach(type => {
        if (type.recommended) {
          list.controlOptions.selectedHint = 'workflow.recommendedWorkflow';
          switch (type.companyWorkflowType) {
            case CompanyWorkflowTypeEnum.BASIC:
              this.basicModel.showBorder = true;
              list.controlOptions.selectedId = list.controlOptions.list[0].id;
              break;
            case CompanyWorkflowTypeEnum.MAKER_CHECKER:
              this.makerCheckerModel.showBorder = true;
              list.controlOptions.selectedId = list.controlOptions.list[1].id;
              break;
            case CompanyWorkflowTypeEnum.WORKFLOW:
              this.workflowModel.showBorder = true;
              list.controlOptions.selectedId = list.controlOptions.list[2].id;
              break;
          }
        }
      });
    }
  }

  validateSelection(type: any) {
    let changeWorkflowReq: ValidateChangeWorkflowReq = {
      authenticationOperation: AuthenticationOperation.CHANGE_WORK_COMPANY_FLOW,
    };

    switch (type) {
      case CompanyWorkflowTypeEnum.BASIC: {
        this.changeWorkflowService.validateChangeCompanyWorkflow(changeWorkflowReq).subscribe((response) => {
          this.validateChangeWorkflowRes = response;
          this.showOtp();
        });
      }
        break;

      case CompanyWorkflowTypeEnum.MAKER_CHECKER: {
        this.changeWorkflowService.validateChangeCompanyWorkflow(changeWorkflowReq).subscribe((response) => {
          this.validateChangeWorkflowRes = response;
          this.userSelection = CompanyWorkflowTypeEnum.MAKER_CHECKER;
          this.showOtp();
        });
      }
        break;

      case CompanyWorkflowTypeEnum.WORKFLOW: {
        this.changeWorkflowService.validateChangeCompanyWorkflow(changeWorkflowReq).subscribe((response) => {
          this.validateChangeWorkflowRes = response;
          this.showOtp();
        });
      }
        break;
    }
  }

  showOtp() {
    this.otpService.showVerification(this.validateChangeWorkflowRes.generateChallengeAndOTP).subscribe((requestValidate: RequestValidate) => {
      this.confirmSelection(requestValidate);
    });
  }

  confirmSelection(requestValidate: RequestValidate) {

    let changeWorkflowReq: ChangeWorkflowReq;

    switch (this.userSelection) {
      case CompanyWorkflowTypeEnum.BASIC:
        changeWorkflowReq = {
          companyWorkflowType: CompanyWorkflowTypeEnum.BASIC,
          requestValidateSecondFactor: requestValidate,
        }
        this.changeWorkflowType(changeWorkflowReq);
        break;
      case CompanyWorkflowTypeEnum.MAKER_CHECKER:
        changeWorkflowReq = {
          companyWorkflowType: CompanyWorkflowTypeEnum.MAKER_CHECKER,
          requestValidateSecondFactor: requestValidate,
          companyWorkFlowUserConfigurations: this.getCompanyWorkFlowUserConfiguration(),
        }
        this.changeWorkflowType(changeWorkflowReq);
        break;
      case CompanyWorkflowTypeEnum.WORKFLOW:
        changeWorkflowReq = {
          companyWorkflowType: CompanyWorkflowTypeEnum.WORKFLOW,
          requestValidateSecondFactor: requestValidate,
        }
        this.changeWorkflowType(changeWorkflowReq);
        break;
    }
  }

  getCompanyWorkFlowUserConfiguration(): CompanyWorkFlowUserConfiguration[] {
    let result: CompanyWorkFlowUserConfiguration[] = [];
    this.data.forEach(item => {
      result.push({
        userId: item.userId,
        maker: item.maker,
        checker: item.checker,
      });
    })
    return result;
  }

  override onButtonClick(button: FormButtonClickOutput) {

    switch (button.buttonId) {
      case CompanyWorkflowTypeEnum.BASIC:
        this.changeWorkflowPopup.form!.controls["changeWorkflowSubtitle"].label! = 'workflow.change-workflow-popup-subtitle-basic';
        this.popupService.showPopup(this.changeWorkflowPopup)
          .subscribe((res: PopupOutputModel) => {
            this.popupHandler(res, button.buttonId);
          });
        break;
      case CompanyWorkflowTypeEnum.MAKER_CHECKER:
        this.checkWarning(CompanyWorkflowTypeEnum.BASIC, 'recommendBasic', getRecommendationMakerCheckerWarning())
        this.changeWorkflowPopup.form!.controls["changeWorkflowSubtitle"].label! = 'workflow.change-workflow-popup-subtitle-checker/maker';
        this.popupService.showPopup(this.changeWorkflowPopup)
          .subscribe((res: PopupOutputModel) => {
            this.popupHandler(res, button.buttonId);
          });
        break;
      case CompanyWorkflowTypeEnum.WORKFLOW:
        if (this.workflowModel.featureButton!.id != getKeepCurrentTypeButton().id) {
          this.changeWorkflowPopup.form!.controls["changeWorkflowSubtitle"].label! = 'workflow.change-workflow-popup-subtitle-workflow';
          this.popupService.showPopup(this.changeWorkflowPopup)
            .subscribe((res: PopupOutputModel) => {
              this.popupHandler(res, button.buttonId);
            });
        } else {
          this.changeWorkflowType({companyWorkflowType: this.companyWorkflowType})
        }
        break;
      case 'Skip':
        void this.router.navigateByUrl('/dashboard').then();
        break;
      case 'goToDashboard':
        void this.router.navigateByUrl('/dashboard').then();
        break;
    }
  }

  fillSuccessResult(): ResultModal {
    switch (this.userSelection) {
      case CompanyWorkflowTypeEnum.BASIC:
        return {
          type: 'Success',
          title: 'workflow.changed-successfully-title',
          subTitle: 'workflow.changed-successfully-subtitle-basic',
          summary: undefined,
        };
      case CompanyWorkflowTypeEnum.MAKER_CHECKER:
        return {
          type: 'Success',
          title: 'workflow.changed-successfully-title',
          subTitle: 'workflow.changed-successfully-subtitle-checker/maker',
          summary: undefined,
        };
      default:
        return {
          type: 'Success',
          title: 'workflow.changed-successfully-title',
          subTitle: 'workflow.changed-successfully-subtitle-workflow',
          summary: undefined,
        };
    }
  }

  fillErrorResult(errString: string): ResultModal {
    return {
      type: 'Error',
      title: errString,
      summary: {},
    };
  }

  private setCurrentWorkflow(type: CompanyWorkflowEligible, model: GenericFeatureListModel, text: string) {

    if (type.current) {
      model.featureButton!.isDisable = true;
      model.featureButton!.text = text;
      if (this.recommended) {
        model.featureButton!.isDisable = false;
        model.featureButton = getKeepCurrentTypeButton();
      }
    } else {
      model.featureButton!.isDisable = false;
    }
    if (type.recommended) {
      this.recommendedType = type;
    }
  }

  private popupHandler(res: PopupOutputModel, type: any) {

    if (res.buttonId == "changeWorkflow") {
      this.userSelection = type;
      this.popupService.dismiss();
      if (type == CompanyWorkflowTypeEnum.MAKER_CHECKER) {
        this.router.navigateByUrl(`${COM_AD}/` + `${COM_AD_WORKFLOW_MAKER_CHECKER}`).then(() => {
        });
      } else {
        this.validateSelection(type);
      }
    } else if (res.buttonId == "cancel") {
      this.popupService.dismiss();
    }
  }

  private changeWorkflowType(changeWorkflowReq: ChangeWorkflowReq) {
    this.changeWorkflowService.confirmChangeCompanyWorkflow(changeWorkflowReq).subscribe({
      next: () => {
        let company = JSON.parse(sessionStorage.getItem("company")!);
        company.companyWorkflowType = this.userSelection;
        sessionStorage.setItem("company", JSON.stringify(company));
        if (this.userSelection != CompanyWorkflowTypeEnum.MAKER_CHECKER) {
          this.pageTitle.stepper = {
            steps: ['', ''],
            stepCounter: 1,
            stepText: "public.step",
            ofText: "public.of"
          }
        }
        this.stepperMoveNext();
        this.result = this.fillSuccessResult()
        this.endButtons = [this.goToDashboardButton];
        this.startButtons = [];
        sessionStorage.removeItem("recommendWorkflow");
      },
      error: (error: ResponseException) => {
        this.result = this.fillErrorResult(error.ErrorResponse.errorDescription!);
      }
    });
  }

  private checkWarning(type: CompanyWorkflowTypeEnum, controlId: string, control: ControlBase<any>) {
    if (this.recommendedType?.companyWorkflowType == type) {
      this.changeWorkflowPopup.form?.addControl(controlId, control)
    }
  }
}
