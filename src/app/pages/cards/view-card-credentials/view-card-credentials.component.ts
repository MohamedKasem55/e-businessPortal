import { DatePipe } from '@angular/common';
import { Component, Injectable, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CARDS_IMAGES, CARD_TYPE } from 'app/@core/model/dto/cards-enums';
import { FormModel } from 'app/@core/model/dto/formModel';
import { PopupOutputModel } from 'app/@core/model/dto/popup.model';
import { CardCredentialOtpVerificationReqModel } from 'app/@core/model/rest/cards/card-details/card-details-credential-validate-req.model';
import { CardCredentialOtpVerificationResModel } from 'app/@core/model/rest/cards/card-details/card-details-credential-validate-res.model';
import {
  PrepaidCardDetailsModel,
  PrepaidCardsDetailsResponseModel,
} from 'app/@core/model/rest/cards/prepaid-cards/details-res.model';
import { RequestValidate } from 'app/@core/model/rest/common/otp.model';
import { CryptoService } from 'app/@core/service/base/crypto.service';
import { PopupService } from 'app/@core/service/base/popup.service';
import { VerificationService } from 'app/@core/service/base/verification.service';
import { CardDetailsCredentialsService } from 'app/@core/service/cards/card-details-credentials/card-details-credentials.service';
import { Subscription, timer } from 'rxjs';
import { initiateCredentialDetailsForm } from './view-card-credential-control';

@Injectable()
export class CardCredentialComponent implements OnInit {
  CardCredentialOtpVerificationReqModel!: CardCredentialOtpVerificationReqModel;
  defaultSeconds: number = 200;
  subscription!: Subscription;
  requestValidate!: RequestValidate;
  cardCredentialsDetailsForm!: FormModel;
  currentCardType!: string;
  cardImage!: string;

  constructor(
    private otpService: VerificationService,
    private popupService: PopupService,
    private cardCredentialService: CardDetailsCredentialsService,
    private datePipe: DatePipe,
    private cryptoService: CryptoService
  ) {}

  ngOnInit(): void {}

  buildCredentialView(cardCredReq: CardCredentialOtpVerificationReqModel, cardType: string){
    this.setTimerDefaultValue();
    this.initiateCardCredentialModal();
    this.setCredentialPopUpImage(cardType);
    this.setCardCredentialOtpVerificationReqModel(cardCredReq);
    this.sendCardCredentialsOtpAndShowVerifyPopup();
  }

  private initiateCardCredentialModal() {

    this.cardCredentialsDetailsForm = initiateCredentialDetailsForm();
  }
  private setTimerDefaultValue() {
    this.defaultSeconds = 120;
  }

  private setCardCredentialOtpVerificationReqModel(
    CardCredentialOtpVerificationReqModel: CardCredentialOtpVerificationReqModel
  ) {
    this.CardCredentialOtpVerificationReqModel =
      CardCredentialOtpVerificationReqModel;
  }

  private setCredentialPopUpImage(cardType: string) {
    switch (cardType) {
      case CARD_TYPE.BUSINESS:
        this.cardImage = CARDS_IMAGES.BUSINESS;
        break;
      case CARD_TYPE.PREPAID:
        this.cardImage = CARDS_IMAGES.PREPAID;
        break;
    }
  }

  private sendCardCredentialsOtpAndShowVerifyPopup() {
    this.cardCredentialService.sendCardCredentialsOtp().subscribe((res) => {
      res.generateChallengeAndOTP.timeToLive = 30;
      this.otpService
        .showVerification(res.generateChallengeAndOTP)
        .subscribe((requestValidate: RequestValidate) => {
          this.requestValidate = requestValidate;
          this.showViewCredentialPopup();
        });
    });
  }

  private showViewCredentialPopup() {
    this.cardCredentialService
      .validateCardCredentialOtp(this.buildReqForValidOtpCardDetails())
      .subscribe(
        (cardCredentialDetailRes: CardCredentialOtpVerificationResModel) => {
          this.fillCardCredentialPopupForm(cardCredentialDetailRes);
          this.startTimer();
          this.showPopupAndRegisterPopupEvent();
        }
      );

    this.popupService.onDismiss().subscribe(() => {
      this.stopTimer();
    });
  }

  private showPopupAndRegisterPopupEvent() {
    this.popupService
      .showPopup({
        image: this.cardImage,
        form: this.cardCredentialsDetailsForm,
      })
      .subscribe((res: PopupOutputModel) => {
        if (res.buttonId == 'close') {
          this.popupService.dismiss();
          this.stopTimer();
        } else if (res.buttonId == 'copy') {
          navigator.clipboard
            .writeText(
              this.cardCredentialsDetailsForm.controls['cardNumber'].value
            )
            .then()
            .catch((e) => console.log(e));
        } else {
          this.popupService.dismiss();
        }
      });
  }

  private fillCardCredentialPopupForm(
    res: CardCredentialOtpVerificationResModel
  ) {
    this.cardCredentialsDetailsForm.controls['cardName'].setValue(
      res.holderName
    );
    this.cardCredentialsDetailsForm.controls['cardNumber'].setValue(res.iban);
    this.cardCredentialsDetailsForm.controls['expiryDate'].setValue(
      this.datePipe.transform(res.expiryDate, 'MM/YY')
    );
    this.cardCredentialsDetailsForm.controls['cvv'].setValue(
      this.cryptoService.decryptRSA(res.cvv)
    );
  }

  private startTimer(): void {
    const source = timer(0, 1000);
    this.subscription = source.subscribe((val) => {
      if (this.defaultSeconds == 0) {
        this.stopTimer();
        this.cardCredentialsDetailsForm.controls['timerText'].label = '';
        this.popupService.dismiss();
      }
      this.defaultSeconds = this.defaultSeconds - 1;
      var min = this.defaultSeconds / 60;
      var minutes = Number.parseInt(min.toString(), 10);
      var seconds = this.defaultSeconds % 60;
      var formatedTime = '00:0' + minutes + ':' + seconds;
      this.cardCredentialsDetailsForm.controls['timerText'].label =
        formatedTime;
    });
  }

  private stopTimer() {
    this.subscription.unsubscribe();
  }

  private buildReqForValidOtpCardDetails(): CardCredentialOtpVerificationReqModel {
    return {
      cardNumber: this.CardCredentialOtpVerificationReqModel.cardNumber,
      cardSeqNumber: this.CardCredentialOtpVerificationReqModel.cardSeqNumber,
      details: true,
      requestValidate: this.requestValidate,
    };
  }
}
