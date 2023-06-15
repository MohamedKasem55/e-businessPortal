import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WPSEmployeeAddComponent} from "./employee-add/wps-employee-add.component";
import {WpsEmployeeModifyComponent} from "./employee-modify/wps-employee-modify.component";
import {WpsFileUploadComponent} from "./file-upload/wps-file-upload.component";
import {WpsEmployeeDeleteComponent} from "./employee-delete/wps-employee-delete.component";
import {WpsEmployeeListComponent} from "./employee-list/wps-employee-list.component";
import {PayrollType} from "../payroll-type";
import {PayrollPagesNames} from "../payroll-pages-names";
import {GeneratePayrollFileComponent} from "./generate-payroll-file/generate-payroll-file.component";
import {MolFilesComponent} from "./mol-files/mol-files.component";
import {WpsAnalyticsComponent} from "./analytics/wps-analytics.component";

const routes: Routes = [
  {
    path: 'employee/list/' + PayrollType.WPS,
    component: WpsEmployeeListComponent,
  },
  {
    path: PayrollPagesNames.ADD_EMPLOYEE + '/' + PayrollType.WPS,
    component: WPSEmployeeAddComponent,
  },
  {
    path: PayrollPagesNames.DELETE_EMPLOYEE + '/' + PayrollType.WPS,
    component: WpsEmployeeDeleteComponent,
  },
  {
    path: PayrollPagesNames.EDIT_EMPLOYEE + '/' + PayrollType.WPS,
    component: WpsEmployeeModifyComponent,
  },
  {
    path: PayrollPagesNames.UPLOAD_FILES + '/' + PayrollType.WPS,
    component: WpsFileUploadComponent,
  },
  {
    path: PayrollPagesNames.GENERATE_PAYROLL_FILE + '/' + PayrollType.WPS,
    component: GeneratePayrollFileComponent
  },
  {
    path: PayrollPagesNames.MOL_FILE + '/' + PayrollType.WPS,
    component: MolFilesComponent
  },
  {
    path: PayrollPagesNames.ANALYTICS + '/' + PayrollType.WPS,
    component: WpsAnalyticsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollWpsRoutingModule {
}
