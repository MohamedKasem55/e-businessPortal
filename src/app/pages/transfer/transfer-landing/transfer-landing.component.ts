import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {TranslateService} from '@ngx-translate/core';
import {BreadcrumbService} from 'app/@core/service/base/breadcrumb.service';
import {ServiceLocator} from 'app/@core/service/base/service-locator.service';
import {BoxModel} from "arb-design-library/model/box.model";
import {BreadcrumbModel} from 'arb-design-library/model/breadcrumb.model';
import {TitleModel} from "arb-design-library/model/title.model";
import {PopupService} from 'app/@core/service/base/popup.service';
import {sariePopupForm} from './transfer-landing-control';
import {PopupOutputModel} from 'app/@core/model/dto/popup.model';

import {AliasManagementService} from 'app/@core/service/transfer/alias-management/alias-management.service';
import {AuthenticationUtils} from "../../../@core/utility/authentication-utils";

@Component({
  selector: 'app-transfer-landing',
  templateUrl: './transfer-landing.component.html',
  styleUrls: ['./transfer-landing.component.scss']
})
export class TransferLandingComponent {
  translate!: TranslateService;
  boxes !: BoxModel[];
  showPendingActions: boolean = AuthenticationUtils.showPendingActions;
  seriaImage = "assets/img/SARIE.png"
  title: TitleModel = {
    id: "TransferTitle1",
    type: "Page",
    "title": "transfer.transfer-title",
    endButtons: this.showPendingActions ? [
        {
          id: "UserApprovalStatus",
          type: "secondary",
          text: "transfer.userApproval.title",
          isDisable: !AuthenticationUtils.hasAccess('TransferRequestStatus')
        },
        {
          id: "processed-trx",
          type: "secondary",
          text: "transfer.processedTrnx.name",
          isDisable: !AuthenticationUtils.hasAccess('TransferProcessedTransaction')
        }] :
      [
        {
          id: "processed-trx",
          type: "secondary",
          text: "transfer.processedTrnx.name",
          isDisable: !AuthenticationUtils.hasAccess('TransferProcessedTransaction')
        }
      ]
  }

  constructor(
    private router: Router,
    private popupService: PopupService,
    private aliasManagementService: AliasManagementService,
    private breadcrumbService: BreadcrumbService) {

    this.breadcrumbService = ServiceLocator.injector.get(BreadcrumbService);
    this.translate = ServiceLocator.injector.get(TranslateService);
    this.boxes = getTransferBoxes();

    this.setBreadcrumb([{
      text: 'transfer.transfer',
      url: '/transfer'
    }]);


    let ipstcstatus = this.getIPSTCStatus()
    if (
      AuthenticationUtils.isCompanyAdmin &&
      (ipstcstatus === null || ipstcstatus.trim().length === 0 || ipstcstatus === 'REJECTED')
    ) {
      //context.showIPSModal()
      this.showSariePopup();
    }
  }

  getIPSTCStatus() {
    const company = JSON.parse(sessionStorage.getItem('company')!);
    return company.ipstcstatus
  }

  setBreadcrumb(breadcrumb: BreadcrumbModel[]) {
    this.breadcrumbService.setBreadcrumb(breadcrumb);
  }

  onBoxSelect(key: string) {
    this.router.navigateByUrl('/transfer/' + key).then(() => {
    });
  }

  onButtonClick(key: string) {
    switch (key) {
      case "UserApprovalStatus":
        this.router.navigate(["/transfer/approval"], {queryParams: {type: 'transfer'}}).then(() => {
        });
        break;
      case "processed-trx":
        this.router.navigate(["/transfer/processed-trx"]);
        break;
    }

  }

  private showSariePopup() {
    this.popupService
      .showPopup({
        image: this.seriaImage,
        form: sariePopupForm(),
      })
      .subscribe((res: PopupOutputModel) => {
        console.log('Popup response')
        console.log(res)
        if (res.buttonId == 'later') {
          const company = JSON.parse(sessionStorage.getItem('company')!);
          company.ipstcstatus = 'LATER'
          sessionStorage.setItem('company', JSON.stringify(company))
          this.popupService.dismiss();
        } else if (res.buttonId == 'rejected') {
          this.popupService.dismiss();
          this.aliasManagementService
            .updateIPSTCStatus({ipstcstatus: 'REJECTED'})
            .subscribe((result) => {
            })
        } else if (res.buttonId == 'accepted') {
          this.aliasManagementService
            .updateIPSTCStatus({ipstcstatus: 'ACCEPTED'})
            .subscribe((result) => {
              const company = JSON.parse(sessionStorage.getItem('company')!);
              company.ipstcstatus = 'ACCEPTED'
              sessionStorage.setItem('company', JSON.stringify(company))
              this.popupService.dismiss();
            })
        } else {
          this.popupService.dismiss();
        }
      });
  }

}


