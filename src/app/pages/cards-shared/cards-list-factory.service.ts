import {ActivatedRoute, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {CARD_TYPE} from 'app/@core/model/dto/cards-enums';
import {BusinessCardsService} from 'app/@core/service/cards/business-cards/business-cards.service';
import {DebitCardsService} from 'app/@core/service/cards/debit-cards/debit-cards.service';
import {OwnerCardsService} from 'app/@core/service/cards/owner-cards/owner-cards.service';
import {PrepaidCardsService} from 'app/@core/service/cards/prepaid-cards/prepaid-cards.service';
import {take} from 'rxjs';
import {CardsListAdapterService} from './cards-list-adapter.service';
import {OwnerCardsListModel} from 'app/@core/model/rest/cards/onwer-cards/list-res.model';
import {PrepaidCardsListModel} from 'app/@core/model/rest/cards/prepaid-cards/list-res.model';
import {DebitCardsListModel} from 'app/@core/model/rest/cards/debit-cards/list-res.model';
import {DisplayedCardsList} from './model/card-display.model';
import {
  CARDS_BUSINESS_DETAILS,
  CARDS_DEBIT_DETAILS,
  CARDS_OWNER_DETAILS,
  CARDS_PREPAID_DETAILS,
} from 'app/@core/constants/pages-urls-constants';

@Injectable()
export class CardsListFactoryService {
  cardsTypes = CARD_TYPE;

  constructor(
    private creditCardsService: OwnerCardsService,
    private prepaidCardsService: PrepaidCardsService,
    private businessCardsService: BusinessCardsService,
    private debitCardsService: DebitCardsService,
    private cardsListAdapterService: CardsListAdapterService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  getPrepaidCards(isSilentError: boolean = false): Promise<{
    prepaidCardsList: DisplayedCardsList[];
    resList: PrepaidCardsListModel[];
  }> {
    return new Promise((resolve, reject) => {
      this.prepaidCardsService
        .getPrepaidCardsList(isSilentError)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            if (res.prepaidCardsList?.length) {
              const prepaidCardsList =
                this.cardsListAdapterService.getDisplayedCardsList(
                  res.prepaidCardsList,
                  this.cardsTypes.PREPAID
                );
              resolve({prepaidCardsList, resList: res.prepaidCardsList});
            } else {
              reject([]);
            }
          },
          error: () => {
            reject([]);
          },
        });
    });
  }

  getOwnerCards(page: number, rows: number, isSilentError: boolean = false): Promise<{
    ownerCardsList: DisplayedCardsList[];
    resList: OwnerCardsListModel[];
    total: number;
  }> {
    return new Promise((resolve, reject) => {
      this.creditCardsService
        .getOwnerCardsList(page, rows, isSilentError)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            if (res.cardsList?.length) {
              const ownerCardsList =
                this.cardsListAdapterService.getDisplayedCardsList(
                  res.cardsList,
                  this.cardsTypes.OWNER
                );
              const total = res.cardsList.length; // to get total from service
              resolve({ownerCardsList, resList: res.cardsList, total});
            } else {
              reject([]);
            }
          },
          error: () => {
            reject([]);
          },
        });
    });
  }

  getDebitCards(isSilentError: boolean = false): Promise<{
    debitCardsList: DisplayedCardsList[];
    resList: DebitCardsListModel[];
  }> {
    return new Promise((resolve, reject) => {
      this.debitCardsService
        .getDebitCardsList(20, 1,isSilentError)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            if (res.cardDtlsLst?.length) {
              const debitCardsList =
                this.cardsListAdapterService.getDisplayedCardsList(
                  res.cardDtlsLst,
                  this.cardsTypes.DEBIT
                );
              resolve({debitCardsList, resList: res.cardDtlsLst});
            } else {
              reject([]);
            }
          },
          error: () => {
            reject([]);
          },
        });
    });
  }

  getBusinessCards(isSilentError: boolean = false): Promise<{
    businessCardsList: DisplayedCardsList[];
    resList: any[];
    total: number;
  }> {
    return new Promise((resolve, reject) => {
      this.businessCardsService
        .getBusinessCardsList(isSilentError)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            if (res.businessCardsList?.items.length) {
              const businessCardsList =
                this.cardsListAdapterService.getDisplayedCardsList(
                  res.businessCardsList.items,
                  this.cardsTypes.BUSINESS
                );
              const total = res.businessCardsList.items.length; // to get total from service
              resolve({
                businessCardsList,
                resList: res.businessCardsList.items,
                total,
              });
            } else {
              reject([]);
            }
          },
          error: () => {
            reject([]);
          },
        });
    });
  }

  gotoCardDetails(cardIndex: number, cardType: string): void {
    let url = '';
    switch (cardType) {
      case this.cardsTypes.BUSINESS:
        url = `/cards/${CARDS_BUSINESS_DETAILS}`;
        break;
      case this.cardsTypes.PREPAID:
        url = `/cards/${CARDS_PREPAID_DETAILS}`;
        break;
      case this.cardsTypes.OWNER:
        url = `/cards/${CARDS_OWNER_DETAILS}`;
        break;
      case this.cardsTypes.DEBIT:
        url = `/cards/${CARDS_DEBIT_DETAILS}`;
        break;
    }
    this.router.navigate([`./${url}`], {
      state: {cardIndex, cardType},
      relativeTo: this.route,
    });
  }
}
