import { Component } from '@angular/core';
import { PageModel } from 'app/@core/model/dto/formModel';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { getInitialOfferControl } from './initial-offer.component.controls';
import { PosService } from '../../../../../../@core/service/finance/pos/pos.service';
import { FinanceProductCode } from 'app/@core/model/rest/finance/request/products-codes';
import { DatePipe } from '@angular/common';
import { DataService } from '../../../../../../@core/service/finance/data.service';
import { ModelAndListService } from '../../../../../../@core/service/base/modelAndList.service';
import { FinanceBaseComponent } from 'app/pages/finance/finance-base/finance-base.component';
import { Utils } from 'app/@core/utility/Utils';

@Component({
  templateUrl: '../../../../finance-base/finance-base.component.html',
})
export class InitialOffer extends FinanceBaseComponent {
  generateChallengeAndOTP: any;
  productKey: string;
  repaymentPeriod!: string;
  public requestValidate: any;
  repaymentPeriodTime: any;
  pipe = new DatePipe('en-US');

  constructor(
    private posService: PosService, private datePipe: DatePipe,
     private financeDataService: DataService, private ModelAndListService: ModelAndListService) {
    super();
    this.pageTitle.id = 'initialOffer';
    this.pageTitle.title = '';
    this.pageTitle.stepper!.stepCounter = 3;

    this.backButton = { id: 'back', text: 'Back', type: 'secondary' };
    this.startButtons = [this.backButton];

    this.proceedButton = {
      id: 'acceptProceed',
      text: 'Accept and Proceed',
      type: 'primary',
    };
    if (sessionStorage.getItem('productKey')) {
      this.productKey = sessionStorage.getItem('productKey') || '{}';
      if (this.productKey === FinanceProductCode.ECOMMERCE) {
        this.repaymentPeriod = 'financeECOMRePaymentPeriod';
      } else if (this.productKey === FinanceProductCode.FLEET) {
        this.repaymentPeriod = 'financeFleetRePaymentPeriod';
      } else {
        this.repaymentPeriod = 'financeRePaymentPeriod';
      }
    } else {
      this.productKey = FinanceProductCode.POS;
      if (this.productKey === FinanceProductCode.ECOMMERCE) {
        this.repaymentPeriod = 'financeECOMRePaymentPeriod';
      } else if (this.productKey === FinanceProductCode.FLEET) {
        this.repaymentPeriod = 'financeFleetRePaymentPeriod';
      } else {
        this.repaymentPeriod = 'financeRePaymentPeriod';
      }
    }

    this.endButtons = [this.proceedButton];
    this.drawPage();
    this.checkData();
  }

  drawPage() {
    this.pages = [
      new PageModel(3, getInitialOfferControl(this.repaymentPeriodTime)),
    ];
  }

  override ngOnInit(): void {
    this.getModel();
    this.reCalculate();
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'acceptProceed':
        this.financeDataService.setPosForms(3, this.pages[0].forms[0]);
        void this.router.navigate(['/finance/pos/doc-upload']);
        break;
      case 'back':
        void this.router.navigate(['/finance/pos/financial-details']);
        break;
    }
  }

  checkData() {
    this.financeDataService.getPosForms;
    let formsData = this.financeDataService.getPosForms;

    if (formsData[2]) {
      this.setFormValue(formsData[2]);
    }
  }

  getModel() {
    this.ModelAndListService.getModel(this.repaymentPeriod).subscribe((data) => {
      this.repaymentPeriodTime = Utils.getModelList(data);

      this.pages[0].forms[0].controls[
        'repaymentPeriod'
      ].controlOptions.options = this.repaymentPeriodTime;
    });
  }

  reCalculate() {
    this.getControl(0, 0, 'repaymentPeriod').valueChanges.subscribe((res) => {
      let ryPaymentAmt = this.getControl(0, 0, 'requestedAmount').value;
      let ryPayment = res.value.code;
      this.posService
        .reCalculate(ryPayment, ryPaymentAmt, this.productKey)
        .subscribe((amount) => {
          this.getControl(0, 0, 'profiltRate').setValue(
            `${amount?.financeEligibleProductKey?.profitRate}`
          );
          this.getControl(0, 0, 'adminFee').setValue(
            `${amount?.financeEligibleProductKey?.feesPercentage}`
          );
          this.getControl(0, 0, 'installmentAmount').setValue(
            amount?.financeEligibleProductKey?.installmentAmt
          );
          this.getControl(0, 0, 'initiationDate').setValue(
            this.pipe.transform(
              amount?.financeEligibleProductKey?.startDateInfo?.timestamp,
              'yyyy-MM-dd'
            )
          );
        });
    });
  }

  private setFormValue(formsData: any) {
    this.getControl(0, 0, 'acceptPosTerminals').setValue(
      formsData?.controls['acceptPosTerminals']?.value
    );
    this.getControl(0, 0, 'repaymentPeriod').setValue(
      formsData?.controls['repaymentPeriod']?.value
    );
    this.getControl(0, 0, 'requestedAmount').setValue(
      formsData?.controls['requestedAmount']?.value
    );
    this.getControl(0, 0, 'profiltRate').setValue(
      formsData?.controls['profiltRate']?.value
    );
    this.getControl(0, 0, 'adminFee').setValue(
      formsData?.controls['adminFee']?.value
    );
    this.getControl(0, 0, 'installmentAmount').setValue(
      formsData?.controls['installmentAmount']?.value
    );
    this.getControl(0, 0, 'initiationDate').setValue(
      this.pipe.transform(
        formsData?.controls['initiationDate']?.value,
        'yyyy-MM-dd'
      )
    );
  }
}
