import { Component, OnInit } from '@angular/core';
import { TitleModel } from 'arb-design-library/model/title.model';
import { BoxModel } from 'arb-design-library/model/box.model';
import { BreadcrumbService } from '../../../@core/service/base/breadcrumb.service';
import { Router } from '@angular/router';
import { AuthenticationUtils } from '../../../@core/utility/authentication-utils';

@Component({
  selector: 'app-payment-landing',
  templateUrl: './payment-landing.component.html',
  styleUrls: [],
})
export class PaymentLandingComponent implements OnInit {
  boxes!: BoxModel[];
  showPendingActions: boolean = AuthenticationUtils.showPendingActions;

  constructor(
    private router: Router,
    private breadcrumbService: BreadcrumbService
  ) {
    this.breadcrumbService.setBreadcrumb([]);
    this.boxes = getPaymentsBoxes();
  }

  ngOnInit(): void {}

  title: TitleModel = {
    id: 'PaymentsTitle1',
    type: 'Page',
    title: 'payments.payment',
    endButtons: this.showPendingActions
      ? [
          {
            id: 'FeedbackFiles',
            type: 'secondary',
            text: 'payments.feedback-files.title',
            isDisable: !AuthenticationUtils.hasAccess('PaymentsFeedbackFiles'),
          },
          {
            id: 'UserApprovalStatus',
            type: 'secondary',
            text: 'public.approvalStatus',
            isDisable: !AuthenticationUtils.hasAccess('PaymentsRequestStatus'),
          },
          {
            id: 'ProcessedTransactions',
            type: 'secondary',
            text: 'transfer.processedTrnx.name',
            isDisable: !AuthenticationUtils.hasAccess(
              'PaymentsProcessedTransactions'
            ),
          },
        ]
      : [
          {
            id: 'FeedbackFiles',
            type: 'secondary',
            text: 'payments.feedback-files.title',
            isDisable: !AuthenticationUtils.hasAccess('PaymentsFeedbackFiles'),
          },
          {
            id: 'ProcessedTransactions',
            type: 'secondary',
            text: 'transfer.processedTrnx.name',
            isDisable: !AuthenticationUtils.hasAccess(
              'PaymentsProcessedTransactions'
            ),
          },
        ],
  };

  onButtonClick(key: string) {
    switch (key) {
      case 'UserApprovalStatus':
        this.router
          .navigate(['/payments/approval'], { queryParams: { type: 'bill' } })
          .then(() => {});
        break;
      case 'FeedbackFiles':
        this.router
          .navigate(['/payments/feedback-files'], {
            queryParams: { type: 'bill' },
          })
          .then(() => {});
        break;
      case 'ProcessedTransactions':
        this.router
          .navigate(['/payments/processed'], { queryParams: { type: 'bill' } })
          .then(() => {});
        break;
        break;
    }
  }

  onBoxSelect(key: string) {
    this.router.navigateByUrl('/payments/' + key).then(() => {});
  }
}

export function getPaymentsBoxes(): BoxModel[] {
  return [
    {
      id: 'bill-payment',
      text: 'payments.boxes.bill-payment.title',
      subTitle: 'payments.boxes.bill-payment.subTitle',
      icon: 'arb-icon-billAmount',
      isDisabled: !AuthenticationUtils.hasAccess('BillPaymentsMenu'),
    },
    {
      id: 'government-payment',
      text: 'payments.boxes.government-payment.title',
      subTitle: 'payments.boxes.government-payment.subTitle',
      icon: 'arb-icon-palmtree2Swords',
      isDisabled: !AuthenticationUtils.hasAccess('MOIPaymentMenu'),
    },
    {
      id: 'esal-payment',
      text: 'payments.boxes.esal-payment.title',
      subTitle: 'payments.boxes.esal-payment.subTitle',
      icon: 'arb-icon-logoEsal',
      isDisabled: !AuthenticationUtils.hasAccess('EsalMenu'),
    },
    // {
    //   id: 'aramco-payment',
    //   text: 'payments.boxes.aramco-payment.title',
    //   subTitle: 'payments.boxes.aramco-payment.subTitle',
    //   icon: 'arb-icon-logoAramco',
    //   isDisabled: !AuthenticationUtils.hasAccess('AramcoPaymentMenu'),
    // },
    {
      id: 'one-time-payment',
      text: 'payments.boxes.one-time-payment.title',
      subTitle: 'payments.boxes.one-time-payment.subTitle',
      icon: 'arb-icon-billClockLarge',
      isDisabled: !AuthenticationUtils.hasAccess('OneTimePayment'),
    },
    {
      id: 'bulk-bill-payment',
      text: 'payments.boxes.bulk-bill-payment.title',
      subTitle: 'payments.boxes.bulk-bill-payment.subTitle',
      icon: 'arb-icon-box',
      isDisabled: !AuthenticationUtils.hasAccess('BulkPaymentsMenu'),
    },
    {
      id: 'bulk-moi-payment',
      text: 'payments.boxes.bulk-moi-payment.title',
      subTitle: 'payments.boxes.bulk-moi-payment.subTitle',
      icon: ' arb-icon-tokensMedium',
      isDisabled: !AuthenticationUtils.hasAccess('MOIBulkPayment'),
    },
    // {
    //   id: 'hajj-umrah-cards',
    //   text: 'Hajj & Umrah Cards',
    //   subTitle: "Manage, Add, Pay",
    //   icon: 'arb-icon-card',
    //   isDisabled: !AuthenticationUtils.hasAccess('HajjUmrahMenu'),
    // },
  ];
}
