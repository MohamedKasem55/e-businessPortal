import { Component } from '@angular/core';
import {
  COM_AD,
  COM_AD_UPDATE_CR,
} from 'app/@core/constants/pages-urls-constants';
import { PageModel } from 'app/@core/model/dto/formModel';
import { ResponseException } from 'app/@core/service/base/responseException';
import { UpdateCrService } from 'app/@core/service/company-admin/update-cr/update-cr.service';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { CompanyAdminBaseComponent } from '../company-admin-base/company-admin-base.component';
import {
  cancelButton,
  fillErrorResult,
  fillSuccessResult,
  getEndButtons,
  updateButton,
  updateCRForm,
} from './update-cr-controls';

@Component({
  selector: 'app-update-cr',
  templateUrl: '../company-admin-base/company-admin-base.component.html',
  styleUrls: [],
})
export class UpdateCrComponent extends CompanyAdminBaseComponent {
  profileNumber: string;
  constructor(private updateCrService: UpdateCrService) {
    super();
    this.profileNumber = JSON.parse(
      sessionStorage.getItem('company')!
    ).profileNumber;
    this.pageTitle = {
      id: 'update-cr',
      title: 'update-cr.title',
      showArrow: true,
      stepper: {
        steps: ['', ''],
        stepCounter: 1,
        stepText: 'public.step',
        ofText: 'public.of',
      },
    };
    this.pages = [new PageModel(1, updateCRForm())];

    this.startButtons = [cancelButton];
    this.endButtons = [updateButton];

    this.setBreadcrumb([
      {
        text: 'company-admin.name',
        url: `/${COM_AD}`,
      },
      {
        text: 'update-cr.title',
        url: `/${COM_AD_UPDATE_CR}`,
      },
    ]);
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'arrowTitle':
      case 'Cancel':
      case 'goToCompanyAdmin':
        this.router.navigate(['/company-admin']);
        break;
      case 'Update':
        this.update();
        break;
      case 'goToDashboard':
        this.setBreadcrumb([]);
        this.router.navigate(['/dashboard']);
        break;
    }
  }

  update(): void {
    this.nextButton.showLoading = true;
    this.updateCrService.updateCR(this.profileNumber).subscribe({
      next: (res) => {
        this.stepperMoveNext();
        this.startButtons = [];
        this.endButtons = getEndButtons();
        this.result = fillSuccessResult();
      },
      error: (error: ResponseException) => {
        this.stepperMoveNext();
        this.startButtons = [];
        this.endButtons = getEndButtons();
        this.result = fillErrorResult(error.ErrorResponse.errorDescription!);
      },
    });
  }
}
