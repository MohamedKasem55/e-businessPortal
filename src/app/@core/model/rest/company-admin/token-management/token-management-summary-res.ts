import { BaseResponse } from "../../common/base-response"

export interface TokenManagementSummaryRes extends BaseResponse {
  tokens: Tokens,
  tokenCompanySatistics: TokenCompanySatistics
  unassignedSoftToken: Tokens
}

export interface TokenCompanySatistics {
  numberOfCompanyUsers: number,
  numberOfCompanyAdmins: number,
  numberOfCompanyUsersWithToken: number,
  numberOfCompanyAdminWithToken: number,
  numberOfUnassignedToken: number,
  authMethod: "STATIC"
}

export interface Tokens {
  size: number,
  total: number,
  items: TokenItem[]
}

export interface TokenItem {
  tokenSerialNumber: string,
  tokenStatus: string,
  userId: string,
  userName: string,
  icoNumber: string,
  companyProfileNumber: string,
  tokenType: string,
  nonOperative: boolean,
  lost: boolean,
  blocked: boolean,
  active: boolean,
  unassigned: boolean
}