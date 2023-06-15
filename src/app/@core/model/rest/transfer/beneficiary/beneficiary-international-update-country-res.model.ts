
import { SwiftCodeModel } from "../../common/swift-code.model";
import {BaseResponse} from "../../common/base-response";

export interface beneficiaryInternationalUpdateCountryResModel extends BaseResponse {
    currencyList: any[];
    swiftCodeList: SwiftCodeModel[];
    distinctBankNameList: SwiftCodeModel[];
}
