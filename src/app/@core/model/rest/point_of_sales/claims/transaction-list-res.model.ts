export interface TransactionListResModel {
  listTrxvsMerchant: PagedResultsMerchantTrxnsLstItemTypeDSO;
}


export interface PagedResultsMerchantTrxnsLstItemTypeDSO {
  size?: number;
  total?: number;
  items?: any;
}
