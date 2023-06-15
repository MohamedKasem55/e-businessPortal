import {AbstractBaseService} from 'app/@core/service/base/abstract-base.service';
import {Injectable} from '@angular/core';
import {DropdownOptionsModel} from "arb-design-library/model/dropdown-options.model";
import { MostPriortyActionsIds, PendingActionsService } from '../pending-actions/pending-actions-service';
import { lastValueFrom, take } from 'rxjs';
import { addPendingActionsAction } from 'app/shared/store/shared.action';
import { Store } from '@ngrx/store';

@Injectable()
export class PendingActionFactory {

  constructor(
    private store: Store,
    private pendingActionsService: PendingActionsService
  ) {
  }
  highestPriorityActionsIds = Object.keys(MostPriortyActionsIds).map(
    (key: string) =>
      MostPriortyActionsIds[key as keyof typeof MostPriortyActionsIds]
  );

  dashboardActionsLength = 5;

  getPendingActionsListSection(
    existingData: DropdownOptionsModel[],
    newData: { [key: string]: number },
    dasboardActionsLength: number
  ) {
    this.dashboardActionsLength = dasboardActionsLength;
    const  { currentList } = this.getFormattedPendingActions(existingData, newData);
    const sortedActions = this.sortAllDashboardActions(currentList);
    return sortedActions.dashboardSectionActions;
  }

  getTopBarPendingActions(
    existingData: DropdownOptionsModel[],
    newData: { [key: string]: number },
  ) {
    const  { total, currentList } = this.getFormattedPendingActions(existingData, newData);
    const totalActionsCount = total || undefined;
    const sortedActions = this.sortAllDashboardActions(currentList);
    return { ...sortedActions, totalActionsCount };
  }

  getFormattedPendingActions(
    currentList: DropdownOptionsModel[],
    newList: { [key: string]: number },
  ) {
    let total = 0;
    Object.keys(newList).forEach((key) => {
      if (newList[key] > 0) {
        total += newList[key];
        const itemIndex = currentList?.findIndex((item) => item.id === key);
        if (itemIndex !== -1 && currentList[itemIndex]?.badge) {
          currentList[itemIndex].badge = newList[key];
        } else {
          currentList?.push({
            id: key,
            text: 'pending-actions.' + key,
            badge: newList[key],
          });
        }
      }
    });
    return { currentList, total}
  }

  sortAllDashboardActions(mainActions: DropdownOptionsModel[]) {
    let pendingActions = structuredClone(mainActions);
    const topBarMainActions = this.sortByBadgeCount(mainActions)?.slice(0, 10);
    const dashboardSectionActions = [...this.sortPendingActions(pendingActions)];
    if (dashboardSectionActions.length < this.dashboardActionsLength) {
      const highestActionsIds = this.highestPriorityActionsIds.filter(
        (actionId) => {
          const existing = dashboardSectionActions.find(
            (action) => action.id === actionId
          );
          return existing?.id !== actionId;
        }
      );
      highestActionsIds.forEach((action) => {
        if (dashboardSectionActions.length <= this.dashboardActionsLength) {
          dashboardSectionActions.push({
            id: action,
            text: 'pending-actions.' + action,
            badge: 0,
          });
        }
      });
    }
    return { dashboardSectionActions, topBarMainActions };
  }

  sortPendingActions(actions: DropdownOptionsModel[] = []) {
    const unSorted = [...actions];
    const sorted = Array(this.highestPriorityActionsIds.length);
    this.highestPriorityActionsIds.forEach((actionId, index) => {
      for (let i = 0; i < actions.length; i++) {
        if (actions[i].id === actionId) {
          unSorted.splice(
            unSorted.findIndex((item) => item.id === actions[i].id),
            1
          );
          sorted[index] = actions[i];
          break;
        }
      }
    });
    return [
      ...sorted.filter((item) => item !== undefined),
      ...this.sortByBadgeCount(unSorted),
    ];
  }

  sortByBadgeCount(actionsList: DropdownOptionsModel[]) {
    return actionsList?.sort((first, second) => second.badge! - first?.badge!)
  }

  async fetchPendingActions() {
    try {
      const pendingActions = await lastValueFrom(
        this.pendingActionsService.getPendingActionCounts().pipe(take(1))
      );
      if (pendingActions) {
        this.store.dispatch(addPendingActionsAction({ pendingActions }))
      }
    } catch (error) {

    }
  }
}
