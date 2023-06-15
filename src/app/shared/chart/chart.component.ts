import {Component, Input, OnInit} from '@angular/core';
import {ChartConfiguration, ChartOptions} from "chart.js";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  @Input() width!:number;
  @Input() height!:number;

  @Input()
  showHeader: boolean = false;

  @Input() bgClass:string = 'bg-arb-primaryCard'

  @Input('chartData')
  set chartConfig(config: ChartConfiguration['data']) {
    this.chartData = config
  }

  @Input()
  chartOptions: ChartOptions<any> = {
    responsive: true
  };

  @Input()
  showChart: boolean = false;

  @Input()
  ammoutOptions!: ChartAmountOptions;

  /** This is sample config for the usage.
   *  Note: To show data in chart you need to hide and show the graph once you push
   *  values into data files along with fields.
   * */
  chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        type: "line",
        data: [],
        label: '',
        fill: true,
        tension: 0.5,
        backgroundColor: "",
        borderColor: "",
        pointBorderColor: "",
        pointBackgroundColor: "",
        pointHoverBackgroundColor: "",
        pointHoverBorderColor: "",
      }
    ]
  };

  constructor() {
  }

  ngOnInit(): void {
  }


}

type ChartAmountOptions = {
  showAmount:boolean 
  amount:string
  currency:string
}
