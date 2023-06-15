
export interface RegisterInterestReq {
  product: ProductType
  orgName: string
  orgId: string
  region: RegionType
  city: string
  yearlyIncome: string
  contactName: string
  contactMobile: string
  contactEmail: string
  bestTimeToCall: string
}

export enum ProductType {
  B2B='B2B', ECOMMERCE='ECOMMERCE', CASH24='CASH24', CASH_DEPOSIT_MACHINES='CASH_DEPOSIT_MACHINES', CASH_PICK_UP='CASH_PICK_UP',
  POS='POS', DIVIDEND_DISTRIBUTION='DIVIDEND_DISTRIBUTION', CREDIT_CARDS='CREDIT_CARDS', PAYROLL_CARDS='PAYROLL_CARDS',
  E_PREPAID_CARDS='E_PREPAID_CARDS', VIRTUAL_ACCOUNT='VIRTUAL_ACCOUNT', ESCROW_ACCOUNT='ESCROW_ACCOUNT', PAYROLL='PAYROLL'
}

export enum RegionType {
  CENTRAL='CENTRAL', EASTERN='EASTERN', WESTERN='WESTERN'
}
