export interface MolFilesListReq {
  search?: boolean;
  batchName?: string;
  amountfrom?: number;
  amountto?: number;
  paymentDatefrom?: Date;
  paymentDateto?: Date;
  initiationDatefrom?: Date;
  initiationDateto?: Date;
  customerReference?: string;
  systemFileName?: string;
  fileType?: string;
  debitAccount?: string;
  page?: number
  rows?: number
}
