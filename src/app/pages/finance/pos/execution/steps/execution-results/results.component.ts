import { Component } from "@angular/core";
import { PageModel } from "app/@core/model/dto/formModel";
import { FormButtonClickOutput } from "app/shared/form/form.component";
import { getExecutionResultsControl } from "./results.component.controls";
import { ResultModal } from "app/@core/model/dto/result.modal";
import { FinanceBaseComponent } from "app/pages/finance/finance-base/finance-base.component";

@Component({
  templateUrl: '../../../../finance-base/finance-base.component.html',
})

export class ExecutionResults extends FinanceBaseComponent {
  constructor() {
    super()
    this.pageTitle.id = "executionResults";
    this.pageTitle.title = "";
    this.pageTitle.stepper!.stepCounter = 7;
    this.proceedButton = { id: "trackApplication", text: "finance.execution.btnFinance", type: "primary", };
    this.cancelButton = { id: "goDashboard", text: "public.goHome", type: "secondary", };
    this.endButtons = [this.cancelButton,this.proceedButton];
    this.drawPage();
    this.result = this.fillSuccessResult();
    this.drawPage();
  }
  drawPage() {
    this.pages = [new PageModel(7, getExecutionResultsControl())];
  }
  override ngOnInit(): void {
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
      title: 'finance.execution.result',
      subTitle: 'finance.execution.resultText',
      summary: this.summary,
    };
  }
}
