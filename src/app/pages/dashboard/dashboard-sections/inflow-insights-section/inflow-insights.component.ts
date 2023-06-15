import {Component, OnInit} from '@angular/core';
import {ActiveElement, Chart, ChartConfiguration, ChartOptions} from "chart.js";
import {
  barChartConfig,
  doughnutChartConfig,
  doughnutChartOptions, periodsTypeList,
  showIncomeDetailsBtn, tryAgainLinCard
} from "../../../accounts/BFM/bfm-dashboard/bfm-dashboard-controls";
import {AccountsCommonService} from "../../../../@core/service/accounts/accounts-common.service";
import {ButtonModel} from "arb-design-library/model/button.model";
import {Account} from "../../../../@core/model/rest/common/account";
import {LineCardModel} from "arb-design-library/model/line-card.model";
import { POSLocation } from 'app/@core/model/rest/accounts/bfm/p-o-s-location';
import { lastValueFrom, take } from 'rxjs';
import { CategoryResponse } from 'app/@core/model/rest/accounts/bfm/category-response';

@Component({
  selector: 'app-inflow-insights-section',
  templateUrl: './inflow-insights.component.html',
})
export class InflowInsightsComponent implements OnInit {

  selectedAccount!: Account;
  chartPageTitle: string = 'public.in-flow';
  chartAmountOptions = {
    amount: "",
    showAmount: false,
    currency: "608"
  }
  inOutflowBarChartData: ChartConfiguration<any>['data'] = structuredClone(barChartConfig);
  inOutflowDoughnutChartData: ChartConfiguration<any>['data'] = structuredClone(doughnutChartConfig);
  inOutflowDoughnutChartOptions: ChartOptions<'doughnut'> = doughnutChartOptions;
  locationDoughnutChartData: ChartConfiguration<any>['data'] = structuredClone(doughnutChartConfig);
  tryAgainDougnet: LineCardModel[] = structuredClone(tryAgainLinCard)
  showIncomeDetailsBtn: ButtonModel = showIncomeDetailsBtn;
  periodsTypeList: ButtonModel = periodsTypeList;
  enableDrillDownFlowChart: boolean = false;
  showTryAgain: boolean = false;
  showLocationGraph = false
  showArrow = false;
  selectedPeriodType: any;
  showInflowChart: boolean = false;
  locationChartAmmoutOptions: ChartAmountOptions = {
    amount: "",
    showAmount: false,
    currency: "608"
  }
  tryAgainBar: LineCardModel[] = structuredClone(tryAgainLinCard)
  cashInFlowDataResponse!: CategoryResponse
  inOutflowBarChartDrillDownOptions: ChartOptions<'bar'> = {
    responsive: true,
    onClick: (event: any, elements: ActiveElement[], chart: Chart) => {
      if (this.enableDrillDownFlowChart) {
        return;
      }
      const points = chart.getElementsAtEventForMode(event, 'nearest', {intersect: true}, true);
      if (points.length) {
        const firstPoint = points[0];
        if (chart.data.labels && chart.data.labels.length > 0) {
          const label = chart.data.labels[firstPoint.index]
          this.loadInflowCategoryAndSubCategoryGraphs(label,true);
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || '';
            if (context.parsed.y !== null) {
              label = context.parsed.y + " SAR"
            }
            return label;
          }
        }
      },
      legend: {
        display: false
      },
    },
  };

  constructor(private accountsService: AccountsCommonService) {
    this.selectedPeriodType = this.periodsTypeList.options![0]
    sessionStorage.setItem("bfmSelectedGraph","Inflow");
    sessionStorage.setItem("bfmSelectedCurrecny", "SAR");
    this.loadInflowCategoryAndSubCategoryGraphs(false)
    this.loadLocationGraphs();
  }

  ngOnInit(): void {

  }

  loadInflowCategoryAndSubCategoryGraphs(selectedCategory?: any,isSubCategory = false) {
    if (isSubCategory && selectedCategory) {
      this.showLocationGraph = false;
      this.showIncomeDetailsBtn.isDisable = false;
      this.chartPageTitle = selectedCategory;
      this.showArrow = true;
      this.showInflowChart = false;
      this.enableDrillDownFlowChart = isSubCategory;
      this.resetFlowGraphs();
      let codes = this.getCodeAgainstCategory(selectedCategory, true);
      this.accountsService.getTopSubCategory({
        IBAN: null,
        periodType: 3,
        currency: "SAR",
        noOfSubCats: 5,
        codes: codes
      }).subscribe(
        {
          next: (results) => {
            setTimeout(() => {
              this.buildInflowGraphData(results, isSubCategory)
            },
              1000);

          },
          error: (err: any) => {
            this.buildInflowGraphData({}, isSubCategory)
            console.log('Here is the error...', err.status);
          },
        });
    } else {
      this.chartPageTitle = 'Cashflow Overview - Inflow';
      this.showIncomeDetailsBtn.isDisable = true;
      this.showArrow = false;
      this.enableDrillDownFlowChart = isSubCategory;
      this.showInflowChart = false;
      this.resetFlowGraphs();

      this.accountsService.getTopByCategory({
        IBAN: null,
        periodType: 3,
        currency: "SAR",
        noOfCats: 5
      }).subscribe(
        {
          next: (results) => {
            this.cashInFlowDataResponse = results;
            this.buildInflowGraphData(results, isSubCategory)
          },
          error: (err: any) => {
            this.buildInflowGraphData({}, isSubCategory)
            console.log('Here is the error...', err.status);
          },
        });
    }


  }

  getCodeAgainstCategory(category: string, income: boolean = false, isSubCategory: boolean = false): string {
    let result: any = null
    if (!income && this.cashInFlowDataResponse && this.cashInFlowDataResponse.expense) {
      result = this.cashInFlowDataResponse.expense.filter(obj => {
        if (!isSubCategory) {
          return obj.categoryName && obj.categoryName === category
        } else {
          return obj.subCategoryName && obj.subCategoryName === category
        }
      })
    } else if (income && this.cashInFlowDataResponse && this.cashInFlowDataResponse.income) {
      result = this.cashInFlowDataResponse.income.filter(obj => {
        if (!isSubCategory) {
          return obj.categoryName && obj.categoryName === category
        } else {
          return obj.subCategoryName && obj.subCategoryName === category
        }
      })
    }
    return result.length > 0 ? result[0].codes : undefined;
  }

  buildInflowGraphData(result: any, isSubCategory = false) {
    if (result && result.income) {
      let totalAmount = 0
      for (const income of result.income) {
        totalAmount += income.total;
        this.inOutflowBarChartData.labels!.push(isSubCategory ? income.subCategoryName : income.categoryName);
        this.inOutflowBarChartData.datasets[0].data.push(income.total);
        this.inOutflowDoughnutChartData.labels!.push(isSubCategory ? income.subCategoryName : income.categoryName);
        this.inOutflowDoughnutChartData.datasets[0].data.push(income.total);
      }
      this.setChartTotalAmmount(totalAmount);
    }
    this.showInflowChart = true;
    this.showTryAgain = this.inOutflowBarChartData.labels!.length === 0;
  }

  setChartTotalAmmount(totalAmount: Number) {
    if (totalAmount > 0) {
      this.chartAmountOptions.amount = totalAmount.toString();
      this.chartAmountOptions.showAmount = true;
      this.chartAmountOptions.currency = this.selectedAccount ? this.selectedAccount.currency : '608';
    } else {
      this.chartAmountOptions.showAmount = false;
    }
  }

  resetFlowGraphs() {
    this.inOutflowBarChartData.labels = []
    this.inOutflowBarChartData.datasets[0].data = []
    this.inOutflowDoughnutChartData.labels = []
    this.inOutflowDoughnutChartData.datasets[0].data = []
  }


  onTryAgainClick(event: any) {
    this.selectedPeriodType = this.periodsTypeList.options![2]
    this.loadInflowCategoryAndSubCategoryGraphs(false)
  }

  buildLocationRequest(): POSLocation {
    return {
      IBAN: null,
      periodType: 3,
      currency: "SAR",
      noOfCities: 5
    }
  }

  async loadLocationGraphs() {
    this.showLocationGraph = false;
    this.locationDoughnutChartData.labels = []
    this.locationDoughnutChartData.datasets[0].data = []
    const result = await lastValueFrom(
      this.accountsService.getPOSLocation(this.buildLocationRequest()).pipe(take(1))
    );
    if (result && Array.isArray(result) && result.length > 0) {
      let totalAmount = 0
      for (const income of result) {
        totalAmount += income.total;
        this.locationDoughnutChartData.labels!.push(income.city);
        this.locationDoughnutChartData.datasets[0].data.push(income.total);
      }
      this.setChartTotalAmmount1(totalAmount, this.locationChartAmmoutOptions);
      this.showLocationGraph = true;
    }
  }

  setChartTotalAmmount1(totalAmount: Number, chartAmmoutOptions: ChartAmountOptions) {
    if (totalAmount > 0) {
      chartAmmoutOptions.amount = totalAmount.toString();
      chartAmmoutOptions.showAmount = true;
      chartAmmoutOptions.currency = this.selectedAccount ? this.selectedAccount.currency : '608';
    } else {
      chartAmmoutOptions.showAmount = false;
    }
  }

  onTitleButtonClick(event: any) {
    console.log(event);
    this.loadInflowCategoryAndSubCategoryGraphs(false)
    this.loadLocationGraphs();  }

}

type ChartAmountOptions = {
  showAmount: boolean
  amount: string
  currency: string
}