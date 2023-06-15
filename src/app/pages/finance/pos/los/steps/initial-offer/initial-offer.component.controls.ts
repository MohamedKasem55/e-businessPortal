import { DividerControl } from 'app/@core/model/dto/control/divider-control';
import { LineCardControl } from 'app/@core/model/dto/control/line-card-control';
import { SelectionControl } from 'app/@core/model/dto/control/selection-control';
import { SummaryItemControl } from 'app/@core/model/dto/control/sumery-item-control';
import { TitleControl } from 'app/@core/model/dto/control/title-control';
import { FormModel } from 'app/@core/model/dto/formModel';
import { AmountControl } from '../../../../../../@core/model/dto/control/amount-control';
import { DropdownControl } from 'app/@core/model/dto/control/dropdown-control';

export const getInitialOfferControl = (repaymentPeriodTime: any) => {
  return new FormModel({
    id: 'initialOffer',
    controls: {
      pageTitle: new TitleControl({
        order: 1,
        columnCount: 12,
        controlOptions: {
          id: 'initialOfferTitle',
          title: 'finance.pos.los.initialOfferTitle',
          type: 'Page',
        },
      }),
      eligiblefor: new LineCardControl({
        order: 1,
        columnCount: 12,
        controlOptions: {
          title:
            'finance.pos.los.eligiblefor',
        },
      }),
      currentYearTitle: new TitleControl({
        order: 2,
        columnCount: 12,
        class: 'pt-2',
        controlOptions: {
          id: 'amountDetailsId',
          title: 'finance.pos.los.initialamountDetails',
          type: 'Section',
        },
      }),
      requestedAmount: new AmountControl({
        order: 3,
        columnCount: 4,
        label: 'finance.pos.los.requestedAmount',
        value: '',
        required: true,
        validators: [],
        validationLabels: { required: 'finance.pos.los.errorMsg' },
        controlOptions: { currency: '608' },
      }),
      installmentAmount: new SummaryItemControl({
        order: 4,
        columnCount: 8,
        label: 'finance.pos.los.installmentAmount',
        value: '',
        controlOptions: { currency: '608' },
      }),
      amountDetailsDivider: new DividerControl({
        order: 5,
        columnCount: 12,
      }),
      repaymentPeriod: new DropdownControl({
        order: 6,
        columnCount: 4,
        class: 'text-start',
        label: 'finance.pos.los.repaymentPeriod',
        required: true,
        validators: [],
        value: '',
        validationLabels: { required: 'finance.pos.los.errorMsg' },
        controlOptions: {
          columnId: 'code',
          textField: 'branch',
          options: repaymentPeriodTime,
        },
      }),
      amountOfTime: new LineCardControl({
        order: 7,
        columnCount: 12,
        controlOptions: {
          title: 'finance.pos.los.amountOfTime',
        },
      }),
      documentationTitle: new TitleControl({
        order: 8,
        columnCount: 12,
        class: 'pt-2',
        controlOptions: {
          id: 'documentationId',
          title: 'finance.pos.los.initialdocumentationTitle',
          subTitle:
            'finance.pos.los.initialdocumentationSubTitle',
          type: 'Section',
        },
      }),
      profiltRate: new SummaryItemControl({
        order: 9,
        columnCount: 4,
        label: 'finance.pos.los.profiltRate',
        value: '%',
      }),
      adminFee: new SummaryItemControl({
        order: 10,
        columnCount: 4,
        label: 'finance.pos.los.adminFee',
        value: '',
      }),
      initiationDate: new SummaryItemControl({
        order: 11,
        columnCount: 4,
        label: 'finance.pos.los.initiationDate',
        value: '',
      }),
      documentationDivider: new DividerControl({
        order: 12,
        columnCount: 12,
      }),
      acceptPosTerminals: new SelectionControl({
        order: 13,
        columnCount: 12,
        class: 'pt-2',
        required: true,
        validators: [],
        validationLabels: { required: 'finance.pos.los.errorMsg' },
        controlOptions: {
          title: [
            {
              text: 'finance.pos.los.acceptPosTerminals',
            },
          ],
        },
      }),
    },
  });
};
