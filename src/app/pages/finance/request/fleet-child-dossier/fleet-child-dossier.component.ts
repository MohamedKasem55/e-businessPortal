import {Component} from '@angular/core';

import {ActivatedRoute, Router} from "@angular/router";
import {PageModel} from "../../../../@core/model/dto/formModel";
import {
  attentionNeededModel,
  childContractForm,
  getReviewModel,
  IssueDeliveryModel
} from "./fleet-child-dossier.component.controller";
import {LineCardControl} from "../../../../@core/model/dto/control/line-card-control";
import {FormButtonClickOutput} from "../../../../shared/form/form.component";
import {TrackApplication} from "../../../../@core/model/rest/finance/request/track-application";
import {PopupInputModel, PopupOutputModel} from "../../../../@core/model/dto/popup.model";
import {PopupService} from "../../../../@core/service/base/popup.service";
import {ProcedureStatusControl} from "../../../../@core/model/dto/control/procedure-status-control";
import {TextControl} from "../../../../@core/model/dto/control/text-control";
import { RequestService } from '../../../../@core/service/finance/request/request.service';
import { FinanceBaseComponent } from '../../finance-base/finance-base.component';
import { childContracts } from 'app/@core/model/rest/finance/request/requested-finance';


@Component({
  selector: 'app-fleet-child-dossier',
  templateUrl: '../../finance-base/finance-base.component.html',
})
export class FleetChildDossierComponent extends FinanceBaseComponent {
  public item: any;
  public dossairID: any;
  vendorInfo: any;

  reviewForm: PopupInputModel = getReviewModel();
  attentionForm: PopupInputModel = attentionNeededModel();
  deliveryIssueForm: PopupInputModel = IssueDeliveryModel();

  DossierStatus = new Map<string, any>([
    ['RJC', 'fleet.status.rejected'],
    ['PEN', 'fleet.status.pending'],
    ['DDW', '/finance/request/contract'],
    ['DBD', 'finance.fleet.description.sanadAcceptance'],
    ['DFP', 'fleet.status.waitingSANAD'],
    ['CLS', ''],
    ['', 'fleet.status.pending'],
    ['IVW', '/finance/request/contract'],
  ])
  public appTrackData!: TrackApplication | null;

  constructor(private route: ActivatedRoute,
              private popupService: PopupService,
              private requestService:RequestService
     ) {
    super();
    this.route.queryParams
      .subscribe((params: any) => {
          this.item = JSON.parse(params.item)
        }
      );
    this.dossairID = sessionStorage.getItem("DOSSIER_ID")
  }

  override ngOnInit() {
    super.ngOnInit();
    this.drawPage()
    this.childContracts()
  }

  drawPage() {
    this.pages = [new PageModel(1, childContractForm(this.item))]
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    super.onButtonClick(formButtonClickOutput);
    this.goToAction(formButtonClickOutput.buttonId)
  }

  childContracts() {
    this.item.childContracts.forEach((item: childContracts, idx: number) => {
      this.pages[0].forms[0].addControl(<string>item.dossierID, new LineCardControl({
          columnCount: 12,
          order: 6 + idx,
          controlOptions: {
            title: 'finance.fleet.requests.childDossairID',
            subTitle: item?.dossierID,
            amount: item.amt.toString(),
            currency: 'SAR',
            weight: 'Bold',
            pill: {
              text: this.requestService.getDossierStatus(item.dossierStatus) || '',
              type: item.dossierStatus === 'PEN' ? 'Positive' : (item.dossierStatus === 'RJC' ? 'Negative' : 'Warning')
            }
          },
        })
      )
    })
  }

