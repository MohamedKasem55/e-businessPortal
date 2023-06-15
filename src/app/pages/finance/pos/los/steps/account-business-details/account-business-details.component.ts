import { Component, OnInit } from '@angular/core';
import { PageModel } from 'app/@core/model/dto/formModel';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { getAccountBusinessDetailsControl } from './account-business-details.component.controls';
import { PosService } from '../../../../../../@core/service/finance/pos/pos.service';
import { FinanceProductCode } from 'app/@core/model/rest/finance/request/products-codes';
import { KeyValueModel } from 'app/@core/model/rest/common/key-value.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompanyDetails } from 'app/@core/model/rest/finance/pos/customerDetails';
import { ModelLocation } from 'app/@core/model/rest/finance/pos/modelLocations';
import { Branch } from '../../../../../../@core/model/rest/finance/request/branch';
import { DataService } from '../../../../../../@core/service/finance/data.service';
import { ModelAndListService } from '../../../../../../@core/service/base/modelAndList.service';
import { FinanceBaseComponent } from 'app/pages/finance/finance-base/finance-base.component';
import { Utils } from '../../../../../../@core/utility/Utils';

@Component({
  templateUrl: '../../../../finance-base/finance-base.component.html',
})
export class AccountBusinessDetails extends FinanceBaseComponent implements OnInit {
  newData: CompanyDetails[] = [];
  newDataBruncheches!: KeyValueModel[];
  newDatalocations!: KeyValueModel[];
  productKey: string;

  constructor(
    private posService: PosService,
    private financeDataService: DataService,
    private ModelAndListService: ModelAndListService) {
    super();
    this.pageTitle.id = 'accountBusinessDetails';
    this.pageTitle.title = '';
    this.pageTitle.stepper!.steps = ['', '', '', '', '', ''];
    if (sessionStorage.getItem('productKey')) {
      this.productKey = sessionStorage.getItem('productKey') || '{}';
    } else {
      this.productKey = FinanceProductCode.POS;
    }
    this.drawPage([]);
  }

  override ngOnInit(): void {
    this.getFinancialDetailsData();
    this.getTypeOfBrunches();
    this.getTypeOfLocation();
    this.checkData();
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'proceed': {
        this.financeDataService.setPosForms(1, this.pages[0].forms[0]);
        void this.router.navigate(['/finance/pos/financial-details']);
        break;
      }
      case 'back':
        break;
    }
  }

  getFinancialDetailsData() {
    this.posService.getCustomerData(this.productKey).subscribe((res) => {
      this.convertAccountListToKeyValue(res.companyDetails?.accountNumberList);
    });
  }

  convertAccountListToKeyValue(accountList: string[]): KeyValueModel[] {
    let newAccountList: KeyValueModel[] = [];
    accountList.forEach((account: string, index: number) => {
      newAccountList.push({ key: `${index}`, value: `${account}` });
    });
    return (this.pages[0].forms[0].controls[
      'selectAccount'
    ].controlOptions.options = newAccountList);
  }

  getTypeOfBrunches() {
    this.ModelAndListService
      .getList(['financeBusinessOutletsType'])
      .subscribe((res) => {
        this.newDataBruncheches = Utils.getModelList(res.financeBusinessOutletsType);
        this.pages[0].forms[0].controls['typeBranches'].controlOptions.options =
          this.newDataBruncheches;
      });
  }

  getTypeOfLocation() {
    this.ModelAndListService.getModel('saudiCities').subscribe((res) => {
      this.newDatalocations = Utils.getModelList(res.saudiCities);
      this.pages[0].forms[0].controls[
        'primaryBusinessLocation'
      ].controlOptions.options = this.newDatalocations;
    });
  }

  openTermsAndConditions() {
    this.pages[0].forms[0].controls['termsConditions'].valueChanges.subscribe(
      (res: any) => {
        this.posService
          .getPDFFile(
            'pos_finance_terns_and_conditions.pdf'
          );
      }
    );
  }

  setDefaultValue() {
    this.getControl(0, 0, 'numberBusinessBranches').setValue('');
  }

  drawPage(accountList: KeyValueModel[] | [], accountValue?: KeyValueModel) {
    this.pages = [
      new PageModel(
        1,
        getAccountBusinessDetailsControl(
          accountList,
          accountValue,
          this.newDataBruncheches,
          this.newDatalocations
        )
      ),
    ];
  }

  checkData() {
    this.financeDataService.getPosForms;
    let formsData = this.financeDataService.getPosForms;
    if (formsData.length > 0) {
      this.setFormValue(formsData[0]);
    } else {
      this.setDefaultValue();
      return;
    }
  }

  private setFormValue(formsData: any) {
    this.getControl(0, 0, 'selectAccount').setValue(
      formsData?.controls['selectAccount']?.value
    );
    this.getControl(0, 0, 'numberBusinessBranches').setValue(
      formsData?.controls['numberBusinessBranches']?.value
    );
    this.getControl(0, 0, 'typeBranches').setValue({
      code: formsData?.controls['typeBranches']?.value['code'],
      branch: formsData?.controls['typeBranches']?.value['branch'],
    });
    this.getControl(0, 0, 'primaryBusinessLocation').setValue({
      code: formsData?.controls['primaryBusinessLocation']?.value['code'],
      branch: formsData?.controls['primaryBusinessLocation']?.value['branch'],
    });
    this.getControl(0, 0, 'businessModelSalesPattern').setValue(
      formsData?.controls['businessModelSalesPattern']?.value
    );
    this.getControl(0, 0, 'target').setValue({
      id: formsData?.controls['target']?.value['id'],
      optionsData: formsData?.controls['target']?.value['optionsData'],
    });
    this.getControl(0, 0, 'termsConditions').setValue(
      formsData?.controls['termsConditions']?.value
    );
  }
}
