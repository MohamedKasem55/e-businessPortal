import { ProxyType, ProxyAction } from "./proxy-confirm-req.model";

export interface ProxyValidateReqModel {
  proxyType?: ProxyType|null
  proxyValue?: string|null
  proxyAction: ProxyAction
  iban: string
  registrationId?: string
  reason?: string|null
}
