import {FormModel} from "../../../@core/model/dto/formModel";
import {TitleControl} from "../../../@core/model/dto/control/title-control";
import {SummaryItemControl} from "../../../@core/model/dto/control/sumery-item-control";
import {EmptyControl} from "../../../@core/model/dto/control/empty-control";
import {TableControl} from "../../../@core/model/dto/control/table-control";
import {TableHeaderType} from "arb-design-library";
import {TableHeaderModel} from "arb-design-library/model/table-header.model";

export function buildProcessedRelatedFileContentForm() {
  return new FormModel({
    id: 'processed-related-file-content-id',
    controls: {
      productName: new SummaryItemControl({
        columnCount: 12,
        order: 1,
        label: "payroll.processedFiles.related-files.form.productName",
      }),
      processedFileTitle: new TitleControl({
        columnCount: 12,
        order: 2,
        controlOptions: {
          id: "processed-related-file-contentSectionId",
          title: 'payroll.processedFiles.related-files.form.uploadedFileContent',
          type: 'Section',
          endButtons: [],
        },
      }),
      fileType: new SummaryItemControl({
        columnCount: 4,
        order: 3,
        label: "payroll.processedFiles.related-files.form.fileType"
      }),
      dateReceived: new SummaryItemControl({
        columnCount: 4,
        order: 4,
        label: "payroll.processedFiles.related-files.form.dateReceived",

      }),
      empty5: new EmptyControl({
        columnCount: 4,
        order: 5,
      }),
      batchName: new SummaryItemControl({
        columnCount: 4,
        order: 6,
        label: "payroll.processedFiles.related-files.form.batchName",

      }),
      debitAccountNumber: new SummaryItemControl({
        columnCount: 4,
        order: 7,
        label: "payroll.processedFiles.related-files.form.debitAccountNumber",

      }),
      paymentDate: new SummaryItemControl({
        columnCount: 4,
        order: 8,
        label: "payroll.processedFiles.related-files.form.paymentDate",

      }),
      systemFileName: new SummaryItemControl({
        columnCount: 4,
        order: 9,
        label: "payroll.processedFiles.related-files.form.systemFileName",
        controlOptions: {
          isLink: true,
        }
      }),
      debitAccountNickName: new SummaryItemControl({
        columnCount: 4,
        order: 10,
        label: "payroll.processedFiles.related-files.form.debitAccountNickName",

      }),
      customerReference: new SummaryItemControl({
        columnCount: 4,
        order: 11,
        label: "payroll.processedFiles.related-files.form.customerReference",

      }),
      companyRemarks: new SummaryItemControl({
        columnCount: 4,
        order: 12,
        label: "payroll.processedFiles.related-files.form.companyRemarks",

      }),
      approvedBy: new SummaryItemControl({
        columnCount: 4,
        order: 13,
        label: "payroll.processedFiles.related-files.form.approvedBy",

      }),
      approvedDate: new SummaryItemControl({
        columnCount: 4,
        order: 14,
        label: "payroll.processedFiles.related-files.form.approvedDate",

      }),
      initiatedBy: new SummaryItemControl({
        columnCount: 4,
        order: 15,
        label: "payroll.processedFiles.related-files.form.initiatedBy",

      }),
      initiatedDate: new SummaryItemControl({
        columnCount: 4,
        order: 16,
        label: "payroll.processedFiles.related-files.form.initiatedDate",

      }),
      messageCode: new SummaryItemControl({
        columnCount: 4,
        order: 17,
        hidden: true,
        label: 'payroll.processedFiles.related-files.form.messageCode'
      })
    }
  })
}

