import {Batch} from "../../common/batchResponse";

export interface StopChequesListRes {
  batchList: {
    items: ChequesBatchItem[]
    size: number;
    total: number;
  }
}

export interface ChequesBatchItem extends Batch{
  checkNumber: string;
  stopMode: string;
}
