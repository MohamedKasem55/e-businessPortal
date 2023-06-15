import {Component} from '@angular/core';
import {PageModel} from 'app/@core/model/dto/formModel';
import {FormButtonClickOutput} from 'app/shared/form/form.component';
import {getFinancialDetailsControl} from './financial-details.component.controls';
import { DataService } from '../../../../../../@core/service/finance/data.service';
import { FinanceBaseComponent } from 'app/pages/finance/finance-base/finance-base.component';

@Component({
  templateUrl: '../../../../finance-base/finance-base.component.html',
})
export class FinancialDetails extends FinanceBaseComponent {
  constructor(private financeDataService:DataService) {
    super();
    this.pageTitle.id = 'financialDetails';
    this.pageTitle.title = '';
    this.pageTitle.stepper!.stepCounter = 2;
    this.drawPage();
    this.checkData();
  }

  drawPage() {
    this.pages = [new PageModel(2, getFinancialDetailsControl())];
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'proceed':
        this.financeDataService.setPosForms(2, this.pages[0].forms[0]);
        void this.router.navigate(['/finance/pos/initial-offer']);
        break;
      case 'back':
        void this.router.navigate(['/finance/pos']);
        break;
    }
  }

  setDefaultValue() {
    this.getControl(0, 0, 'currentSalesTurnover').setValue(0);
    this.getControl(0, 0, 'currentNetProfit').setValue(0);
    this.getControl(0, 0, 'lastNetProfit').setValue(0);
    this.getControl(0, 0, 'lastSalesTurnover').setValue(0);
  }

  checkData() {
    this.financeDataService.getPosForms;
    let formsData = this.financeDataService.getPosForms;
    if (formsData[1]) {
      this.setFormValue(formsData[1]);
    } else {
      this.setDefaultValue();
      return;
    }
  }

  private setFormValue(formsData: any) {
    this.getControl(0, 0, 'currentYearFrom').setValue(
      formsData?.controls['currentYearFrom']?.value
    );
    this.getControl(0, 0, 'currentYearTo').setValue(
      formsData?.controls['currentYearTo']?.value
    );
    this.getControl(0, 0, 'currentSalesTurnover').setValue(
      formsData?.controls['currentSalesTurnover']?.value
    );
    this.getControl(0, 0, 'currentNetProfit').setValue(
      formsData?.controls['currentNetProfit']?.value
    );
    this.getControl(0, 0, 'currentGrossProfit').setValue(
      formsData?.controls['currentGrossProfit']?.value
    );
    this.getControl(0, 0, 'lastYearFrom').setValue(
      formsData?.controls['lastYearFrom']?.value
    );
    this.getControl(0, 0, 'lastYearTo').setValue(
      formsData?.controls['lastYearTo']?.value
    );
    this.getControl(0, 0, 'lastSalesTurnover').setValue(
      formsData?.controls['lastSalesTurnover']?.value
    );
    this.getControl(0, 0, 'lastNetProfit').setValue(
      formsData?.controls['lastNetProfit']?.value
    );

    this.getControl(0, 0, 'lastGrossProfit').setValue(
      formsData?.controls['lastGrossProfit']?.value
    );
  }
}
