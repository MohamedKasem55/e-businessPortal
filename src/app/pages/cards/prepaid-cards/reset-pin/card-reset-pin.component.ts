import { Component, OnInit } from '@angular/core';
import { CardsBaseComponent } from '../../cards-base/cards-base.component';
import { getPrepaidCardDetailsForm } from './card-reset-pin-control';
import { ResultModal } from 'app/@core/model/dto/result.modal';
import { ResponseException } from 'app/@core/service/base/responseException';
import { ActivatedRoute } from '@angular/router';
import { FormResult, PageModel } from 'app/@core/model/dto/formModel';
import { PrepaidCardsService } from 'app/@core/service/cards/prepaid-cards/prepaid-cards.service';
import { CryptoService } from 'app/@core/service/base/crypto.service';
import { VerificationService } from 'app/@core/service/base/verification.service';
import { CardsResetPinValidateResModel } from 'app/@core/model/rest/cards/common/reset-pin-validate-res.model';
import { RequestValidate } from 'app/@core/model/rest/common/otp.model';
import { PrepaidCardDetailsModel } from 'app/@core/model/rest/cards/prepaid-cards/details-res.model';
import { FormButtonClickOutput } from '../../../../shared/form/form.component';
import { CARD_TYPE } from 'app/@core/model/dto/cards-enums';
import { OwnerCardDetailsModel } from 'app/@core/model/rest/cards/onwer-cards/details-res.model';
import { CardsResetPinValidateReqModel } from 'app/@core/model/rest/cards/common/reset-pin-validate-req.model';
import { CardsResetPinConfirmReqModel } from 'app/@core/model/rest/cards/common/reset-pin-confirm-req.model';

@Component({
  selector: 'app-card-reset-pin',
  templateUrl: '../../cards-base/cards-base.component.html',
  styleUrls: [],
})
export class PrepaidCardResetPinComponent
  extends CardsBaseComponent
  implements OnInit
{
  trackDeleteClickButtonEvent: boolean = false;
  newPin!: string;
  validateResponse!: CardsResetPinValidateResModel;
  selectedIndex!: number;
  cardDetails!: PrepaidCardDetailsModel;

  constructor(
    private route: ActivatedRoute,
    private prepaidCardsService: PrepaidCardsService,
    private cryptoService: CryptoService,
    private otpService: VerificationService
  ) {
    super();

    this.setBreadcrumb([
      {
        text: 'cards.cards',
        url: 'cards',
      },
      {
        text: 'cards.card-info',
        url: 'cards/details',
      },
      {
        text: 'cards.reset-pin',
        url: '',
      },
    ]);

    this.initiatePage();
  }

  private initiatePage() {
    const state = this.router.getCurrentNavigation()?.extras.state;

    if (!state) {
      this.router.navigate(['cards']);
      return;
    }
    this.cardDetails = state['cardDetails'] as PrepaidCardDetailsModel;

    this.pageTitle.id = 'complete-details';
    this.pageTitle.title = 'cards.reset-pin';
  }

  override ngOnInit(): void {
    super.ngOnInit();
    if (!this.cardDetails.cardStatus) {
      this.router.navigateByUrl('/cards/details');
    }
    this.drawPage();
  }

  drawPage() {
    this.pages = [];
    this.pages = this.pages = [
      new PageModel(
        1,
        getPrepaidCardDetailsForm(this.translate, this.cardDetails)
      ),
    ];
    this.nextButton.isDisable = true;
    setTimeout(() => {
      let input = document.getElementById('otp1');
      input?.focus();
    }, 100);
  }

  override onResultChanged(data: FormResult[]): void {
    let valid = true;
    let newPin = String(this.getControl(0, 0, 'newPin').value);
    let repeatedNewPin = String(
      this.getControl(0, 0, 'repeatedNewPin').value
    );
    if (
      newPin === repeatedNewPin &&
      newPin.length === 4 &&
      repeatedNewPin.length === 4
    ) {
      valid = true;
    } else {
      valid = false;
    }
    this.endButtons[0].isDisable = !valid;
  }

  validateResetPin() {
    this.newPin = this.getControl(0, 0, 'newPin').value;
    this.prepaidCardsService
      .validateResetPinRequest(this.buildValidateResetPinReq())
      .subscribe({
        next: (res) => {
          this.validateResponse = res;

          this.otpService
            .showVerification(this.validateResponse.generateChallengeAndOTP)
            .subscribe((requestValidate: RequestValidate) => {
              this.prepaidCardsService
                .confirmResetPinRequest(
                  this.buildConfirmResetPinReq(requestValidate)
                )
                .subscribe({
                  next: (res) => {
                    this.summaryResult(false, '', false);
                  },
                  error: (error: ResponseException) => {
                    this.summaryResult(
                      true,
                      error.ErrorResponse.errorDescription!,
                      false
                    );
                  },
                });
            });
        },
        error: (error: ResponseException) => {
          this.summaryResult(
            true,
            error.ErrorResponse.errorDescription!,
            false
          );
        },
      });
  }

  buildValidateResetPinReq(): CardsResetPinValidateReqModel {
    return {
      cardSeqNumber: this.cardDetails.cardSeqNum,
      newPinNumber: this.cryptoService.encryptRSA(this.newPin),
      typeOperation: '1',
    };
  }

  buildConfirmResetPinReq(
    requestValidate: RequestValidate
  ): CardsResetPinConfirmReqModel {
    delete requestValidate.challengeNumber;
    delete requestValidate.challengeResponse;
    delete requestValidate.password;
    delete requestValidate.response;
    return {
      cardNumber: this.cardDetails.cardNum,
      cardSeqNumber: this.cardDetails.cardSeqNum,
      oldPinNumber: '****',
      newPinNumber: this.cryptoService.encryptRSA(this.newPin),
      typeOperation: '1',
      requestValidate: requestValidate,
    };
  }

  override onButtonClick(formButtonClickOutPut: FormButtonClickOutput) {
    super.onButtonClick(formButtonClickOutPut);
    console.log('On button click' + formButtonClickOutPut.buttonId);
    switch (formButtonClickOutPut.buttonId) {
      case 'Next':
        this.validateResetPin();
        break;
      case 'Back':
        this.location.back();
        break;
      case 'back-to-cards-btn':
        void this.router.navigate(['/cards']);
        break;
      case 'back-to-dashboard-btn':
        void this.router.navigate(['/dashboard']);
        break;
    }
  }

  summaryResult(error: boolean, errorMessage: string, usedModelValue: boolean) {
    this.stepperMoveNext();
    this.stepperMoveNext();
    this.endButtons = [this.backToDashboardButton, this.backToCardsButton];
    this.startButtons = [];
    this.summary = {};
    this.result = error
      ? this.fillErrorResult(errorMessage)
      : this.fillSuccessResult(usedModelValue);
    window.scrollTo(0, 0);
  }

  fillSuccessResult(usedModelValue: boolean): ResultModal {
    return {
      type: 'Success',
      title: this.translate.instant('cards.reset-pin-successfully'),
      subTitle: this.translate.instant('cards.reset-pin-applied'),
      summary: undefined,
    };
  }

  fillErrorResult(errString: string): ResultModal {
    return {
      type: 'Error',
      title: errString,
      summary: undefined,
    };
  }
}
