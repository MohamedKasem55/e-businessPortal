import { Injectable } from '@angular/core';
import { AbstractBaseService } from '../../base/abstract-base.service';
import { Observable } from 'rxjs';
import { Constants } from './feedback-files-urls';
import {
  FeedbackFilesRes,
  FileItem,
} from '../../../model/rest/payments/feedback-files/feedback-files-res.model';
import {
  BillFeedbackFileDetailsRes,
  EsalFeedbackFileDetailsRes,
  GovSadadFeedbackFileDetailsRes,
} from 'app/@core/model/rest/payments/feedback-files/feedback-file-details/feedback-file-details-res.model';
import { FeedbackFileDetailsDeleteReq } from 'app/@core/model/rest/payments/feedback-files/feedback-file-delete.model';

@Injectable()
export class FeedbackFilesService extends AbstractBaseService {
  getBillFeedbackFileList(
    page: number,
    rows: number
  ): Observable<FeedbackFilesRes> {
    return this.post(Constants.BILL_FEEDBACK_FILE_LIST, { page, rows }, {hideLoader: true});
  }

  getBillFeedbackFileDetails(
    fileReference: string
  ): Observable<BillFeedbackFileDetailsRes> {
    return this.post(Constants.BILL_FEEDBACK_FILE_DETAILS, { fileReference }, {hideLoader: true});
  }

  deleteBillFeedbackFileDetails(fileToDelete: FeedbackFileDetailsDeleteReq) {
    return this.post(Constants.BILL_FEEDBACK_FILE_DETAILS_DELETE, {
      fileToDelete,
    });
  }

  getEsalFeedbackFileList(
    page: number,
    rows: number
  ): Observable<FeedbackFilesRes> {
    return this.post(Constants.ESAL_FEEDBACK_FILE_LIST, { page, rows }, {hideLoader: true});
  }

  getEsalFeedbackFileDetails(
    hostRequestDTO: FileItem
  ): Observable<EsalFeedbackFileDetailsRes> {
    return this.post(Constants.ESAL_FEEDBACK_FILE_DETAILS, { hostRequestDTO }, {hideLoader: true});
  }

  getGovernmentFeedbackFileList(
    page: number,
    rows: number
  ): Observable<FeedbackFilesRes> {
    return this.post(Constants.GOVERNMENT_FEEDBACK_FILE_LIST, { page, rows }, {hideLoader: true});
  }

  getGovernmentFeedbackFileDetails(
    fileReference: string
  ): Observable<GovSadadFeedbackFileDetailsRes> {
    return this.post(Constants.GOVERNMENT_FEEDBACK_FILE_DETAILS, {
      fileReference,
    }, {hideLoader: true});
  }
}
