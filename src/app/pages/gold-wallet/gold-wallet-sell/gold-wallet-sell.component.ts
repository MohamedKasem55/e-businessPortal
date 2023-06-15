import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GoldComponentControl } from 'app/@core/model/dto/control/gold-component-control';
import { PageModel } from 'app/@core/model/dto/formModel';
import { PopupOutputModel } from 'app/@core/model/dto/popup.model';
import { ResultModal } from 'app/@core/model/dto/result.modal';
import { GenerateChallengeAndOTP, RequestValidate } from 'app/@core/model/rest/common/otp.model';
import { GoldWalletDashboardRes } from 'app/@core/model/rest/gold-wallet/gold-wallet-dashboard-res';
import { GoldWalletFilterType, GoldWalletTransactionsReq } from 'app/@core/model/rest/gold-wallet/gold-wallet-transactions-req';
import { SellGoldConfirmReq } from 'app/@core/model/rest/gold-wallet/sell-gold-confirm-req';
import { SellGoldConfirmRes } from 'app/@core/model/rest/gold-wallet/sell-gold-confirm-res';
import { SellGoldPriceRes } from 'app/@core/model/rest/gold-wallet/sell-gold-price-res';
import { BullionItem, SellGoldValidateReq } from 'app/@core/model/rest/gold-wallet/sell-gold-validate-req';
import { SellGoldValidateRes } from 'app/@core/model/rest/gold-wallet/sell-gold-validate-res';
import { PopupService } from 'app/@core/service/base/popup.service';
import { ResponseException } from 'app/@core/service/base/responseException';
import { VerificationService } from 'app/@core/service/base/verification.service';
import { GoldWalletService } from 'app/@core/service/gold-wallet/gold-wallet.service';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { BoxModel } from 'arb-design-library/model/box.model';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { SummarySectionModel } from 'arb-design-library/model/summary-section.model';
import { SummaryModel } from 'arb-design-library/model/summary.model';
import { take } from 'rxjs';
import { GoldWalletBaseComponent } from '../gold-wallet-base/gold-wallet-base.component';
import { getModalForm, getSellTable, getSellTableCustom, headerForm, sellForm } from './gold-wallet-sell-contrlos';


@Component({
  selector: 'app-gold-wallet-sell',
  templateUrl: '../gold-wallet-base/gold-wallet-base.component.html',
  styleUrls: []
})
export class GoldWalletSellComponent extends GoldWalletBaseComponent implements OnInit {

  generateChallengeAndOTP!: GenerateChallengeAndOTP;
  validateResponse!: SellGoldValidateRes;
  sellGoldPrice!: SellGoldPriceRes;
  amount!:string;
  isCustom:boolean=false;
  walletDashboard!: GoldWalletDashboardRes;
  timeLeft: number = 180;
  item!:BullionItem;
  selectedGold: any[] = [];
  totalAmount:number=0
  data!: any[]|undefined;
  total: number = 0;
  sellGoldConfirmRes!:SellGoldConfirmRes

  sellGoldButton: ButtonModel = {
    id: 'sell',
    text: 'gold-wallet.sell.sellButton',
    type: 'primary',
    isDisable: false,
  };

  goDashboardButton: ButtonModel = {
    id: 'dashboard',
    text: 'gold-wallet.buy.goDashboard',
    type: 'primary',
    isDisable: false,
  };

  goHomeButton: ButtonModel = {
    id: 'home',
    text: 'gold-wallet.buy.goHome',
    type: 'secondary',
    isDisable: false,
  };

  confirmSelected: ButtonModel = {
    id: 'confirmSel',
    text: '',
    type: 'primary',
    isDisable: false,
  };

  boxList: BoxModel[] = []

  prices: any[] = [];


  constructor(private goldWalletService: GoldWalletService,private otpService: VerificationService, private datePipe: DatePipe,
    private popupService: PopupService,private translateService:TranslateService) {
    super();
    this.walletDashboard=this.router.getCurrentNavigation()?.extras?.state?.['wallet']

    this.goldWalletService.getPrice().subscribe(
      (res: any) => {
          this.sellGoldPrice = res;
          this.drawPage();

      })

  }

  override ngOnInit(): void {
    if(this.walletDashboard) {

      this.pageTitle.id = 'sell';
      this.pageTitle.title = "gold-wallet.sell.title";
      this.pageTitle.stepper!.steps = ["", "", ""];
      this.setBreadcrumb([{
        text: 'gold-wallet.title',
        url: 'gold-wallet/dashboard'
      }, {text: 'gold-wallet.sell.title', url: ''}]);

      this.endButtons = [this.proceedButton];
      this.endButtons[0].isDisable = true;
    }else{
      void this.router.navigateByUrl("/gold-wallet");
    }
  }

