import { RequestValidate } from '../../common/otp.model';
import { PrepaidCardsBatchList } from './loadfunds-validate-res.model';
export interface PrepaidLoadFundsConfirmReqModel {
    prepaidCardsBatchList: PrepaidCardsBatchList;
    requestValidate?: RequestValidate;
}