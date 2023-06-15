import {BalanceCertificateBatch} from "./balance-certificate-validate-res";
import {RequestValidate} from "../common/otp.model";

export interface BalanceCertificateConfirmReq {
  batch: BalanceCertificateBatch,
  requestValidate?:RequestValidate
}
