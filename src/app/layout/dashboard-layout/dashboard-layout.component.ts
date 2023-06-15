import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {Router} from '@angular/router';
import {
  CHANGE_PASSWORD,
  MANAGE_ALERTS,
  POS
} from 'app/@core/constants/pages-urls-constants';
import {AvatarModel} from 'arb-design-library/model/avatar.model';
import {BreadcrumbModel} from 'arb-design-library/model/breadcrumb.model';
import {DropdownOptionsModel, SearchListOptionsModel} from 'arb-design-library/model/dropdown-options.model';
import {ListItemModel} from 'arb-design-library/model/list-item.model';
import {SubsidiariesModel} from '../../@core/model/dto/subsidiaries';
import {BreadcrumbService} from '../../@core/service/base/breadcrumb.service';
import {LanguageService} from '../../@core/service/base/language.service';
import {LoadingService} from '../../@core/service/base/loading.service';
import {ModelAndListService} from '../../@core/service/base/modelAndList.service';
import {SubsidiaryService} from '../../@core/service/base/subsidiaryService';
import {UserService} from '../../@core/service/login/user.service';
import {ThemeService} from "../../theme";
import {Utils} from "../../@core/utility/Utils";
import {Store} from '@ngrx/store';
import {getPendingActions, getUserInfo} from 'app/shared/store/shared.reducer';
import {Subject, takeUntil} from 'rxjs';
import {NgbModal, NgbPopover} from "@ng-bootstrap/ng-bootstrap";
import {HelpWizardService} from "../../@core/service/base/help-wizard.service";
import {PendingActionFactory} from 'app/@core/service/base/pending-action-factory.service';
import {SearchService} from 'app/shared/search/search.service';
import {AuthenticationUtils} from "../../@core/utility/authentication-utils";
import {profileMenuItemsControls, dashboardLayoutControls} from "./dashboard-layout.controls";


