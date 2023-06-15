import { Component } from '@angular/core';
import { PayrollBaseComponent } from "../../payroll-base/payroll-base.component";
import { ButtonModel } from "arb-design-library/model/button.model";
import { FormResult, PageModel } from "../../../../@core/model/dto/formModel";
import { FormButtonClickOutput } from "../../../../shared/form/form.component";
import { TitleModel } from "arb-design-library/model/title.model";
import { SummaryModel } from "arb-design-library/model/summary.model";
import { ResultModal } from "../../../../@core/model/dto/result.modal";
import {
  AmountBarChartConfig,
  AmountBarChartOptions,
  buildForm,
  countBarChartConfig,
  countBarChartOptions,
  tryAgainLinCard
} from "./wps-analytics-controls";
import { AnalyticsDashboardReq } from "../../../../@core/model/rest/payroll/wps/analytics-dashboard/analytics-dashboard-req";
import { Utils } from "../../../../@core/utility/Utils";
import { ChartConfiguration, ChartOptions } from "chart.js";
import {
  ResponseRelatedFilesPayrollWPS,
  WpsFile
} from "../../../../@core/model/rest/payroll/wps/analytics-dashboard/response-related-files-payroll-wps";
import { PayrollPagesNames } from "../../payroll-pages-names";
import { LineCardModel } from 'arb-design-library/model/line-card.model';

@Component({
  selector: 'app-wps-analytics',
  templateUrl: './wps-analytics.component.html'
})
export class WpsAnalyticsComponent extends PayrollBaseComponent {
  amountBarChartData: ChartConfiguration<any>['data'] = AmountBarChartConfig;
  countBarChartData: ChartConfiguration<any>['data'] = countBarChartConfig;
  AmountChartOptions: ChartOptions<'bar'> = AmountBarChartOptions;
  countChartOptions: ChartOptions<'bar'> = countBarChartOptions;

  pages: PageModel[] = [new PageModel(1, buildForm())];
  pageTitle: TitleModel = {
    id: "WpsAnalyticsComponentTitleId",
    title: "payroll.payroll-wps.analytics.page-name",
    showArrow: true
  };
  startButtons!: ButtonModel[];
  endButtons!: ButtonModel[];
  summary!: SummaryModel
  result!: ResultModal;
  showCarts: boolean = false;
  tryAgainBar: LineCardModel[] = structuredClone(tryAgainLinCard)
  tryAgainDougnet: LineCardModel[] = structuredClone(tryAgainLinCard)
  showTryAgain: boolean = false;

  constructor() {
    super()
    Utils.setBreadcrumb([
      { text: 'payroll.main-page-name', url: PayrollPagesNames.PAYROLL },
      {
        text: 'payroll.payroll-wps.name',
        url: (PayrollPagesNames.PAYROLL + '/employee/list/' + this.getPayrollType())
      },
      { text: 'payroll.payroll-wps.analytics.page-name', url: "" },])
    this.updateData();
  }

  buildReq(): AnalyticsDashboardReq {
    return {
      dateTo: Utils.getDateFormatted(this.getControl(this.pages, 0, 0, 'toDate').value, 'yyyy-MM-dd'),
      dateFrom: Utils.getDateFormatted(this.getControl(this.pages, 0, 0, 'fromDate').value, 'yyyy-MM-dd')
    }
  }

  onButtonClick(data: FormButtonClickOutput) {
    switch (data.buttonId) {
      case 'Search':
        this.updateData();
        break
      case PayrollPagesNames.ARROW_TITLE:
        this.goBackToPayroll()
        break
    }
  }

  override onResultChanged($event: FormResult[]) {

  }

  private updateData() {
    this.showTryAgain = false;
    this.showCarts = false;
    this.wpsService.getDashboardData(this.buildReq()).subscribe({
      next: (results) => {
        this.updateChartsData(results);
      },
      error: (err: any) => {
        this.showTryAgain = true;
        console.log('Here is the error...', err.status);
      },

    })
  }

  updateChartsData(response: ResponseRelatedFilesPayrollWPS) {
    if (response.files.length > 0) {
      this.countBarChartData.datasets[0].label = this.translate.instant('wps-analytics.rajhiCount')
      this.countBarChartData.datasets[1].label = this.translate.instant('wps-analytics.localCount')
      this.amountBarChartData.datasets[0].label = this.translate.instant('wps-analytics.rajhiAmount')
      this.amountBarChartData.datasets[1].label = this.translate.instant('wps-analytics.localAmount')

      response.files.forEach((file: WpsFile) => {
        this.amountBarChartData.datasets[0].data.push(file.rajhiRecordAmount)
        this.amountBarChartData.datasets[1].data.push(file.localRecordAmount)
        this.countBarChartData.datasets[0].data.push(file.rajhiRecordCount)
        this.countBarChartData.datasets[1].data.push(file.localRecordCount)
      })
      this.amountBarChartData.labels = this.getTranslatedMonths(response.months)
      this.countBarChartData.labels = this.getTranslatedMonths(response.months)
      this.showCarts = true;
    } else {
      this.showTryAgain = true;
    }
  }

  getTranslatedMonths(months: string[]) {
    const tMonths: any[] = []
    const iMonths = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    months.forEach((month) => {
      let tMonth = month.toLowerCase()
      iMonths.forEach((iMonth) => {
        tMonth = tMonth.replace(
          iMonth.toLowerCase(),
          this.translate.instant(
            'public.months.' + iMonth.toLowerCase(),
          ),
        )
      })
      tMonths.push(tMonth)
    })
    return tMonths
  }

  onTryAgainClick(event: any) {
    this.router
      .navigate(['/payroll/analytics/wps'])
      .then(() => {
      });
  }
}
