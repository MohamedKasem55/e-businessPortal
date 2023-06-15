import { TitleControl } from '../../../@core/model/dto/control/title-control';
import { PillControl } from '../../../@core/model/dto/control/pill-control';
import { TextInputControl } from '../../../@core/model/dto/control/text-input-control';
import { AccountControl } from '../../../@core/model/dto/control/account-control';
import { AmountControl } from '../../../@core/model/dto/control/amount-control';
import { DropdownControl } from '../../../@core/model/dto/control/dropdown-control';
import {
  FormControlModel,
  FormModel,
} from '../../../@core/model/dto/formModel';
import { ValidationsEnum } from '../../../@core/model/dto/validations-enum';
import { TableControl } from '../../../@core/model/dto/control/table-control';
import { TableHeaderType } from 'arb-design-library';
import {
  CalenderType,
  DateControl,
} from '../../../@core/model/dto/control/date-control';
import { SummaryModel } from 'arb-design-library/model/summary.model';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { SummaryItemControl } from '../../../@core/model/dto/control/sumery-item-control';
import { DividerControl } from '../../../@core/model/dto/control/divider-control';
import { ButtonControl } from '../../../@core/model/dto/control/button-control';
import { EmptyControl } from '../../../@core/model/dto/control/empty-control';
import { TextControl } from '../../../@core/model/dto/control/text-control';
import { ControlBase } from '../../../@core/model/dto/control/control.model';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export const landingStandingOrderTable = (): FormModel => {
  return new FormModel({
    id: 'landingStandingOrderTable',
    controls: {
      landingStandingOrderTitle: new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: 'transferStandingOrderLandingTitle',
          title: 'transfer.standingOrder.landing.title',
          showArrow: true,
          type: 'Page',
          endButtons: getStandingOrderTitleEndButtons(),
        },
      }),
      account: new AccountControl({
        columnCount: 6,
        order: 2,
        label: 'transfer.standingOrder.frmAcc',
        required: true,
        validationLabels: {
          required: 'public.validations.required',
        },
        class: 'mb-1',
      }),
      standingOrderTable: new TableControl({
        columnCount: 12,
        order: 3,
        controlOptions: {
          title: 'transfer.standingOrder.landing.subTitle',
          headers: [
            {
              title: 'transfer.standingOrder.mandateNum',
              fieldName: 'mandateNumber',
              type: TableHeaderType.BUTTON,
              controlOptions: {
                id: 'mandateNumber',
                text: 'mandateNumber',
              },
            },
            {
              title: 'transfer.standingOrder.frmAcc',
              fieldName: 'accountFrom',
              type: TableHeaderType.TEXT,
            },
            {
              title: 'transfer.standingOrder.ben',
              fieldName: 'beneficiaryData.bankName',
              type: TableHeaderType.TEXT,
            },
            {
              title: 'transfer.standingOrder.account',
              fieldName: 'accountTo',
              type: TableHeaderType.TEXT,
            },
            {
              title: 'transfer.standingOrder.frequency.name',
              fieldName: 'orderType2',
              type: TableHeaderType.TEXT,
            },
            {
              title: 'transfer.standingOrder.startDate',
              fieldName: 'dateFrom',
              type: TableHeaderType.TEXT,
            },
            {
              title: 'transfer.standingOrder.dueDate',
              fieldName: 'dateTo',
              type: TableHeaderType.TEXT,
            },
            {
              title: 'transfer.standingOrder.nxtPmnt',
              fieldName: 'nextPaymentDate',
              type: TableHeaderType.TEXT,
            },
            {
              title: 'transfer.standingOrder.totalAmt',
              fieldName: 'amount',
              type: TableHeaderType.TEXT,
            },
          ],
          columnId: 'mandateNumber',
          hasCheckbox: false,
          showSearch: false,
          showFilter: false,
          pageSizes: [10, 15],
        },
      }),
    },
  });
};

export const getStandingOrderTitleEndButtons = (): ButtonModel[] => {
  return [
    {
      id: 'status',
      type: 'secondary',
      text: 'public.approvalStatus',
      showLoading: false,
    },
    {
      id: 'add',
      type: 'primary',
      text: 'transfer.standingOrder.add-new2',
      showLoading: false,
    },
  ];
};

