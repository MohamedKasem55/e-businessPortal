import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WpsPlusEmployeeAddComponent} from "./employee-add/wps-plus-employee-add.component";
import {SharedModule} from "../../../shared/shared.module";
import {WpsPlusEmployeeListComponent} from "./employee-list/wps-plus-employee-list.component";
import {WpsPlusFileUploadComponent} from "./file-upload/wps-plus-file-upload.component";
import { WpsPlusOpenAccountComponent } from './opne-account/wps-plus-open-account.component';
import { WpsPlusRecordsDetailsComponent } from './opne-account/rejected-files-details/wps-plus-records-details.component';
import { WpsPlusReInitiateEmployeeComponent } from './opne-account/re-initiate-employee/wps-plus-re-initiate-employee.component';
import { WpsPlusEmployeeDeleteComponent } from './employee-delete/wps-plus-employee-delete.component';
import { WpsPlusEmployeeEditComponent } from './employee-edit/wps-plus-employee-edit.component';
import { WpsPlusMolFilesComponent } from './mol-files/wps-plus-mol-files.component';
import { WpsPlusAnalyticsComponent } from './analatics/wps-plus-analytics.component';
import { WpsPlusGeneratePayrollFileComponent } from './generate-payroll-file/wps-plus-generate-payroll-file.component';



@NgModule({
  declarations: [
    WpsPlusEmployeeAddComponent,
    WpsPlusEmployeeListComponent,
    WpsPlusFileUploadComponent,
    WpsPlusOpenAccountComponent,
    WpsPlusRecordsDetailsComponent,
    WpsPlusReInitiateEmployeeComponent,
    WpsPlusEmployeeDeleteComponent,
    WpsPlusEmployeeEditComponent,
    WpsPlusMolFilesComponent,
    WpsPlusAnalyticsComponent,
    WpsPlusGeneratePayrollFileComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class WpsPlusModule { }
