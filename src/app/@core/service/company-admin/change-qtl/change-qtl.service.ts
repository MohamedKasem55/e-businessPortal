import { Injectable } from '@angular/core';
import {
  IPSConfigInqRes,
  ResponseGeneric,
} from 'app/@core/model/rest/company-admin/change-qtl/change-qtl-res';
import { Observable } from 'rxjs';
import { AbstractBaseService } from '../../base/abstract-base.service';
import { ChangeQTLConstants } from './change-qtl-constants';

@Injectable()
export class ChangeQtlService extends AbstractBaseService {
  getQTL(): Observable<IPSConfigInqRes> {
    return this.get(ChangeQTLConstants.GET_QTL);
  }

  changeQTL(qtl: number): Observable<ResponseGeneric> {
    return this.put(ChangeQTLConstants.CHANGE_QTL, {
      requAction: 'UPDATE',
      qtl: qtl,
    });
  }
}
