import { PaginationListReq } from "../pagination-list-req";

export class BeneficiariesReqModel extends PaginationListReq {
  passNumber?: string;
  name?: string;
  createDateFrom?: Date;
  createDateTo?: Date;
}