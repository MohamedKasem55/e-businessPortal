export interface DashboardTopBillsTransfersRes {
  errorCode: string;
  errorDescription: string;
  errorResponse: any;
  generateChallengeAndOTP: any;
  topBillReportViews: TopBillReportViews[];
  topTansferReport: TopTansferReport[];
}

export interface TopBillReportViews {
  total: number;
  billRef: string;
  nickName: string;
  billCode: string;
  billDescriptionEn: string;
  billDescriptionAr: string;
  image?: string;
}

export interface TopTansferReport {
  total: number;
  beneficiaryName: string;
  bankCode:string;
  accountTo: string;
  transferType: string;
  bankName: string;
  image?: string;
}