export const standingOrderDetails = (): FormModel => {
  return new FormModel({
    id: 'standingOrderDetails',
    controls: {
      landingStandingOrderTitle: new TitleControl({
        columnCount: 12,
        order: 1,
        class: 'mb-2',
        controlOptions: {
          id: 'transferStandingOrderDetailsTitle',
          title: 'transfer.standingOrder.detailsView.details',
          showArrow: true,
          type: 'Page',
        },
      }),
      ...getCommonViewControls(),
      dateTo: new SummaryItemControl({
        columnCount: 4,
        order: 8,
        label: 'transfer.standingOrder.detailsView.dateTo',
        value: '',
      }),
      divider: new DividerControl({
        columnCount: 12,
        order: 9,
      }),
      empty: new EmptyControl({ order: 9, columnCount: 8 }),
      delete: new ButtonControl({
        order: 10,
        columnCount: 2,
        controlOptions: {
          id: 'delete',
          type: 'danger',
          text: 'public.delete',
          prefixIcon: 'arb-icon-Trash color-arb-negativeText',
        },
      }),
      edit: new ButtonControl({
        order: 11,
        columnCount: 2,
        controlOptions: {
          id: 'edit',
          type: 'secondary',
          text: 'public.edit',
          prefixIcon: 'arb-icon-edit color-arb-primaryColor',
        },
      }),
    },
  });
};

export const standingOrderControls = (today: NgbDateStruct) => {
  return new FormModel({
    id: 'standingOrderControls',
    showDivider: true,
    controls: {
      benTitle: new TitleControl({
        columnCount: 12,
        order: 2,
        controlOptions: {
          id: 'standingOrderControlsTitle',
          title: '',
          type: 'Section',
        },
      }),
      pill: new PillControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          text: '',
          type: 'Neutral',
        },
      }),
      accTitle: new TitleControl({
        columnCount: 12,
        order: 2,
        controlOptions: {
          id: 'accTitle',
          title: 'transfer.standingOrder.accDtls',
          type: 'Section',
        },
      }),
      amount: new AmountControl({
        columnCount: 6,
        order: 3,
        label: 'transfer.standingOrder.amount',
        required: true,
        value: '',
        controlOptions: {
          currency: '608',
        },
        validationLabels: {
          required: 'public.validations.required',
        },
      }),
      amountType: new DropdownControl({
        columnCount: 6,
        order: 3,
        required: true,
        label: 'transfer.standingOrder.amtType',
        controlOptions: {
          columnId: 'key',
          textField: 'title',
          options: [
            {
              id: '0',
              title: 'transfer.standingOrder.amount',
            },
            {
              id: '1',
              title: 'transfer.standingOrder.minBlnc',
            },
          ],
          hasSearch: true,
        },
        validationLabels: {
          required: 'public.validations.required',
        },
      }),
      trxTitle: new TitleControl({
        columnCount: 12,
        order: 4,
        controlOptions: {
          id: 'trxTitle',
          title: 'transfer.standingOrder.trnsDtls',
          type: 'Section',
        },
      }),
      freq: new DropdownControl({
        columnCount: 6,
        order: 5,
        label: 'transfer.standingOrder.frequency.name',
        required: true,
        controlOptions: {
          columnId: 'key',
          textField: 'text',
          options: [
            {
              id: 1,
              text: 'transfer.standingOrder.frequency.oneMon',
            },
            {
              id: 3,
              text: 'transfer.standingOrder.frequency.threeMon',
            },
            {
              id: 6,
              text: 'transfer.standingOrder.frequency.sixMon',
            },
            {
              id: 12,
              text: 'transfer.standingOrder.frequency.twelveMon',
            },
          ],
          hasSearch: true,
        },
        validationLabels: {
          required: 'public.validations.required',
        },
      }),
      dayOfTransfer: new TextInputControl({
        columnCount: 6,
        order: 6,
        label: 'transfer.standingOrder.dOfTrns',
        required: true,
        validators: [
          { validation: ValidationsEnum.DIGIT_ONLY },
          { validation: ValidationsEnum.MAX, options: '30' },
        ],
        validationLabels: {
          required: 'public.validations.required',
          max: 'transfer.standingOrder.validation.standingOrder-dOfTrns.max',
        },
        value: '',
      }),
      startDate: new DateControl({
        columnCount: 6,
        order: 7,
        label: 'transfer.standingOrder.startDate',
        required: true,
        controlOptions: {
          displayPattern: 'dd/MM/yyyy',
          type: CalenderType.GREGORIAN,
          minDate: {
            day: today.day,
            month: today.month + 1,
            year: today.year,
          },
        },
        validationLabels: {
          required: 'public.validations.required',
        },
      }),
      endDate: new DateControl({
        label: 'transfer.standingOrder.endDate',
        columnCount: 6,
        order: 8,
        required: true,
        controlOptions: {
          displayPattern: 'dd/MM/yyyy',
          type: CalenderType.GREGORIAN,
          minDate: {
            day: today.day,
            month: today.month + 1,
            year: today.year,
          },
        },
        validationLabels: {
          required: 'public.validations.required',
        },
      }),
      purpose: new DropdownControl({
        columnCount: 6,
        order: 9,
        label: 'transfer.standingOrder.purpose',

        controlOptions: {
          columnId: 'key',
          textField: 'value',
          options: [],
          hasSearch: true,
        },
        required: true,
        validationLabels: {
          required: 'public.validations.required',
        },
      }),
      remarks: new TextInputControl({
        columnCount: 6,
        order: 10,
        label: 'transfer.standingOrder.remarks',
        value: '',
      }),
    },
  });
};

