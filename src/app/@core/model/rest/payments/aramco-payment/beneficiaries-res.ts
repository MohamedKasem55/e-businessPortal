export interface BeneficiariesResModel {
  listBeneficiary: {
    items: BeneficiaryItem[],
    size: number,
    total: number
  }
}

export interface BeneficiaryItem  {
  error?: string;
  customerId: string;
  customerName: string;
}


