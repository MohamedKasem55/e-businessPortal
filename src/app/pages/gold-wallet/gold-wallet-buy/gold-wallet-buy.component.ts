import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GoldComponentControl } from 'app/@core/model/dto/control/gold-component-control';
import { PageModel } from 'app/@core/model/dto/formModel';
import { PopupOutputModel } from 'app/@core/model/dto/popup.model';
import { ResultModal } from 'app/@core/model/dto/result.modal';
import { GenerateChallengeAndOTP, RequestValidate } from 'app/@core/model/rest/common/otp.model';
import { BuyGoldConfirmReq } from 'app/@core/model/rest/gold-wallet/buy-gold-confirm-req';
import { BuyGoldConfirmRes } from 'app/@core/model/rest/gold-wallet/buy-gold-confirm-res';
import { BuyGoldValidateReq } from 'app/@core/model/rest/gold-wallet/buy-gold-validate-req';
import { BuyGoldValidateRes } from 'app/@core/model/rest/gold-wallet/buy-gold-validate-res';
import { BullionWeight, GoldWalletBullionRes } from 'app/@core/model/rest/gold-wallet/gold-wallet-bullion-res';
import { GoldWalletDashboardRes } from 'app/@core/model/rest/gold-wallet/gold-wallet-dashboard-res';
import { PopupService } from 'app/@core/service/base/popup.service';
import { ResponseException } from 'app/@core/service/base/responseException';
import { VerificationService } from 'app/@core/service/base/verification.service';
import { GoldWalletService } from 'app/@core/service/gold-wallet/gold-wallet.service';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { BoxModel } from 'arb-design-library/model/box.model';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { SummarySectionModel } from 'arb-design-library/model/summary-section.model';
import { SummaryModel } from 'arb-design-library/model/summary.model';
import { GoldWalletBaseComponent } from '../gold-wallet-base/gold-wallet-base.component';
import { buyForm, getModalForm, headerForm } from './gold-wallet-buy-contrlos';


@Component({
  selector: 'app-gold-wallet-buy',
  templateUrl: '../gold-wallet-base/gold-wallet-base.component.html',
  styleUrls: []
})
export class GoldWalletBuyComponent extends GoldWalletBaseComponent implements OnInit {

  generateChallengeAndOTP!: GenerateChallengeAndOTP;
  validateResponse!: BuyGoldValidateRes;
  goldWalletBullionRes!: GoldWalletBullionRes;
  amount!:string;
  isChecked:boolean=false;
  walletDashboard!: GoldWalletDashboardRes;
  timeLeft: number = 180;
  buyGoldConfirmRes!:BuyGoldConfirmRes


  buyGoldButton: ButtonModel = {
    id: 'buy',
    text: 'gold-wallet.buy.buyButton',
    type: 'primary',
    isDisable: false,
  };

  goDashboardButton: ButtonModel = {
    id: 'dashboard',
    text: 'gold-wallet.buy.goDashboard',
    type: 'primary',
  };

  goHomeButton: ButtonModel = {
    id: 'home',
    text: 'gold-wallet.buy.goHome',
    type: 'secondary',
    isDisable: false,
  };

  boxList: BoxModel[] = []

  prices: any[] = [];

  constructor(private goldWalletService: GoldWalletService,private otpService: VerificationService,private popupService: PopupService,
    private datePipe: DatePipe,
    private translateService:TranslateService) {
    super();
    this.walletDashboard=this.router.getCurrentNavigation()?.extras?.state?.['wallet'];

    this.goldWalletService.getAvailable().subscribe(
      (res: any) => {
          this.goldWalletBullionRes = res;
          this.drawPage();
      })
  }





  override ngOnInit(): void {
    if(this.walletDashboard) {
      this.pageTitle.id = 'buy';
      this.pageTitle.title = "gold-wallet.buy.title";
      this.pageTitle.stepper!.steps = ["", "", ""];
      this.setBreadcrumb([{
        text: 'gold-wallet.title',
        url: 'gold-wallet/dashboard'
      }, {text: 'gold-wallet.buy.title', url: ''}]);


      this.endButtons = [this.proceedButton];
      this.endButtons[0].isDisable = true;
    }else{
      void this.router.navigateByUrl("/gold-wallet");
    }
  }

