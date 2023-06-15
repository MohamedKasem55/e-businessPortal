import {Batch} from "../../common/batchResponse";

export interface CreateChequesListRes {
  batchList: {
    items: ChequesBatchItem[]
    size: number;
    total: number;
  }
}

export interface ChequesBatchItem extends Batch{
  typeCheck: string;
}
