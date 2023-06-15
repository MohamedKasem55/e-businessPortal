export interface AccountsReq {
  page?: number | null;
  rows?: number | null;
  txType?: "ECAL" | "ECIA";
  order?: string;
  orderType?: string;
  branchid?: string,
  currency?: string,
  search?: boolean,
  accountNickname?: string,
  accountNumber?: string,
  searchByPrivilege?: boolean,
  privilege?: string[] | null,
  serviceActive?: boolean,
  status?: string,

}
