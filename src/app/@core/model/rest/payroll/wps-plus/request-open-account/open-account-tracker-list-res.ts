export interface OpenAccountTrackerListRes {
  wpsPlusTracker: PayrollPlusEmployeeAccountDTO[];
  size: number;
  total: number;
}

export interface PayrollPlusEmployeeAccountDTO {
  batchName: string;
  batchRef: string;
  count: number;
  successCount: number;
  inProgressCount: number;
  initiatorId: string;
  approverId: string;
  batchInitiationDate: number
  batchApprovalDate: number;
}
















