import { FormModel } from "../../../../@core/model/dto/formModel";
import { CalenderType, DateControl } from "../../../../@core/model/dto/control/date-control";
import { ButtonControl } from "../../../../@core/model/dto/control/button-control";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap/datepicker/ngb-date-struct";
import { formatDate } from "@angular/common";
import { ChartOptions } from "chart.js";
import { StyleColorChart } from "../../../../../styleColorChart";
import { TitleControl } from "app/@core/model/dto/control/title-control";
import { LineCardModel } from "arb-design-library/model/line-card.model";


export function buildForm(): FormModel {

  let dataFrom = new Date();
  let dateTo = new Date()
  dataFrom.setFullYear(dateTo.getFullYear() - 1)
  return new FormModel({
    id: "wpsDashboardDateId",
    controls: {
      "selectDateTitle": new TitleControl({
        order: 1,
        controlOptions: {
          id: 'selectDate',
          title: 'wps-analytics.selectDate',
        },
        columnCount: 12,
        hidden: false
      }),
      fromDate: new DateControl({
        columnCount: 5,
        order: 1,
        label: "wps-analytics.fromDate",
        value: getDateNgbDateStructFromString(formatDate(dataFrom, 'yyyy-MM-dd', 'en-US')),
        controlOptions: {
          type: CalenderType.GREGORIAN,
          displayPattern: 'dd/MM/yyyy',
          showCalendersType: false,
        }
      }),
      toDate: new DateControl({
        columnCount: 5,
        order: 1,
        label: "wps-analytics.toDate",
        value: getDateNgbDateStructFromString(formatDate(dateTo, 'yyyy-MM-dd', 'en-US')),
        controlOptions: {
          type: CalenderType.GREGORIAN,
          displayPattern: 'dd/MM/yyyy',
          showCalendersType: false,
          maxDate: getDateNgbDateStructFromString(formatDate(dateTo, 'yyyy-MM-dd', 'en-US')),
        }
      }),
      searchButton: new ButtonControl({
        order: 3,
        columnCount: 2,
        controlOptions: {
          type: "primary",
          text: 'public.search',
          id: "Search"
        }
      })

    }
  })
}

export function getDateNgbDateStructFromString(date: any): NgbDateStruct {
  let parts = date.toString().split("-");
  return {
    year: Number(parts[0]),
    month: Number(parts[1]),
    day: Number(parts[2])
  };
}

export const AmountBarChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  plugins: {
    legend: {
      display: true
    },
  },
};

export const countBarChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  plugins: {
    legend: {
      display: true
    },
  },
};

export const AmountBarChartConfig = {
  labels: [],
  datasets: [
    {
      data: [],
      type: 'bar',
      pointRadius: 5,
      fill: true,
      tension: 1,
      backgroundColor: [
        StyleColorChart.colors.orange500
      ],
      hoverBackgroundColor: [
        StyleColorChart.colors.orange500
      ]
    },
    {
      data: [],
      type: 'bar',
      pointRadius: 5,
      fill: true,
      tension: 1,
      backgroundColor: [
        StyleColorChart.colors.violet500
      ],
      hoverBackgroundColor: [
        StyleColorChart.colors.violet500
      ]
    }
  ],


};

export const countBarChartConfig = {
  labels: [],
  datasets: [
    {
      data: [],
      type: 'bar',
      pointRadius: 5,
      fill: true,
      tension: 1,
      backgroundColor: [
        StyleColorChart.colors.orange500
      ],
      hoverBackgroundColor: [
        StyleColorChart.colors.orange500
      ]
    }, {
      data: [],
      type: 'bar',
      pointRadius: 5,
      fill: true,
      tension: 1,
      backgroundColor: [
        StyleColorChart.colors.violet500
      ],
      hoverBackgroundColor: [
        StyleColorChart.colors.violet500
      ]
    }
  ],

};

export const tryAgainLinCard: LineCardModel[] = [
  {
    id: "try-again",
    title: "public.no-data",
    hasBackground: true,
    weight: "Bold",
    icon: "arb-icon-exclamation fs-4",
    button: {
      id: "button",
      text: "public.try-again",
      type: "outLine"
    },
  }
]
