import { BreadcrumbService } from "../../@core/service/base/breadcrumb.service";
import { TranslateService } from "@ngx-translate/core";
import { TitleModel } from "arb-design-library/model/title.model";
import { FormModel, FormResult, PageModel } from "../../@core/model/dto/formModel";
import { ButtonModel } from "arb-design-library/model/button.model";
import { SummaryModel } from "arb-design-library/model/summary.model";
import { ResultModal } from "../../@core/model/dto/result.modal";
import { AlertModel } from "../../@core/model/dto/alert.model";
import { BreadcrumbModel } from "arb-design-library/model/breadcrumb.model";
import { SummaryItemModel } from "arb-design-library/model/summary-item.model";
import { KeyValueModel } from "../../@core/model/rest/common/key-value.model";
import { ControlBase } from "../../@core/model/dto/control/control.model";
import { FormButtonClickOutput } from "../form/form.component";
import { Router } from "@angular/router";
import { ServiceLocator } from "../../@core/service/base/service-locator.service";
import { Location } from "@angular/common";
import { Utils } from "../../@core/utility/Utils";
import { buildDetails, getInformationDetailsForm } from "app/pages/pending-actions/actions-pages/current-level-control-options";
import { PopupOutputModel } from "app/@core/model/dto/popup.model";
import { PopupService } from "app/@core/service/base/popup.service";


export class TransactionFollowBase {
  breadcrumbService!: BreadcrumbService;
  translate!: TranslateService;
  location!: Location;
  router!: Router;

  constructor() {
    this.breadcrumbService = ServiceLocator.injector.get(BreadcrumbService);
    this.translate = ServiceLocator.injector.get(TranslateService);
    this.router = ServiceLocator.injector.get(Router);
    this.location = ServiceLocator.injector.get(Location);
  }

  nextButton: ButtonModel = {
    id: "Next",
    text: "public.next",
    type: "primary",
    isDisable: true
  };

  confirmButton: ButtonModel = {
    id: 'Confirm',
    text: 'public.confirm',
    type: 'primary',
  };

  pendingActionsButton: ButtonModel = {
    id: 'PendingActions',
    type: 'secondary',
    text: 'transfer.go-to-pending-actions',
  };

  editButton: ButtonModel = {
    id: 'Edit',
    text: 'public.edit',
    type: 'secondary',
  };
  deleteButton: ButtonModel = {
    id: "Delete",
    text: "public.delete",
    type: "danger"
  }

  backButton: ButtonModel = {
    id: "Back",
    text: "public.back",
    type: "secondary"
  };

  proceedButton: ButtonModel = {
    id: 'Proceed',
    text: 'public.proceed',
    type: 'primary',
    isDisable: false,
  };

  goToDashboardButton: ButtonModel = {
    id: "goToDashboard",
    type: 'secondary',
    text: "public.go-to-dashboard"
  };


  pageTitle!: TitleModel;
  pages: PageModel[] = [];
  startButtons: ButtonModel[] = [this.backButton];
  endButtons: ButtonModel[] = [this.nextButton];

  summary!: SummaryModel;
  result!: ResultModal;
  alert!: AlertModel | null;


  onAlertAction(id: string) {
  }

  onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
  }

  onResultChanged(data: FormResult[]) {
  }


  setBreadcrumb(breadcrumb: BreadcrumbModel[]) {
    this.breadcrumbService.setBreadcrumb(breadcrumb);
  }

  stepperMoveNext() {
    this.pageTitle.stepper!.stepCounter++;
    Utils.scrollTop();

  }

  stepperMoveBack() {
    this.pageTitle.stepper!.stepCounter--;
    Utils.scrollTop();
  }

  getControl(pageIndex: number, formIndex: number, controlKey: string): ControlBase<any> {
    return this.pages[pageIndex]?.forms[formIndex]?.controls[controlKey];
  }

  hideAndDisableControls(pageIndex: number, formIndex: number, controlsKey: string[]) {
    controlsKey.forEach((control: any) => {
      let controlItem = this.getControl(pageIndex, formIndex, control);
      try {
        controlItem.setValue("");
        controlItem.disable();
        controlItem.hidden = true;
      } catch (e) {
        controlItem.setValue("");
      }
    });
  }

  showAndEnableControls(pageIndex: number, formIndex: number, controlsKey: string[]) {
    controlsKey.forEach((control: any) => {
      let controlItem = this.getControl(pageIndex, formIndex, control);
      try {
        controlItem.setValue("");
        controlItem.enable();
        controlItem.hidden = false;
      } catch (e) {
        controlItem.setValue("");
      }
    });
  }


  getFormSummaryItem(form: FormModel): SummaryItemModel[] {
    return Utils.getFormSummaryItem(form);
  }


  objectToKeyValue(object: any): KeyValueModel[] {
    let data: KeyValueModel[] = [];
    Object.keys(object).forEach(key => {
      data.push({ key, value: object[key] });
    });
    return data;
  }

  // new event for table, review
  onHover(securityLevelsDTOList: any, popupService: PopupService) {
    const informationDetailsData = buildDetails(this.translate, securityLevelsDTOList);
    popupService.showPopup({
      form: getInformationDetailsForm(this.translate, informationDetailsData)
    }).subscribe((model: PopupOutputModel) => {
      if (model.buttonId === 'close') {
        popupService.dismiss();
      }
    })
  }


}
