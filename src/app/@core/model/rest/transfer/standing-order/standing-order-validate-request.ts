export interface StandingOrderValidateRequest {
  accountNumberForm: string;
  accountNumberTo: string;
  amountType: string;
  beneficiaryAccount: string;
  beneficiaryId: string;
  bg: number,
  dateFrom: string,
  dateTo: string,
  dayMonth: number,
  name: string,
  onType1: boolean,
  onType2: boolean,
  orderType1: any,
  orderType2: 1 | 3 | 6 | 12,
  ownAccountsFlag: string,
  purpose: string,
  remarks: string
}