  drawPage() {
    this.pages = [];
    this.pages = [new PageModel(1, buyForm(this.translateService))];

    this.prices.push({
      text: this.translateService.instant("gold-wallet.marketPrice"),
      amount: this.walletDashboard.marketInformation.marketOpened?this.walletDashboard.marketInformation.marketPrice:'-',
      currency: "SAR/g",
    })
    this.prices.push({
      text: this.translateService.instant("gold-wallet.buyPrice"),
      amount: this.walletDashboard.marketInformation.marketOpened?this.goldWalletBullionRes.goldPrice.goldBuyPrice:'-',
      currency: this.translate.currentLang==='ar'?(this.goldWalletBullionRes.goldPrice.arCurrency):(this.goldWalletBullionRes.goldPrice.enCurrency)+'/'+this.translate.currentLang==='ar'?(this.goldWalletBullionRes.goldPrice.arMeasureUnit):(this.goldWalletBullionRes.goldPrice.enMeasureUnit),
    })
    this.prices.push({
      text: this.translateService.instant("gold-wallet.sellPrice"),
      amount: this.walletDashboard.marketInformation.marketOpened?this.walletDashboard.marketInformation.sellPrice:'-',
      currency: "SAR/g",
    })

    this.getControl(0, 0, 'header').controlOptions.prices=this.prices
    this.getControl(0, 0, 'header').controlOptions.balance=this.walletDashboard.goldBalance.balance.toString()
    this.getControl(0, 0, 'header').controlOptions.balanceCurrency=this.walletDashboard.goldBalance.measureUnit.toString()


    this.getControl(0, 0, 'textCustom').label=this.translate.instant("gold-wallet.buy.infoCustom", {"0": this.goldWalletBullionRes.availableFreeWeight.balance+' '+this.goldWalletBullionRes.availableFreeWeight.measureUnit})

    this.timeLeft=+this.goldWalletBullionRes.timeToLive;

    this.goldWalletBullionRes.gmbullionDtls.forEach(box => {
      this.boxList.push({
        id: box.toString(),
        text: box.toString()+' GRAM',
        icon: '',
        isDisabled: false,
      })
    });

    this.goldWalletBullionRes.kgbullionDtls.forEach(box => {
      this.boxList.push({
        id: box.toString(),
        text: box.toString()+' KG',
        icon: '',
        isDisabled: false,
      })
    });

    this.getControl(0, 0, 'listBoxType').controlOptions.box=this.boxList
    this.getControl(0, 0, 'listBoxType').valueChanges.subscribe(value => {
      this.onTypeChange(value.value);
    });
    this.getControl(0, 0, 'amount').valueChanges.subscribe(value => {
      this.onAmountChange(value.value);
    });
    this.getControl(0, 0, 'check').valueChanges.subscribe(value => {
      this.checked(value.value);
    });
  }

  onTypeChange(value: string){
    this.amount=value;
    if(this.isChecked){
      this.getControl(0, 0, 'check').setValue(false)
      this.checked(false)
    }
    this.endButtons[0].isDisable = this.amount?false:true
  }

  checked(value: boolean){
    this.isChecked=value;
    if(value){
      this.getControl(0, 0, 'listBoxType').setValue('')
      this.amount=''
    }
    this.amount=this.getControl(0, 0, 'amount').value
    this.getControl(0, 0, 'amount').hidden=!value;
    this.getControl(0, 0, 'textCustom').hidden=!value;
    this.endButtons[0].isDisable = this.amount?false:true
  }