export function

getTransferBoxes(): BoxModel[] {
  return [
    {
      id: "alrajhi-transfer",
      text: 'transfer.rajhi-transfer-title',
      subTitle: 'transfer.transfer-beneficiaries-hint',
      icon: 'arb-icon-Alrajhi',
      isDisabled: !AuthenticationUtils.hasAccess('AlRajhiTransfer'),

    }, {
      id: "local-transfer",
      text: 'transfer.local-transfer-title',
      subTitle: 'transfer.transfer-beneficiaries-hint',
      icon: ' arb-icon-saudiBold',
      isDisabled: !AuthenticationUtils.hasAccess('LocalTransfer'),
    },
    {
      id: "international-transfer",
      text: 'transfer.international-transfer-title',
      subTitle: 'transfer.transfer-beneficiaries-hint',
      icon: 'arb-icon-world',
      isDisabled: !AuthenticationUtils.hasAccess('InternationalTransfer'),
    },
    {
      id: "quick-transfer",
      text: 'transfer.quick-transfer-title',
      icon: 'arb-icon-quickDollar',
      subTitle: 'transfer.transfer-hint',
      isDisabled: !AuthenticationUtils.hasAccess('QuickTransfer'),
    },
    {
      id: "between-accounts",
      text: 'transfer.between-accounts-title',
      icon: 'arb-icon-switchAccountLarge',
      subTitle: 'transfer.transfer-hint',
      isDisabled: !AuthenticationUtils.hasAccess('BetweenAccounts'),
    },
    {
      id: "standing-orders",
      text: 'transfer.standing-orders-title',
      icon: 'arb-icon-billClockLarge',
      subTitle: 'transfer.transfer-beneficiaries-hint',
      isDisabled: !AuthenticationUtils.hasAccess('StandingOrders'),
    }, {
      id: "bulk-payment",
      text: 'transfer.bulk-transfer-title',
      icon: 'arb-icon-tokensSmall',
      subTitle: 'transfer.transfer-beneficiaries-hint',
      isDisabled: !AuthenticationUtils.hasAccess('BulkPaymentsMenu'),
    },
    {
      id: "urpay-transfer",
      text: 'transfer.uRPay-transfer-title',
      icon: 'arb-icon-urpay',
      subTitle: 'transfer.transfer-hint',
      isDisabled: !AuthenticationUtils.hasAccess('UrpayTransfer'),
    },
    // {
    //   id: "visa- B2B-transfer",
    //   text: 'transfer.VISA-B2B-transfer-title',
    //   icon: 'arb-icon-card',
    //   subTitle: 'New Transfer',
    //   isDisabled: !AuthenticationUtils.hasAccess('VisaB2BTransfer'),
    // },
    {
      id: "beneficiaries",
      text: 'transfer.beneficiaries-title',
      icon: 'arb-icon-UsersClose',
      subTitle: 'transfer.transfer-beneficiaries-hint',
      isDisabled: !AuthenticationUtils.hasAccess('Beneficiaries')
    },
    // {
    //   id: "transfer-management",
    //   text: 'transfer.transfer-management-title',
    //   icon: 'arb-icon-settings',
    //   subTitle: 'New Transfer Manage Beneficiaries',
    //   isDisabled: !AuthenticationUtils.hasAccess('TransferManagement')
    // },
    {
      id: "charity-transfer",
      text: 'transfer.charity-transfer-title',
      icon: 'arb-icon-handHeart',
      subTitle: 'transfer.transfer-hint',
      isDisabled: !AuthenticationUtils.hasAccess('CharityTransfer')
    },
    {
      id: "alias-management",
      text: 'transfer.alias-management-title',
      icon: 'arb-icon-profileSettings',
      subTitle: 'transfer.alias-management-title',
      isDisabled: !AuthenticationUtils.hasAccess('AliasManagement')
    }]
}
