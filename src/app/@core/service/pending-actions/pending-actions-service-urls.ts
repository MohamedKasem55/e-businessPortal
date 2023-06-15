import {callback} from "chart.js/helpers";

export class PendingActionsConstants {
  static COUNTERS = 'pendingActions/counters';
  static VALIDATE_USER = 'login/validUser';
  static USERACCOUNTS = 'workflow/accounts/getUserAccounts';
  static USERACCOUNTSLEVELS = 'workflow/accounts/getUserLevels';
  static USERNONFINANCIALLEVELS = 'workflow/nonFinancial/getUserLevels';
  static  IVR_REQUEST_STATUS= 'callback/{{id}}/requestStatus';
}
