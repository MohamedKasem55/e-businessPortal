export interface ReasonsResModel {
    transferReasonsList: ReasonsModal[],
  }
  
  export interface ReasonsModal {
    additionalInfo1Ar: string,
    additionalInfo1En: string,
    additionalInfo2Ar: string,
    additionalInfo2En: string,
    additionalInfoFlag: string
    beneficiaryCategory: string,
    maximumAmount: number,
    minimumAmount: number,
    payType: string,
    purposeCode: string,
    purposeDescriptionAr: string,
    purposeDescriptionEn: string,
    purposeLimitId: number,
    remittanceCategory: string,
    transferReasonsAr: string,
    transferReasonsEn: string,
  }
  