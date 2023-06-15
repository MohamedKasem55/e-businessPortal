import { Injectable } from '@angular/core';
import { AbstractBaseService, ContextPath, RequestOption } from '../../base/abstract-base.service';
import { Observable, map } from 'rxjs';
import { Constants } from './pos-service-urls';
import { RequestValidate } from 'app/@core/model/rest/common/otp.model';
import { environment } from 'environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { AttachementInfo } from '../../../model/rest/finance/pos/documents';
import { Accounts, DisbursmentDossier, productKey, reCalculate } from 'app/@core/model/rest/finance/pos/customerDetails';
import { MandatoryDocumentsResponse } from 'app/@core/model/rest/finance/request/mandatory-documents';
@Injectable()
export class PosService extends AbstractBaseService {
  constructor(private translateService: TranslateService) {
    super();
  }

  getCustomerData(productKey: string): Observable<Accounts> {
    return this.get(`${Constants.CUSTOMER_DATA}/${productKey}`);
  }

  public initiate(productCode: string): Observable<Accounts> {
    const data: productKey = { financeProductCode: productCode };
    return this.post(Constants.FINANCE_INITIATE, data);
  }

  public validateInitialOffer(
    requestValidate: RequestValidate,
    productCode: string
  ) {
    const data = {
      financeProductCode: productCode,
      requestValidate: {
        otp: requestValidate
      },
    };
    return this.post(Constants.FINANCE_VALIDATE_INITIAL_OFFER, data);
  }

  public confirmOpenDossier(data: any) {
    return this.post(Constants.CONFIRM_OPEN_DOSSIER, data);
  }

  convertFileToURL(file: File) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
    });
  }

  goToLink(doc: string) {
    let docURL =
      environment.baseUrl +
      environment.documentContext +
      doc +
      this.translateService.currentLang +
      '.pdf';
    window.open(docURL, '_blank');
  }

  getMandatoryDocs(productCode: string): Observable<MandatoryDocumentsResponse> {
    return this.get(Constants.MANDATORY_DOCS + productCode, {});
  }


  getPDFFile(fileName: string) {
    const options: RequestOption = { contextPath: ContextPath.DOCUMENT_CONTEXT }
    this.getFile(fileName, fileName, true, options)
  }

  public reCalculate(rePymtPeriod: string, requiredAmt: string, productCode: string) {
    const data: reCalculate = {
      financeProductCode: productCode,
      rePymtPeriod: rePymtPeriod,
      requiredAmt: requiredAmt,
    };
    return this.post(Constants.RE_CALCULATE, data);
  }

  public attachDocument(
    doessierId: string,
    documentCode: string,
    file: any,
    dataURL: any
  ) {
    let data: AttachementInfo = {
      doessierId: doessierId,
      documentCode: documentCode,
      fileName: file?.name,
      fileType: file?.type,
      fileContent: dataURL
    }
    return this.post(Constants.ATTACH_DOCUMENT, data);
  }


  /** execution */

  public getContractList(category: string) {
    return this.post(Constants.CONTRACT_LIST, { category })
  }

  public getContractDetails(dosierID: string) {
    return this.get(Constants.CONTRACT_DETAIL + '/' + dosierID)
  }

  public getInstallmentList(dosierID: string) {
    return this.get(Constants.GET_INSTALLMENT_LIST + '/' + dosierID)
  }

  public getTrackingDataInquiry(dosierID: string) {
    return this.get(Constants.GET_TRACKING_DATA + '/' + dosierID)
  }

  public rejectCreditLineDosier(dosierID: string) {
    return this.get(Constants.GET_REJECT_CREDIT_LINE_DOSIER + '/' + dosierID)
  }

  public openDisbursmentDossier(dossierID: string, financeProductCode: string, accountNumber: string) {
    const data: DisbursmentDossier = {
      dossierID: dossierID,
      financeProductCode: financeProductCode,
      accountNumber: accountNumber,
    }
    return this.post(Constants.OPEN_DISBURSMENT_DOSSIER, data)
  }

  public buyCommodity(dossierID: string, financeProductCode: string) {
    const data = {
      commidityRequest: {
        dossierID: dossierID,
        financeProductCode: financeProductCode,
      },
    }
    return this.post(Constants.BUY_COMMODITY, data)
  }

  public initiateSellCommodity() {
    return this.post(Constants.INITIATE_SELL_COMMODITY, {})
  }

  public getCommodityDetails(dossierID: string) {
    return this
      .get(Constants.GET_COMMODITY_DETAILS + '/' + dossierID)
  }

  public sellCommodity(dossierID: string, financeProductCode: string, otp: number) {
    const data = {
      commidityRequest: {
        dossierID,
        financeProductCode,
      },
      requestValidate: otp,
    }
    return this
      .post(Constants.SELL_COMMODITY, data)

  }

  public createSanadGroup(dossierId: string) {
    const data = {
      dossierId
    }
    return this.post(Constants.CREATE_SANAD_GROUP, data)
  }

  public setSanadPNCreation(dossierID: string, financeProductCode: string) {
    const data = {
      dossierID,
      financeProductCode,
    }
    return this
      .post(Constants.SET_SANAD_PN_CREATION, data)
  }


  public getPrintableDocuments(data: any) {
    return this.post(Constants.GET_PRINTABLE_DOCUMENTS, data);
  }

  public initiateDigitalSignature(digitalSignatureActions: string, identifier: string) {
    return this
      .post(Constants.DIGITAL_SIGNATURE,
        { digitalSignatureActions, identifier },
      )
  }
  public getDigitalSignatureStatus(bankTrxnRef: string) {
    return this
      .post(
        Constants.GET_DIGITAL_SIGNATURE_STATUS,
        { bankTrxnRef },
      )
  }
}
