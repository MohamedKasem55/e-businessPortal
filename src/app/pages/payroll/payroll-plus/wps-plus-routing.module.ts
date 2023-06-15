import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WpsPlusEmployeeAddComponent} from "./employee-add/wps-plus-employee-add.component";
import {WpsPlusEmployeeListComponent} from "./employee-list/wps-plus-employee-list.component";
import {PayrollType} from "../payroll-type";
import {PayrollPagesNames} from "../payroll-pages-names";
import {WpsPlusFileUploadComponent} from "./file-upload/wps-plus-file-upload.component";
import {WpsPlusOpenAccountComponent} from "./opne-account/wps-plus-open-account.component";
import {WpsPlusRecordsDetailsComponent} from "./opne-account/rejected-files-details/wps-plus-records-details.component";
import {WpsPlusReInitiateEmployeeComponent} from "./opne-account/re-initiate-employee/wps-plus-re-initiate-employee.component";
import {WpsPlusEmployeeDeleteComponent} from "./employee-delete/wps-plus-employee-delete.component";
import {WpsPlusEmployeeEditComponent} from "./employee-edit/wps-plus-employee-edit.component";
import {WpsPlusGeneratePayrollFileComponent} from "./generate-payroll-file/wps-plus-generate-payroll-file.component";
import {WpsPlusMolFilesComponent} from "./mol-files/wps-plus-mol-files.component";


const routes: Routes = [
  {
    path: 'employee/list/' + PayrollType.WPS_PLUS,
    component: WpsPlusEmployeeListComponent,
  },
  {
    path: PayrollPagesNames.ON_BOARDING_NEW_EMPLOYEES + '/' + PayrollType.WPS_PLUS,
    component: WpsPlusEmployeeAddComponent,
  },
  {
    path: PayrollPagesNames.UPLOAD_FILES + '/' + PayrollType.WPS_PLUS,
    component: WpsPlusFileUploadComponent,
  },
  {
    path: PayrollPagesNames.REQUEST_OPEN_ACCOUNT + '/' + PayrollType.WPS_PLUS,
    component: WpsPlusOpenAccountComponent
  },
  {
    path: PayrollPagesNames.RECORDS_DETAILS + '/' + PayrollType.WPS_PLUS,
    component: WpsPlusRecordsDetailsComponent
  },
  {
    path: PayrollPagesNames.RE_INITIATE + '/' + PayrollType.WPS_PLUS,
    component: WpsPlusReInitiateEmployeeComponent
  },
  {
    path: PayrollPagesNames.DELETE_EMPLOYEE + '/' + PayrollType.WPS_PLUS,
    component: WpsPlusEmployeeDeleteComponent
  },
  {
    path: PayrollPagesNames.EDIT_EMPLOYEE + '/' + PayrollType.WPS_PLUS,
    component: WpsPlusEmployeeEditComponent
  },
  {
    path: PayrollPagesNames.GENERATE_PAYROLL_FILE + '/' + PayrollType.WPS_PLUS,
    component: WpsPlusGeneratePayrollFileComponent
  },
  {
    path: PayrollPagesNames.MOL_FILE + '/' + PayrollType.WPS_PLUS,
    component: WpsPlusMolFilesComponent
  },
  // {
  //   path: PayrollPagesNames.ANALYTICS + '/' + PayrollType.WPS_PLUS,
  //   component: WpsPlusAnalyticsComponent
  // },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WpsPlusRoutingModule {
}
