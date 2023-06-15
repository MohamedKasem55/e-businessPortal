import {FormModel} from "../../../../@core/model/dto/formModel";
import {TitleControl} from "../../../../@core/model/dto/control/title-control";
import {ButtonControl} from "../../../../@core/model/dto/control/button-control";
import {NumberInputControl} from "../../../../@core/model/dto/control/number-input-control";
import {TextInputControl} from "../../../../@core/model/dto/control/text-input-control";
import {ValidationsEnum} from "../../../../@core/model/dto/validations-enum";
import {AbstractControl, ValidationErrors} from "@angular/forms";


export const newEmployeeForm = (id: string): FormModel => {
  return new FormModel({
    id: id,
    controls: {
      titlePersonalDetails: new TitleControl({
        columnCount: 10,
        order: 1,
        controlOptions: {
          id: "",
          title: 'payroll.employee.personal-details',
        }
      }),
      deleteButton: new ButtonControl({
        columnCount: 2,
        order: 2,
        controlOptions: {
          id: 'deleteButton',
          text: "",
          type: 'danger',
          prefixIcon: 'arb-icon-Trash',
        }
      }),
      empNumber: new NumberInputControl({
        label: 'payroll.employee.emp-number', order: 2, columnCount: 6, value: '', required: true,
        validationLabels: {
          required: 'payroll.payroll-wps.add-employee.validation-messages.required.emp-number',
          customValidator: 'payroll.payroll-wps.add-employee.validation-messages.customValidator.emp-number'
        }
      }),
      empName: new TextInputControl({
        label: 'payroll.employee.emp-name',
        order: 3,
        columnCount: 6,
        value: '',
        required: true,
        validators: [{validation: ValidationsEnum.ONLY_ALPHABETIC}],
        validationLabels: {
          pattern: 'payroll.payroll-wps.add-employee.validation-messages.pattern.emp-name',
          required: "payroll.payroll-wps.add-employee.validation-messages.required.emp-name"
        }
      }),
      civilianId: new NumberInputControl({
        label: 'payroll.employee.civ-id', order: 4, columnCount: 6, value: '', required: true,
        validators: civilianIdValidations,
        controlOptions: {maxlength: 10},
        validationLabels: {
          customValidator: 'payroll.payroll-wps.add-employee.validation-messages.customValidator.civilianId',
          pattern: 'payroll.payroll-wps.add-employee.validation-messages.pattern.civilianId',
          required: "payroll.payroll-wps.add-employee.validation-messages.required.civilianId"
        }
      }),
      dept: new TextInputControl({
        label: 'payroll.employee.dept', order: 5, columnCount: 6, value: '',
      }),
      totalSalary: new TitleControl({
        columnCount: 12,
        order: 6,
        controlOptions: {
          id: "",
          title: 'payroll.employee.salary-details',
          subTitle: [{
            text: 'payroll.employee.total-salary',
            amount: '0',
            currency: 'SAR'
          }]
        },
        validators: [{validation: ValidationsEnum.MIN, options: '0'}],
        validationLabels: {min: "payroll.payroll-wps.add-employee.validation-messages.min.totalSalary"}
      }),
      IBANAccount: new TextInputControl({
        label: 'payroll.employee.iban-account', order: 7, columnCount: 6, value: '', required: true,
        validators: IBANValidations,
        validationLabels: {
          pattern: 'payroll.payroll-wps.add-employee.validation-messages.required.IBANAccount',
          required: 'payroll.payroll-wps.add-employee.validation-messages.pattern.IBANAccount',
          customValidator: 'payroll.payroll-wps.add-employee.validation-messages.customValidator.IBANAccount'
        }
      }),
      bank: new TextInputControl({
        label: 'payroll.employee.bank',
        order: 8,
        columnCount: 6,
        value: '',
        disable: true,
        validators: [{validation: ValidationsEnum.TRUE}]
      }),
      bankCode: new TextInputControl({
        hidden: true
      }),
      basicSalary: new NumberInputControl({
        label: 'payroll.employee.basic-salary', order: 9, columnCount: 6, value: '', required: true,
        validationLabels: {required: 'payroll.payroll-wps.add-employee.validation-messages.required.basicSalary'}
      }),
      housingAllowance: new NumberInputControl({
        label: 'payroll.employee.housing-allowance', order: 10, columnCount: 6, value: '',
      }),
      otherAllowance: new NumberInputControl({
        label: 'payroll.employee.other-allowance', order: 11, columnCount: 6, value: '',
      }),
      deduction: new NumberInputControl({
        label: 'payroll.employee.deduction', order: 12, columnCount: 6, value: '',
      })
    },
    formValidator: [{
      validatorFunc: (control: AbstractControl): ValidationErrors | null => {
        const basicSalary = (control.get('basicSalary')?.value != null || control.get('basicSalary')?.value != '') ? Number(control.get('basicSalary')?.value) : 0;
        const deduction = (control.get('deduction')?.value != null || control.get('deduction')?.value != '') ? Number(control.get('deduction')?.value) : 0;
        const housingAllowance = (control.get('housingAllowance')?.value != null || control.get('housingAllowance')?.value != '') ? Number(control.get('housingAllowance')?.value) : 0;
        const otherAllowance = (control.get('otherAllowance')?.value != null || control.get('otherAllowance')?.value != '') ? Number(control.get('otherAllowance')?.value) : 0;
        const total = basicSalary + housingAllowance + otherAllowance - deduction
        return (total > 0 || total == 0) ? null : {forbiddenValue: basicSalary + housingAllowance + otherAllowance};
      },
      errorName: 'forbiddenValue',
      errorMessage: 'payroll.employee.not-allowed'
    }]

  })

}
export const IBANValidations = [
  {
    validation: ValidationsEnum.MAX_LENGTH,
    options: "24"
  },
  {
    validation:
    ValidationsEnum.IBAN
  }
]
export const civilianIdValidations = [
  {
    validation: ValidationsEnum.NATIONALID
  },
  {
    validation: ValidationsEnum.MAX_LENGTH,
    options: '10'
  },
  {
    validation: ValidationsEnum.MIN_LENGTH,
    options: '10'
  }
]

