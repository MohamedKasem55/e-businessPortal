import {Component, OnInit} from '@angular/core';
import {PayrollBaseComponent} from "../../payroll-base/payroll-base.component";
import {FormResult, PageModel} from "../../../../@core/model/dto/formModel";
import {TitleModel} from "arb-design-library/model/title.model";
import {ButtonModel} from "arb-design-library/model/button.model";
import {SummaryModel} from "arb-design-library/model/summary.model";
import {ResultModal} from "../../../../@core/model/dto/result.modal";
import {FormButtonClickOutput} from "../../../../shared/form/form.component";
import {deleteEmployeesFrom} from "./wps-plus-employee-delete-controls";

@Component({
  selector: 'app-wps-plus-employee-delete',
  templateUrl: './wps-plus-employee-delete.component.html'
})
export class WpsPlusEmployeeDeleteComponent extends PayrollBaseComponent {
  pages: PageModel[] = []
  pageTitle: TitleModel = {
    id: "WpsPlusEmployeeDeleteId",
    title: "payroll.payroll-wps-plus.delete-employee.page-name",
    stepper: {
      stepCounter: 1, stepText: 'public.step',
      ofText: 'public.of', steps: ['', '']
    }
  };
  nexButton: ButtonModel = {id: "Next", type: "primary", text: "public.next"}
  confirmButton: ButtonModel = {id: "Confirm", type: "primary", text: "public.confirm"};
  backButton: ButtonModel = {id: "Back", type: "secondary", text: "public.back"};
  startButtons: ButtonModel[] = [this.cancelButton];
  endButtons: ButtonModel[] = [this.confirmButton];
  summary!: SummaryModel;
  result!: ResultModal;

  constructor() {
    super()
    if (!history.state.selectedRows) {
      this.goBackToPayroll()
    }
    this.payrollButton.text = "payroll.payroll-wps-plus.buttons.go-back-to-wps-plus";
    this.pages = [new PageModel(1, deleteEmployeesFrom())]
    for (let emp of history.state.selectedRows) {
      emp.currencyCode = 'SAR'
      if (!emp.employeeReference) {
        emp.employeeReference = ''
      }
    }
    this.getControl(this.pages, 0, 0, "employeesDeleteTable").controlOptions.data = history.state.selectedRows;
    this.getControl(this.pages, 0, 0, "employeesDeleteTable").controlOptions.selectedValues = history.state.selectedRows;
  }


  onButtonClick(data: FormButtonClickOutput) {
    switch (data.buttonId) {
      case this.cancelButton.id:
      case this.payrollButton.id:
        this.goBackToPayroll()
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



  private confirm() {
    this.wpsPlusPayrollService.confirmDeleteEmployees(
      {employees: this.getControl(this.pages, 0, 0, "employeesDeleteTable").controlOptions.data}
    ).subscribe({
      next: () => {
        this.endButtons = [this.dashboardButton,this.payrollButton]
        this.startButtons = []
        this.stepperMoveNext(this.pageTitle)
        this.result = this.fillResult()
        this.summary = {}
      },
      error: (err) => {
        this.endButtons = [this.dashboardButton,this.payrollButton]
        this.startButtons = []
        this.stepperMoveNext(this.pageTitle)
        this.result = this.fillResult()
        this.summary = {}
      }
    })

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
        title: 'payroll.payroll-wps-plus.delete-employee.result.success',
        subTitle: 'public.thank',
        summary: undefined
      }
    }
  }
}
