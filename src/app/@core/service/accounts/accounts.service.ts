import {Injectable} from '@angular/core';
import {AbstractBaseService, ContextPath, RequestOption} from "../base/abstract-base.service";
import {AccountsConstants} from "./accounts-constants";
import {Observable} from "rxjs";
import {Account} from "../../model/rest/common/account";
import {AccountStatementReq} from "../../model/rest/accounts/account-statement-req";
import {AccountStatementRes} from "../../model/rest/accounts/account-statement-res";
import {HttpHeaders, HttpParams} from "@angular/common/http";
import {DocumentsListRes} from "../../model/rest/accounts/documents-list-res";
import {DocumentEligibilityRes} from "../../model/rest/accounts/document-eligibility-res";
import {CreateCustDocRequest} from "../../model/rest/accounts/create-cust-doc-request";
import {MonthlyStatementReq} from "../../model/rest/accounts/monthly-statement-req";
import {BalanceCertificateReq} from "../../model/rest/accounts/balance-certificate-req";
import {BalanceCertificateValidateReq} from "../../model/rest/accounts/balance-certificate-validate-req";
import {BalanceCertificateValidateRes} from "../../model/rest/accounts/balance-certificate-validate-res";
import {BalanceCertificateConfirmReq} from "../../model/rest/accounts/balance-certificate-confirm-req";
import {BaseResponse} from "../../model/rest/common/base-response";
import {StatementReq} from "../../model/rest/accounts/statement-req";
import {BalanceCertificateListRes} from "../../model/rest/accounts/balance-certificate-list-res";
import {SwiftInitRes} from "../../model/rest/accounts/swift-init-res";
import {SwiftDownloadReq} from "../../model/rest/accounts/swift-download-req";
import {RequestNewStatementReq} from "../../model/rest/accounts/request-new-statement-req";
import {BalanceCertificateApprovalReq} from "../../model/rest/accounts/user-approval/balance-certificate-approval-req";
import {BalanceCertificateApprovalRes} from "../../model/rest/accounts/user-approval/balance-certificate-approval-res";
import { CreateAccountReq, CreateAccountRes, EligibilityInquiry } from 'app/@core/model/rest/accounts/add-account-req';
import { AccountDetailsReq } from 'app/@core/model/rest/accounts/account-details-req';
import { AccountDetailsRes } from 'app/@core/model/rest/accounts/account-details-res';

@Injectable()
export class AccountsService extends AbstractBaseService {
  selectedRow!: Account

  /**
   * Accounts Statement
   * */
  getAccountStatement(req: AccountStatementReq): Observable<AccountStatementRes> {
    return this.post(AccountsConstants.ACCOUNTS_STATEMENT, req, {hideLoader: true});
  }

  sendStatementEmail(emailStatementReq: StatementReq): Observable<any> {
    return this.post(AccountsConstants.ACCOUNTS_STATEMENTS_SEND_DETAIL_PDF,
      emailStatementReq);
  }

  getStatementPDF(emailStatementReq: StatementReq): Observable<any> {
    return this.post(AccountsConstants.ACCOUNTS_STATEMENTS_SEND_DETAIL_PDF,
      emailStatementReq, {responseType: 'blob'});
  }

