import { SwiftCodeModel } from "../../common/swift-code.model";
import {BaseResponse} from "../../common/base-response";

export interface beneficiaryInternationalBranchNameListResModel extends BaseResponse {
  branchNameList: SwiftCodeModel[];
}
