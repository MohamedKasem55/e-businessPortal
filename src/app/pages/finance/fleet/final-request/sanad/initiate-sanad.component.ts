import {Component} from "@angular/core";
import {PageModel} from "app/@core/model/dto/formModel";
import {FormButtonClickOutput} from "app/shared/form/form.component";
import {InitiateSanadControl} from "./initiate-sanad.component.controls";
import { FinanceBaseComponent } from '../../../finance-base/finance-base.component';

@Component({
  templateUrl: '../../../finance-base/finance-base.component.html',

})

export class Sanad extends FinanceBaseComponent {
  constructor() {
    super()
    this.pageTitle.id = "finalOffer";
    this.pageTitle.title = "";
    this.pageTitle.stepper!.stepCounter = 2;
    this.endButtons = []
    this.drawPage();
  }

  drawPage() {
    this.pages = [new PageModel(2, InitiateSanadControl())];
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'back':
        void this.router.navigate(['/finance/pos/contract-commodity'])
        break;
    }
  }
}
