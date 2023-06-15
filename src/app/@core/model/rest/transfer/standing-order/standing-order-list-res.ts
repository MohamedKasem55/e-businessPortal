import {BeneficiaryModel} from "../beneficiary/beneficiary.model";
import {Batch} from "../../common/batchResponse";

export interface StandingOrderListRes {
  standingOrderList: StandingOrder []
}

export interface StandingOrder extends Batch{
  accountFrom: string;
  accountTo: string;
  orderCurrency: any;
  beneficiarySequence: string;
  ernumber: string;
  orderDate: string;
  orderType1: any;
  orderType2: string;
  dayOfMonth: string;
  calendarType: string;
  dateFrom: string;
  dateTo: string;
  paymentNum: string;
  successfulPaymentNumber: string;
  failedPaymentNumber: string;
  option: any;
  orderPurpose: string;
  orderFrequency: any;
  mandateNumber: string;
  lastPaymentDate: any;
  nextPaymentDate: string;
  amountOption: string;
  totalAmountPaid: number;
  lastPaymentStatus: string;
  beneficiaryData: BeneficiaryModel
}

export interface StandingOrderBatch extends Batch {
  accountFrom: string;
  accountTo: string;
  orderCurrency: any;
  beneficiarySequence: string;
  ernumber: string;
  orderDate: string;
  orderType1: any;
  orderType2: string;
  dayOfMonth: string;
  calendarType: string;
  dateFrom: string;
  dateTo: string;
  paymentNum: string;
  successfulPaymentNumber: string;
  failedPaymentNumber: string;
  option: any;
  orderPurpose: string;
  orderFrequency: any;
  mandateNumber: string;
  lastPaymentDate: any;
  nextPaymentDate: string;
  amountOption: string;
  totalAmountPaid: number;
  lastPaymentStatus: string;
  beneficiaryData: BeneficiaryModel
}
