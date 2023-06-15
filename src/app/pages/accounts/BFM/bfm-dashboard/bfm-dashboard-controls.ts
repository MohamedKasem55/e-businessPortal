import { ButtonModel } from 'arb-design-library/model/button.model';
import { Chart, ChartOptions, LegendItem } from 'chart.js';
import { AccountControl } from "app/@core/model/dto/control/account-control"
import { FormModel } from "app/@core/model/dto/formModel"
import { AmountModel } from 'arb-design-library/model/amount.model';
import { StyleColorChart } from 'styleColorChart';
import { LineCardModel } from 'arb-design-library/model/line-card.model';
import { Utils } from "../../../../@core/utility/Utils";

export const getSelectAccountControl = () => {
  return new FormModel({
    id: 'selectAccount',
    controls: {
      selectAccount: new AccountControl({
        label: 'accounts.selectAccount',
        required: true,
        order: 2,
        columnCount: 12,
      })
    }
  })
};

export interface financialInstitutionsRes{
  financialInstitutionsList:Array<financialInstitutionRes>,
  generateChallengeAndOTP:any,
  totalPages:number
}
export interface financialInstitutionRes {
  financialInstitutionId:string,
  financialInstitutionName:{nameEn:string,nameAr:string}
  active:boolean,
  dataGroupList:[],
  securityProfilesList:[]
}
export interface financialInstitutionOption{
  value:string,
  key:string,
  image?:string
}
export interface dataGroupRes {
  errorCode: string,
  errorDescription: string,
  errorResponse:any,
  generateChallengeAndOTP:any,
  dataGroupsList:Array<dataGroupList>

}
export interface dataGroupList {
  dataGroupId: string,
  descriptionEN: string,
  descriptionAR: string,
  permissionsList:Array<dataGroupPermission>
}

export interface dataGroupPermission{
  resourceId: string,
  resourceDescriptionEn: string,
  resourceDescriptionAr: string,
  permissionId: string,
  permissionDescriptionEn: string,
  permissionDescriptionAr: string
}
export const periodsTypeList: ButtonModel = {
  id: "",
  text: "accounts.curr-month",
  showLoading: false,
  type: "outLine",
  suffixIcon: 'arb-icon-chevronDown',
  isDisable: false,
  options: [
    {
      id: '1',
      text: 'accounts.today',
    },
    {
      id: '2',
      text: 'accounts.curr-month'
    },
    {
      id: '3',
      text: 'accounts.six-month'
    },

  ]
};

export const showIncomeDetailsBtn: ButtonModel = {
  id: 'show-income-details',
  text: "accounts.show-details",
  type: "outLine",
};

export const showOutcomeDetailsBtn: ButtonModel = {
  id: 'show-outcome-details',
  text: "accounts.show-details",
  type: "outLine",
};

export const initialAmount: AmountModel = {
  amount: "0",
  currency: "SAR",
  size: "md",
  color: "color-arb-primaryText"
};

export const initialAmountPositive: AmountModel = {
  amount: "0",
  currency: "SAR",
  size: "md",
  color: "color-arb-positiveText"

};

export const initialAmountWarning: AmountModel = {
  amount: "0",
  currency: "SAR",
  size: "md",
  color: "color-arb-negativeText"

};

export const balanceChartConfig = {
  labels: [],
  datasets: [
    {
      label: Utils.getTranslation('account.balance'),
      data: [],
      type: 'line',
      pointRadius: 5,
      fill: true,
      tension: 0.5,
      backgroundColor: "",
      borderColor: "",
      pointBorderColor: "",
      pointBackgroundColor: "",
      pointHoverBackgroundColor: "",
      pointHoverBorderColor: "",
    }
  ],

};

export const cashFlowChartConfig = {
  labels: [],
  datasets: [
    {
      label: Utils.getTranslation('accounts.actual'),
      data: [],
      type: 'line',
      pointRadius: 5,
      pointBackgroundColor: "",
      borderColor: "",
      pointHoverBackgroundColor: "",
      pointHoverBorderColor: "",
    },
    {
      label: Utils.getTranslation("accounts.income"),
      type: 'bar',
      barThickness: 10,
      data: [],
      stack: 'Stack 0',
      borderRadius: 5,
      backgroundColor: "",
      hoverBackgroundColor: "",
      hoverBorderColor: "",
    },
    {
      label: Utils.getTranslation("accounts.expenses"),
      type: 'bar',
      barThickness: 10,
      data: [],
      stack: 'Stack 0',
      borderRadius: 5,
      backgroundColor: "",
      hoverBackgroundColor: "",
      hoverBorderColor: ""
    }
  ],

};

export const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
  },
};

