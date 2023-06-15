import { Injectable } from '@angular/core';
import {
  SearchTerminalCombinedFileReq,
  SearchTerminalStatementReq,
  TerminalStatementDownloadReq,
} from 'app/@core/model/rest/pos/e-commerce/terminal-statement-req';
import {
  DownloadTerminalFilesDTO,
  TerminalStatementDownloadDTO,
  TerminalStatementOutputDTO,
} from 'app/@core/model/rest/pos/e-commerce/terminal-statement-res';
import { RequestSearchTerminals } from 'app/@core/model/rest/pos/e-commerce/terminals-list-req';
import { TerminalsListRes } from 'app/@core/model/rest/pos/e-commerce/terminals-list-res';
import { Observable } from 'rxjs';
import { AbstractBaseService } from '../../base/abstract-base.service';
import { POS_SVC_URL_CONST } from '../pos-service-url';

@Injectable({
  providedIn: 'root',
})
export class POSTerminalsService extends AbstractBaseService {
  getTerminalsList(
    params: RequestSearchTerminals
  ): Observable<TerminalsListRes> {
    return this.post(POS_SVC_URL_CONST.TERMINALS_LIST, {
      page: params.page,
      rows: params.rows,
      order: params.order,
      orderType: params.orderType,
      region: params.region,
      city: params.city,
      accountNumber: params.accountNumber,
      terminalId: params.terminalId,
      terminalName: params.terminalName,
      location: params.location,
      phone: params.phone,
      mobile: params.mobile,
      fax: params.fax,
      allTerminals: params.allTerminals,
    }, {hideLoader: true});
  }

  getTerminalStatement(
    params: SearchTerminalStatementReq
  ): Observable<TerminalStatementOutputDTO> {
    return this.post(POS_SVC_URL_CONST.TERMINAL_STATEMENT, {
      page: params.page,
      rows: params.rows,
      orderBy: params.orderBy,
      asc: params.asc,
      sort: params.sort,
      region: params.region,
      city: params.city,
      accountNumber: params.accountNumber,
      terminalId: params.terminalId,
      terminalName: params.terminalName,
      location: params.location,
      phone: params.phone,
      mobile: params.mobile,
      fax: params.fax,
      allTerminals: params.allTerminals,
    }, {hideLoader: true});
  }

  getTerminalStatementCombinedFile(
    params: SearchTerminalCombinedFileReq
  ): Observable<TerminalStatementDownloadDTO> {
    return this.post(POS_SVC_URL_CONST.TERMINAL_STATEMENT_COMBINED, {
      allTerminals: params.allTerminals,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      period: params.period,
      selectedTerminals: params.selectedTerminals,
    }, {hideLoader: true});
  }

  downloadTerminalStatements(params: TerminalStatementDownloadReq) {
    return this.post(
      POS_SVC_URL_CONST.TERMINAL_STATEMENT_DOWNLOAD,
      {
        downloadFiles: params.downloadFiles,
        periodStr: params.periodStr,
      },
      { responseType: 'blob' }
    ).subscribe((res) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(res);
      link.download = 'TerminalStatement.zip';
      link.click();
      link.remove();
    });
  }
}
