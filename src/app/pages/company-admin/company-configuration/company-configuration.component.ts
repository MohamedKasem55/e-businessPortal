import {Component, OnInit} from '@angular/core';
import {FormResult, PageModel} from 'app/@core/model/dto/formModel';
import {BaseResponse} from 'app/@core/model/rest/common/base-response';
import {
  CompanyConfigurationService
} from 'app/@core/service/company-admin/company-configuration/company-configuration.service';
import {FormButtonClickOutput} from 'app/shared/form/form.component';
import {CompanyAdminBaseComponent} from '../company-admin-base/company-admin-base.component';
import {companyConfigForm} from './company-configuration.controls';
import {ModelAndListService} from "../../../@core/service/base/modelAndList.service";
import {Utils} from "../../../@core/utility/Utils";
import {KeyValueModel} from "../../../@core/model/rest/common/key-value.model";
import {ButtonModel} from 'arb-design-library/model/button.model';
import {CompanyParametersRes} from 'app/@core/model/rest/company-admin/company-configuration/company-parameters-res';
import {AuthenticationUtils} from "../../../@core/utility/authentication-utils";

@Component({
  selector: 'app-company-config-landing',
  templateUrl: '../company-admin-base/company-admin-base.component.html',
})
export class CompanyConfigurationComponent extends CompanyAdminBaseComponent implements OnInit {
  workFlowTypeList: KeyValueModel[] = [];
  companyWorkFlowTypeText!: KeyValueModel;
  resultButton: ButtonModel = {
    id: 'companyAdminNavigation',
    text: 'company-admin.company-configuration.companyAdminNavigation',
    type: 'primary',
  };
  backBtn: ButtonModel = {
    id: 'back',
    text: 'public.back',
    type: 'secondary',
  };

  constructor(
    private companyConfigService: CompanyConfigurationService,
    private modelAndListService: ModelAndListService) {
    super();
    this.pageTitle = {
      id: "companyConfig",
      title: "company-admin.company-configuration.title",
    };
    this.startButtons = [this.backBtn];
    this.drawPage();
    this.setBreadcrumb([{
      text: 'company-admin.name',
      url: '/company-admin'
    },
      {text: 'company-admin.company-configuration.title', url: ''}]);
    // this.getWorkFlowTypeAndVatRegField();
    this.nextButton.text = "public.confirm";
    this.pageTitle.stepper = {
      steps: ["", "", ""],
      stepCounter: 1,
      stepText: "public.step",
      ofText: "public.of"
    }
  }

  ngOnInit() {
    this.modelAndListService.getList(["companyWorkflowTypes"]).subscribe((data: any) => {
      this.workFlowTypeList = Utils.getModelList(data['companyWorkflowTypes']);
      this.getControl(0, 0, "companyWorkFlowDrop").controlOptions.options = this.workFlowTypeList;
      if (AuthenticationUtils.isWorkflow) {
        this.getControl(0, 0, "companyWorkFlowDrop").enable();
      }
    });
    this.getCompanyParameters();
  }

  getCompanyParameters() {
    this.companyConfigService.getCompanyParameters().subscribe((data: CompanyParametersRes) => {
      this.workFlowTypeList.forEach((type: any) => {
        if (type.key === data['companyWorkflowType']) {
          this.companyWorkFlowTypeText = type;
        }
      });
      this.getControl(0, 0, "companyWorkFlowDrop").setValue(this.companyWorkFlowTypeText);
      this.getControl(0, 0, "vatRegistrationNumberInput").setValue(data['vatNumber']);
      this.getControl(0, 0, 'resetPasswordSelection').setValue(data['resetPassPushNotification']);
      this.getControl(0, 0, 'multiActionPerTransaction').setValue(data['preventUserDualBatchApproval']);

    })
  }

  drawPage() {
    this.pages = [];
    this.pages = [new PageModel(1, companyConfigForm())];
  }

  override onResultChanged(data: FormResult[]): void {
    let valid = true;
    data.forEach(item => {
      valid = valid && item.valid;
    })
    this.endButtons[0].isDisable = !valid;
  }

  nextClick() {
    if (this.pageTitle.stepper?.stepCounter == 1) {
      this.summary = {
        title: {
          id: "",
          title: "company-admin.company-configuration.summary"
        },
        sections: [
          {
            items: [
              {
                title: "company-admin.company-configuration.resetPasswordSelection",
                subTitle: this.getControl(0, 0, "resetPasswordSelection").value ? 'Active' : 'UnActive',
              },
              {
                title: "company-admin.company-configuration.single-action-per-trx-user",
                subTitle: this.getControl(0, 0, "multiActionPerTransaction").value ? 'Active' : 'UnActive',
              },
              {
                title: "company-admin.company-configuration.companyWorkFlowType",
                subTitle: this.getControl(0, 0, "companyWorkFlowDrop")?.value?.value
              },
              {
                title: "company-admin.company-configuration.vatRegistrationNumber",
                subTitle: this.getControl(0, 0, "vatRegistrationNumberInput").value
              }
            ]
          }
        ]
      }
      this.stepperMoveNext();
    } else {
      const request = {
        resetPasswordPushNotification: this.getControl(0, 0, "resetPasswordSelection").value,
        preventUserDualBatchApproval:this.getControl(0, 0, "multiActionPerTransaction").value,
        vatNumber: this.getControl(0, 0, "vatRegistrationNumberInput")?.value,
        companyWorkflowType: this.getControl(0, 0, "companyWorkFlowDrop")?.value.key
      }
      this.companyConfigService.updateCompanyParameters(request).subscribe((data: BaseResponse) => {
        this.result = {
          title: "company-admin.company-configuration.success-message",
          summary: this.summary,
          type: "Success"
        }
        this.stepperMoveNext();
        this.endButtons = [this.resultButton];
        this.startButtons = [];
      });
    }
  }

  backBtnClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.router.navigate(['/company-admin']).then();
        break;
      case 2:
        this.stepperMoveBack();
        this.startButtons = [this.backBtn];
        break;
      default:
        this.router.navigate(['/company-admin']).then();
        break;
    }
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'Next':
        this.nextClick();
        break;
      case 'back':
        this.backBtnClick();
        break;
      case 'companyAdminNavigation':
        this.router.navigate(['/company-admin/']);
        break;
    }
  }

}

