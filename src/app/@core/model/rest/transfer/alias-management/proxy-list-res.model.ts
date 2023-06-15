import { BaseResponse } from "../../common/base-response";

export interface ProxyListResModel extends BaseResponse {
  proxyList:ProxyType[]
}

export interface ProxyType{
  type: string,
  value: string,
  registrationId: string,
  creationTimestamp: string,
  updateTimestamp: string,
  cicNum: string
}
