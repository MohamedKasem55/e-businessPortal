import {Subject, take, takeUntil} from 'rxjs';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Utils} from "../../@core/utility/Utils";
import {CampaignModel} from "arb-design-library/model/campaign.model";
import {DashboardBase} from './dashboard-base';
import {
  TopBillReportViews,
  TopTansferReport
} from 'app/@core/model/rest/dashboard/dashboard-top-bills-transfers-res.model';
import {NgbPopover} from "@ng-bootstrap/ng-bootstrap";
import {HelpWizardService} from "../../@core/service/base/help-wizard.service";
import {ThemeService} from "../../theme";
import {SlideModel} from "ngx-owl-carousel-o";
import {AuthenticationUtils} from "../../@core/utility/authentication-utils";
import {AlertModel} from "../../@core/model/dto/alert.model";
import {AccountsRes} from 'app/@core/model/rest/accounts/accounts-res';

@Component({
  selector: 'app-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent extends DashboardBase implements OnInit, OnDestroy {

  eligibleJuridicalState: boolean;
  showPendingActions: boolean;
  campaignItems: CampaignModel[] = [];
  topBillsList!: TopBillReportViews[];
  topTransfersList!: TopTansferReport[];

  currentPopover!: NgbPopover | null;
  popTitle = "public.popOver.account";
  popText = "public.popOver.account-text";

  canCallDashboardService: boolean = false;


  alertNationalAddress: AlertModel = {
    id: 'national-address',
    title: 'national-address.alert-message',
    message: 'national-address.message',
    action: 'national-address.update',
    showClose: true,
    type: 'Normal',
  };
  alert: boolean = true;

  showAddMoreAccounts: boolean = false


  destroy$ = new Subject();
  @ViewChild('accountPopover') accountPopover!: NgbPopover;
  @ViewChild('pendingActionPopover') pendingActionPopover!: NgbPopover;
  @ViewChild('campaignPopover') campaignPopover!: NgbPopover;


  constructor(
    private helpWizardService: HelpWizardService,
    private themeService: ThemeService,
  ) {
    super();
    this.eligibleJuridicalState = AuthenticationUtils.isSolePropertyCompany;
    this.showPendingActions = AuthenticationUtils.showPendingActions;
    this.canCallDashboardService= AuthenticationUtils.serviceIsActive("TopTransactionDashboard");

    this.setCampaign();
    Utils.setBreadcrumb([]);
    this.loadBillsTransfersSections();


    helpWizardService.onStartHelpWizardOnDashBoard().pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.startPopOver();
    });

    ThemeService.onThemeChanged.subscribe(() => {
      this.setCampaign();
    });

    this.showAlert();

  }

  ngOnInit(): void {
    Utils.scrollTop();
  }

  showAlert() {
    const welcome = JSON.parse(
      sessionStorage.getItem('welcome')!
    ).nationalAdress;
    const shown = sessionStorage.getItem('firstVisualizationNationalAddress');
    this.alert = welcome == 'N' && !shown ? true : false;
  }

  resetAndNavigateUpdateAddress(navigate?: boolean) {
    sessionStorage.setItem('firstVisualizationNationalAddress', 'shown');
    if (navigate) {
      this.router.navigate(['/company-admin/national-address']);
    }
    this.showAlert();
  }

  setCampaign() {
    let lang = this.translate.currentLang;
    let theme = this.themeService.getActiveTheme().name;
    this.campaignItems = [];
    for (let index = 1; index < 6; index++) {
      this.campaignItems.push({
        id: index.toString(),
        img: 'assets/campaign/' + theme + '/' + lang + '/' + index + '.png'
      })
    }
  }

  campaignSelect(item: SlideModel) {
    switch (item.id) {
      case "1":
        void this.router.navigateByUrl("/payroll");
        break;
      case "2":
        AuthenticationUtils.serviceIsActive('CardsManagement') && void this.router.navigateByUrl("/cards");
        break;
      case "3":
        void this.router.navigateByUrl("/finance");
        break;
      case "4":
        AuthenticationUtils.serviceIsActive('GoldWallet') && void this.router.navigateByUrl("/gold-wallet");
        break
      case "5":
        void this.router.navigateByUrl("/pos");
        break
    }
  }

  loadBillsTransfersSections() {
    if (!this.canCallDashboardService) return;
    this.dashboardService.getDashboardTopBillsTransfers()
      .pipe(take(1))
      .subscribe({
        next: res => {
          this.topBillsList = res.topBillReportViews;
          this.topTransfersList = res.topTansferReport;
        },
        error: () => {
        }
      });
  }

  popoverSkip() {
    this.currentPopover?.close();
  }

  popoverNext() {
    this.currentPopover?.close();
    setTimeout(() => {
      switch (this.currentPopover) {
        case this.accountPopover:
          if (AuthenticationUtils.showPendingActions) {
            this.currentPopover = this.pendingActionPopover;
            this.popTitle = "public.popOver.pending-action";
            this.popText = "public.popOver.pending-action-text";
          } else {
            this.currentPopover = this.campaignPopover;
            this.popTitle = "public.popOver.campaign";
            this.popText = "public.popOver.campaign-text";
          }
          break;
        case this.pendingActionPopover:
          this.currentPopover = this.campaignPopover;
          this.popTitle = "public.popOver.campaign";
          this.popText = "public.popOver.campaign-text";
          break;
        case this.campaignPopover:
          this.helpWizardService.resumeHelpWizardOnDashBoardLayout();
          return;
          break
      }
      this.currentPopover?.open();
    }, 100);
  }

  startPopOver() {
    setTimeout(() => {
      this.accountPopover.open();
      this.currentPopover = this.accountPopover;
    });
  }

  override setAccounts(accounts: AccountsRes) {
    this.accounts = accounts;
    this.showAddMoreAccounts =
      (accounts.listAccount && accounts.listAccount?.length < 4) || false;
  }


  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

}
