import { Component } from "@angular/core";
import { PageModel } from "app/@core/model/dto/formModel";
import { FormButtonClickOutput } from "app/shared/form/form.component";
import { getCommodityPurchaseControl } from "./commodity-purchase.component.controls";
import { PosService } from '../../../../../../@core/service/finance/pos/pos.service';
import { FinanceProductCode } from "app/@core/model/rest/finance/request/products-codes";
import { FinanceBaseComponent } from "app/pages/finance/finance-base/finance-base.component";
import { RequireDocument } from "app/@core/model/rest/finance/pos/documents";

@Component({
  templateUrl: '../../../../finance-base/finance-base.component.html',
})

export class CommodityPurchase extends FinanceBaseComponent {
  financeAmount: string;
  override dossierID: string;
  productKey: string;
  contractURL!: string;
  constructor(private posService: PosService) {
    super()
    this.dossierID = sessionStorage.getItem("DOSSIER_ID") || '{}';
    this.financeAmount = sessionStorage.getItem("amt") || '{}';
if (sessionStorage.getItem('productKey')) {
      this.productKey = sessionStorage.getItem('productKey') || '{}';
    } else {
      this.productKey = FinanceProductCode.POS;
    }
    this.pageTitle.id = "commodityPurchase";
    this.pageTitle.title = "";
    this.pageTitle.stepper!.stepCounter = 3;
    this.acceptButton = { id: "proceed", text: "public.proceed", type: "primary", };
    this.endButtons = [this.acceptButton];
    this.buyCommodity();
    this.getPrintableDocument();

  }
  drawPage() {
    this.pages = [new PageModel(3, getCommodityPurchaseControl(this.dossierID, this.financeAmount, this.contractURL))];
  }
  override ngOnInit(): void {
    this.drawPage();
  }
  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'proceed':
        void this.router.navigate(['/finance/pos/contract-commodity'])
        break;
      case 'back':
        void this.router.navigate(['/finance/pos/commodity-details'])
        break;
    }
  }

  getPrintableDocument() {
    const output = {
      file: new Blob(),
      fileName: 'Contract Of Commodity Sale',
    }
    let docReq: RequireDocument = {
      dosierId: this.dossierID,
      reportName: FinanceProductCode.POS_CONTRACT,
      productCode: this.productKey
    }
    this.posService.getPrintableDocuments(docReq).subscribe((data: Blob) => {
      if (data === null) {
      } else {
        output.file = data;
        const fileURL = URL.createObjectURL(output.file);
        this.contractURL = fileURL;
      }
    })
  }

  buyCommodity(): void {
    this.posService
      .buyCommodity(this.dossierID, this.productKey)
      .subscribe((res) => {
        if (res !== null) {
          if (res.commodityItems.length > 0) {
            res.commodityItems[0].amount = this.financeAmount;
            this.getControl(0, 0, 'commodityWeight').setValue(res.commodityItems[0].commoditiesQuantity + ' ' + 'KG');
            this.getControl(0, 0, 'commodityValue').setValue(res.commodityItems[0].commodityAmt);
            this.getControl(0, 0, 'dateOfPurchase').setValue(res.commodityItems[0].settlementDate);
          }
        }
      })
  }

}
