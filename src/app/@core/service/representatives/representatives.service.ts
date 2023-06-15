import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  RepresentativesAddRes,
  RepresentativesDetailRes,
  RepresentativesRes,
  RequestAddRepresentative,
  RequestRepresentativeDelete,
  RequestRepresentativeModify,
  ResponseRepresentativeMod,
} from 'app/@core/model/rest/representatives/representatives-req.model';
import { Observable } from 'rxjs';
import {
  AbstractBaseService,
  ContextPath,
  RequestOption,
} from '../base/abstract-base.service';
import { RepresentativesConstants } from './representatives-constants';

@Injectable({
  providedIn: 'root',
})
export class RepresentativesService extends AbstractBaseService {
  getList(statusCode: string): Observable<RepresentativesRes> {
    return this.get(RepresentativesConstants.REPRESENTATIVES_LIST, {
      requestParams: statusCode
        ? new HttpParams().append('statusCode', statusCode)
        : undefined,
      hideLoader: true,
    });
  }

  deleteRepresentative(body: RequestRepresentativeDelete[]): Observable<null> {
    return this.delete(RepresentativesConstants.REPRESENTATIVES_DELETE, body);
  }

  confirmRepresentative(
    representative: RequestAddRepresentative
  ): Observable<RepresentativesAddRes> {
    return this.post(
      RepresentativesConstants.REPRESENTATIVES_ADD,
      representative
    );
  }

  getDetails(repSgntrId: string): Observable<RepresentativesDetailRes> {
    return this.get(RepresentativesConstants.REPRESENTATIVES_DETAIL, {
      requestParams: repSgntrId
        ? new HttpParams().append('repSgntrId', repSgntrId)
        : undefined,
    });
  }

  editRepresentative(
    representative: RequestRepresentativeModify
  ): Observable<ResponseRepresentativeMod> {
    return this.post(
      RepresentativesConstants.REPRESENTATIVES_MODIFY,
      representative
    );
  }
  getDocument(fileName: string) {
    const options: RequestOption = {
      contextPath: ContextPath.DOCUMENT_CONTEXT,
    };
    this.getFile(fileName, fileName, false, options);
  }
}
