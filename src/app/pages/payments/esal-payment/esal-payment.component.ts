import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BoxModel } from 'arb-design-library/model/box.model';
import { BreadcrumbService } from 'app/@core/service/base/breadcrumb.service';
import { TitleModel } from 'arb-design-library/model/title.model';
import { AuthenticationUtils } from '../../../@core/utility/authentication-utils';

@Component({
  selector: 'app-esal-payment',
  templateUrl: './esal-payment.component.html',
  styleUrls: [],
})
export class EsalPaymentComponent implements OnInit {
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
    id: 'EsalPaymentsTitle1',
    type: 'Page',
    title: 'Esal',
    showArrow: true,
    endButtons: this.showPendingActions
      ? [
          {
            id: 'FeedbackFiles',
            type: 'secondary',
            text: 'payments.feedback-files.title',
          },
          {
            id: 'UserApprovalStatus',
            type: 'secondary',
            text: 'public.approvalStatus',
          },
          {
            id: 'ProcessedTransactions',
            type: 'secondary',
            text: 'transfer.processedTrnx.name',
          },
        ]
      : [
          {
            id: 'FeedbackFiles',
            type: 'secondary',
            text: 'payments.feedback-files.title',
          },
          {
            id: 'ProcessedTransactions',
            type: 'secondary',
            text: 'transfer.processedTrnx.name',
          },
        ],
  };

  onButtonClick(key: string) {
    switch (key) {
      case 'UserApprovalStatus':
        this.router
          .navigate(['/payments/approval'], { queryParams: { type: 'esal' } })
          .then(() => {});
        break;
      case 'ProcessedTransactions':
        this.router
          .navigate(['/payments/processed'], { queryParams: { type: 'esal' } })
          .then(() => {});
        break;
      case 'FeedbackFiles':
        this.router
          .navigate(['/payments/feedback-files'], {
            queryParams: { type: 'esal' },
          })
          .then(() => {});
        break;
      case 'arrowTitle':
        this.router.navigate(['/payments']);
        break;
    }
  }

  onBoxSelect(key: string) {
    switch (key) {
      case 'single-esal-invoice-payment':
        this.router
          .navigateByUrl('/payments/esal-payment/single-payment')
          .then(() => {});
        break;
      case 'multi-esal-invoice-payment':
        this.router
          .navigateByUrl('/payments/esal-payment/multi-payment')
          .then(() => {});
        break;
      case 'esal-analytics':
        this.router
          .navigateByUrl('/payments/esal-payment/analytics')
          .then(() => {});
        break;
      case 'esal-invoice-history':
        this.router
          .navigateByUrl('/payments/esal-payment/invoice-history')
          .then(() => {});
        break;
    }
  }
}

export function getPaymentsBoxes(): BoxModel[] {
  return [
    {
      id: 'single-esal-invoice-payment',
      text: 'payments.esal.boxes.single-esal',
      icon: 'arb-icon-billWithNumberOne',
      isDisabled: false,
    },
    {
      id: 'multi-esal-invoice-payment',
      text: 'payments.esal.boxes.multiple-esal',
      icon: 'arb-icon-Bill',
      isDisabled: false,
    },
    {
      id: 'esal-invoice-history',
      text: 'payments.esal.boxes.invoice-history',
      icon: 'arb-icon-document',
      isDisabled: false,
    },
    {
      id: 'esal-analytics',
      text: 'payments.esal.boxes.analytics',
      icon: 'arb-icon-barChart',
      isDisabled: false,
    },
  ];
}
