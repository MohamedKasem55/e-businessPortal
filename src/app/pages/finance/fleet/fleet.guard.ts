import {Injectable} from '@angular/core';
import {CanActivate, Router,} from '@angular/router';

@Injectable()
export class FleetGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate() {
    return this.checkFleetNewRequest();
  }

  checkFleetNewRequest() {
    if ((!sessionStorage.getItem("DOSSIER_ID"))) {
      this.router.navigate(['/finance/fleet/business-details'])
      return false
    } else {
      return true
    }
  }
}
