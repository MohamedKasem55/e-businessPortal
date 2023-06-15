export interface OpenAccountTrackerDetailsReq {
  maxRecs: number
  offset: number
  batchName?: string;
  batchReference?: string
  accountStatus?: WPSPlusAccountStatusDTO;
}

export enum WPSPlusAccountStatusDTO {
  IN_PROGRESS = "IN_PROGRESS",
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL'
}
