import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
import {UserDetailsRes} from "app/@core/model/rest/company-admin/user-details/user-details-res";
import {Observable} from "rxjs";
import {UserManagementService} from "./users-managment.service";

/**
 * User Id Resolver
 * */

@Injectable()
export class UserDetailsResolver implements Resolve<UserDetailsRes> {


  constructor(private service: UserManagementService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<UserDetailsRes> {
    let userDetailsId: any = route.paramMap.get('userId');
    return this.service.loadUserDetailsById(userDetailsId);
  }
}
