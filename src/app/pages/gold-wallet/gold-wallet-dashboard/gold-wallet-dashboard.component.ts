import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import { PopupInputModel } from 'app/@core/model/dto/popup.model';
import { GoldWalletDashboardRes } from 'app/@core/model/rest/gold-wallet/gold-wallet-dashboard-res';
import {
  GoldWalletFilterType,
  GoldWalletTransactionsReq
} from 'app/@core/model/rest/gold-wallet/gold-wallet-transactions-req';
import { BreadcrumbService } from 'app/@core/service/base/breadcrumb.service';
import { GoldWalletService } from 'app/@core/service/gold-wallet/gold-wallet.service';
import { TableHeaderType } from 'arb-design-library';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { PaginationValueModel } from "arb-design-library/model/pagination.model";
import { PillModel } from 'arb-design-library/model/pill.model';
import { TabModel } from "arb-design-library/model/tab.model";
import { TableHeaderModel } from 'arb-design-library/model/table-header.model';
import { take } from 'rxjs';
import { getDetailForm, getEndButtons, getTableTitle } from './gold-wallet-dashboard-contrlos';


@Component({
  selector: 'app-gold-wallet-dashboard',
  templateUrl: './gold-wallet-dashboard.component.html',
  styleUrls: []
})
export class GoldWalletDashboardComponent implements OnInit {

  tabs: TabModel[] = [];
  type: string = "";
  headers: TableHeaderModel[] = [];
  data!: any[] | undefined;
  total: number = 0;
  detailsForm: PopupInputModel = getDetailForm();
  transactionsReq!: GoldWalletTransactionsReq;
  walletDashboard!: GoldWalletDashboardRes;

  buttonList: ButtonModel[] = [];
  endButtons: ButtonModel[] = [];
  prices: any[] = [];

  pillOpen:PillModel={
    text:'gold-wallet.open',
    type:'Positive'
  }

  pillClose:PillModel={
    text:'gold-wallet.close',
    type:'Negative'
  }

  pill!:PillModel

  constructor(private router: Router, private breadcrumbService: BreadcrumbService, private location: Location, private translateService: TranslateService, private goldWalletService: GoldWalletService) {
    this.setTabs();
    this.buttonList = getTableTitle();
    this.goldWalletService.getDashboard().subscribe(
      (res: GoldWalletDashboardRes) => {
    this.walletDashboard = res;

    this.endButtons = this.walletDashboard.marketInformation.marketOpened ? getEndButtons() : [];

    this.pill=this.walletDashboard.marketInformation.marketOpened ?this.pillOpen:this.pillClose

    this.prices.push({
      text: this.translateService.instant("gold-wallet.marketPrice"),
      amount: this.walletDashboard.marketInformation.marketOpened ? this.walletDashboard.marketInformation.marketPrice : '-',
      currency: "SAR/g",
    })
    this.prices.push({
      text: this.translateService.instant("gold-wallet.buyPrice"),
      amount: this.walletDashboard.marketInformation.marketOpened ? this.walletDashboard.marketInformation.buyPrice : '-',
      currency: "SAR/g",
    })
    this.prices.push({
      text: this.translateService.instant("gold-wallet.sellPrice"),
      amount: this.walletDashboard.marketInformation.marketOpened ? this.walletDashboard.marketInformation.sellPrice : '-',
      currency: "SAR/g",
    })
    this.tabChanged("last-transactions");

      });

  }

