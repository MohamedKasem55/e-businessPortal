export interface AgreementTemplateDTOList {
  payrollTemplatePk: number
  employeeCountMinimum: number
  employeeCountMaximum: number
  monthlyFees: number
  employeeFees: number
  localTxFees: number
  LocalTxFailureFees: number
  LocalTxCancelFees: number
  rajhiTxFees: number
  rajhiTxFailureFees: number
  rajhiTxCancelFees: number
  txPostingFlg: string
  account: string
  combinedDate: number
  autoFileAuthorization: boolean
  segment: number
  feedbackReportReject: boolean
  feedbackReportConfirm: boolean
  feedbackReportCombined: boolean
  summeryFeedbackReportInitial: boolean
  summeryFeedbackReportRejected: boolean
  summeryFeedbackReportCombined: boolean
  blueCollarRajhiFee:number

}

export interface PayrollAgreementTemplateListRes {
  agreementTemplateDTOList: AgreementTemplateDTOList[]
}
