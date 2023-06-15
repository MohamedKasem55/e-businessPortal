export interface CrmStatusRes {
    batchList: {
        items: StatusItem[],
        size: number,
        total: number
    }
}

export interface StatusItem {
    ticketNumber: string;
    initiationDate: string;
    posCRMStatusType: string;
    statusTicket: string;
    typeRequest: string;
    terminalNumber:string;
    city:string,
    contactName:string;
    mobile:string;
    
}
