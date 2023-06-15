import { KeyValueModel } from "../../common/key-value.model";
import {BaseResponse} from "../../common/base-response";

export interface beneficiaryInternationalNationalityResModel extends BaseResponse {
  valueList: KeyValueModel[];
}
