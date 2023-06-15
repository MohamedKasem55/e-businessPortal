import { Component, OnInit } from "@angular/core";
import { PageModel } from "app/@core/model/dto/formModel";
import { ResultModal } from "app/@core/model/dto/result.modal";
import { GenerateChallengeAndOTP, RequestValidate } from "app/@core/model/rest/common/otp.model";
import { WalletOnBoardingConfirmReq } from "app/@core/model/rest/gold-wallet/wallet-on-boarding-confirm-req";
import {
  WalletOnBoardingValidationRequest
} from "app/@core/model/rest/gold-wallet/wallet-on-boarding-validation-request";
import {
  WalletOnBoardingValidationResponse
} from "app/@core/model/rest/gold-wallet/wallet-on-boarding-validation-response";
import { BatchItem } from "app/@core/model/rest/payments/user-approval/government-user-approval-res";
import { ContextPath } from "app/@core/service/base/abstract-base.service";
import { VerificationService } from "app/@core/service/base/verification.service";
import { GoldWalletService } from "app/@core/service/gold-wallet/gold-wallet.service";
import { UserProfileService } from "app/@core/service/user-profile/user-profile.service";
import { FormButtonClickOutput } from "app/shared/form/form.component";

import { ResponseException } from "app/@core/service/base/responseException";
import { ButtonModel } from "arb-design-library/model/button.model";
import { SummaryModel } from "arb-design-library/model/summary.model";
import { GoldWalletBaseComponent } from "../gold-wallet-base/gold-wallet-base.component";
import { getGoldWalletOnBoardForm, getGoldWalletOnBoardFormAccount, termsForm } from "./gold-wallet-on-board-control";

@Component({
  selector: 'app-gold-wallet',
  templateUrl: '../gold-wallet-base/gold-wallet-base.component.html',
  styleUrls: []
})

export class GoldWalletOnBoardComponent extends GoldWalletBaseComponent implements OnInit {


  paymentDetails!: BatchItem;
  validateResponse!: WalletOnBoardingValidationResponse;
  account!: any;
  generateChallengeAndOTP!: GenerateChallengeAndOTP;
  openGoldButton: ButtonModel = {
    id: "open",
    text: "goldWallet.onBoard.title",
    type: "primary"
  };
  goToGoldButton: ButtonModel = {
    id: "goToGold",
    text: "goldWallet.onBoard.goGoldWallet",
    type: "primary"
  };
  goToHomeButton: ButtonModel = {
    id: 'goToHome',
    text: "goldWallet.onBoard.goHome",
    type: 'secondary',
  };
  cancelButton: ButtonModel = {
    id: 'cancel',
    text: 'public.cancel',
    type: 'secondary',
  };

  language: string = "";
  blob: any;

