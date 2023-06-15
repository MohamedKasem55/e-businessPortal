import { RequestValidate } from 'app/@core/model/rest/common/otp.model';
import { BatchList } from '../../common/batchResponse';

export interface EsalPaymentConfirmReq {
  batchList: BatchList;
  pending: boolean;
  sendMails: boolean;
  requestValidate:RequestValidate
}
