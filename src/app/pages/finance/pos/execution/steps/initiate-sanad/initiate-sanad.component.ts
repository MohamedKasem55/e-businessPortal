import { Component } from "@angular/core";
import { PageModel } from "app/@core/model/dto/formModel";
import { FormButtonClickOutput } from "app/shared/form/form.component";
import { getInitiateSanadControl } from "./initiate-sanad.component.controls";
import { PosService } from '../../../../../../@core/service/finance/pos/pos.service';
import { FinanceProductCode } from "app/@core/model/rest/finance/request/products-codes";
import { FinanceBaseComponent } from "app/pages/finance/finance-base/finance-base.component";
import { Sanad, SanadLst } from "app/@core/model/rest/finance/pos/customerDetails";

@Component({
  templateUrl: '../../../../finance-base/finance-base.component.html',
})

export class InitiateSanad extends FinanceBaseComponent {
  financeAmount: string;
  override dossierID: string;
  productKey: string;
  SanadLst!: SanadLst;
  constructor(private posService: PosService) {
    super()
    this.dossierID = sessionStorage.getItem("DOSSIER_ID") || '{}';
    this.financeAmount = sessionStorage.getItem("amt") || '{}';
if (sessionStorage.getItem('productKey')) {
      this.productKey = sessionStorage.getItem('productKey') || '{}';
    } else {
      this.productKey = FinanceProductCode.POS;
    }
    this.pageTitle.id = "finalOffer";
    this.pageTitle.title = "";
    this.pageTitle.stepper!.stepCounter = 5;
    this.endButtons = []
    this.drawPage();
  }
  drawPage() {
    this.pages = [new PageModel(5, getInitiateSanadControl())];
  }
  override ngOnInit(): void {
    this.createSanadGroup();
    this.setSanadPNCreation();
  }
  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'back':
        void this.router.navigate(['/finance/pos/contract-commodity'])
        break;
    }
  }

  setSanadPNCreation(): void {
    this.posService
      .setSanadPNCreation(this.dossierID, this.productKey)
      .subscribe((result) => {
      })
  }

  createSanadGroup(): void {
    this.posService.createSanadGroup(this.dossierID).subscribe((result: SanadLst) => {
      this.SanadLst = result;
    })
  }
}
