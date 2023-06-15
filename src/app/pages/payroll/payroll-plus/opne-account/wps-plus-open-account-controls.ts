import {FormModel} from "../../../../@core/model/dto/formModel";
import {TitleControl} from "../../../../@core/model/dto/control/title-control";
import {PayrollPagesNames} from "../../payroll-pages-names";
import {TableControl} from "../../../../@core/model/dto/control/table-control";
import {TableHeaderType} from "arb-design-library";
import {TextInputControl} from "../../../../@core/model/dto/control/text-input-control";
import {ButtonControl} from "../../../../@core/model/dto/control/button-control";

export function buildForm(): FormModel {
  return new FormModel({
    id: "masterDataForm",
    controls: {
      buttonsTitle: new TitleControl({
        order: 1,
        columnCount: 12,
        controlOptions: {
          id: "buttonsTitle",
          endButtons: [{
            id: PayrollPagesNames.ON_BOARDING_NEW_EMPLOYEES,
            type: "primary",
            text: "payroll.payroll-wps-plus.open-account.on-boarding-new-employees"
          }]
        }
      }),
      masterRecordsTable: new TableControl({
        columnCount: 12,
        order: 2,
        controlOptions: {
          title: 'payroll.payroll-wps-plus.open-account.table-title',
          headers: [
            {
              title: "payroll.payroll-wps-plus.open-account.table-headers.batchName",
              type: TableHeaderType.BUTTON,
              fieldName: "batchName",
              controlOptions: {id: "batchName", text: 'batchName'}
            },
            {
              title: "payroll.payroll-wps-plus.open-account.table-headers.count",
              type: TableHeaderType.TEXT,
              fieldName: "count"
            },
            {
              title: "payroll.payroll-wps-plus.open-account.table-headers.successCount",
              type: TableHeaderType.TEXT,
              fieldName: "successCount"
            },
            {
              title: "payroll.payroll-wps-plus.open-account.table-headers.inProgressCount",
              type: TableHeaderType.BUTTON,
              fieldName: "inProgressCount",
              controlOptions: {id: 'inProgressCount', text: 'inProgressCount', disableCondition: '0'}
            },
            {
              title: "payroll.payroll-wps-plus.open-account.table-headers.initiatorId",
              type: TableHeaderType.TEXT,
              fieldName: "initiatorId"
            },
            {
              title: "payroll.payroll-wps-plus.open-account.table-headers.approverId",
              type: TableHeaderType.TEXT,
              fieldName: "approverId"
            },
            {
              title: "payroll.payroll-wps-plus.open-account.table-headers.batchInitiationDate",
              type: TableHeaderType.DATE_TEXT,
              fieldName: "batchInitiationDate",
              controlOptions: {format: 'dd/MM/YYYY'}
            },
            {
              title: "payroll.payroll-wps-plus.open-account.table-headers.batchApprovalDate",
              type: TableHeaderType.DATE_TEXT,
              fieldName: "batchApprovalDate",
              controlOptions: {format: 'dd/MM/YYYY'}
            },

          ],
          exportFileName: "open-account-requests",
          data: [],
          columnId: "batchReference",
          showFilter: true,
          pageSizes: [5,10, 25],
          paginationValue: {page: 1, size: 5},
        }
      })

    }
  })

}

export function getSearchForm() {
  return new FormModel({
    id: 'formBatchName',
    controls: {
      batchName: new TextInputControl({
        label: 'payroll.payroll-wps-plus.open-account.table-headers.batchName',
        required: false,
        order: 1,
        columnCount: 12,
        value: ''
      }),
      cancelButton: new ButtonControl({
        order: 2,
        columnCount: 4,
        controlOptions: {
          id: "cancel",
          type: 'secondary',
          text: "public.cancel"
        }
      }),
      resetButton: new ButtonControl({
        order: 3,
        columnCount: 4,
        controlOptions: {
          id: "reset",
          type: 'secondary',
          text: "public.reset"
        }
      }),
      searchButton: new ButtonControl({
        order: 4,
        columnCount: 4,
        controlOptions: {
          id: "search",
          type: 'primary',
          text: "public.search"
        }
      }),
    }
  })
}
