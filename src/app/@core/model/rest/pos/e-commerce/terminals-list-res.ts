export interface TerminalsListRes {
  terminalOutputDto: TerminalOutputDto;
  accountListPos?: AccountListPos[];
}

export interface TerminalOutputDto {
  size: number;
  total: number;
  items: TerminalItem[];
}

export interface TerminalItem {
  hashCode?: number;
  posTerminalPk?: number;
  terminalId?: string;
  name?: string;
  region?: string;
  city?: string;
  location?: string;
  location2?: string;
  account?: string;
  telephone?: string;
  mobile?: string;
  fax?: string;
  email?: string;
  pobox?: string;
  zipCode?: string;
  cityCode?: string;
}

export interface AccountListPos {
  erNumber?: string;
  modified?: boolean;
  accountPk?: number;
  alias?: string;
  companyPk?: number;
  branchid?: string;
  branchName: string;
  typeAccount?: string;
  code000?: string;
  currency?: string;
  checkDigit?: string;
  numberAccount: string;
  availableBalance: number;
  ledgerBalance?: number;
  status?: string;
  exchangeRate?: number;
  availableSarBalance?: number;
  ibanNumber: string;
  txAccountString?: string;
  unclearedBalance?: number;
  ccdmAlias?: string;
  accountLevels?: boolean[];
  inquiry?: boolean;
  dashboard?: boolean;
  payment?: boolean;
  typeFunction?: string;
  logoType?: string;
  accountLogoUrl?: string;
  fullAccountNumber: string;
  account18Length?: string;
}
