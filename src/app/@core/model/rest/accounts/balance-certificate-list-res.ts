export interface BalanceCertificateListRes {
  cetificates: BankCertificate[];
  size: number;
  total: number;
}

export interface BankCertificate {
  account: string;
  balanceCertificatePk: number;
  cic: string;
  city: string;
  company: string;
  postalCode: string;
  processDate: string;
  requestDate: string;
}
