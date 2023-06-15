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
import {
  FormModel,
  FormResult,
  PageModel,
} from 'app/@core/model/dto/formModel';
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
  statusControl,
  enableOnlineControl,
  enableEcommerceControl,
  localLimitControl,
  internationalLimitControl,
  cardTitleControl,
  cardManagementTitleControl,
} from './card-configuration.controls';
import {
  CardBlockRouteStateModel,
  CardConfigurationRouteStateModel,
} from '../../cards-shared/card-details-route-state-model';
import {
  DebitCardsListModel,
  DebitCardPOSLimitsRequest,
  POsInternationalLimit,
  PosDomesticLimit,
  DebitCardsPOSLimitListRes,
  Limit,
  DebitCardChangeInternetRequest,
  DebitCardChangePOSLimitRequest,
} from 'app/@core/model/rest/cards/debit-cards/list-res.model';
import { Constants } from 'app/@core/service/cards/debit-cards/debit-cards-urls';
import { DebitCardsService } from 'app/@core/service/cards/debit-cards/debit-cards.service';
import { ActivatedRoute } from '@angular/router';
import { getCardStatus } from '../../cards-shared/cards-shared-controls';
import { SelectionControl } from 'app/@core/model/dto/control/selection-control';
import { EmptyControl } from 'app/@core/model/dto/control/empty-control';
import { LineCardControl } from 'app/@core/model/dto/control/line-card-control';
import { CardStatusPipe } from 'app/@core/pipe/card-status-pipe';
import { TitleControl } from 'app/@core/model/dto/control/title-control';

