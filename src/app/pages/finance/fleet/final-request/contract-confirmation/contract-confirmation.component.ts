import {Component} from '@angular/core';
import {PageModel} from "../../../../../@core/model/dto/formModel";
import {contractConfirmation} from "./contract-confirmation.component.controller";
import {FinanceProductCode} from "../../../../../@core/model/rest/finance/request/products-codes";
import {FormButtonClickOutput} from "../../../../../shared/form/form.component";
import { RequestService } from '../../../../../@core/service/finance/request/request.service';
import { FinanceBaseComponent } from '../../../finance-base/finance-base.component';
import { PrintableDocReq } from '../../../../../@core/model/rest/finance/request/printable-doc';

@Component({
  selector: 'app-contract-confirmation',
  templateUrl: '../../../finance-base/finance-base.component.html',
  styleUrls: []
})
export class ContractConfirmationComponent extends FinanceBaseComponent {
  private contractURL!: any;

  constructor(
    private requestService: RequestService
  ) {
    super();
    this.dossierID = sessionStorage.getItem("DOSSIER_ID")
    this.getPrintableDocument();
  }

  drawPage() {
    this.pages = [new PageModel(1, contractConfirmation(this.contractURL))]
  }

  override ngOnInit(): void {
    this.drawPage()
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'Next':
        this.nextClick()
        break;
      case 'Back':
        this.goBack();
        break;
    }
  }

  nextClick() {

  }

  goBack() {
    this.location.back();
  }

  getPrintableDocument() {
    const output = {
      file: new Blob(),
      fileName: 'FleetContract',
    }
    let docReq:PrintableDocReq = {
      dosierId: this.dossierID || "",
      reportName: FinanceProductCode.FLEET_CONTRACT,
      productCode: FinanceProductCode.FLEET
    }
    this.requestService.getPrintableDoc(docReq).subscribe((data: Blob) => {
      if (data === null) {
        this.router.navigate(['/']).then(() => {
        });
      } else {
        try{
          output.file = data
          const fileURL = URL.createObjectURL(output.file);
          this.contractURL = fileURL
          window.open(fileURL, '_blank');
        }catch (e) {
          this.router.navigate(['/']).then(() => {
          });
        }
      }
    })
  }
}
