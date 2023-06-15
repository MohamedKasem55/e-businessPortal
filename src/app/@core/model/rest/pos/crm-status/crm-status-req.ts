export interface CrmStatusReq {
    ticketNumber: string | "",
    type: string | "",
    dateFrom: string | null,
    dateTo: string | null,
    order: "initiationDate",
    orderType: "desc",
    page: number,
    rows: number
}
