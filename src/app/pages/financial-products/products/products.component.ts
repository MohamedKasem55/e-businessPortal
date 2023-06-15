import {Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from '@ngx-translate/core';
import {ExternalModelRes} from 'app/@core/model/rest/financial-products/external-model-res.model';
import {FinancialProductsService} from 'app/@core/service/financial-products/financial-products.service';
import { AmountModel } from 'arb-design-library/model/amount.model';
import {ButtonModel} from 'arb-design-library/model/button.model';
import { GenericFeatureAmountModel } from 'arb-design-library/model/generic-feature-amount.model';
import {GenericFeatureListModel} from 'arb-design-library/model/generic-feature-list.model';
import {TabModel} from "arb-design-library/model/tab.model";


@Component({
  selector: 'app-financial-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  tabs: TabModel[] = [];
  type: string = "";
  productsList: GenericFeatureListModel[] = [];
  featureList: GenericFeatureAmountModel[] = [];
  applyNow: ButtonModel = {
    id: '1',
    text: 'financial-products.get-it-now',
    type: 'outLine',
    suffixIcon:'arb-icon-arrowRight arb-icons-ar'
  };

  accounts: GenericFeatureListModel[] = [];
  cards: GenericFeatureListModel[] = [];
  cash: GenericFeatureListModel[] = [];
  business: GenericFeatureListModel[] = [];
  amounts:AmountModel[]=[];
  responses: ExternalModelRes[] = [];


  isExt: boolean = true;

  constructor(private router: Router, private route: ActivatedRoute, private location: Location, private financialProductsService: FinancialProductsService, private translate: TranslateService) {
    this.setTabs();
    this.isExt = this.router.url.includes("-ext");
  }

  setTabs() {
    this.tabs.push({text: "financial-products.accounts", value: "accounts"});
    this.tabs.push({
      text: "financial-products.cards",
      value: "cards"
    });
    this.tabs.push({
      text: "financial-products.cashProducts",
      value: "cash"
    });
    this.tabs.push({text: "financial-products.businessSolutions", value: "business"});
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe((params: any) => {
          this.tabChanged(params.type);
        }
      );

    this.financialProductsService.externalModel("CashManagementProducts").subscribe((data) => {
      this.responses.push(data);
      this.fillList();
    });
  }

  onTitleButtonClick(id: string) {
    this.location.back();
  }

  onButtonClick(id: string) {
    if (this.isExt) {
      void this.router.navigateByUrl('cash-management-products-ext/contact-request', {state: {type: id}})
    } else {
      void this.router.navigateByUrl('cash-management-products/contact-request', {state: {type: id}})
    }
  }

  fillList() {
    const props: any = this.responses.find(
      (a) => a.name === "CashManagementProducts"
    )!.props

    Object.keys(props).forEach((key) => {
      switch (key) {
        case 'CASH24':
        case 'CASH_PICK_UP':
        case 'POS':
        case 'DIVIDEND_DISTRIBUTION':
        case 'CASH_DEPOSIT_MACHINES':
          this.applyNow.id = key
          this.cash.push({
            id: props[key],
            title: "financial-products.overview",
            cardImg: this.getImg(key),
            cardTitle: props[key],
            description: this.getDescription(key),
            featureTitle:"financial-products.features",
            features: this.getFeatures(key),
            featureButton: this.applyNow,
            isHorizontal: true,
            amounts:this.getAmount(key),
          })
          break;
        case 'CREDIT_CARDS':
          this.applyNow.id = key
          this.cards.push({
            id: props[key],
            title: "financial-products.overview",
            cardImg: this.getImg(key),
            cardTitle: props[key],
            description: this.getDescription(key),
            isHorizontal: true,
            features: [
              {
                icon: "arb-icon-card3Dots fs-4 color-arb-secondaryText",
                text: this.getText(key, 1),
              },
              {
                icon: "arb-icon-insuranceSharp fs-4 color-arb-secondaryText",
                text: this.getText(key, 2),
              }, {
                icon: "arb-icon-clockArrowsRight fs-4 color-arb-secondaryText",
                text: this.getText(key, 3),
              },
              {
                icon: "arb-icon-FilledFalse fs-4 color-arb-secondaryText",
                text: this.getText(key, 4),
              }
            ],
            featureButton: this.applyNow
          })
          break;
        case 'E_PREPAID_CARDS':
          this.applyNow.id = key
          this.cards.push({
            id: props[key],
            title: "financial-products.overview",
            cardImg: this.getImg(key),
            cardTitle: props[key],
            description: this.getDescription(key),
            isHorizontal: true,
            features: [
              {
                icon: "arb-icon-loopArrowRight fs-4 color-arb-secondaryText",
                text: this.getText(key, 1),
              },
              {
                icon: "arb-icon-withdrawalMoney fs-4 color-arb-secondaryText",
                text: this.getText(key, 2),
              }, {
                icon: "arb-icon-wallet fs-4 color-arb-secondaryText",
                text: this.getText(key, 3),
              },
              {
                icon: "arb-icon-card fs-4 color-arb-secondaryText",
                text: this.getText(key, 4),
              }
            ],
            featureButton: this.applyNow
          })
          break;
        case 'PAYROLL_CARDS':
          this.applyNow.id = key
          this.cards.push({
            id: props[key],
            title: "financial-products.overview",
            cardImg: this.getImg(key),
            cardTitle: props[key],
            description: "financial-products.payroll-info",
            isHorizontal: true,
            features: [
              {
                icon: "arb-icon-loopArrowRight fs-4 color-arb-secondaryText",
                text: "financial-products.payroll-card-info1"
              },
              {
                icon: "arb-icon-withdrawalMoney fs-4 color-arb-secondaryText",
                text: "financial-products.payroll-card-info2"
              }, {
                icon: "arb-icon-wallet fs-4 color-arb-secondaryText",
                text: "financial-products.payroll-card-info3"
              },
              {
                icon: "arb-icon-card fs-4 color-arb-secondaryText",
                text: "financial-products.payroll-card-info4"
              }
            ],
            featureButton: this.applyNow
          })
          break;
        case 'B2B':
        case 'ECOMMERCE':
        case 'PAYROLL':
          this.applyNow.id = key
          this.business.push({
            id: props[key],
            title: "financial-products.overview",
            cardImg: this.getImg(key),
            cardTitle:key==='PAYROLL'?'Payroll':props[key],
            amounts:this.getAmount(key),
            description: this.getDescription(key),
            isHorizontal: true,
            featureTitle:"financial-products.features",
            features: this.getFeatures(key),
            featureButton: this.applyNow
          })
          break;
        case 'VIRTUAL_ACCOUNT':
        case 'ESCROW_ACCOUNT':
          this.applyNow.id = key
          this.accounts.push({
            id: props[key],
            title: "financial-products.overview",
            cardImg: this.getImg(key),
            cardTitle: props[key],
            description: this.getDescription(key),
            amounts:this.getAmount(key),
            isHorizontal: true,
            featureTitle:"financial-products.features",
            features:  this.getFeatures(key),
            featureButton: this.applyNow
          })
          break;
      }
    });
  }

  getImg(key: string): string {
    let img: string;
    switch (key) {
      case 'CASH24':
        img = 'assets/img/financial-products/cashTwentyFour.svg'
        break;
      case 'CASH_PICK_UP':
        img = 'assets/img/financial-products/cashPickUp.svg'
        break;
      case 'POS':
        img = 'assets/img/financial-products/pointOfSale.svg'
        break;
      case 'DIVIDEND_DISTRIBUTION':
        img = 'assets/img/financial-products/dividendDistribution.svg'
        break;
      case 'CASH_DEPOSIT_MACHINES':
        img = 'assets/img/financial-products/cashDepositMachine.svg'
        break;
      case 'CREDIT_CARDS':
        img = 'assets/img/financial-products/card-mada.png'
        break;
      case 'E_PREPAID_CARDS':
        img = 'assets/img/financial-products/card-prepaid.png'
        break;
      case 'PAYROLL_CARDS':
        img = 'assets/img/financial-products/card-visa.png'
        break;
      case 'B2B':
        img = 'assets/img/financial-products/b2b.svg'
        break;
      case 'ECOMMERCE':
        img = 'assets/img/financial-products/eCommerce.svg'
        break;
      case 'PAYROLL':
        img = 'assets/img/financial-products/payroll.svg'
        break;
      case 'VIRTUAL_ACCOUNT':
        img = 'assets/img/financial-products/escrowAccount.svg'
        break;
      case 'ESCROW_ACCOUNT':
        img = 'assets/img/financial-products/scrowAccount.svg'
        break;
    }
    return img!
  }

  getDescription(key: string): string {
    let description: string;
    switch (key) {
      case 'CASH24':
        description = 'financial-products.cash24-info'
        break;
      case 'CASH_PICK_UP':
        description = 'financial-products.cash-pick-info'
        break;
      case 'POS':
        description = 'financial-products.pos-info'
        break;
      case 'DIVIDEND_DISTRIBUTION':
        description = 'financial-products.div-dis-info'
        break;
      case 'CASH_DEPOSIT_MACHINES':
        description = 'financial-products.cash-deposit-info'
        break;
      case 'B2B':
        description = 'financial-products.b2b-description'
        break;
      case 'PAYROLL':
        description = 'financial-products.payroll-description'
        break;
      case 'ECOMMERCE':
        description = 'financial-products.ecommerce-description'
        break;
      case 'ESCROW_ACCOUNT':
          description = 'financial-products.escrow-account-description'
          break;
      case 'VIRTUAL_ACCOUNT':
        description = 'financial-products.virtual-account-description'
        break;
      case 'CREDIT_CARDS':
        description ="financial-products.cc-description";
        break;
      case 'E_PREPAID_CARDS':
        description = "financial-products.eprepaid-description";
        break;
      default:
        description = ''
        break;
    }
    return description!
  }

  getText(key: string, num?: number): string {
    let text: string;
    switch (key) {
      case 'CREDIT_CARDS':
        if (num === 1) {
          text = 'financial-products.credit-card-info1'
        } else if (num === 2) {
          text = 'financial-products.credit-card-info2'
        } else if (num === 3) {
          text = 'financial-products.credit-card-info3'
        } else {
          text = 'financial-products.credit-card-info4'
        }
        break;
      case 'E_PREPAID_CARDS':
        if (num === 1) {
          text = 'financial-products.eprepaid-info1'
        } else if (num === 2) {
          text = 'financial-products.eprepaid-info2'
        } else if (num === 3) {
          text = 'financial-products.eprepaid-info3'
        } else {
          text = 'financial-products.eprepaid-info4'
        }
        break;
      case 'PAYROLL_CARDS':
        if (num === 1) {
          text = 'financial-products.payroll-card-info1'
        } else if (num === 2) {
          text = 'financial-products.payroll-card-info2'
        } else if (num === 3) {
          text = 'financial-products.payroll-card-info3'
        } else {
          text = 'financial-products.payroll-card-info4'
        }
        break;

      case 'B2B':
        text = 'financial-products.b2b-info'
        break;
      case 'ECOMMERCE':
        text = 'financial-products.ecommerce-info'
        break;
      case 'PAYROLL':
        text = 'financial-products.payroll-info'
        break;
      case 'VIRTUAL_ACCOUNT':
        if (num === 1) {
          text = 'financial-products.virtual-account-info1'
        } else if (num === 2) {
          text = 'financial-products.virtual-account-info2'
        } else {
          text = 'financial-products.virtual-account-info3'
        }
        break;
      case 'ESCROW_ACCOUNT':
        if (num === 1) {
          text = 'financial-products.escrow-account-info1'
        } else if (num === 2) {
          text = 'financial-products.escrow-account-info2'
        } else {
          text = 'financial-products.escrow-account-info3'
        }
        break;
      default:
        text = ''
        break;
    }
    return this.translate.instant(text!)
  }

  tabChanged(id: string) {
    this.type = id;
    switch (this.type) {
      case "accounts":
        this.location.replaceState('cash-management-products?type=accounts');
        break;
      case "cards":
        this.location.replaceState('cash-management-products?type=cards');
        break;
      case "cash":
        this.location.replaceState('cash-management-products?type=cash');
        break;
      case "business":
        this.location.replaceState('cash-management-products?type=business');
        break;
      default:
        this.type = 'accounts'
        this.location.replaceState('cash-management-products?type=accounts');
        break;
    }
  }

  getFeatures(key:string){
    switch(key){
      case 'B2B':
        this.featureList = [
          {
            icon: "arb-icon-handHeart fs-4 color-arb-secondaryText",
            text: "financial-products.b2b-features.feature-1",
          },
          {
            icon: "arb-icon-Two-Arrows fs-4 color-arb-secondaryText",
            text: "financial-products.b2b-features.feature-2",
          },
          {
            icon: "arb-icon-heartBeat fs-4 color-arb-secondaryText",
            text: "financial-products.b2b-features.feature-3",
          },
          {
            icon: "arb-icon-circle fs-4 color-arb-secondaryText",
            text: "financial-products.b2b-features.feature-4",
          }
        ]
        break;
      case 'ECOMMERCE':
        this.featureList = [
          {
            icon: "arb-icon-other fs-4 color-arb-secondaryText",
            text: "financial-products.ecommerce-features.feature-1",
          },
          {
            icon: "arb-icon-Bill fs-4 color-arb-secondaryText",
            text: "financial-products.ecommerce-features.feature-2",
          },
          {
            icon: "arb-icon-refresh2Arrows fs-4 color-arb-secondaryText",
            text: "financial-products.ecommerce-features.feature-3",
          },
          {
            icon: "arb-icon-document fs-4 color-arb-secondaryText",
            text: "financial-products.ecommerce-features.feature-4",
          }
        ]
        break;
      case 'PAYROLL':
          this.featureList = [
            {
              icon: "arb-icon-userLogo fs-4 color-arb-secondaryText",
            text: "financial-products.payroll-features.feature-1",
            },
            {
              icon: "arb-icon-refundDollarCircleArrow fs-4 color-arb-secondaryText",
            text: "financial-products.payroll-features.feature-2",
            },
            {
              icon: "arb-icon-documentWithCurrencySR fs-4 color-arb-secondaryText",
            text: "financial-products.payroll-features.feature-3",
            },
            {
              icon: "arb-icon-wps fs-4 color-arb-secondaryText",
            text: "financial-products.payroll-features.feature-4",
            }
          ]
        break;
      case 'VIRTUAL_ACCOUNT':
          this.featureList = [
            {
              icon: "arb-icon-electricity fs-4 color-arb-secondaryText",
              text: "financial-products.virtual-account-features.feature-1",
            },
            {
              icon: "arb-icon-document fs-4 color-arb-secondaryText",
              text: "financial-products.virtual-account-features.feature-2",
            },
            {
              icon: "arb-icon-userInfo fs-4 color-arb-secondaryText",
              text: "financial-products.virtual-account-features.feature-3",
            },
            {
              icon: "arb-icon-documentWithArrowUp fs-4 color-arb-secondaryText",
              text: "financial-products.virtual-account-features.feature-4",
            }
          ]
        break;
      case 'ESCROW_ACCOUNT':
          this.featureList = [
            {
              icon: "arb-icon-clockCheckmark fs-4 color-arb-secondaryText",
              text: "financial-products.escrow-account-features.feature-1",
            },
            {
              icon: "arb-icon-documentCheck fs-4 color-arb-secondaryText",
              text: "financial-products.escrow-account-features.feature-2",
            },
            {
              icon: "arb-icon-documentWithTwoCircleArrows fs-4 color-arb-secondaryText",
              text: "financial-products.escrow-account-features.feature-3",
            },
            {
              icon: "arb-icon-hierarchy fs-4 color-arb-secondaryText",
              text: "financial-products.escrow-account-features.feature-4",
            }
          ]
        break;
      case 'CASH24':
          this.featureList = [
            {
              icon: "arb-icon-cardCheck fs-4 color-arb-secondaryText",
              text: "financial-products.cash24-features.feature-1",
            },
            {
              icon: "arb-icon-atm fs-4 color-arb-secondaryText",
              text: "financial-products.cash24-features.feature-2",
            },
            {
              icon: "arb-icon-cardAdd fs-4 color-arb-secondaryText",
              text: "financial-products.cash24-features.feature-3",
            },
            {
              icon: "arb-icon-exchangeWideArrows fs-4 color-arb-secondaryText",
              text: "financial-products.cash24-features.feature-4",
            },
          ]
        break;
      case 'CASH_PICK_UP':
          this.featureList = [
            {
              icon: "arb-icon-cardCashArrow fs-4 color-arb-secondaryText",
              text: "financial-products.cash-pick-features.feature-1",
            },
            {
              icon: "arb-icon-clock fs-4 color-arb-secondaryText",
              text: "financial-products.cash-pick-features.feature-2",
            },
            {
              icon: "arb-icon-loopArrowRight fs-4 color-arb-secondaryText",
              text: "financial-products.cash-pick-features.feature-3",
            },
            {
              icon: "arb-icon-saudiBold fs-4 color-arb-secondaryText",
              text: "financial-products.cash-pick-features.feature-4",
            },
          ]
        break;
      case 'POS':
          this.featureList = [
            {
              icon: "arb-icon-building fs-4 color-arb-secondaryText",
              text: "financial-products.pos-features.feature-1",
            },
            {
              icon: "arb-icon-posCard fs-4 color-arb-secondaryText",
              text: "financial-products.pos-features.feature-2",
            },
            {
              icon: "arb-icon-insurance fs-4 color-arb-secondaryText",
              text: "financial-products.pos-features.feature-3",
            },
            {
              icon: "arb-icon-documentCheck fs-4 color-arb-secondaryText",
              text: "financial-products.pos-features.feature-4",
            },
          ]
        break;
      case 'DIVIDEND_DISTRIBUTION':
          this.featureList = [
            {
              icon: "arb-icon-clockDollar fs-4 color-arb-secondaryText",
              text: "financial-products.div-dis-features.feature-1",
            },
            {
              icon: "arb-icon-Bill fs-4 color-arb-secondaryText",
              text: "financial-products.div-dis-features.feature-2",
            },
            {
              icon: "arb-icon-saudiBold fs-4 color-arb-secondaryText",
              text: "financial-products.div-dis-features.feature-3",
            },
            {
              icon: "arb-icon-document fs-4 color-arb-secondaryText",
              text: "financial-products.div-dis-features.feature-4",
            },
          ]
        break;
      case 'CASH_DEPOSIT_MACHINES':
          this.featureList = [
            {
              icon: "arb-icon-paperPenVerification fs-4 color-arb-secondaryText",
              text: "financial-products.cash-deposit-features.feature-1",
            },
            {
              icon: "arb-icon-saudiBold fs-4 color-arb-secondaryText",
              text: "financial-products.cash-deposit-features.feature-2",
            },
            {
              icon: "arb-icon-heart fs-4 color-arb-secondaryText",
              text: "financial-products.cash-deposit-features.feature-3",
            },
            {
              icon: "arb-icon-cardCashArrow fs-4 color-arb-secondaryText",
              text: "financial-products.cash-deposit-features.feature-4",
            },
          ]
        break;
        }
    return this.featureList;
  }

  getAmount(key: string): AmountModel[] {
    this.amounts = []
    switch (key) {
      case 'B2B':
      case 'POS':
        // this.amounts.push({amount:'Free'})
        break;
      case 'ECOMMERCE':
      case 'CASH24':
      case 'VIRTUAL_ACCOUNT':
        // this.amounts.push(
        //   {
        //     amount:'12,999.00',
        //     currency:'SAR',
        //     perDuration:'Year',
        //   }
        // )
        break;
      case 'ESCROW_ACCOUNT':
      case 'CASH_PICK_UP':
      case 'DIVIDEND_DISTRIBUTION':
          // this.amounts.push(
          //   {
          //     amount:'12,999.00',
          //     currency:'SAR',
          //     perDuration:'Year',
          //     amountColorClass:'color-arb-secondaryText',
          //     isDeleted:true
          // },
          //   {
          //     amount:'Free Now',
          //   }
          // )
          break;
      default:
        // this.amounts.push(
        //   {
        //     amount:'12,999.00',
        //     currency:'SAR',
        //     perDuration:'Year',
        //     amountColorClass:'color-arb-secondaryText',
        //     isDeleted:true
        //   },
        //   {
        //     amount:'3,999.00',
        //     currency:'SAR',
        //     perDuration:'Year'
        //   }
        // )
        break;
    }
    return this.amounts;
  }
}
