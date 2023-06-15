export interface PrepareDrivingLicenseRequest {
  transactionType: string;
  serviceType: string;
  applicationType: string;
  accountNumber: string;
  beneficiaryId: string;
  licenseType: string;
  licenseDuration: string;
}

