import { BeneficiaryInternationalAddRequestModel } from "./beneficiary-international-add-res.model";

export interface BeneficiaryModifyReqModel {
    beneficiary: BeneficiaryInternationalAddRequestModel
    mobileNo: string,
    placeBirth: string,
    dateBirth: string,
    addressNumber: string,
    address1: string,
    zipCode: string,
    poBox: string,
    nationality: string,
    category: string,
    newEmail: string,
}


