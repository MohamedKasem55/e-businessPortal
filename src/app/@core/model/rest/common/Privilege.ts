import {Group} from "./Group";


export interface PrivilegePaymentTypes {
  privilegePaymentTypePk: number,
  paymentType: String,
  paymentTypeDesc: String,
  financial: Boolean,
}

export interface Privilege {
  privilegePk: number;
  privilegeId: string;
  description: string;
  groups?: Group[];
  paymentTypes?: PrivilegePaymentTypes[];
}
