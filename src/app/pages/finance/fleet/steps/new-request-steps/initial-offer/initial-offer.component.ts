import {Component, OnInit} from '@angular/core';
import {initialOfferControl} from "./initial-offer.component.control";
import {PageModel} from 'app/@core/model/dto/formModel';
import {FormButtonClickOutput} from '../../../../../../shared/form/form.component';
import {SummaryItemControl} from "../../../../../../@core/model/dto/control/sumery-item-control";
import { AmtDetails } from '../../../../../../@core/model/rest/finance/request/los-summary';
import { RequestService } from '../../../../../../@core/service/finance/request/request.service';
import { FinanceBaseComponent } from '../../../../finance-base/finance-base.component';


@Component({
  selector: 'app-initial-offer',
  templateUrl: '../../../../finance-base/finance-base.component.html',
  styleUrls: []
})
export class InitialOfferComponent extends FinanceBaseComponent implements OnInit {

  public dossairID: any;
  public totalReqFinanceAmt = 0
  public totalMonthlyPmt = 0
  public totalREPmtAmt = 0
  public totalDownPmt = 0
  public totalAdminFee = 0
  public totalTenures = 0
  public customerOfferDetails!: any;
  public map = new Map<Number, Number>([]);
  public amtDetails!: AmtDetails;

  constructor(private requestService: RequestService
    ) {
    super();
    this.pageTitle.stepper!.stepCounter = 5;
    this.dossairID = sessionStorage.getItem("DOSSIER_ID");
  }

  override ngOnInit() {
    this.getInitOffer()
    this.drawPage()

  }

  drawPage() {
    this.pages = [new PageModel(1, initialOfferControl(this.amtDetails))]

  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'Next':
        this.nextClick()
        break;
      case 'breakdown':
        this.router.navigate(['/finance/request/breakdown'], {state: {customerOfferDetails: this.customerOfferDetails}}).then();
        break;
      case 'Back':
        this.goBack();
        break;
    }
  }

  nextClick() {
    this.router.navigate(['/finance/fleet/summary']);

  }

  goBack() {
    this.router.navigate(['/finance/fleet/upload-docs']);

  }

  getInitOffer() {
    let data = {
      dossierId: this.dossairID
    }
    this.requestService.getInitialOffer(data).subscribe((res:any) => {
        this.customerOfferDetails = res?.customerOfferDetails
        sessionStorage.setItem('quotationDetails', JSON.stringify(res));
        this.customerOfferDetails?.custOfferVehicleGroupLstItemTypes?.map((item:any) => {

          if (this.map.size === 0) {
            this.map.set(
              Number(item?.tenure), Number(item?.firstInstallmentAmt)
            )
          }

          if (item && this.map.size > 0) {

            let duplicateTenure = this.map.has(item?.tenure)
            if (duplicateTenure) {
              let duplicatedVal = this.map.get(item?.tenure)
              this.map.set(item?.tenure, Number(duplicatedVal) + Number(item?.firstInstallmentAmt))
            } else {
              this.map.set(
                Number(item?.tenure),
                Number(item.firstInstallmentAmt)
              );
            }
          }

          this.totalReqFinanceAmt = this.customerOfferDetails.totalFinanceAmt
          this.totalDownPmt = this.customerOfferDetails.totalDownPayment
          this.totalMonthlyPmt = this.customerOfferDetails.installmentsList[0].monthlyInstallmentAmt // first value from installment amount list
          this.totalAdminFee = this.customerOfferDetails.totaldminFeeAmt
          this.totalTenures += item.tenure

          this.customerOfferDetails.installmentsList?.map((lst:any) => {
            this.totalREPmtAmt += lst.monthlyInstallmentAmt
          })
        })

        this.amtDetails = {
          requestedAmt: this.totalReqFinanceAmt,
          tenure: this.totalTenures,
          installmentAmt: this.totalMonthlyPmt,
          DownPmt: this.totalDownPmt,
          totalAdminFee: this.totalAdminFee,
          totalREPmtAmt: this.totalREPmtAmt

        }
        sessionStorage.setItem('amtDetails', JSON.stringify(this.amtDetails));
    })
    this.map.forEach(item =>{
      this.pages[0].forms[0].addControl("installmentList", new SummaryItemControl({
        order: 11,
        columnCount: 4,
        label: `${this.getMapKeys} ${this.translate.instant('finance.fleet.newRequest.Months')}`,
        value: this.getMapVals.toString(),
        controlOptions: {
          currency: 'finance.SAR',

        }
      }))
    })
  }
  get getMapKeys(){
    return Array.from(this.map.keys());
  }
  get getMapVals(){
    return Array.from(this.map.values());
  }


}