  getAccountStatementPDF(req: AccountStatementReq): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/pdf')
    const options: RequestOption = {customHeaders: headers, responseType: 'blob'}
    return this.post(AccountsConstants.ACCOUNTS_STATEMENT_PDF, req, options);
  }

  /**
   * Accounts
   * */

  /**
   * Online Documents
   * Start
   * */
  /**
   * Status
   *
   * reqState = 01 Approved
   * reqState = 02 Rejected
   * reqState = 03 Pending
   * reqState = 04 Expired
   * reqState = 05 Failed
   *
   * Docs
   *
   * docType = 02 Account Statement
   * docType = 01 Bank Certificate
   * docType = 05 IBAN Certificate
   * */
  getDocsList(params: any): Observable<DocumentsListRes> {
    let reqParams: RequestOption = {requestParams: params, hideLoader: true}
    return this.get(AccountsConstants.CUSTOMER_DOCS_List, reqParams);
  }

  getDocEligibility(docType: any): Observable<DocumentEligibilityRes> {
    return this.get(AccountsConstants.DOC_ELIGIBILITY + docType);
  }

  createCustomerDocs(createCustDocRequest: CreateCustDocRequest): Observable<BaseResponse> {
    return this.post(AccountsConstants.CREATE_CUST_DOC, createCustDocRequest);
  }

  downloadDocument(fileRef: string) {
    return this.get(AccountsConstants.GET_CUST_DOC + fileRef, {
      requestParams: new HttpParams().append("serviceType", "REQUEST_DOCUMENTS_ONLINE")
    })
      .subscribe({
        next: (res) => {
          const response = this.getDocument(res)
          const link = document.createElement("a");
          link.href = URL.createObjectURL(response);
          link.download = res.fileName;
          link.click();
          link.remove();
        },
        error: () => {
        }
      })
  }

  getDocument(data: any): Blob {
    const sliceSize = 512
    const byteCharacters = atob(data.fileContent)
    const byteArrays = []
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize)
      const byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      byteArrays.push(byteArray)
    }
    return new Blob(byteArrays, {type: data.mime})
  }

  /**
   * Online Documents
   * End
   * */

  /**
   * Monthly Statement
   * Start
   * */
  getMonthlyStatement(monthlyStatementReq: MonthlyStatementReq): Observable<any> {
    return this.post(AccountsConstants.MONTHLY_ACCOUNT_STATEMENTS, monthlyStatementReq, {hideLoader: true});
  }

  downloadMonthlyStatement(monthlyStatementReq: MonthlyStatementReq, open: boolean, fileExt: string) {
    this.post(AccountsConstants.DOWNLOAD_MONTHLY_ACCOUNT_STATEMENTS,
      monthlyStatementReq, {
        responseType: 'blob',
      }).subscribe((res) => {
      if (!open) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(res);
        link.download = 'monthly_statement.' + fileExt
        link.click();
        link.remove();
      } else {
        res = res.slice(0, res.size, "application/pdf")
        const fileURL = URL.createObjectURL(res);
        window.open(fileURL, '_blank');
      }
    });
  }

  /**
   * Monthly Statement
   * End
   * */

  /**
   * Requested Statement
   * start
   * */

  getRequestedStatement(monthlyStatementReq: MonthlyStatementReq): Observable<any> {
    return this.post(AccountsConstants.REQUESTED_ACCOUNT_STATEMENTS, monthlyStatementReq, {hideLoader: true});
  }

  downloadRequestedStatement(monthlyStatementReq: MonthlyStatementReq) {
    this.post(AccountsConstants.DOWNLOAD_REQUESTED_ACCOUNT_STATEMENTS, monthlyStatementReq,
      {responseType: 'blob'}).subscribe((res) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(res);
      link.download = monthlyStatementReq.parameter;
      link.click();
      link.remove();
    });
  }

  deleteRequestedStatement(file: any) {
    const data = {filenames: file}
    return this.delete(AccountsConstants.DELETE_REQUESTED_ACCOUNT_STATEMENTS, data);
  }

  /**
   * Requested Statement
   * end
   * */

  /**
   * Balance Certificate
   * Start
   * */
  getBalanceCertificatesList(BalanceCertificateReq: BalanceCertificateReq): Observable<BalanceCertificateListRes> {
    return this.post(AccountsConstants.BALANCE_CERTIFICATE_STATEMENTS, BalanceCertificateReq, {hideLoader: true});
  }

  validateBalanceCertificate(balanceCertificateValidateReq: BalanceCertificateValidateReq): Observable<BalanceCertificateValidateRes> {
    return this.post(AccountsConstants.BALANCE_CERTIFICATE_VALIDATE, balanceCertificateValidateReq);
  }

  getVatInvoice(month: string, year: string) {
    this.get(AccountsConstants.VAT_MONTHLY_REPORT + year + '/' + month,
      {responseType: 'blob'}).subscribe(async (res) => {
        if (res.type === "application/x-download") {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(res);
          link.download = month + '/' + year + '.zip';
          link.click();
          link.remove();
        }
      }
    );
  }

  /**
   * Balance Certificate
   * End
   * */

  /**
   * Vat Invoice
   * start
   * */
  confirmBalanceCertificate(balanceCertificateConfirmReq: BalanceCertificateConfirmReq): Observable<BaseResponse> {
    return this.post(AccountsConstants.BALANCE_CERTIFICATE_CONFIRM, balanceCertificateConfirmReq);
  }

  /**
   * Vat Invoice
   * End
   * */


  /**
   * Swift Statement
   *
   * */

  inItSwiftStatement(): Observable<SwiftInitRes> {
    return this.get(AccountsConstants.SWIFT_STATEMENTS_INIT);
  }

  getSwiftStatement(swiftDownloadReq: SwiftDownloadReq): Observable<string> {
    return this.post(AccountsConstants.SWIFT_STATEMENTS_DOWNLOAD, swiftDownloadReq);
  }

  /**
   * Request Statement
   * */

  requestNewStatement(newStatementReq: RequestNewStatementReq) {
    return this.post(AccountsConstants.REQUEST_NEW_STATEMENT, newStatementReq);
  }

  getBalanceCertificateUserApproval(balanceCertificateApprovalReq: BalanceCertificateApprovalReq): Observable<BalanceCertificateApprovalRes> {
    return this.post(AccountsConstants.BALANCE_CERTIFICATE_LIST,
      balanceCertificateApprovalReq, {hideLoader: true});
  }

  /**
   * nickname update
   * */

  updateNickNameUpdate(nickNameReq: Account):Observable<BaseResponse> {
    const listAccount = {
      listAccount: [nickNameReq],
    }
    return this.post(AccountsConstants.NICKNAME_UPDATE, listAccount);
  }

  /**
   * ADD Account
   * */

  getEligibilityInquiry(): Observable<EligibilityInquiry> {
    return this.get(AccountsConstants.ELIGIBILITY_INQUIRY, {
      requestParams: new HttpParams()
        .append('relationTypeCode', 'CUR')
        .append('subcategory', ''),
    });
  }

  getTermsCond(fileName: string) {
    const options: RequestOption = {
      contextPath: ContextPath.DOCUMENT_CONTEXT,
    };
    this.getFile(fileName, fileName, true, options);
  }

  validateAccount(addAcc: CreateAccountReq): Observable<CreateAccountRes> {
    return this.post(AccountsConstants.CREATE_VALIDATE, addAcc);
  }

  confirmAccount(addAcc: CreateAccountReq): Observable<CreateAccountRes> {
    return this.post(AccountsConstants.CREATE_CONFIRM, addAcc);
  }

  accountDetails(details: AccountDetailsReq): Observable<AccountDetailsRes>{
    return this.post(AccountsConstants.ACCOUNTS_STATEMENTS_DTLS, details);
  }
}