  constructor(private userProfileService: UserProfileService,
              private goldWalletService: GoldWalletService, private otpService: VerificationService) {
    super();

    this.pageTitle.id = 'open-gold';
    this.pageTitle.title = "goldWallet.onBoard.title";
    this.pageTitle.stepper = {
      steps: ["", "", "", ""],
      stepCounter: 1,
      stepText: "public.step",
      ofText: "public.of"
    }
    this.pageTitle.showArrow = true;
    this.pageTitle.endButtons = [];
    this.drawPage()
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  validate() {
    this.goldWalletService.getOnBoardValidate(this.returnValidateRequest()).subscribe({
      next: (res: any) => {
      // const res: WalletOnBoardingValidationResponse={
      //   generateChallengeAndOTP: undefined,
      //   linkAccountDTO: this.account
      // }
        this.generateChallengeAndOTP = res.generateChallengeAndOTP!;
        this.validateResponse = res;
        this.generateChallengeAndOTP ? this.showOtp() : this.confirmOnBoard();

      },
      error: (error: ResponseException) => {
        // this.summary = this.fillSummary();
      }
    });
  }


  returnValidateRequest(): WalletOnBoardingValidationRequest {
    return {
      linkAccount: this.account
    }
  }

  returnConfirmRequest(requestValidate?: RequestValidate): WalletOnBoardingConfirmReq {
    return {
      linkedAccountDTO: this.account,
      requestValidate: requestValidate
    }
  }

  showOtp() {
    this.otpService.showVerification(this.validateResponse.generateChallengeAndOTP!).subscribe((requestValidate: RequestValidate) => {
      this.confirmOnBoard(requestValidate);
    });
  }

  confirmOnBoard(requestValidate?: RequestValidate) {
    this.goldWalletService.getOnBoardConfirm(this.returnConfirmRequest(requestValidate)).subscribe({
      next: (res) => {
        // const res:WalletOnBoardingConfirmRes={
        //   linkedAccountDTO: this.account,
        //   walletId: '123123132'
        // }
        this.stepperMoveNext();
        this.summary = {};
        this.result = this.fillSuccessResult();
        this.addEndButtons();
      },
      error: (error: ResponseException) => {
        this.stepperMoveNext();
        this.summary = {};
        this.result = this.fillErrorResult(error.ErrorResponse.errorDescription!);
        this.stepperMoveNext();
        this.addEndButtons();
      }
    });
  }

  generateOTP() {
    this.goldWalletService.getOnBoardValidate(this.returnValidateRequest()).subscribe(
      (res: any) => {
        this.generateChallengeAndOTP = res.generateChallengeAndOTP;
      }
    )
  }

  getSponsorId(): string {
    return this.paymentDetails.details && this.paymentDetails.details.length > 0 ? this.paymentDetails.details[0].value : "";
  }

  drawPage() {
    this.pages = [];
    this.pageTitle.title = "goldWallet.onBoard.title";
    this.pages = [new PageModel(1, getGoldWalletOnBoardForm())];

    this.addEndButtons();
  }

  addEndButtons() {
    this.endButtons = [];
    this.startButtons = []
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.endButtons.push(this.openGoldButton);
        break;
      case 2:
        this.startButtons.push(this.backButton)
        this.endButtons.push(this.proceedButton);
        this.endButtons[0].isDisable = true
        break;
      case 3:
        this.startButtons.push(this.backButton)
        this.endButtons = [this.cancelButton, this.proceedButton]
        break;
      case 4:
        this.endButtons = [this.goToHomeButton, this.goToGoldButton]
        break;
    }
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {

    switch (formButtonClickOutput.buttonId) {
      case 'Back':
        this.onClickBackButton();
        break;
      case 'arrowTitle':
        this.onClickBackButton();
        break;
      case 'Proceed':
        if (this.pageTitle.stepper?.stepCounter === 2) {
          this.pages = [new PageModel(3, getGoldWalletOnBoardFormAccount())];
          this.getAccounts();
          this.stepperMoveNext();

        } else {
          this.validate();
        }
        break;
      case 'open':
        this.loadTermsAndConditions()
        break;
      case 'goToHome':
        this.router.navigateByUrl("/");
        break;
      case 'goToGold':
        this.router.navigateByUrl("/gold-wallet");
        break;
      case 'terms-link':
        let file = 'gold-wallet-' + this.language + '.pdf'
        this.goldWalletService.getTermsAndConditions(file);
        break;
    }
  }

  getAccounts() {
    this.userProfileService.getSARAccountList().subscribe(data => {
      this.getControl(0, 0, "account").controlOptions.options = data.listAlertsPermissionAccount;
      this.getControl(0, 0, "account").valueChanges.subscribe((value: any) => {
        this.account = value
      })
    })
  }

  loadTermsAndConditions() {
    this.language = this.translate.currentLang;

    this.fetchLanguage();
    this.pages = [new PageModel(2, termsForm())];
    this.getControl(0,0,"pdf").controlOptions.src = ContextPath.DOCUMENT_CONTEXT+'/gold-wallet-' + this.language + '.pdf'
    this.getControl(0, 0, 'check').valueChanges.subscribe(value => {
      this.checked(value.value);
    });
    this.stepperMoveNext();
    this.addEndButtons();
  }

  checked(value: boolean) {
    this.endButtons[0].isDisable = !value
  }

  fetchLanguage() {
    this.language = this.translate.currentLang;
    this.translate.onLangChange.subscribe(
      (lang) => {
        this.language = lang.lang
      }
    )
  }

  onClickBackButton() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.router.navigateByUrl("/");
        break;
      case 2:
      case 3:
        this.stepperMoveBack();
        this.addEndButtons();
        break;
    }
  }



  fillSuccessResult(): ResultModal {
    return {
      type: 'Success',
      title: "goldWallet.onBoard.goldSuccess",
      subTitle: "goldWallet.onBoard.canAccess",
      summary: this.fillSummary(),
    };
  }

  fillErrorResult(errString: string): ResultModal {
    return {
      type: 'Error',
      title: errString,
      summary: this.fillSummary(),
    };
  }

  fillSummary(): SummaryModel {
    return {
      sections: [
        {
          title: {
            id: 'goldWallet',
            title:  "goldWallet.title",
          },
          items: [
            {
              title:  "goldWallet.onBoard.goldAccount",
              subTitle: this.account.value.numberAccount

            }
          ],
        },
        {
          title: {
            id: 'linkedAccount',
            title: "goldWallet.onBoard.linkedAccount",
          },
          items: [
            {
              title:  "goldWallet.onBoard.linkedAccountToGold",
              subTitle: this.account.value.alias

            },
            {
              title:  "goldWallet.onBoard.account",
              subTitle: this.account.value.fullAccountNumber
            }

          ],
        }
      ],
    };
  }

}
