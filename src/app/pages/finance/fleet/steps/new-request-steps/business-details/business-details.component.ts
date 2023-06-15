import {Component, OnInit} from '@angular/core';
import {PageModel} from 'app/@core/model/dto/formModel';
import {BusinessDetailsForm} from './business-details.component.controls';
import {CustomerBusinessDetails, CustomerBusinessDetailsRes} from '../../../../../../@core/model/rest/finance/request/business-details';
import {defaultBusinessDetails} from '../data.controls';
import {KeyValueModel} from '../../../../../../@core/model/rest/common/key-value.model';
import {Router} from '@angular/router';
import {FormButtonClickOutput} from '../../../../../../shared/form/form.component';
import { RequestService } from '../../../../../../@core/service/finance/request/request.service';
import { FinanceBaseComponent } from '../../../../finance-base/finance-base.component';

@Component({
  selector: '[app-business-details]',
  templateUrl: '../../../../finance-base/finance-base.component.html',
  styleUrls: []
})
export class BusinessDetailsComponent extends FinanceBaseComponent implements OnInit {
  businessDetailsData: CustomerBusinessDetails = defaultBusinessDetails();

  constructor(
    private requestService: RequestService

  ) {
    super();
    this.pageTitle.stepper!.stepCounter = 1;
    this.drawPage()
  }

  override ngOnInit(): void {
    this.getCustomerBusinessDetails();
  }

  mapTrackingObjToBusinessDetailsObj(trackingBusinessDetails: any) {
    let trackBusinessDetailsKeys = ['businessModel', 'branchesNumber', 'firstRePymtDate'];
    let businessTypeOptions: Array<KeyValueModel> = []
    let branchTypeOptions: Array<KeyValueModel> = []
    let businessLocationOptions: Array<KeyValueModel> = [];
    let mapBusinessDetailsObj = new Map<string, string>([
      ['businessModel', 'businessActivity'],
      ['branchesNumber', 'businessOutletsNum'],
      ['firstRePymtDate', 'establishmetDate'],
    ])

    for (let property in trackingBusinessDetails) {
      if (trackBusinessDetailsKeys.indexOf(property) > -1) {
        trackingBusinessDetails[`${mapBusinessDetailsObj.get(property)}`] = trackingBusinessDetails[property];
        delete trackingBusinessDetails[property]
      } else {
        switch (property) {
          case "businessType":
            businessTypeOptions.push({key: "0", value: trackingBusinessDetails[property]});
            break;
          case "branchType":
            branchTypeOptions.push({key: "0", value: trackingBusinessDetails[property]});
            break;
          case "businessLocation":
            businessLocationOptions.push({key: "0", value: trackingBusinessDetails[property]});
            break;
        }
        trackingBusinessDetails[`${property}`] = {key: 0, value: trackingBusinessDetails[`${property}`]}
      }
    }
    this.pages[0] = new PageModel(1, BusinessDetailsForm(trackingBusinessDetails, true, businessTypeOptions, branchTypeOptions, businessLocationOptions,))
  }


  drawPage() {
    this.pages = [new PageModel(1, BusinessDetailsForm(this.businessDetailsData, false))];
  }

  /**
   *
   * @param data
   * @param from 1=> fromAPI ,2 => session storage
   */
  setCustomerBusinessDetailsForm(data: CustomerBusinessDetailsRes, from?: number) {
    let businessType: KeyValueModel[] = [];
    let businessOutletsType: KeyValueModel[] = [];
    let businessLocation: KeyValueModel[] = [];
    let customerBusinessDetails: CustomerBusinessDetails = data.customerBusinessDetails[0];

    data.businessTypesLsts[0].businessType.forEach((element: string, index: number) => {
      businessType.push({"key": `${index}`, "value": element});
      customerBusinessDetails.businessType === element ?
        customerBusinessDetails.businessType = {key: `${index}`, value: element} : ""
    });
    data.branchTypesLsts[0].branchType.forEach((element: string, index: number) => {
      businessOutletsType.push({"key": `${index}`, "value": element});
      customerBusinessDetails.branchType === element ?
        customerBusinessDetails.branchType = {key: `${index}`, value: element} : ""
    });
    data.locationsLsts[0].businessLocation.forEach((element: string, index: number) => {
      businessLocation.push({"key": `${index}`, "value": element});
      customerBusinessDetails.businessLocation === element ?
        customerBusinessDetails.businessLocation = {key: `${index}`, value: element} : ""
    });
    if (from == 2) {
      customerBusinessDetails['businessActivity'] = customerBusinessDetails['businessActivities'];
      let selectedBusinessOutletsType = businessOutletsType.find((element: KeyValueModel) => {
        return (element.value === customerBusinessDetails.businessOutletsType)
      });
      customerBusinessDetails['branchType'] = selectedBusinessOutletsType;
    }
    this.pages[0] = new PageModel(1, BusinessDetailsForm(customerBusinessDetails, false, businessType, businessOutletsType, businessLocation))
    if (this.dossierID) {
      this.disableAllFormControls()
    }
  }

  disableAllFormControls() {
    let formControlName = ['businessLocation', 'businessOutletsType', 'businessType', 'businessOutletsNum', 'businessActivities', 'establishmentDate'];
    formControlName.forEach(formControlName => {
      this.pages[0].forms[0].controls[formControlName].disable();
    })
  }

  getCustomerBusinessDetails() {
    this.requestService.getCustomerBusinessDetails().subscribe((res:CustomerBusinessDetailsRes) => {
      if (this.dossierID || sessionStorage.getItem('businessDetails'))
        this.setCustomerBusinessDetailsForm({...res, ...{customerBusinessDetails: [JSON.parse(sessionStorage.getItem('businessDetails') || "")]}}, 2);
      else this.setCustomerBusinessDetailsForm(res, 1)

    }, error => {
      this.drawPage();
    })
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    if (formButtonClickOutput.buttonId === 'Next') {
      this.nextStep()
    }
    if (formButtonClickOutput.buttonId === 'Back') {
      this.backStep()
    }
  }

  nextStep() {
    let establishmentDate = this.pages[0].forms[0].controls['establishmentDate'].value;
    this.pages[0].forms[0].controls['establishmentDate'].setValue(
      `${establishmentDate.year}-${(establishmentDate.month > 9 ? establishmentDate.month : '0' + establishmentDate.month)}-${(establishmentDate.day > 9 ? establishmentDate.day : '0' + establishmentDate.day)}`
    )
    sessionStorage.setItem('businessDetails', JSON.stringify(this.getformValue('businessDetails')));
    this.router.navigate(['/finance/fleet/linked-account']);
  }

  backStep() {
    this.router.navigate(['/finance']);
  }
}
