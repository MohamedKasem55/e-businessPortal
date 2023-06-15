import {FormModel} from "../../../@core/model/dto/formModel";
import {TableControl} from "../../../@core/model/dto/control/table-control";
import {TableHeaderType} from "arb-design-library";
import {TabsControl} from "../../../@core/model/dto/control/tabs-control";

export function buildProcessedFilesPage() {
  return new FormModel({
    id: 'processed-files-id',
    controls: {
      tabsControl: new TabsControl({
        columnCount: 12,
        order: 2,
        value: "",
        controlOptions: {
          id: "tabs",
          tabs: []
        }
      }),
      processedFilesTable: new TableControl({
        label: 'payroll.processedFiles.name',
        required: true,
        order: 2,
        value: [],
        controlOptions: {
          headers: [],
          columnId: "batchPk",
          showSearch: true,
          pageSizes: [5, 10, 20],
          paginationValue: {page: 1, size: 50},
          showSortAndPin: false,
          exportFileName: "Processed Files",
          title: "payroll.processedFiles.table.name"
        },
        columnCount: 12,
      })

    }
  })
}

export const WPS_HEADERS = [
  {
    title: "payroll.processedFiles.table.headers.batchName",
    type: TableHeaderType.BUTTON,
    fieldName: "batchName",
    controlOptions: {id: "batchName", text: 'batchName'}
  },
  {title: "payroll.processedFiles.table.headers.accountFrom", type: TableHeaderType.TEXT, fieldName: "accountFrom"},
  {title: "payroll.processedFiles.table.headers.initiationDate", type: TableHeaderType.TEXT, fieldName: "initiationDate"},
  {title: "payroll.processedFiles.table.headers.paymentDate", type: TableHeaderType.TEXT, fieldName: "paymentDate"},
  {
    title: "payroll.processedFiles.table.headers.totalAmount",
    type: TableHeaderType.AMOUNT_TEXT,
    fieldName: "totalAmount",
    controlOptions: {currency: 'SAR'}
  },
  {title: "payroll.processedFiles.table.headers.recordsCounts", type: TableHeaderType.TEXT, fieldName: "totalRecords"},
  {
    title: "payroll.processedFiles.table.headers.rajhiRecordAmount",
    type: TableHeaderType.AMOUNT_TEXT,
    fieldName: "rajhiRecordAmount",
    controlOptions: {currency: 'SAR'}
  },
  {title: "payroll.processedFiles.table.headers.rajhiRecordCount", type: TableHeaderType.TEXT, fieldName: "rajhiRecordCount"},
  {
    title: "payroll.processedFiles.table.headers.localRecordAmount",
    type: TableHeaderType.AMOUNT_TEXT,
    fieldName: "localRecordAmount",
    controlOptions: {currency: 'SAR'}
  },
  {title: "payroll.processedFiles.table.headers.localRecordCount", type: TableHeaderType.TEXT, fieldName: "localRecordCount"},
  {title: "payroll.processedFiles.table.headers.molEstbid", type: TableHeaderType.TEXT, fieldName: "molEstbid"},
  {title: "payroll.processedFiles.table.headers.paymentPurpose", type: TableHeaderType.TEXT, fieldName: "paymentPurposeValue"}]
export const WPS_PLUS_HEADERS = [

  {title: "payroll.processedFiles.table.headers.batchName", type: TableHeaderType.BUTTON, fieldName: "batchName",controlOptions: {id: "batchName", text: 'batchName'}},
  {title: "payroll.processedFiles.table.headers.accountFrom", type: TableHeaderType.TEXT, fieldName: "accountFrom"},
  {title: "payroll.processedFiles.table.headers.initiationDate", type: TableHeaderType.TEXT, fieldName: "initiationDate"},
  {title: "payroll.processedFiles.table.headers.paymentDate", type: TableHeaderType.TEXT, fieldName: "paymentDate"},
  {title: "payroll.processedFiles.table.headers.totalAmount", type: TableHeaderType.AMOUNT_TEXT, fieldName: "totalAmount", controlOptions: {currency: 'SAR'}},
  {title: "payroll.processedFiles.table.headers.recordsCounts", type: TableHeaderType.TEXT, fieldName: "totalRecords"},
  {title: "payroll.processedFiles.table.headers.molEstbid", type: TableHeaderType.TEXT, fieldName: "molEstbid"},
]

export function buildRelatedFilesPopUp(files: any) {
  return new FormModel({
    id: 'related-files-id',
    controls: {
      relatedFilesTable: new TableControl({
        hidden: false,
        required: true,
        order: 1,
        value: [],
        controlOptions: {
          data: files,
          headers: [
            {title: "payroll.processedFiles.popup.headers.fileType", type: TableHeaderType.TEXT, fieldName: "fileType"},
            {
              title: "payroll.processedFiles.popup.headers.fileName",
              type: TableHeaderType.BUTTON,
              fieldName: "fileName",
              controlOptions: {id: "processed-related-file", text: 'fileName'}
            },
            {
              title: "payroll.processedFiles.popup.headers.dataReceived",
              type: TableHeaderType.DATE_TEXT,
              fieldName: "dataReceived",
              controlOptions: {format: 'dd/MM/yyyy'}
            },
          ],
          columnId: "fileName",
          showSearch: false,
          showFilter: false,
        },
        columnCount: 12,

      })

    }
  })
}


