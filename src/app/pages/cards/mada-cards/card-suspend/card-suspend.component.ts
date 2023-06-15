import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  CARDS,
  CARDS_BUSINESS_BLOCK,
  CARDS_DEBIT_SUSPEND,
  CARDS_PREPAID_CANCEL_AND_REPLACE,
} from 'app/@core/constants/pages-urls-constants';
import { CARDS_IMAGES, CARD_TYPE } from 'app/@core/model/dto/cards-enums';
import { DropdownControl } from 'app/@core/model/dto/control/dropdown-control';
import { SummaryItemControl } from 'app/@core/model/dto/control/sumery-item-control';
import { FormModel, FormResult, PageModel } from 'app/@core/model/dto/formModel';
import { SuspendDebitCardRequest } from 'app/@core/model/rest/cards/common/closure-models';

import { KeyValueModel } from 'app/@core/model/rest/common/key-value.model';
import { VerificationService } from 'app/@core/service/base/verification.service';
import { CardsCancelationService } from 'app/@core/service/cards/cards-cancelation/cards-cancelation-service';
import { Utils } from 'app/@core/utility/Utils';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { CardsBaseComponent } from '../../cards-base/cards-base.component';
import { CardDetailsFactoryService } from '../../cards-shared/card-details-factory.service';
import {
  cardTypeControl,
  operationControl,
  reasonTypeControl,
} from './card-suspend.controls';
import { CardBlockRouteStateModel } from '../../cards-shared/card-details-route-state-model';
import { DebitCardsListModel } from 'app/@core/model/rest/cards/debit-cards/list-res.model';
import { Constants } from 'app/@core/service/cards/debit-cards/debit-cards-urls';

@Component({
  selector: 'app-prepaid-cards-cancel',
  templateUrl: '../../cards-base/cards-base.component.html',
})
export class DebitCardsSuspendComponent
  extends CardsBaseComponent
  implements OnInit
{
  successBackToNew!: ButtonModel;
  successBackToDash!: ButtonModel;

  card!: DebitCardsListModel;

  cardBlockSummaryForm!: FormModel;
  cardBlockForm!: FormModel;

  lostReasons!: KeyValueModel[];
  operationType: string | undefined = '';
  pageOperationText: any;

  suspendReasonList: any[] = [
    {
      displayText: this.translate.instant('cards.cancel.card-lost'),
      value: '01',
    },
    {
      displayText: this.translate.instant('cards.cancel.card-stolen'),
      value: '02',
    },
  ];

  constructor(
    private otpService: VerificationService,
    private cardsCancelationService: CardsCancelationService
  ) {
    super();
    this.initiateCardDetails();
  }

  override onResultChanged(data: FormResult[]): void {
    let valid = true;
    data.forEach(item => {
      valid = valid && item.valid;
    })
    this.endButtons[0].isDisable = !valid;
  }

  async initiateCardDetails() {
    const state: CardBlockRouteStateModel = this.router.getCurrentNavigation()
      ?.extras.state as CardBlockRouteStateModel;

    if (!state) {
      this.router.navigate(['cards']);
      return;
    }

    this.card = state.cardDetails as DebitCardsListModel;

    this.initiatePageView();
  }

  getLookups() {
    this.lostReasons = Utils.getModelList(this.suspendReasonList);

    this.cardBlockForm.controls['reasonTypeControl'].controlOptions.options =
      this.suspendReasonList;
  }

  initiatePageView() {
    this.pageOperationText = 'cards.cancel.suspend-title';
    this.cardBlockSummaryForm = new FormModel({
      id: 'card-suspend-form',
      showDivider: true,
      controls: {
        cardTypeControl: new SummaryItemControl(
          cardTypeControl(this.card.cardNum)
        ),
        operationControl: new SummaryItemControl(
          operationControl(`${this.pageOperationText}`)
        ),
      },
    });

    this.cardBlockForm = new FormModel({
      id: 'card-suspend-form',
      controls: {
        reasonTypeControl: new DropdownControl(reasonTypeControl),
      },
    });
    this.pages = [
      new PageModel(1, this.cardBlockSummaryForm, this.cardBlockForm),
    ];

    this.pageTitle = {
      id: 'SuspendCardTitle',
      title: this.pageOperationText,
      type: 'Page',
      stepper: {
        steps: ['', '', ''],
        stepCounter: 1,
        stepText: 'public.step',
        ofText: 'public.of',
      },
    };

    this.startButtons = [this.backButton];
    this.nextButton.isDisable = false;
    this.endButtons = [this.nextButton];

    this.setBreadcrumb([
      {
        text: 'cards.cards',
        url: `/cards`,
      },
      {
        text: this.pageOperationText,
        url: `/${CARDS}/${CARDS_DEBIT_SUSPEND}`,
      },
    ]);

    this.getLookups();
  }

  backToCards() {
    this.router.navigateByUrl(`${CARDS}`);
  }

  handleBack(){
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.location.back();
        break;
      case 2:
        this.stepperMoveBack();
        this.fillSummary();
        this.endButtons = [this.nextButton];
        break;
    }
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case this.nextButton.id:
        this.moveToSummary();
        break;
      case this.proceedButton.id:
        this.confirm();
        break;
      case this.backButton.id:
       this.handleBack()
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

  confirm() {
    const reasonType: string = this.getControl(
      0,
      1,
      'reasonTypeControl'
    ).value?.value?.trim();

    const request: SuspendDebitCardRequest = {
      acctNum: this.card.acctNum,
      cardNum: this.card.cardNum,
      cardSeqNum: this.card.cardSeqNum,
      prodType: this.card.prodType,
      suspendReason: reasonType,
    };

    this.cardsCancelationService
      .confirmSuspenseDebitCard(request, Constants.DEBIT_CARDS_SUSPEND)
      .subscribe({
        next: async (res) => {
          this.moveToSuccess();
        },
      });
  }

  moveToSummary() {
    this.summary = {};
    this.fillSummary();
    this.endButtons = [];
    this.stepperMoveNext();
    this.endButtons = [this.proceedButton];
  }
  moveToSuccess() {
    this.fillSuccess();
    this.endButtons = [this.backToDashboardButton, this.backToCardsButton];
    this.startButtons = [];
    this.stepperMoveNext();
  }

  fillSummary() {
    const reasonType: string = this.getControl(
      0,
      1,
      'reasonTypeControl'
    ).value?.displayText?.trim();
    this.summary = {
      sections: [
        {
          title: {
            id: 'cards-suspend-summary-title',
            title: 'cards.cancel.card-info',
          },
          items: [
            {
              title: 'cards.cancel.debit-card-type-name',
              image: CARDS_IMAGES.DEBIT,
              subTitle: this.card.cardNum,
            },
            {
              title: 'cards.cancel.operation',
              subTitle: this.pageOperationText,
            },
            {
              title: 'cards.cancel.suspend-reason',
              subTitle: reasonType,
            },
          ],
        },
      ],
    };
  }
  fillSuccess() {
    this.result = {
      type: 'Success',
      title: 'cards.cancel.suspend-success-title',
      subTitle: 'cards.cancel.suspend-success-sub-title',
      summary: {},
    };
  }
}
