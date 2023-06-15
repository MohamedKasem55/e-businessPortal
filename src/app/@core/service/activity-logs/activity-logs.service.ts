import { Injectable } from '@angular/core';
import {
  ActivityLogsDetailsRes,
  ActivityLogsListResponseModel,
  ActivityLogsReq,
  AuditReporFileReq,
  AuditReportFilesModel,
  deleteAuditReportFilesReq,
  downloadAuditReportFileReq,
} from 'app/@core/model/rest/activity-logs/activity-logs';
import { Observable } from 'rxjs';
import { AbstractBaseService } from '../base/abstract-base.service';

@Injectable()
export class ActivityLogsService extends AbstractBaseService {
  constructor() {
    super();
  }

  getActivityLogs(
    req: ActivityLogsReq
  ): Observable<ActivityLogsListResponseModel> {
    return this.post('audit', req, { hideLoader: true });
  }

  getActivityLogDetails(
    req: AuditReporFileReq
  ): Observable<ActivityLogsDetailsRes> {
    return this.post('audit/detail', req, { hideLoader: true });
  }

  requestNewFile(req: ActivityLogsReq) {
    return this.post('audit/report', req);
  }
  getAuditReportFiles(
    req: AuditReporFileReq
  ): Observable<AuditReportFilesModel> {
    return this.post('audit/report/list', req);
  }
  deleteAuditReportFiles(req: deleteAuditReportFilesReq) {
    return this.delete('audit/report/delete', req);
  }
  downloadAuditReportFiles(req: downloadAuditReportFileReq): Observable<Blob> {
    return this.post('audit/report/download', req, { responseType: 'blob' });
  }
}
