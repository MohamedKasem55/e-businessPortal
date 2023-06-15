import {ChartConfiguration, ChartOptions} from 'chart.js';
import {TitleModel} from 'arb-design-library/model/title.model';
import { StyleColorChart } from '../../../../../styleColorChart';

export const doughnutChartOptions:ChartOptions<any> = {
  responsive: false,
  cutout: '85%',
  hover: {mode: null},
  plugins: {
    legend: {
      display: false,
      tooltip: {
        enabled: false
      }
    }
  }
}

 export const chartData:ChartConfiguration<any>['data'] =  {
  labels: [],
  datasets: [
    {
      data: [],
      type: "doughnut",
      fill: true,
      tension: 0.5,
      backgroundColor:  [StyleColorChart.primaryColor, StyleColorChart.outlineColor],
      hoverOffset: 4,
      borderWidth: [0, 0, 0, 0],
      borderRadius: 1000,
    }
  ],

}

export const financeInformationTitle = (): TitleModel => {
  return {
    id: "1",
    type: 'Section',
    title: 'finance.fleet.requests.financeInformation',
    showArrow: false,
  }
}

export const InstallmentDetailsTitle = (): TitleModel => {
  return {
    id: "1",
    type: 'Section',
    title: 'finance.fleet.requests.installmentDetails',
    showArrow: false,
  }
}
export const viewInstallment = () => {
  return {

    id: '11',
    title: 'finance.fleet.btn.viewInstallmentDetails',
    loading: false,
    type: "outLine",
    suffixIcon: "arb-icon-video"
  }

}


