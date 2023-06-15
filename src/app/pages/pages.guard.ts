import {Injectable} from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot, UrlTree
} from "@angular/router";
import {Observable} from "rxjs";
import {AuthenticationUtils} from "../@core/utility/authentication-utils";

@Injectable()
export class PagesGuard implements CanActivate {
  constructor(
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
   return  AuthenticationUtils.hasAccess(route.data['service']);
  }

}