  drawPage() {
    this.pages = [];
    this.pages = [new PageModel(1, sellForm(this.translateService))];

    this.prices.push({
      text: this.translateService.instant("gold-wallet.marketPrice"),
      amount: this.walletDashboard.marketInformation.marketOpened?this.walletDashboard.marketInformation.marketPrice:'-',
      currency: "SAR/g",
    })
    this.prices.push({
      text: this.translateService.instant("gold-wallet.buyPrice"),
      amount: this.walletDashboard.marketInformation.marketOpened?this.walletDashboard.marketInformation.buyPrice:'-',
      currency: "SAR/g",
    })
    this.prices.push({
      text: this.translateService.instant("gold-wallet.sellPrice"),
      amount: this.walletDashboard.marketInformation.marketOpened?this.sellGoldPrice.goldSellPrice:'-',
      currency: "SAR/g",
    })

    this.getControl(0, 0, 'header').controlOptions.prices=this.prices
    this.getControl(0, 0, 'header').controlOptions.balance=this.walletDashboard.goldBalance.balance.toString()
    this.getControl(0, 0, 'header').controlOptions.balanceCurrency=this.walletDashboard.goldBalance.measureUnit.toString()


      this.boxList.push({
        id: 'kgs',
        text: 'gold-wallet.sell.inKgs',
        icon: '',
        isDisabled: false,
      })

      this.boxList.push({
        id: 'custom',
        text: 'gold-wallet.sell.inGms',
        icon: '',
        isDisabled: false,
      })

    this.getControl(0, 0, 'listBoxType').controlOptions.box=this.boxList
    this.getControl(0, 0, 'listBoxType').valueChanges.subscribe(value => {
      this.onTypeChange(value.value);
    });

  }

  updateButton() {
    this.totalAmount=0
    this.selectedGold.forEach(element => {
      this.totalAmount+=+element.choosen
    });
    this.endButtons[0].text = this.translate.instant('gold-wallet.sell.confirmSel',{"0":this.totalAmount});
  }


  setTransactionsReq(options: GoldWalletTransactionsReq = {
    page: 1,
    rows: 50
  }) {
    return {
      filterType: GoldWalletFilterType.MY_GOLD_SEG,
      walletNum: this.walletDashboard.walletNum,
      page: options.page || 1,
      rows: options.rows || 50,
    };
  }