export const getFrequencyObject = (): any => {
  return {
    frequency: {
      1: 'transfer.standingOrder.frequency.oneMon',
      3: 'transfer.standingOrder.frequency.threeMon',
      6: 'transfer.standingOrder.frequency.sixMon',
      12: 'transfer.standingOrder.frequency.twelveMon',
    },
  };
};

export const standingOrderSummery = () => {
  const summaryModel: SummaryModel = {
    title: {
      id: 'summary-title',
      type: 'Section',
      title: 'public.summary',
    },
    sections: [],
  };
  return summaryModel;
};

export const standingOrderBeneficiariesTable = () => {
  return new FormModel({
    id: 'standingOrderBeneficiariesTable',
    showDivider: true,
    controls: {
      accountFrom: new AccountControl({
        columnCount: 6,
        order: 2,
        label: 'transfer.standingOrder.frmAcc',
        required: true,
        validationLabels: {
          required: 'public.validations.required',
        },
      }),
      empty: new EmptyControl({
        order: 2,
        columnCount: 4,
      }),
      addBen: new ButtonControl({
        columnCount: 2,
        order: 2,
        controlOptions: {
          id: 'addNewBen',
          text: 'transfer.standingOrder.addBen',
          type: 'primary',
          prefixIcon: 'arb-icon-userAdd',
        },
      }),
      standingOrderBeneficiariesTable: new TableControl({
        columnCount: 12,
        order: 3,
        controlOptions: {
          headers: [
            {
              title: 'transfer.standingOrder.ben',
              fieldName: 'beneficiaryFullName',
              type: TableHeaderType.TEXT,
            },
            {
              title: 'transfer.standingOrder.nickname',
              fieldName: 'name',
              type: TableHeaderType.TEXT,
            },
            {
              title: 'transfer.standingOrder.bankName',
              fieldName: 'bankName',
              type: TableHeaderType.TEXT,
            },
            {
              title: 'transfer.standingOrder.account',
              fieldName: 'beneficiaryAccount.fullAccountNumber',
              type: TableHeaderType.TEXT,
            },
            {
              title: 'transfer.standingOrder.currency',
              fieldName: 'beneficiaryCurrency',
              type: TableHeaderType.TEXT,
            },
            {
              title: 'transfer.standingOrder.category',
              fieldName: 'beneficiaryCategory',
              type: TableHeaderType.TEXT,
            },
            {
              title: 'transfer.standingOrder.email',
              fieldName: 'email',
              type: TableHeaderType.TEXT,
            },
          ],
          columnId: 'beneficiaryId',
          hasCheckbox: true,
          showSearch: true,
          pageSizes: [10, 15],
          paginationValue: { page: 1, size: 10 },
        },
      }),
    },
  });
};

