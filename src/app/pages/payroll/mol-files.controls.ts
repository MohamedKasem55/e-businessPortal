import {FormModel} from "../../@core/model/dto/formModel";
import {TitleControl} from "../../@core/model/dto/control/title-control";
import {TableControl} from "../../@core/model/dto/control/table-control";
import {TableHeaderModel} from "arb-design-library/model/table-header.model";
import {TableHeaderType} from "arb-design-library";
import {LineCardControl} from "../../@core/model/dto/control/line-card-control";

export function buildWpsMolFilesForm(): FormModel {
  return new FormModel({
    id: "WpsMolFilesFormId",
    controls: {
      disclaimer: new LineCardControl({
        columnCount: 12,
        order: 2,
        controlOptions: {
          icon: " arb-icon-documentInfo",
          title: "payroll.payroll-wps.mol-files.disclaimer-text"
        }
      }),
      wpsMolFilesTable: new TableControl({
        order: 3,
        columnCount: 12, controlOptions: {
          headers: WPSMolFilesTableHeaders,
          columnId: "",
          exportFileName: "wpsMolFilesList",
          showFilter: true,
          showSearch:true,
          paginationValue: {page: 1, size: 50},
          pageSizes: [5, 10, 20],
          hasCheckbox: true,
          selectedValues: [],
          title: "wpsMolFilesList"
        }
      })
    }
  })
}

export const WPSMolFilesTableHeaders: TableHeaderModel[] = [
  {title: "payroll.payroll-wps.mol-files.table-headers.systemFileName", type: TableHeaderType.TEXT, fieldName: "fileName"},
  {title: "payroll.payroll-wps.mol-files.table-headers.batchName", type: TableHeaderType.TEXT, fieldName: "batchName"},
  {title: "payroll.payroll-wps.mol-files.table-headers.valueDate", type: TableHeaderType.TEXT, fieldName: "paymentDate"},
  {title: "payroll.payroll-wps.mol-files.table-headers.totalAmount", type: TableHeaderType.TEXT, fieldName: "totalAmount"},
  {title: "payroll.payroll-wps.mol-files.table-headers.debitAccount", type: TableHeaderType.TEXT, fieldName: "accountFrom"},
  {title: "payroll.payroll-wps.mol-files.table-headers.initiatedDate", type: TableHeaderType.TEXT, fieldName: "initiationDate"},
]





