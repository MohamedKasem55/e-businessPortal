import {Injector, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PayrollLandingComponent} from './payroll-landing/payroll-landing.component';
import {PayrollRoutingModule} from "./payroll-routing.module";
import {SharedModule} from "../../shared/shared.module";
import {TranslateModule} from "@ngx-translate/core";
import {ModelAndListService} from "../../@core/service/base/modelAndList.service";
import {WpsPayrollService} from "./payroll-wps/wps-payroll-service";
import {ServiceLocator} from "../../@core/service/base/service-locator.service";
import {WpsPlusPayrollService} from "./payroll-plus/wps-plus-payroll.service";
import {PayrollProcessedFilesComponent} from './payroll-processed-files/payroll-processed-files.component';
import {PayrollProcessedRelatedFilesComponent} from './payroll-processed-related-files/payroll-processed-related-files.component';
import {PayrollWpsModule} from "./payroll-wps/payroll-wps.module";
import {WpsPlusModule} from "./payroll-plus/wps-plus.module";
import {PayrollAgreementsService} from "./payroll-agreemnts-service";
import {PayrollSelfOnBoardingComponent} from "./self-on-boarding/payroll-self-on-boarding.component";


@NgModule({
  declarations: [
    PayrollLandingComponent,
    PayrollProcessedFilesComponent,
    PayrollProcessedRelatedFilesComponent,
    PayrollSelfOnBoardingComponent
  ],
  imports: [
    PayrollRoutingModule,
    SharedModule,
    CommonModule,
    TranslateModule,
    PayrollWpsModule,
    WpsPlusModule
  ],

  exports: [PayrollRoutingModule],
  providers: [
    ModelAndListService,
    WpsPayrollService,
    WpsPlusPayrollService,
    PayrollAgreementsService
  ]

})
export class PayrollModule {
  constructor(private injector: Injector) {
    ServiceLocator.injector = this.injector;
  }
}
