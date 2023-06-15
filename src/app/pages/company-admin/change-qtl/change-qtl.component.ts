import {Component} from '@angular/core';
import {
  COM_AD,
  COM_AD_CHANGE_QTL,
} from 'app/@core/constants/pages-urls-constants';
import {FormResult, PageModel} from 'app/@core/model/dto/formModel';
import {ResponseException} from 'app/@core/service/base/responseException';
import {ChangeQtlService} from 'app/@core/service/company-admin/change-qtl/change-qtl.service';
import {FormButtonClickOutput} from 'app/shared/form/form.component';
import {CompanyAdminBaseComponent} from '../company-admin-base/company-admin-base.component';
import {
  cancelButton,
  changeQTLForm,
  fillErrorResult,
  fillSuccessResult,
  getEndButtons,
} from './change-qtl.controls';

@Component({
  selector: 'app-change-qtl',
  templateUrl: '../company-admin-base/company-admin-base.component.html',
  styleUrls: [],
})
export class ChangeQtlComponent extends CompanyAdminBaseComponent {
  constructor(private changeQtlService: ChangeQtlService) {
    super();

    this.pageTitle = {
      id: 'change-qtl',
      title: 'change-qtl.title',
      showArrow: true,
      stepper: {
        steps: ['', ''],
        stepCounter: 1,
        stepText: 'public.step',
        ofText: 'public.of',
      },
    };

    this.changeQtlService.getQTL().subscribe({
      next: (res) => {
        this.pages = [new PageModel(1, changeQTLForm(res.qtl, res.maxQTL))];
      },
      error: () => {
      },
    });

    this.startButtons = [cancelButton];
    this.endButtons = [this.confirmButton];

    this.setBreadcrumb([
      {
        text: 'company-admin.name',
        url: `/${COM_AD}`,
      },
      {
        text: 'change-qtl.title',
        url: `/${COM_AD_CHANGE_QTL}`,
      },
    ]);
  }

  override onResultChanged(data: FormResult[]) {
    this.endButtons[0].isDisable = !data[0].valid;
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'arrowTitle':
      case 'Cancel':
      case 'goToCompanyAdmin':
        this.router.navigate(['/company-admin']);
        break;
      case 'Confirm':
        this.confirm();
        break;
      case 'goToDashboard':
        this.setBreadcrumb([]);
        this.router.navigate(['/dashboard']);
        break;
    }
  }

  confirm(): void {
    this.nextButton.showLoading = true;
    this.changeQtlService
      .changeQTL(+this.getControl(0, 0, 'qtlLimit').value)
      .subscribe({
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
          this.result = fillErrorResult(
            error?.ErrorResponse?.errorDescription!
          );
        },
      });
  }
}
