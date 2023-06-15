import { Injectable } from '@angular/core';
import { LanguageListModel, UpdateChallengeQuestionRequestModel, UpdateUserDetailsResponseModel, UserDetailsRequestModel, UserDetailsResponseModel } from 'app/@core/model/rest/update-user-details/update-user-details';
import { Observable } from 'rxjs';
import { AbstractBaseService } from '../base/abstract-base.service';
import { Constants } from './update-user-details-urls';

@Injectable({
    providedIn: 'root'
})
export class UpdateUserDetailService extends AbstractBaseService {

    getUserDetails(): Observable<UserDetailsResponseModel> {
        return this.get(Constants.USER_DETAILS);
    }

    getLanguagesList(req: string[]): Observable<LanguageListModel[]> {
        const data = { names: req }
        return this.post(Constants.LANGUAGE_LIST, data);
    }
    
    updateUserDetails(req: UserDetailsRequestModel): Observable<UpdateUserDetailsResponseModel> {
        return this.post(Constants.UPDATE_USER_DETAILS, req);
    }

    updatePasswordQuestions(req: UpdateChallengeQuestionRequestModel): Observable<UpdateUserDetailsResponseModel> {
        return this.post(Constants.UPDATE_PASSWORD_QUESTIONS, req);
    }
   
}
