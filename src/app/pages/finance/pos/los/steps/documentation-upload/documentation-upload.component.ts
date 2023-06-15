import { Component } from '@angular/core';
import { PageModel } from 'app/@core/model/dto/formModel';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { getDocumentationUploadControl } from './documentation-upload.component.controls';
import { PosService } from '../../../../../../@core/service/finance/pos/pos.service';
import { FinanceProductCode } from 'app/@core/model/rest/finance/request/products-codes';
import { UploadControl } from 'app/@core/model/dto/control/upload-control';
import { DataService } from '../../../../../../@core/service/finance/data.service';
import { FinanceBaseComponent } from 'app/pages/finance/finance-base/finance-base.component';

@Component({
  templateUrl: '../../../../finance-base/finance-base.component.html',
})
export class DocumentationUpload extends FinanceBaseComponent {
  productKey: string;

  constructor(private posService: PosService, private financeDataService: DataService) {
    super();
    this.pageTitle.id = 'documentationUpload';
    this.pageTitle.title = '';
    this.pageTitle.stepper!.stepCounter = 4;
    if (sessionStorage.getItem('productKey')) {
      this.productKey = sessionStorage.getItem('productKey') || '{}';
    } else {
      this.productKey = FinanceProductCode.POS;
    }
    this.backButton = { id: 'back', text: 'Back', type: 'secondary' };
    this.startButtons = [this.backButton];
    this.proceedButton = { id: 'proceed', text: 'Proceed', type: 'primary' };
    this.endButtons = [this.proceedButton];
    this.drawPage();
  }

  drawPage() {
    this.pages = [new PageModel(4, getDocumentationUploadControl())];
    this.getMandatoyDocument();
  }

  getMandatoyDocument() {
    this.posService.getMandatoryDocs(this.productKey).subscribe((res) => {
      let arrRes: Array<any> = [];
      arrRes = res.documentInfos;
      arrRes.forEach((doc: any, index: number) => {
        this.pages[0].forms[0].addControl(
          doc.documentCode,
          new UploadControl({
            order: 3 + (index + 1),
            columnCount: 6,
            required: true,
            validators: [],
            validationLabels: { required: 'Required Field' },
            value: '',
            label: `${doc.description}`,
          })
        );
      });
      this.checkData();
    });
  }

  override ngOnInit(): void {
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'proceed':
        this.financeDataService.setPosForms(4, this.pages[0].forms[0]);
        void this.router.navigate(['/finance/pos/los-summary']);
        break;
      case 'back':
        void this.router.navigate(['/finance/pos/initial-offer']);
        break;
    }
  }

  checkData() {
    this.financeDataService.getPosForms;
    let formsData = this.financeDataService.getPosForms;

    if (formsData[3]) {
      this.setFormValue(formsData[3]);
    } else {
      return;
    }
  }

  private setFormValue(formsData: any) {
    this.getControl(0, 0, 'SME1').setValue(formsData?.controls['SME1']?.value);

    this.getControl(0, 0, 'VCR').setValue(formsData?.controls['VCR']?.value);

    this.getControl(0, 0, 'TML').setValue(formsData?.controls['TML']?.value);

    this.getControl(0, 0, 'BNAP').setValue(formsData?.controls['BNAP']?.value);

    this.getControl(0, 0, 'SCNS').setValue(formsData?.controls['SCNS']?.value);

    this.getControl(0, 0, 'OTHDOC').setValue(
      formsData?.controls['OTHDOC']?.value
    );

    this.getControl(0, 0, 'LM').setValue(formsData?.controls['LM']?.value);
  }
}
