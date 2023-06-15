import { GenerateChallengeAndOTP } from '../common/otp.model';

export interface ActivityLogsReq {
  authorities?: string;
  operation?: string;
  dateFrom?: string;
  dateTo?: string;
  order?: string;
  orderType?: string;
  page?: number;
  rows?: number;
  userId?: string;
}

export interface AuditReporFileReq {
  auditPk?: number;
  order?: string;
  orderType?: string;
  page?: number;
  rows?: number;
}

export interface ActivityLogsListResponseModel {
  auditReporLines: AuditReportLines;
  errorCode: string;
  errorDescription: string;
  errorResponse: any;
  generateChallengeAndOTP: GenerateChallengeAndOTP;
}

export interface AuditReportFilesModel {
  auditReporfiles: AuditReportFiles;
  errorCode: string;
  errorDescription: string;
  errorResponse: any;
  generateChallengeAndOTP: GenerateChallengeAndOTP;
}

export interface ActivityLogsDetailsRes {
  auditDetailLines: AuditDetailLines[];
  auditReport: AuditReport;
  page?: number;
  size?: number;
  total?: number;
}

export interface AuditDetailLines {
  items: AuditDetails[];
  size: number;
  total: number;
}

export interface AuditDetails {
  auditLineDetailPk: any;
  auditLineFk: any;
  fieldCode: string;
  fieldValue: string;
}

export interface AuditReportFiles {
  items: string[];
  size: number;
  total: number;
}

export interface AuditReportLines {
  items: AuditReport[];
  size: number;
  total: number;
}

export interface AuditReport {
  auditLinePk: number;
  operation: string;
  companyId: string;
  status: string;
  timeStamp: string;
  data: string;
  time: string;
  userId: string;
  userName: string;
  userType: string;
}

export interface downloadAuditReportFileReq {
  parameter: string;
}

export interface deleteAuditReportFilesReq {
  auditReporfiles: string[];
  errorCode?: string;
  errorDescription?: string;
  errorResponse?: any;
  size?: number;
  total?: number;
}
