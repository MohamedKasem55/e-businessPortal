import { Component, OnInit } from '@angular/core';
import { TransactionFollowBase } from '../../../shared/transaction-follow-base/transaction-follow-base';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { ControlType } from '../../../@core/model/dto/control/control.model';
import { ServiceLocator } from '../../../@core/service/base/service-locator.service';
import { BreadcrumbService } from '../../../@core/service/base/breadcrumb.service';
import { TranslateService } from '@ngx-translate/core';
import {
  FormResult,
  PageModel,
  FormModel,
} from '../../../@core/model/dto/formModel';

@Component({
  selector: 'app-finance-base',
  templateUrl: './finance-base.component.html',
  styleUrls: [],
})
export class FinanceBaseComponent
  extends TransactionFollowBase
  implements OnInit
{
  dossierID!: string | null;
  addInternalQuotationBtn!: ButtonModel;
  goToDashboardBtn!: ButtonModel;
  addanotherQuotation!: ButtonModel;
  rejectButton!: ButtonModel;
  acceptButton!: ButtonModel;
  cancelButton!: ButtonModel;

  controlType: ControlType[] = [
    ControlType.TEXT_INPUT,
    ControlType.NUMBER_INPUT,
    ControlType.DROPDOWN,
    ControlType.AMOUNT,
    ControlType.PHONE,
    ControlType.DATE,
    ControlType.RADIO_GROUP,
    ControlType.SINGLE_DIGIT,
    ControlType.UPLOAD,
    ControlType.SELECTION,
  ];

  constructor() {
    super();
    // this.translate = ServiceLocator.injector.get(TranslateService);
    this.dossierID = sessionStorage.getItem('DOSSIER_ID');
    this.pageTitle = {
      id: 'fleetNewReq',
      title: 'Fleet Finance',
      stepper: {
        steps: ['', '', '', '', '', '', ''],
        stepCounter: 1,
        stepText: 'public.step',
        ofText: 'public.of',
      },
    };

    this.backButton = {
      id: 'Back',
      text: 'public.back',
      type: 'secondary',
    };

    this.nextButton = {
      id: 'Next',
      text: 'public.proceed',
      type: 'primary',
      isDisable: false,
    };
    this.addInternalQuotationBtn = {
      id: 'addInternalQuotation',
      text: 'finance.fleet.btn.addInternalQuotation',
      type: 'primary',
      isDisable: false,
    };

    this.addanotherQuotation = {
      id: 'addanotherQuotation',
      text: 'Add AnotherQuotation',
      type: 'primary',
      isDisable: false,
    };

    this.startButtons = [this.backButton];
    this.endButtons = [this.nextButton];
  }

  ngOnInit(): void {
  }


  override onResultChanged(data: FormResult[]) {
    let valid = true;
    data.forEach((item) => {
      valid = valid && item.valid;
    });
    this.nextButton.isDisable = !valid;
    this.addInternalQuotationBtn.isDisable = !valid;
  }

  getFormById(id: string): FormModel | null {
    let form_ = null;
    this.pages.forEach((form) => {
      form.forms.forEach((item) => {
        if (item.id == id) {
          form_ = item;
        }
      });
    });
    return form_;
  }

  getformValue(id: string) {
    let form = this.getFormById(id);
    let formValue: any = {};

    for (let property in form?.controls) {
      if (
        this.controlType.indexOf(
          form?.controls[property]['controlType'] as any
        ) > -1
      ) {
        form?.controls[property]['controlType'] == 3
          ? (formValue[`${property}`] = form?.controls[property].value.value)
          : (formValue[`${property}`] = form?.controls[property].value);
        formValue = { ...formValue };
      }
    }
    return formValue;
  }
  getInternalValue(id: string) {
    let form = this.getFormById(id);
    let formValue: any = {};
    for (let property in form?.controls) {
      if (
        this.controlType.indexOf(
          form?.controls[property]['controlType'] as any
        ) > -1
      ) {
        form?.controls[property]['controlType'] == 3
          ? (formValue[`${property}`] = { ...form?.controls[property].value }[
              property
            ])
          : (formValue[`${property}`] = form?.controls[property].value);
        formValue = { ...formValue };
      }
    }
    return formValue;
  }

  getFormArrayValue(page: PageModel) {
    let formsValue: any = [];
    page.forms.forEach((f: FormModel) => {
      formsValue.push(this.getExternalValue(f.id));
    });
    return formsValue;
  }

  getExternalValue(id: string) {
    let form = this.getFormById(id);
    let formValue: any = {};
    for (let property in form?.controls) {
      if (
        this.controlType.indexOf(
          form?.controls[property]['controlType'] as any
        ) > -1
      ) {
        form?.controls[property]['controlType'] == 3
          ? (formValue[`${property}`] = { ...form?.controls[property].value }[
              property
            ])
          : (formValue[`${property}`] = form?.controls[property].value);
        formValue = { ...formValue };
      }
    }
    return formValue;
  }
}
