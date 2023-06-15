import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PayrollLandingComponent} from "./payroll-landing/payroll-landing.component";
import {PayrollWpsRoutingModule} from "./payroll-wps/payroll-wps-routing.module";
import {WpsPlusRoutingModule} from "./payroll-plus/wps-plus-routing.module";
import {PayrollProcessedFilesComponent} from "./payroll-processed-files/payroll-processed-files.component";
import {PayrollProcessedRelatedFilesComponent} from "./payroll-processed-related-files/payroll-processed-related-files.component";
import {PayrollSelfOnBoardingComponent} from "./self-on-boarding/payroll-self-on-boarding.component";
import {PayrollPagesNames} from "./payroll-pages-names";
import {PagesGuard} from "../pages.guard";
import {PayrollType} from "./payroll-type";

const routes: Routes = [
  {
    path: '',
    component: PayrollLandingComponent,
  },
  {
    path: PayrollPagesNames.PROCESSED_FILES,
    canActivate: [PagesGuard],
    data: {service: 'PAYROLL_PROCESSED_FILES'},
    children: [
      {
        path: "",
        component: PayrollProcessedFilesComponent,
        canActivate: [PagesGuard],
        data: {service: 'PAYROLL_PROCESSED_FILES'},
      },
      {
        path: PayrollType.WPS_PLUS,
        component: PayrollProcessedFilesComponent,
        canActivate: [PagesGuard],
        data: {service: 'WPS_PLUS_MENU'},
      },
      {
        path: PayrollType.WPS,
        component: PayrollProcessedFilesComponent,
        canActivate: [PagesGuard],
        data: {service: 'WPS_MENU'},
      }
    ]
  },
  {
    path: 'processed-related-file/' + PayrollType.WPS_PLUS,
    component: PayrollProcessedRelatedFilesComponent,
    canActivate: [PagesGuard],
    data: {service: 'WPS_PLUS_MENU'},
  },
  {
    path: 'processed-related-file/' + PayrollType.WPS,
    component: PayrollProcessedRelatedFilesComponent,
    canActivate: [PagesGuard],
    data: {service: 'WPS_MENU'},
  },
  {
    path: 'self-on-boarding/' + PayrollType.WPS,
    component: PayrollSelfOnBoardingComponent,
    canActivate: [PagesGuard],
    data: {service: 'WPS_PAYROLL_SELF_ON_BOARDING'},
  },
  {
    path: 'self-on-boarding/' + PayrollType.WPS_PLUS,
    component: PayrollSelfOnBoardingComponent,
    canActivate: [PagesGuard],
    data: {service: 'WPS_PAYROLL_SELF_ON_BOARDING'},
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes),
    PayrollWpsRoutingModule,
    WpsPlusRoutingModule],
  exports: [RouterModule]
})
export class PayrollRoutingModule {
}
