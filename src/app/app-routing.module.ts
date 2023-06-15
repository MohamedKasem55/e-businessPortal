import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ApplicationGuard} from "./@core/service/base/application.guard";
import {DashboardLayoutComponent} from "./layout/dashboard-layout/dashboard-layout.component";
import {COM_AD, POS} from "./@core/constants/pages-urls-constants";
import { ReviewComponent } from './shared/review/review.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/pre-login/pre-login.module').then((m) => m.PreLoginModule)
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'transfer',
        loadChildren: () =>
          import('./pages/transfer/transfer.module').then((m) => m.TransferModule),
      },
      {
        path: 'payments',
        loadChildren: () =>
          import('./pages/payments/payments.module').then((m) => m.PaymentsModule),
      },
      {
        path: 'gold-wallet',
        loadChildren: () =>
          import('./pages/gold-wallet/gold-wallet.module').then(
            (m) => m.GoldWalletModule
          ),
      },
      {
        path: 'cards',
        loadChildren: () =>
          import('./pages/cards/cards.module').then((m) => m.CardsModule),
      },
      {
        path: 'accounts',
        loadChildren: () =>
          import('./pages/accounts/accounts.module').then((m) => m.AccountsModule),
      },
      {
        path: COM_AD,
        loadChildren: () =>
          import('./pages/company-admin/company-admin.module').then(
            (m) => m.CompanyAdminModule
          ),
      },
      {
        path: 'payroll',
        loadChildren: () =>
          import('./pages/payroll/payroll.module').then((m) => m.PayrollModule),
      },
      {
        path: 'finance',
        loadChildren: () =>
          import('./pages/finance/finance.module').then((m) => m.FinanceModule),
      },
      {
        path: POS,
        loadChildren: () => import('./pages/pos/pos.module').then((m) => m.PosModule),
      },
      {
        path: 'representatives',
        loadChildren: () =>
          import('./pages/representatives/representatives.module').then(
            (m) => m.RepresentativesModule
          ),
      },
      {
        path: 'business-hub',
        loadChildren: () =>
          import('./pages/business-hub/business-hub.module').then(
            (m) => m.BusinessHubModule
          ),
      },
      {
        path: 'cheques',
        loadChildren: () =>
          import('./pages/cheques/cheques.module').then((m) => m.ChequesModule),
      },
      {
        path: 'pendingActions',
        loadChildren: () =>
          import('./pages/pending-actions/pending-actions.module').then(
            (m) => m.PendingActionsModule
          ),
      },
      {
        path: 'help',
        loadChildren: () =>
          import('./pages/help/help.module').then((m) => m.HelpModule),
      },
      {
        path: 'cash-management-products',
        loadChildren: () =>
          import('./pages/financial-products/financial-products.module').then(
            (m) => m.FinancialProductsModule
          ),
      },
      {
        path: 'user-profile',
        loadChildren: () =>
          import('./pages/user-profile/user-profile.module').then((m) => m.UserProfileModule),
      },
      {
        path:"connectBankReview",
        component:ReviewComponent
      }
    ],
    canActivate: [ApplicationGuard],
    canLoad: [ApplicationGuard],
    canActivateChild: [ApplicationGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
