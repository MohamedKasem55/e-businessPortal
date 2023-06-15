import {Component, OnInit} from '@angular/core';
import {CARDS_IMAGES} from 'app/@core/model/dto/cards-enums';
import {PrepaidCardsService} from 'app/@core/service/cards/prepaid-cards/prepaid-cards.service';
import {ButtonModel} from 'arb-design-library/model/button.model';
import {GenericFeatureListModel} from 'arb-design-library/model/generic-feature-list.model';
import {lastValueFrom, take} from 'rxjs';
import {CardsBaseComponent} from './../cards-base/cards-base.component';
import {FormButtonClickOutput} from "../../../shared/form/form.component";
import {CARDS_DEBIT_APPLY_NEW} from 'app/@core/constants/pages-urls-constants';
import {AuthenticationUtils} from "../../../@core/utility/authentication-utils";

@Component({
  selector: 'app-apply-new-card',
  templateUrl: './apply-new-card.component.html',
})
export class ApplyNewCardComponent extends CardsBaseComponent implements OnInit {
  applyNow: ButtonModel= {
    id: '1',
    text: 'Apply Now',
    type: 'outLine'
  };
  cardsList: GenericFeatureListModel[] = [];

  selectedCardId: string = 'prepaid-card-request';

  constructor(
    private prepaidCardService: PrepaidCardsService,
  ) {
    super();
    this.setBreadcrumb([
      {
        text: 'cards.cards',
        url: '/cards',
      },
      { text: 'cards.new-card.new-card', url: '' },
    ]);
  }

  override ngOnInit(): void {
    this.pageTitle.stepper!.steps = ['', '', '', '', ''];
    this.endButtons[0].isDisable = true;
    this.loadCards();
  }

  loadCards() {
    if (AuthenticationUtils.hasAccess('RequestNewPrepaidCard')) {
      this.cardsList.push({
        id:'prepaid-card-request',
        cardImg: CARDS_IMAGES.PREPAID_EXPLORE,
        title: 'cards.prepaid-cards',
        cardTitle: 'cards.free',
        description: '',
        features: [
          {
            icon: "arb-icon-loopArrowRight fs-4 color-arb-secondaryText",
            text: "financial-products.eprepaid-info1"
          },
          {
            icon: "arb-icon-withdrawalMoney color-arb-secondaryText",
            text: "financial-products.eprepaid-info2"
          }, {
            icon: "arb-icon-wallet fs-4 color-arb-secondaryText",
            text:"financial-products.eprepaid-info3"
          },
          {
            icon: "arb-icon-card fs-4 color-arb-secondaryText",
            text: "financial-products.eprepaid-info4"
          }
        ],
        featureButton: this.applyNow,
      });
    }
    if (AuthenticationUtils.hasAccess('RequestNewDebitCard')) {
      this.cardsList.push({
        id:'mada-card-request',
        cardImg: CARDS_IMAGES.DEBIT_EXPLORE,
        title: 'cards.debit-card',
        cardTitle: 'cards.free',
        description: '',
        features: [
          {
            icon: "arb-icon-card3Dots fs-4 color-arb-secondaryText",
            text: "financial-products.credit-card-info1"
          },
          {
            icon: "arb-icon-insuranceSharp fs-4 color-arb-secondaryText",
            text: "financial-products.credit-card-info2"
          }, {
            icon: "arb-icon-clockArrowsRight fs-4 color-arb-secondaryText",
            text: "financial-products.credit-card-info3"
          },
          {
            icon: "arb-icon-userSaud fs-4 color-arb-secondaryText",
            text: "financial-products.credit-card-info4"
          }
        ],
        featureButton: this.applyNow,
      });
    }
  }

  onBackClick(backId: string): void {
    if (backId === 'arrowTitle') {
      this.goBack();
    }
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'Next':
        this.nextClick()
        break;
      case 'Back':
        this.goBack();
        break;
    }
  }

  async checkEligibality() {
    try {
      return await lastValueFrom(
        this.prepaidCardService
        .checkRequestNewPrepaidEligibality()
        .pipe(take(1))
      );
    } catch (error) {
      // TODO: unselect card id
    }
  }

  nextClick() {


  }

  doApplyNow(cardId: string): void {
    if (cardId === 'prepaid-card-request') {
      this.checkEligibality().then(res => {
        if (res) {
          this.router.navigate(["/cards/request-prepaid"]);
        }
      });
    }

    if (cardId === 'mada-card-request') {
      this.router.navigate([`/cards/${CARDS_DEBIT_APPLY_NEW}`]);
    }
  }

}