  onTypeChange(value: string){

    this.goldWalletService.getTransactions(this.setTransactionsReq()).pipe(take(1)).subscribe({
      next: (res) => {

      switch (value) {
        case 'kgs':
          this.pages[0].deleteFrom(1,1)
          this.pages[0].addForm(getSellTable())
          this.totalAmount=0

          this.data=res.myGoldFixed?.items
          this.getControl(0, 1, "sellTable")?.valueChanges.subscribe(value => {
            this.isCustom=false
            if(value.value.length>0){
              this.selectedGold =[value.value.pop()];
              this.getControl(0, 1, "sellTable").setValue([this.selectedGold[0]])
            }else{
              this.selectedGold=[]
            }
            this.confirmButton.isDisable=!(this.selectedGold.length>0)
          });

          this.getControl(0, 1, "sellTable").controlOptions.data = this.data;
          this.getControl(0, 1, "sellTable").controlOptions.total = res.myGoldFixed?.total;

          this.confirmButton.isDisable=true
          this.endButtons=[this.confirmButton]

          break;
        case 'custom':
          this.pages[0].deleteFrom(1,1)
          this.pages[0].addForm(getSellTableCustom())
          this.totalAmount=0
          this.getControl(0, 1, "sellTableCustom")?.valueChanges.subscribe(value => {
            this.isCustom=true
            this.selectedGold = value.value;
            this.confirmSelected.isDisable=!(this.selectedGold.length>0)
            this.updateButton();
          });
          this.data=[]
          res.myGoldFree?.items?.forEach(element => {
            this.data?.push(Object.assign({}, element, {choosen: 0}))
          });

          this.getControl(0, 1, "sellTableCustom").controlOptions.data = this.data;
          this.getControl(0, 1, "sellTableCustom").controlOptions.total = res.myGoldFree?.total;

          this.confirmSelected.text= this.translate.instant('gold-wallet.sell.confirmSel',{"0":this.totalAmount});
          this.confirmSelected.isDisable=true
          this.endButtons=[this.confirmSelected]
          break;
        }

      },
      error: () => {
        this.data = [];
        this.total = 0;
      }
    });



  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'confirmSel':
      case 'Confirm':
        this.validateSell();
        break;
      case 'Back':
        if(this.pageTitle.stepper?.stepCounter===1){
          this.router
          .navigate(['/gold-wallet/dashboard'], { queryParams: { type: 'last-transactions' } })
          .then(() => {});
        }else{
          this.stepperMoveBack();
          this.endButtons=[this.confirmButton]
        }
        break;
      case 'sell':
        this.validateResponse.generateChallengeAndOTP ? this.showOtp() : this.confirmSell();
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
    }
  }

  showOtp() {
    this.otpService.showVerification(this.validateResponse.generateChallengeAndOTP!).subscribe((requestValidate: RequestValidate) => {
      this.confirmSell(requestValidate);
    });
  }

  confirmSell(requestValidate?: RequestValidate) {
    this.goldWalletService.confirm(this.returnConfirmRequest(requestValidate)).subscribe({
      next: (res) => {
        this.stepperMoveNext();
        this.summary = {};
        this.sellGoldConfirmRes=res
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

  returnConfirmRequest(requestValidate?: RequestValidate): SellGoldConfirmReq {
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
      summary: this.fillEnd(this.sellGoldConfirmRes),
    };
  }

  fillErrorResult(errString: string): ResultModal {
    return {
      type: 'Error',
      title: errString,
      summary: {},
    };
  }



  goSummary(){
    if(this.pages.length===1){
      this.pages.push(new PageModel(2, headerForm(this.translate)));
    }
    this.getControl(1, 0, 'header').controlOptions.prices=this.prices
    this.getControl(1, 0, 'header').controlOptions.balance=this.walletDashboard.goldBalance.balance.toString()
    this.getControl(1, 0, 'header').controlOptions.balanceCurrency=this.walletDashboard.goldBalance.measureUnit.toString()
    this.summary = this.fillSummary(this.validateResponse);
    this.stepperMoveNext();
    this.timeLeft=+this.validateResponse.timeToLive
    this.getControl(1, 0, 'header').controlOptions.duration=this.timeLeft;
    (this.getControl(1, 0, 'header') as GoldComponentControl).onFinish.subscribe(() => {
      this.showModal()
    });
    this.endButtons = [this.sellGoldButton];
  }

  returnValidateRequest(): SellGoldValidateReq {
    const list:BullionItem[]=[]
    if(this.isCustom){
      this.selectedGold.forEach(element => {
        this.item={
          customWeight:true,
          goldCode:element.serialNumber,
          weight:this.totalAmount
       }
       list.push(this.item)
      });
    }else{
     this.item={
        customWeight:false,
        goldCode:this.selectedGold[0].serialNumber,
        weight:this.selectedGold[0].amount
      }
     list.push(this.item)
    }
    return {
      walletId: this.walletDashboard.walletNum,
      bullionLst:list,
      accountNumber: this.walletDashboard.linkedAccountNumber
    }
  }

  validateSell() {
    this.goldWalletService.validateSell(this.returnValidateRequest()).subscribe({
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


  fillSummary(sellValidateRes?: SellGoldValidateRes): SummaryModel {
    let sections: SummarySectionModel[] = [];
    if (sellValidateRes) {
      sections.push({
        title: {
          id: 'sellSummary',
          title: 'public.summary'
        },
        items: [
          {
            title: 'gold-wallet.sell.selected',
            subTitle: sellValidateRes.weight.toString(),
          },
          {
            title: 'gold-wallet.sell.total',
            subTitle: sellValidateRes.totalCost.toString(),
          },
          {
            title: 'gold-wallet.sell.account',
            subTitle: this.walletDashboard.linkedAccountNumber,
          },
          {
            title: 'gold-wallet.sell.avgCost',
            subTitle: this.sellGoldPrice.goldSellPrice.toString(),
          },
          {
            title: 'gold-wallet.sell.quantity',
            subTitle: sellValidateRes.qty.toString(),
          },
          {
            title: 'gold-wallet.sell.purchaseDate',
            subTitle: this.datePipe.transform(new Date(), "dd/MM/YYYY")!,
          }]
      })
    }
    return {
      title: {
        id: 'SummaryTitle',
        title: 'gold-wallet.sell.title',
      },
      sections: sections
    }
  }

  fillEnd(sellConfirmRes?: SellGoldConfirmRes): SummaryModel {
    let sections: SummarySectionModel[] = [];
    if (sellConfirmRes) {
      sections.push({
        title: {
          id: 'sellConfirm',
        },
        items: [
          {
            title: 'gold-wallet.sell.referenceNumber',
            subTitle: this.validateResponse.referenceNumber,
          },
          {
            title: 'gold-wallet.sell.transactionAmount',
            subTitle: this.validateResponse.totalCost.toString(),
          },
          {
            title: 'gold-wallet.sell.buyPerGram',
            subTitle: this.sellGoldPrice.goldSellPrice.toString(),
          }
          ]
      })

    }
    return {
      title: {
        id: 'SummaryTitle',
        title: 'public.summary',
      },
      sections: sections
    }
  }

  private showModal() {

    this.popupService.showPopup( {image: 'assets/img/warning.svg',
    form: getModalForm()}).subscribe((res: PopupOutputModel) => {
      switch (res.buttonId) {
        case 'backTimer':
          this.popupService.dismiss()
          this.stepperMoveBack()
          this.endButtons=[this.confirmButton]
          break;
        }

    });
  }

}
