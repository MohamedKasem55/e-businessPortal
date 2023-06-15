import {BaseResponse} from "../../common/base-response";

export interface IpsPaymentOrderConfigRes extends BaseResponse{
  maxQTL: string,
  maxPTL: string,
  stl: string,
  qtl: string
}

