export interface PrepareTrafficViolationsRequest {
    transactionType: string;
    serviceType: string;
    applicationType: string;
    accountNumber: string;
    violationId: string;
    violatorId: string;
}

