import { Component, OnInit } from '@angular/core';
import {
  CARDS,
  CARDS_PREPAID_CANCEL,
} from 'app/@core/constants/pages-urls-constants';
import { CARDS_IMAGES, CARD_TYPE } from 'app/@core/model/dto/cards-enums';
import { DropdownControl } from 'app/@core/model/dto/control/dropdown-control';
import { SummaryItemControl } from 'app/@core/model/dto/control/sumery-item-control';
import { TitleControl } from 'app/@core/model/dto/control/title-control';
import { FormModel, PageModel } from 'app/@core/model/dto/formModel';
import {
  CardClosureConfirmRequest,
  CardClosureValidateRequest,
  PrepaidConfirmStolenRequest,
  PrepaidValidateStolenRequest,
} from 'app/@core/model/rest/cards/common/closure-models';
import { PrepaidCardDetailsModel } from 'app/@core/model/rest/cards/prepaid-cards/details-res.model';

import { PrepaidCardsListModel } from 'app/@core/model/rest/cards/prepaid-cards/list-res.model';
import { KeyValueModel } from 'app/@core/model/rest/common/key-value.model';
import { RequestValidate } from 'app/@core/model/rest/common/otp.model';
import { VerificationService } from 'app/@core/service/base/verification.service';
import {
  CancelationReasons,
  CancelationReasonsKeys,
} from 'app/@core/service/cards/cards-cancelation/cards-cancelation-reasons';
import { CardsCancelationService } from 'app/@core/service/cards/cards-cancelation/cards-cancelation-service';
import { Constants } from 'app/@core/service/cards/prepaid-cards/prepaid-cards-urls';
import { Utils } from 'app/@core/utility/Utils';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { CardsBaseComponent } from '../../cards-base/cards-base.component';
import { CardDetailsFactoryService } from '../../cards-shared/card-details-factory.service';
import { cardTypeControl, operationControl, reasonTypeControl, titleControl1, titleControl2 } from './card-cancel.controls';

