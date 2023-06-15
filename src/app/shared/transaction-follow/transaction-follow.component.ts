import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ResultModal} from "../../@core/model/dto/result.modal";
import {FormResult, PageModel,} from "../../@core/model/dto/formModel";
import {TitleModel} from "arb-design-library/model/title.model";
import {AlertModel} from "../../@core/model/dto/alert.model";
import {ButtonModel} from "arb-design-library/model/button.model";
import {FormButtonClickOutput} from "../form/form.component";
import {SummaryModel} from "arb-design-library/model/summary.model";
import {SummaryButtonOutputModel} from "arb-design-library/model/summary-button-output.model";

@Component({
  selector: 'app-transaction-follow[pages]',
  templateUrl: './transaction-follow.component.html',
  styleUrls: ['./transaction-follow.component.scss']
})
export class TransactionFollowComponent {


  @Input() pages!: PageModel[];
  @Input() pageTitle!: TitleModel;

  @Input() startButtons!: ButtonModel[];
  @Input() endButtons!: ButtonModel[];

  @Input() summary!: SummaryModel;
  @Input() result!: ResultModal;

  @Input() alert!: AlertModel | null;

  @Output() onButtonClick = new EventEmitter<FormButtonClickOutput>();
  @Output() onResultChanged = new EventEmitter<FormResult[]>();
  @Output() onAlertAction = new EventEmitter<string>();

  doButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    this.onButtonClick.emit(formButtonClickOutput);
  }

  doSummaryButtonClick(summaryButtonOutputModel: SummaryButtonOutputModel) {
    this.onButtonClick.emit({buttonId: summaryButtonOutputModel.buttonId, formIndex: summaryButtonOutputModel.index});
  }

  doResultChanged(data: FormResult[]) {
    this.onResultChanged.emit(data);
  }

  alertClose() {
    this.alert = null;
  }

  getPageTitleSteps(): boolean {
    return this.pageTitle.stepper && this.pageTitle.stepper?.steps?.length === this.pageTitle.stepper?.stepCounter ? false : true
  }

}
