import {NgModule} from "@angular/core";
import {SharedModule} from "../../shared/shared.module";
import {CardsSharedModule} from "../cards-shared/cards-shared.module";
import {CommonModule} from "@angular/common";
import {DashboardLayoutComponent} from "../../layout/dashboard-layout/dashboard-layout.component";
import {DashboardComponent} from "./dashboard.component";
import {TopCardsSectionComponent} from "./dashboard-sections/top-cards-section/top-cards-section.component";
import {
  PendingActionsSectionComponent
} from "./dashboard-sections/pending-actions-section/pending-actions-section.component";
import {AccountsSectionComponent} from "./dashboard-sections/accounts-section/accounts-section.component";
import {BillsSectionComponent} from "./dashboard-sections/bills-section/bills-section.component";
import {TransfersSectionComponent} from "./dashboard-sections/transfers-section/transfers-section.component";
import {InflowInsightsComponent} from "./dashboard-sections/inflow-insights-section/inflow-insights.component";
import {DashboardRoutingModule} from "./dashboard-routing.module";
import {NgbPopoverModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  imports: [
    DashboardRoutingModule,
    NgbPopoverModule,
    SharedModule,
    CardsSharedModule,
    CommonModule,
    ],
  declarations:[
    DashboardLayoutComponent,
    DashboardComponent,
    TopCardsSectionComponent,
    PendingActionsSectionComponent,
    AccountsSectionComponent,
    BillsSectionComponent,
    TransfersSectionComponent,
    InflowInsightsComponent,
  ]

})export class DashboardModule {
}
