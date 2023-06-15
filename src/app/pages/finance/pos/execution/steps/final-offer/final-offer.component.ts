import { Component } from "@angular/core";
import { PageModel } from "app/@core/model/dto/formModel";
import { FormButtonClickOutput } from "app/shared/form/form.component";
import { getFinalOfferControl } from "./final-offer.component.controls";
import { PosService } from '../../../../../../@core/service/finance/pos/pos.service';
import { TrackApplication } from "app/@core/model/rest/finance/request/track-application";
import { FinanceBaseComponent } from "app/pages/finance/finance-base/finance-base.component";

@Component({
  templateUrl: '../../../../finance-base/finance-base.component.html',
})

export class FinalOffer extends FinanceBaseComponent {
  override dossierID!: string;
  trackingData!: TrackApplication;
  constructor(private posService: PosService) {
    super()
    this.dossierID = sessionStorage.getItem("DOSSIER_ID") || '{}';
    this.pageTitle.id = "finalOffer";
    this.pageTitle.title = "";
    this.pageTitle.stepper!.steps = ["", "", "", "", "", ""];
    this.drawPage();
  }
  drawPage() {
    this.pages = [new PageModel(1, getFinalOfferControl())];
  }
  override ngOnInit(): void {
    this.getTracking();
  }

  getTracking() {
    if (this.dossierID != null || this.dossierID != undefined) {
      this.posService.getTrackingDataInquiry(this.dossierID).subscribe((res: TrackApplication) => {
        this.trackingData = res;
        this.getControl(0, 0, 'accountNumber').setValue(res?.offer?.acctNum);
        this.getControl(0, 0, 'contractNumber').setValue(this.dossierID);
        this.getControl(0, 0, 'posDossierID').setValue(res.offer.financeID);
        this.getControl(0, 0, 'financeAmount').setValue(res?.offer?.financeAmt);
        this.getControl(0, 0, 'financingTenure').setValue(res?.offer?.tenure);

        this.getControl(0, 0, 'installmentAmount').setValue(res?.offer?.installmentAmt);
        this.getControl(0, 0, 'profitRate').setValue(res?.creditLine?.profitRate + '%');
        this.getControl(0, 0, 'totalProfit').setValue(res?.offer?.profit + '%');
        this.getControl(0, 0, 'adminFee').setValue(res?.offer?.fees + '%');
        this.getControl(0, 0, 'totalPayment').setValue(res?.trackingData?.requiredAmt);

      })
    }
  }
  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'accept':
        void this.router.navigate(['/finance/pos/commodity-details'])
        break;
      case 'back':
        break;
    }
  }
}
