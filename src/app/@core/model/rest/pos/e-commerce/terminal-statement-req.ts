import { FileDownloadData } from './terminal-statement-res';
import { TerminalItem } from './terminals-list-res';

export interface SearchTerminalStatementReq {
  page?: number;
  rows?: number;
  orderBy?: string;
  asc?: string;
  sort?: string;
  region?: string;
  city?: string;
  accountNumber?: string;
  terminalId?: string;
  terminalName?: string;
  location?: string;
  phone?: string;
  mobile?: string;
  fax?: string;
  allTerminals: boolean;
}

export interface SearchTerminalCombinedFileReq {
  dateFrom: string;
  dateTo: string;
  period: string;
  allTerminals: boolean;
  selectedTerminals?: TerminalItem[];
}

export interface TerminalStatementDownloadReq {
  periodStr: string;
  downloadFiles: FileDownloadData[];
}

export interface Period {
  key: string;
  value: string;
}
