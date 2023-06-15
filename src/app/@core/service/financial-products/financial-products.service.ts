import { Injectable } from '@angular/core';
import { ExternalModelRes } from 'app/@core/model/rest/financial-products/external-model-res.model';
import { RegisterInterestReq } from 'app/@core/model/rest/financial-products/register-interest-req.model';
import { RegisterInterestRes } from 'app/@core/model/rest/financial-products/register-interest-res.model';
import { Observable } from "rxjs";
import { AbstractBaseService } from '../base/abstract-base.service';
import { Constants } from './financial-products-service-urls';

@Injectable()
export class FinancialProductsService extends AbstractBaseService {
  constructor() {
    super();
  }

  externalModel(req: string): Observable<ExternalModelRes> {
    const data = { name: req }
    return this.post(Constants.EXTERNAL_MODEL, data);
  }


  registerInterest(registerInterestReq?: RegisterInterestReq): Observable<RegisterInterestRes> {
    return this.post(Constants.REGISTER_INTEREST, registerInterestReq);
  }
}