export function buildProcessedRelatedFileEmployeeListForm() {
  return new FormModel({
    id: 'processed-related-file-content-id',
    controls: {
      empty: new EmptyControl({
        columnCount: 12,
        order: 1,
      }),
      employeeListTable: new TableControl({
        label: 'payroll.processedFiles.name',
        required: true,
        order: 3,
        value: [],
        controlOptions: {
          title: 'payroll.processedFiles.related-files.table.name',
          headers: recordsTableHeaders1,
          columnId: "batchPk",
          showSearch: false,
          showFilter: false,
          pageSizes: [5, 10, 20]

        },
        columnCount: 12,

      }),
      summaryAndFees: new TitleControl({
        columnCount: 12,
        order: 4,
        controlOptions: {
          id: "employeeListSummaryAndFeesId",
          title: 'payroll.processedFiles.related-files.summary.name',
          type: 'Section',
        },
      }),
      totalNumRajhi: new SummaryItemControl({
        columnCount: 4,
        order: 5,
        hidden: true,
        label: "payroll.processedFiles.related-files.summary.totalNumRajhi",
      }),
      totalFeesRajhi: new SummaryItemControl({
        columnCount: 4,
        order: 6,
        hidden: true,
        label: "payroll.processedFiles.related-files.summary.totalFeesRajhi",

      }),
      numRajhiTransfers: new SummaryItemControl({
        columnCount: 4,
        order: 7,
        hidden: true,
        label: "payroll.processedFiles.related-files.summary.numRajhiTransfers",

      }),
      totalNumNonRajhi: new SummaryItemControl({
        columnCount: 4,
        order: 8,
        hidden: true,
        label: "payroll.processedFiles.related-files.summary.totalNumNonRajhi",

      }),
      totalFeesNonRajhi: new SummaryItemControl({
        columnCount: 4,
        order: 9,
        hidden: true,
        label: "payroll.processedFiles.related-files.summary.totalFeesNonRajhi",

      }),
      numNonRajhiTransfers: new SummaryItemControl({
        columnCount: 4,
        order: 10,
        hidden: true,
        label: "payroll.processedFiles.related-files.summary.numNonRajhiTransfers",

      }),
      totalAmountOfPayrollRecords: new SummaryItemControl({
        columnCount: 4,
        order: 11,
        label: "payroll.processedFiles.related-files.summary.totalAmountOfPayrollRecords",

      }),
      totalFeesOfPayrollRecords: new SummaryItemControl({
        columnCount: 4,
        order: 12,
        label: "payroll.processedFiles.related-files.summary.totalFeesOfPayrollRecords",

      }),
      countOfPayrollRecords: new SummaryItemControl({
        columnCount: 4,
        order: 13,
        label: "payroll.processedFiles.related-files.summary.countOfPayrollRecords",

      }),
      subtotalAmount: new SummaryItemControl({
        columnCount: 4,
        order: 14,
        label: "payroll.processedFiles.related-files.summary.subtotalAmount",

      }),
      cancellationFeesTitle: new TitleControl({
        columnCount: 12,
        order: 15,
        hidden: true,
        controlOptions: {
          id: "cancellationFeesTitleId",
          title: "payroll.processedFiles.related-files.summary.cancellationFeesTitle",
          type: "Section"
        }
      }),
      cancellationFeesDis: new SummaryItemControl({
        columnCount: 12,
        order: 16,
        hidden: true,
        label: "payroll.processedFiles.related-files.summary.cancellationFeesDis",
      }),
      numberOfRajhiRecordsToCancel: new SummaryItemControl({
        columnCount: 4,
        order: 17,
        hidden: true,
        label: "payroll.processedFiles.related-files.summary.numberOfRajhiRecordsToCancel"
      }),
      rajhiAmountPerTransactionToCancel: new SummaryItemControl({
        columnCount: 4,
        order: 18,
        hidden: true,
        label: "payroll.processedFiles.related-files.summary.rajhiAmountPerTransactionToCancel"
      }),
      rajhiTotalAmountToCancel: new SummaryItemControl({
        columnCount: 4,
        order: 19,
        hidden: true,
        label: "payroll.processedFiles.related-files.summary.rajhiTotalAmountToCancel"
      }),
      numberOfLocalRecordsToCancel: new SummaryItemControl({
        columnCount: 4,
        order: 20,
        hidden: true,
        label: "payroll.processedFiles.related-files.summary.numberOfLocalRecordsToCancel"
      }),
      localAmountPerTransactionToCancel: new SummaryItemControl({
        columnCount: 4,
        order: 21,
        hidden: true,
        label: "payroll.processedFiles.related-files.summary.localAmountPerTransactionToCancel"
      }),
      localTotalAmountToCancel: new SummaryItemControl({
        columnCount: 4,
        order: 22,
        hidden: true,
        label: "payroll.processedFiles.related-files.summary.localTotalAmountToCancel"
      }),

      refundedFeesTitle: new TitleControl({
        columnCount: 12,
        order: 23,
        hidden: true,
        controlOptions: {
          id: "refundedFeesTitleId",
          title: "Refunded Fees",
          type: "Section"
        }
      }),
      refundedFeesDis: new SummaryItemControl({
        columnCount: 12,
        order: 24,
        hidden: true,
        label: "The total Amount will be added to your account",
      }),
      numberOfRajhiRecordsToRefund: new SummaryItemControl({
        columnCount: 4,
        order: 25,
        hidden: true,
        label: "payroll.processedFiles.related-files.summary.numberOfRajhiRecordsToRefund"
      }),
      rajhiAmountPerTransactionToRefund: new SummaryItemControl({
        columnCount: 4,
        order: 26,
        hidden: true,
        label: "payroll.processedFiles.related-files.summary.rajhiAmountPerTransactionToRefund"
      }),
      rajhiTotalAmountToRefund: new SummaryItemControl({
        columnCount: 4,
        order: 27,
        hidden: true,
        label: "payroll.processedFiles.related-files.summary.rajhiTotalAmountToRefund"
      }),
      numberOfLocalRecordsToRefund: new SummaryItemControl({
        columnCount: 4,
        order: 28,
        hidden: true,
        label: "payroll.processedFiles.related-files.summary.numberOfLocalRecordsToRefund"
      }),
      localAmountPerTransactionToRefund: new SummaryItemControl({
        columnCount: 4,
        order: 29,
        hidden: true,
        label: "payroll.processedFiles.related-files.summary.localAmountPerTransactionToRefund"
      }),
      localTotalAmountToToRefund: new SummaryItemControl({
        columnCount: 4,
        order: 30,
        hidden: true,
        label: "payroll.processedFiles.related-files.summary.localTotalAmountToToRefund"
      }),
    }
  })
}

