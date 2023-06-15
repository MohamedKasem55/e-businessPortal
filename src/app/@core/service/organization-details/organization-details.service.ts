import { Injectable } from '@angular/core';
import { BaseResponse } from 'app/@core/model/rest/common/base-response';
import { OrganizationDetailsResponseModel, UpdateContactDetailsRequestModel } from 'app/@core/model/rest/organization-details/organization-details';
import { Observable } from 'rxjs';
import { AbstractBaseService } from '../base/abstract-base.service';
import { Constants } from './organization-details-urls';

@Injectable()
export class OrganizationDetailService extends AbstractBaseService {

    getOrganizationDetails(): Observable<OrganizationDetailsResponseModel> {
        return this.get(Constants.ORGANIZATION_DETAILS);
    }

    updateContactFormDetails(req: UpdateContactDetailsRequestModel): Observable<BaseResponse> {
        return this.post(Constants.UPDATE_ORGANIZATION_DETAILS, req);
    }

}
