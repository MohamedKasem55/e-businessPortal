export interface CheckKeyItems {
  avgBal: number | string;
  checkCode: string | null;
  checkReason: string;
  checkResult: string;
  eligibleFlg: boolean | string;
  facility: string;
  macroFacility: boolean;
  maxIndicativeAmt: number | string;
  productCode: string;
}
