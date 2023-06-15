import { SummaryModel } from 'arb-design-library/model/summary.model';
import { FormModel } from '../../../@core/model/dto/formModel';
import { TranslateService } from '@ngx-translate/core';
import { TitleModel } from 'arb-design-library/model/title.model';
import { TitleControl } from '../../../@core/model/dto/control/title-control';
import { UploadControl } from '../../../@core/model/dto/control/upload-control';
import { TextInputControl } from '../../../@core/model/dto/control/text-input-control';
import { TableControl } from '../../../@core/model/dto/control/table-control';
import { SummaryItemModel } from 'arb-design-library/model/summary-item.model';
import { BulkPaymentTransferFileUploadRes } from '../../../@core/model/rest/transfer/bulk-payment-transfer/bulk-payment-transfer-file-upload-res';
import { TableHeaderType } from 'arb-design-library';
import { AccountControl } from '../../../@core/model/dto/control/account-control';
import { Account } from '../../../@core/model/rest/common/account';
import { DividerControl } from '../../../@core/model/dto/control/divider-control';
import { SummaryItemControl } from '../../../@core/model/dto/control/sumery-item-control';
import { AuthenticationUtils } from '../../../@core/utility/authentication-utils';

export const bulkPaymentTransfer = () => {
  const pageTitle: TitleModel = {
    id: 'bulkPayment',
    showArrow: true,
    title: 'transfer.blkPmtTns.name',
    stepper: {
      steps: ['', '', '', ''],
      stepCounter: 1,
      stepText: 'public.step',
      ofText: 'public.of',
    },
  };
  return pageTitle;
};

export const bulkPaymentOnBoarding = () => {
  const pageTitle: TitleModel = {
    id: 'bulkPaymentRegistration',
    title: 'transfer.blkPmtTns.self-onBoarding.bulkTransfer',
    showArrow: true,
    stepper: {
      steps: ['', '', ''],
      stepCounter: 1,
      stepText: 'public.step',
      ofText: 'public.of',
    },
  };
  return pageTitle;
};

export const bulkPaymentTransferForm = (
  translate: TranslateService,
  orgName: string,
  cic: string
): FormModel => {
  return new FormModel({
    id: 'bulkPaymentTransfer',
    showDivider: false,
    controls: {
      orgTitle: new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: 'bulkPaymentTransferId',
          type: 'Section',
          title: 'public.org',
        },
      }),
      orgName: new SummaryItemControl({
        columnCount: 6,
        order: 1,
        label: 'public.orgName',
        value: orgName,
      }),
      orgCIC: new SummaryItemControl({
        columnCount: 6,
        order: 1,
        label: 'public.cic',
        value: cic,
      }),
      other: new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: 'bulkPaymentTransferId',
          type: 'Page',
          title: 'public.other',
          endButtons: [
            {
              id: 'appStatus',
              type: 'secondary',
              text: 'public.approvalStatus',
              isDisable: !AuthenticationUtils.hasAccess(
                'BulkPaymentsRequestStatus'
              ),
            },
            {
              id: 'dwntemp',
              type: 'secondary',
              text: 'public.dwntemp',
              isDisable: !AuthenticationUtils.hasAccess(
                'BulkDownloadTemplates'
              ),
            },
          ],
        },
      }),
      upload: new UploadControl({
        columnCount: 6,
        order: 1,
        value: '',
        label: 'public.uploadFile',
        required: true,
        disable: !AuthenticationUtils.hasAccess('BulkUploadFile'),
        controlOptions: {
          acceptedTypes: ['text/plain'],
        },
        validationLabels: {
          required: 'public.validations.required',
        },
      }),
      batchName: new TextInputControl({
        columnCount: 6,
        order: 1,
        value: '',
        label: 'transfer.blkPmtTns.batchName',
        required: true,
        disable: !AuthenticationUtils.hasAccess('BulkUploadFile'),
        validationLabels: {
          required: 'public.validations.required',
        },
      }),
    },
  });
};

export const bulkPaymentTransferBenTable = (): FormModel => {
  return new FormModel({
    id: 'bulkPaymentTransferBenTable',
    showDivider: false,
    controls: {
      benDtls: new TableControl({
        columnCount: 12,
        order: 4,
        controlOptions: {
          headers: [
            {
              title: 'transfer.blkPmtTns.benName',
              fieldName: 'beneficiaryName',
              type: TableHeaderType.TEXT,
            },
            {
              title: 'transfer.blkPmtTns.benRef',
              fieldName: 'beneficiaryReference',
              type: TableHeaderType.TEXT,
            },
            {
              title: 'transfer.blkPmtTns.benAmount',
              fieldName: 'amount',
              type: TableHeaderType.AMOUNT_TEXT,
              controlOptions: { currency: 'currencyLine' },
            },
            {
              title: 'transfer.blkPmtTns.benAcc',
              fieldName: 'account',
              type: TableHeaderType.TEXT,
            },
            {
              title: 'transfer.blkPmtTns.civilianId',
              fieldName: 'civilianId',
              type: TableHeaderType.TEXT,
            },
            {
              title: 'transfer.blkPmtTns.beneficiaryRemarks',
              fieldName: 'beneficiaryRemarks',
              type: TableHeaderType.TEXT,
            },
          ],
          columnId: 'beneficiaryReference',
          hasCheckbox: false,
          showSearch: false,
          showFilter: false,
        },
      }),
    },
  });
};

