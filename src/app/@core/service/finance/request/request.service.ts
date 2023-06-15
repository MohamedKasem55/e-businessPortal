import { Injectable } from '@angular/core';
import { FinanceProductCode } from 'app/@core/model/rest/finance/request/products-codes';
import { AbstractBaseService, RequestOption, ContextPath } from '../../base/abstract-base.service';
import { Observable } from 'rxjs';
import { Constants } from './request-service-urls';
import { Branch, BranchResponse, } from '../../../model/rest/finance/request/branch';
import { map } from 'rxjs/operators';
import { TrackApplication, DocumentList } from '../../../model/rest/finance/request/track-application';
import { OpenDOSSIERREQ, CustomerBusinessDetailsRes, OpenDossierRes } from '../../../model/rest/finance/request/business-details';
import { IvrRequest } from "../../../model/rest/finance/request/IvrRequest";
import { IvrRes } from "../../../model/rest/finance/request/IvrRes";
import { IvrStateRes } from "../../../model/rest/finance/request/IvrStateRes";
import { IvrStateRequest } from "../../../model/rest/finance/request/IvrStateRequest";
import { FinalAgreementAcceptance, FinalAgreementResponse } from '../../../model/rest/finance/request/final-agreement';
import { DefaultValuesRequest, Quotation, DocumentsInfo, QuotationDoc, UploadCustomerQuotation, QuotationResponse, VehicleResponse, DefaultValuesResponse } from '../../../model/rest/finance/request/quotation';
import { CustomerDataRes } from '../../../model/rest/finance/request/customer-data';
import { preliminaryCheck } from '../../../model/rest/finance/request/preliminaryCheck';
import { MandatoryDocumentsResponse } from '../../../model/rest/finance/request/mandatory-documents';
import { Utils } from '../../../utility/Utils';
import { FinalOfferResponse } from '../../../model/rest/finance/request/final-offer';
import { PrintableDocReq } from '../../../model/rest/finance/request/printable-doc';
import { InitOfferRes } from 'app/@core/model/rest/finance/request/initial-offer';
import { InstallmentListResponse } from 'app/@core/model/rest/finance/request/installment';
@Injectable()

export class RequestService extends AbstractBaseService {
  applicationTrackData: TrackApplication = {} as TrackApplication;
  DossierStatus = new Map<string, string>([
    ['BDS', 'finance.fleet.description.vehiclesQuotations'],
    ['UFQ', 'finance.fleet.description.uploadDocs'],
    ['RDU', 'finance.fleet.description.initialOfferRev'],
    ['UAP', 'finance.fleet.description.applicationRevision'],
    ['PEN', 'finance.fleet.description.applicationUnderProcess'],
    ['FOA', 'finance.fleet.description.offerApproved'],
    ['FOI', 'finance.fleet.description.finalOfferApprove'],
    ['PDC', 'finance.fleet.description.Expand'],
    ['CLS', 'finance.fleet.description.dossierMovedToCurrent'],
    ['RJC', 'finance.fleet.description.rejectedORCanceled'],
    ['IVC', 'finance.fleet.description.secondIVR'],
    ['DDW', 'finance.fleet.description.contractRevision'],
    ['DBD', 'finance.fleet.description.sanadAcceptance'],
    ['DFP', 'finance.fleet.description.sanadApproval'],
    ['CLS', 'finance.fleet.description.applicationCompleted'],
    ['', 'finance.fleet.description.pending'],
    ['APS', 'finance.fleet.description.vehiclesDelivery'],

  ])

  get TrackApplicationData():TrackApplication {
    return this.applicationTrackData
  }

  mandatoryDocs(): Observable<MandatoryDocumentsResponse> {
    const data = {
      financeProductCode: FinanceProductCode.FLEET,
    };
    return this.post(Constants.MANDATORY_DOCS, data);
  }

  getCustomerFinalOfferInq(data: {dossierId:string}): Observable<FinalOfferResponse> {
    return this.post(Constants.FINAL_OFFER, data)
  }

  setFinalAgreementAcceptance(data: FinalAgreementAcceptance): Observable<FinalAgreementResponse> {
    return this.post(`${Constants.FINAL_AGREEMENT_ACCEPTANCE}/${data.dosierID}`, data?.body)
  }

  getCustomerData(productKey: string): Observable<CustomerDataRes> {
    return this.get(`${Constants.CUSTOMER_DATA}/${productKey}`)
  }


  getFilteredRequiredDocs(documentsLst: DocumentList[]) {
    return documentsLst.filter((elm) => elm.approvedDoc === false)
  }

  getContractList(data: {category:string} | string) {
    return this.post(Constants.CONTRACT_LIST, data)
  }

  initiateIvrCall(ivrData: IvrRequest): Observable<IvrRes> {
    return this.post(Constants.DIGITAL_SIGNATURE_INIT, ivrData)
  }



  digitalSignatureStatus(ivrData: IvrStateRequest): Observable<IvrStateRes> {
    return this.post(Constants.DIGITAL_SIGNATURE_STATUS, ivrData)
  }

