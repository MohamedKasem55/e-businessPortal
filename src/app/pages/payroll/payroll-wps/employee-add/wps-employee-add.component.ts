import { Component, OnDestroy } from '@angular/core';
import { FormModel, FormResult, PageModel } from "../../../../@core/model/dto/formModel";
import { EmployeePayroll } from "../../../../@core/model/rest/payroll/emoployee/Employee-payroll";
import { Subject, takeUntil } from "rxjs";
import { UUID } from "angular2-uuid";
import { FormButtonClickOutput } from "../../../../shared/form/form.component";
import { ModelAndListService } from "../../../../@core/service/base/modelAndList.service";
import { civilianIdValidations, IBANValidations, newEmployeeForm } from "./wps-employee-add-controls";
import { TitleModel } from "arb-design-library/model/title.model";
import { ButtonModel } from "arb-design-library/model/button.model";
import { SummaryModel } from "arb-design-library/model/summary.model";
import { ResultModal } from "../../../../@core/model/dto/result.modal";
import { SummarySectionModel } from "arb-design-library/model/summary-section.model";
import { PayrollBaseComponent } from "../../payroll-base/payroll-base.component";
import { ValidationsEnum } from "../../../../@core/model/dto/validations-enum";
import { ValidatorsItem } from "../../../../@core/model/dto/control/control.model";
import { Utils } from "../../../../@core/utility/Utils";
import { PayrollPagesNames } from "../../payroll-pages-names";


