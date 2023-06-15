import {BaseResponse} from "../../common/base-response";
import { AccountRulesModel } from "../../common/account-rules.model";
import { MandatoryFields } from "../../common/mandatory-fields.model";


export interface BeneficiaryInternationalBankBranchesDetailsResModel extends BaseResponse {
  mandatoryFields: MandatoryFields;
  corespondentBankLanguage: string;
  accountRules: AccountRulesModel;
  transferType: string;
}
