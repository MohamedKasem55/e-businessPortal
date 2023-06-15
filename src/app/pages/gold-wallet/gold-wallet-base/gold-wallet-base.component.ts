import { Component, OnInit } from '@angular/core';
import { TransactionFollowBase } from "../../../shared/transaction-follow-base/transaction-follow-base";

@Component({
  selector: 'app-gold-wallet-base',
  templateUrl: './gold-wallet-base.component.html',
  styleUrls: []
})
export class GoldWalletBaseComponent extends TransactionFollowBase implements OnInit {

  hasAccess: boolean = true;

  constructor() {
    super();
    this.pageTitle = {
      id: "gold-wallet",
      title: "gold-wallet.title",
      stepper: {
        steps: ["", "", ""],
        stepCounter: 1,
        stepText: "public.step",
        ofText: "public.of"
      },
      endButtons: []
    };
  }

  ngOnInit(): void {}



}
