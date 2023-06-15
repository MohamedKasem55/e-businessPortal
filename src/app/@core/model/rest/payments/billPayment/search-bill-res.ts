export interface SearchBillRes {
  billCodesList: BillCodesList
}

export interface BillCodesList {
  billCodesCategorizedList: BillCodesCategorizedList[]
  billsList: BillCodes[]
}

export interface BillCodesCategorizedList {
  billCodes: BillCodes[]
  category: Category
}

export interface Category {
  categoryAr: string
  categoryEn: string
}

export interface BillCodes {
  add: boolean
  addDescriptionAr: string
  addDescriptionEn: string
  advanced: boolean
  applyVat?: string
  billCode: string
  categoryAr: string
  categoryEn: string
  delete: boolean
  detailsDescriptionAr: string
  detailsDescriptionEn: string
  inquiry: boolean
  logoContent: string[]
  logoType: string
  maxlength: number
  over: boolean
  partial: boolean
  pay: boolean
  paysave: boolean
  save: boolean
  status: boolean
}
