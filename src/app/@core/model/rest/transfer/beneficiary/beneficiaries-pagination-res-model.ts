import {PaginationModel} from "../../common/pagination.model";
import {Batch} from "../../common/batchResponse";

export interface beneficiaryPaginationRes extends PaginationModel {
   items: Batch;
}
