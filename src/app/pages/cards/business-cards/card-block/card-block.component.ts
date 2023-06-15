import {KeyValue} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {
  CARDS,
  CARDS_BUSINESS_BLOCK,
  CARDS_PREPAID_CANCEL_AND_REPLACE,
} from 'app/@core/constants/pages-urls-constants';
import {CARDS_IMAGES, CARD_TYPE} from 'app/@core/model/dto/cards-enums';
import {DropdownControl} from 'app/@core/model/dto/control/dropdown-control';
import {SummaryItemControl} from 'app/@core/model/dto/control/sumery-item-control';
import {
  FormModel,
  FormResult,
  PageModel,
} from 'app/@core/model/dto/formModel';
import {
  BlockCardConfirmRequest,
  CardBlockValidateReueust,
  CardClosureConfirmRequest,
  CardClosureValidateRequest,
} from 'app/@core/model/rest/cards/common/closure-models';

import {BusinessCardsListModel} from 'app/@core/model/rest/cards/business-cards/list-res.model';
import {KeyValueModel} from 'app/@core/model/rest/common/key-value.model';
import {RequestValidate} from 'app/@core/model/rest/common/otp.model';
import {VerificationService} from 'app/@core/service/base/verification.service';
import {CardsCancelationService} from 'app/@core/service/cards/cards-cancelation/cards-cancelation-service';
import {Constants} from 'app/@core/service/cards/business-cards/business-cards-urls';
import {Utils} from 'app/@core/utility/Utils';
import {FormButtonClickOutput} from 'app/shared/form/form.component';
import {ButtonModel} from 'arb-design-library/model/button.model';
import {CardsBaseComponent} from '../../cards-base/cards-base.component';
import {CardDetailsFactoryService} from '../../cards-shared/card-details-factory.service';
import {
  cardTypeControl,
  operationControl,
  reasonTypeControl,
} from './card-block.controls';
import {BusinessCardsDetailsModel} from 'app/@core/model/rest/cards/business-cards/business-cards-models';
import {CardBlockRouteStateModel} from '../../cards-shared/card-details-route-state-model';
import {CancelationOperationTypes} from 'app/@core/service/cards/cards-cancelation/cards-cancelation-reasons';

@Component({
  selector: 'app-prepaid-cards-cancel',
  templateUrl: '../../cards-base/cards-base.component.html',
})
export class BusinessCardsBlockComponent
  extends CardsBaseComponent
  implements OnInit {
  successBackToNew!: ButtonModel;
  successBackToDash!: ButtonModel;

  card!: BusinessCardsListModel;
  businessCardDetails!: BusinessCardsDetailsModel | undefined;

  cardBlockSummaryForm!: FormModel;
  cardBlockForm!: FormModel;

  lostReasons!: KeyValueModel[];
  operationType: string | undefined = '';
  pageOperationText: any;

  constructor(
    private otpService: VerificationService,
    private cardsCancelationService: CardsCancelationService,
    private cardDetailsService: CardDetailsFactoryService
  ) {
    super();
    this.initiateCardDetails();
  }

  override onResultChanged(data: FormResult[]): void {
    let valid = true;
    data.forEach((item) => {
      valid = valid && item.valid;
    });
    this.endButtons[0].isDisable = !valid;
  }

  async initiateCardDetails() {
    const state: CardBlockRouteStateModel = this.router.getCurrentNavigation()
      ?.extras.state as CardBlockRouteStateModel;

    if (!state) {
      this.router.navigate(['cards']);
      return;
    }

    this.businessCardDetails = state.cardDetails as BusinessCardsDetailsModel;
    this.operationType = state.operationType;

    const storeCards =
      await this.cardDetailsService.getUserBusinessCardsFromStore();
    const storeCard = storeCards.find(
      (a) => a.cardNumber == this.businessCardDetails?.cardNum
    );

    if (!storeCard) {
      this.router.navigate(['cards']);
      return;
    }

    this.card = storeCard;
    this.initiatePageView();
  }

  getLookups() {
    this.cardsCancelationService
      .getLostReasons(CARD_TYPE.BUSINESS)
      .subscribe((models) => {
        for (let key of Object.keys(models)) {
          switch (key) {
            case 'businessCardsBlockReason':
              this.lostReasons = Utils.getModelList(models[key]);
              break;
          }
        }

        this.cardBlockForm.controls[
          'reasonTypeControl'
          ].controlOptions.options = this.lostReasons;
      });
  }

  initiatePageView() {
    this.pageOperationText =
      this.operationType == CancelationOperationTypes.BLOCK_OP_TYPE
        ? 'cards.cancel.block-title'
        : 'cards.block-replace-card';

    this.cardBlockSummaryForm = new FormModel({
      id: 'card-block-form',
      showDivider: true,
      controls: {
        cardTypeControl: new SummaryItemControl(
          cardTypeControl(this.card.cardNumber)
        ),
        operationControl: new SummaryItemControl(
          operationControl(`${this.pageOperationText}`)
        ),
      },
    });

    this.cardBlockForm = new FormModel({
      id: 'card-block-form',
      controls: {
        reasonTypeControl: new DropdownControl(reasonTypeControl),
      },
    });
    this.pages = [
      new PageModel(1, this.cardBlockSummaryForm, this.cardBlockForm),
    ];

    this.pageTitle = {
      id: 'CancelCardTitle',
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
        url: `/${CARDS}/${CARDS_BUSINESS_BLOCK}`,
      },
    ]);

    this.getLookups();
  }

  handleBack() {
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

  backToCards() {
    this.router.navigateByUrl(`${CARDS}`);
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case this.nextButton.id:
        this.moveToSummary();
        break;
      case this.proceedButton.id:
        this.validateCancelAndReplaceCard();
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

  validateCancelAndReplaceCard() {
    const reasonType: string = this.getControl(
      0,
      1,
      'reasonTypeControl'
    ).value?.value?.trim();
    const req: CardBlockValidateReueust = {
      businessCardsDetails: this.businessCardDetails,
      typeOperation: this.operationType,
      blockReason: reasonType,
    };
    this.cardsCancelationService
      .validateBlockBusinessCard(req, Constants.BUSINESS_CARD_VALIDATE_BLOCK)
      .subscribe({
        next: (validateRes) => {
          this.otpService
            .showVerification(validateRes.generateChallengeAndOTP)
            .subscribe((requestValidate: RequestValidate) => {
              this.confirm(requestValidate);
            });
        },
        error: (err) => {
        },
      });
  }

  confirm(requestValidate: RequestValidate) {
    const reasonType: string = this.getControl(
      0,
      1,
      'reasonTypeControl'
    ).value?.value?.trim();

    const request: BlockCardConfirmRequest = {
      businessCardsDetails: this.businessCardDetails,
      typeOperation: this.operationType,
      requestValidate: requestValidate,
    };

    this.cardsCancelationService
      .confirmBlockBusinessCard(request, Constants.BUSINESS_CARD_CONFIRM_BLOCK)
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
    ).value?.value?.trim();
    this.summary = {
      sections: [
        {
          title: {
            id: 'cards-block-summary-title',
            title: 'cards.cancel.card-info',
          },
          items: [
            {
              title: 'cards.cancel.business-card-type-name',
              image: CARDS_IMAGES.BUSINESS,
              subTitle: this.card.cardNumber,
            },
            {
              title: 'cards.cancel.operation',
              subTitle: this.pageOperationText,
            },
            {
              title: 'cards.cancel.block-reason',
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
      title: 'cards.cancel.block-success-title',
      subTitle: 'cards.cancel.block-success-sub-title',
      summary: {},
    };
  }
}
