import {Component} from '@angular/core';
import {PayrollBaseComponent} from "../../payroll-base/payroll-base.component";
import {FormButtonClickOutput} from "../../../../shared/form/form.component";
import {FormResult, PageModel} from "../../../../@core/model/dto/formModel";
import {TitleModel} from "arb-design-library/model/title.model";
import {ButtonModel} from "arb-design-library/model/button.model";
import {SummaryModel} from "arb-design-library/model/summary.model";
import {ResultModal} from "../../../../@core/model/dto/result.modal";
import {confirmEditTableHeaders, editEmployeesFrom} from "./wps-plus-employee-edit-controls";
import {SummarySectionModel} from "arb-design-library/model/summary-section.model";
import {TableControl} from "../../../../@core/model/dto/control/table-control";
import {TableInputChangeModel, TableUpdateValue} from "arb-design-library/model/table-input-change.model";

@Component({
  selector: 'app-wps-plus-employee-edit',
  templateUrl: './wps-plus-employee-edit.component.html'
})
export class WpsPlusEmployeeEditComponent extends PayrollBaseComponent {
  pages: PageModel[] = []
  pageTitle: TitleModel = {
    id: "WpsPlusEmployeeEditId",
    title: "payroll.payroll-wps-plus.edit-employee.page-name",
    stepper: {
      stepCounter: 1, stepText: 'public.step',
      ofText: 'public.of', steps: ['', '', '']
    }
  };
  nexButton: ButtonModel = {id: "Next", type: "primary", text: "public.next"}
  startButtons: ButtonModel[] = [this.cancelButton];
  endButtons: ButtonModel[] = [this.nexButton];
  summary!: SummaryModel;
  result!: ResultModal;
  confirmButton: ButtonModel = {id: "Confirm", type: "primary", text: "public.confirm"};
  backButton: ButtonModel = {id: "Back", type: "secondary", text: "public.back"};

  updatedData!: any;


  constructor() {
    super()
    if (!history.state.selectedRows) {
      this.goBackToPayroll()
    }
    this.payrollButton.text = "payroll.payroll-wps-plus.buttons.go-back-to-wps-plus"
    this.pages = [new PageModel(1, editEmployeesFrom())]
    for (let emp of history.state.selectedRows) {
      emp.currencyCode = 'SAR'
      if (!emp.employeeReference) {
        emp.employeeReference = ''
      }
    }
    this.updatedData = structuredClone(history.state.selectedRows);
    this.getControl(this.pages, 0, 0, "employeesDeleteTable").controlOptions.data = history.state.selectedRows;
    this.getControl(this.pages, 0, 0, "employeesDeleteTable").controlOptions.selectedValues = history.state.selectedRows;
    (this.getControl(this.pages, 0, 0, "employeesDeleteTable") as TableControl).onInputChange.subscribe((res: TableInputChangeModel) => {
      this.onSelectChange(res)
    });
  }

  onSelectChange(employeePayrolls: TableInputChangeModel) {
    let salaryBasic = employeePayrolls.row.hasOwnProperty("salaryBasic_NewValue") ? Number(employeePayrolls.row["salaryBasic_NewValue"]) : Number(employeePayrolls.row["salaryBasic"]);
    let allowanceHousing = employeePayrolls.row.hasOwnProperty("allowanceHousing_NewValue") ? Number(employeePayrolls.row["allowanceHousing_NewValue"]) : Number(employeePayrolls.row["allowanceHousing"]);
    let allowanceOther = employeePayrolls.row.hasOwnProperty("allowanceOther_NewValue") ? Number(employeePayrolls.row["allowanceOther_NewValue"]) : Number(employeePayrolls.row["allowanceOther"]);
    let deductions = employeePayrolls.row.hasOwnProperty("deductions_NewValue") ? Number(employeePayrolls.row["deductions_NewValue"]) : Number(employeePayrolls.row["deductions"]);
    let nickName = employeePayrolls.row.hasOwnProperty("nickName_NewValue") ? employeePayrolls.row["nickName_NewValue"] : employeePayrolls.row["nickName"];
    let empNumber = employeePayrolls.row.hasOwnProperty("employeeNumber_NewValue") ? employeePayrolls.row["employeeNumber_NewValue"] : employeePayrolls.row["employeeNumber"];


    let value = salaryBasic + allowanceHousing + allowanceOther - deductions;

    const tableControl = <TableControl>this.getControl(this.pages, 0, 0, "employeesDeleteTable");
    let values: TableUpdateValue = {
      value,
      id: employeePayrolls.id,
      column: "salary"
    };
    tableControl.updateValues([values]);
    this.updatedData.forEach((item: any) => {
      if (item['uniqueEmployeeKey'] == employeePayrolls.id) {
        item[employeePayrolls.column] = employeePayrolls.row[employeePayrolls.column];
        item["salary"] = value
        item["amount"] = value
        item["salaryBasic"] = salaryBasic
        item["allowanceHousing"] = allowanceHousing
        item["allowanceOther"] = allowanceOther
        item["deductions"] = deductions
        item["employeeNumber"] = empNumber
        item["nickName"] = nickName

      }
    });
    tableControl.updateValues(this.updatedData);
  }

  onButtonClick(data: FormButtonClickOutput) {
    switch (data.buttonId) {
      case this.cancelButton.id:
      case this.backButton.id:
      case this.payrollButton.id:
        this.doBackClick();
        break
      case this.nexButton.id:
        this.validate();
        break
      case this.confirmButton.id:
        this.confirm();
        break
      case this.dashboardButton.id:
        this.goToDashBoard();
        break

    }
  }

  override onResultChanged(forms: FormResult[]) {

  }

  private doBackClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 3:
        this.goBackToPayroll()
        break
      case 2:
        this.stepperMoveBack(this.pageTitle)
        this.endButtons = [this.nexButton]
        this.startButtons = [this.cancelButton]
        break
      case 1:
        this.goBackToPayroll()
        break

    }
  }

  private validate() {
    this.stepperMoveNext(this.pageTitle)
    this.summary = this.fillSummary()
    this.endButtons = [this.confirmButton]
    this.startButtons = [this.backButton]

  }

  private confirm() {
    this.wpsPlusPayrollService.confirmModifyEmployees(
      {
        employees: this.updatedData
      }).subscribe({
      next: () => {
        this.stepperMoveNext(this.pageTitle)
        this.summary = {}
        this.result = this.fillResult()
        this.endButtons = [this.dashboardButton,this.payrollButton]
        this.startButtons = []
      },
      error: (err) => {
        this.stepperMoveNext(this.pageTitle)
        this.summary = {}
        this.result = this.fillResult(err.ErrorResponse.errorDescription!)
        this.endButtons = [this.dashboardButton,this.payrollButton]
        this.startButtons = []
      }
    })

  }

  private fillSummary(): SummaryModel {
    let sections: SummarySectionModel[] = [];
    sections.push({
      table: {
        columnId: "civilianId",
        data: this.updatedData,
        headers: confirmEditTableHeaders,
        maxDisplayRow: 5,
        isDisabled: true,
      }
    })
    return {
      sections: sections
    }
  }

  private fillResult(err?: string): ResultModal {
    if (err) {
      return {
        type: "Error",
        title: err,
        summary: undefined
      }
    } else {
      return {
        type: "Success",
        title: 'payroll.payroll-wps-plus.edit-employee.result.success',
        subTitle: 'public.thank',
        summary: undefined
      }
    }

  }
}
