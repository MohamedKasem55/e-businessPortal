import { Injectable } from '@angular/core';
import {
  NationalAddressCitiesRes,
  NationalAddressRegionsRes,
  NationalAddressRegisterNewReq,
  NationalAddressRegisterNewRes,
} from 'app/@core/model/rest/company-admin/national-address/national-address-res';
import { Observable } from 'rxjs';
import { AbstractBaseService } from '../../base/abstract-base.service';
import { NationalAddressConstants } from './national-address-constants';

@Injectable()
export class NationalAddressService extends AbstractBaseService {
  getRegions(): Observable<NationalAddressRegionsRes> {
    return this.get(NationalAddressConstants.REGIONS);
  }

  getCities(city: string): Observable<NationalAddressCitiesRes> {
    return this.get(NationalAddressConstants.CITIES + city);
  }

  register(nationalAddress: NationalAddressRegisterNewReq): Observable<NationalAddressRegisterNewRes> {
    return this.post(NationalAddressConstants.REGISTER, nationalAddress);
  }
}
