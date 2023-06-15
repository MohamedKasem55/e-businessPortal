export interface ParticipantBankResModel {
  participantBankItems: participantBankItemModel[]
}

export interface participantBankItemModel {
  participantFullName: string,
  participantId: string,
  participantName: string,
  status: string,
}
