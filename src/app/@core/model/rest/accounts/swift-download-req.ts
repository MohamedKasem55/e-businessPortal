export interface SwiftDownloadReq {
  accountNumber: string,
  allAccounts: boolean,
  frequency: 'daily' | 'Monthly',
  finalDate: string
}