  goToAction(dossierID: string) {
    sessionStorage.setItem("DOSSIER_ID", dossierID)
    let child = this.item.childContracts.find((x: any) => x.dossierID == dossierID)
    let status = child.dossierStatus;
    if (status == 'DDW' || status == 'IVW') {
      sessionStorage.setItem("IVRNum", "1")
      //Track App data
      this.getTrackApplicationData(child.dossierID)
      this.router.navigate([`${this.DossierStatus.get(status)}`]);
    }
    if (status == 'DBD') {
      //Track App data
      this.getTrackApplicationData(child.dossierID)
      this.reviewForm.form?.addControl('status', new ProcedureStatusControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          type: 'Success',
          title: this.DossierStatus.get(status),
          subTitle: `${this.translate.instant('finance.fleet.requests.yourAppDossierID')} ${dossierID} ${this.translate.instant('finance.fleet.requests.AppNotFinalize')}`
        }
      }))
      this.popupService.showPopup(this.reviewForm).subscribe((res: PopupOutputModel) => {
        if (res.buttonId === "cancel") {
          this.popupService.dismiss()
        }
        if (res.buttonId === "sanad") {
          this.router.navigate(['/finance/request/sanad']);
          this.popupService.dismiss()
        }
      });
    }
    if (status == 'DSS') {
      this.getTrackApplicationData(child.dossierID)
      this.popupService.showPopup(this.attentionForm).subscribe((res: PopupOutputModel) => {
        if (res.buttonId === "cancel") {
          this.popupService.dismiss()
        }
        if (res.buttonId === "UploadDocuments") {
          this.router.navigate(['/finance/fleet/upload-docs']);
          this.popupService.dismiss()
        }
      })
    }
    if (status === 'APS') {
      this.getTrackApplicationData(child.dossierID)
      this.vendorInfo = this.requestService.TrackApplicationData?.vendorInfo;
      this.deliverIssueModelDraw(child);

      this.popupService.showPopup(this.deliveryIssueForm).subscribe((res: PopupOutputModel) => {
        if (res.buttonId === "cancel") {
          this.popupService.dismiss()
        }
        if (res.buttonId === "fleetFinance") {
          this.router.navigate(['/finance']);
          this.popupService.dismiss()
        }
      })
    }
  }


  getTrackApplicationData(dossierID: string) {

    let externalQuotationList: any[] = [];
    let internalQuotationList: any[] = [];
    if (sessionStorage.getItem("DOSSIER_ID")) {
      this.requestService.getTrackingDataInquiry(dossierID).subscribe((res:TrackApplication) => {
        if (res !== null) {
          this.requestService.setTrackApplicationData(res)
          this.requestService.TrackApplicationData?.uploadedQuotationData?.forEach(element => {
            if (element.quotationType === 'Internal') {
              internalQuotationList.push(element)
            } else {
              externalQuotationList.push(element)
            }
          });
          sessionStorage.setItem('TExQuotations', JSON.stringify(externalQuotationList));
          sessionStorage.setItem('TInQuotations', JSON.stringify({quotations: internalQuotationList}))
        }
      })
    }
  }

  deliverIssueModelDraw(child: any) {
    this.deliveryIssueForm.form?.addControl('product', new TextControl({
      columnCount: 12,
      order: 4,
      label: `(${this.translate.instant('finance.fleet.newRequest.DossierID')} ${child.dossierID})`,
      class: "color-arb-primaryText font-h2-bold"
    }));
    this.deliveryIssueForm.form?.addControl('group', new TextControl({
      columnCount: 12,
      order: 4,
      label: `${this.translate.instant('finance.fleet.requests.product')} : ${this.vendorInfo.product}`,
      class: "color-arb-primaryText"
    }));
    this.deliveryIssueForm.form?.addControl('dealership', new TextControl({
      columnCount: 12,
      order: 4,
      label: `${this.translate.instant('finance.fleet.requests.dealershipName')} : ${this.vendorInfo.dealerName}`,
      class: "color-arb-primaryText"
    }));
    this.deliveryIssueForm.form?.addControl('number', new TextControl({
      columnCount: 12,
      order: 4,
      label: `${this.translate.instant('finance.fleet.requests.number')} : ${this.vendorInfo.telephoneNumber}`,
      class: "color-arb-primaryText"
    }));
    this.deliveryIssueForm.form?.addControl('address', new TextControl({
      columnCount: 12,
      order: 4,
      label: `${this.translate.instant('finance.fleet.requests.address')} : ${this.vendorInfo.address}`,
      class: "color-arb-primaryText"
    }));
    this.deliveryIssueForm.form?.addControl('number', new TextControl({
      columnCount: 12,
      order: 4,
      label: `${this.translate.instant('finance.fleet.requests.email')} : ${this.vendorInfo.email}`,
      class: "color-arb-primaryText"
    }));
  }
}
