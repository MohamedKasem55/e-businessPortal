export interface DocumentsListRes {
  recPgCtrlOut: { sentRecs: number, matchedRecs: number, complFlg: string },
  docsLst: DocumentObject[]
}

export interface DocumentObject {
  docReqRef: string,
  custCIC: string,
  custID: string,
  docType: string,
  docTypeDescAR: string,
  docTypeDescEN: string,
  docReqStatus: string,
  docReqStatusDescAR: string,
  docReqStatusDescEN: string,
  reqState: string,
  creationDate: string,
  lastUpdateDate: string,
  expiryDate: string,
  fileNetRef: string,
  custFirstNameAR: string,
  custFirstNameEN: string,
  custLastNameAR: string,
  custLastNameEN: string,
  ebussUserID: string,
  ebussAccNum: string
}
