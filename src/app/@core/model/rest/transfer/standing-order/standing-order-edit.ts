import {StandingOrder} from "./standing-order-list-res";

export interface StandingOrderEditValidateReq {
  standingOrderDetail: StandingOrder;
  dateTo: string,
  dateFrom: string
  amount:number,
  amountOption:string,
  dateMounth:string,
}

