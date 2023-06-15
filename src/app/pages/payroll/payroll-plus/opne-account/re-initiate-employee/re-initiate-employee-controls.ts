import {FormModel} from "../../../../../@core/model/dto/formModel";
import {TitleControl} from "../../../../../@core/model/dto/control/title-control";
import {SummaryItemControl} from "../../../../../@core/model/dto/control/sumery-item-control";
import {NumberInputControl} from "../../../../../@core/model/dto/control/number-input-control";
import {ValidationsEnum} from "../../../../../@core/model/dto/validations-enum";
import {CalenderType, DateControl} from "../../../../../@core/model/dto/control/date-control";
import {TextInputControl} from "../../../../../@core/model/dto/control/text-input-control";
import {WPSPlusEmployeeBatchDTO} from "../../../../../@core/model/rest/payroll/wps-plus/request-open-account/re-initiate-rejected-records-init-res";
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap/datepicker/ngb-date-struct";
import {DropdownControl} from "../../../../../@core/model/dto/control/dropdown-control";
import {KeyValueModel} from "../../../../../@core/model/rest/common/key-value.model";

export function batchNameForm(): FormModel {
  return new FormModel({
    id: "batchNameFormId",
    controls: {
      batchName: new TextInputControl({
        columnCount: 6,
        order: 1,
        value: '',
        required: true,
        label: "payroll.payroll-wps-plus.open-account.re-initiate-rejected-records.batchName",
        validationLabels: {required: "required"}
      })
    }
  })
}

export const employeeForm = (index: string, employee: WPSPlusEmployeeBatchDTO, keyValueModels: KeyValueModel[]): FormModel => {
  let form: FormModel = new FormModel({
    id: index,
    controls: {
      employeeNumberTitle: new TitleControl({
        order: 1,
        columnCount: 12,
        controlOptions: {
          id: index,
          endButtons: [{id: "DeleteEmployeeFromList", type: "danger", text: "public.delete"}]
        }
      }),
      errorDesc: new SummaryItemControl({
        order: 2,
        columnCount: 12,
        label: "payroll.payroll-wps-plus.open-account.re-initiate-rejected-records.errorDescTitle",
        value: employee.errorDesc
      }),
      civilianId: new NumberInputControl({
        label: 'payroll.payroll-wps-plus.open-account.re-initiate-rejected-records.civilianId', order: 3, columnCount: 6,
        value: employee.civilianId,
        required: true,
        disable: true,
        validators: [{validation: ValidationsEnum.NATIONALID}],
      }),
      contractStartDate: new DateControl({
        label: 'payroll.payroll-wps-plus.open-account.re-initiate-rejected-records.contractStartDate',
        order: 4,
        columnCount: 6,
        value: getDateNgbDateStructFromString(employee.contractStartDate),
        required: true,
        disable: true,
        controlOptions: {type: CalenderType.GREGORIAN}
      }),
      title: new DropdownControl({
        columnCount: 1,
        order: 5,
        required: true,
        disable: true,
        label: 'payroll.payroll-wps-plus.open-account.re-initiate-rejected-records.title',
        value: employee.title != null ? {
          key: employee.title,
          value: keyValueModels[Number(employee.title)]
        } : keyValueModels[1],
        controlOptions: {
          options: keyValueModels,
          columnId: "key",
          textField: 'value',
          hasSearch: true,
        }
      }),
      nickName: new TextInputControl({
        label: 'payroll.payroll-wps-plus.open-account.re-initiate-rejected-records.nickName',
        order: 6,
        columnCount: 5,
        value: employee.nickName,
        required: true,
        disable: true
      }),
      employeeNumber: new NumberInputControl({
        label: 'payroll.payroll-wps-plus.open-account.re-initiate-rejected-records.employeeNumber',
        order: 7,
        columnCount: 6,
        value: employee.employeeNumber,
        required: true,
        disable: true
      }),
      birthDate: new DateControl({
        label: 'payroll.payroll-wps-plus.open-account.re-initiate-rejected-records.birthDate',
        order: 8,
        columnCount: 6,
        value: getDateNgbDateStructFromString(employee.birthDate),
        required: true,
        disable: true,
        controlOptions: {type: CalenderType.GREGORIAN}
      }),
      mobile: new NumberInputControl({
        label: 'payroll.payroll-wps-plus.open-account.re-initiate-rejected-records.mobile',
        order: 9,
        columnCount: 6,
        value: employee.mobile,
        required: true,
        disable: true,
        validators: [{validation: ValidationsEnum.MOBILE_NUMBER_WITH_05}],
      }),
    }
  })
  employee.editableFields.forEach((error: string) => {
    if (form.controls[error]) {
      form.controls[error].enable()
    }
  })

  return form
}


export function getDateNgbDateStructFromString(date: Date): NgbDateStruct | null {
  if (date) {
    let parts = date.toString().split("-");
    return {
      year: Number(parts[0]),
      month: Number(parts[1]),
      day: Number(parts[2])
    };
  } else {
    return null
  }

}
