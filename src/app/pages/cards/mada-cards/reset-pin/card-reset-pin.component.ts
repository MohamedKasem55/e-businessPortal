import { Component, OnInit } from '@angular/core';
import { CardsBaseComponent } from '../../cards-base/cards-base.component';
import { getDebitCardDetailsForm } from './card-reset-pin-control';
import { ResultModal } from 'app/@core/model/dto/result.modal';
import { ResponseException } from 'app/@core/service/base/responseException';
import { ActivatedRoute } from '@angular/router';
import { FormResult, PageModel } from 'app/@core/model/dto/formModel';
import { CryptoService } from 'app/@core/service/base/crypto.service';
import { VerificationService } from 'app/@core/service/base/verification.service';
import { RequestValidate } from 'app/@core/model/rest/common/otp.model';
import { FormButtonClickOutput } from '../../../../shared/form/form.component';
import { CardsResetPinValidateReqModel } from 'app/@core/model/rest/cards/common/reset-pin-validate-req.model';
import { DebitCardsListModel } from 'app/@core/model/rest/cards/debit-cards/list-res.model';
import { DebitCardsService } from 'app/@core/service/cards/debit-cards/debit-cards.service';
import {
  DebitResetPinCofnrimRequest,
  DebitResetPinValidateRes,
} from 'app/@core/model/rest/cards/debit-cards/reset-pint-models';

@Component({
  selector: 'app-card-reset-pin',
  templateUrl: '../../cards-base/cards-base.component.html',
  styleUrls: [],
})
export class DebitCardResetPinComponent
  extends CardsBaseComponent
  implements OnInit
{
  trackDeleteClickButtonEvent: boolean = false;
  newPin!: string;
  validateResponse!: DebitResetPinValidateRes;
  selectedIndex!: number;
  cardDetails!: DebitCardsListModel;

  constructor(
    private route: ActivatedRoute,
    private debitCardsService: DebitCardsService,
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
    this.cardDetails = state['cardDetails'] as DebitCardsListModel;

    this.pageTitle.id = 'card-reset-pin';
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
        getDebitCardDetailsForm(this.translate, this.cardDetails)
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
    if (
      this.getControl(0, 0, 'newPin').value &&
      this.getControl(0, 0, 'repeatedNewPin').value &&
      this.getControl(0, 0, 'newPin').value ===
        this.getControl(0, 0, 'repeatedNewPin').value
    ) {
      valid = true;
    } else {
      valid = false;
    }
    this.endButtons[0].isDisable = !valid;
  }

  validateResetPin() {
    this.newPin = this.getControl(0, 0, 'newPin').value;
    this.debitCardsService.validateResetPinRequest().subscribe({
      next: (res) => {
        this.validateResponse = res;

        this.otpService
          .showVerification(this.validateResponse.generateChallengeAndOTP)
          .subscribe((requestValidate: RequestValidate) => {
            this.debitCardsService
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
        this.summaryResult(true, error.ErrorResponse.errorDescription!, false);
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
  ): DebitResetPinCofnrimRequest {
    delete requestValidate.challengeNumber;
    delete requestValidate.challengeResponse;
    delete requestValidate.password;
    delete requestValidate.response;

    let confrimRequest: DebitResetPinCofnrimRequest = {
      cardNum: this.cardDetails.cardNum,
      cardSeqNum: this.cardDetails.cardSeqNum,
      prodType: this.cardDetails.prodType,
      acctNum: this.cardDetails.acctNum,
      pin: '****',
      newPIN: this.cryptoService.encryptRSA(this.newPin),
      requestValidate: requestValidate,
    };
    return confrimRequest;
  }

  override onButtonClick(formButtonClickOutPut: FormButtonClickOutput) {
    super.onButtonClick(formButtonClickOutPut);

    switch (formButtonClickOutPut.buttonId) {
      case 'Next':
        this.validateResetPin();
        break;
      case 'Back':
        this.location.back()
        break
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
