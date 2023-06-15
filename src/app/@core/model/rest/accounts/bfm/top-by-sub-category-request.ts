import {BfmBaseRequest} from "./bfm-base-request";

export interface TopBySubCategoryRequest extends BfmBaseRequest {
    noOfSubCats: number;
    codes?: string;
}