@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  userName = '';
  companyName = '';
  date = new Date();
  toggleMenu: boolean = true;
  totalNotification: number | undefined;
  notifications!: DropdownOptionsModel[];
  topBarNotifications!: DropdownOptionsModel[];
  breadcrumb: BreadcrumbModel[] = [];
  subsidiariesModel: SubsidiariesModel = {};
  avatar: AvatarModel = {type: 'img', value: 'assets/img/profile.svg'};
  showPendingActions: boolean;
  profileMenuItems: DropdownOptionsModel[];

  displayLightMenu: boolean;

  menu: ListItemModel[];
  destroy$ = new Subject();

  globalSearchList!: SearchListOptionsModel[];

  showWizard: boolean = false
  popTitle = "public.popOver.dashboard";
  popText = "public.popOver.dashboard-text";
  currentPopover!: NgbPopover | null;
  nextWizardClose: boolean = false;


  @ViewChild('menuIcon') menuIcon!: ElementRef;
  @ViewChild('dashboardPopover') dashboardPopover!: NgbPopover;
  @ViewChild('searchPopover') searchPopover!: NgbPopover;
  @ViewChild('menuPopover') menuPopover!: NgbPopover;
  @ViewChild('notificationPopover') notificationPopover!: NgbPopover;
  @ViewChild('userPopover') userPopover!: NgbPopover;

  constructor(
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private subsidiaryService: SubsidiaryService,
    private loadingService: LoadingService,
    private languageService: LanguageService,
    private modelAndListService: ModelAndListService,
    private renderer: Renderer2,
    private userService: UserService,
    private themeService: ThemeService,
    private store: Store,
    private pendingActionFactory: PendingActionFactory,
    private searchService: SearchService,
    private helpWizardService: HelpWizardService,
  ) {

    this.menu = dashboardLayoutControls();
    this.profileMenuItems = AuthenticationUtils.hasAccess('AlertsMenu')?profileMenuItemsControls():profileMenuItemsControls().filter(item => item.id !== 'manageAlerts');
    this.showPendingActions = AuthenticationUtils.showPendingActions;
    this.displayLightMenu = JSON.parse(localStorage.getItem("LightMenuToggle") ? localStorage.getItem("LightMenuToggle")! : "false");

    setInterval(() => {
      this.date = new Date();
    }, 1000);
    this.setThemeName();
    router.events.subscribe((val: any) => {
      if (val.url) {
        let index = val.url.toLowerCase().indexOf("/", 1);
        let url = val.url.toLowerCase();
        if (index > 1) {
          url = url.substring(0, index);
        }
        this.menu.forEach((item) => {
          item.isActive = item.url.toLowerCase().endsWith(url) || item.url.toLowerCase() == url;
        });
      }
    });

    this.breadcrumbService
      .onBreadcrumbChanged()
      .subscribe((data: BreadcrumbModel[]) => {
        setTimeout(() => {
          this.breadcrumb = data;
        });
      });


    this.setNotification();
    this.setUser();
    this.globalSearchList = this.searchService.getGlobalSearchItems();
  }

  async setUser() {
    this.store.select(getUserInfo).pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.userName = user.nickname || user.userName;
        if (user?.userImage) {
          this.avatar.value = user.userImage;
        }
      })
    this.companyName = JSON.parse(
      sessionStorage.getItem('company')!
    ).companyName;
  }

  async setNotification() {
    await this.pendingActionFactory.fetchPendingActions();
    this.store.select(getPendingActions).pipe(takeUntil(this.destroy$))
      .subscribe(actions => {
        actions && this.getNotificationCounts(actions)
      });
  }

  getNotificationCounts(actions: { [key: string]: number }) {
    const {topBarMainActions, dashboardSectionActions, totalActionsCount} =
      this.pendingActionFactory.getTopBarPendingActions(
        this.notifications || [],
        actions
      );
    const notificationsTitle = {
      id: 'PendingActions',
      text: 'pending-actions.pending-actions',
    };
    this.notifications = dashboardSectionActions;
    this.totalNotification = totalActionsCount;
    this.topBarNotifications = [notificationsTitle, ...topBarMainActions];
  }

  ngOnInit(): void {
    this.subsidiariesModel = this.subsidiaryService.getSubsidiaryList();
    HelpWizardService.onHelpWizardStartedSubject.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.startPopOver();
    });
  }

  toggleMenuEvent() {
    this.toggleMenu = !this.toggleMenu;
  }

  onClick(item: ListItemModel) {
    this.toggleMenuEvent();
    if (this.menuIcon.nativeElement.classList.contains('active')) {
      this.renderer.removeClass(this.menuIcon.nativeElement, 'active');
    }
    this.loadingService.showLoading('MENU_Change');
    this.router.navigate([item.url]).then(() => {
      this.loadingService.hideLoading('MENU_Change');
      Utils.scrollTop();
    });
  }

  toggleTheme() {
    let activeTheme = this.themeService.getActiveTheme();
    if (activeTheme?.name === 'light') {
      this.themeService.setTheme('dark');
    } else {
      this.themeService.setTheme('light');
    }
    this.setThemeName();
  }

  setThemeName() {
    let item = this.profileMenuItems.find(item => {
      return item.id == "theme"
    });
    if (item) {
      item.text = this.themeService.theme == "light" ? 'public.dark' : "public.light";
      item.icon = this.themeService.theme != "light" ? 'arb-icon-Sun' : 'arb-icon-Moon';
    }
  }

  onUserMenuClick(id: string) {
    switch (id) {
      case 'theme':
        this.toggleTheme();
        break;
      case 'organizationDetails':
        void this.router.navigate(['/user-profile/organizationDetails']);
        break;
      case 'userUpdate':
        void this.router.navigate(['/user-profile/userUpdate']);
        break;
      case 'relationship':
        void this.router.navigate(['/user-profile/relationship']);
        break;
      case 'fxRates':
        void this.router.navigate(['/user-profile/fx-rates']);
        break;
      case 'manageAlerts':
        void this.router.navigate(['/user-profile/manage-alerts']);
        break;
      case 'activityLogs':
        void this.router.navigate(['/user-profile/activity-logs']);
        break;
      case 'Logout':
        this.doLogOut();
        break;
      case 'Lang':
        this.modelAndListService.deleteSavedModels();
        this.languageService.changeLanguage(true);
        break;
      case 'changePassword':
        void this.router.navigate(['/user-profile/' + CHANGE_PASSWORD]);
        break;
      case 'user-profile':
        void this.router.navigate(['/user-profile/userUpdate']);
        break;
      case 'manageAlerts':
        void this.router.navigate([MANAGE_ALERTS]);
        break;
      case 'entitlements':
        void this.router.navigate(['/company-admin/alrajhi-user-details/' +
        JSON.parse(sessionStorage.getItem('user')!).userId]);
        break;
    }
  }


  goToPendingActionsLink(id: string) {
    if (id == 'PendingActions') {
      void this.router.navigate(['/pendingActions/pending-actions-list']);
    } else {
      this.router
        .navigate(['/pendingActions'], {queryParams: {pendingAction: id}})
        .then(() => {
        });
    }
  }

  changeCurrentCompany(id: string) {
    this.subsidiaryService.changeCurrentCompany(id);
  }

  private doLogOut() {
    void this.router.navigateByUrl('/login');
    this.userService.logoutUser().subscribe((res) => {
    });
  }

  onSearchItemSelect(item: SearchListOptionsModel) {
    item.url && this.router.navigateByUrl(item.url);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  skip() {
    this.currentPopover?.close();
    this.showWizard = false;
  }

  next() {
    this.currentPopover?.close();
    if (!this.nextWizardClose) {
      setTimeout(() => {
        switch (this.currentPopover) {
          case this.dashboardPopover:
            this.currentPopover = this.searchPopover;
            this.popTitle = "public.popOver.search";
            this.popText = "public.popOver.search-text";
            break;
          case  this.searchPopover:
            this.currentPopover = this.menuPopover;
            this.popTitle = "public.popOver.menu";
            this.popText = "public.popOver.menu-text";
            break;
          case  this.menuPopover:
            if (this.showPendingActions) {
              this.currentPopover = this.notificationPopover;
              this.popTitle = "public.popOver.notification";
              this.popText = "public.popOver.notification-text";
            } else {
              this.currentPopover = this.userPopover;
              this.popTitle = "public.popOver.user";
              this.popText = "public.popOver.user-text";
            }
            break
          case this.notificationPopover:
            this.currentPopover = this.userPopover;
            this.popTitle = "public.popOver.user";
            this.popText = "public.popOver.user-text";
            break;
          case this.userPopover:
            this.helpWizardService.startHelpWizardOnDashBoard();
            return
            break;
        }
        this.currentPopover?.open();
      }, 100)
    } else {
      this.showWizard = false;
    }
  }

  startPopOver() {
    this.showWizard = true;
    setTimeout(() => {
      this.dashboardPopover.open();
      this.currentPopover = this.dashboardPopover;
    });
    this.helpWizardService.onResumeHelpWizardOnDashBoardLayout().pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.nextWizardClose = true;
      this.currentPopover = this.menuPopover;
      this.popTitle = "public.popOver.company-admin";
      this.popText = "public.popOver.company-admin-text";
      this.currentPopover?.open();
    });
  }

  lightMenuToggleChange(data: boolean) {
    localStorage.setItem("LightMenuToggle", JSON.stringify(data));
  }
}
