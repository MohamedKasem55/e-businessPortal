import { Component, OnInit } from '@angular/core';
import { PageModel } from '../../../../../@core/model/dto/formModel';
import { UUID } from 'angular2-uuid';
import { ValidationsEnum } from '../../../../../@core/model/dto/validations-enum';
import {
  addPurposeBtn,
  quotationPurpose,
} from './upload-ex-quotation.controls';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import {
  DefaultValuesRequest,
  QuotationDoc,
  QuotationForm,
  VehicleResponse,
} from '../../../../../@core/model/rest/finance/request/quotation';
import { ValueChangeResult } from '../../../../../@core/model/dto/control/control.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '../../../../../@core/service/finance/request/request.service';
import {
  Purpose,
  Quotation,
  VehicleItem,
} from '../../../../../@core/model/rest/finance/request/quotation';
import { DataService } from '../../../../../@core/service/finance/data.service';
import { FinanceBaseComponent } from '../../../finance-base/finance-base.component';
import { DefaultValuesResponse } from '../../../../../@core/model/rest/finance/request/quotation';

@Component({
  selector: 'app-ex-quotation',
  templateUrl: '../../../finance-base/finance-base.component.html',
  styleUrls: [],
})
export class UploadExQuotationComponent
  extends FinanceBaseComponent
  implements OnInit
{
  formChangedIndex!: number;
  storedExQuotations: Quotation[] = [];
  quotationNum: number = 1;
  quotationList: Quotation[] = [];
  quotationForms: QuotationForm[] = [];
  variantListWithDuplicates: VehicleItem[] = [];
  quotationFiles: QuotationDoc[] = [];
  purposeList = [];
  editItemIndex!: number;
  editQuotationItem!: Quotation;

  constructor(
    public activatedRoute: ActivatedRoute,
    private requestService: RequestService,
    private financeDataService: DataService
  ) {
    super();
    this.endButtons = [this.nextButton, this.addanotherQuotation];
    this.pageTitle = {
      id: 'fleetNewReq',
      title: 'finance.fleet.newRequest.products.fleet',
    };
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
    this.drawPage();
  }
  setQuotationData() {
    let quotationList = JSON.parse(
      sessionStorage.getItem('ExQuotations') || ''
    );
    this.editQuotationItem = quotationList[this.editItemIndex];
  }

  drawPage() {
    if (this.editQuotationItem != undefined) {
      this.pages = [
        new PageModel(
          0,
          quotationPurpose(
            'quotation',
            UUID.UUID(),
            true,
            true,
            `${this.translate.instant(
              'finance.fleet.requests.externalQuotation'
            )} ${this.editQuotationItem.quotationNum}`,
            this.financeDataService.purposeOfUse,
            this.financeDataService.colors
          )
        ),
      ];
      this.quotationForms = [
        {
          index: this.editQuotationItem.index || 0,
          type: 'quotation',
          quotationNum: this.editQuotationItem.quotationNum,
        },
      ];
      this.setOtherQuotationValues(0);
      for (let i = 1; i < this.editQuotationItem.purposes.length; i++) {
        this.addPurpose(i - 1);
      }
    } else {
      this.pages = [
        new PageModel(
          0,
          quotationPurpose(
            'quotation',
            UUID.UUID(),
            true,
            true,
            `${this.translate.instant(
              'finance.fleet.requests.externalQuotation'
            )} ${this.quotationNum}`,
            this.financeDataService.purposeOfUse,
            this.financeDataService.colors
          )
        ),
      ];
      this.quotationForms = [{ index: 0, type: 'quotation', quotationNum: 1 }];
    }
    this.pages[0].valueChanges.subscribe((formIdx) => {
      this.formChangedIndex = formIdx;
    });

    this.detectControlsValueChanges(0, 0);
  }

  shift(index: number) {
    for (let i = index; i > this.quotationForms.length; i++) {
      this.quotationForms[i].index++;
      if (this.quotationForms[i].quotationParentIndex)
        this.quotationForms[i].quotationParentIndex!++;
    }
  }

  getQuotationMaxPurpose(index: number) {
    let max = index;
    this.quotationForms.forEach((form) => {
      if (form.quotationParentIndex === index) {
        max = form.index;
      }
    });
    return max;
  }

  addPurpose(formIndex: number) {
    let max = this.getQuotationMaxPurpose(formIndex as number);
    this.pages[0].addFormAtIndex(
      quotationPurpose(
        'purpose',
        UUID.UUID(),
        false,
        false,
        `${this.translate.instant('finance.fleet.requests.Purpose')} ${
          max + 2
        }`,
        this.financeDataService.purposeOfUse,
        this.financeDataService.colors
      ),
      max + 1
    );
    this.quotationForms.splice(max + 1, 0, {
      index: max + 1,
      type: 'purpose',
      quotationParentIndex: formIndex,
    });
    this.shift(max + 2);
    this.APICalls(this.pages[0].forms.length - 1);
    this.detectControlsValueChanges(0, this.pages[0].forms.length - 1);
    if (this.editQuotationItem != undefined) {
      this.setOtherQuotationValues(this.pages[0].forms.length - 1);
    }
  }
  setOtherQuotationValues(formIndex: number) {
    this.pages[0].forms[formIndex].controls['vehicleColor'].setValue({
      vehicleColor: this.editQuotationItem.purposes[formIndex].vehicleColor,
    });
    this.pages[0].forms[formIndex].controls['purposeOfUse'].setValue({
      purposeOfUse: this.editQuotationItem.purposes[formIndex].purposeOfUse,
    });
    this.pages[0].forms[formIndex].controls['vehiclesNum'].setValue(
      this.editQuotationItem.purposes[formIndex].vehiclesNum
    );
    this.pages[0].forms[formIndex].controls['vehiclePrice'].setValue(
      this.editQuotationItem.purposes[formIndex].vehiclePrice
    );
    this.pages[0].forms[formIndex].controls['purposeValue'].setValue(
      this.editQuotationItem.purposes[formIndex].purposeValue
    );
  }

  override onButtonClick(event: FormButtonClickOutput) {
    if (event.buttonId === 'add_purpose') {
      this.addPurpose(event.formIndex as number);
    }

    if (event.buttonId === 'addanotherQuotation') {
      this.quotationNum++;
      this.quotationForms.push({
        index: this.quotationForms.length,
        type: 'quotation',
        quotationNum: this.quotationNum,
      });
      this.pages[0].addForm(
        quotationPurpose(
          'quotation',
          UUID.UUID(),
          true,
          false,
          `${this.translate.instant(
            'finance.fleet.requests.externalQuotation'
          )} ${this.quotationNum}`,
          this.financeDataService.purposeOfUse,
          this.financeDataService.colors
        )
      );
      this.APICalls(this.pages[0].forms.length - 1);
      this.detectControlsValueChanges(0, this.pages[0].forms.length - 1);
    }
    if (event.buttonId === 'deleteButton') {
      let max = this.getQuotationMaxPurpose(event.formIndex as number);
      //we do this because when the user remove the quotation the (quotation doc) file will remove also
      //so the first purpose that related to this quotation will move to be the quotation
      //so we need to show the doc in this purpose (first purpose in Quotation)
      if (this.quotationForms[event.formIndex || 0].type === 'quotation') {
        if (
          this.quotationForms[(event.formIndex || 0) + 1]?.type == 'purpose'
        ) {
          this.pages[0].forms[(event.formIndex || 0) + 1].controls[
            'fileInfo'
          ].hidden = false;
          this.quotationForms[(event.formIndex || 0) + 1].type = 'quotation';
          this.quotationForms[(event.formIndex || 0) + 1].quotationNum =
            this.quotationForms[event.formIndex || 0].quotationNum;
          this.pages[0].forms[(event.formIndex || 0) + 1].controls[
            'col'
          ].controlOptions.endButtons.push(addPurposeBtn());
          // this.pages[0].forms[(event.formIndex || 0) + 1].controls['uploadQuotationTitle'].controlOptions.title = `quotation ${}`
        } else {
          this.quotationNum--;
        }
      }
      this.pages[0].deleteFrom(event.formIndex || 0, 1);
      this.quotationForms.splice(event.formIndex || 0, 1);
      this.shift(max - 2);
    }
    if (event.buttonId === 'Next') {
      this.getFormArrayValue(this.pages[0]);
      this.storedExQuotations = sessionStorage.getItem('ExQuotations')
        ? JSON.parse(sessionStorage.getItem('ExQuotations') || '')
        : [];
      if (this.storedExQuotations.length == 0) {
        sessionStorage.setItem(
          'ExQuotations',
          JSON.stringify(this.getQuotationObj(this.quotationForms))
        );
      } else {
        let newQuotations: Quotation[] =
          this.getQuotationObj(this.quotationForms) || [];
        newQuotations.forEach((quotation, index) => {
          quotation.index = this.storedExQuotations.length + index;
          quotation.quotationNum = this.storedExQuotations.length + index;
        });
        this.storedExQuotations = this.storedExQuotations.concat(newQuotations);
        sessionStorage.setItem(
          'ExQuotations',
          JSON.stringify(this.storedExQuotations)
        );
      }
      this.router.navigate(['/finance/fleet/vehicle-details']);
    }
    if (event.buttonId === 'Back') {
      this.router.navigate(['/finance/fleet/vehicle-details']);
    }
  }

  getQuotationObj(quotationFormList: QuotationForm[]): Quotation[] {
    const purposes =
      quotationFormList.filter(
        (c: QuotationForm) => c.quotationParentIndex != null
      ) || [];
    const quotations =
      quotationFormList.filter(
        (c: QuotationForm) => c.quotationParentIndex == null
      ) || [];

    quotations.forEach((element: QuotationForm, index: number) => {
      element['purposes'] = [];
      element['quotationType'] = 'External';
      element['quotationNum'] = index;
      element['quotationDate'] = new Date().toJSON().split('T')[0];
      element['documentsInfo'] = null;
      purposes.push({ ...element, ...{ quotationParentIndex: element.index } });
    });

    purposes.forEach((purpose: QuotationForm) => {
      quotations.find((parent: QuotationForm, index: number) => {
        if (parent.index == purpose.quotationParentIndex) {
          this.pages[0].forms[purpose.index].controls['profitRate'].setValue(0);
          this.pages[0].forms[purpose.index].controls['ballonPmt'].setValue(0);
          quotations[index].purposes.push(
            this.getExternalValue(
              this.pages[0].forms[purpose.index].id
            ) as Purpose
          );
        }
      });
    });

    quotations.forEach((quotation: QuotationForm) => {
      this.quotationFiles.find((quotationFile) => {
        if (quotationFile.parentIndex === quotation.index) {
          quotation.documentsInfo = quotationFile;
        }
      });
    });
    return quotations as Quotation[];
  }

  getBrands(formIndex: number) {
    this.requestService.getBrands().subscribe((res: VehicleResponse) => {
      this.pages[0].forms[formIndex].controls[
        'brandName'
      ].controlOptions.options = res.vehiclesLstItem;
      if (this.editQuotationItem != undefined) {
        this.pages[0].forms[formIndex].controls['brandName'].setValue({
          brandName: this.editQuotationItem.purposes[formIndex].brandName,
        });
        this.getModel(
          this.editQuotationItem.purposes[formIndex].brandName,
          formIndex
        );
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
            modelName: this.editQuotationItem.purposes[formIndex].modelName,
          });
          this.getVariant(
            this.editQuotationItem.purposes[formIndex].brandName,
            this.editQuotationItem.purposes[formIndex].modelName,
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
            vehicleVariant:
              this.editQuotationItem.purposes[formIndex].vehicleVariant,
          });
          this.getTenureAndDownPmt(formIndex);
          this.getvariantYears(
            {
              price: this.editQuotationItem.purposes[formIndex].price,
              vehicleVariant:
                this.editQuotationItem.purposes[formIndex].vehicleVariant,
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
          dealerName: this.editQuotationItem.purposes[formIndex].dealerName,
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
        this.editQuotationItem.purposes[formIndex].tenure
      );
      this.pages[0].forms[formIndex].controls['downPmt'].setValue(
        this.editQuotationItem.purposes[formIndex].downPmt
      );
    }
  }

  UploadQuotationDoc(doc: File, formIndex: number) {
    var index_: number = 0;
    let docObj: QuotationDoc = {
      doessierId: sessionStorage.getItem('DOSSIER_ID') || '',
      documentCode: 'FQD',
      description: 'Dealer Quotation',
      fileName: `${sessionStorage.getItem('DOSSIER_ID')}_${formIndex}.${
        doc.type.split('/')[1]
      }`,
      fileType: doc.type,
      fileContent: '',
      parentIndex: formIndex,
    };

    this.requestService.convertFileToURL(doc).then((dataUrl: any) => {
      docObj.fileContent = dataUrl;
      this.requestService.uploadQuotationFile(docObj).subscribe((res) => {
        docObj.fileContent = '';
        delete docObj['doessierId'];
        var quotationIndex!: number;
        this.quotationFiles.find(
          (quotationFile: QuotationDoc, index: number) => {
            if (quotationFile.parentIndex == docObj.parentIndex) {
              quotationIndex = index;
            }
          }
        );
        if (quotationIndex === undefined) {
          this.quotationFiles.push(docObj);
        } else {
          this.quotationFiles[quotationIndex] = docObj;
        }
      });
    });
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
      'fileInfo'
    ].valueChanges.subscribe((res: ValueChangeResult) => {
      this.UploadQuotationDoc(res.value, formIndex);
    });

    this.pages[pageNumber].forms[formIndex].controls[
      'vehiclePrice'
    ].valueChanges.subscribe((res: ValueChangeResult) => {
      this.pages[pageNumber].forms[formIndex].controls['purposeValue'].setValue(
        res.value *
          this.pages[pageNumber].forms[formIndex].controls['vehiclesNum'].value
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
      this.getvariantYears(res.value, formIndex);
    });

    this.pages[pageNumber].forms[formIndex].controls[
      'modelYear'
    ].valueChanges.subscribe((res: ValueChangeResult) => {
      this.getPrice(res.value.price);
    });
  }

  getPrice(price: number) {
    let vehiclePrice: number = 0;
    vehiclePrice = price;
    this.pages[0].forms[0].controls['vehiclePrice'].setValue(vehiclePrice);
    this.pages[0].forms[0].controls['purposeValue'].setValue(
      vehiclePrice * this.pages[0].forms[0].controls['vehiclesNum'].value
    );
  }

  getvariantYears(selectedVarient: any, formIndex: number) {
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
    this.pages[0].forms[formIndex].controls[
      'modelYear'
    ].controlOptions.options = yearsList;
    if (this.editQuotationItem != undefined) {
      this.pages[0].forms[formIndex].controls['modelYear'].setValue({
        modelYear: this.editQuotationItem.purposes[formIndex].modelYear,
      });
    }
  }

  APICalls(formIndex: number) {
    this.getBrands(formIndex);
    this.getDealers(formIndex);
  }

  setControlCustomValidator(
    controlName: string,
    formIndex: number,
    options?: string
  ) {

    if(options === 'MSB_FLEET_PERSONAL_VEH'){
      this.pages[0].forms[formIndex].controls[controlName].setValidators([
        {
          validation: ValidationsEnum.MAX,
          options: '3',
        },
      ]);
      this.pages[0].forms[formIndex].controls[controlName].validationLabels ={
        max: this.translate.instant(
          'finance.fleet.requests.validationErrorForPersonalUse'
        ),
      }
    }
    else{
      this.pages[0].forms[formIndex].controls[controlName].setValidators([]);
    }


  }


}
