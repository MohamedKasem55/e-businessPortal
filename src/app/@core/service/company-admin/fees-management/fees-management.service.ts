import { Injectable } from '@angular/core';
import {
  BulkFeesRes,
  GeneralFeesRes,
  PayrollCardFeesRes,
} from 'app/@core/model/rest/company-admin/fees-management/fees-management-res';
import { map, Observable } from 'rxjs';
import { AbstractBaseService } from '../../base/abstract-base.service';
import { FeesManagementConstants } from './fees-management-urls';
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class FeesManagmentService extends AbstractBaseService {
    /**
     *
     */
    constructor(private translate: TranslateService) {
        super();

    }
  getGeneralFeesList(): Observable<GeneralFeesRes> {
    return this.get(FeesManagementConstants.GENERAL_LIST, {hideLoader: true}).pipe(
       map((data: GeneralFeesRes) => data)
    );
  }
  getPayrollFeesList(): Observable<any> {
    return this.get(FeesManagementConstants.PAYROLL_LIST, {hideLoader: true}).pipe(
      map((data) => data)
    );
  }
  getPayrollCardFeesList(): Observable<PayrollCardFeesRes> {
    return this.get(FeesManagementConstants.PAYROLL_CARD_LIST, {hideLoader: true}).pipe(
      map((data) => data)
    );
  }
  getBulkStatementFeesList(): Observable<BulkFeesRes> {
    return this.get(FeesManagementConstants.BULK_LIST, {hideLoader: true}).pipe(
      map((data) => data)
    );
  }
}
