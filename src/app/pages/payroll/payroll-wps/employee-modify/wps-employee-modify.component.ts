import {Component, OnInit} from '@angular/core';
import {PayrollBaseComponent} from "../../payroll-base/payroll-base.component";
import {PageModel} from "../../../../@core/model/dto/formModel";
import {confirmEmployeeHeader, editEmployeeForm} from "./wps-employee-modify-controls";
import {FormButtonClickOutput} from "../../../../shared/form/form.component";
import {EmployeePayroll} from "../../../../@core/model/rest/payroll/emoployee/Employee-payroll";
import {SummarySectionModel} from "arb-design-library/model/summary-section.model";
import {ResultModal} from "../../../../@core/model/dto/result.modal";
import {TableControl} from "../../../../@core/model/dto/control/table-control";
import {Subject} from "rxjs";
import {TitleModel} from "arb-design-library/model/title.model";
import {ButtonModel} from "arb-design-library/model/button.model";
import {SummaryModel} from "arb-design-library/model/summary.model";
import {TableInputChangeModel, TableUpdateValue} from "arb-design-library/model/table-input-change.model";

@Component({
  selector: 'app-employee-modify',
  templateUrl: './wps-employee-modify.component.html',
})
export class WpsEmployeeModifyComponent extends PayrollBaseComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>()
  pages!: PageModel[];
  pageTitle: TitleModel = {
    id: "editEmployee",
    title: "payroll.payroll-wps.edit-employee.page-name",
    stepper: {
      steps: ["", "", ""],
      stepCounter: 1,
      stepText: "public.step",
      ofText: "public.of"
    }
  };
  backButton: ButtonModel = {id: "Back", text: "public.back", type: "secondary"}
  nexButton: ButtonModel = {id: "Next", text: "public.next", type: "primary"}
  confirmButton: ButtonModel = {id: 'Confirm', text: 'public.confirm', type: 'primary'}
  override payrollButton: ButtonModel = {
    id: "goToPayroll",
    text: 'payroll.payroll-wps.buttons.go-back-to-wps',
    type: "primary"
  }
  endButtons: ButtonModel[] = [this.nexButton];

  startButtons: ButtonModel[] = [this.cancelButton];
  summary!: SummaryModel;
  result!: ResultModal;

  updatedData!: any;


  constructor() {
    super()
    this.drawPage()
  }




  ngOnInit(): void {
  }

  drawPage() {
    this.pages = [new PageModel(0, editEmployeeForm('editEmployeeForm'))];
    if (!history.state.employeeList) {
      this.goBackToPayroll()
    }
    this.updatedData = structuredClone(history.state.employeeList);
    const tableControl = this.pages[0].forms[0].controls['editEmpTable']
    tableControl.controlOptions.data = history.state.employeeList;
    (tableControl as TableControl).onInputChange.subscribe((res: TableInputChangeModel) => {
      this.onSelectChange(res)
    })

  }
  onSelectChange(employeePayrolls: TableInputChangeModel) {
    let salaryBasic = employeePayrolls.row.hasOwnProperty("salaryBasic_NewValue") ? Number(employeePayrolls.row["salaryBasic_NewValue"]) : Number(employeePayrolls.row["salaryBasic"]);
    let allowanceHousing = employeePayrolls.row.hasOwnProperty("allowanceHousing_NewValue") ? Number(employeePayrolls.row["allowanceHousing_NewValue"]) : Number(employeePayrolls.row["allowanceHousing"]);
    let allowanceOther = employeePayrolls.row.hasOwnProperty("allowanceOther_NewValue") ? Number(employeePayrolls.row["allowanceOther_NewValue"]) : Number(employeePayrolls.row["allowanceOther"]);
    let deductions = employeePayrolls.row.hasOwnProperty("deductions_NewValue") ? Number(employeePayrolls.row["deductions_NewValue"]) : Number(employeePayrolls.row["deductions"]);
    let name = employeePayrolls.row.hasOwnProperty("name_NewValue") ? employeePayrolls.row["name_NewValue"] : employeePayrolls.row["name"];
    let employeeReference = employeePayrolls.row.hasOwnProperty("employeeReference_NewValue") ? employeePayrolls.row["employeeReference_NewValue"] : employeePayrolls.row["employeeReference"];
    let account = employeePayrolls.row.hasOwnProperty("account_NewValue") ? employeePayrolls.row["account_NewValue"] : employeePayrolls.row["account"];
    let departmentId = employeePayrolls.row.hasOwnProperty("departmentId_NewValue") ? employeePayrolls.row["departmentId_NewValue"] : employeePayrolls.row["departmentId"];
    let civilianId = employeePayrolls.row.hasOwnProperty("civilianId_NewValue") ? employeePayrolls.row["civilianId_NewValue"] : employeePayrolls.row["civilianId"];



    let value = salaryBasic + allowanceHousing + allowanceOther - deductions;

    const tableControl = <TableControl>this.pages[0].forms[0].controls['editEmpTable'];
    let values: TableUpdateValue = {
      value,
      id: employeePayrolls.id,
      column: "salary"
    };
    tableControl.updateValues([values]);
    this.updatedData.forEach((item: any) => {
      if (item['employeePk'] == employeePayrolls.id) {
        item[employeePayrolls.column] = employeePayrolls.row[employeePayrolls.column];
        item["salary"] = value
        item["amount"] = value
        item["salaryBasic"] = salaryBasic
        item["allowanceHousing"] = allowanceHousing
        item["allowanceOther"] = allowanceOther
        item["deductions"] = deductions
        item["name"] = name
        item["employeeReference"] = employeeReference
        item["account"] = account
        item["departmentId"] = departmentId
        item["civilianId"] = civilianId

      }
    });
    tableControl.updateValues(this.updatedData);
  }

  onButtonClick(button: FormButtonClickOutput) {
    switch (button.buttonId) {
      case 'Next':
        this.validateModifyEmployees(this.updatedData)
        break
      case 'Confirm':
        this.confirmModifyEmployees(this.updatedData)
        break
      case 'goToPayroll' :
      case 'Cancel':
      case 'Back':
        this.doBackClick()
        break
      case this.dashboardButton.id:
        this.goToDashBoard();
        break
    }
  }

  doBackClick() {
    switch (this.pageTitle.stepper!.stepCounter) {
      case 3:
        this.goBackToPayroll();
        break
      case 2:
        this.stepperMoveBack(this.pageTitle)
        this.endButtons = [this.nexButton]
        this.startButtons = [this.cancelButton]
        break
      case 1:
        this.goBackToPayroll();
        break
    }
  }


  validateModifyEmployees(employees: EmployeePayroll[]) {
    const request = this.getValidateModifyEmployeeRequest(employees)
    this.wpsService.validateModifyEmployee(request).subscribe((employees: any) => {
      this.updatedData = employees.employeesList
      this.fillSummary(employees.employeesList)
      this.endButtons = [this.confirmButton]
      this.startButtons = [this.backButton]
      this.stepperMoveNext(this.pageTitle);
    })
  }

  confirmModifyEmployees(employees: EmployeePayroll[]) {
    this.wpsService.confirmModifyEmployee({employeesList: employees}).subscribe(res => {
      this.popService.dismiss()
      this.stepperMoveNext(this.pageTitle);
      this.summary = {};
      this.endButtons = [this.dashboardButton,this.payrollButton];
      this.startButtons = [];
      this.result = this.fillResult();
      window.scrollTo(0, 0);
    }, (error) => {
      this.stepperMoveNext(this.pageTitle);
      this.summary = {};
      this.endButtons = [this.dashboardButton,this.payrollButton];
      this.startButtons = [];
      this.result = this.fillResult(error.ErrorResponse.errorDescription!);
      window.scrollTo(0, 0);
    })
  }


  private fillSummary(employees: EmployeePayroll[]) {
    let sections: SummarySectionModel[] = [];
    sections.push({
      table: {
        showSortAndPin: false,
        columnId: "civilianId",
        data: employees,
        headers: confirmEmployeeHeader,
        maxDisplayRow: 5,
        isDisabled: true,
      }
    })
    this.summary = {
      sections: sections
    }
  }


  private fillResult(errString?: string): ResultModal {
    if (errString) {
      return {
        type: 'Error',
        title: errString,
        summary: undefined
      };
    } else {
      return {
        type: 'Success',
        title: 'payroll.employee.success',
        subTitle: 'public.thank',
        summary: undefined
      }
    }

  }

  private getValidateModifyEmployeeRequest(employees: EmployeePayroll[]): any {
    employees.forEach(emp => {
      emp.employeeReferenceOLD = emp.employeeReference
      emp.civilianIdOLD = emp.civilianId
      emp.accountOLD = emp.account
      if (!emp.salary) {
        emp.salary = 0
      }
      if (!emp.allowanceHousing) {
        emp.allowanceHousing = 0
      }
      if (!emp.allowanceOther) {
        emp.allowanceOther = 0
      }
      if (!emp.salaryBasic) {
        emp.salaryBasic = 0
      }
      if (!emp.deductions) {
        emp.deductions = 0
      }
    })
    return {employeesList: employees}
  }

}


