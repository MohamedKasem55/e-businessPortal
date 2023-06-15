import { Component, OnInit } from '@angular/core';
import { TransactionFollowBase } from 'app/shared/transaction-follow-base/transaction-follow-base';

@Component({
  selector: 'app-base-alert',
  templateUrl: './base-alert.component.html',
  styleUrls: []
})
export class BaseAlertComponent extends TransactionFollowBase implements OnInit {

  constructor() {
    super();
    this.pageTitle = {
      id: "manage-alerts",
      title: "manage-alerts.title",
    };
  }

  ngOnInit(): void {
  }

  controlExist(pageIndex: number, formIndex: number, controlKey: string): boolean {
    return this.pages[pageIndex]?.forms[formIndex]?.controls[controlKey] ? true : false;
  }


}
