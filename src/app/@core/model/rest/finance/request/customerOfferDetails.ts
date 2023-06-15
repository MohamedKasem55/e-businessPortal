export interface customerOfferDetails {
  totalFinanceAmt: number | null;
  totalDownPayment: number | null;
  totaldminFeeAmt: number | null;
  custOfferVehicleGroupLstItemTypes: Array<customerOfferVehicleGroupLst>,
  installmentsList: Array<installmentsList>,

}
export interface customerOfferVehicleGroupLst {
  product: string,
  campaign: string,
  dealerName: string,
  dealerType: string,
  brandName: string,
  modelName: string,
  modelYear: string,
  vehicleVariant: string,
  vehicleSegment: string,
  vehiclesNum: string,
  vehiclePrice: number,
  vehicleType: string,
  vehicleCategory: string,
  gracePeriod: string,
  adminFeeAmt: number,
  tenure: string,
  profitRate: number,
  defaultProfitRate: number,
  pmtFrequency: string,
  minDownPmt: number,
  downPmt: number,
  ballonPmt: number,
  firstInstallmentAmt: number,
  insurancePer: string,
  currentYearGroup: number,
  totalGroups: number,
  quotationNum: string,
  quotationDate: string
}

export interface installmentsList {
  installmentNum: number,
  monthlyInstallmentAmt: number,
  installmentDate: string
}
