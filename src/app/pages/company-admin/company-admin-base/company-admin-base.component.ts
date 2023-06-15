import {Component} from '@angular/core';
import {TransactionFollowBase} from "../../../shared/transaction-follow-base/transaction-follow-base";

@Component({
  templateUrl: './company-admin-base.component.html',
})
export class CompanyAdminBaseComponent extends TransactionFollowBase {

  goBack() {
    this.location.back();
  }

}
