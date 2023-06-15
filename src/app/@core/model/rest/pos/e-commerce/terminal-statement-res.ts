import { TerminalItem } from './terminals-list-res';

export interface TerminalStatementOutputDTO {
  accountListPos: [];
  terminalOutputDto: TerminalOutputDto;
}

export interface TerminalOutputDto {
  size: number;
  total: number;
  items: TerminalItem[];
}

export interface TerminalStatementDownloadDTO {
  outputDTO: DownloadableFilesOutput;
}

export interface DownloadableFilesOutput {
  size: number;
  total: number;
  fileList: FileDownloadData[];
}

export interface DownloadTerminalFilesDTO {
  downloadFiles: FileDownloadData[];
  periodStr: string;
}

export interface FileDownloadData {
  fileName?: string;
  batchName?: string;
  userFileName?: string;
  dataReceived?: string;
  dirUploadArchive?: boolean;
  fileSize?: number;
  terminalId?: string;
  type?: string;
}

export interface DisplayedTerminalStatementList {
  downloadStatement: string,
  terminalId: string,
  dateReceived: string,
}