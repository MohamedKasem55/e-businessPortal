import {FormModel} from "../../../../@core/model/dto/formModel";
import {TitleControl} from "../../../../@core/model/dto/control/title-control";
import {NumberInputControl} from "../../../../@core/model/dto/control/number-input-control";
import {TextInputControl} from "../../../../@core/model/dto/control/text-input-control";
import {ValidationsEnum} from "../../../../@core/model/dto/validations-enum";
import {AbstractControl, ValidationErrors} from "@angular/forms";
import {CalenderType, DateControl} from "../../../../@core/model/dto/control/date-control";
import {DropdownControl} from "../../../../@core/model/dto/control/dropdown-control";
import {KeyValueModel} from "../../../../@core/model/rest/common/key-value.model";

export const batchNameForm = (): FormModel => {
  return new FormModel({
    id: "batchNameForm",
    controls: {
      batchNameControl: new TextInputControl({
        columnCount: 6,
        order: 1,
        required: true,
        value: "",
        label: "payroll.payroll-wps-plus.add-employee.batch-name"
      })
    }
  })
}
export const newEmployeeForm = (id: string, keyValueModels: KeyValueModel[]): FormModel => {
  return new FormModel({
    id: id,
    controls: {
      titlePersonalDetails: new TitleControl({
        columnCount: 12,
        order: 2,
        controlOptions: {
          id: "",
          title: 'payroll.employee.personal-details',
          endButtons: [{
            id: 'deleteButton',
            text: 'public.delete',
            type: 'danger'
          }]
        }
      }),
      civilianId: new NumberInputControl({
        label: 'payroll.employee.civ-id', order: 3, columnCount: 6, value: '', required: true,
        validators: [
          {
            validation: ValidationsEnum.NATIONALID
          },
          {
            validation: ValidationsEnum.MIN_LENGTH, options: '10'
          },
          {
            validation: ValidationsEnum.MAX_LENGTH, options: '10'
          }
        ],
        controlOptions: {maxlength: 10}
      }),
      empNumber: new NumberInputControl({
        label: 'payroll.employee.emp-number', order: 4, columnCount: 6, value: '', required: true,
      }),
      title: new DropdownControl({
        columnCount: 1,
        order: 5,
        required: true,
        label: 'title',
        value: '',
        controlOptions: {
          options: keyValueModels,
          columnId: "key",
          textField: 'value',
          hasSearch: true,
        }
      }),
      empName: new TextInputControl({
        label: 'payroll.employee.emp-name', order: 6, columnCount: 5, value: '', required: true,
      }),
      mobileNumber: new NumberInputControl({
        label: 'payroll.payroll-wps-plus.add-employee.mobile-number',
        order: 7,
        columnCount: 6,
        value: '',
        required: true,
        validators: [{validation: ValidationsEnum.MOBILE_NUMBER_WITH_05}],
      }),
      contractStartDate: new DateControl({
        label: 'payroll.payroll-wps-plus.add-employee.contract-start-date',
        order: 8,
        columnCount: 6,
        value: '',
        required: true,
        controlOptions: {type: CalenderType.GREGORIAN}
      }),
      DateOfBirth: new DateControl({
        label: 'payroll.payroll-wps-plus.add-employee.Date-of-birth',
        order: 9,
        columnCount: 6,
        value: '',
        required: true,
        controlOptions: {type: CalenderType.GREGORIAN},
        validators: [{validation: ValidationsEnum.MIN_AGE, options: '18'}]
      }),
      totalSalary: new TitleControl({
        columnCount: 12,
        order: 10,
        controlOptions: {
          id: "",
          title: 'payroll.employee.salary-details',
          subTitle: [{
            text: 'payroll.employee.total-salary',
            amount: '0',
            currency: 'SAR'
          }]
        }
      }),
      basicSalary: new NumberInputControl({
        label: 'payroll.employee.basic-salary', order: 11, columnCount: 6, value: '', required: true
      }),
      housingAllowance: new NumberInputControl({
        label: 'payroll.employee.housing-allowance', order: 12, columnCount: 6, value: '',
      }),
      otherAllowance: new NumberInputControl({
        label: 'payroll.employee.other-allowance', order: 13, columnCount: 6, value: '',
      }),
      deduction: new NumberInputControl({
        label: 'payroll.employee.deduction', order: 14, columnCount: 6, value: '',
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
