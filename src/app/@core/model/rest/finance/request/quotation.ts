import { ErrorResponse } from '../../common/base-response';
import { GenerateChallengeAndOTP } from '../../common/otp.model';
export interface QuotationForm {
  index: number;
  type: 'quotation' | 'purpose';
  quotationParentIndex?: number;
  quotationNum?: number;
  quotationFile?: QuotationDoc;
  purposes?:any
  quotationType?: 'External' | 'Internal',
  quotationDate?:string
  documentsInfo?:QuotationDoc | null
}


export interface QuotationDoc {
  doessierId?: string;
  documentCode: string;
  description: string;
  fileName: string;
  fileType: string;
  fileContent: string | ArrayBuffer | null;
  parentIndex?: number;
}

export interface VehicleResponse {
  errorCode: string;
  errorDescription: string;
  errorResponse: ErrorResponse;
  generateChallengeAndOTP: string | null;
  lengthOfBusiness: string | number | null;
  maxCarsAllowedNum: string | number | null;
  maxFinanceAmt: string | number | null;
  maxFinanceTenure: string | number | null;
  maxPmtFrequency: string | number | null;
  maxProfitRate: string | number | null;
  minAdminFeeAmt: string | number | null;
  minBallonPmt: string | number | null;
  minDownPmt: string | number | null;
  minFinanceAmt: string | number | null;
  requiredGracePeriod: string | number | null;
  requiredSFA: boolean;
  vehiclesLstItem:VehicleItem[]
}
export interface VehicleItem {
  brandName: string;
  dealerName: string;
  modelName: string;
  modelYear: string;
  price: string| number;
  vehicleSegment: string;
  vehicleVariant: string;
}

export interface QuotationDataTable{
  quotationName:string,
  type:string,
  quotationValue:number,
  carQuantity:number
}

export interface StaticPurposeValues{
  campaign:string,
  vehicleType: string,
  gracePeriod: string,
  gracePeriodType: string,
  profitRate: number,
  pmtFrequency: string,
  ballonPmt: number,
}
export interface StaticQuotationValues{
  quotationType: string,
  quotationNum: number,
  quotationDate: string,
  documentInfo?: string | null,
  purposes:Purpose[]
}

export interface Quotation {
  index?: number
  type?: string
  quotationNum: number
  purposes: Purpose[]
  quotationType: string
  quotationDate: string
  documentsInfo: DocumentsInfo | null
}

export interface Purpose {
  purposeOfUse: string
  brandName: string
  modelName: string
  vehicleVariant: string
  modelYear: string
  vehiclesNum: string
  tenure: string
  downPmt: string
  vehiclePrice: string
  purposeValue: number
  vehicleColor: string
  dealerName: string
  fileInfo?: any
  documentsInfo: string
  campaign: string
  vehicleType: string
  gracePeriod: string
  gracePeriodType: string
  profitRate: number
  pmtFrequency: string
  ballonPmt: number,
  price?:number
}


export interface DocumentsInfo {
  documentCode: string
  description: string
  fileName: string
  fileType: string
  fileContent: string
  parentIndex?: number
}

export interface QuotationTableData {
  qutationName?: string
  type?: string
  quotationValue: number
  carQuantity: number
  index?: number
}


export interface DefaultValuesResponse {
  errorCode: string
  errorDescription: string
  errorResponse: ErrorResponse
  generateChallengeAndOTP: GenerateChallengeAndOTP
  requiredSFA: boolean
  vehiclesLstItem: VehicleItem[]
  lengthOfBusiness: string
  maxCarsAllowedNum: string
  maxPmtFrequency: string
  maxFinanceAmt: string
  maxFinanceTenure: string
  maxProfitRate: string
  minAdminFeeAmt: string
  minBallonPmt: string
  minDownPmt: string
  minFinanceAmt: string
  requiredGracePeriod: string
}
export interface DefaultValuesRequest{
  brandName: string
  modelName: string
  purpose: string
  variant: string
}
export interface UploadCustomerQuotation{
  dossierId:string,
  quotations:Quotation[]
}
export interface QuotationResponse {
  errorCode: string
  errorDescription: string
  errorResponse: ErrorResponse
  generateChallengeAndOTP: GenerateChallengeAndOTP
}


