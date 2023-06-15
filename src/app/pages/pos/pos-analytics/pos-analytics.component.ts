import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ModelAndListService} from 'app/@core/service/base/modelAndList.service';
import {VerificationService} from 'app/@core/service/base/verification.service';
import {POSService} from 'app/@core/service/pos/pos.service';
import {PaginationValueModel} from 'arb-design-library/model/pagination.model';
import {TabModel} from 'arb-design-library/model/tab.model';
import {TableHeaderModel} from 'arb-design-library/model/table-header.model';
import {BreadcrumbService} from 'app/@core/service/base/breadcrumb.service';
import {FormModel} from '../../../@core/model/dto/formModel';
import {posAnalyticsService} from 'app/@core/service/pos/pos-analytics/pos-analytics.service';
import {TableHeaderType} from 'arb-design-library';
import {Location} from '@angular/common';
import {TableControlOptions} from 'app/@core/model/dto/control/table-control';
import {getSearchForm} from './pos-analytics.controls';
import {PopupService} from "../../../@core/service/base/popup.service";
import {PopupOutputModel} from 'app/@core/model/dto/popup.model';
import {POSAnalyticsRequest} from 'app/@core/model/rest/pos/pos-analytics-req/analytics-req';
import {FileData} from "../../../@core/model/rest/common/file-data";
import {POS} from 'app/@core/constants/pages-urls-constants';


@Component({
  selector: 'app-analytics',
  templateUrl: './pos-analytics.component.html'
})
export class PosAnalyticsComponent implements OnInit {


