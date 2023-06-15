export interface PrepareCivilRegistrationRequest {
    transactionType: string;
    serviceType: string;
    applicationType: string;
    accountNumber: string;
    nationalIdNumber: string;
    issuanceReason: string;
    cardVersionNumber: string;
    day?: string;
    month?: string;
    year?: string;
}
