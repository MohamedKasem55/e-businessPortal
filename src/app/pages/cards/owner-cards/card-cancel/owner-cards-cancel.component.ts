import { Component, OnInit } from '@angular/core';
import {
  CARDS,
  CARDS_OWNER_CANCEL,
} from 'app/@core/constants/pages-urls-constants';
import { CARDS_IMAGES } from 'app/@core/model/dto/cards-enums';
import { SummaryItemControl } from 'app/@core/model/dto/control/sumery-item-control';
import { FormModel, FormResult } from 'app/@core/model/dto/formModel';
import { OwnerCardDetailsModel } from 'app/@core/model/rest/cards/onwer-cards/details-res.model';

import { OwnerCardsListModel as OwnerCardsListModel } from 'app/@core/model/rest/cards/onwer-cards/list-res.model';
import { OwnerCardsService } from 'app/@core/service/cards/owner-cards/owner-cards.service';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { CardsBaseComponent } from '../../cards-base/cards-base.component';
import { CardDetailsFactoryService } from '../../cards-shared/card-details-factory.service';
import { operationControl, typeControl } from './owner-cards-cencel.controls';

@Component({
  selector: 'app-owner-cards-cancel',
  templateUrl: '../../cards-base/cards-base.component.html',
})
export class OwnerCardsCancelComponent
  extends CardsBaseComponent
  implements OnInit
{
  successBackToNew!: ButtonModel;
  successBackToDash!: ButtonModel;

  card!: OwnerCardsListModel;
  creditCardsList!: OwnerCardsListModel[];
  cardCencelForm!: FormModel;

  constructor(
    private ownerCardsService: OwnerCardsService,
    private cardDetailsService: CardDetailsFactoryService
  ) {
    super();
    this.initiateCardDetails();
  }

  override ngOnInit(): void {
    this.initiatePageView();
  }

  override onResultChanged(data: FormResult[]): void {
    let valid = true;
    data.forEach(item => {
      valid = valid && item.valid;
    })
    this.endButtons[0].isDisable = !valid;
  }

  async initiateCardDetails() {
    const state: OwnerCardDetailsModel = this.router.getCurrentNavigation()
      ?.extras.state as OwnerCardDetailsModel;

    if (!state) {
      this.router.navigate(['cards']);
      return;
    }

    const storeCards =
      await this.cardDetailsService.getUserOwnerCardsFromStore();
    const cardDetails = storeCards.find(
      (a) => a.cardNumber == state.balance.card.cardNumber
    );

    if (!cardDetails) {
      this.router.navigate(['cards']);
      return;
    }

    this.card = cardDetails;
  }

  initiatePageView() {
    this.pageTitle = {
      id: 'CancelCardTitle',
      title: 'cards.cancel.title',
      type: 'Page',
      stepper: {
        steps: ['', ''],
        stepCounter: 1,
        stepText: 'public.step',
        ofText: 'public.of',
      },
    };

    this.cardCencelForm = new FormModel({
      id: 'cardPaymentForm',
      controls: {
        typeControl: typeControl(this.card.cardNumber),
        relatedControl: new SummaryItemControl(
          operationControl(this.card.cardAccount)
        ),
      },
    });

    this.startButtons = [this.backButton];
    this.nextButton.isDisable = false;
    this.endButtons = [this.nextButton];

    this.setBreadcrumb([
      {
        text: 'cards.cards',
        url: `/cards`,
      },
      {
        text: 'cards.cancel.title',
        url: `/${CARDS}/${CARDS_OWNER_CANCEL}`,
      },
    ]);

    this.summary = {
      sections: [
        {
          title: {
            id: 'cards-cancel-summary-title',
            title: 'cards.cancel.card-info',
          },
          items: [
            {
              title: 'cards.cancel.owner-card-type-name',
              image: CARDS_IMAGES.OWNER,
              subTitle: this.card.cardNumber,
            },
            {
              title: 'cards.cancel.operation',
              subTitle: 'cards.cancel.title',
            },
          ],
        },
      ],
    };
  }

  backToCards() {
    this.location.back();
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case this.nextButton.id:
        this.cancelCard();
        break;
      case this.backButton.id:
        this.backToCards();
        break;
      case this.backToCardsButton.id:
        this.backToCards();
        break;
      case this.backToDashboardButton.id:
        this.backToDashboard();
        break;
    }
  }
  backToDashboard() {
    this.router.navigateByUrl(`/dashboard`);
  }
  cancelCard() {
    this.ownerCardsService.cancelCard(this.card).subscribe({
      next: (res) => {
        this.moveToSuccess();
      },
      error: (err) => {},
    });
  }

  moveToSuccess() {
    this.endButtons = [this.backToDashboardButton, this.backToCardsButton];
    this.startButtons = [];
    this.stepperMoveNext();
  }
}