  getCustomerBusinessDetails(): Observable<CustomerBusinessDetailsRes> {
    const data:{financeProductCode:string} = {
      financeProductCode: FinanceProductCode.FLEET,
    };
    return this.post(Constants.BUSINESS_DETAILs, data);
  }

  getPrintableDoc(data: PrintableDocReq): Observable<Blob> {

    return this.post(Constants.PRINTABLE_DOCUMENT, data);
  }

  getTrackingDataInquiry(dossierId: string): Observable<TrackApplication> {
    const data = {
      dossierId: dossierId,
    };
    return this.post(Constants.TRACKING_DATA_INQUIRY, data);
  }

  setTrackApplicationData(trackApplication: TrackApplication) {
    this.applicationTrackData = trackApplication
  }

  openDossier(BusinessDetails: OpenDOSSIERREQ):Observable<OpenDossierRes> {
    return this.post(Constants.OPEN_DOSSIER, BusinessDetails)
  }

  getBrands():Observable<VehicleResponse>{
    return this.post(Constants.BRANDS, {})
  }

  getModelsByBrandName(brandName: string):Observable<VehicleResponse> {
    return this.post(Constants.MODELS, { brandName: brandName })
  }

  getVariantByBrandAndModel(brandName: string, modelName: string):Observable<VehicleResponse> {
    return this.post(Constants.VARIANT, {
      brandName: brandName,
      modelName: modelName,
    })
  }

  getDefaultValues(body: DefaultValuesRequest):Observable<DefaultValuesResponse> {
    return this.post(Constants.DEFAULT_VALUES, body)
  }

  getDealers():Observable<VehicleResponse> {
    return this.post(Constants.DEALERS, {})
  }

  uploadCustomerQuotation(quotation: UploadCustomerQuotation):Observable<QuotationResponse> {
    return this.post(Constants.UPLOAD_QUOTATION, quotation)
  }

  uploadQuotationFile(quotationFile: QuotationDoc) {
    return this.post(Constants.UPLOAD_QUOTATION_FILE, quotationFile)
  }

  getInitialOffer(data: {"dossierId": "string"}):Observable<InitOfferRes> {
    return this.post(Constants.INITIAL_OFFER, data);
  }
  getInstallmentList(dossierId: string): Observable<InstallmentListResponse> {
    return this.post(Constants.INSTALLMENT_LIST, { dossierId: dossierId });
  }

  convertFileToURL(file: File) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        resolve(reader.result)
      }
    })
  }

  getDossierStatus(statusCode: string) {
    return this.DossierStatus.get(statusCode)
  }
   getContractDetails(data:{dosierID:string,financeProductCode:string | null}) {
    return this.get(`${Constants.CONTRACT_DETAILS}${data.dosierID}?financeProductCode=${data?.financeProductCode}`);
  }

  validateEligibility(): Observable<preliminaryCheck> {
    const data = {
      financeProductCode: FinanceProductCode.FLEET,
      resendOTP: true,
    };
    return this.post(Constants.VALIDATE_ELIGIBILITY, data);
  }

  getMandatoryDocs(): Observable<MandatoryDocumentsResponse> {

    return this.get(Constants.MANDATORY_DOCS + FinanceProductCode.FLEET, {});
  }

  getAllBranches() {
    const data = {
      name: 'allBranches',
    };
    return this.post(Constants.BRANCHES_LIST, data).pipe(
      map((response: BranchResponse) => {
        if (!response.props) {
          return [];
        } else {
          return Utils.getModelList(response.props);
        }
      })
    );
  }

  uploadDocument(doessierId: string, documentCode: string, file: File, dataURL: any, newFileName?: string) {
    let data = {
      doessierId: doessierId,
      documentCode: documentCode,
      fileName: (newFileName ? newFileName : file?.name),
      fileType: file?.type,
      fileContent: dataURL,
    }
    return this.post(Constants.ATTACH_DOCUMENT, data);

  }

  getDocument(fileName: string) {
    const options: RequestOption = {contextPath: ContextPath.DOCUMENT_CONTEXT}
    this.getFile(fileName,fileName,true, options)
  }
  removeFleetSessionCache() {
    sessionStorage.removeItem("InQuotations")
    sessionStorage.removeItem("ExQuotations")
    sessionStorage.removeItem("businessDetails")
    sessionStorage.removeItem("documentUploadedVal")
    sessionStorage.removeItem("quotationDetails")
    sessionStorage.removeItem("amtDetails")
    sessionStorage.removeItem("accountNum")
    sessionStorage.removeItem("fleetLimit")
    sessionStorage.removeItem("dossairID")
  }
  removeFleetSessionDB() {
    sessionStorage.removeItem("InQuotations")
    sessionStorage.removeItem("ExQuotations")
    sessionStorage.removeItem("businessDetails")
    sessionStorage.removeItem("documentUploadedVal")
    sessionStorage.removeItem("quotationDetails")
    sessionStorage.removeItem("amtDetails")
    sessionStorage.removeItem("accountNum")
    sessionStorage.removeItem("dossairID")
  }
}
