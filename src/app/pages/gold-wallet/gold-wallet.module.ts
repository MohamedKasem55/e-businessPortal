import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GoldWalletService } from 'app/@core/service/gold-wallet/gold-wallet.service';


import { SharedModule } from '../../shared/shared.module';
import { GoldWalletBaseComponent } from './gold-wallet-base/gold-wallet-base.component';
import { GoldWalletBuyComponent } from './gold-wallet-buy/gold-wallet-buy.component';
import { GoldWalletDetailsComponent } from './gold-wallet-dashboard/details/gold-wallet-details.component';
import { GoldWalletDashboardComponent } from './gold-wallet-dashboard/gold-wallet-dashboard.component';
import { GoldWalletRoutingModule } from './gold-wallet-routing.module';
import { GoldWalletSellComponent } from './gold-wallet-sell/gold-wallet-sell.component';
import { GoldWalletComponent } from './gold-wallet.component';
import { GoldWalletOnBoardComponent } from './on-board/gold-wallet-on-board.component';

@NgModule({
  declarations: [
    GoldWalletDashboardComponent,
    GoldWalletBuyComponent,
    GoldWalletOnBoardComponent,
    GoldWalletBaseComponent,
    GoldWalletSellComponent,
    GoldWalletComponent,
    GoldWalletDetailsComponent
  ],
  imports: [CommonModule, GoldWalletRoutingModule, SharedModule],
  providers: [
    GoldWalletService
  ],
})
export class GoldWalletModule {}
