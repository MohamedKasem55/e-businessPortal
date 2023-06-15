import { Component } from "@angular/core";
import { PageModel } from "app/@core/model/dto/formModel";
import { FormButtonClickOutput } from "app/shared/form/form.component";
import { getCommodityDetailsControl } from "./commodity-details.component.controls";
import { PosService } from '../../../../../../@core/service/finance/pos/pos.service';
import { CommodityDetailsModel } from "app/@core/model/rest/finance/pos/contract";
import { FinanceBaseComponent } from "app/pages/finance/finance-base/finance-base.component";

@Component({
  templateUrl: '../../../../finance-base/finance-base.component.html',
})

export class CommodityDetails extends FinanceBaseComponent {
  override dossierID: string;
  financeAmount: string;
  commodityDetails: CommodityDetailsModel[] = [];
  amount!: string;
  constructor(private posService: PosService) {
    super()
    this.dossierID = sessionStorage.getItem("DOSSIER_ID") || '{}';
    this.financeAmount = sessionStorage.getItem("amt") || '{}';
    this.pageTitle.id = "commodityDetails";
    this.pageTitle.title = "";
    this.pageTitle.stepper!.stepCounter = 2;
    this.acceptButton = { id: "proceed", text: "public.proceed", type: "primary", };
    this.endButtons = [this.acceptButton];
    this.drawPage();
  }
  drawPage() {
    this.pages = [new PageModel(2, getCommodityDetailsControl(this.amount))];
  }
  override ngOnInit(): void {
    this.getCommodityDetails(); // in case setStatus (DDW, DBD, DCS, DSS)
  }
  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'proceed':
        void this.router.navigate(['/finance/pos/commodity-purchase'])
        break;
      case 'back':
        void this.router.navigate(['/finance/pos/final-offer'])
        break;
    }
  }

  getCommodityDetails() {
    if (this.dossierID != null || this.dossierID != undefined) {
      this.posService.getCommodityDetails(this.dossierID).subscribe((res) => {
        this.commodityDetails = res;
        this.getControl(0, 0, 'commodityWeight').setValue(res?.commoditiesQuantity + ' ' + 'KG');
        this.getControl(0, 0, 'commodityValue').setValue(res?.commodityUnits);
        this.getControl(0, 0, 'dateOfPurchase').setValue(res?.settlementDate);
      })
    }
  }
}
