export interface HajjUmrahUserApprovalReq {
  page: number;
  rows: number;
  order: string;
  orderType: string;
  passportNumber?: string;
  visaNumber?: string;
  cardNumber?: string;
  operationNumber?: number;
}
