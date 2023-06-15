import { Component, OnInit } from '@angular/core';
import { PaymentBaseComponent } from "../payment-base/payment-base.component";
import {FormButtonClickOutput} from "../../../shared/form/form.component";

@Component({
  selector: 'app-hajj-umrah-cards',
  templateUrl: '../payment-base/payment-base.component.html',
  styleUrls: []
})
export class HajjUmrahCardsComponent extends PaymentBaseComponent implements OnInit {

  constructor() {
    super();
  }

  override ngOnInit(): void {
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput): void {
    switch (formButtonClickOutput.buttonId) {
      case 'UserApprovalStatus':
        this.router.navigate(["/payments/approval"], {queryParams: {type: 'hajjUmrah-allocated'}}).then(() => {
        });
        break;
    }
  }

}