@Component({
  selector: 'app-debit-cards-cofig',
  templateUrl: '../../cards-base/cards-base.component.html',
})
export class DebitCardsConfigurationComponent
  extends CardsBaseComponent
  implements OnInit
{
  successBackToNew!: ButtonModel;
  successBackToDash!: ButtonModel;

  card!: DebitCardsListModel;

  cardConfigurationSummaryForm!: FormModel;
  cardConfigurationForm!: FormModel;

  lostReasons!: KeyValueModel[];
  operationType: string | undefined = '';
  pageOperationText: any;

  internationalLimt!: POsInternationalLimit;
  localLimit!: PosDomesticLimit;
  posLimitsLookupRes!: DebitCardsPOSLimitListRes;
  configState!: CardConfigurationRouteStateModel;
  ecommerceIsEnabled: boolean = false;

  constructor(
    private otpService: VerificationService,
    private activatedRoute: ActivatedRoute,
    private cardStatusPipe: CardStatusPipe,
    private debitCardsService: DebitCardsService
  ) {
    super();
  }

  override ngOnInit() {
    this.activatedRoute.data.subscribe(({ configState }) => {
      this.configState = configState;
      this.initiateCardDetails();
    });
  }

  async initiateCardDetails() {
    if (!this.configState?.cardDetails) {
      this.router.navigate(['cards']);
      return;
    }

    this.card = this.configState.cardDetails;
    if (this.configState.debitCardPOSLimitsRes?.pOsInternationalLimit)
      this.internationalLimt =
        this.configState.debitCardPOSLimitsRes?.pOsInternationalLimit;

    if (this.configState.debitCardPOSLimitsRes?.posDomesticLimit)
      this.localLimit =
        this.configState.debitCardPOSLimitsRes?.posDomesticLimit;

    this.initiatePageView();
  }

  getLookups() {
    let limitsReq: DebitCardPOSLimitsRequest = {
      cardNumber: this.card.cardNum,
      cardSeqNumber: this.card.cardSeqNum,
    };
    this.debitCardsService
      .getDebitCardsPOSLimitLookups(limitsReq)
      .subscribe((res) => {
        this.posLimitsLookupRes = res;

        this.cardConfigurationForm.controls[
          'localLimitControl'
        ].controlOptions.options = this.posLimitsLookupRes.debitCard.limits;

        this.cardConfigurationForm.controls[
          'internationalLimitControl'
        ].controlOptions.options = this.posLimitsLookupRes.debitCard.limits;

        this.setDefaultValues();
      });
  }

  setDefaultValues() {
    if (this.localLimit?.amount) {
      let localIsFound = false;
      this.posLimitsLookupRes.debitCard.limits.forEach((item) => {
        if (item.amount == this.localLimit?.amount) {
          this.getControl(0, 1, 'localLimitControl').setValue({
            amount: this.localLimit.amount,
            currency: this.localLimit.currency,
            displayText: this.localLimit.amount,
          });
        }
      });
    }

    if (this.internationalLimt?.amount) {
      this.posLimitsLookupRes.debitCard.limits.forEach((item) => {
        if (item.amount == this.internationalLimt?.amount) {
          this.getControl(0, 1, 'internationalLimitControl').setValue({
            amount: this.internationalLimt.amount,
            currency: this.internationalLimt.currency,
            displayText: this.internationalLimt.amount,
          });
        }
      });
    }
  }

  initiatePageView() {
    this.pageOperationText = 'cards.configuration.title';
    this.cardConfigurationSummaryForm = new FormModel({
      id: 'card-config-summary-form',
      showDivider: true,
      controls: {
        cardTitleControl: new TitleControl(cardTitleControl()),
        cardTypeControl: new LineCardControl(
          cardTypeControl(
            this.card.cardNum?.slice(this.card.cardNum.length - 4)
          )
        ),
        statusControl: new SummaryItemControl(
          statusControl(
            `${this.cardStatusPipe.transform(this.card.cardStatus)}`
          )
        ),
      },
    });

    this.cardConfigurationForm = new FormModel({
      id: 'card-config-form',
      controls: {
        cardManagementTitleControl: new TitleControl(cardManagementTitleControl()),
        enableOnlineControl: new SelectionControl(enableOnlineControl(false)),
        enableEcommerceControl: new SelectionControl(
          enableEcommerceControl(false)
        ),
        localLimitControl: new DropdownControl(localLimitControl()),
        internationalLimitControl: new DropdownControl(
          internationalLimitControl()
        ),
      },
    });

    this.pages = [
      new PageModel(
        1,
        this.cardConfigurationSummaryForm,
        this.cardConfigurationForm
      ),
    ];

    this.pageTitle = {
      id: 'ConfigCardTitle',
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
    this.registerChangeValueEvents();
  }

  registerChangeValueEvents() {
    this.getControl(0, 1, 'enableEcommerceControl').valueChanges.subscribe(
      (formValueChangeModel: any) => {
        this.ecommerceToggleChangeListener(formValueChangeModel.value);
      }
    );
  }

  override onResultChanged(formResult: FormResult[]) {
    if (this.endButtons.length > 0)
      this.endButtons[0].isDisable =
        !formResult[0].valid || !formResult[1].valid;
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

  ecommerceToggleChangeListener(value: boolean) {
    this.ecommerceIsEnabled = value;
    if (value) {
      this.getControl(0, 1, 'enableOnlineControl').enable();
    } else {
      this.getControl(0, 1, 'enableOnlineControl').setValue(false);
      this.getControl(0, 1, 'enableOnlineControl').disable();
    }
  }

  confirm() {
    const enableOnlineValue = this.getControl(
      0,
      1,
      'enableOnlineControl'
    ).value;

    const enableEcommerceValue = this.getControl(
      0,
      1,
      'enableEcommerceControl'
    ).value;

    if (enableEcommerceValue) {
      let request: DebitCardChangeInternetRequest = {
        cardNum: this.card.cardNum,
        cardSeqNum: this.card.cardSeqNum,
        enableECommerce: enableOnlineValue,
        prodType: this.card.prodType,
      };
      this.debitCardsService.changeDebitCardInternet(request).subscribe({
        next: (res) => {
          this.changeDebitCardPOSLimit();
        },
      });
    } else {
      this.changeDebitCardPOSLimit();
    }
  }

  changeDebitCardPOSLimit() {
    const localLimit: string = this.getControl(
      0,
      1,
      'localLimitControl'
    ).value?.amount?.trim();

    const internationalLimit: string = this.getControl(
      0,
      1,
      'internationalLimitControl'
    ).value?.amount?.trim();

    let request: DebitCardChangePOSLimitRequest = {
      atmDomesticLimit:
        this.configState.debitCardPOSLimitsRes?.atmDomesticLimit,
      atmInternationalLimit:
        this.configState.debitCardPOSLimitsRes?.atmInternationalLimit,
      atmsamaLimit: this.configState.debitCardPOSLimitsRes?.atmsamaLimit,
      cardNumber: this.card.cardNum,
      cardSeqNumber: this.card.cardSeqNum,
      depositLimit: this.configState.debitCardPOSLimitsRes?.depositLimit,
      posDomesticLimit: {
        amount: localLimit,
        currency: 'SAR',
      },
      posInternationalLimit: {
        amount: internationalLimit,
        currency: 'SAR',
      },
      posRefundLimit: this.configState.debitCardPOSLimitsRes?.posRefundLimit,
      possamaLimit: this.configState.debitCardPOSLimitsRes?.possamaLimit,
      transferLimit: this.configState.debitCardPOSLimitsRes?.transferLimit,
    };
    this.debitCardsService.changeDebitCardPOSLimit(request).subscribe({
      next: (res) => {
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
    const enableOnlineValue = this.getControl(
      0,
      1,
      'enableOnlineControl'
    ).value;

    const enableEcommerceValue = this.getControl(
      0,
      1,
      'enableEcommerceControl'
    ).value;

    const localLimit: string = this.getControl(
      0,
      1,
      'localLimitControl'
    ).value?.displayText?.trim();

    const internationalLimit: string = this.getControl(
      0,
      1,
      'internationalLimitControl'
    ).value?.displayText?.trim();
    const enableOnlineText = this.translate.instant(
      enableOnlineValue ? 'public.yes' : 'public.no'
    );
    const enableEcommerceTex = this.translate.instant(
      enableEcommerceValue ? 'public.yes' : 'public.no'
    );
    this.summary = {
      sections: [
        {
          items: [
            {
              title: 'cards.debit-card',
              image: CARDS_IMAGES.DEBIT,
              subTitle: this.card.cardNum,
            },
            {
              title: 'cards.card-status',
              subTitle: getCardStatus(this.card.cardStatus, true),
            },
            {
              title: 'cards.configuration.enable-online',
              subTitle: enableOnlineText,
            },
            {
              title: 'cards.configuration.enable-ecommerce',
              subTitle: enableEcommerceTex,
            },
            {
              title: 'cards.configuration.local-pos-limit',
              subTitle: localLimit,
            },
            {
              title: 'cards.configuration.international-pos-limit',
              subTitle: internationalLimit,
            },
          ],
        },
      ],
    };
  }
  fillSuccess() {
    this.result = {
      type: 'Success',
      title: 'cards.configuration.success-title',
      subTitle: 'cards.configuration.success-sub-title',
      summary: {},
    };
  }
}
