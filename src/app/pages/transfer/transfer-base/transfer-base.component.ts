import { Component } from '@angular/core';
import { ButtonModel } from "arb-design-library/model/button.model";
import { TransactionFollowBase } from "../../../shared/transaction-follow-base/transaction-follow-base";
import {Utils} from "../../../@core/utility/Utils";
import {AuthenticationUtils} from "../../../@core/utility/authentication-utils";

@Component({
  selector: 'app-transfer-base',
  templateUrl: './transfer-base.component.html',
  styleUrls: ['./transfer-base.component.scss']
})
export class TransferBaseComponent extends TransactionFollowBase {

  transferButton!: ButtonModel;
  beneficiaryButton!: ButtonModel;
  downloadButton!: ButtonModel;
  hasNextApprovalLevel: boolean = false;
  showPendingActions: boolean = AuthenticationUtils.showPendingActions;

  constructor() {
    super();
    this.pageTitle = {
      id: "TransferTitle",
      title: "Between Accounts",
      stepper: {
        steps: ["", "", ""],
        stepCounter: 1,
        stepText: "public.step",
        ofText: "public.of"
      }
    };

    this.transferButton = {
      id: 'Transfers',
      type: 'primary',
      text: 'transfer.go-to-transfers',
    };

    this.beneficiaryButton = {
      id: 'Beneficiary',
      type: 'secondary',
      text: 'transfer.go-to-beneficiary',
    };

    this.downloadButton = {
      id: 'Download',
      text: 'public.download',
      type: 'primary',
    };

    this.deleteButton = {
      id: 'delete',
      text: '',
      type: "primary",
      isDisable: false,
      prefixIcon: " arb-icon-Trash"
    };

    this.goToDashboardButton = {
      id: "goToDashboard",
      type: 'secondary',
      text: "public.go-to-dashboard"
    }
  }

}
