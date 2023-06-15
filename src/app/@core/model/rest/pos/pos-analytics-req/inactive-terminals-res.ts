import { GenerateChallengeAndOTP } from "../../common/otp.model"

export interface POSInactiveTerminalsResponse {
   

    errorCode?: string,
    errorDescription?: string,
    errorResponse?: ErrorServiceResponse
    generateChallengeAndOTP?: GenerateChallengeAndOTP;
    inactiveTerminalList?: PagedResultsPosManagementDashboardInactiveTerminalDSO;
  }

  export interface ErrorServiceResponse{
    reference?:	string,
    englishMessage?: string,
    arabicMessage?:	string
    code?:	string
    description?: string
  }

  export interface PagedResultsPosManagementDashboardInactiveTerminalDSO{
    size?:	number,
    total?:	number,
    items?: PosManagementDashboardInactiveTerminalDSOPosManagementDashboardInactiveTerminalDSO[]
  }

  export interface PosManagementDashboardInactiveTerminalDSOPosManagementDashboardInactiveTerminalDSO{
    terminalNumber?: string,
    lastTransactionDate?: Date,
  }