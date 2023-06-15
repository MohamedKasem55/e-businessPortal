import {RequestValidate} from "../../../common/otp.model";

export interface UploadRequestOpenAccountFileReq {
  batchName:string;
  file:File;
  requestValidate?:RequestValidate
}
