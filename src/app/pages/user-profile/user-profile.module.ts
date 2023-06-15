import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ManageAlertsService } from "app/@core/service/manage-alerts/manage-alerts.service";
import { SharedModule } from "app/shared/shared.module";
import { ActivityLogsService } from "../../@core/service/activity-logs/activity-logs.service";
import { ChangePasswordService } from "../../@core/service/change-password/change-password.service";
import { FxRatesService } from "../../@core/service/fx-rates/fx-rates.service";
import { RelationshipManagerService } from "../../@core/service/relationship-manager/relationship-manager.service";
import { ActivityLogsComponent } from "./activity-logs/activity-logs.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { FxRatesComponent } from "./fx-rates/fx-rates.component";
import { BaseAlertComponent } from "./manage-alerts/base-alert/base-alert.component";
import { CreateAlertComponent } from "./manage-alerts/create-alert/create-alert.component";
import { DeleteAlertComponent } from "./manage-alerts/delete-alert/delete-alert.component";
import { EditAlertComponent } from "./manage-alerts/edit-alert/edit-alert.component";
import { ManageAlertsComponent } from "./manage-alerts/manage-alerts.component";
import { RelationshipManagerComponent } from "./relationship-manager/relationship-manager.component";
import { UpdateUserDetailsComponent } from "./update-user-details/update-user-details.component";
import { UserProfileRoutingModules } from "./user-profile-routing.modules";
import { OrganizationDetailsComponent } from "./organization-details/organization-details.component";
import {OrganizationDetailService} from "../../@core/service/organization-details/organization-details.service";
import { ActivityLogDetailComponent } from './activity-logs/activity-log-detail/activity-log-detail.component';


@NgModule({
  imports: [
    UserProfileRoutingModules,
    SharedModule,
    CommonModule
  ],
  declarations: [
    RelationshipManagerComponent,
    ChangePasswordComponent,
    FxRatesComponent,
    ActivityLogsComponent,
    ManageAlertsComponent,
    CreateAlertComponent,
    DeleteAlertComponent,
    EditAlertComponent,
    BaseAlertComponent,
    UpdateUserDetailsComponent,
    OrganizationDetailsComponent,
    ActivityLogDetailComponent
  ],
  providers: [
    ActivityLogsService,
    FxRatesService,
    RelationshipManagerService,
    ChangePasswordService,
    ManageAlertsService,
    OrganizationDetailService
  ]
})
export class UserProfileModule {
}
