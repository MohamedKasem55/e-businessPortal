import { SecurityDetail } from "../../common/security-detail.model";

export interface CardsUserApprovalRes {
    businessCardsPagedResults: {
        items: BusinessCardsItem[]
        size: number;
        total: number;
    }
}

export interface BusinessCardsItem {
    batchPk: number;
    accountAlias: string;
    beStatus: string;
    accountNumber: string;
    cardId: string;
    cardAccountNumber: string;
    cardAccountSeqNumber: string;
    amount: string;
    futureSecurityLevelsDTOList?: any;
    futureStatus: string;
    hostRequest: string;
    initiationDate: Date;
    nextStatus: string;
    paymentOption: string;
    pdfSecurityLevelsDTOList: SecurityDetail[];
    rejectedReason?: any;
    returnCode: string;
    securityLevelsDTOList: SecurityDetail[];
    status: string;
    type: string;
}
