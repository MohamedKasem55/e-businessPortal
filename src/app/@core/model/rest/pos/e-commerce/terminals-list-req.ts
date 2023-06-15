import { TerminalItem } from './terminals-list-res';

export interface RequestSearchTerminals {
  page?: number;
  rows?: number;
  order?: string;
  orderType?: string;
  region?: string;
  city?: string;
  accountNumber?: string;
  terminalId?: string;
  terminalName?: string;
  location?: string;
  phone?: string;
  mobile?: string;
  fax?: string;
  allTerminals?: boolean;
}

export interface Region {
  key: string;
  value: string;
}

export interface SearchTerminalStatementsReq {
  dateFrom: string;
  dateTo: string;
  period: string;
  allTerminals: boolean;
  selectedTerminals?: TerminalItem[];
}
