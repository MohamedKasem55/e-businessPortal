import { FutureSecurityLevelsDtolist, HostRequestDTO } from "../../common/batchResponse";
import { GenerateChallengeAndOTP } from "../../common/otp.model";
import { BatchSecurity } from "../../payments/billPayment/bill-payment-validate-res";
import { ErrorServiceResponse } from "../../pos/pos-analytics-req/analytics-res";


export interface ResponseNewRewquestListRequestStatusPosManagement {
  
  errorCode?: string,
  errorDescription?: string,
  errorResponse?: ErrorServiceResponse;
  generateChallengeAndOTP?: GenerateChallengeAndOTP;
  posRequestBatchList?: PagedResultsPosMaintenanceBatchDSO;
  }

  export interface PagedResultsPosMaintenanceBatchDSO {

  size?:	number;
  total?:	number;
  items?: PosMaintenanceBatchDSO[];
  }

  export interface PosMaintenanceBatchDSO {

  batchPk?:	number;
  type?:	string;
  status?:	string;
  accountNumber?:	string;
  accountAlias?:	string;
  rejectedReason?:	string;
  initiationDate?:	string;
  hostRequest?: HostRequestDTO;
  nextStatus?:	string;
  securityLevelsDTOList?: [BatchSecurity],
  futureSecurityLevelsDTOList?: [BatchSecurity],
  beStatus?:	string
  cic?:	string
  parentBatchFk?:	number;
  typeRequest?:	string
  mobile?:	string
  city?:	string
  terminalNumber?:	string
  contactName?:	string
  branch?:	string
  ticketNumber?:	string
  statusTicket?:	string
  cdError?:	string;
  systemFileName?: string;
  amount?:	number;
  pdfSecurityLevelsDTOList?: [BatchSecurity],
  futureStatus?: string


  }