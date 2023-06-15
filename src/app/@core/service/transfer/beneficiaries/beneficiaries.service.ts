import { Injectable } from "@angular/core";
import { AbstractBaseService } from "../../base/abstract-base.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { BeneficiariesResModel } from "../../../model/rest/transfer/beneficiary/beneficiaries-res.model";
import { BeneficiariesReqModel } from "../../../model/rest/transfer/beneficiary/beneficiaries-req.model";
import { Constants } from "./beneficiaries-service-url";
import { FillBeneficiariesReqModel } from "../../../model/rest/transfer/beneficiary/fill-beneficiaries-req.model";
import { FillBeneficiariesResModel } from "../../../model/rest/transfer/beneficiary/fill-beneficiaries-res.model";
import { BeneficiaryDeleteReqModel } from "../../../model/rest/transfer/beneficiary/beneficiary-delete-req.model";
import { beneficiaryWithinValidateRes } from "app/@core/model/rest/transfer/beneficiary/beneficiaries-within-validate-res.model";
import { beneficiaryWithinDetailsRes } from "app/@core/model/rest/transfer/beneficiary/beneficiaries-within-details-res.model";
import { beneficiaryLocalPaginationRes } from "app/@core/model/rest/transfer/beneficiary/beneficiares-local-pagination-res.model";
import { BeneficiaryModifyReqModel } from "app/@core/model/rest/transfer/beneficiary/beneficiary-modify-req.model";
import { BeneficiaryWithinAddReqModel } from "app/@core/model/rest/transfer/beneficiary/beneficiary-within-add-req.model";
import { BeneficiaryWithinDeleteReqModel } from "app/@core/model/rest/transfer/beneficiary/beneficiary-within-delete-req.model";
import { BeneficiaryLocalAddRequestModel } from "app/@core/model/rest/transfer/beneficiary/beneficiary-local-add-req.model";
import { PaginationBatchModel } from "app/@core/model/rest/common/pagination-batch.model";
import { BeneficiaryInternationalAddRequestModel, BeneficiaryInternationalAddV2RequestModel } from "app/@core/model/rest/transfer/beneficiary/beneficiary-international-add-res.model";
import { BeneficiaryInternationalBranchesReqModel } from "app/@core/model/rest/transfer/beneficiary/beneficiary-international-branches-req.model";
import { BeneficiaryInternationalBankConfReqModel } from "app/@core/model/rest/transfer/beneficiary/beneficiary-international-bank-conf-req.model";
import { BeneficiaryInternationalBankBranchesDetailsResModel } from "app/@core/model/rest/transfer/beneficiary/beneficiary-international-bank-branches-details-res.model";
import { beneficiaryInternationalCountryBranchResModel } from "app/@core/model/rest/transfer/beneficiary/beneficiary-international-countries-branch-res.model";
import { beneficiaryInternationalNationalityResModel } from "app/@core/model/rest/transfer/beneficiary/beneficiary-international-nationalities-res.model";
import { beneficiaryInternationalCurrencyResModel } from "app/@core/model/rest/transfer/beneficiary/beneficiary-international-currencies-res.model";
import { beneficiaryInternationalTransferBankResModel } from "app/@core/model/rest/transfer/beneficiary/beneficiary-international-trasnfer-banks-res.model";
import { BranchNameModel } from "app/@core/model/rest/common/branch-name.model";
import { beneficiaryInternationalBranchNameListResModel } from "app/@core/model/rest/transfer/beneficiary/beneficiary-international-branch-name-list-res.model";
import { beneficiaryInternationalUpdateCountryResModel } from "app/@core/model/rest/transfer/beneficiary/beneficiary-international-update-country-res.model";
import { BaseResponse } from "../../../model/rest/common/base-response";
import { BeneficiariesDetailsResModel } from "app/@core/model/rest/transfer/beneficiary/beneficiaries-details-res.model";
import { BeneficiariesDetailsReqModel } from "app/@core/model/rest/transfer/beneficiary/beneficiaries-details-req.model";

@Injectable()
export class BeneficiariesService extends AbstractBaseService {


  //LIST
  getBeneficiaries(data: BeneficiariesReqModel): Observable<BeneficiariesResModel> {
    return this.post(Constants.BENEFICIARIES, data, { hideLoader: true });
  }

  fillBeneficiaries(data: FillBeneficiariesReqModel): Observable<FillBeneficiariesResModel> {
    return this.post(Constants.FILL_BENEFICIARIES, data);
  }

  //DETAILS

  getBeneficiariesDetails(data: BeneficiariesDetailsReqModel): Observable<BeneficiariesDetailsResModel> {
    return this.post(Constants.BENEFICIARY_DETAILS, data);
  }

  // DELETE

  deleteBeneficiary(data: BeneficiaryDeleteReqModel): Observable<null> {
    return this.delete(Constants.BENEFICIARY_DELETE, data);
  }

  // MODIFY

  modifyBeneficiary(data: BeneficiaryModifyReqModel): Observable<BaseResponse> {
    return this.put(Constants.BENEFICIARY_MODIFY, data);
  }


  //  WITHIN
  beneficiaryWithinAdd(params: BeneficiaryWithinAddReqModel, beneficiaryAccountNumber: string): Observable<BaseResponse> {
    return this.post(Constants.BENEFICIARY_WITHIN_ADD.replace("{{account}}", beneficiaryAccountNumber), params);
  }

  beneficiaryWithinValidate(beneficiaryAccountNumber: string): Observable<beneficiaryWithinValidateRes> {
    return this.get(Constants.BENEFICIARY_WITHIN_VALID.replace("{{account}}", beneficiaryAccountNumber));
  }

