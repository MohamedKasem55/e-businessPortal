import { Component, OnInit } from '@angular/core';
import { PageModel } from 'app/@core/model/dto/formModel';
import { LinkedAccount } from './linked-account.comonent.controls';
import { FormButtonClickOutput } from '../../../../../../shared/form/form.component';
import { FinanceProductCode } from '../../../../../../@core/model/rest/finance/request/products-codes';
import { KeyValueModel } from '../../../../../../@core/model/rest/common/key-value.model';
import { dossierType } from '../../../../../../@core/model/rest/finance/request/dossier_type';
import { RequestService } from '../../../../../../@core/service/finance/request/request.service';
import { CustomerDataRes } from '../../../../../../@core/model/rest/finance/request/customer-data';
import { OpenDossierRes } from '../../../../../../@core/model/rest/finance/request/business-details';
import { FinanceBaseComponent } from '../../../../finance-base/finance-base.component';
import { Utils } from '../../../../../../@core/utility/Utils';
import {
  CustomerBusinessDetails,
  OpenDOSSIERREQ,
} from '../../../../../../@core/model/rest/finance/request/business-details';

@Component({
  selector: 'app-linked-account',
  templateUrl: '../../../../finance-base/finance-base.component.html',
  styleUrls: [],
})
export class LinkedAccountComponent
  extends FinanceBaseComponent
  implements OnInit
{
  businessDetails!: CustomerBusinessDetails;

  constructor(private requestService: RequestService) {
    super();
    this.pageTitle.stepper!.stepCounter = 2;
    this.drawPage([]);
  }

  override ngOnInit(): void {
    this.getCutomerData();
    this.businessDetails = JSON.parse(
      sessionStorage.getItem('businessDetails') || ''
    );
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    if (formButtonClickOutput.buttonId === 'Next') {
      this.nextStep();
    }
    if (formButtonClickOutput.buttonId === 'Back') {
      this.backStep();
    }
  }

  getCutomerData() {
    this.requestService
      .getCustomerData(FinanceProductCode.FLEET)
      .subscribe((res: CustomerDataRes) => {
        this.drawPage(
          Utils.getModelList(res.companyDetails.accountNumberList)
        );
        if (this.dossierID) {
          this.pages[0].forms[0].controls['linkAccount'].disable();
          this.pages[0].forms[0].controls['linkAccount'].setValue({
            key: 0,
            value: sessionStorage.getItem('accountNum'),
          });
        }
      });
  }



  nextStep() {
    let openDossierObj: OpenDOSSIERREQ = {
      accountNumber:
        this.pages[0].forms[0].controls['linkAccount'].value.displayText,
      dossierType: dossierType.CRL,
      financeProductCode: FinanceProductCode.FLEET,
      posBusinessDataDetailsl: this.businessDetails,
      establishmentDate: this.businessDetails.establishmentDate as string,
    };
    this.requestService
      .openDossier(openDossierObj)
      .subscribe((res: OpenDossierRes) => {
        sessionStorage.setItem(
          'accountNum',
          this.pages[0].forms[0].controls['linkAccount'].value.displayText
        );
        sessionStorage.setItem('DOSSIER_ID', res.disbursmentDossierId);
      });
    this.router.navigate(['/finance/fleet/vehicle-details']);
  }

  backStep() {
    this.router.navigate(['/finance/fleet/business-details']);
  }

  drawPage(
    accountList: KeyValueModel[] | [],
    accountValue?: KeyValueModel,
    disableField?: boolean
  ) {
    this.pages = [
      new PageModel(2, LinkedAccount(accountList, accountValue, disableField)),
    ];
  }
}
