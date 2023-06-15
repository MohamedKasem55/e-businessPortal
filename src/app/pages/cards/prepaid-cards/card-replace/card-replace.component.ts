import { Component, OnInit } from '@angular/core';
import { SEC_LVL_ST } from 'app/@core/constants/consts';
import {
  CARDS,
  CARDS_PREPAID_CANCEL_AND_REPLACE,
} from 'app/@core/constants/pages-urls-constants';
import { CARDS_IMAGES, CARD_TYPE } from 'app/@core/model/dto/cards-enums';
import { DropdownControl } from 'app/@core/model/dto/control/dropdown-control';
import { SummaryItemControl } from 'app/@core/model/dto/control/sumery-item-control';
import {
  TitleControl,
  TitleControlOptions,
} from 'app/@core/model/dto/control/title-control';
import { FormModel, PageModel } from 'app/@core/model/dto/formModel';
import {
  CardClosureConfirmRequest,
  CardClosureValidateRequest,
  PrepaidConfirmClosureRequest,
  PrepaidConfirmReplaceRequest,
  PrepaidConfirmStolenRequest,
  PrepaidValidateClosureRequest,
  PrepaidValidateReplaceRequest,
  PrepaidValidateReplaceRes,
  PrepaidValidateStolenRequest,
} from 'app/@core/model/rest/cards/common/closure-models';
import { PrepaidCardDetailsModel } from 'app/@core/model/rest/cards/prepaid-cards/details-res.model';

import { PrepaidCardsListModel } from 'app/@core/model/rest/cards/prepaid-cards/list-res.model';
import { FutureSecurityLevelsDtolist } from 'app/@core/model/rest/common/batchResponse';
import { KeyValueModel } from 'app/@core/model/rest/common/key-value.model';
import { RequestValidate } from 'app/@core/model/rest/common/otp.model';
import { VerificationService } from 'app/@core/service/base/verification.service';
import { CancelationReasons, CancelationReasonsKeys } from 'app/@core/service/cards/cards-cancelation/cards-cancelation-reasons';
import { CardsCancelationService } from 'app/@core/service/cards/cards-cancelation/cards-cancelation-service';
import { Constants } from 'app/@core/service/cards/prepaid-cards/prepaid-cards-urls';
import { Utils } from 'app/@core/utility/Utils';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { CardsBaseComponent } from '../../cards-base/cards-base.component';
import { CardDetailsFactoryService } from '../../cards-shared/card-details-factory.service';
import {
  cardTypeControl,
  operationControl,
  reasonTypeControl,
  titleControl1,
  titleControl2,
} from './card-replace.controls';