  beneficiaryWithinValidateAdd(params: BeneficiaryWithinAddReqModel, beneficiaryAccountNumber: string): Observable<beneficiaryWithinValidateRes> {
    return this.post(Constants.BENEFICIARY_WITHIN_VALIDATE_ADD.replace("{{account}}", beneficiaryAccountNumber), params);
  }

  beneficiaryWithinDelete(transfer: BeneficiaryWithinDeleteReqModel): Observable<BaseResponse> {
    return this.put(Constants.BENEFICIARY_WITHIN_DELETE, transfer);
  }

  beneficiaryWithinDetails(params: BeneficiaryWithinDeleteReqModel, beneficiaryAccountNumber: string): Observable<beneficiaryWithinDetailsRes> {
    return this.post(Constants.BENEFICIARY_WITHIN_DETAILS, params);
  }


  // LOCAL
  beneficiaryLocalAdd(params: BeneficiaryLocalAddRequestModel): Observable<BaseResponse> {
    return this.post(Constants.BENEFICIARY_LOCAL_ADD, params);
  }

  beneficiaryLocalPaginationBatch(params: PaginationBatchModel): Observable<beneficiaryLocalPaginationRes> {
    return this.post(Constants.BENEFICIARY_PAGINATION_BATCH, params);
  }

  beneficiaryLocalValidate(): Observable<beneficiaryWithinValidateRes> {
    return this.get(Constants.BENEFICIARY_LOCAL_VALID);
  }

  beneficiaryLocalValidateAdd(params: BeneficiaryLocalAddRequestModel): Observable<beneficiaryWithinValidateRes> {
    return this.post(Constants.BENEFICIARY_LOCAL_VALIDATE_ADD, params);
  }


  // INTERNATIONAL
  beneficiaryInternationalAdd(params: BeneficiaryInternationalAddRequestModel): Observable<BaseResponse> {
    return this.post(Constants.BENEFICIARY_INTERNATIONAL_ADD, params);
  }

  beneficiaryInternationalAddV2(params: BeneficiaryInternationalAddV2RequestModel): Observable<BaseResponse> {
    return this.post(Constants.BENEFICIARY_INTERNATIONAL_ADD_V2, params);
  }

  beneficiaryInternationalBranchDetails(productCode: string, swiftCode: string): Observable<BeneficiaryInternationalBankBranchesDetailsResModel> {
    return this.get(Constants.BENEFICIARY_INTERNATIONAL_BRANCH_DETAILS + productCode + '/' + swiftCode);
  }


  beneficiaryInternationalBranch(params: BeneficiaryInternationalBranchesReqModel): Observable<BeneficiaryInternationalBankBranchesDetailsResModel> {
    return this.post(Constants.BENEFICIARY_INTERNATIONAL_BANK_BRANCH, params);
  }

  beneficiaryInternationalBankConfiguration(params: BeneficiaryInternationalBankConfReqModel): Observable<BeneficiaryInternationalBankBranchesDetailsResModel> {
    return this.post(Constants.BENEFICIARY_INTERNATIONAL_BANK_CONFIGURATION, params);
  }

  beneficiaryInternationalCountryBranch(productCode: string): Observable<beneficiaryInternationalCountryBranchResModel> {
    return this.get(Constants.BENEFICIARY_INTERNATIONAL_COUNTRY + productCode);
  }

  beneficiaryInternationalCurrency(params: string): Observable<beneficiaryInternationalCurrencyResModel> {
    return this.get(Constants.BENEFICIARY_INTERNATIONAL_CURRENCY + params);
  }

  beneficiaryInternationalNationalities(): Observable<beneficiaryInternationalNationalityResModel> {
    return this.get(Constants.BENEFICIARY_INTERNATIONAL_NATIONALITIES);
  }

  beneficiaryInternationalRelations(): Observable<beneficiaryInternationalNationalityResModel> {
    return this.get(Constants.BENEFICIARY_INTERNATIONAL_REALTIONS);
  }

  beneficiaryInternationalUpdateCountry(params: string): Observable<beneficiaryInternationalUpdateCountryResModel> {
    return this.get(Constants.BENEFICIARY_INTERNATIONAL_UPDATE_COUNTRY + params);
  }


  beneficiaryInternationalUpdateBankName(params: BranchNameModel): Observable<beneficiaryInternationalBranchNameListResModel> {
    return this.post(Constants.BENEFICIARY_INTERNATIONAL_UPDATE_BANK_NAME, params);
  }

  beneficiaryInternationalValidate(params: BeneficiaryInternationalAddV2RequestModel): Observable<beneficiaryWithinValidateRes> {
    return this.post(Constants.BENEFICIARY_INTERNATIONAL_VALID, params);
  }

  beneficiaryInternationalValidateAdd(): Observable<beneficiaryWithinValidateRes> {
    return this.get(Constants.BENEFICIARY_INTERNATIONAL_VALIDATE_ADD);
  }


  beneficiaryInternationalValidateAddV2(params: BeneficiaryInternationalAddV2RequestModel): Observable<beneficiaryWithinValidateRes> {
    return this.post(Constants.BENEFICIARY_INTERNATIONAL_VALIDATE_ADD_V2, params);
  }

  beneficiaryInternationalGetBankList(params: string): Observable<beneficiaryInternationalTransferBankResModel> {
    return this.get(Constants.BENEFICIARY_INTERNATIONAL_GET_BANK_LIST + params);
  }
}
