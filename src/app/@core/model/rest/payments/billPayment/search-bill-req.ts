import {PaginationListReq} from "../pagination-list-req";

export class SearchBillReq extends PaginationListReq{
  searchBillCode?:string;
  searchBillRef?:string;
  searchNickname?:string;
  searchDateFrom?:Date;
  searchDateTo?:Date;
  searchAmountFrom?:number;
  searchAmountTo?:number;
}
