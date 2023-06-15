import {Component, OnInit} from '@angular/core';
import {ButtonModel} from "arb-design-library/model/button.model";
import {TransactionFollowBase} from "../../../shared/transaction-follow-base/transaction-follow-base";

@Component({
  selector: 'app-cards-base',
  templateUrl: './cards-base.component.html',
  styleUrls: []
})
export class CardsBaseComponent extends TransactionFollowBase implements OnInit {

  deleteConfirmButton!: ButtonModel;
  userRequestStatusButton!: ButtonModel;
  backToCardsButton!: ButtonModel;
  backToDashboardButton!: ButtonModel;

  constructor() {
    super();

    this.pageTitle = {
      id: "Cards",
      title: "cards.cards",
      stepper: {
        steps: ["", "", ""],
        stepCounter: 1,
        stepText: "public.step",
        ofText: "public.of"
      }
    };

    this.deleteConfirmButton = {
      id: 'DeleteConfirm',
      text: 'public.confirm',
      type: 'primary',
    };

    this.userRequestStatusButton = {
      id: 'NavigateToCardApproval',
      type: 'primary',
      text: 'cards.request-status',
    };


    this.backToCardsButton = {
      id: 'back-to-cards-btn',
      text: 'cards.go-to-cards',
      type: 'primary',
    };

    this.backToDashboardButton = {
      id: 'back-to-dashboard-btn',
      text: 'public.go-to-dashboard',
      type: 'secondary',
    };
  }


  ngOnInit(): void {

  }


  assignDropdownListFieldValues(fieldName: string, pageIndex: number, formIndex: number, list: any, controlOptions: any) {
    this.pages[pageIndex].forms[formIndex].controls[
      fieldName
      ].controlOptions.options = list;
    Object.keys(controlOptions).forEach(key => {
      this.pages[pageIndex].forms[formIndex].controls[
        fieldName
        ].controlOptions[key] = controlOptions[key];
    });
  }


  goBack() {
    this.location.back();
  }

}
