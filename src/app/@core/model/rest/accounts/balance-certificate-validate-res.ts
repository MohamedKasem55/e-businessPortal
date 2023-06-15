import {BaseResponse} from "../common/base-response";
import {Batch} from "../common/batchResponse";

export interface BalanceCertificateValidateRes extends BaseResponse{
  batch: BalanceCertificateBatch
}
export interface BalanceCertificateBatch extends Batch{

  company: string;
  city: string;
  postalCode: string;
  requestDate: string;
  processDate: string;

}
