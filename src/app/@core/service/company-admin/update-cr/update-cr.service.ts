import {Injectable} from '@angular/core';
import {UpdateCRExpiryRes} from 'app/@core/model/rest/company-admin/update-cr/update-cr-res';
import {Observable} from 'rxjs';
import {AbstractBaseService} from '../../base/abstract-base.service';
import {UpdateCRConstants} from './update-cr-constants';

@Injectable()
export class UpdateCrService extends AbstractBaseService {
  updateCR(profileNumber: string): Observable<UpdateCRExpiryRes> {
    return this.put(UpdateCRConstants.UPDATE_CR, {
      profileNumber: profileNumber,
    });
  }
}