export const bulkPaymentTransferErrorTable = (
  translate: TranslateService,
  data: any[],
  numOfRows: number
) => {
  return new FormModel({
    id: 'standingOrderTable',
    showDivider: true,
    controls: {
      standingOrderTable: new TableControl({
        columnCount: 12,
        order: 1,
        class: 'text-start',
        controlOptions: {
          columnId: '',
          headers: [
            {
              title: 'transfer.standingOrder.row-number',
              fieldName: 'lineNumber',
              type: TableHeaderType.TEXT,
            },
            {
              title: 'transfer.standingOrder.error-description',
              fieldName: 'errorCode',
              type: TableHeaderType.TEXT,
            },
            {
              title: 'transfer.standingOrder.field-name',
              fieldName: 'fieldName',
              type: TableHeaderType.TEXT,
            },
            {
              title: 'transfer.standingOrder.field-data',
              fieldName: 'fieldData',
              type: TableHeaderType.TEXT,
            },
          ],
          hasCheckbox: false,
          showSearch: false,
          showFilter: false,
          pageSizes: [10, 15],
          data: data,
          total: numOfRows,
        },
      }),
    },
  });
};

export const bulkPaymentTransferSummery = () => {
  const summaryModel: SummaryModel = {
    title: {
      id: 'summary-title',
      type: 'Section',
      title: 'public.subscriptionDetails',
      startButtons: [
        {
          id: 'edit-btn',
          type: 'secondary',
          text: 'public.edit',
        },
      ],
    },

    sections: [],
  };
  return summaryModel;
};

