import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageModel } from '../../../../../@core/model/dto/formModel';

import { internalQuotForm } from './product-select.component.controller';
import { ValidationsEnum } from '../../../../../@core/model/dto/validations-enum';
import {
  VehicleResponse,
  VehicleItem,
  Quotation,
  StaticPurposeValues,
} from '../../../../../@core/model/rest/finance/request/quotation';
import { ValueChangeResult } from '../../../../../@core/model/dto/control/control.model';
import { FormButtonClickOutput } from '../../../../../shared/form/form.component';
import { RequestService } from '../../../../../@core/service/finance/request/request.service';
import { DataService } from '../../../../../@core/service/finance/data.service';
import { FinanceBaseComponent } from '../../../finance-base/finance-base.component';
import { DefaultValuesResponse, DefaultValuesRequest } from '../../../../../@core/model/rest/finance/request/quotation';

@Component({
  selector: 'app-internal-quotation-summary',
  templateUrl: '../../../finance-base/finance-base.component.html',
  styleUrls: [],
})
export class ProductSelectComponent extends FinanceBaseComponent {
  variantListWithDuplicates: VehicleItem[] = [];
  editItemIndex!: number;
  editQuotationItem!: Quotation;
  constructor(
    public activatedRoute: ActivatedRoute,
    private requestService: RequestService,
    private financeDataService: DataService
  ) {
    super();
    this.drawPage();
    this.pageTitle.title = 'finance.fleet.newRequest.generalRequest';
    this.endButtons = [this.addInternalQuotationBtn];
  }

