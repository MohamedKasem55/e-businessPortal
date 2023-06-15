import { FormModel } from 'app/@core/model/dto/formModel';
import { CustomerBusinessDetails } from 'app/@core/model/rest/finance/request/business-details';

import { TrackApplication } from '../../model/rest/finance/request/track-application';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

@Injectable()
export class DataService{
  businessDetails!: CustomerBusinessDetails;
  private posForms: FormModel[] = [];
  private applicationTrackData!: TrackApplication;



  constructor( private translateService: TranslateService) { }

  set customerBusinessDetails_(businessDetails: CustomerBusinessDetails) {
    this.businessDetails = businessDetails;
  }
  get customerBusinessDetails(): CustomerBusinessDetails {
    return this.businessDetails;
  }

  get TrackApplicationData(): TrackApplication{
    return this.applicationTrackData;
  }

  set TrackApplicationData(trackingApplicationData: TrackApplication) {
    this.applicationTrackData = trackingApplicationData;
  }

  setPosForms(index: number, form: FormModel) {
    this.posForms[index-1] = form;
  }
  get getPosForms() {
    return this.posForms
  }
  get purposeOfUse():{txt:string,purposeOfUse:string}[] {
    return [
        {txt: this.translateService.instant('finance.fleet.requests.purpose1'), purposeOfUse: 'MSB_FLEET_COM_13_TON'},
        {txt: this.translateService.instant('finance.fleet.requests.purpose2'), purposeOfUse: 'MSB_FLEET_COM_8TON'},
        {
            txt: this.translateService.instant('finance.fleet.requests.purpose3'),
            purposeOfUse: 'MSB_FLEET_PERSONAL_VEH',
        },
        {txt: this.translateService.instant('finance.fleet.requests.purpose4'), purposeOfUse: 'MSB_FLEET_NON_COM'},
        {txt: this.translateService.instant('finance.fleet.requests.purpose5'), purposeOfUse: 'MSB_FLEET_COM_RENT'},
    ]
}

get colors() {
    return [
        {vehicleColor: 'white', txt: this.translateService.instant('finance.fleet.colors.White')},
        {vehicleColor: 'Black', txt:this.translateService.instant('finance.fleet.colors.Black')},
        {vehicleColor: 'Red', txt: this.translateService.instant('finance.fleet.colors.Red')},
        {vehicleColor: 'Yellow', txt: this.translateService.instant('finance.fleet.colors.Yellow')},
        {vehicleColor: 'Grey', txt: this.translateService.instant('finance.fleet.colors.Grey')},
        {vehicleColor: 'Blue', txt: this.translateService.instant('finance.fleet.colors.Blue')},
        {vehicleColor: 'Brown', txt: this.translateService.instant('finance.fleet.colors.Brown')},
        {vehicleColor: 'Silver', txt: this.translateService.instant('finance.fleet.colors.Silver')},
        {vehicleColor: 'Gold', txt: this.translateService.instant('finance.fleet.colors.Gold')},
        {vehicleColor: 'Green', txt: this.translateService.instant('finance.fleet.colors.Green')},
        {vehicleColor: 'Beige', txt: this.translateService.instant('finance.fleet.colors.Beige')},
        {vehicleColor: 'Maroon', txt: this.translateService.instant('finance.fleet.colors.Maroon')},
        {vehicleColor: 'Purple', txt:  this.translateService.instant('finance.fleet.colors.Purple')},
        {vehicleColor: 'Orange', txt: this.translateService.instant('finance.fleet.colors.Orange')},
        {vehicleColor: 'Pink', txt: this.translateService.instant('finance.fleet.colors.Pink')},
        {vehicleColor: 'Khaki', txt:this.translateService.instant('finance.fleet.colors.Khaki')},
        {vehicleColor: 'CactusGreen', txt: this.translateService.instant('finance.fleet.colors.CactusGreen')},
        {vehicleColor: 'NotKnown', txt: this.translateService.instant('finance.fleet.colors.NotKnown')},
    ]
}


}
