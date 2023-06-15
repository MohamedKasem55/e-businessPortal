import { Component } from '@angular/core';
import { TransactionFollowBase } from '../../shared/transaction-follow-base/transaction-follow-base';

@Component({
  selector: 'app-representative-base',
  templateUrl: './representatives-base.component.html',
  styleUrls: [],
})
export class RepresentativesBaseComponent extends TransactionFollowBase {
  constructor() {
    super();

    this.pageTitle = {
      id: 'RepresentativesTitle',
      title: 'representatives.title',
      stepper: {
        steps: [],
        stepCounter: 1,
        stepText: 'public.step',
        ofText: 'public.of',
      },
    };
  }
}