  override ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      Object.keys(params).length > 0
        ? (this.editItemIndex = parseInt(params['index']))
        : '';
    });
    if (this.editItemIndex != undefined) {
      this.setQuotationData();
      this.APICalls(0);
    } else {
      this.APICalls(0);
    }
  }
  setQuotationData() {
    let quotationList = JSON.parse(
      sessionStorage.getItem('InQuotations') || ''
    );
    this.editQuotationItem = quotationList[this.editItemIndex];
    this.pages[0].forms[0].controls['vehiclesNum'].setValue(
      this.editQuotationItem.purposes[0].vehiclesNum
    );
    this.pages[0].forms[0].controls['vehiclePrice'].setValue(
      this.editQuotationItem.purposes[0].vehiclePrice
    );
    this.pages[0].forms[0].controls['purposeValue'].setValue(
      this.editQuotationItem.purposes[0].purposeValue
    );
    this.pages[0].forms[0].controls['purposeOfUse'].setValue({
      purposeOfUse: this.editQuotationItem.purposes[0].purposeOfUse,
    });
    this.pages[0].forms[0].controls['vehicleColor'].setValue({
      vehicleColor: this.editQuotationItem.purposes[0].vehicleColor,
    });
  }
  drawPage() {
    this.pages = [
      new PageModel(
        1,
        internalQuotForm(
          this.financeDataService.purposeOfUse,
          this.financeDataService.colors
        )
      ),
    ];
    this.detectControlsValueChanges(0, 0);
  }

  getBrands(formIndex: number) {
    this.requestService.getBrands().subscribe((res: VehicleResponse) => {
      this.pages[0].forms[formIndex].controls[
        'brandName'
      ].controlOptions.options = res.vehiclesLstItem;
      if (this.editQuotationItem != undefined) {
        this.pages[0].forms[formIndex].controls['brandName'].setValue({
          brandName: this.editQuotationItem.purposes[0].brandName,
        });
        this.getModel(this.editQuotationItem.purposes[0].brandName, formIndex);
      }
    });
  }

  getModel(brandName: string, formIndex: number) {
    this.requestService
      .getModelsByBrandName(brandName)
      .subscribe((res: VehicleResponse) => {
        this.pages[0].forms[formIndex].controls[
          'modelName'
        ].controlOptions.options = res.vehiclesLstItem;
        if (this.editQuotationItem != undefined) {
          this.pages[0].forms[formIndex].controls['modelName'].setValue({
            modelName: this.editQuotationItem.purposes[0].modelName,
          });
          this.getVariant(
            this.editQuotationItem.purposes[0].brandName,
            this.editQuotationItem.purposes[0].modelName,
            formIndex
          );
        }
      });
  }

  getVariant(brandName: string, modelName: string, formIndex: number) {
    this.requestService
      .getVariantByBrandAndModel(brandName, modelName)
      .subscribe((res: VehicleResponse) => {
        this.variantListWithDuplicates = res.vehiclesLstItem;
        this.pages[0].forms[formIndex].controls[
          'vehicleVariant'
        ].controlOptions.options = res.vehiclesLstItem;
        if (this.editQuotationItem != undefined) {
          this.pages[0].forms[formIndex].controls['vehicleVariant'].setValue({
            vehicleVariant: this.editQuotationItem.purposes[0].vehicleVariant,
          });
          this.getTenureAndDownPmt(formIndex);
          this.getvariantYearsandDefaultValues(
            {
              price: this.editQuotationItem.purposes[0].price,
              vehicleVariant: this.editQuotationItem.purposes[0].vehicleVariant,
            },
            formIndex
          );
        }
      });
  }

  getDealers(formIndex: number) {
    this.requestService.getDealers().subscribe((res: VehicleResponse) => {
      this.pages[0].forms[formIndex].controls[
        'dealerName'
      ].controlOptions.options = res.vehiclesLstItem;
      if (this.editQuotationItem != undefined) {
        this.pages[0].forms[formIndex].controls['dealerName'].setValue({
          dealerName: this.editQuotationItem.purposes[0].dealerName,
        });
      }
    });
  }

  getTenureAndDownPmt(formIndex: number) {
    let requestParams:DefaultValuesRequest = {
      brandName: this.getControl(0, formIndex, 'brandName').value.brandName,
      modelName: this.getControl(0, formIndex, 'modelName').value.modelName,
      purpose: this.getControl(0, formIndex, 'purposeOfUse').value.purposeOfUse,
      variant: this.getControl(0, formIndex, 'vehicleVariant').value
        .vehicleVariant,
    };
    if (requestParams.variant && requestParams.purpose) {
      this.requestService
        .getDefaultValues(requestParams)
        .subscribe((res: DefaultValuesResponse) => {
          //Set Controls Value (tenure, downPmt)
          this.pages[0].forms[formIndex].controls['tenure'].setValue(
            res.maxFinanceTenure
          );
          this.pages[0].forms[formIndex].controls['downPmt'].setValue(
            res.minDownPmt
          );
          //Set Control Validators (tenure, downPmt)
          //Set CustomValidators for downPmt
          this.pages[0].forms[formIndex].controls['downPmt'].setValidators([
            {
              validation: ValidationsEnum.MIN,
              options: res.minDownPmt,
            },
            {
              validation: ValidationsEnum.MAX,
              options: '50',
            },
          ]);
          this.pages[0].forms[formIndex].controls['downPmt'].validationLabels =
            {
              max: `${this.translate.instant(
                'finance.fleet.requests.ErrorMax'
              )} 50`,
              min: `${this.translate.instant(
                'finance.fleet.requests.ErrorMin'
              )} ${res.minDownPmt} `,
            };
          //Set CustomValidators for Tenure
          this.pages[0].forms[formIndex].controls['tenure'].setValidators([
            {
              validation: ValidationsEnum.MAX,
              options: res.maxFinanceTenure,
            },
            {
              validation: ValidationsEnum.MIN,
              options: '12',
            },
          ]);
          this.pages[0].forms[formIndex].controls['tenure'].validationLabels = {
            min: `${this.translate.instant(
              'finance.fleet.requests.ErrorMin'
            )} 12`,
            max: `${this.translate.instant(
              'finance.fleet.requests.ErrorMax'
            )} ${res.maxFinanceTenure}`,
          };
        });
    }

    if (this.editQuotationItem != undefined) {
      this.pages[0].forms[formIndex].controls['tenure'].setValue(
        this.editQuotationItem.purposes[0].tenure
      );
      this.pages[0].forms[formIndex].controls['downPmt'].setValue(
        this.editQuotationItem.purposes[0].downPmt
      );
    }
  }

  detectControlsValueChanges(pageNumber: number, formIndex: number) {
    this.pages[pageNumber].forms[formIndex].controls[
      'purposeOfUse'
    ].valueChanges.subscribe((res: ValueChangeResult) => {
      this.getTenureAndDownPmt(formIndex);
      this.setControlCustomValidator(
        'vehiclesNum',
        formIndex,
        res.value.purposeOfUse
      );
    });

    this.pages[pageNumber].forms[formIndex].controls[
      'brandName'
    ].valueChanges.subscribe((res: ValueChangeResult) => {
      this.getModel(
        this.pages[pageNumber].forms[formIndex].controls['brandName'].value
          .brandName,
        formIndex
      );
    });

    this.pages[pageNumber].forms[formIndex].controls[
      'vehiclesNum'
    ].valueChanges.subscribe((res: ValueChangeResult) => {
      this.pages[pageNumber].forms[formIndex].controls['purposeValue'].setValue(
        res.value *
          this.pages[pageNumber].forms[formIndex].controls['vehiclePrice'].value
      );
    });

    this.pages[pageNumber].forms[formIndex].controls[
      'purposeOfUse'
    ].valueChanges.subscribe((res: ValueChangeResult) => {
      this.pages[0].forms[formIndex].controls['purposeOfUse'];
    });

    this.pages[pageNumber].forms[formIndex].controls[
      'vehiclesNum'
    ].valueChanges.subscribe((res: ValueChangeResult) => {});

    this.pages[pageNumber].forms[formIndex].controls[
      'modelYear'
    ].valueChanges.subscribe((res: ValueChangeResult) => {
      this.getPrice(res.value.price);
    });

    this.pages[pageNumber].forms[formIndex].controls[
      'modelName'
    ].valueChanges.subscribe((res: ValueChangeResult) => {
      this.getVariant(
        this.getControl(pageNumber, formIndex, 'brandName').value.brandName,
        res.value.modelName,
        formIndex
      );
    });

    this.pages[pageNumber].forms[formIndex].controls[
      'vehicleVariant'
    ].valueChanges.subscribe((res: ValueChangeResult) => {
      this.getTenureAndDownPmt(formIndex);
      this.getvariantYearsandDefaultValues(res.value, res.formIndex);
    });

    this.pages[pageNumber].forms[formIndex].controls[
      'modelYear'
    ].valueChanges.subscribe((res: ValueChangeResult) => {});
  }

  setControlCustomValidator(
    controlName: string,
    formIndex: number,
    options?: string
  ) {
    if(options === 'MSB_FLEET_PERSONAL_VEH'){
        this.pages[0].forms[formIndex].controls['vehiclesNum'].setValidators([
          {
            validation: ValidationsEnum.MAX,
            options: '3',
          },
        ]);
        this.pages[0].forms[formIndex].controls['vehiclesNum'].validationLabels = 
        {
          max: this.translate.instant(
            'finance.fleet.requests.validationErrorForPersonalUse'
          ),
        }
    }
    else{
      this.pages[0].forms[formIndex].controls['vehiclesNum'].setValidators([])
    }
  }

  getvariantYearsandDefaultValues(selectedVarient: any, formIndex: number) {
    let yearsList: Array<{ modelYear: string; price: number }> = [];
    this.pages[0].forms[formIndex].controls['modelYear'].setValue(null);
    this.variantListWithDuplicates.filter((element) => {
      element.vehicleVariant === selectedVarient.vehicleVariant
        ? yearsList.push({
            modelYear: element.modelYear,
            price: +element.price,
          })
        : '';
    });
    this.pages[0].forms[0].controls['modelYear'].controlOptions.options =
      yearsList;
    if (this.editQuotationItem != undefined) {
      this.pages[0].forms[formIndex].controls['modelYear'].setValue({
        modelYear: this.editQuotationItem.purposes[0].modelYear,
      });
    }
  }

  getPrice(price: number) {
    let vehiclePrice: number = 0;
    vehiclePrice = price;
    this.pages[0].forms[0].controls['vehiclePrice'].setValue(vehiclePrice);
    this.pages[0].forms[0].controls['purposeValue'].setValue(
      vehiclePrice * this.pages[0].forms[0].controls['vehiclesNum'].value
    );
  }

  uploadCustomerQuotation() {
    let staticPurposeValues: StaticPurposeValues = {
      campaign: 'Standard Product',
      vehicleType: 'New Vehicle',
      gracePeriod: '0',
      gracePeriodType: '',
      profitRate: 0,
      pmtFrequency: '',
      ballonPmt: 0,
    };
    let staticQuotationValues: Quotation = {
      quotationType: 'Internal',
      quotationNum: +1,
      quotationDate: new Date().toJSON().split('T')[0],
      documentsInfo: null,
      purposes: [],
    };

    staticQuotationValues['purposes'].push({
      ...this.getInternalValue('internalQuotForm'),
      ...staticPurposeValues,
    });
    let newInternalQuotations = staticQuotationValues;

    let InStoredInQuotations: Quotation[] = sessionStorage.getItem(
      'InQuotations'
    )
      ? JSON.parse(sessionStorage.getItem('InQuotations') || '')
      : [];
    if (!InStoredInQuotations || InStoredInQuotations.length == 0) {
      sessionStorage.setItem(
        'InQuotations',
        JSON.stringify([staticQuotationValues])
      );
    } else {
      //edit
      if (this.editQuotationItem != undefined) {
        InStoredInQuotations[this.editItemIndex] = staticQuotationValues;
      } else {
        InStoredInQuotations.push(newInternalQuotations);
      }
      sessionStorage.setItem(
        'InQuotations',
        JSON.stringify(InStoredInQuotations)
      );
    }
    this.router.navigate(['/finance/fleet/vehicle-details']);
  }

  APICalls(formIndex: number) {
    this.getBrands(formIndex);
    this.getDealers(formIndex);
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    if (formButtonClickOutput.buttonId == 'addInternalQuotation') {
      this.uploadCustomerQuotation();
    }
    if (formButtonClickOutput.buttonId == 'Back') {
      this.router.navigate(['/finance/fleet/vehicle-details']);
    }
  }
}
