import { Chart, ChartOptions, LegendItem } from 'chart.js';
import { StyleColorChart } from 'styleColorChart';

export const esalAmountDoughnutChartConfig = {
  labels: [],
  datasets: [
    {
      data: [],
      type: 'doughnut',
      backgroundColor: [
        "#6D28D9",
        "#7C3AED",
        "#8B5CF6",
        "#A78BFA",
        "#C4B5FD",
        "#DDD6FE",
        "#EDE9FE",
        "#5B21B6"
      ],
      hoverBackgroundColor: [
        "#6D28D9",
        "#7C3AED",
        "#8B5CF6",
        "#A78BFA",
        "#C4B5FD",
        "#DDD6FE",
        "#EDE9FE",
        "#5B21B6"
      ]
    }
  ],

};

export const esalAmountBarChartConfig = {
  labels: [],
  datasets: [
    {
      data: [],
      type: 'bar',
      backgroundColor: [
        "#6D28D9",
        "#7C3AED",
        "#8B5CF6",
        "#A78BFA",
        "#C4B5FD",
        "#DDD6FE",
        "#EDE9FE",
        "#5B21B6"
      ],
      hoverBackgroundColor: [
        "#6D28D9",
        "#7C3AED",
        "#8B5CF6",
        "#A78BFA",
        "#C4B5FD",
        "#DDD6FE",
        "#EDE9FE",
        "#5B21B6"
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

export const doughnutChartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context: any) {
          let label = context.label || '';
          if (context.parsed.y !== null) {
            label = context.parsed + " SAR"
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
          var temp = ['#5B21B6', '#EDE9FE', '#DDD6FE', '#C4B5FD', '#A78BFA', '#8B5CF6', '#7C3AED', '#6D28D9']
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