export const setSummaryItems = (
  items: SummaryItemModel[],
  translate: TranslateService,
  formModel: FormModel,
  bulkPaymentTransferFileUploadRes: BulkPaymentTransferFileUploadRes
) => {
  let orgNameTitle = formModel.controls['orgName'];
  let itemModel: SummaryItemModel = {
    title: orgNameTitle.label,
    subTitle: orgNameTitle.value,
  };
  items.push(itemModel);

  let cicTitle = formModel.controls['orgCIC'];
  itemModel = {
    title: cicTitle.label,
    subTitle: cicTitle.value,
  };
  items.push(itemModel);

  let uploadTitle = formModel.controls['upload'];
  itemModel = {
    title: uploadTitle.label,
    subTitle: uploadTitle.value.name,
  };
  items.push(itemModel);

  let statusTitle = 'transfer.blkPmtTns.crnt-status';
  itemModel = {
    title: statusTitle,
    subTitle:
      bulkPaymentTransferFileUploadRes.bulkPaymentsBatchDTO.futureStatus,
  };
  items.push(itemModel);

  let valueDate = 'transfer.blkPmtTns.val-date';
  itemModel = {
    title: valueDate,
    subTitle: bulkPaymentTransferFileUploadRes.bulkPaymentsBatchDTO.paymentDate,
  };
  items.push(itemModel);

  let remarks = 'transfer.blkPmtTns.remarks';
  itemModel = {
    title: remarks,
    subTitle: bulkPaymentTransferFileUploadRes.bulkPaymentsBatchDTO.remarks,
  };
  items.push(itemModel);

  let custRef = 'transfer.blkPmtTns.custRef';
  itemModel = {
    title: custRef,
    subTitle:
      bulkPaymentTransferFileUploadRes.bulkPaymentsBatchDTO.fileReference,
  };
  items.push(itemModel);

  let customerProfile = 'transfer.blkPmtTns.custProf';
  itemModel = {
    title: customerProfile,
    subTitle:
      bulkPaymentTransferFileUploadRes.bulkPaymentsBatchDTO.fileHeader
        .companyProfile,
  };
  items.push(itemModel);

  let numberOfTransfers = 'transfer.blkPmtTns.numOfTrnx';
  itemModel = {
    title: numberOfTransfers,
    subTitle:
      bulkPaymentTransferFileUploadRes.bulkPaymentsDetailsDTO
        .numRajhiTransfers +
      bulkPaymentTransferFileUploadRes.bulkPaymentsDetailsDTO
        .numNonRajhiTransfers,
  };
  items.push(itemModel);

  let totalAmount = 'transfer.blkPmtTns.tAmt';
  itemModel = {
    title: totalAmount,
    subTitle:
      bulkPaymentTransferFileUploadRes.bulkPaymentsDetailsDTO.totalAmount,
    currency: '608',
  };
  items.push(itemModel);

  let numberOfAlrajhiTransfers = 'transfer.blkPmtTns.numRajTrnx';
  itemModel = {
    title: numberOfAlrajhiTransfers,
    subTitle:
      bulkPaymentTransferFileUploadRes.bulkPaymentsDetailsDTO.numRajhiTransfers,
  };
  items.push(itemModel);

  let noneAlrajhiTransfers = 'transfer.blkPmtTns.numNonRajTrnx';
  itemModel = {
    title: noneAlrajhiTransfers,
    subTitle:
      bulkPaymentTransferFileUploadRes.bulkPaymentsDetailsDTO
        .numNonRajhiTransfers,
  };
  items.push(itemModel);

  let totalAmountRajhiTransfer = 'transfer.blkPmtTns.tAmtRajTrnx';
  itemModel = {
    title: totalAmountRajhiTransfer,
    subTitle:
      bulkPaymentTransferFileUploadRes.bulkPaymentsDetailsDTO.totalNumRajhi,
    currency: '608',
  };
  items.push(itemModel);

  let totalAmountLocalTransfer = 'transfer.blkPmtTns.tAmtLocalTrnx';
  itemModel = {
    title: totalAmountLocalTransfer,
    subTitle:
      bulkPaymentTransferFileUploadRes.bulkPaymentsDetailsDTO.totalNumNonRajhi,
    currency: '608',
  };
  items.push(itemModel);

  let feesAlrajhi = 'transfer.blkPmtTns.tFeeRaj';
  itemModel = {
    title: feesAlrajhi,
    subTitle:
      bulkPaymentTransferFileUploadRes.bulkPaymentsDetailsDTO.totalFeesRajhi,
    currency: '608',
  };
  items.push(itemModel);

  let feesNoneRajhi = 'transfer.blkPmtTns.tFeeNonRaj';
  itemModel = {
    title: feesNoneRajhi,
    subTitle:
      bulkPaymentTransferFileUploadRes.bulkPaymentsDetailsDTO.totalFeesNonRajhi,
    currency: '608',
  };
  items.push(itemModel);

  let estimatedTotal = 'transfer.blkPmtTns.estTotal';
  itemModel = {
    title: estimatedTotal,
    subTitle:
      bulkPaymentTransferFileUploadRes.bulkPaymentsDetailsDTO.totalEstimated,
    currency: '608',
  };
  items.push(itemModel);
};

export const bulkPaymentOnBoardingForm = (
  translate: TranslateService,
  orgName: string,
  cic: string,
  monthlyFees: number,
  trnxFees: number,
  accounts: Account[]
): FormModel => {
  return new FormModel({
    id: 'bulkPaymentTransfer',
    showDivider: false,
    controls: {
      orgTitle: new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: 'bulkPaymentTransferId',
          type: 'Section',
          title: '',
        },
      }),
      subscriptionDetails: new TitleControl({
        columnCount: 12,
        order: 2,
        controlOptions: {
          id: 'bulkPaymentTransferId',
          type: 'Section',
          title: 'public.subscriptionDetails',
          startButtons: [],
        },
      }),
      orgName: new SummaryItemControl({
        columnCount: 4,
        order: 2,
        label: 'public.orgName',
        value: orgName,
      }),
      orgCIC: new SummaryItemControl({
        columnCount: 4,
        order: 3,
        label: 'public.cic',
        value: cic,
      }),
      monthlyFees: new SummaryItemControl({
        columnCount: 4,
        order: 4,
        label: 'transfer.blkPmtTns.self-onBoarding.monthlyFees',
        value: monthlyFees.toString(),
        controlOptions: {
          currency: '608',
        },
      }),
      trnxFees: new SummaryItemControl({
        columnCount: 4,
        order: 5,
        value: trnxFees.toString(),
        label: 'transfer.blkPmtTns.self-onBoarding.trnxFees',
        controlOptions: {
          currency: '608',
        },
      }),
      empty: new DividerControl({ columnCount: 12, order: 6 }),
      selectAccount: new AccountControl({
        label: 'accounts.selectAccount',
        required: true,
        order: 6,
        columnCount: 6,
        controlOptions: {
          columnId: 'accountPk',
          textField: ['alias', 'fullAccountNumber'],
          hasSearch: false,
          endTextField: 'availableBalance',
          endTextCurrencyField: 'currency',
          options: accounts,
          disabledField: 'disabled',
        },
      }),
    },
  });
};
