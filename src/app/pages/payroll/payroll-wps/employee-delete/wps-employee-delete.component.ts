import {Component} from '@angular/core';
import {PayrollBaseComponent} from "../../payroll-base/payroll-base.component";
import {PageModel} from "../../../../@core/model/dto/formModel";
import {deleteEmployeeForm} from "./wps-employee-delete-controls";
import {Subject} from "rxjs";
import {TitleModel} from "arb-design-library/model/title.model";
import {ButtonModel} from "arb-design-library/model/button.model";
import {SummaryModel} from "arb-design-library/model/summary.model";
import {ResultModal} from "../../../../@core/model/dto/result.modal";
import {EmployeePayroll} from "../../../../@core/model/rest/payroll/emoployee/Employee-payroll";
import {FormButtonClickOutput} from "../../../../shared/form/form.component";
import {Utils} from "../../../../@core/utility/Utils";
import {PayrollPagesNames} from "../../payroll-pages-names";

@Component({
  selector: 'app-wps-employee-delete-component',
  templateUrl: './wps-employee-delete.component.html'
})
export class WpsEmployeeDeleteComponent extends PayrollBaseComponent {

  confirmButton: ButtonModel = {
    id: "Confirm",
    text: "public.confirm",
    type: "primary",
  }
  backButton: ButtonModel = {
    id: "Back",
    text: "public.back",
    type: "secondary",
  }
  destroy$: Subject<boolean> = new Subject<boolean>()
  pages!: PageModel[];
  pageTitle: TitleModel = {
    id: "deleteEmployees",
    title: "payroll.payroll-wps.delete-emp.name",
    stepper: {
      steps: ["", ""],
      stepCounter: 1,
      stepText: "public.step",
      ofText: "public.of"
    }
  };
  endButtons: ButtonModel[] = [this.confirmButton];

  startButtons: ButtonModel[] = [this.cancelButton];
  summary!: SummaryModel;
  result!: ResultModal;
  employeeList!: EmployeePayroll[];


  constructor() {
    super()
    Utils.setBreadcrumb([
      {
        text: 'payroll.main-page-name',
        url: PayrollPagesNames.PAYROLL
      }, {
        text: "payroll.payroll-wps.name",
        url: PayrollPagesNames.PAYROLL + '/employee/list/' + this.getPayrollType()
      },
      {
        text: "payroll.payroll-wps.delete-emp.name",
        url: ""
      }
    ])
    this.payrollButton.text='payroll.payroll-wps.buttons.go-back-to-wps'
    this.drawPage();
  }

  drawPage() {
    this.pages = [new PageModel(0, deleteEmployeeForm('deleteEmployeeForm'))];
    this.employeeList = history.state.employeeList;
    if (!this.employeeList) {
      this.goBackToPayroll()
    }
    const tableControl = this.pages[0].forms[0].controls['deleteTable']
    tableControl.controlOptions.data = this.employeeList;
    tableControl.controlOptions.selectedValues = this.employeeList;
  }


  onButtonClick($event: FormButtonClickOutput) {
    switch ($event.buttonId) {
      case 'Back':
        if (this.pageTitle.stepper!.stepCounter === 2) {
          this.stepperMoveBack(this.pageTitle)
        } else {
          this.goBackToPayroll({state: {selectedRows: this.employeeList}})
        }
        break
      case this.payrollButton.id:
      case 'Cancel':
        this.goBackToPayroll();
        break
      case 'Confirm':
        this.confirmDelete()
        break
      case this.dashboardButton.id:
        this.goToDashBoard()
        break

    }

  }

  confirmDelete() {
    this.wpsService.confirmDeleteEmployee({employeesList: this.employeeList}).subscribe({
      next: () => {
        this.endButtons = [this.dashboardButton,this.payrollButton]
        this.startButtons = []
        this.stepperMoveNext(this.pageTitle)
        this.result = this.fillResult()
        this.summary = {}
      }
    })
  }

  fillResult(errString?: string): ResultModal {
    if (errString) {
      return {
        type: 'Error',
        title: errString,
        summary: undefined,
      };
    } else {
      return {
        type: 'Success',
        title: 'payroll.payroll-wps.delete-emp.success-title',
        subTitle: 'payroll.payroll-wps.delete-emp.success-subtitle',
        summary: undefined
      };
    }
  }
}
