export interface AccountRulesModel {
    ibanFormat: string,
    ibanFormatLength: number,
    ibanMandatory: true,
    accountFormat: string,
    accountFormatLength: 0,
    acceptedAccountFrmats: string[]
}
