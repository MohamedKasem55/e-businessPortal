export interface PrepaidRequestNewValidateReqModel {
  prepaidCardsRequestNewDSO: PrepaidCardsRequestNewDSO
}

export interface  PrepaidCardsRequestNewDSO {
  accountNumber: string
  countryCode: string
  nationalId: string
  mobileNumber: string
  nationality: string
  firstName: string
  lastName: string
  gender: string
  birthDate: string
  city: string
  companyEmbossingName: string
  ownerEmbossingName: number
  requesterType: string
}