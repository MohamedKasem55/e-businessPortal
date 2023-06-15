import { RequestValidate } from "app/@core/model/rest/common/otp.model";

export interface BeneficiaryLocalAddRequestModel {
    beneficiaryName: string;
    phoneNumber?: string;
    bankCode: string;
    email?: string;
    beneficiaryAccountNumber: string;
    requestValidate: RequestValidate
}

