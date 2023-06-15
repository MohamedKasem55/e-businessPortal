import { RequestValidate } from "../../common/otp.model";

export interface ProxyConfirmReqModel {
  proxyType?: ProxyType|null
  proxyValue?: string|null
  proxyAction: ProxyAction
  iban: string
  registrationId?: string
  reason?: string|null
  requestValidate?: RequestValidate
}

export enum ProxyType {
  MOBILE = "MOBILE", EMAIL= "EMAIL", UNN="UNN"
}

export enum ProxyAction {
  LINK="LINK", DELINK="DELINK", DELINK_ALL="DELINK_ALL"
}