@Component({
  selector: 'app-prepaid-cards-cancel',
  templateUrl: '../../cards-base/cards-base.component.html',
})
export class PrepaidCardsCancelComponent
  extends CardsBaseComponent
  implements OnInit
{
  successBackToNew!: ButtonModel;
  successBackToDash!: ButtonModel;

  card!: PrepaidCardsListModel;
  lostReasons!: KeyValueModel[];

  cancelationReasonsKeys = CancelationReasonsKeys

  cardCancelForm!: FormModel;
  cardCancelSummaryForm!: FormModel;

  constructor(
    private otpService: VerificationService,
    private cardsCancelationService: CardsCancelationService,
    private cardDetailsService: CardDetailsFactoryService
  ) {
    super();
    this.initiateCardDetails();

  }

  async initiateCardDetails() {
    const state: PrepaidCardDetailsModel = this.router.getCurrentNavigation()
      ?.extras.state as PrepaidCardDetailsModel;

    if (!state) {
      this.router.navigate(['cards']);
      return;
    }

    const routeCard = state;
    const storeCards =
      await this.cardDetailsService.getUserPrepaidCardsFromStore();
    const cardDetails = storeCards.find(
      (a) => a.cardNumber == routeCard.cardNum
    );

    if (!cardDetails) {
      this.router.navigate(['cards']);
      return;
    }

    this.card = cardDetails;
    this.initiatePageView();
  }

  initiatePageView() {
    this.pageTitle = {
      id: 'CancelCardTitle',
      title: 'cards.cancel.title',
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
        text: 'cards.cancel.title',
        url: `/${CARDS}/${CARDS_PREPAID_CANCEL}`,
      },
    ]);

    this.cardCancelSummaryForm = new FormModel({
      id: 'card-cancel-form',
      showDivider: true,
      controls: {
        titleControl1: new TitleControl(titleControl1()),
        relatedControl: new SummaryItemControl(
          cardTypeControl(this.card.cardNumber)
        ),
        cycleAmountControl: new SummaryItemControl(
          operationControl(
            `${this.translate.instant('cards.cancel.title')}`
          )
        ),
      },
    });
    
    this.cardCancelForm = new FormModel({
      id: 'card-cancel-form',
      controls: {
        titleControl2: new TitleControl(titleControl2()),
        reasonTypeControl: new DropdownControl(reasonTypeControl),
      },
    });

    this.pages = [
      new PageModel(1, this.cardCancelSummaryForm, this.cardCancelForm),
    ];

    this.getLookups();
  }

  getLookups() {
    this.cardsCancelationService
      .getLostReasons(CARD_TYPE.PREPAID)
      .subscribe((models) => {
        for (let key of Object.keys(models)) {
          switch (key) {
            case 'prepaidCardsLostStolen':
              this.lostReasons = Utils.getModelList(models[key]);
              this.lostReasons.push({
                key: this.translate.instant('general.other'),
                value: 'other'
              })
              console.log(this.lostReasons);
              break;
          }
        }

        this.cardCancelForm.controls[
          'reasonTypeControl'
        ].controlOptions.options = this.lostReasons;
      });
  }

  backToCards() {
    this.router.navigateByUrl(`${CARDS}`);
  }

  handleBack() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.location.back();
        break;
      case 2:
        this.prepareSummary();
        this.stepperMoveBack();
        this.endButtons = [this.nextButton];
        break;
    }
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case this.nextButton.id:
        this.prepareSummary();
        this.stepperMoveNext();
        break;
      case this.confirmButton.id:
        this.handleCancelValidateReasonsCard();
        break;
      case this.backButton.id:
        this.handleBack();
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

  handleCancelValidateReasonsCard() {
    const reasonTypeControl: string = this.getControl(0, 1, 'reasonTypeControl')
      .value.key;

    switch (reasonTypeControl) {
      case this.cancelationReasonsKeys.lost:
      case this.cancelationReasonsKeys.stolen:
      case this.cancelationReasonsKeys.damaged:
        this.validatePrepaidCardStolenOrLost();
        break;
      default:
        this.validateCancelCard();
        break;
    }
  }

  validateCancelCard() {
    const req: CardClosureValidateRequest = {
      cardNumber: this.card.cardNumber,
      cardSeqNumber: this.card.cardSeqNumber,
      operation: CancelationReasons.close,
    };
    this.cardsCancelationService
      .validateCancelCard(req, Constants.PREPAID_CARD_VALIDATE_CANCEL)
      .subscribe({
        next: (validateRes) => {
          this.otpService
            .showVerification(validateRes.generateChallengeAndOTP)
            .subscribe((requestValidate: RequestValidate) => {
              this.confirm(requestValidate);
            });
        },
        error: (err) => {},
      });
  }

  confirm(requestValidate: RequestValidate) {
   
    const request: CardClosureConfirmRequest = {
      cardNumber: this.card.cardNumber,
      cardSeqNumber: this.card.cardSeqNumber,
      operation: CancelationReasons.close,
      requestValidate: requestValidate,
    };

    this.cardsCancelationService
      .confirmCancelCard(request, Constants.PREPAID_CARD_CONFIRM_CANCEL)
      .subscribe({
        next: async (res) => {
          this.moveToSuccess();
        },
      });
  }

  validatePrepaidCardStolenOrLost() {
    const reason: string = this.getControl(0, 1, 'reasonTypeControl').value
      .value;
    const validateReq: PrepaidValidateStolenRequest = {
      cardNumber: this.card.cardNumber,
      cardSeqNumber: this.card.cardSeqNumber,
      deactivationReason: reason,
    };
    this.cardsCancelationService
      .validatePrepaidCardStolenOrLost(validateReq)
      .subscribe({
        next: (validateRes) => {
          this.otpService
            .showVerification(validateRes.generateChallengeAndOTP)
            .subscribe((requestValidate: RequestValidate) => {
              this.confirmStolen(requestValidate, validateReq);
            });
        },
        error: (err) => {},
      });
  }

  confirmStolen(
    requestValidate: RequestValidate,
    validateReq: PrepaidValidateStolenRequest
  ) {
    const request: PrepaidConfirmStolenRequest = {
      cardNumber: this.card.cardNumber,
      cardSeqNumber: this.card.cardSeqNumber,
      deactivationReason: validateReq.deactivationReason,
      requestValidate: requestValidate,
    };

    this.cardsCancelationService.confirmPrepaidCardStolen(request).subscribe({
      next: async (res) => {
        this.moveToSuccess();
      },
    });
  }

  prepareSummary() {
    this.fillSummary();
    this.endButtons = [this.confirmButton];
    
  }

  private fillSummary() {
    const reason: string = this.getControl(0, 1, 'reasonTypeControl').value
      .value;
    this.summary = {
      sections: [
        {
          title: {
            id: 'cards-cancel-summary-title',
            title: 'cards.cancel.card-info',
          },
          items: [
            {
              title: 'cards.cancel.prepaid-card-type-name',
              image: CARDS_IMAGES.PREPAID,
              subTitle: this.card.cardNumber,
            },
            {
              title: 'cards.cancel.operation',
              subTitle: 'cards.cancel.title',
            },
            {
              title: 'cards.cancel.reason',
              subTitle: reason,
            },
          ],
        },
      ],
    };
  }

  moveToSuccess() {
    this.fillSuccess();
    this.endButtons = [this.backToDashboardButton, this.backToCardsButton];
    this.startButtons = [];
    this.stepperMoveNext();
  }

  fillSuccess() {
    this.result = {
      type: 'Success',
      title: 'cards.cancel.success-title',
      summary: {},
    };
  }
}
