import { RelationshipManagerComponent } from './relationship-manager/relationship-manager.component';
import { CHANGE_PASSWORD } from '../../@core/constants/pages-urls-constants';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { FxRatesComponent } from './fx-rates/fx-rates.component';
import { ActivityLogsComponent } from './activity-logs/activity-logs.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ManageAlertsComponent } from './manage-alerts/manage-alerts.component';
import { CreateAlertComponent } from './manage-alerts/create-alert/create-alert.component';
import { DeleteAlertComponent } from './manage-alerts/delete-alert/delete-alert.component';
import { EditAlertComponent } from './manage-alerts/edit-alert/edit-alert.component';
import { UpdateUserDetailsComponent } from './update-user-details/update-user-details.component';
import { OrganizationDetailsComponent } from './organization-details/organization-details.component';
import { ActivityLogDetailComponent } from './activity-logs/activity-log-detail/activity-log-detail.component';

const routes: Routes = [
  {
    path: 'relationship',
    component: RelationshipManagerComponent,
  },
  {
    path: CHANGE_PASSWORD,
    component: ChangePasswordComponent,
  },
  {
    path: 'fx-rates',
    component: FxRatesComponent,
  },
  {
    path: 'manage-alerts',
    component: ManageAlertsComponent,
  },
  {
    path: 'manage-alerts/create',
    component: CreateAlertComponent,
  },
  {
    path: 'manage-alerts/delete',
    component: DeleteAlertComponent,
  },
  {
    path: 'manage-alerts/edit',
    component: EditAlertComponent,
  },
  {
    path: 'activity-logs',
    component: ActivityLogsComponent,
  },
  {
    path: 'activity-logs/detail',
    component: ActivityLogDetailComponent,
  },
  {
    path: 'userUpdate',
    component: UpdateUserDetailsComponent,
  },
  {
    path: 'organizationDetails',
    component: OrganizationDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserProfileRoutingModules {}
