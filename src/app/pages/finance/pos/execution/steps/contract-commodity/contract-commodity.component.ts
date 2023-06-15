import { Component } from "@angular/core";
import { PageModel } from "app/@core/model/dto/formModel";
import { FormButtonClickOutput } from "app/shared/form/form.component";
import { getContractCommodityControl } from "./contract-commodity.component.controls";
import { PosService } from '../../../../../../@core/service/finance/pos/pos.service';
import { FinanceProductCode } from "app/@core/model/rest/finance/request/products-codes";
import { FinanceBaseComponent } from "app/pages/finance/finance-base/finance-base.component";

@Component({
  templateUrl: '../../../../finance-base/finance-base.component.html',
})

export class ContractCommodity extends FinanceBaseComponent {
  override dossierID: string;
  financeAmount: string;
  productKey: string;
  contractURL!: string;
  isDownloaded: boolean = false;
  bankTrxnRef!: string;
  digitalSignatureStatusInterval: any;
  constructor(private posService: PosService) {
    super()
    this.dossierID = sessionStorage.getItem("DOSSIER_ID") || '{}';
    this.financeAmount = sessionStorage.getItem("amt") || '{}';
if (sessionStorage.getItem('productKey')) {
      this.productKey = sessionStorage.getItem('productKey') || '{}';
    } else {
      this.productKey = FinanceProductCode.POS;
    }
    this.pageTitle.id = "contractCommodity";
    this.pageTitle.title = "";
    this.pageTitle.stepper!.stepCounter = 4;
    this.acceptButton = { id: "download", text: "public.download", type: "primary", };
    this.endButtons = [this.acceptButton];
  }
  drawPage() {
    this.pages = [new PageModel(4, getContractCommodityControl(this.contractURL))];
  }
  override ngOnInit(): void {
    this.getPrintableDocument();
  }
  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'download':
        this.btnClickDownload()
        break;
      case 'back':
        void this.router.navigate(['/finance/pos/commodity-purchase'])
        break;
    }
  }

  getPrintableDocument() {
    const output = {
      file: new Blob(),
      fileName: 'Contract Of Commodity Sale',
    }
    let docReq = {
      dosierId: this.dossierID,
      reportName: FinanceProductCode.POS_CONTRACT,
      productCode: this.productKey
    }
    this.posService.getPrintableDocuments(docReq).subscribe((data: Blob) => {
      if (data === null) {
        this.drawPage();
      } else {
        output.file = data
        const fileURL = URL.createObjectURL(output.file);
        this.contractURL = fileURL
        this.drawPage();
      }
    },
      (err: any) => {
        this.drawPage();
      })
  }

  btnClickDownload() {
    this.isDownloaded = true;
    this.initiateDigitalSignature();
  }
  initiateDigitalSignature() {
    if (this.isDownloaded == true) {
      this.posService
        .initiateDigitalSignature(this.productKey, this.dossierID)
        .subscribe((result) => {
          if (result !== null) {
            this.bankTrxnRef = result.bankTrxnRef
            let count = 0
            this.digitalSignatureStatusInterval = setInterval(() => {
              count++
              if (count > 1) {
                this.getDigitalSignatureStatus()
                if (count == 4) {
                  clearInterval(this.digitalSignatureStatusInterval)
                  this.digitalSignatureStatusInterval = null
                }
              }
            }, 10000)
          }
          void this.router.navigate(['/finance/pos/ivr-call-pos'])
        })
    } else {
    }
  }
  getDigitalSignatureStatus(): void {
    this.posService
      .getDigitalSignatureStatus(this.bankTrxnRef)
      .subscribe((result) => {
        if (result !== null) {
          if (result.rqStatusCd == '05' || result.rqStatusCd == '06' || result.rqStatusCd == '07') {
            clearInterval(this.digitalSignatureStatusInterval)
            this.digitalSignatureStatusInterval = null
          } else if (result.rqStatusCd == '02' || result.rqStatusCd == '04') {
            clearInterval(this.digitalSignatureStatusInterval)
            this.digitalSignatureStatusInterval = null
          }
        }
      })
  }
}
