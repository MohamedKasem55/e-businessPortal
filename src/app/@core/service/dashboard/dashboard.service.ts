import {Injectable} from '@angular/core';
import {AbstractBaseService} from "../base/abstract-base.service";
import {Observable} from "rxjs";
import {Constants} from "./dashboard-urls";
import {DashboardTopBillsTransfersRes} from 'app/@core/model/rest/dashboard/dashboard-top-bills-transfers-res.model';

@Injectable()
export class DashboardService extends AbstractBaseService {

  getDashboardTopBillsTransfers(): Observable<DashboardTopBillsTransfersRes> {
    return this.get(Constants.DASHBOARD_TOP_REPOERTS, {hideLoader: true, silentError: true});
  }
}
