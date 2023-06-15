import {FormModel} from "../../../../../@core/model/dto/formModel";
import {TableControl} from "../../../../../@core/model/dto/control/table-control";
import {TableHeaderType} from "arb-design-library";
import {TableHeaderModel} from "arb-design-library/model/table-header.model";

export function buildForm(): FormModel {
  return new FormModel({
    id: "recordsForm",
    controls: {
      recordsTable: new TableControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          selectedValues:[],
          headers: tableHeaders,
          exportFileName: "open-account-requests",
          data: [],
          columnId: "empNationalId",
          hasCheckbox: true
        }
      })

    }
  })
}

export const tableHeaders: TableHeaderModel[] = [
  {
    title: "payroll.payroll-wps-plus.open-account.records-details.table-headers.empId",
    type: TableHeaderType.TEXT,
    fieldName: "empId"
  },
  {
    title: "payroll.payroll-wps-plus.open-account.records-details.table-headers.empNationalId",
    type: TableHeaderType.TEXT,
    fieldName: "empNationalId"
  },
  {
    title: "payroll.payroll-wps-plus.open-account.records-details.table-headers.employeeName",
    type: TableHeaderType.TEXT,
    fieldName: "employeeName"
  },
  {
    title: "payroll.payroll-wps-plus.open-account.records-details.table-headers.mobile",
    type: TableHeaderType.TEXT,
    fieldName: "mobile"
  },
  {
    title: "payroll.payroll-wps-plus.open-account.records-details.table-headers.birthDate",
    type: TableHeaderType.TEXT,
    fieldName: "birthDate"
  },
  {
    title: "payroll.payroll-wps-plus.open-account.records-details.table-headers.accountNumber",
    type: TableHeaderType.TEXT,
    fieldName: "accountNumber"
  },
  {
    title: "payroll.payroll-wps-plus.open-account.records-details.table-headers.statusDesc",
    type: TableHeaderType.TEXT,
    fieldName: "statusDesc"
  }
]
