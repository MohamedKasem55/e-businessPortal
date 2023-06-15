export interface BeneficiaryInternationalBankConfReqModel {
  productType: string;
  serviceType: string | null;
  country: string;
  currency: string;
  bankCode: string;
  juridicalStatus: string;
  bankSwiftCode: string;
  corespondentBankLanguage: string;
}