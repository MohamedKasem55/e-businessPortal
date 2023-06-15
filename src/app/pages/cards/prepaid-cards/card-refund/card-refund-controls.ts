import { PrepaidCardsListModel } from 'app/@core/model/rest/cards/prepaid-cards/list-res.model';
import { PrepaidCardDetailsModel } from 'app/@core/model/rest/cards/prepaid-cards/details-res.model';
import { CARDS_IMAGES } from 'app/@core/model/dto/cards-enums';
import { LineCardControl } from '../../../../@core/model/dto/control/line-card-control';
import { AmountControl } from 'app/@core/model/dto/control/amount-control';
import { DividerControl } from "app/@core/model/dto/control/divider-control";
import { DropdownControl } from "app/@core/model/dto/control/dropdown-control";
import { EmptyControl } from "app/@core/model/dto/control/empty-control";
import { SummaryItemControl } from "app/@core/model/dto/control/sumery-item-control";
import { TitleControl } from "app/@core/model/dto/control/title-control";
import { FormModel } from "app/@core/model/dto/formModel";
import {Utils} from "../../../../@core/utility/Utils";

export function topUpCardForm(
  details: PrepaidCardDetailsModel,
  card: PrepaidCardsListModel
): FormModel {
  return new FormModel({
    id: 'topUpCardForm',
    controls: {
      cardInformationTitle: new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: '',
          title: 'cards.topup.card-information',
        },
      }),
      cardNumberSummary: new LineCardControl({
        columnCount: 4,
        order: 2,
        controlOptions: {
          card: CARDS_IMAGES.PREPAID,
          title: card.cardNickName || 'cards.topup.prepaid-card',
          subTitle: details?.cardNum,
          weight: 'Regular',
        },
      }),
      cardHolderSummary: new SummaryItemControl({
        columnCount: 4,
        order: 3,
        label: 'cards.topup.card-holder',
        value: card?.embossingName,
      }),
      cardAccountSummary: new SummaryItemControl({
        columnCount: 4,
        order: 4,
        label: 'cards.topup.related-account',
        value: card?.cardAccount,
      }),
      divider: new DividerControl({
        columnCount: 12,
        order: 5,
      }),
      cardpaymentDetailsForm: new TitleControl({
        columnCount: 12,
        order: 6,
        controlOptions: {
          id: '',
          title: 'cards.topup.payment-details',
        },
      }),
      paymentAccount: new DropdownControl({
        label: 'cards.topup.account',
        hidden: false,
        required: true,
        order: 7,
        controlOptions: {columnId: "key", textField: 'value' },
        columnCount: 6,
        validationLabels: {
          required: Utils.translateWithParams(
            'public.is-required',
            { field: 'cards.topup.account' }
          ),
        },
      }),
      paymentAmount: new AmountControl({
        label: 'cards.topup.amount',
        hidden: false,
        required: true,
        order: 8,
        columnCount: 6,
        value: '',
        validationLabels: {
          required: Utils.translateWithParams(
            'public.is-required',
            { field: 'cards.topup.amount' }
          ),
        },
      }),
      empty: new EmptyControl({
        columnCount: 12,
        order: 9,
      }),
    },
  });
}
