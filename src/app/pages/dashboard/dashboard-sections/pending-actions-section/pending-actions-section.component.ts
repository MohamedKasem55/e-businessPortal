import { Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PendingActionFactory } from 'app/@core/service/base/pending-action-factory.service';
import { Utils } from 'app/@core/utility/Utils';
import { getPendingActions } from 'app/shared/store/shared.reducer';
import { DropdownOptionsModel } from 'arb-design-library/model/dropdown-options.model';
import { LineCardModel } from 'arb-design-library/model/line-card.model';
import { TitleModel } from 'arb-design-library/model/title.model';
import { Subject, takeUntil } from 'rxjs';
import { DashboardBase } from '../../dashboard-base';
import {AuthenticationUtils} from "../../../../@core/utility/authentication-utils";

@Component({
  selector: 'app-pending-actions-section',
  templateUrl: './pending-actions-section.component.html',
})
export class PendingActionsSectionComponent
  extends DashboardBase
  implements OnDestroy, OnInit
{

  pendingActionsLineCards!: LineCardModel[];


  pendingActionTitle: TitleModel = {
    id: 'pendingAction',
    title: 'pending-actions.your-pending-actions',
    endButtons: [
      {
        id: 'pendingActionViewAll',
        text: 'pending-actions.view-all',
        type: 'outLine',
      },
    ],
  };
  destroy$ = new Subject();

  DISPLAYED_LIST_LENGTH = 5;

  constructor(
    private store: Store,
    private pendingActionFactory: PendingActionFactory
  ) {
    super();
    this.loadPendingActions();
  }

  ngOnInit(): void {
  }

  loadPendingActions() {
    this.store
      .select(getPendingActions)
      .pipe(takeUntil(this.destroy$))
      .subscribe((actions) => {
        if (actions) {
          const dashboardSectionActions =
            this.pendingActionFactory.getPendingActionsListSection(
              [],
              actions,
              this.DISPLAYED_LIST_LENGTH
            );
          dashboardSectionActions &&
            this.setPendingActions(dashboardSectionActions);
        }
      });
  }

  setPendingActions(data: DropdownOptionsModel[]) {
    data = structuredClone(data);
    this.pendingActionsLineCards = [];
    data.forEach((item, index) => {
      if (index < this.DISPLAYED_LIST_LENGTH) {
        this.pendingActionsLineCards.push({
          id: item.id,
          icon:
            Utils.getPendingActionIcon(item.id) + ' color-arb-secondaryText',
          title: item.text,
          badge: item.badge,
          hasBackground: true,
        });
      }
    });
  }

  onPendingSelect(pending: string) {
    if (pending === 'pendingActionViewAll') {
      void this.router.navigate(['/pendingActions/pending-actions-list']);
    } else {
      this.router
        .navigate(['/pendingActions'], {
          queryParams: { pendingAction: pending },
        })
        .then(() => {});
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
