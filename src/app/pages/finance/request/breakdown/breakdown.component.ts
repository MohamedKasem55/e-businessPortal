import {Component} from '@angular/core';
import {PageModel} from "../../../../@core/model/dto/formModel";
import {breakdownControl} from "./Breakdown.component.control";
import {SummaryItemControl} from "../../../../@core/model/dto/control/sumery-item-control";
import {TitleControl} from "../../../../@core/model/dto/control/title-control";
import {FormButtonClickOutput} from "../../../../shared/form/form.component";
import { RequestService } from '../../../../@core/service/finance/request/request.service';
import { FinanceBaseComponent } from '../../finance-base/finance-base.component';
import { Installment, InstallmentListResponse } from '../../../../@core/model/rest/finance/request/installment';

@Component({
  selector: 'app-breakdown',
  templateUrl: '../../finance-base/finance-base.component.html',
  styleUrls: []
})
export class BreakdownComponent extends FinanceBaseComponent {
  public dossairID: any;
  installments: any;

  constructor(private requestService: RequestService) {
    super();
    this.pageTitle.title = ''
    this.drawPage()
    this.dossairID = sessionStorage.getItem("DOSSIER_ID")
    this.endButtons = []
  }

  drawPage() {
    this.pages = [new PageModel(1, breakdownControl())]
  }

  override ngOnInit() {
    this.getInstallmentList(this.dossairID)
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'Back':
        this.goBack();
        break;
    }
  }



  goBack() {
    this.location.back();
  }

  getInstallmentList(dossierId: any) {
    this.requestService.getInstallmentList(dossierId).subscribe((response: InstallmentListResponse) => {

      this.installments = response.installments
      this.installments.map((item: any, index: number) => {
        this.pages[0].forms[0].addControl('product' + index, new TitleControl({
          columnCount: 12,
          order: 4,
          class: "mt-4 mb-4",
          controlOptions: {
            title: item.product,
            type: 'Section', id: "",
            endButtons: [{
              id: item.vehiclesNum,
              text: `${item?.vehiclesNum} ${this.translate.instant('finance.fleet.newRequest.Cars')}`,
              type: 'primary',
              isDisable: true
            }]
          }
        }))

        this.pages[0].forms[0].addControl('brandName' + index, new SummaryItemControl({
          order: 5 + index,
          columnCount: 3,
          label: 'finance.fleet.requests.brandName',
          value: item?.brandName,

        }))
        this.pages[0].forms[0].addControl('modelName' + index, new SummaryItemControl({
          order: 6 + index,
          columnCount: 3,
          label: 'finance.fleet.requests.modelName',
          value: item?.modelName,

        }))
        this.pages[0].forms[0].addControl('vehicleVariant' + index, new SummaryItemControl({
          order: 7 + index,
          columnCount: 3,
          label: 'finance.fleet.requests.variant',
          value: item?.vehicleVariant,

        }))
        this.pages[0].forms[0].addControl('vehicleSegment' + index, new SummaryItemControl({
          order: 8 + index,
          columnCount: 3,
          label: 'finance.fleet.requests.segment',
          value: item?.vehicleSegment,

        }))
        this.pages[0].forms[0].addControl('vehiclesNum' + index, new SummaryItemControl({
          order: 9 + index,
          columnCount: 3,
          label: 'finance.fleet.requests.productFinanceAmt',
          value: (item?.vehiclePrice * item?.vehiclesNum).toString(),

        }))
        this.pages[0].forms[0].addControl('profitRate' + index, new SummaryItemControl({
          order: 10 + index,
          columnCount: 3,
          label: 'finance.fleet.requests.profitRate',
          value: item?.profitRate,

        }))
        this.pages[0].forms[0].addControl('insurancePer' + index, new SummaryItemControl({
          order: 11 + index,
          columnCount: 3,
          label: 'finance.fleet.requests.insurancePremium',
          value: item?.insurancePer,

        }))
        this.pages[0].forms[0].addControl('adminFeeAmt' + index, new SummaryItemControl({
          order: 12 + index,
          columnCount: 3,
          label: 'finance.fleet.requests.adminFees',
          value: item?.adminFeeAmt,

        }))
        this.pages[0].forms[0].addControl('tenure' + index, new SummaryItemControl({
          order: 13 + index,
          columnCount: 3,
          label: 'finance.fleet.requests.tenure',
          value: item?.tenure,

        }))
        this.pages[0].forms[0].addControl('downPaymentAmount' + index, new SummaryItemControl({
          order: 14 + index,
          columnCount: 4,
          label: 'finance.fleet.requests.downPaymentAmount',
          value: item?.minDownPmt,

        }))
        this.pages[0].forms[0].addControl('monthlyPmtAmt' + index, new SummaryItemControl({
          order: 15 + index,
          columnCount: 3,
          label: 'finance.fleet.requests.monthlyPmtAmt',
          value: item?.firstInstallmentAmt,

        }))

      })
    })

  }
}
