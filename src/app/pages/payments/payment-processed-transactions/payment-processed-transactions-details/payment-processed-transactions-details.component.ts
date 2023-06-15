import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TableHeaderType } from 'arb-design-library';
import { SummarySectionModel } from 'arb-design-library/model/summary-section.model';
import { SummaryModel } from 'arb-design-library/model/summary.model';
import { ButtonModel } from 'arb-design-library/model/button.model';

@Component({
  selector: 'app-payment-processed-transactions-details',
  templateUrl: './payment-processed-transactions-details.component.html'
})
export class PaymentProcessedTransactionsDetailsComponent implements OnInit {
  detailsData: any;
  summary: any;
  delButton: ButtonModel = {
    id: 'back',
    type: 'primary',
    text: 'public.back',
  };
  constructor(private router: Router) {
    this.detailsData=this.router.getCurrentNavigation()?.extras?.state?.['row'];
  }

  ngOnInit(): void {
    this.summary = this.getSummary()
  }

  goToBack() {
    this.router
      .navigate(['/payments/processed'], { queryParams: { type: 'government-payments' } })
      .then(() => {
      });
  }

  getSummary(): SummaryModel {
    let sections: SummarySectionModel[] = [];
    const violId=this.detailsData.row['details']?.find((value: { labelKey: string; }) => value.labelKey==='eGovernment.violatorId')
    const issuingEntity=this.detailsData.row['details']?.find((value: { labelKey: string; }) => value.labelKey==='eGovernment.issuingEntity')
    const category=this.detailsData.row['details']?.find((value: { labelKey: string; }) => value.labelKey==='eGovernment.category')

    sections.push(
      {
        title: {
          id: 'summaryDetails',
          title: '',
          subTitle: ''
        },
        items: [
          {
            title: 'payments.government-processed.subserviceType',
            subTitle: this.detailsData.displayedData['applicationType'],
          },
          {
            title: 'payments.government-processed.payment-type',
            subTitle: this.detailsData.row['transactionType'] === 'P' ? 'payments.government-processed.payment' : 'payments.government-processed.refund',
          },
          {
            title: 'payments.government-processed.serviceType',
            subTitle: this.detailsData.displayedData['serviceType'],
          },
          {
            title: 'payments.government-processed.idNumber',
            subTitle: this.detailsData.row['paymentId'],
          },
          {
            title: 'payments.government-processed.beneficiaryName',
            subTitle: this.detailsData.displayedData['beneficiaryName'],
          },
          {
            title: 'payments.government-processed.account-number-id',
            subTitle: this.detailsData.displayedData['accountNumber'] + ' ' + this.detailsData.displayedData['accountAlias'],
          },
          {
            title: 'payments.government-processed.amount',
            subTitle: this.detailsData.displayedData['amount'],
            currency: "608",
          },
          {
            title: 'payments.government-processed.violator-id',

            subTitle: violId?.value,
          },
          {
            title: 'payments.government-processed.issuing-entity',
            subTitle: issuingEntity?.value,
          },
          {
            title: 'payments.government-processed.category',
            subTitle: category?.value,
          },
          {
            title: 'payments.government-processed.unused-balance',
            subTitle: this.detailsData.row['unusedBalance']
          },
          {
            title: 'payments.government-processed.status',
            subTitle: this.detailsData.displayedData['beStatus']
          },
          {
            title: 'payments.government-processed.initiated-by',
            subTitle: this.detailsData.displayedData['initiatedBy']
          },
          {
            title: 'payments.government-processed.executed-by',
            subTitle: this.detailsData.displayedData['executedBy'],
          },
        ],
      });

      if(this.detailsData.row.fees){
        sections.push(
        {
          title: {
            id: 'summaryDetailsFees',
            title: 'payments.government-processed.fees-information',
            subTitle: ''
          },
          table: this.detailsData.row.fees ? this.getFeesTable() : []
        });

        let totalFees=0
        this.detailsData.row['fees'].forEach((element:any) => {
          totalFees+=element.feeAmount
        });

      sections.push(
        {
          title: {
            id: 'totalFees',
            title: 'payments.government-processed.total-fee',
            subTitle: totalFees.toString(),
            currency: "608"
          },
        });
    }

    sections.push(
      {
        title: {
          id: 'summaryDetailsLevels',
          title: 'payments.government-processed.auth-level-info',
          subTitle: ''
        },
        table: this.detailsData.row ? this.getUsersTable() : []
      });

    return {
      title: {
        id: 'SummaryTitle',
        title: 'payments.government-processed.title',
      },
      sections: sections
    }
  }

  getUsersTable(): any {
    const  mapObject = { "A": "Authorized", "I": "Initiate" };
    return {
      columnId: 'batchSecurityPk',
      data: this.detailsData.row['securityLevelsDTOList'],
      headers: [
        {
          title: "payments.oneTimeBillPayment.userLevel",
          type: TableHeaderType.TEXT,
          fieldName: 'level'
        },
        {
          title: "payments.oneTimeBillPayment.status",
          type: TableHeaderType.TEXT,
          fieldName: 'status',
          mapObject: mapObject
        },
        {
          title: "payments.oneTimeBillPayment.userId",
          type: TableHeaderType.TEXT,
          fieldName: 'updater'
        },
        {
          title: "payments.oneTimeBillPayment.dateTime",
          type: TableHeaderType.TEXT,
          fieldName: 'updateDate'
        }
      ],
      maxDisplayRow: 5,
    }
  }

  getFeesTable(): any {
    return {
      columnId: 'batch',
      data: this.detailsData.row['fees'],
      headers: [
        {
          title: "payments.processed.feeType",
          type: TableHeaderType.TEXT,
          fieldName: 'feeType'
        },
        {
          title: "payments.oneTimeBillPayment.status",
          type: TableHeaderType.AMOUNT_TEXT,
          fieldName: 'feeAmount'
        },
      ],
      maxDisplayRow: 5,
    }
  }

}

