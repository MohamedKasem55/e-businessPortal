import {Component} from '@angular/core';
import {
  ProcessedTransaction,
  ProcessedTransactionsRequest,
  ProcessedTransactionsRes
} from 'app/@core/model/rest/processed-transactions/list-res';
import {ModelAndListService} from 'app/@core/service/base/modelAndList.service';
import {
  ProcessedTransactionsService
} from 'app/@core/service/transfer/processed-transactions/processed-transactions.service';
import {SummaryItemModel} from 'arb-design-library/model/summary-item.model';
import {SummarySectionModel} from 'arb-design-library/model/summary-section.model';
import {TitleModel} from 'arb-design-library/model/title.model';
import {take} from 'rxjs';
import {TableHeaderModel} from 'arb-design-library/model/table-header.model';
import {Router} from "@angular/router";
import {getDetailsTableHeaders} from "./processed-trx-details.controls";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'processed-trx-details',
  templateUrl: './processed-trx-details.component.html',
})
export class ProcessedTrxDetailsComponent {

  headers: TableHeaderModel[] = [];
  title: TitleModel = {
    id: "1",
    type: 'Section',
    title: "transfer.processedTrnx.processedTransactionsDetails"
  }
  pageTitle: TitleModel = {
    id: ' ProcessedTransactionsDetails',
    type: 'Page',
    title: 'transfer.processedTrnx.processedTransactionsDetails',
    showArrow: true,
  };
  processedTransactionsDetails!: any[];
  summaryDetails: SummaryItemModel[] = [
    {title: 'transfer.processedTrnx.pmt-type', subTitle: history?.state?.details?.displayedData?.transferType},
    {title: 'transfer.processedTrnx.beneficiary', subTitle: history?.state?.details?.displayedData?.beneficiaryName},
    {
      title: 'transfer.processedTrnx.beneficiaryAcc',
      subTitle: history?.state?.details?.displayedData?.beneficiaryAccount
    },
    {title: 'transfer.processedTrnx.beneficiaryBnk', subTitle: history?.state?.details?.displayedData?.beneficiaryBank},
    {title: 'transfer.processedTrnx.country', subTitle: history?.state?.details?.displayedData?.country},
    {
      title: 'transfer.processedTrnx.debit-Account',
      subTitle: history?.state?.details?.displayedData["accountFrom.ibanNumber"]
    },
    {
      title: 'transfer.processedTrnx.debit-Account-Nickname',
      subTitle: history?.state?.details?.displayedData["accountFrom.alias"]
    },
    {title: 'transfer.processedTrnx.debit-Amount', subTitle: history?.state?.details?.displayedData?.amount},
    {title: 'transfer.processedTrnx.transferAmount', subTitle: history?.state?.details?.displayedData?.sarAmount},
    {title: 'transfer.processedTrnx.Fees', subTitle: history?.state?.details?.displayedData?.feesAmount},
    {title: 'transfer.processedTrnx.exRate', subTitle: history?.state?.details?.displayedData?.exchangeRate},
    {title: 'public.status', subTitle: history?.state?.details?.displayedData?.beStatus},
    {title: 'transfer.processedTrnx.initiationBy', subTitle: history?.state?.details?.displayedData?.initiatedBy},
    {
      title: 'transfer.processedTrnx.initiationDate',
      subTitle: this.datePipe.transform(history?.state?.details?.displayedData?.initiationDate, 'dd/MM/yyyy HH:mm')
    },
    {title: 'transfer.processedTrnx.approvalBy', subTitle: history?.state?.details?.displayedData?.approvedBy},
    {
      title: 'transfer.processedTrnx.approvedDate',
      subTitle: this.datePipe.transform(history?.state?.details?.displayedData?.approvedDate, 'dd/MM/yyyy HH:mm')
    },
  ];
  section: SummarySectionModel = {items: this.summaryDetails, title: this.title};
  total: number = 0;

  constructor(private service: ProcessedTransactionsService,
              private router: Router,
              private datePipe: DatePipe,
              private modelAndListService: ModelAndListService,) {

    if (!history.state.details) {
      void this.router.navigate(['/transfer/processed-trx'])
    } else {
      this.modelAndListService.getList(['batchSecurityLevelStatus']).subscribe((data) => {
        const securityLevelStatus = data['batchSecurityLevelStatus'];
        this.headers = getDetailsTableHeaders(securityLevelStatus);
        this.getProcessedTransactionDetails(history.state.details.row);
      });
    }
  }

  getProcessedTransactionDetails(trxObj: ProcessedTransaction) {
    this.modelAndListService.getModel('currency').subscribe((res)=>{
      let req: ProcessedTransactionsRequest = {
        batchList: [{
          ...trxObj,
          _pais: "",
          _status: "",
          _transferType: "",
          _currency:res[trxObj.currency!] ,
        }]
      }
      this.service.getProcessedTransactionsDetails(req).pipe(take(1)).subscribe({
        next: (res) => {
          if (res?.length) {
            this.processedTransactionsDetails = res[0].securityLevelsDTOList;
            this.total = res.total
          } else {
            this.processedTransactionsDetails = [];
          }
        },
        error: () => {
          this.processedTransactionsDetails = [];
        }
      })


    })

  }

  onBackArrowClick(id: string) {
    switch (id) {
      case "arrowTitle":
        this.router.navigate(['/transfer/processed-trx']).then()
    }
  }
}
