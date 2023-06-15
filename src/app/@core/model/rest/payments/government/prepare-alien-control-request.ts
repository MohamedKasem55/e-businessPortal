export interface PrepareAlienControlRequest {
    transactionType: string;
    serviceType: string;
    applicationType: string;
    accountNumber: string;
    borderNumber?: string;
    iqamaId?: string;
    householdIdNumber?: string;
    numberDependant?: string;
    citizenId?: string;
    iqamaDuration?: string;
    visaNumber?: string;
    sponsorId?: string;
    jobCategory?: string;
    visaDuration?: string;
    day?: 0;
    month?: 0;
    year?: 0;
    associatedBorderNumber?: string;
}

