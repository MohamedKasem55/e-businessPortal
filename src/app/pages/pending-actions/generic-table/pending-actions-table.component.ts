import {Component} from '@angular/core';
import {PendingActionsService} from 'app/@core/service/pending-actions/pending-actions-service';
import {TableHeaderType} from 'arb-design-library';
import {TableHeaderModel} from 'arb-design-library/model/table-header.model';
import {TableButtonOutputModel} from "arb-design-library/model/table-button-output.model";
import {Router} from "@angular/router";
import {BreadcrumbService} from 'app/@core/service/base/breadcrumb.service';

@Component({
  selector: 'app-pending-actions-table',
  templateUrl: './pending-actions-table.component.html',
})
export class PendingActionsTableComponent {
  headers: TableHeaderModel[] = [
    {
      title: "pending-actions.request-type",
      fieldName: "key",
      type: TableHeaderType.BUTTON,
      controlOptions: {id: "key", text: "key"}
    },
    {title: "pending-actions.pending", fieldName: "badge", type: TableHeaderType.TEXT},
  ];
  data: any[] | undefined = undefined;

  exportFileName = "pendingActionsTableFileName";

  constructor(
    private pendingActionsService: PendingActionsService, 
    private breadcrumbService: BreadcrumbService, 
    private router: Router,
  ) {
    this.breadcrumbService.setBreadcrumb([{
      text: 'pending-actions.pending-actions',
      url: '/pendingActions/pending-actions-list'
    }]);

    this.pendingActionsService.getPendingActionCounts().subscribe(res => {
      let details: any[] = [];
      Object.keys(res).forEach(key => {
        details.push({
          key: 'pending-actions.' + key,
          badge: res[key],
          id: key
        })
      });
      this.data = details.sort((first, second) => second.badge! - first?.badge!);
    });
  }


  onButtonClick(res: TableButtonOutputModel) {
    this.router.navigate(["/pendingActions"], {queryParams: {pendingAction: res.row['id']}}).then(() => {
    });
  }

}