  onAmountChange(value: string){
    this.amount=value;
    this.endButtons[0].isDisable = this.amount?false:true
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'Proceed':
        this.validateBuy();
        break;
      case 'buy':
        this.validateResponse.generateChallengeAndOTP ? this.showOtp() : this.confirmBuy();
        this.startButtons=[]
        break;
      case 'home':
        this.router.navigate(["/dashboard"]).then(() => {
        });
        break;
      case 'dashboard':
        this.router
        .navigate(['/gold-wallet/dashboard'], { queryParams: { type: 'last-transactions' } })
        .then(() => {});
        break;
      case 'Back':
        if(this.pageTitle.stepper?.stepCounter===1){
          this.router
          .navigate(['/gold-wallet/dashboard'], { queryParams: { type: 'last-transactions' } })
          .then(() => {});
        }else{
          this.stepperMoveBack();
          this.endButtons=[this.proceedButton]
        }
        break;
    }
  }

  showOtp() {
    this.otpService.showVerification(this.validateResponse.generateChallengeAndOTP!).subscribe((requestValidate: RequestValidate) => {
      this.confirmBuy(requestValidate);
    });
  }

  confirmBuy(requestValidate?: RequestValidate) {
    this.goldWalletService.confirm(this.returnConfirmRequest(requestValidate)).subscribe({
      next: (res) => {
        this.stepperMoveNext();
        this.summary = {};
        this.buyGoldConfirmRes=res
        this.result = this.fillSuccessResult();
        this.endButtons = [this.goHomeButton,this.goDashboardButton];
      },
      error: (error: ResponseException) => {
        this.stepperMoveNext();
        this.summary = {};
        this.result = this.fillErrorResult(error.ErrorResponse.errorDescription!);
        this.endButtons = [this.goHomeButton,this.goDashboardButton];
      }
    });
  }

  returnConfirmRequest(requestValidate?: RequestValidate): BuyGoldConfirmReq {
    return {
      transactionKey: this.validateResponse.transactionKey,
      referenceNumber: this.validateResponse.referenceNumber,
      requestValidate: requestValidate
    }
  }

  fillSuccessResult(): ResultModal {
    return {
      type: 'Success',
      title: 'gold-wallet.buy.success',
      summary: this.fillEnd(this.buyGoldConfirmRes),
    };
  }

  fillErrorResult(errString: string): ResultModal {
    return {
      type: 'Error',
      title: errString,
      summary: {}
    };
  }



  goSummary(){
    if(this.pages.length===1){
      this.pages.push(new PageModel(2, headerForm(this.translate)));
    }
    this.getControl(1, 0, 'header').controlOptions.prices=this.prices
    this.getControl(1, 0, 'header').controlOptions.balance=this.walletDashboard.goldBalance.balance.toString()
    this.getControl(1, 0, 'header').controlOptions.balanceCurrency=this.walletDashboard.goldBalance.measureUnit.toString()
    this.timeLeft=+this.validateResponse.timeToLive
    this.getControl(1, 0, 'header').controlOptions.duration=this.timeLeft;
    (this.getControl(1, 0, 'header') as GoldComponentControl).onFinish.subscribe(() => {
      this.showModal()
    });
    this.summary = this.fillSummary(this.validateResponse);
    this.stepperMoveNext();
    this.endButtons = [this.buyGoldButton];
  }

  private showModal() {

    this.popupService.showPopup( {image: 'assets/img/warning.svg',
    form: getModalForm()}).subscribe((res: PopupOutputModel) => {
      switch (res.buttonId) {
        case 'backTimer':
          this.popupService.dismiss()
          this.stepperMoveBack()
          this.endButtons=[this.proceedButton]
          break;
        }

    });
  }

  returnValidateRequest(): BuyGoldValidateReq {
    return {
     accountNumber:this.walletDashboard.linkedAccountNumber,
     customWeight:this.isChecked,
     qty:+this.amount,
     unit:BullionWeight.GRAM,
     walletId:this.walletDashboard.walletNum,
     weight: +this.amount
    }
  }

  validateBuy() {
    this.goldWalletService.validate(this.returnValidateRequest()).subscribe({
      next: (res: any) => {
        this.generateChallengeAndOTP = res.generateChallengeAndOTP!;
        this.validateResponse = res;
        this.goSummary();
      },
      error: (error: ResponseException) => {
        // this.summary = this.fillSummary();
      }
    });
  }


  fillSummary(buyValidateRes?: BuyGoldValidateRes): SummaryModel {
    let sections: SummarySectionModel[] = [];
    if (buyValidateRes) {
      sections.push({
        title: {
          id: 'buySummary',
          title: 'gold-wallet.buy.buyButton'
        },
        items: [
          {
            title: 'gold-wallet.buy.selectedQuantity',
            subTitle: buyValidateRes.rate,
          },
          {
            title: 'gold-wallet.buy.totalAmount',
            subTitle: buyValidateRes.totalCost.toString(),
          },
          {
            title: 'gold-wallet.buy.account',
            subTitle: this.walletDashboard.linkedAccountNumber
          },
          {
            title: 'gold-wallet.buy.goldSource',
            subTitle: buyValidateRes.goldSource,
          },
          {
            title: 'gold-wallet.buy.goldVendor',
            subTitle: buyValidateRes.goldVendor,
          },
          {
            title: 'gold-wallet.buy.weight',
            subTitle: buyValidateRes.weight.toString(),
          },
          {
            title: 'gold-wallet.buy.quantity',
            subTitle: buyValidateRes.qty.toString(),
          },
          {
            title: 'gold-wallet.buy.date',
            subTitle: this.datePipe.transform(new Date(), "dd/MM/YYYY")!,
          },
          {
            title: 'gold-wallet.buy.purity',
            subTitle: buyValidateRes.purity.toString()
          }]
      })
    }
    return {
      title: {
        id: 'SummaryTitle',
      },
      sections: sections
    }
  }

  fillEnd(buyConfirmRes?: BuyGoldConfirmRes): SummaryModel {
    let sections: SummarySectionModel[] = [];
    if (buyConfirmRes) {
      sections.push({
        title: {
          id: 'buyConfirm',
        },
        items: [
          {
            title: 'gold-wallet.buy.referenceNumber',
            subTitle: this.validateResponse.referenceNumber,
          },
          {
            title: 'gold-wallet.buy.transactionAmount',
            subTitle: this.validateResponse.totalCost.toString(),
          },
          {
            title: 'gold-wallet.buy.buyPerGram',
            subTitle: this.goldWalletBullionRes.goldPrice.goldBuyPrice.toString()
          },
          {
            title: 'gold-wallet.buy.fees',
            subTitle: this.validateResponse.totalCost.toString(),
          },
          {
            title: 'gold-wallet.buy.goldSource',
            subTitle: this.validateResponse.goldSource,
          },
          {
            title: 'gold-wallet.buy.goldVendor',
            subTitle: this.validateResponse.goldVendor,
          }
          ]
      })

    }
    return {
      title: {
        id: 'SummaryTitle',
        title: 'public.summary',
        subTitle: [{
          text: 'gold-wallet.buy.total',
          amount: this.validateResponse.totalCost.toString(),
          currency: 'SAR'
        }],
        currency: 'SAR',

      },
      sections: sections
    }
  }

}
