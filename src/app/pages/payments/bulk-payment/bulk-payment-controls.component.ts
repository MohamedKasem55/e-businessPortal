import {ButtonControl} from "app/@core/model/dto/control/button-control";
import {TextInputControl} from "app/@core/model/dto/control/text-input-control";
import {FormModel} from "app/@core/model/dto/formModel";
import {ButtonModel} from "arb-design-library/model/button.model";
import {TitleControl} from "app/@core/model/dto/control/title-control";
import {UploadControl} from "app/@core/model/dto/control/upload-control";
import {AccountControl} from "app/@core/model/dto/control/account-control";
import {TableControl} from "../../../@core/model/dto/control/table-control";
import {TableHeaderModel} from "arb-design-library/model/table-header.model";
import {TableHeaderType} from "arb-design-library";

export function bulkPaymentOrganizationForm(
  organizationName: string,
  CIC: string
) {
  return new FormModel({
    id: 'oneTimePaymentTypeForm',
    showDivider: true,
    controls: {
      "organizationSection": new TitleControl({
        order: 1,
        columnCount: 9,
        controlOptions: {
          id: "organizationSectionId",
          title: 'payments.bulkPayment.organization'
        }
      }),
      "userApprovalStatus": new ButtonControl({
        order: 2,
        columnCount: 3,
        controlOptions: {
          id: "UserApprovalStatus",
          type: 'secondary',
          text: "payments.bulkPayment.userApprovalStatus",
        }
      }),
      "organizationName": new TitleControl({
        order: 3,
        columnCount: 6,
        controlOptions: {
          id: 'organizationName',
          type: 'Section',
          title: 'payments.bulkPayment.organizationName',
          subTitle: organizationName,
        },
      }),
      "CIC": new TitleControl({
        order: 4,
        columnCount: 6,
        controlOptions: {
          id: 'CIC',
          type: 'Section',
          title: 'payments.bulkPayment.CIC',
          subTitle: CIC,
        },
      }),
    }
  })
}

export function getBulkPaymentForm() {
  return new FormModel({
    id: 'oneTimePaymentTypeForm',
    controls: {
      "uploadSection": new TitleControl({
        order: 1,
        columnCount: 9,
        controlOptions: {
          id: "uploadId",
          title: 'payments.bulkPayment.upload',
        }
      }),

      "buttonDownloadTemplate": new ButtonControl({
        order: 2,
        columnCount: 3,
        controlOptions: {
          id: "buttonDownloadTemplate",
          type: 'primary',
          text: "payments.bulkPayment.downloadTemplate",
          prefixIcon: "arb-icon-arrowDownBox"
        }
      }),

      "selectAccount": new AccountControl({
        label: 'payments.bulkPayment.selectAccount',
        required: true,
        order: 3,
        columnCount: 12,
        controlOptions: {
          columnId: 'accountPk',
          textField: ['alias', 'fullAccountNumber'],
          hasSearch: false,
          endTextField: 'availableBalance',
          endTextCurrencyField: 'currency',
          options: [],
          disabledField: "disabled",
        },
        validationLabels: {
          required: "public.validations.required",
        }
      }),

      "uploadInvoice": new UploadControl({
        label: 'payments.bulkPayment.uploadInvoice',
        required: true,
        order: 4,
        columnCount: 6,
        value: '',
        controlOptions: {
          acceptedTypes: ['application/vnd.ms-excel']
        },
        validationLabels: {
          required: "public.validations.required",
        }
      }),

      "batchName": new TextInputControl({
        label: 'payments.bulkPayment.batchName',
        required: false,
        order: 5,
        columnCount: 6,
        value: ''
      }),


    }
  })
}

export const getEndButtons = (): ButtonModel[] => {
  return [{
    id: "goToDashboard",
    type: 'secondary',
    text: "public.go-to-dashboard"
  },
    {
      id: "goToPayAnotherBills",
      type: 'primary',
      text: "payments.oneTimeBillPayment.pay-another-bills"
    }
  ]
}

export function getBulkErrorTable() {
  return new FormModel({
    id: 'bulk-error',
    controls: {
      table: new TableControl({
        order: 1,
        columnCount: 12,
        controlOptions: {
          columnId: "key",
          data: [],
          showSortAndPin: false,
          headers: tableHeader
        }
      }),
    }
  })
}

export const tableHeader: TableHeaderModel[] = [
  {
    title: 'payments.bulkPayment.row',
    fieldName: 'key',
    type: TableHeaderType.TEXT,
  },
  {
    title: 'payments.bulkPayment.billName',
    fieldName: 'billName',
    type: TableHeaderType.TEXT,
  },
  {
    title: 'payments.bulkPayment.amount',
    fieldName: 'amount',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: '608',
    },
  },
  {
    title: 'payments.bulkPayment.billRef',
    fieldName: 'billRef',
    type: TableHeaderType.TEXT,
  }
];