  tabs: TabModel[] = [];
  headers: TableHeaderModel[] = [];
  showSearch: TableControlOptions[] = [];
  filesInProgressHeader: TableHeaderModel[] = [];
  paginationValue: PaginationValueModel = {page: 1, size: 50};
  type: string = "";
  exportFileName!: string;
  data: any[] | undefined;
  data2!: Array<FileData>;
  total: number = 0;
  searchForm: FormModel = getSearchForm();
  analyticsReq!: POSAnalyticsRequest;


  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private posService: POSService,
    private router: Router,
    private analyticsService: posAnalyticsService,
    private otpService: VerificationService,
    private breadcrumbService: BreadcrumbService,
    private modelAndListService: ModelAndListService,
    private translate: TranslateService,
    private popupService: PopupService,
  ) {

    this.breadcrumbService.setBreadcrumb([
      {
        text: "pos.dashboard.title",
        url: `/${POS}`
      },
      {
        text: "pos.dashboard.analytics.title",
        url: '',
      },
    ]);

    this.setTabs()

    this.exportFileName = 'Financial Transactions';

  }

  ngOnInit(): void {
    this.type = "financialTransactions";
    this.route.queryParams.subscribe((params: any) => {
      this.tabChanged(params.type);
      this.type = this.type ? params.type : 'financialTransactions';
      const request = {
        page: 1,
        rows: 10
      };
      this.analyticsService.getFinancialTransistList(request).subscribe(data => {
      })
      this.setFinancialTransactionsTableHeaders();
    });
  }

  onFilterClick() {
    this.openSearch()
  }

  setTabs() {
    this.tabs.push({
      text: 'pos.dashboard.analytics.financialTransactions',
      value: 'financialTransactions',
    });
    this.tabs.push({
      text: 'pos.dashboard.analytics.terminalStatistics',
      value: 'terminalStatistics',
    });
    this.tabs.push({
      text: 'pos.dashboard.analytics.inactiveTerminalDetails',
      value: 'inactiveTerminalDetails',
    });
  }

  tabChanged(id: string) {
    const request = {
      page: 1,
      rows: 10
    };
    this.type = id;
    switch (this.type) {
      case 'financialTransactions':
        this.setFinancialTransactionsTableHeaders();
        this.location.replaceState('/pos/analytics/financialTransactions');
        break;
      case 'terminalStatistics':
        this.setTerminalStatisticsTableHeaders();
        this.location.replaceState('/pos/analytics/terminalStatistics');
        break;
      case 'inactiveTerminalDetails':
        this.setInactiveTerminalDetailsTableHeaders()
        this.location.replaceState('/pos/analytics/inactiveTerminalDetails');
        break;
    }
  }

  externalPagination(data: PaginationValueModel) {
    this.getTableData(data);
  }

  setTerminalStatisticsTableHeaders() {
    this.modelAndListService.getList(['errors']).subscribe((data) => {
      this.headers = [];
      let headers: TableHeaderModel[] = [];

      headers.push({
        title: "pos.dashboard.analytics.terminalNumber",
        type: TableHeaderType.TEXT,
        fieldName: 'terminalNumber',
      });
      headers.push({
        title: "pos.dashboard.analytics.no-of-transaction",
        type: TableHeaderType.TEXT,
        fieldName: 'numberTransactions',
      });
      headers.push({
        title: "pos.dashboard.analytics.amount",
        type: TableHeaderType.TEXT,
        fieldName: 'amount',
      });
      headers.push({
        title: "pos.dashboard.analytics.madaAmount",
        type: TableHeaderType.TEXT,
        fieldName: 'amountMADA',
      });
      headers.push({
        title: "pos.dashboard.analytics.pendingAmount",
        type: TableHeaderType.TEXT,
        fieldName: 'pendingAmount',
      });
      headers.push({
        title: "pos.dashboard.analytics.reconcilationDate",
        type: TableHeaderType.DATE_TEXT,
        fieldName: 'reconciliationDate',
        controlOptions: {format: 'dd/MM/yyyy'}
      });

      this.headers = headers;
    });

    this.getTableData(this.paginationValue);
  }

  setFinancialTransactionsTableHeaders() {
    this.modelAndListService.getList(['errors']).subscribe((data) => {
      this.headers = [];
      let headers: TableHeaderModel[] = [];
      headers.push({
        title: "pos.dashboard.analytics.terminalNumber",
        type: TableHeaderType.TEXT,
        fieldName: 'terminalNumber',

      });
      headers.push({
        title: "pos.dashboard.analytics.accountNumber",
        type: TableHeaderType.TEXT,
        fieldName: 'accountNumber',
      });
      headers.push({
        title: "pos.dashboard.analytics.avgNumberCreditTransactions",
        type: TableHeaderType.TEXT,
        fieldName: 'averageNumber',
      });

      this.headers = headers;
    });

    this.getTableData(this.paginationValue);
  }

  setInactiveTerminalDetailsTableHeaders() {
    this.modelAndListService.getList(['errors']).subscribe((data) => {
      this.headers = [];

      let headers: TableHeaderModel[] = [];

      headers.push({
        title: "pos.dashboard.analytics.inactiveTerminal",
        type: TableHeaderType.TEXT,
        fieldName: 'terminalNumber',
      });
      headers.push({
        title: "pos.dashboard.analytics.lastTransactionsDate",
        type: TableHeaderType.TEXT,
        fieldName: 'lastTransactionDate',
      });

      this.headers = headers;
    });

    this.getTableData(this.paginationValue);
  }


  onFileClicked(fileData: {
    buttonId: string;
    displayedData: {
      creationDate: string;
      fileName: string;
      isRowChecked: boolean;
      paymentDate: string;
    };
    row: {
      creationDate: string;
      fileName: string;
      fileReference: string;
      paymentDate: string;
    };
  }) {
    const fileName: string = fileData.displayedData.fileName;

    const fileFound = this.data2.find((file: FileData) => {
      if (file.fileName === fileName) {
        return file;
      } else {
        return null;
      }
    });
  }


  onTitleButtonsClick(titleButtonId: string) {
    if (titleButtonId === 'arrowTitle')
      this.router.navigateByUrl(POS);
  }

  getFormatDate(date: any): string {
    let timestampDate = '';
    let day: string = '';
    let month: string = '';
    if (+date['day'] < 10) {
      day = "0" + date['day'];
    }
    if (+date['month'] < 10) {
      month = "0" + date['month'];
    }
    return timestampDate = date.year + '-' + (month !== '' ? month : date.month) + '-' + (day !== '' ? day : date.day) + 'T00:00:00.000Z';
  }

  openSearch() {
    this.popupService.showPopup({image: '', form: this.searchForm}).subscribe((res: PopupOutputModel) => {

      if (res.buttonId == "search") {
        this.setAnalyticsReq({
          page: 1,
          rows: 20,
          dateFrom: res.controls!['startDate'].value ? this.getFormatDate(res.controls!['startDate'].value) : '',
          dateTo: res.controls!['endDate'].value ? this.getFormatDate(res.controls!['endDate'].value) : ''
        });

        switch (this.type) {
          case "financialTransactions":
            this.analyticsService.getFinancialTransistList(this.analyticsReq).subscribe(data => {

              this.data = data.financialTransList?.items;
              this.total = data.financialTransList?.total!;

            })
            break;
          case "terminalStatistics":
            this.analyticsService.getTerminalStatistics(this.analyticsReq).subscribe(data => {

              this.data = data.terminalStatisticList?.items;
              this.total = data.terminalStatisticList?.total!;
            })
            break;
          case "inactiveTerminalDetails":
            this.analyticsService.getInactiveTerminals(this.analyticsReq).subscribe(data => {

              this.data = data.inactiveTerminalList?.items;
              this.total = data.inactiveTerminalList?.total!

            });
            break;
        }

        this.popupService.dismiss();
      } else if (res.buttonId == "reset") {

        res.controls!['startDate'].setValue('')
        res.controls!['endDate'].setValue('');
        this.popupService.dismiss();

      } else {
        this.popupService.dismiss();
      }
    });
  }

  setAnalyticsReq(options: POSAnalyticsRequest = {}) {
    this.analyticsReq = {
      page: options.page,
      rows: options.rows,
      dateFrom: options.dateFrom,
      dateTo: options.dateTo
    };
  }


  getTableData(data: PaginationValueModel) {
    switch (this.type) {
      case "financialTransactions":
        this.analyticsService.getFinancialTransistList({
          page: data.page,
          rows: data.size
        }).subscribe({
          next: data => {

            this.data = data.financialTransList?.items;
            this.total = data.financialTransList?.total!;
          },
          error: () => {
            this.data = [];
          }
        });
        break;
      case "terminalStatistics":
        this.analyticsService.getTerminalStatistics({
          page: data.page,
          rows: data.size
        }).subscribe({
          next: data => {
            this.data = data.terminalStatisticList?.items;
            this.total = data.terminalStatisticList?.total!;
          },
          error: () => {
            this.data = [];
          }
        });
        break;
      case "inactiveTerminalDetails":
        this.analyticsService.getInactiveTerminals({
          page: data.page,
          rows: data.size
        }).subscribe({
          next: data => {
            this.data = data.inactiveTerminalList?.items;
            this.total = data.inactiveTerminalList?.total!
          },
          error: () => {
            this.data = [];
          }
        });
        break;

    }
  }

}
