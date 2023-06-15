import { DebitCardsService } from 'app/@core/service/cards/debit-cards/debit-cards.service';
import { BusinessCardsService } from 'app/@core/service/cards/business-cards/business-cards.service';
import { PrepaidCardsService } from 'app/@core/service/cards/prepaid-cards/prepaid-cards.service';
import { OwnerCardsService } from 'app/@core/service/cards/owner-cards/owner-cards.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsListAdapterService } from './cards-list-adapter.service';
import { CardsListFactoryService } from './cards-list-factory.service';
import { StoreModule } from '@ngrx/store';
import { cardsReducer } from '../cards-shared/store/cards.reducer';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('cards', cardsReducer),
  ],
  providers: [
    OwnerCardsService,
    PrepaidCardsService,
    BusinessCardsService,
    DebitCardsService,
    CardsListAdapterService,
    CardsListFactoryService,
  ],
})
export class CardsSharedModule { }
