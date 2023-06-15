import {FormModel} from "../../../../@core/model/dto/formModel";
import {TitleControl} from "../../../../@core/model/dto/control/title-control";
import {LineCardControl} from "../../../../@core/model/dto/control/line-card-control";
import {TableControl} from "../../../../@core/model/dto/control/table-control";
import {TableHeaderModel} from "arb-design-library/model/table-header.model";
import {TableHeaderType} from "arb-design-library";
import { TextInputControl } from "app/@core/model/dto/control/text-input-control";
import { ButtonControl } from "app/@core/model/dto/control/button-control";
import { NumberInputControl } from "app/@core/model/dto/control/number-input-control";
import { ValidationsEnum } from "app/@core/model/dto/validations-enum";
import { DateControl } from "app/@core/model/dto/control/date-control";
import { EmptyControl } from "app/@core/model/dto/control/empty-control";
import { AccountControl } from "app/@core/model/dto/control/account-control";


export function buildWpsMolFilesForm(): FormModel {
  return new FormModel({
    id: "WpsMolFilesFormId",
    controls: {
      tableTitle: new TitleControl({
        order: 1,
        columnCount: 12,
        controlOptions: {
          id: "tableTitleID",
          title: "payroll.payroll-wps.mol-files.table-name"
        }
      }),
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
          paginationValue: {page: 1, size: 50},
          pageSizes: [5, 10, 20],
          hasCheckbox: true,
          selectedValues: [],
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

export function getFilterForm(): FormModel {
  return new FormModel({
    id: 'filterForm',
    controls: {
      batchName: new TextInputControl({
        order: 1,
        columnCount: 4,
        label: 'payroll.payroll-wps.mol-files.table-headers.batchName',
        value: '',
      }),
      debitAccount: new AccountControl({
        label: 'payroll.payroll-wps.mol-files.table-headers.debitAccount',
        order: 2,
        columnCount: 4,
        value: null,
      }),
      amountfrom: new NumberInputControl({
        order: 3,
        columnCount: 4,
        validators: [{ validation: ValidationsEnum.DIGIT_ONLY }],
        label: 'payroll.payroll-wps.mol-files.table-filters.amountfrom',
        value: '',
      }),
      amountto: new NumberInputControl({
        order: 4,
        columnCount: 4,
        validators: [{ validation: ValidationsEnum.DIGIT_ONLY }],
        label: 'payroll.payroll-wps.mol-files.table-filters.amountto',
        value: '',
      }),
      initiationDatefrom: new DateControl({
        order: 5,
        columnCount: 4,
        label: 'payroll.payroll-wps.mol-files.table-filters.initiationDatefrom',
      }),
      initiationDateto: new DateControl({
        order: 6,
        columnCount: 4,
        label: 'payroll.payroll-wps.mol-files.table-filters.initiationDateto',
      }),
      paymentDatefrom: new DateControl({
        order: 7,
        columnCount: 4,
        label: 'payroll.payroll-wps.mol-files.table-filters.paymentDatefrom',
      }),
      paymentDateto: new DateControl({
        order: 8,
        columnCount: 4,
        label: 'payroll.payroll-wps.mol-files.table-filters.paymentDateto',
      }),
      systemFileName: new TextInputControl({
        order: 9,
        columnCount: 4,
        label: 'payroll.payroll-wps.mol-files.table-headers.systemFileName',
        value: '',
      }),
      customerReference: new TextInputControl({
        order: 10,
        columnCount: 4,
        label: 'payroll.payroll-wps.mol-files.table-filters.customerReference',
        value: '',
      }),
      emptyControl: new EmptyControl({
        order: 11,
        columnCount: 8,
      }),
      cancelButton: new ButtonControl({
        order: 12,
        columnCount: 4,
        controlOptions: {
          id: 'cancel',
          type: 'secondary',
          text: 'public.cancel',
        },
      }),
      resetButton: new ButtonControl({
        order: 13,
        columnCount: 4,
        controlOptions: {
          id: 'reset',
          type: 'secondary',
          text: 'public.reset',
        },
      }),
      searchButton: new ButtonControl({
        order: 14,
        columnCount: 4,
        controlOptions: {
          id: 'search',
          type: 'primary',
          text: 'public.search',
        },
      }),
    },
  });
}