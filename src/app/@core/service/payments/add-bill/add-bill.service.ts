import {Injectable} from '@angular/core';
import {AbstractBaseService} from "../../base/abstract-base.service";
import {HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Constants} from "./add-bill-urls";
import {AddBillValidateReq} from "../../../model/rest/payments/add-bill/add-bill-validate-req";
import {AddBillValidateRes} from "../../../model/rest/payments/add-bill/add-bill-validate-res";
import {SearchBillRes} from "../../../model/rest/payments/billPayment/search-bill-res";

@Injectable()
export class AddBillService extends AbstractBaseService {


  getProvidersDetails(isCategorized: boolean): Observable<SearchBillRes> {
    let param = new HttpParams();
    param = param.append("isCategorized", isCategorized);
    return this.get(Constants.BILL_PROVIDERS_DETAILS, {requestParams:param})
  }

  validateAddBill(addBillValidateReq: AddBillValidateReq): Observable<AddBillValidateRes> {
    return this.post(Constants.ADD_BILL_VALIDATE,addBillValidateReq)
  }

  confirmAddBill(addBillConfirmReq:any):Observable<any>{
    return this.post(Constants.ADD_BILL_CONFIRM,addBillConfirmReq)
  }
}
