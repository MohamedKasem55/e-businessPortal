export interface PrepareCivilDefenseViolationsRequest {
  transactionType: string;
  serviceType: string;
  applicationType: string;
  accountNumber: string;
  violatorId: string;
  veredictNumber?: string;
}


