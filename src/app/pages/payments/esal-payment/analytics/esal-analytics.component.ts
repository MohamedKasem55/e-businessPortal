import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableHeaderType } from "arb-design-library";
import { TranslateService } from '@ngx-translate/core';
import { AccountsService } from 'app/@core/service/accounts/accounts.service';
import { BreadcrumbService } from 'app/@core/service/base/breadcrumb.service';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import {
  esalAmountBarChartConfig,
  esalAmountDoughnutChartConfig,
  barChartOptions,
  doughnutChartOptions
} from './esal-analytics-controls';
import { TableHeaderModel } from 'arb-design-library/model/table-header.model';
import { EsalPaymentService } from 'app/@core/service/payments/esal-payment/esal-payment.service';
import { ResponseException } from 'app/@core/service/base/responseException';
import { EsalInvoiceStatisticsDetails } from 'app/@core/model/rest/payments/esal-payment/esal-statistic-details-res.model';
import { PaginationValueModel } from 'arb-design-library/model/pagination.model';

@Component({
  selector: 'esal-analytics',
  templateUrl: './esal-analytics.component.html',
})
export class EsalAnalyticsComponent implements OnInit {

  showBarChart: boolean = false;
  showDoughnutChart: boolean = false;
  showTable: boolean = false;
  esalAmountBarChartData: ChartConfiguration<any>['data'] = esalAmountBarChartConfig;
  esalAmountDoughnutChartData: ChartConfiguration<any>['data'] = esalAmountDoughnutChartConfig;
  barChartOptions: ChartOptions<'bar'> = barChartOptions;
  doughnutChartOptions: ChartOptions<'doughnut'> = doughnutChartOptions;
  headers: TableHeaderModel[] = [];
  data!: any[];
  total: number = 0;
  isDisabled: boolean = true;
  headerAmountValue: number = 0;
  optionsList: any = [];
  paginationValue: PaginationValueModel = { page: 1, size: 5};
  showCharts: boolean = false;


  constructor(
    private esalPaymentService: EsalPaymentService,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
  ) {
    this.intiatePage();
  }

  ngOnInit(): void {
  }

  intiatePage() {
    this.breadcrumbService.setBreadcrumb([
      {
        text: "Payments",
        url: '/payments'
      },
      {
        text: "ESAL",
        url: '/payments/esal-payment'
      },
      {
        text: "Monthly Statistics",
        url: ''
      }
    ]);

    this.esalPaymentService.fetchEsalStatisticList().subscribe(
      {
        next: (res) => {
          res.sadadInvoiceYearMonthDTOlist.forEach(item => {
            item.date = item.year + "-" + item.month;
          })
          this.showBarChart = false;
          this.showDoughnutChart = false;
          this.showTable = false;
          this.optionsList = res.sadadInvoiceYearMonthDTOlist;
        },
        error: (error: ResponseException) => {
          console.error("Error while fetching esal monthly statics");
        }
      }
    )
  }

  addTableHaeaderAndData(data: EsalInvoiceStatisticsDetails[]) {
    this.showTable = true;
    let headers: TableHeaderModel[] = [];

    headers.push({
      type: TableHeaderType.TEXT,
      title: "payments.esal.supplier-name",
      fieldName: "supplierName"
    });

    headers.push({
      type: TableHeaderType.TEXT,
      title: "payments.esal.supplier-id",
      fieldName: "supplierID"
    });

    headers.push({
      type: TableHeaderType.TEXT,
      title: "payments.esal.num-of-bill-paid",
      fieldName: "numberBills"
    });

    headers.push({
      type: TableHeaderType.AMOUNT_TEXT,
      title: "payments.esal.amount-paid",
      fieldName: "amountPaid",
      controlOptions: { currency: 'currency' }
    });

    this.headers = headers;
    this.data = data;
    this.total = data.length;
  }

  onTitleButtonsClick(titleButtonId: string) {
    if(titleButtonId === 'arrowTitle'){
        this.router.navigateByUrl("/payments/esal-payment").then(() => { });
    }

  }

  selectDate(event: any) {
    this.showCharts=true
    let selectDate = "/" + event.year + "/" + event.month;
    this.resetChartsData();

    this.fetchTableAndGraphData(selectDate);

  }

  fetchTableAndGraphData(date: string) {
    this.esalPaymentService.fetchEsalMonthlyStatisticDetails(date).subscribe(
      {
        next: (res) => {
          let totalAmount = 0;
          let legendLable: any[] = [];
          res.invoiceStatistics.sadadInvoiceStatisticsDetailsList.forEach(item => {
            this.esalAmountBarChartData.labels!.push(item.supplierName)
            this.esalAmountBarChartData.datasets[0].data.push(item.amountPaid)
            this.esalAmountDoughnutChartData.labels!.push(item.supplierName)
            this.esalAmountDoughnutChartData.datasets[0].data.push(item.amountPaid)
            totalAmount += item.amountPaid;
          })
          this.showBarChart = true;
          this.showDoughnutChart = true;
          this.headerAmountValue = totalAmount;
          this.addTableHaeaderAndData(res.invoiceStatistics.sadadInvoiceStatisticsDetailsList);

        },
        error: (error: ResponseException) => {
          this.data = [];
          console.error("Error while fetching esal monthly statics");
        }
      })
  }

  resetChartsData() {
    this.showBarChart = false;
    this.showDoughnutChart = false;
    this.showTable = false;

    this.esalAmountBarChartData.labels = [];
    this.esalAmountBarChartData.datasets[0].data = [];
    this.esalAmountDoughnutChartData.labels = [];
    this.esalAmountDoughnutChartData.datasets[0].data = [];

  }

}
