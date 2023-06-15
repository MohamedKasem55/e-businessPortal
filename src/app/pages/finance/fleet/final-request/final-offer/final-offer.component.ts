import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {PageModel} from "../../../../../@core/model/dto/formModel";
import {finalOffer} from "./final-offer.component.controller";
import {TitleControl} from "../../../../../@core/model/dto/control/title-control";
import {SummaryItemControl} from "../../../../../@core/model/dto/control/sumery-item-control";
import {FormButtonClickOutput} from "../../../../../shared/form/form.component";
import { FinalAgreementAcceptance } from '../../../../../@core/model/rest/finance/request/final-agreement';
import { RequestService } from '../../../../../@core/service/finance/request/request.service';
import { FinanceBaseComponent } from '../../../finance-base/finance-base.component';

@Component({
  selector: 'final-offer',
  templateUrl: '../../../finance-base/finance-base.component.html',
  styleUrls: []
})
export class FinalOfferComponent extends FinanceBaseComponent {

  public dossairID: string;
  public customerOfferDetails: any;

  constructor(
    private requestService:RequestService
  ) {
    super();
    this.dossairID = sessionStorage.getItem("DOSSIER_ID") || ""
    this.drawPage()
  }

  drawPage() {
    this.pages = [new PageModel(1, finalOffer())]
  }

  override ngOnInit() {
    super.ngOnInit();
    this.getFinalOfferInq()
    this.endButtons = [this.rejectButton, this.acceptButton];
  }

  getFinalOfferInq() {
    let data = {
      dossierId: this.dossairID
    }
    this.requestService.getCustomerFinalOfferInq(data).subscribe(res => {
      if (res === null) {
        this.router.navigate(['/']).then(() => {
        });
      } else {
        this.customerOfferDetails = res?.customerOfferDetails?.custOfferVehicleGroupLstItemTypes
        this.renderFinalOfferParams(this.customerOfferDetails)
      }
    })
    this.renderFinalOfferParams(this.customerOfferDetails)

  }

  acceptFinalOffer() {
    let acceptInitialOffer:FinalAgreementAcceptance = {
      dosierID: this.dossairID
    }
    this.requestService.setFinalAgreementAcceptance(acceptInitialOffer).subscribe(response => {
        this.router.navigate(['/finance/fleet/result'], {queryParams: {status: 'accept'}})
    })
  }

  renderFinalOfferParams(custOffer: any) {
    custOffer.map((item: any) => {
      this.pages[0].forms[0].addControl(<string>item.product, new TitleControl({
        columnCount: 12,
        order: 2,
        class: "mt-4 mb-4",
        controlOptions: {
          title: item.product,
          type: 'Section', id: "",
          endButtons: [{
            id: item.vehiclesNum,
            text: `${item.vehiclesNum} ${this.translate.instant('finance.fleet.newRequest.Cars')}`,
            type: 'primary',
            isDisable: true
          }]
        }
      }))

      this.pages[0].forms[0].addControl('brandName', new SummaryItemControl({
        order: 3,
        columnCount: 4,
        label: item?.brandName,
        value: item?.campaign,
      }))
      this.pages[0].forms[0].addControl('modelName', new SummaryItemControl({
        order: 4,
        columnCount: 4,
        label: 'finance.fleet.requests.modelName',
        value: item?.modelName,
      }))
      this.pages[0].forms[0].addControl('modelYear', new SummaryItemControl({
        order: 5,
        columnCount: 4,
        label: 'finance.fleet.requests.modelYear',
        value: item?.modelYear,
      }))
      this.pages[0].forms[0].addControl('vehicleVariant', new SummaryItemControl({
        order: 6,
        columnCount: 4,
        label: 'finance.fleet.requests.vehicleVariant',
        value: item?.vehicleVariant,
      }))
      this.pages[0].forms[0].addControl('purposeofUseValue', new SummaryItemControl({
        order: 7,
        columnCount: 4,
        label: 'finance.fleet.requests.purposeofUseValue',
        value: (parseInt(item?.vehiclePrice) * parseInt(item.vehiclesNum)).toString(),
      }))
      this.pages[0].forms[0].addControl('profitRate', new SummaryItemControl({
        order: 8,
        columnCount: 4,
        label: 'finance.fleet.requests.profitRate',
        value: item?.profitRate + ' %',
      }))
      this.pages[0].forms[0].addControl('installmentAmt', new SummaryItemControl({
        order: 9,
        columnCount: 4,
        label: 'finance.fleet.requests.installmentAmt',
        value: `${item?.vehiclesNum} ${this.translate.instant('financeProduct.sar')}`,
      }))
      this.pages[0].forms[0].addControl('quotationDate', new SummaryItemControl({
        order: 10,
        columnCount: 4,
        label: 'finance.fleet.requests.quotationDate',
        value: `${item?.quotationDate} ${this.translate.instant("financeProduct.sar")}`,
      }))
      this.pages[0].forms[0].addControl('downPmt', new SummaryItemControl({
        order: 11,
        columnCount: 4,
        label: 'finance.fleet.requests.downPaymentAmount',
        value: `${item?.downPmt} ${this.translate.instant('finance.fleet.requests.months')}`,
      }))
      this.pages[0].forms[0].addControl('tenure', new SummaryItemControl({
        order: 12,
        columnCount: 4,
        label: 'finance.fleet.requests.financingtenure',
        value: `${item?.tenure} ${this.translate.instant('finance.fleet.requests.months')}`,
      }))
      this.pages[0].forms[0].addControl('minDownPmt', new SummaryItemControl({
        order: 13,
        columnCount: 4,
        label: 'finance.fleet.requests.MinimumDownPayment',
        value: `${item?.minDownPmt} ${this.translate.instant('finance.fleet.requests.months')}`,
      }))
    })

  }

  override onButtonClick(event: FormButtonClickOutput) {
    if (event.buttonId === 'Accept') {
      this.router.navigate(['/finance/request/ivr-call'])
    }
    if (event.buttonId === 'Reject') {
      this.router.navigate(['/finance'])
    }
    if (event.buttonId === 'Back') {
      this.router.navigate(['/finance'])
    }
  }
}