@Component({
  selector: 'app-prepaid-cards-cancel-replace',
  templateUrl: '../../cards-base/cards-base.component.html',
})
export class PrepaidCardsCancelReplaceComponent
  extends CardsBaseComponent
  implements OnInit
{
  successBackToNew!: ButtonModel;
  successBackToDash!: ButtonModel;

  card!: PrepaidCardsListModel;

  cardCancelForm!: FormModel;
  cardCancelSummaryForm!: FormModel;
  lostReasons!: KeyValueModel[];
  validateReplaceResponse!: PrepaidValidateReplaceRes;
  isPending: boolean = false;

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
      title: 'cards.cancel.cancel-replace-title',
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
        text: 'cards.cancel.cancel-replace-title',
        url: `/${CARDS}/${CARDS_PREPAID_CANCEL_AND_REPLACE}`,
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
            `${this.translate.instant('cards.cancel.cancel-replace-title')}`
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

  handleBack(){
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.location.back();
        break;
      case 2:
        this.stepperMoveBack();
        this.endButtons = [this.nextButton];
        break;
    }
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case this.nextButton.id:
        this.moveToSummary();
        break;
      case this.confirmButton.id:
        this.validateReplace()
        break;
      case this.proceedButton.id:
        this.confirmReplace();
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


  validateReplace() {
    const validateReq: PrepaidValidateReplaceRequest = {
      cardNumber: this.card.cardNumber,
      cardSeqNumber: this.card.cardSeqNumber,
    };
    this.cardsCancelationService
      .validatePrepaidCardReplace(validateReq)
      .subscribe({
        next: (validateRes) => {
          this.handleValidateRequestResponse(validateRes);
        },
        error: (err) => {},
      });
  }

  handleValidateRequestResponse(res: PrepaidValidateReplaceRes) {

    this.validateReplaceResponse = res;

    if(!this.validateReplaceResponse.batchListsContainer){
      this.handleProcessStatus()
      return
    }

    let futureStatus = '';
    if (this.validateReplaceResponse.batchListsContainer.toProcess?.length > 0)
      futureStatus =
        this.validateReplaceResponse.batchListsContainer?.toProcess[0]
          ?.futureStatus;
    else if (
      this.validateReplaceResponse.batchListsContainer?.toAuthorize?.length
    )
      futureStatus =
        this.validateReplaceResponse.batchListsContainer?.toAuthorize[0]
          .futureStatus;

    switch (futureStatus) {
      case SEC_LVL_ST.PROCESS:
        this.handleProcessStatus();
        break;
      case SEC_LVL_ST.PENDING:
        this.handlePendingStatus();
        break;
      default:
        break;
    }
  }

  handleProcessStatus() {
    if (
      this.validateReplaceResponse.generateChallengeAndOTP &&
      this.validateReplaceResponse.generateChallengeAndOTP.typeAuthentication
    )
      this.showOtp();
    else this.confirmReplace();
  }

  private showOtp() {
    if (this.validateReplaceResponse) {
      this.otpService
        .showVerification(
          this.validateReplaceResponse.generateChallengeAndOTP
        )
        .subscribe((requestValidate: RequestValidate | undefined) => {
          this.confirmReplace(requestValidate);
        });
    }
  }

  private handlePendingStatus() {
    this.isPending = true;
    let secList: FutureSecurityLevelsDtolist[] = [];
    if (
      this.validateReplaceResponse?.batchListsContainer &&
      this.validateReplaceResponse?.batchListsContainer?.toProcess
        ?.length > 0
    ) {
      secList =
        this.validateReplaceResponse.batchListsContainer.toProcess[0].futureSecurityLevelsDTOList.map(
          (e) => {
            let item: FutureSecurityLevelsDtolist = {
              auditStatus: e.auditStatus,
              batchSecurityPk: e.auditStatus,
              level: e.level,
              pdfStatus: e.pdfStatus,
              status: e.status,
              updateDate: e.updateDate,
              userPk: e.userPk,
              updater: e.updater ?? '',
            };
            return item;
          }
        );
    } else if (
      this.validateReplaceResponse?.batchListsContainer &&
      this.validateReplaceResponse?.batchListsContainer?.toAuthorize
        ?.length
    ) {
      secList =
        this.validateReplaceResponse.batchListsContainer.toAuthorize[0].futureSecurityLevelsDTOList.map(
          (e) => {
            let item: FutureSecurityLevelsDtolist = {
              auditStatus: e.auditStatus,
              batchSecurityPk: e.auditStatus,
              level: e.level,
              pdfStatus: e.pdfStatus,
              status: e.status,
              updateDate: e.updateDate,
              userPk: e.userPk,
              updater: e.updater ?? '',
            };
            return item;
          }
        );
    }

    const summarySection = Utils.getCurrentLevelAndNextLevelSummarySection(
      this.translate,
      secList
    );
    this.summary.sections?.push(summarySection);
    this.endButtons = [this.proceedButton];
  }

  confirmReplace(requestValidate?: RequestValidate) {
    const request: PrepaidConfirmReplaceRequest = {
      cardNumber: this.card.cardNumber,
      cardSeqNumber: this.card.cardSeqNumber,
    };

    if (requestValidate) request.requestValidate = requestValidate;

    this.cardsCancelationService.confirmPrepaidCardReplace(request).subscribe({
      next: async (res) => {
        this.moveToSuccess();
      },
    });
  }

  moveToSummary() {
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
              subTitle: 'cards.cancel.cancel-replace-title',
            },
            {
              title: 'cards.cancel.replace-reason',
              subTitle: reason,
            },
          ],
        },
      ],
    };
    this.endButtons = [this.confirmButton];
    this.stepperMoveNext();
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
      title: 'cards.cancel.cancel-replace.success-title',
      subTitle: 'cards.cancel.cancel-replace.success-sub-title',
      summary: {},
    };
  }
}