@Component({
  selector: 'wps-employee-add',
  templateUrl: './wps-employee-add.component.html'
})
export class WPSEmployeeAddComponent extends PayrollBaseComponent implements OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>()
  pages!: PageModel[];
  pageTitle: TitleModel = {
    id: "addEmployee",
    title: "payroll.employee.addEmployee",
    stepper: { steps: ['', '', '',], stepCounter: 1, stepText: 'public.step', ofText: 'public.of' }
  };
  endButtons: ButtonModel[] = [{
    id: "addMore",
    type: "secondary",
    text: 'payroll.employee.add-more',
    prefixIcon: " arb-icon-add"
  },
  {
    id: "ValidatePayrollEmployees",
    type: "primary",
    text: 'public.next',
    isDisable: true
  }];

  startButtons: ButtonModel[] = [{ id: 'Back', text: 'public.back', type: "secondary" }];
  summary!: SummaryModel;
  result!: ResultModal;
  editButton: ButtonModel = {
    id: "Edit",
    text: 'public.edit',
    type: "secondary"
  }
  confirmButton: ButtonModel = {
    id: "ConfirmPayrollEmployees",
    text: 'public.confirm',
    type: "primary"
  }

  validateResponseEmployeeList!: EmployeePayroll[]

  constructor(private modelService: ModelAndListService,) {

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
        text: "payroll.payroll-wps.add-employee.page-name",
        url: ""
      }
    ])
    this.payrollButton.text = 'payroll.payroll-wps.buttons.go-back-to-wps'
    this.pages = [new PageModel(0, newEmployeeForm(UUID.UUID()))];
    this.pages[0].valueChanges.subscribe(formIdx => {
      this.formChanges(formIdx)
    })
  }

  onButtonClick(event: FormButtonClickOutput) {
    switch (event.buttonId) {
      case 'deleteButton':
        this.pages[0].deleteFrom(event.formIndex!, 1)
        this.checkValidation(event.formIndex!)
        break
      case 'addMore':
        this.pages[0].addForm(newEmployeeForm(UUID.UUID()))
        if (this.pages[0].forms.length < 2) {
          this.endButtons[0].isDisable = true
        }
        break
      case 'ValidatePayrollEmployees':
        this.validateSaveEmployee();
        break
      case 'ConfirmPayrollEmployees':
        this.confirmPayrollEmployees();
        break
      case 'Back':
      case 'Edit':
        this.doBackClick();
        break
      case this.payrollButton.id:
        this.goBackToPayroll()
        break
      case 'goToDashBoard':
        this.router.navigateByUrl("dashboard")
        break
    }
  }

  doBackClick() {
    switch (this.pageTitle.stepper!.stepCounter) {
      case 3:
        break
      case 2:
        this.stepperMoveBack(this.pageTitle)
        this.endButtons = [{
          id: "addMore",
          type: "secondary",
          text: 'payroll.employee.add-more',
          prefixIcon: " arb-icon-add"
        },
        {
          id: "ValidatePayrollEmployees",
          type: "primary",
          text: 'public.next',
          isDisable: true
        }]
        break
      case 1:
        this.goBackToPayroll()
        break
    }
  }

  validateSaveEmployee(): void {
    let employees: EmployeePayroll[] = []
    this.pages[0].forms.forEach((f: FormModel) => {
      const emp: EmployeePayroll = {
        account: f.controls['IBANAccount'].value,
        allowanceHousing: f.controls['housingAllowance'].value != '' ? f.controls['housingAllowance'].value : '0',
        allowanceOther: f.controls['otherAllowance'].value != '' ? f.controls['otherAllowance'].value : '0',
        bankCode: f.controls['bankCode'].value,
        civilianId: f.controls['civilianId'].value,
        currencyCode: 'SAR',
        deductions: f.controls['deduction'].value != '' ? f.controls['deduction'].value : '0',
        departmentId: f.controls['dept'].value,
        employeeReference: f.controls['empNumber'].value,
        name: f.controls['empName'].value,
        salary: this.calculateTotalSalary(f),
        salaryBasic: f.controls['basicSalary'].value != '' ? f.controls['basicSalary'].value : '0'
      }
      employees.push(emp)
    })
    this.wpsService.validateAddEmployee(employees)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.validateResponseEmployeeList = res.employeesList;
          this.summary = this.fillSummary()
          this.stepperMoveNext(this.pageTitle)
          this.endButtons = [this.confirmButton]
        }
      })


  }

  calculateTotalSalary(f: FormModel): number {
    const basicSalary = Number(f.controls['basicSalary']?.value);
    const deduction = Number(f.controls['deduction']?.value);
    const housingAllowance = Number(f.controls['housingAllowance']?.value);
    const otherAllowance = Number(f.controls['otherAllowance']?.value);
    return basicSalary + housingAllowance + otherAllowance - deduction

  }

  ngOnDestroy(): void {
    this.destroy$.next(true)
  }

  formChanges(formIndex: number) {
    const form: FormModel = this.pages[0].forms[formIndex];
    const totalSalary = this.calculateTotalSalary(form)
    form.controls['totalSalary'].controlOptions.subTitle[0].amount = totalSalary.toString()
    if (form.controls['IBANAccount']?.value.length > 6) {
      this.getBankNameFromIBAN(form.controls['IBANAccount']?.value, form)
    }
    this.checkValidation(formIndex)
  }

  override onResultChanged(forms: FormResult[], endButtons: ButtonModel[]): void {
    let valid: boolean[] = [];
    if (forms.length > 0) {
      forms.forEach(form => {
        if (form.valid) {
          valid.push(true)
        } else {
          valid.push(false)
        }
      })
      for (let button of endButtons) {
        button.isDisable = valid.includes(false);
      }
    } else if (forms.length == 1) {
      this.endButtons[1].isDisable = true
      this.endButtons[0].isDisable = true
    } else {
      this.endButtons[1].isDisable = true
      this.endButtons[0].isDisable = false
    }

  }

  checkValidation(formIndex: number) {
    let civilianIdValues = [];
    let empNumberValues = [];
    let IBANAccountValues = [];
    for (let index = 0; index < this.pages[0].forms.length; index++) {
      if (formIndex != index) {
        let form = this.pages[0].forms[index];
        civilianIdValues.push(form.controls['civilianId'].value)
        empNumberValues.push(form.controls['empNumber'].value)
        IBANAccountValues.push(form.controls['IBANAccount'].value)
      }
    }
    let form = this.pages[0].forms[formIndex];
    form.controls['civilianId'].setValidators([{
      validation: ValidationsEnum.UNIQUE,
      options: JSON.stringify(civilianIdValues)
    }, ...civilianIdValidations]);
    form.controls['empNumber'].setValidators([{
      validation: ValidationsEnum.UNIQUE,
      options: JSON.stringify(empNumberValues)
    }]);
    form.controls['IBANAccount'].setValidators([{
      validation: ValidationsEnum.UNIQUE,
      options: JSON.stringify(IBANAccountValues)
    }, ...IBANValidations]);
  }


  removeValidation(form: FormModel) {
    {
      let val: ValidatorsItem[] = form.controls['civilianId'].getValidators()
      if (val.find((x) => x.validation === ValidationsEnum.UNIQUE)) {
        val.pop()
        form.controls['civilianId'].setValidators(val)
      }
    }
    {
      let val: ValidatorsItem[] = form.controls['empNumber'].getValidators()
      if (val.find((x) => x.validation === ValidationsEnum.UNIQUE)) {
        val.pop()
        form.controls['empNumber'].setValidators(val)
      }
    }
    {
      let val: ValidatorsItem[] = form.controls['IBANAccount'].getValidators()
      if (val.find((x) => x.validation === ValidationsEnum.UNIQUE)) {
        val.pop()
        form.controls['IBANAccount'].setValidators(val)
      }
    }
  }

  private getBankNameFromIBAN(iban: string, form: FormModel): void {
    const bankCode = iban.length > 6 ? '0' + iban.substring(4, 6) : ''
    this.modelService.getModel('bankCode').subscribe(res => {
      form.controls['bank'].setValue(res['bankCode'][bankCode])
      this.getBankCodeFromIBAN(bankCode, form)
    })
  }

  private getBankCodeFromIBAN(bankCode: string, form: FormModel): void {
    this.modelService.getModel('bankCodeConversion').subscribe(res => {
      form.controls['bankCode'].setValue(res['bankCodeConversion'][bankCode])
    })
  }

  fillSummary(): SummaryModel {
    let sections: SummarySectionModel[] = [];
    this.validateResponseEmployeeList.forEach((emp: EmployeePayroll, index: number) => {
      sections.push({
        pill: { type: "Neutral", text: this.translate.instant("payroll.payroll-wps.add-employee.newEmployeeNo") + (index + 1) },
        items: [
          {
            title: 'payroll.employee.emp-number',
            subTitle: emp.employeeReference
          },
          {
            title: 'payroll.employee.emp-name',
            subTitle: emp.name
          },
          {
            title: 'payroll.employee.civ-id',
            subTitle: emp.civilianId
          },
          {
            title: 'payroll.employee.dept',
            subTitle: emp.departmentId
          },
          {
            title: 'payroll.emp-total-salary',
            subTitle: emp.salary.toString(),
            currency: 'SAR'
          },
          {
            title: 'payroll.emp-basic-salary',
            subTitle: emp.salaryBasic.toString(),
            currency: 'SAR'
          },
          {
            title: 'payroll.emp-housing-allowance',
            subTitle: emp.allowanceHousing?.toString(),
            currency: 'SAR'
          },
          {
            title: 'payroll.emp-other-allowance',
            subTitle: emp.allowanceOther?.toString(),
            currency: 'SAR'
          },
          {
            title: 'payroll.emp-deductions',
            subTitle: emp.deductions.toString(),
            currency: 'SAR'
          },
        ]
      });
    })

    return {
      title: {
        id: 'SummaryTitle',
      },
      sections: sections
    }
  }

  private confirmPayrollEmployees() {
    this.wpsService.confirmAddEmployee({ employeesList: this.validateResponseEmployeeList }).subscribe({
      next: () => {
        this.summary = {}
        this.stepperMoveNext(this.pageTitle)
        this.result = this.fillResult()
        this.endButtons = [this.dashboardButton, this.payrollButton]
        this.startButtons = []
      }
    })

  }

  fillResult(errString?: string): ResultModal {
    if (errString) {
      return {
        type: 'Error',
        title: errString,
        summary: this.fillSummary(),
      };
    } else {
      return {
        type: 'Success',
        title: 'payroll.payroll-wps.add-employee.success-title',
        subTitle: 'payroll.payroll-wps.add-employee.success-subtitle',
        summary: undefined
      };
    }
  }
}
