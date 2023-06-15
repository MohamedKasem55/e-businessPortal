import { AmountControl } from 'app/@core/model/dto/control/amount-control';
import { DateControl } from 'app/@core/model/dto/control/date-control';
import { LineCardControl } from 'app/@core/model/dto/control/line-card-control';
import { TitleControl } from 'app/@core/model/dto/control/title-control';
import { FormModel } from 'app/@core/model/dto/formModel';
import { Utils } from 'app/@core/utility/Utils';

export const getFinancialDetailsControl = () => {
  return new FormModel({
    id: 'financialDetails',
    controls: {
      pageTitle: new TitleControl({
        order: 1,
        columnCount: 12,
        controlOptions: {
          id: 'financialDetailsTitle',
          title: 'finance.pos.los.financialDetailsTitle',
          type: 'Page',
        },
      }),
      currentYearTitle: new TitleControl({
        order: 1,
        columnCount: 12,
        class: 'pt-4',
        controlOptions: {
          id: 'currentYear',
          title: 'finance.pos.los.currentYearTitle',
          type: 'Section',
        },
      }),
      currentYearFrom: new DateControl({
        order: 2,
        columnCount: 6,
        label: 'finance.pos.los.currentYearFrom',
        required: true,
        validators: [],
        validationLabels: { required: 'finance.pos.los.errorMsg' },
      }),
      currentYearTo: new DateControl({
        order: 3,
        columnCount: 6,
        required: true,
        validators: [],
        validationLabels: { required: 'finance.pos.los.errorMsg' },
        controlOptions: {
          minDate: Utils.getToday(),
        },
        label: 'finance.pos.los.currentYearTo',
      }),
      currentSalesTurnover: new AmountControl({
        order: 4,
        columnCount: 4,
        required: true,
        value: 0,
        validators: [],
        validationLabels: { required: 'finance.pos.los.errorMsg' },
        label: 'finance.pos.los.currentSalesTurnover',
      }),
      currentNetProfit: new AmountControl({
        order: 5,
        columnCount: 4,
        required: true,
        value: 0,
        validators: [],
        validationLabels: { required: 'finance.pos.los.errorMsg' },
        label: 'finance.pos.los.currentNetProfit',
      }),
      currentGrossProfit: new AmountControl({
        order: 5,
        columnCount: 4,
        required: true,
        value: 0,
        validators: [],
        validationLabels: { required: 'finance.pos.los.errorMsg' },
        label: 'finance.pos.los.currentGrossProfit',
      }),
      currentTotalSum: new LineCardControl({
        order: 6,
        columnCount: 6,
        controlOptions: {
          title:
            'finance.pos.los.currentTotalSum',
        },
      }),
      currentAmountEarned: new LineCardControl({
        order: 6,
        columnCount: 6,
        controlOptions: {
          title:
            'finance.pos.los.currentAmountEarned',
        },
      }),
      lastYearTitle: new TitleControl({
        order: 7,
        columnCount: 12,
        class: 'pt-4',
        controlOptions: {
          id: 'lastYearId',
          title: 'finance.pos.los.lastYearTitle',
          type: 'Section',
        },
      }),
      lastYearFrom: new DateControl({
        order: 8,
        columnCount: 6,
        required: true,
        validators: [],
        validationLabels: { required: 'finance.pos.los.errorMsg' },
        label: 'finance.pos.los.lastYearFrom',
      }),
      lastYearTo: new DateControl({
        order: 9,
        columnCount: 6,
        required: true,
        validators: [],
        validationLabels: { required: 'finance.pos.los.errorMsg' },
        label: 'finance.pos.los.lastYearTo',
      }),
      lastSalesTurnover: new AmountControl({
        order: 10,
        columnCount: 4,
        required: true,
        value: 0,
        validators: [],
        validationLabels: { required: 'finance.pos.los.errorMsg' },
        label: 'finance.pos.los.lastSalesTurnover',
      }),
      lastNetProfit: new AmountControl({
        order: 11,
        columnCount: 4,
        required: true,
        validators: [],
        value: 0,
        validationLabels: { required: 'finance.pos.los.errorMsg' },
        label: 'finance.pos.los.lastNetProfit',
      }),
      lastGrossProfit: new AmountControl({
        order: 11,
        columnCount: 4,
        required: true,
        validators: [],
        value: 0,
        validationLabels: { required: 'finance.pos.los.errorMsg' },
        label: 'finance.pos.los.lastGrossProfit',
      }),
      lastTotalSum: new LineCardControl({
        order: 12,
        columnCount: 6,
        controlOptions: {
          title:
            'finance.pos.los.lastTotalSum',
        },
      }),
      lastAmountEarned: new LineCardControl({
        order: 13,
        columnCount: 6,
        controlOptions: {
          title:
            'finance.pos.los.lastAmountEarned',
        },
      }),
    },
  });
};
