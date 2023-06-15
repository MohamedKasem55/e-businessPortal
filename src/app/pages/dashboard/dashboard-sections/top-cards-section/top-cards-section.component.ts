import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthenticationUtils } from 'app/@core/utility/authentication-utils';
import { CardsListFactoryService } from 'app/pages/cards-shared/cards-list-factory.service';
import { DisplayedCardsList } from 'app/pages/cards-shared/model/card-display.model';
import { addBusinessCardsListAction, addDebitCardsListAction, addPrepaidCardsListAction } from 'app/pages/cards-shared/store/cards.action';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { LineCardModel } from 'arb-design-library/model/line-card.model';
import { TitleModel } from 'arb-design-library/model/title.model';

@Component({
  selector: 'app-top-cards-section',
  templateUrl: './top-cards-section.component.html',
})
export class TopCardsSectionComponent implements OnInit {

  topCardsTitle: TitleModel = {
    id: "topCardsAction",
    title: "cards.cards",
    endButtons: [
      {
        id: "viewAllCards",
        text: "pending-actions.view-all",
        type: "outLine"
      }
    ]
  }
  displayedCardsList!: DisplayedCardsList[];
  cardsLineCards!: LineCardModel[];

  canApplyForNewCard!: boolean;
  applyForCardBtn: ButtonModel[] = [
    {
      id: 'apply-for-new-card',
      type: 'secondary',
      text: 'cards.apply-for-new-card',
    },
  ];

  DISPLAYED_LIST_LENGHT = 3;

  constructor(
    private cardsListFactoryService: CardsListFactoryService,
    private store: Store,
    private router: Router,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.loadTopCards();
    this.checkForApplyNewCard();
  }

  checkForApplyNewCard() {
    this.canApplyForNewCard =
      (AuthenticationUtils.hasAccess('RequestNewPrepaidCard') ||
        AuthenticationUtils.hasAccess('RequestNewDebitCard')) &&
      !this.cardsLineCards?.length;
  }

  async loadTopCards() {
    let companyUserGroups = JSON.parse(sessionStorage.getItem('groups')!)
    let cards: DisplayedCardsList[] = [];
    if (companyUserGroups.items.PrepaidCardsDisplayGroup) {
      const prepaidList = await this.getPrepaidCards();
      cards = prepaidList || [];
      if (cards.length >= this.DISPLAYED_LIST_LENGHT) return this.setCardsLineCards(cards);
    }
    if (companyUserGroups.items.BusinessCardsDisplay) {
      const businessList = await this.getBusinessCards() || [];
      cards = [...cards, ...businessList];
      if (cards.length >= this.DISPLAYED_LIST_LENGHT) return this.setCardsLineCards(cards);
    }
    if (companyUserGroups.items.CompanyAdmins) {
      {
        const madaList = await this.getDebitCards() || [];
        cards = [...cards, ...madaList];
        this.setCardsLineCards(cards);
      }
    }
  }

  setCardsLineCards(cards: DisplayedCardsList[]) {
    cards = cards.slice(0, this.DISPLAYED_LIST_LENGHT);
    this.displayedCardsList = cards
    this.cardsLineCards = [];
    let tempLineCards: LineCardModel[] = [];
    cards.forEach((item, index) => {
      tempLineCards.push({
        id: item.cardSeqNum,
        title: item.cardName,
        card: item.image,
        subTitle: item.number,
        amountPosition: "left",
        amount: item.balance,
        currency: item.currency,
        pill: item.cardStatusBadge,
        hasBackground: true
      });
    });
    this.cardsLineCards = tempLineCards;
  }

  async getBusinessCards() {
    try {
      const {businessCardsList, resList} =
        await this.cardsListFactoryService.getBusinessCards(true);
      if (businessCardsList) {
        this.store.dispatch(
          addBusinessCardsListAction({
            businessCards: resList,
          })
        );
        return businessCardsList;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }

  async getPrepaidCards() {
    try {
      const {prepaidCardsList, resList} = await this.cardsListFactoryService.getPrepaidCards(true);
      if (prepaidCardsList) {
        this.store.dispatch(
          addPrepaidCardsListAction({prepaidCards: resList})
        );
        return prepaidCardsList;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }

  async getDebitCards() {
    try {
      const {debitCardsList, resList} = await this.cardsListFactoryService.getDebitCards(true);
      if (debitCardsList) {
        this.store.dispatch(
          addDebitCardsListAction({debitCards: resList})
        );
        return debitCardsList;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }

  onCardClick(buttonId: string): void {
    if (buttonId === 'viewAllCards') {
      return void this.router.navigate(['/cards']);
    }
    let card = this.displayedCardsList.find(item => item.cardSeqNum == buttonId)
    card && this.cardsListFactoryService.gotoCardDetails(card.cardIndex, card.cardType);
  }

  applyForCardClick() {
    void this.router.navigate(['/cards/apply-new-card']);
  }

}
