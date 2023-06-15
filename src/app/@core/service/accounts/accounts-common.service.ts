import {Injectable} from '@angular/core';
import {AbstractBaseService, ContextPath, RequestOption} from "../base/abstract-base.service";
import {AccountsReq} from "../../model/rest/accounts/accounts-req";
import {AccountsConstants} from "./accounts-constants";
import {Observable} from "rxjs";
import {AccountsRes} from "../../model/rest/accounts/accounts-res";
import {Account} from "../../model/rest/common/account";
import {BfmBaseRequest} from "../../model/rest/accounts/bfm/bfm-base-request";
import {BfmBalanceAndCashFlowResponse} from "../../model/rest/accounts/bfm/BfmBalanceAndCashFlowResponse";
import {ActualExpectedResponse} from "../../model/rest/accounts/bfm/ActualExpectedResponse";
import {SarAccountsRes} from "../../model/rest/accounts/sar-accounts-res";
import {POSMainAccountsRes} from 'app/@core/model/rest/accounts/pos-main-accounts-res';
import {TopByCategoryRequest} from 'app/@core/model/rest/accounts/bfm/top-by-category-request';
import {TopBySubCategoryRequest} from 'app/@core/model/rest/accounts/bfm/top-by-sub-category-request';
import {POSLocation} from 'app/@core/model/rest/accounts/bfm/p-o-s-location';
import {CategoryResponse} from 'app/@core/model/rest/accounts/bfm/category-response';
import { financialInstitutionOption, financialInstitutionRes } from 'app/pages/accounts/BFM/bfm-dashboard/bfm-dashboard-controls';

@Injectable()
export class AccountsCommonService extends AbstractBaseService {
  selectedRow!: Account

  /**
   * Accounts
   * */
  getAllEligibleAccounts(accountsReq: AccountsReq, hideLoader: boolean = false): Observable<AccountsRes> {
    return this.post(AccountsConstants.ACCOUNTS, accountsReq, {hideLoader});
  }

  getSarAccounts(): Observable<SarAccountsRes> {
    return this.get(AccountsConstants.SAR_ACCOUNTS);
  }

  /**
   * BFM
   * Start
   * This will fetch and store the value in session storage with key "JuridicalState" after login complete
   * to get the already fetched value please use sessionStorage.getItem("JuridicalState");
   * */

  getJuridicalState(): Observable<{ juridicalState: string }> {
    return this.get(AccountsConstants.JURIDICAL_STATUS);
  }

  getBalanceAndCashFlow(actualReq: BfmBaseRequest): Observable<BfmBalanceAndCashFlowResponse> {
    return this.post('balance-cashflow', actualReq, this.getRequestOptionsForBFM());
  }

  getActualExpected(actualReq: BfmBaseRequest): Observable<ActualExpectedResponse> {
    return this.post('actual-expected', actualReq, this.getRequestOptionsForBFM());
  }

  getTopByCategory(topByCategoryRequest: TopByCategoryRequest): Observable<CategoryResponse> {
    return this.post('top-by-category', topByCategoryRequest, this.getRequestOptionsForBFM());
  }

  getTopSubCategory(topBySubCategoryRequest: TopBySubCategoryRequest): Observable<CategoryResponse> {
    return this.post('top-subcats-by-category', topBySubCategoryRequest, this.getRequestOptionsForBFM())
  }

  getPOSLocation(posLocation: POSLocation): Observable<any> {
    return this.post('pos-by-location', posLocation, this.getRequestOptionsForBFM())
  }

  getRequestOptionsForBFM(): RequestOption {
    return {
      contextPath: ContextPath.BFM_CONTEXT,
      hideLoader: true,
      silentError: true,
    }
  }

  getPOSMainAccounts(): Observable<POSMainAccountsRes> {
    return this.get(AccountsConstants.MAIN_ACCOUNTS);
  }

  /**
   * BFM
   * End
   * */
  getFinancialInstitutions(){
    return this.post(AccountsConstants.FINANCIAL_INSTITUTIONS,{})
  }
  mapFinancialInstitutions(institutions:Array<financialInstitutionRes>,lang:string):Array<financialInstitutionOption>{
    console.log(lang);
    return institutions.map((institution:financialInstitutionRes)=>{
      return{
        value:institution.financialInstitutionId,
        key:lang=="ar"?institution.financialInstitutionName.nameAr:institution.financialInstitutionName.nameEn,
      }
    })
  }

  getDataGroupList(bankId:string){
    return this.post(AccountsConstants.DATA_GROUP,{"financialInstitutionId":bankId})
  }


}
