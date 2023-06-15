export class Constants {

  //LIST
  static BENEFICIARIES = 'beneficiaries';
  static FILL_BENEFICIARIES = 'beneficiaries/fillBeneficiaries';


  // WITHIN
  static BENEFICIARY_WITHIN_ADD = 'beneficiaries/within/{{account}}/add';
  static BENEFICIARY_WITHIN_VALID = 'beneficiaries/within/{{account}}/valid';

  static BENEFICIARY_WITHIN_VALIDATE_ADD = 'beneficiaries/within/{{account}}/validateAdd';

  static BENEFICIARY_WITHIN_DELETE = 'beneficiaries/within/deleteBatch';
  static BENEFICIARY_WITHIN_DETAILS = 'beneficiaries/within/withinDetails';


  // LOCAL
  static BENEFICIARY_LOCAL_ADD = 'beneficiaries/local/add';
  static BENEFICIARY_PAGINATION_BATCH = 'beneficiaries/local/paginationLocalBatch';
  static BENEFICIARY_LOCAL_VALID = 'beneficiaries/local/validate';
  static BENEFICIARY_LOCAL_VALIDATE_ADD = 'beneficiaries/local/validateAdd';

  // INTERNATIONAL

  static BENEFICIARY_INTERNATIONAL_ADD = 'beneficiaries/international/add';
  static BENEFICIARY_INTERNATIONAL_ADD_V2 = 'beneficiaries/international/add/v2';
  static BENEFICIARY_INTERNATIONAL_BRANCH_DETAILS = 'beneficiaries/international/bankBranchDetails/';
  static BENEFICIARY_INTERNATIONAL_BANK_BRANCH = 'beneficiaries/international/bankBranches'
  static BENEFICIARY_INTERNATIONAL_BANK_CONFIGURATION = 'beneficiaries/international/bankConfiguration'
  static BENEFICIARY_INTERNATIONAL_COUNTRY = 'beneficiaries/international/countries/';
  static BENEFICIARY_INTERNATIONAL_CURRENCY = 'beneficiaries/international/currencies/';
  static BENEFICIARY_INTERNATIONAL_NATIONALITIES = 'beneficiaries/international/nationalities';
  static BENEFICIARY_INTERNATIONAL_REALTIONS = 'beneficiaries/international/relations';
  static BENEFICIARY_INTERNATIONAL_UPDATE_COUNTRY = 'beneficiaries/international/search/bankNameList/{countryCode}';
  static BENEFICIARY_INTERNATIONAL_UPDATE_BANK_NAME = 'beneficiaries/international/search/branchNameList';
  static BENEFICIARY_INTERNATIONAL_VALID = 'beneficiaries/international/validate';
  static BENEFICIARY_INTERNATIONAL_VALIDATE_ADD = 'beneficiaries/international/valdiateAdd';
  static BENEFICIARY_INTERNATIONAL_VALIDATE_ADD_V2 = 'beneficiaries/international/validateAdd/v2';
  static BENEFICIARY_INTERNATIONAL_GET_BANK_LIST = 'beneficiaries/internationalTransferBanks/';


  // DETAILS
  static BENEFICIARY_DETAILS = "beneficiaries/details";
  // DELETE
  static BENEFICIARY_DELETE = "beneficiaries/delete";
  // MODIFY
  static BENEFICIARY_MODIFY = "beneficiaries/modify";
}
