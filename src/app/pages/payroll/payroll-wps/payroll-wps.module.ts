import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PayrollWpsRoutingModule} from "./payroll-wps-routing.module";
import {WPSEmployeeAddComponent} from "./employee-add/wps-employee-add.component";
import {SharedModule} from "../../../shared/shared.module";
import {WpsFileUploadComponent} from "./file-upload/wps-file-upload.component";
import {WpsEmployeeModifyComponent} from "./employee-modify/wps-employee-modify.component";
import {WpsEmployeeDeleteComponent} from './employee-delete/wps-employee-delete.component';
import {WpsEmployeeListComponent} from "./employee-list/wps-employee-list.component";
import { GeneratePayrollFileComponent } from './generate-payroll-file/generate-payroll-file.component';
import { MolFilesComponent } from './mol-files/mol-files.component';
import { WpsAnalyticsComponent } from './analytics/wps-analytics.component';


@NgModule({
  declarations: [
    WPSEmployeeAddComponent,
    WpsFileUploadComponent,
    WpsEmployeeModifyComponent,
    WpsEmployeeDeleteComponent,
    WpsEmployeeListComponent,
    GeneratePayrollFileComponent,
    MolFilesComponent,
    WpsAnalyticsComponent,
  ],
  imports: [
    CommonModule,
    PayrollWpsRoutingModule,
    SharedModule
  ]
})
export class PayrollWpsModule {
}
