import {BfmBaseRequest} from "./bfm-base-request";

export interface TopByCategoryRequest extends BfmBaseRequest {
    noOfCats: number
}
