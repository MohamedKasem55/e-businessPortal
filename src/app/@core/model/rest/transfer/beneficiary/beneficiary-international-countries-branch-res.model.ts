import { CountryModel } from "../../common/country.model";
import {BaseResponse} from "../../common/base-response";

export interface beneficiaryInternationalCountryBranchResModel extends BaseResponse {
  countries: CountryModel;
}
