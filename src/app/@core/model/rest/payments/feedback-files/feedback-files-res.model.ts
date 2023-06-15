import { CompanyDTO } from '../../common/company.model';

export interface FeedbackFilesRes {
  fileDownloadListsOutputDTO: FileDownloadListsOutputDTO;
}

export interface GovFeedbackFilesRes {
  fileDownloadListsOutputDTO: GovFileDownloadListsOutputDTO;
}

export interface FileDownloadListsOutputDTO {
  filesInProcess: FilesInProcess;
  downloadableFile: FilesInProcess;
  underProcessUpdatableFile: FilesInProcess;
}

export interface GovFileDownloadListsOutputDTO {
  filesInProcess: FilesInProcess;
  downloadableFile: FileItem[];
  underProcessUpdatableFile: FilesInProcess;
}

export interface FilesInProcess {
  size: number;
  total: number;
  items: FileItem[];
}

export interface FileItem {
  hostRequestsPk?: number;
  fileReference: string;
  fileType?: string;
  fileStatus?: string;
  requestDate: string;
  fileName: string;
  requestTime?: string;
  transfaerDate: string;
  companyDTO?: CompanyDTO;
  accountFrom?: string;
  newTransferDate?: string;
  rejectionReason?: string;
  userFileName?: string;
  batchList?: string;
}
