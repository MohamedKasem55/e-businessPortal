import { BaseResponse } from "../../common/base-response";

export interface TokenAssignmentStatusRes extends BaseResponse {
    assignmentStatus: TokenAssignmentStatus;
}

export interface TokenAssignmentStatus {
    tokenSerialNumber: string;
    tokenStatus: string;
    userId: string;
    userName: string;
    icoNumber: string;
    companyProfileNumber: string;
    tokenType: string;
    nonOperative: boolean;
    lost: boolean;
    blocked: boolean;
    active: boolean;
    unassigned: boolean;
  }