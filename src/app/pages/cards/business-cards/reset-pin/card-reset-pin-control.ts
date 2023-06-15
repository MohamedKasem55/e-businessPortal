import {TranslateService} from "@ngx-translate/core";
import {FormModel} from "../../../../@core/model/dto/formModel";
import {LineCardControl} from "app/@core/model/dto/control/line-card-control";
import {PinInputControl} from "app/@core/model/dto/control/pin-input-control";
import {EmptyControl} from "../../../../@core/model/dto/control/empty-control";
import {AbstractControl, ValidationErrors} from "@angular/forms";
import { BusinessCardsDetailsModel } from "app/@core/model/rest/cards/business-cards/business-cards-models";
import { CARDS_IMAGES } from "app/@core/model/dto/cards-enums";
import { TitleControl } from "app/@core/model/dto/control/title-control";

export function getBusinessCardDetailsForm(translate: TranslateService, cardsDetails: BusinessCardsDetailsModel) {
  return new FormModel({
    id: 'business-cards-details',
    showDivider: true,
    controls: {
      "titleConrtol": new TitleControl({
        order: 2,
        columnCount: 12,
        controlOptions: {
          id: '',
          title: 'cards.reset-pin-title',
          type: 'Section',
        },
      }),
      "cardInfo": new LineCardControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          title: 'cards.business-cards',
          subTitle: cardsDetails.cardNum,
          card: CARDS_IMAGES.BUSINESS,
          weight: "Bold"
        }
      }),
      "newPin": new PinInputControl({
        columnCount: 6,
        order: 2,
        required: true,
        label: 'cards.prepaid-card.enter-new-pin',
        validationLabels: {
          required: 'cards.prepaid-card.enter-new-pin-required',
        },
      }),
      "empty": new EmptyControl({columnCount: 6, order: 3}),
      "repeatedNewPin": new PinInputControl({
        columnCount: 6,
        order: 4,
        required: true,
        disable: false,
        label: 'cards.prepaid-card.enter-new-pin-again',
        validationLabels: {
          required: 'cards.prepaid-card.enter-new-pin-again-required',
        },
      })
    },
    formValidator: [{
      validatorFunc: (controls: AbstractControl): ValidationErrors | null => {
        const newPin = controls.get('newPin')?.value;
        const repeatedNewPin = controls.get('repeatedNewPin')?.value;

        if (newPin !== repeatedNewPin && newPin &&  repeatedNewPin) {
          return {invalidPin: "invalidPin"}
        } else {
          return null;
        }
      },
      errorName: 'invalidPin',
      errorMessage: 'cards.prepaid-card.pin-mismatch-message'
    }
    ]
  });
}
