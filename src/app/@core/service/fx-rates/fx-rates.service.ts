import { Injectable } from '@angular/core';
import { FxRatesRequestReq, fxRatesRes, FxRatesRes } from 'app/@core/model/rest/fx-rates/fx-rates';
import { Observable } from 'rxjs';
import { AbstractBaseService } from '../base/abstract-base.service';

@Injectable()
export class FxRatesService extends AbstractBaseService {
  private listUrl = 'statics/list';
  private fxRatesUrl = 'transfers/international/fxrates';
  constructor() { super();}

  getRatesList():Observable<FxRatesRes>{
    const names = {names:['currency','currencyIso']};
    return this.post(this.listUrl, names);
  }

  getFxRates(request:FxRatesRequestReq = {
    baseAmount:0
  }):Observable<fxRatesRes>{
    return this.post(this.fxRatesUrl, request);
  }
}
