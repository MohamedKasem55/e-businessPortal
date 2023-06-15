import {RequestValidate} from "../../common/otp.model";

export interface AgreementConfirmReq {
  employeeCount: number;
  agreementTemplateId: number;
  account: string;
  mol_ID: string;
  requestValidate:RequestValidate
  agreementType: string
}