  setTabs() {
    this.tabs.push({text: "gold-wallet.dashboard.myGold", value: "my-gold"});
    this.tabs.push({
      text: "gold-wallet.dashboard.lastTransactions",
      value: "last-transactions"
    });
  }

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumb([])
  }

  titleButton(id: string) {
    switch (id) {
      case 'download':
        let file = 'gold-wallet-' + this.translateService.currentLang + '.pdf'
        this.goldWalletService.getTermsAndConditions(file);
        break;
    }
  }

  onTitleButtonClick(id: string) {
    switch (id) {
      case 'arrowTitle':
        void this.router.navigateByUrl("/dashboard");
        break;
      case 'sell':
        this.router.navigateByUrl("/gold-wallet/sell", {state: {wallet: this.walletDashboard}}).then(() => {
        });
        break;
      case 'buy':
        this.router.navigateByUrl("/gold-wallet/buy", {state: {wallet: this.walletDashboard}}).then(() => {
        });
        break;
    }
  }

  getMyGold() {
    this.headers = [];
    let headers: TableHeaderModel[] = [];

    headers.push({
      title: "gold-wallet.dashboard.goldWeight",
      type: TableHeaderType.TEXT,
      fieldName: "amount"
    });
    headers.push({
      title: "gold-wallet.dashboard.transactionId",
      type: TableHeaderType.BUTTON,
      fieldName: "serialNumber",
      controlOptions: {
        id: "details",
        text: "serialNumber"
      }
    });
    headers.push({
      title: "gold-wallet.dashboard.purchasePrice",
      type: TableHeaderType.AMOUNT_TEXT,
      fieldName: "costPrice",
      controlOptions: {currency: 'currency'}
    });

    this.headers = headers;
  }

  getLastTransactions() {
    this.headers = [];
    let headers: TableHeaderModel[] = [];
    headers.push({title: "gold-wallet.dashboard.type", type: TableHeaderType.TEXT, fieldName: "transactionType"});
    headers.push({title: "gold-wallet.dashboard.weight", type: TableHeaderType.TEXT, fieldName: "amount"});
    headers.push({
      title: "gold-wallet.dashboard.amount",
      type: TableHeaderType.AMOUNT_TEXT,
      fieldName: "costPrice",
      controlOptions: {currency: 'currency'}
    });
    headers.push({title: "gold-wallet.dashboard.goldCode", type: TableHeaderType.TEXT, fieldName: "goldCode"});
    headers.push({title: "gold-wallet.dashboard.purity", type: TableHeaderType.TEXT, fieldName: "purity"});
    headers.push({title: "gold-wallet.dashboard.goldSource", type: TableHeaderType.TEXT, fieldName: "goldSource"});
    headers.push({title: "gold-wallet.dashboard.vendor", type: TableHeaderType.TEXT, fieldName: "vendorName"});
    headers.push({
      title: "gold-wallet.dashboard.goldStatus",
      type: TableHeaderType.TEXT,
      fieldName: "transactionStatus"
    });
    headers.push({
      title: "gold-wallet.dashboard.date",
      type: TableHeaderType.DATE_TEXT,
      fieldName: "transactionDate",
      controlOptions: {format: 'dd/MM/yyyy'}
    });
    headers.push({
      title: "gold-wallet.dashboard.transactionId",
      type: TableHeaderType.BUTTON,
      fieldName: "serialNumber",
      controlOptions: {
        id: "details",
        text: "serialNumber"
      }
    });
    headers.push({
      title: "gold-wallet.dashboard.referenceNumber",
      type: TableHeaderType.TEXT,
      fieldName: "serialNumber"
    });


    this.headers = headers;
  }

  onButtonClick(event: any) {
    this.router.navigateByUrl("/gold-wallet/details", {
      state: {
        info: event.row,
        wNumber: this.walletDashboard.walletNum,
        account: this.walletDashboard.linkedAccountNumber
      }
    }).then(() => {
    })
  }

  setTransactionsReq(options: GoldWalletTransactionsReq = {
    page: 1,
    rows: 50
  }) {
    this.transactionsReq = {
      filterType: this.type === 'my-gold' ? GoldWalletFilterType.MY_GOLD : GoldWalletFilterType.LAST_TRANSACTION,
      walletNum: this.walletDashboard.walletNum,
      page: options.page || 1,
      rows: options.rows || 50,
    };
  }

  getTransactions() {
    this.goldWalletService.getTransactions(this.transactionsReq).pipe(take(1)).subscribe({
      next: (res) => {
        switch (this.type) {
          case "my-gold":
            if (res.myGold?.size) {
              this.data = res.myGold.items;
              this.total = res.myGold.total;
            } else {
              this.data = [];
            }
            break;
          case "last-transactions":
            if (res.myLastTransaction?.size) {
              this.data = res.myLastTransaction.items;
              this.total = res.myLastTransaction.total;
            } else {
              this.data = [];
            }
            break;
        }
      },
      error: () => {
        this.data = [];
        this.total = 0;
      }
    });

  }

  tabChanged(id: string) {
    this.data= undefined;
    this.type = id;
    switch (this.type) {
      case "my-gold":
        this.getMyGold();
        break;
      case "last-transactions":
        this.getLastTransactions();
        break;
    }
    this.setTransactionsReq();
    this.getTransactions();
  }


  externalPagination(data: PaginationValueModel) {
    this.setTransactionsReq({page: data.page, rows: data.size});
    this.getTransactions();
  }


}
