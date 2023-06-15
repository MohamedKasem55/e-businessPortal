import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingActionsTableComponent } from './generic-table/pending-actions-table.component';
import { PendingActionsComponent } from './pending-actions.component';
import { WorkflowDetailsComponent } from './workflow-details/workflow-details.component';

const routes: Routes = [
  {
    path: '',
    component: PendingActionsComponent
  },
  {
    path: 'pending-actions-list',
    component: PendingActionsTableComponent
  }, {
    path: 'workflow-details',
    component: WorkflowDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendingActionsRoutingModule {
}
