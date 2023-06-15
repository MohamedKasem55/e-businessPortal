import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoldWalletBuyComponent } from './gold-wallet-buy/gold-wallet-buy.component';
import { GoldWalletDetailsComponent } from './gold-wallet-dashboard/details/gold-wallet-details.component';
import { GoldWalletDashboardComponent } from './gold-wallet-dashboard/gold-wallet-dashboard.component';
import { GoldWalletSellComponent } from './gold-wallet-sell/gold-wallet-sell.component';
import { GoldWalletComponent } from './gold-wallet.component';
import { GoldWalletOnBoardComponent } from './on-board/gold-wallet-on-board.component';
import {PagesGuard} from "../pages.guard";

const routes: Routes = [
  {
    path: '',
    component: GoldWalletComponent,
  },
  {
    path: 'dashboard',
    component: GoldWalletDashboardComponent,
    canActivate: [PagesGuard],
    data: {service: 'GoldWallet'},
  },
  {
    path: 'buy',
    component: GoldWalletBuyComponent,
    canActivate: [PagesGuard],
    data: {service: 'GoldWallet'},
  },
  {
    path: 'sell',
    component: GoldWalletSellComponent,
    canActivate: [PagesGuard],
    data: {service: 'GoldWallet'},
  },
  {
    path: 'on-boarding',
    component: GoldWalletOnBoardComponent,
    canActivate: [PagesGuard],
    data: {service: 'GoldWallet'},
  },
  {
    path: 'details',
    component: GoldWalletDetailsComponent,
    canActivate: [PagesGuard],
    data: {service: 'GoldWallet'},
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoldWalletRoutingModule {}
