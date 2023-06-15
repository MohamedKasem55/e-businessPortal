import { Injectable } from '@angular/core';
import { AccountListResModel } from 'app/@core/model/rest/cards/user-approval/account-res.model';
import { Observable } from 'rxjs';
import { AbstractBaseService } from '../base/abstract-base.service';
import { Constants } from './user-profile-service-urls';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService  extends AbstractBaseService {

  getSARAccountList():Observable<AccountListResModel> {
    return this.get(Constants.ACCOUNT_LIST);
  }
}