export const recordsTableHeaders1: TableHeaderModel[] = [
  {title: "payroll.processedFiles.related-files.table.headers.employeeReference", type: TableHeaderType.TEXT, fieldName: 'employeeNumber'},
  {title: "payroll.processedFiles.related-files.table.headers.civilianId", type: TableHeaderType.TEXT, fieldName: 'employeeId'},
  {title: "payroll.processedFiles.related-files.table.headers.name", type: TableHeaderType.TEXT, fieldName: 'name'},
  {title: "payroll.processedFiles.related-files.table.headers.bankNameEn", type: TableHeaderType.TEXT, fieldName: 'bankName'},
  {title: "payroll.processedFiles.related-files.table.headers.account", type: TableHeaderType.TEXT, fieldName: 'account'},
  {title: "payroll.processedFiles.related-files.table.headers.total", type: TableHeaderType.AMOUNT_TEXT, fieldName: 'amount', controlOptions: {currency: 'currencyCode'}},
  {
    title: "payroll.processedFiles.related-files.table.headers.salaryBasic",
    type: TableHeaderType.AMOUNT_TEXT,
    fieldName: 'salaryBasic',
    controlOptions: {currency: 'currencyCode'}
  },
  {
    title: "payroll.processedFiles.related-files.table.headers.allowanceHousing",
    type: TableHeaderType.AMOUNT_TEXT,
    fieldName: 'allowanceHousing',
    controlOptions: {currency: 'currencyCode'}
  },
  {
    title: "payroll.processedFiles.related-files.table.headers.allowanceOther",
    type: TableHeaderType.AMOUNT_TEXT,
    fieldName: 'allowanceOther',
    controlOptions: {currency: 'currencyCode'}
  },
  {
    title: "payroll.processedFiles.related-files.table.headers.deductions",
    type: TableHeaderType.AMOUNT_TEXT,
    fieldName: 'deductions',
    controlOptions: {currency: 'currencyCode'}
  },
  {title: "payroll.processedFiles.related-files.table.headers.remarks", type: TableHeaderType.TEXT, fieldName: 'remarks'},
  {title: "payroll.processedFiles.related-files.table.headers.departmentId", type: TableHeaderType.TEXT, fieldName: 'department'},
]
export const recordsTableHeaders2: TableHeaderModel[] = [
  {title: "payroll.processedFiles.related-files.table.headers.employeeReference", type: TableHeaderType.TEXT, fieldName: 'employeeNumber'},
  {title: "payroll.processedFiles.related-files.table.headers.civilianId", type: TableHeaderType.TEXT, fieldName: 'employeeId'},
  {title: "payroll.processedFiles.related-files.table.headers.name", type: TableHeaderType.TEXT, fieldName: 'name'},
  {title: "payroll.processedFiles.related-files.table.headers.bankNameEn", type: TableHeaderType.TEXT, fieldName: 'bankName'},
  {title: "payroll.processedFiles.related-files.table.headers.account", type: TableHeaderType.TEXT, fieldName: 'account'},
  {title: "payroll.processedFiles.related-files.table.headers.total", type: TableHeaderType.AMOUNT_TEXT, fieldName: 'amount', controlOptions: {currency: 'currencyCode'}},
  {
    title: "payroll.processedFiles.related-files.table.headers.salaryBasic",
    type: TableHeaderType.AMOUNT_TEXT,
    fieldName: 'salaryBasic',
    controlOptions: {currency: 'currencyCode'}
  },
  {
    title: "payroll.processedFiles.related-files.table.headers.allowanceHousing",
    type: TableHeaderType.AMOUNT_TEXT,
    fieldName: 'allowanceHousing',
    controlOptions: {currency: 'currencyCode'}
  },
  {
    title: "payroll.processedFiles.related-files.table.headers.allowanceOther",
    type: TableHeaderType.AMOUNT_TEXT,
    fieldName: 'allowanceOther',
    controlOptions: {currency: 'currencyCode'}
  },
  {
    title: "payroll.processedFiles.related-files.table.headers.deductions",
    type: TableHeaderType.AMOUNT_TEXT,
    fieldName: 'deductions',
    controlOptions: {currency: 'currencyCode'}
  },
  {title: "payroll.processedFiles.related-files.table.headers.remarks", type: TableHeaderType.TEXT, fieldName: 'remarks'},
  {title: "payroll.processedFiles.related-files.table.headers.departmentId", type: TableHeaderType.TEXT, fieldName: 'department'},
  {title: "payroll.processedFiles.related-files.table.headers.messageDescription", type: TableHeaderType.TEXT, fieldName: 'messageDescription'}
]


