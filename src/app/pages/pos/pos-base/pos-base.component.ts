import {Component, OnInit} from '@angular/core';
import {TransactionFollowBase} from "../../../shared/transaction-follow-base/transaction-follow-base";
import {ButtonModel} from "arb-design-library/model/button.model";

@Component({
  selector: 'app-pos-base',
  templateUrl: './pos-base.component.html',
  styleUrls: []
})
export class PosBaseComponent extends TransactionFollowBase {

  buttonsIDs = {
    next: 'next',
    proceed: 'proceed',
    edit: 'edit',
    back: 'back',
    titleBack: 'title-back',
    confirm: 'confirm',
    backToNew: 'back-to-new-req',
    backToDash: 'back-to-dash',
  };


  successBackToNew!: ButtonModel;
  successBackToDash!: ButtonModel;

  constructor() {
    super();
    this.backButton = {
      id: this.buttonsIDs.back,
      text: 'public.back',
      type: 'secondary',
    };

    this.nextButton = {
      id: this.buttonsIDs.next,
      text: 'public.next',
      type: 'primary',
      isDisable: true,
    };

    this.proceedButton = {
      id: this.buttonsIDs.proceed,
      text: 'public.proceed',
      type: 'primary',
      isDisable: false,
    };

    this.editButton = {
      id: this.buttonsIDs.edit,
      text: 'public.edit',
      type: 'primary',
    };

    this.confirmButton = {
      id: this.buttonsIDs.confirm,
      text: 'public.confirm',
      type: 'primary',
    };

    this.successBackToNew = {
      id: this.buttonsIDs.backToNew,
      type: 'primary',
      text: 'pos.new-request.back-to-new',
    };

    this.successBackToDash = {
      id: this.buttonsIDs.backToDash,
      type: 'secondary',
      text: 'pos.new-request.back-to-dash',
    };
  }

}
