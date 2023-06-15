import {Account} from "../../../model/rest/common/account";
import {ResponseGenerateChallenge} from "../../../model/rest/common/base-response";
import {BulkPaymentsParametersDto} from "../../../model/rest/company-admin/fees-management/fees-management-res";

export interface ResponseBulkPaymentsDetails {

  errorCode?: string;
  errorDescription: string;
  generateChallengeAndOTP?: ResponseGenerateChallenge;
  bulkPaymentsParameters?: BulkPaymentsParametersDto;
  accountList?: Account[];
  accountInitiateFlag?: boolean,
  forceSelect?: boolean,
}
