import {AccountsRes} from "../../@core/model/rest/accounts/accounts-res";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import { ServiceLocator } from 'app/@core/service/base/service-locator.service';
import { DashboardService } from 'app/@core/service/dashboard/dashboard.service';

export abstract class DashboardBase {

  translate!: TranslateService;
  router!: Router;
  accounts!: AccountsRes;
  dashboardService: DashboardService;

  constructor( 
  ) {
    this.translate = ServiceLocator.injector.get(TranslateService);
    this.router = ServiceLocator.injector.get(Router);
    this.dashboardService = ServiceLocator.injector.get(DashboardService);
    
  }

  setAccounts(accounts: AccountsRes) {
    this.accounts = accounts
  }

}