export const doughnutChartConfig = {
  labels: [],
  datasets: [
    {
      data: [],
      type: 'doughnut',
      backgroundColor: [
        StyleColorChart.colors.violet800,
        StyleColorChart.colors.violet700,
        StyleColorChart.colors.violet600,
        StyleColorChart.colors.violet500,
        StyleColorChart.colors.violet400,
        StyleColorChart.colors.violet300,
        StyleColorChart.colors.violet200,
        StyleColorChart.colors.violet100,
        StyleColorChart.colors.violet50,
      ],
      hoverBackgroundColor: [
        StyleColorChart.colors.violet800,
        StyleColorChart.colors.violet700,
        StyleColorChart.colors.violet600,
        StyleColorChart.colors.violet500,
        StyleColorChart.colors.violet400,
        StyleColorChart.colors.violet300,
        StyleColorChart.colors.violet200,
        StyleColorChart.colors.violet100,
        StyleColorChart.colors.violet50,
      ],
      borderColor: [
        StyleColorChart.colors.violet800,
        StyleColorChart.colors.violet700,
        StyleColorChart.colors.violet600,
        StyleColorChart.colors.violet500,
        StyleColorChart.colors.violet400,
        StyleColorChart.colors.violet300,
        StyleColorChart.colors.violet200,
        StyleColorChart.colors.violet100,
        StyleColorChart.colors.violet50,
      ],
      hoverBorderColor: StyleColorChart.colors.violet800
    }
  ],
};

export const barChartConfig = {
  labels: [],
  datasets: [
    {
      data: [],
      type: 'bar',
      barThickness: 30,
      maxBarThickness: 60,
      minBarLength: 15,
      backgroundColor: [
        StyleColorChart.colors.violet800,
        StyleColorChart.colors.violet700,
        StyleColorChart.colors.violet600,
        StyleColorChart.colors.violet500,
        StyleColorChart.colors.violet400,
        StyleColorChart.colors.violet300,
        StyleColorChart.colors.violet200,
        StyleColorChart.colors.violet100,
        StyleColorChart.colors.violet50,
      ],
      hoverBackgroundColor: [
        StyleColorChart.colors.violet800,
        StyleColorChart.colors.violet700,
        StyleColorChart.colors.violet600,
        StyleColorChart.colors.violet500,
        StyleColorChart.colors.violet400,
        StyleColorChart.colors.violet300,
        StyleColorChart.colors.violet200,
        StyleColorChart.colors.violet100,
        StyleColorChart.colors.violet50,
      ],
      borderColor: [
        StyleColorChart.colors.violet800,
        StyleColorChart.colors.violet700,
        StyleColorChart.colors.violet600,
        StyleColorChart.colors.violet500,
        StyleColorChart.colors.violet400,
        StyleColorChart.colors.violet300,
        StyleColorChart.colors.violet200,
        StyleColorChart.colors.violet100,
        StyleColorChart.colors.violet50,
      ]
    }
  ],
};


export const barChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context: any) {
          let label = context.dataset.label || '';

          if (context.parsed.y !== null) {
            label = context.parsed.y + " " + sessionStorage.getItem("bfmSelectedCurrecny")
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

export const doughnutChartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context: any) {
          let label = context.label || '';
          if (context.parsed.y !== null) {
            label = context.parsed + " " + sessionStorage.getItem("bfmSelectedCurrecny")
          }
          return label;
        }
      }
    },
    legend: {
      display: true,
      position: 'bottom',
      onClick: function (event, legendItem) {
        return;

      },
      labels: {
        usePointStyle: true,
        generateLabels: (chart: Chart): LegendItem[] => {
          const datasets = chart.data.datasets;
          var temp = [
            StyleColorChart.colors.violet800,
            StyleColorChart.colors.violet700,
            StyleColorChart.colors.violet600,
            StyleColorChart.colors.violet500,
            StyleColorChart.colors.violet400,
            StyleColorChart.colors.violet300,
            StyleColorChart.colors.violet200,
            StyleColorChart.colors.violet100,
            StyleColorChart.colors.violet50
          ]
          let selectedGraph = sessionStorage.getItem("bfmSelectedGraph");
          if (selectedGraph === 'Outflow') {
            temp = [
              StyleColorChart.colors.orange800,
              StyleColorChart.colors.orange700,
              StyleColorChart.colors.orange600,
              StyleColorChart.colors.orange500,
              StyleColorChart.colors.orange400,
              StyleColorChart.colors.orange300,
              StyleColorChart.colors.orange200,
              StyleColorChart.colors.orange100,
              StyleColorChart.colors.orange50
            ]
          }
          var lablesValues: string[];
          lablesValues = [];
          chart.data.labels?.forEach(label => {
            if (typeof label === 'string') {
              lablesValues.push(label);
            }
          })
          return datasets[0].data.map((data, i) => ({
            text: lablesValues[i],
            fillStyle: temp[i],
            pointStyle: "circle",
            datasetIndex: i
          }))
        }
      }
    },
  },
};