export const cancellationSummaryToShow_plus = [
  'cancellationFeesTitle',
  'cancellationFeesDis',
  'numberOfRajhiRecordsToCancel',
  'rajhiAmountPerTransactionToCancel',
  'rajhiTotalAmountToCancel',
  'refundedFeesTitle',
  'refundedFeesDis',
  'numberOfRajhiRecordsToRefund',
  'rajhiAmountPerTransactionToRefund',
  'rajhiTotalAmountToRefund',
]
export const cancellationSummaryToShow_WPS = [
  'cancellationFeesTitle',
  'cancellationFeesDis',
  'numberOfRajhiRecordsToCancel',
  'rajhiAmountPerTransactionToCancel',
  'rajhiTotalAmountToCancel',
  'numberOfLocalRecordsToCancel',
  'localAmountPerTransactionToCancel',
  'localTotalAmountToCancel',
  'refundedFeesTitle',
  'refundedFeesDis',
  'numberOfRajhiRecordsToRefund',
  'rajhiAmountPerTransactionToRefund',
  'rajhiTotalAmountToRefund',
  'numberOfLocalRecordsToRefund',
  'localAmountPerTransactionToRefund',
  'localTotalAmountToToRefund'
]

export const cancellationSummaryToHide_plus = [
  'summaryAndFees',
  'totalAmountOfPayrollRecords',
  'totalFeesOfPayrollRecords',
  'countOfPayrollRecords',
  'subtotalAmount'
]
export const cancellationSummaryToHide_WPS = [
  'summaryAndFees',
  'totalNumRajhi',
  'totalFeesRajhi',
  'numRajhiTransfers',
  'totalNumNonRajhi',
  'totalFeesNonRajhi',
  'numNonRajhiTransfers',
  'totalAmountOfPayrollRecords',
  'totalFeesOfPayrollRecords',
  'countOfPayrollRecords',
  'subtotalAmount'
]


