import { CARDS_IMAGES } from 'app/@core/model/dto/cards-enums';
import { LineCardControl } from 'app/@core/model/dto/control/line-card-control';
import { SummaryItemControlOptions } from 'app/@core/model/dto/control/sumery-item-control';

export const typeControl = (itemValue: string) : LineCardControl => {
  let control = new LineCardControl({
    controlOptions: {
      card: CARDS_IMAGES.OWNER,
      title: 'cards.payment.owner-card-type-name',
      subTitle: itemValue,
      weight: 'Regular',
    },
    order: 1,
    columnCount: 3
  });
  return control;
};

export const operationControl = (itemValue: string) : SummaryItemControlOptions => {
  let item : SummaryItemControlOptions= {
    label: 'cards.payment.operation',
    value: itemValue,
    order: 1,
    columnCount: 3
  };
  return item;
};
