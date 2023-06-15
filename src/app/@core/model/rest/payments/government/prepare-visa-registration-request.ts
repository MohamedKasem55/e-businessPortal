export interface PrepareVisaRegistrationRequest {
    transactionType: string;
    serviceType: string;
    applicationType: string;
    accountNumber: string;
    sponsorId: string;
    numberOfVisas: string;
    visaType?: string;
}
