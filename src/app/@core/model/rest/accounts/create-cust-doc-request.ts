export interface CreateCustDocRequest {

  acctNum: string,
  docType: string,
  language: string,

  //docType 01
  amt?: {
    amount: 0,
    currency: "608"
  },
  balanceDate?: string,
  reportedBalance?: true,
  nameOfCertificate?: string

  //docType 02
  fromDate?:string;
  toDate?:string;
  isHijriDate?:boolean;
}