export const getEndButtons = (
  showPendingActions: boolean,
  levelOneOrder: boolean
): ButtonModel[] => {
  return levelOneOrder
    ? [
        {
          id: 'dashboard',
          type: 'secondary',
          text: 'company-admin.user-info.go-to-dashboard',
        },
        {
          id: 'transfers',
          type: 'primary',
          text: 'transfer.go-to-transfers',
        },
      ]
    : !showPendingActions
    ? [
        {
          id: 'transfers',
          type: 'primary',
          text: 'transfer.go-to-transfers',
        },
      ]
    : [
        {
          id: 'pendingActions',
          type: 'secondary',
          text: 'public.go-to-pending-actions',
        },
        {
          id: 'transfers',
          type: 'primary',
          text: 'transfer.go-to-transfers',
        },
      ];
};

export const getDeleteDetails = (): FormModel => {
  return new FormModel({
    id: 'standingOrderDetails',
    controls: {
      header: new TextControl({
        order: 1,
        columnCount: 12,
        label: 'transfer.standingOrder.detailsView.deleteMsg',
        class: 'color-arb-primaryText font-h2-bold mt-2',
      }),
      ...getCommonViewControls(),
      dateTo: new SummaryItemControl({
        columnCount: 4,
        order: 8,
        label: 'transfer.standingOrder.detailsView.dateTo',
        value: '',
      }),
      divider: new DividerControl({
        columnCount: 12,
        order: 9,
      }),
    },
  });
};

export const getEditDetails = (): FormModel => {
  return new FormModel({
    id: 'standingOrderDetails',
    controls: {
      ...getCommonViewControls(),
      dateTo: new SummaryItemControl({
        columnCount: 4,
        order: 8,
        label: 'transfer.standingOrder.detailsView.dateTo',
        value: '',
      }),
      divider: new DividerControl({
        columnCount: 12,
        order: 9,
      }),
    },
  });
};

export const getEditDetailsForm = (): FormModel => {
  return new FormModel({
    id: 'standingOrderDetails',
    controls: {
      ...getCommonViewControls(),
      dateTo: new DateControl({
        columnCount: 4,
        order: 8,
        label: 'transfer.standingOrder.detailsView.dateTo',
      }),
      divider: new DividerControl({
        columnCount: 12,
        order: 9,
      }),
    },
  });
};

export const getCommonViewControls = (): FormControlModel<ControlBase<any>> => {
  return {
    fromAccount: new SummaryItemControl({
      columnCount: 4,
      order: 2,
      label: 'transfer.standingOrder.detailsView.fromAccount',
      value: '',
    }),
    toAccount: new SummaryItemControl({
      columnCount: 4,
      order: 2,
      label: 'transfer.standingOrder.detailsView.toAccount',
      value: '',
    }),
    amount: new SummaryItemControl({
      columnCount: 4,
      order: 3,
      label: 'transfer.standingOrder.detailsView.amount',
      controlOptions: {
        currency: '608',
      },
    }),
    amtType: new SummaryItemControl({
      columnCount: 4,
      order: 3,
      label: 'transfer.standingOrder.amtType',
    }),
    freq: new SummaryItemControl({
      columnCount: 4,
      order: 4,
      label: 'transfer.standingOrder.detailsView.freq',
      value: '',
    }),
    dayOfTransfer: new SummaryItemControl({
      columnCount: 4,
      order: 5,
      label: 'transfer.standingOrder.detailsView.dayOfTransfer',
      value: '',
    }),
    remark: new SummaryItemControl({
      columnCount: 4,
      order: 6,
      label: 'transfer.standingOrder.detailsView.remark',
      value: '',
    }),
    dateFrom: new SummaryItemControl({
      columnCount: 4,
      order: 7,
      label: 'transfer.standingOrder.detailsView.dateFrom',
      value: '',
    }),
  };
};

export const getAmountType = (): any => {
  return {
    0: 'transfer.standingOrder.amount',
    1: 'transfer.standingOrder.minBlnc',
  };
};
