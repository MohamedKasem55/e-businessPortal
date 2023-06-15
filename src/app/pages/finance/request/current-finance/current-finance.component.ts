import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {ButtonModel} from 'arb-design-library/model/button.model';
import {
  chartData,
  financeInformationTitle,
  InstallmentDetailsTitle,
  viewInstallment
} from './current-finance.component.controls';
import {ChartConfiguration, ChartOptions} from 'chart.js';
import {RequestService} from 'app/@core/service/finance/request/request.service';
import {SummaryItemModel} from 'arb-design-library/model/summary-item.model';
import {SummarySectionModel} from 'arb-design-library/model/summary-section.model';
import {TitleModel} from 'arb-design-library/model/title.model';
import { StyleColorChart } from '../../../../../styleColorChart';
import { doughnutChartOptions } from './current-finance.component.controls';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { ContractItem } from '../../../../@core/model/rest/finance/request/contract-list';
import { currentContractItem } from 'app/@core/model/rest/finance/request/current-contract';
import { FinanceProductCode } from '../../../../@core/model/rest/finance/request/products-codes';

@Component({
  selector: 'app-current-finance',
  templateUrl: './current-finance.component.html',
  styleUrls: ['current-finance.component.scss']
})
export class CurrentFinanceComponent implements OnInit {
  @ViewChild('ngbAccordion') accordion!: NgbAccordion;
  chartOption: ChartOptions<any> = doughnutChartOptions;
  chartData:ChartConfiguration<any>['data'] = chartData;
  fleetSummaryFinanceDetails: SummaryItemModel[] = [];
  fleetSummaryInstallmentDetails: SummaryItemModel[] = [];
  fleetFinanceSection!: SummarySectionModel;
  fleetInstallmentSection!: SummarySectionModel;
  financeInfoTitle!: TitleModel;
  installmentTitle!: TitleModel;
  chart_height:number = 250;
  chart_width:number = 496;
  viewInstallmentBtn: any;
  currentDetails!: currentContractItem;
  sectionList: SummarySectionModel[] = []
  contractItems: any[] = [];
  @Input() data!: ContractItem;
  paidAmount!: number;


  endButtons: ButtonModel[] = [
    {
      id: "next",
      type: "primary",
      text: "finance.fleet.btn.next",
      showLoading: false,
    },
    {
      id: "update",
      type: "secondary",
      text: "finance.fleet.btn.Update",
      showLoading: false,
    }
  ];
  accordionTitle!:TitleModel;

  constructor(private requestService: RequestService,

  ) {
  }

  ngOnInit(): void {
    this.financeInfoTitle = financeInformationTitle();
    this.installmentTitle = InstallmentDetailsTitle()
    this.viewInstallmentBtn = viewInstallment();
    this.accordionTitle = {
      id:"accordionTitle",
      title:this.data.dossierID,
      endButtons:[
        this.showButton()
      ]
  }
  }

  getcurrentDetails() {
    this.fleetSummaryFinanceDetails = [
      {
        subTitle: this.currentDetails.masterContractDtls.totalFinanceAmt,
        title: 'finance.fleet.requests.totalFinanceAmount',
      },
      {
        subTitle: this.currentDetails.masterContractDtls.totalDownPmt,
        title: 'finance.fleet.requests.totalDownPaymentAmount',
      },
      {
        subTitle: this.currentDetails.masterContractDtls.pastDueAmt,
        title: 'finance.fleet.requests.totalPastDueAmount',
      },
      {
        subTitle: this.currentDetails.masterContractDtls.totalPaidAmt,
        title: 'finance.fleet.requests.totalPaidAmount',
      },
      {
        subTitle: this.currentDetails.masterContractDtls.totalRemainingAmt,
        title: 'finance.fleet.requests.totalRemFinanceAmount',
      },
    ];

    this.fleetSummaryInstallmentDetails = [
      {
        subTitle: this.currentDetails.masterContractDtls.firstInstallmentDate,
        title: 'finance.fleet.requests.totalFinanceAmount',
      },
      {
        subTitle: this.currentDetails.masterContractDtls.nextInstallmentDate,
        title: 'finance.fleet.requests.totalDownPaymentAmount',
      },
      {
        subTitle: `${this.currentDetails.masterContractDtls.nextInstallmentAmt}`,
        title: 'finance.fleet.requests.totalPastDueAmount',
      },
      {
        subTitle: this.currentDetails.masterContractDtls.finalInstallmentDate,
        title: 'finance.fleet.requests.totalPaidAmount',
      },
      {
        subTitle: `${this.currentDetails.masterContractDtls.finalInstallmentAmt}`,
        title: 'finance.fleet.requests.totalRemFinanceAmount',
      },
      {
        subTitle: `${this.currentDetails.masterContractDtls.adminFeeAmt}`,
        title: 'finance.fleet.requests.totalRemFinanceAmount',
      },
      {
        subTitle: this.currentDetails.masterContractDtls.dueDate,
        title: 'finance.fleet.requests.totalRemFinanceAmount',
      },
    ];

    //financeInformation Summary Section
    this.fleetFinanceSection = {
      title: this.financeInfoTitle,
      items: this.fleetSummaryFinanceDetails
    }
    //FleetInstallmentInformation Summary Section
    this.fleetInstallmentSection = {
      title: this.installmentTitle,
      items: this.fleetSummaryInstallmentDetails
    }

  }

  viewInstallment(event: string) {

  }

  accordionToggle(id:string){
    this.accordion.isExpanded(`current_details_${id}`) === false ? this.accordionTitle.endButtons = [this.hideButton()]: this.accordionTitle.endButtons = [this.showButton()]
    this.accordion.toggle(`current_details_${id}`);
    this.getContractDetails()
  }

  private getContractDetails() {
    let data:{dosierID:string,financeProductCode:string | null} = {
      dosierID: this.data.dossierID,
      financeProductCode: this.data.productKey.productCode === FinanceProductCode.FLEET ? this.data.productKey.productCode : null
    }
    this.requestService
        .getContractDetails(data)
        .subscribe((result) => {
          this.currentDetails = result;
          this.getContractDetails()
          this.paidAmount = +this.currentDetails?.creditLine?.totalAmt - +this.currentDetails?.remainingAmt
          this.sectionList = [this.fleetFinanceSection, this.fleetInstallmentSection];
          this.drawChart()
        });
  }

  drawChart(){
    const remainingAmt =
    (+this.paidAmount / +this.currentDetails.creditLine.totalAmt) * 100
    const total = 100 - +remainingAmt;
    chartData.datasets[0].data = [remainingAmt, total];
  }

  showButton(): ButtonModel {
    return {
      id: "show",
      type: "outLine",
      text: "finance.fleet.requests.Show",
      suffixIcon: ' arb-icon-chevronDown'
    }
  }

  hideButton(): ButtonModel {
    return {
      id: "hide",
      type: "outLine",
      text: "finance.fleet.requests.Hide",
      suffixIcon: ' arb-icon-chevronUp'
    }
  }
}
