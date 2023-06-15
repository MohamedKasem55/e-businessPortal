export interface PrepaidCardAttachmentReqModel {
    dossierId: string;
    fileName: string;
    fileType: string;
    fileCode: DocCode;
    fileContent: string | ArrayBuffer;
}

export enum DocCode {
    ID,
    EMP_CERT,
    COMMREG
  }