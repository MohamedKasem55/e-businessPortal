import {Account} from "../../common/account";
import {CurrencyModel} from "../../common/currency.model";

export interface BeneficiaryModel {
  sessionInfo: any
  beneficiaryPk: any
  beneficiaryId: string
  ernumber: string
  beneficiaryIdErn: string
  name: string
  beneficiaryFamName: any
  type: string
  companyPk: number
  sequence: any
  beneficiaryAccountFrom: any
  beneficiaryAccount: Account
  beneficiaryLocalAccountNumber: any
  bankCode: string
  bankName: string
  bankAddress: any
  beneficiaryCA: any
  beneficiaryAmount: any
  beneficiaryCurrency: string
  zipCode: any
  poBox: any
  region: any
  city: any
  countryLabel?: string;
  erAmount: any
  erCurrency: any
  phoneNumber: any
  phoneInternationalCode: any
  phoneExtension: any
  email: string
  remarks: any
  beneficiaryAccountFromCode: any
  beneficiaryAccountCode: string
  selected: any
  account21length: any
  transferReason: any
  transferSavedRejected: any
  refuseLvl: any
  countryCodeBE: any
  countryCode: string
  beneficiaryCategory: any
  invoiceNumber: any
  itemDescription: any
  nationality: any
  address1: any
  addressNumber: any
  presetBeneficiaryCategory: any
  internationalTransferLimit: any
  beneficiaryFullName: string
  internationalBeneficiaryAccountsFrom: any
  placeBirth: any
  dateBirth: any
  mobileNo: any
  currencyDTO: CurrencyModel
  payCode: any
  transferReasonLbl: any
  additionalInfoFlag: any
  additionalInfo1Lbl: any
  additionalInfo2Lbl: any
  nickName: string
  beneficiaryType?:string
  documentId?:any
}
