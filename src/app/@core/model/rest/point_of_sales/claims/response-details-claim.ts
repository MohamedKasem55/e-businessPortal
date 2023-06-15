import {HostRequestDTO} from "../../common/batchResponse";
import {BatchSecurity} from "../../payments/billPayment/bill-payment-validate-res";

export interface ResponseDetailsClaimPosManagement {
  batchList?: PagedResultsPosClaimBatchDSO;

}

export interface PagedResultsPosClaimBatchDSO {

  size?: number;
  total: number;
  items?: PosClaimBatchDSO[];

}

export interface PosClaimBatchDSO {

  size?: number;
  total?: number;
  batchPk?: number;
  type?: string;
  status?: string;
  accountNumber?: string;
  accountAlias?: string;
  rejectedReason?: string;
  initiationDate?: string;
  hostRequest?: HostRequestDTO;
  nextStatus?: string;
  securityLevelsDTOList?: BatchSecurity[];
  futureSecurityLevelsDTOList?: BatchSecurity[];
  beStatus?: string
  cic?: string
  parentBatchFk?: number;
  terminalNumber?: string;
  transactionAmount?: number;
  reconciliationAmount?: number;
  transactionDate?: string;
  mobile?: string;
  systemFileName?: string;
  ticketNumber?: string;
  statusTicket?: string;
  cdError?: string;
  amount?: number;
  pdfSecurityLevelsDTOList?: BatchSecurity[];
  futureStatus?: string;
}
