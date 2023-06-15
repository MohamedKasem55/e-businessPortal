import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  POS,
  POS_ANLYTIC,
  POS_CLM,
  POS_ECOM,
  POS_MNG,
  POS_NW_REQQ,
  POS_NW_REQ_STATUS,
  POS_MAINTENANCE,
  POS_USR_APPV,
  POS_SERVICES,
  POS_CRM_STATUS,
  POS_CRM_STATUS_DETAILS,
} from 'app/@core/constants/pages-urls-constants';
import {BreadcrumbService} from 'app/@core/service/base/breadcrumb.service';
import {ServiceLocator} from 'app/@core/service/base/service-locator.service';
import {BoxModel} from 'arb-design-library/model/box.model';
import {BreadcrumbModel} from 'arb-design-library/model/breadcrumb.model';
import {TitleModel} from 'arb-design-library/model/title.model';
import {Utils} from "../../../@core/utility/Utils";
import {AuthenticationUtils} from "../../../@core/utility/authentication-utils";

@Component({
  selector: 'app-pos-landing',
  templateUrl: './pos-landing.component.html',
})
export class PosLandingComponent implements OnInit {
  boxes!: BoxModel[];
  showPendingActions: boolean = AuthenticationUtils.showPendingActions;

  boxesIDs = {
    newRequest: 'new-request',
    eCommerce: 'e-commerce',
    maintenance: 'maintenance',
    claims: 'claims',
    posManagement: 'pos-management',
    requestStatus: 'request-status',
    posService: 'pos-services',
    crmRequestStatus: 'crm-status',
  };

  endButtonsIDs = {
    userApproval: 'user-approval',
    analytics: 'analytics',
    crm: 'crm'
  };

  title: TitleModel = {
    id: 'pos-title1',
    type: 'Page',
    title: 'pos.dashboard.title',
    endButtons: AuthenticationUtils.showPendingActions ? [
      {
        id: this.endButtonsIDs.crm,
        type: 'secondary',
        text: 'pos.maintenance.crm-status',
        isDisable: !AuthenticationUtils.hasAccess('CRMStatusRequest'),
      },
      {
        id: this.endButtonsIDs.analytics,
        type: 'secondary',
        text: 'pos.dashboard.analytics.title',
        isDisable: !AuthenticationUtils.hasAccess('POSDashboard'),
      },
      {
        id: this.endButtonsIDs.userApproval,
        type: 'secondary',
        text: 'pos.dashboard.user-approval',
        isDisable: !AuthenticationUtils.hasAccess('PosRequestMenu'),
      },
    ] : [
      {
        id: this.endButtonsIDs.analytics,
        type: 'secondary',
        text: 'pos.dashboard.analytics.title',
        isDisable: !AuthenticationUtils.hasAccess('POSDashboard'),
      }]
    ,
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService
  ) {
    this.breadcrumbService = ServiceLocator.injector.get(BreadcrumbService);
    this.setBreadcrumb([
      {
        text: 'pos.dashboard.title',
        url: `/${POS}`,
      },
    ]);
    this.boxes = this.getPOSBoxes();
  }

  getPOSBoxes(): BoxModel[] {
    return [
      {
        id: this.boxesIDs.newRequest,
        text: 'pos.dashboard.boxes.new-request',
        subTitle: 'pos.dashboard.boxes.new-request-sub',
        icon: 'arb-icon-posError',
        isDisabled: !AuthenticationUtils.hasAccess('PosRequestMenu'),
      },
      {
        id: this.boxesIDs.eCommerce,
        text: 'pos.dashboard.boxes.e-commerce-sub',
        subTitle: 'pos.dashboard.boxes.e-commerce-sub',
        icon: 'arb-icon-posSetting',
        isDisabled: !AuthenticationUtils.hasAccess('PosReports'),
      },
      {
        id: this.boxesIDs.maintenance,
        text: 'pos.dashboard.boxes.maintenance',
        subTitle: 'pos.dashboard.boxes.maintenance-sub',
        icon: 'arb-icon-posSetting',
        isDisabled: !AuthenticationUtils.hasAccess('PosMaintenances'),
      },
      // {
      //   id: this.boxesIDs.claims,
      //   text: 'pos.dashboard.boxes.claims',
      //   subTitle: 'pos.dashboard.boxes.claims-sub',
      //   icon: 'arb-icon-posSetting',
      //   isDisabled: false, //!this.posAuthenticationService.getCanActivateNewRequest(),
      // },
      {
        id: this.boxesIDs.posManagement,
        text: 'pos.dashboard.boxes.pos-management.pos-management',
        subTitle: 'pos.dashboard.boxes.pos-management-sub',
        icon: 'arb-icon-posError',
        isDisabled: !AuthenticationUtils.hasAccess('MerchantPortal'),
      },
      {
        id: this.boxesIDs.posService,
        text: 'pos.dashboard.boxes.services',
        subTitle: 'pos.dashboard.boxes.services-sub',
        icon: 'arb-icon-posError',
        isDisabled: !AuthenticationUtils.hasAccess('POSMaintenanceManageRequest'),
      },

    ];
  }

  setBreadcrumb(breadcrumb: BreadcrumbModel[]) {
    this.breadcrumbService.setBreadcrumb(breadcrumb);
  }

  ngOnInit(): void {
  }

  onButtonClick(key: string) {
    switch (key) {
      case this.endButtonsIDs.analytics:
        this.router.navigate([POS_ANLYTIC], {relativeTo: this.route});
        break;
      case this.endButtonsIDs.userApproval:
        this.router.navigate([`${POS_NW_REQ_STATUS}`], {relativeTo: this.route});
        break;
      case this.endButtonsIDs.crm:
        this.router.navigate([`${POS_CRM_STATUS}`], {relativeTo: this.route});
        break;
    }
  }

  onBoxSelect(key: string) {
    switch (key) {
      case this.boxesIDs.newRequest:
        this.router.navigate([`${POS_NW_REQQ}`], {relativeTo: this.route});
        break;
      case this.boxesIDs.eCommerce:
        this.router.navigate([`${POS_ECOM}`], {relativeTo: this.route});
        break;
      case this.boxesIDs.maintenance:
        this.router.navigate([`${POS_MAINTENANCE}`], {relativeTo: this.route});
        break;
      case this.boxesIDs.claims:
        this.router.navigate([`${POS_CLM}`], {relativeTo: this.route});
        break;
      case this.boxesIDs.posManagement:
        this.router.navigate([`${POS_MNG}`], {relativeTo: this.route});
        break;
      case this.boxesIDs.posService:
        this.router.navigate([`${POS_SERVICES}`], {relativeTo: this.route});
        break;
    }
  }
}
