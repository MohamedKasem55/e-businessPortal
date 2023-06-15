import {Component} from "@angular/core";
import {PageModel} from "app/@core/model/dto/formModel";
import {ResultModal} from "app/@core/model/dto/result.modal";
import {FormButtonClickOutput} from "app/shared/form/form.component";
import {getResultsControl} from "./results.component.controls";
import { FinanceBaseComponent } from "app/pages/finance/finance-base/finance-base.component";

@Component({
  templateUrl: '../../../../finance-base/finance-base.component.html',
})
export class LosResults extends FinanceBaseComponent {
  constructor() {
    super()
    this.pageTitle.id = "summary";
    this.pageTitle.title = "";
    this.pageTitle.stepper!.stepCounter = 6;
    this.startButtons = [];
    this.proceedButton = {id: "trackApplication", text: "finance.fleet.btn.trackApplicationStatus", type: "primary",};
    this.cancelButton = {id: "goDashboard", text: "finance.fleet.btn.GOToDashboard", type: "secondary",};
    this.endButtons = [this.cancelButton, this.proceedButton];
    this.drawPage();
    this.result = this.fillSuccessResult();

  }

  drawPage() {
    this.pages.push(new PageModel(5, getResultsControl()));
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'trackApplication':
        break;
      case 'goDashboard':
        break;
    }
  }

  fillSuccessResult(): ResultModal {
    return {
      type: 'Success',
      title: 'finance.fleet.requests.Success_App',
      subTitle: 'finance.fleet.btn.submitApplicationNote',
      summary: this.summary,
    };
  }
}
