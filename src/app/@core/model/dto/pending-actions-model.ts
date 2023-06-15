import { TabModel } from "arb-design-library/model/tab.model";
import { TableHeaderModel } from "arb-design-library/model/table-header.model";
import { Observable, Subscriber } from "rxjs";
import { Batch, BatchList } from "../rest/common/batchResponse";
import { GenerateChallengeAndOTP, RequestValidate } from "../rest/common/otp.model";
import { SummaryModel } from "arb-design-library/model/summary.model";
import { SummarySectionModel, SummaryTable } from "arb-design-library/model/summary-section.model";
import { TableHeaderType } from "arb-design-library";
import { Utils } from "../../utility/Utils";
import { TitleModel } from "arb-design-library/model/title.model";
import { AmountTitleModel } from "arb-design-library/model/amount-title.model";
import { ServiceLocator } from "../../service/base/service-locator.service";
import { TranslateService } from "@ngx-translate/core";
import { DatePipe } from "@angular/common";


export interface WorkflowType {
  type: string,
  isFinancial: boolean,
  text?: string,
}

export interface PendingActionPage {
  title: string;
  subtitle?: string;
  workflowType?: WorkflowType[];
  tabs?: TabModel[];
  workflowTabs?: TabModel[];
  pendingActions: PendingActionModel[];
}


export abstract class PendingActionModel {

  translate: TranslateService = ServiceLocator.injector.get(TranslateService);

  protected constructor(private datePipe: DatePipe) {
  }

  successApproveMessage!: string;
  successRejectMessage!: string;
  table!: TableHeaderModel[];
  TableHeaderModelWarning?: TableHeaderModel[];
  staticMapObjects: { [key: string]: string; }[] = [];
  serviceMapObjects: string[] = [];
  showSariaLogo: boolean = false;
  singleSelection: boolean = false;

  abstract getPendingActions(data: PendingActionPagination): Observable<any>;

  abstract validatePendingActions(data: any): Observable<ValidatePendingActionsResponse>;

  abstract confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any>;

  abstract rejectPendingActions(data: any, rejectionReason: string): Observable<any>;

  rejectValidatePendingActions(data: any, rejectionReason?: string): Observable<any[]> {
    return new Observable((observer: Subscriber<any>) => {
      observer.next(data);
    });
  }


  getSummary(title: string, isApprove: boolean, data: BatchList, headers: TableHeaderModel[]): SummaryModel {
    let length = 0;
    let summary: SummaryModel;
    if (data.notAllowed.length > 0 || data.toAuthorize?.length || data.toProcess.length > 0) {
      length = data.notAllowed.length + (data.toAuthorize ? data.toAuthorize.length : 0) + data.toProcess.length;
    } else if (data.toReject && !isApprove) {
      length = data.toReject.length
    }
    if (length && length >= 7) {
      summary = this.buildTablePage(title, isApprove, data, headers);
    } else {
      summary = this.buildSummaryPage(title, isApprove, data, headers);
    }
    return summary;
  }

  getWarningResult(title: string, headersSuccess: TableHeaderModel[], data: any, headersErrors: TableHeaderModel[]): SummaryModel {
    if (data.errorList) {
      data['error'].forEach((batch: any) => { batch.returnCodeMapped = data.errorList['errorTable.' + batch.returnCode] })
    }
    let summary: SummaryModel = {
      title: this.getSummaryTitle(title, ''),
      sections: []
    }
    if (data.success.length > 0) {
      summary.sections?.push({
        title: { id: "", title: 'pending-actions.actions-proccessed' },
        table: this.getSummaryTable(data.success, headersSuccess),
      });
    }
    if (data.error.length > 0) {
      summary.sections?.push({
        title: { id: "", title: 'pending-actions.actions-not-proccessed' },
        table: this.getSummaryTable(data.error, headersErrors),
      });
    }
    return summary;
  }

  buildTablePage(title: string, isApprove: boolean, data: BatchList, headers: TableHeaderModel[]): SummaryModel {
    title = "pending-actions.summary"
    let summarySubTitle = "";

    if (isApprove) {
      let summary: SummaryModel = {
        title: this.getSummaryTitle(title, summarySubTitle),
        sections: []
      }
      if (data.toProcess.length > 0) {
        summary.sections?.push({
          title: { id: "", title: 'pending-actions.actions-will-be-complete' },
          table: this.getSummaryTable(data.toProcess, headers),
        });
      }
      if (data.toAuthorize?.length) {
        summary.sections?.push({
          title: { id: "", title: 'pending-actions.actions-will-approved' },
          table: this.getSummaryTable(data.toAuthorize, headers),
        });
      }
      if (data.notAllowed.length > 0) {
        summary.sections?.push({
          title: { id: "", title: 'pending-actions.actions-not-allowed' },
          table: this.getSummaryTable(data.notAllowed, headers),
        });
      }
      return summary;
    } else {
      let summary: SummaryModel = {
        title: this.getSummaryTitle(title, summarySubTitle),
        sections: [
          {
            title: { id: "", title: 'pending-actions.actions-will-be-reject' },
            table: this.getSummaryTable(data.toReject, headers),
          }]
      }
      return summary;
    }
  }

  getSummaryTable(data: any, headers: TableHeaderModel[], isApprove?: boolean): SummaryTable {
    return {
      columnId: "batchPk",
      headers: headers,
      maxDisplayRow: 5,
      data,
    }
  }

  buildSummaryPage(title: string, isApprove: boolean, data: BatchList, headers: TableHeaderModel[]): SummaryModel {
    title = "pending-actions.summary"
    let summarySubTitle = "";

    let summary: SummaryModel = {
      title: this.getSummaryTitle(title, summarySubTitle),
    }
    let summarySections: SummarySectionModel[] = [];

    if (isApprove) {
      let counter = 0;
      data.toProcess.forEach((item: Batch, index: number) => {
        counter = counter + 1;
        summarySections.push(this.createSummaryItem('Positive', 'pending-actions.actions-will-be-complete', counter, item, headers));
      });
      data.toAuthorize?.forEach((item: Batch, index: number) => {
        counter = counter + 1;
        summarySections.push(this.createSummaryItem('Neutral', 'pending-actions.actions-will-approved', counter, item, headers));
      });
      data.notAllowed.forEach((item: Batch, index: number) => {
        counter = counter + 1;
        summarySections.push(this.createSummaryItem('Negative', 'pending-actions.not-allowed', counter, item, headers));
      });
      summary.sections = summarySections;
      return summary;
    } else {
      data.toReject.forEach((item: Batch, index: number) => {
        summarySections.push(this.createSummaryItem('Neutral', 'pending-actions.actions-will-be-reject', index + 1, item, headers));
      });
      summary.sections = summarySections;
      return summary;
    }
  }


  createSummaryItem(type: 'Neutral' | 'Positive' | 'Negative', title: string, index: number, data: any, headers: TableHeaderModel[]): SummarySectionModel {
    let sections: SummarySectionModel = {
      pill: {
        text: index < 10 ? 'Action#0' + index : 'Action#' + index,
        type,
      },
      items: []
    };

    if (title) {
      sections.title = {
        id: "",
        title
      };
    }

    headers.forEach((item: TableHeaderModel) => {

      switch (item.type) {
        case TableHeaderType.DATE_TEXT:
          sections.items?.push(this.getDateText(item, data));
          break;
        case TableHeaderType.CURRENT_LEVEL:
          sections.items?.push(this.getCurrentLevel(item, data));
          break;
        case TableHeaderType.NEXT_LEVEL:
          sections.items?.push(this.getNextLevel(item, data));
          break;
        case TableHeaderType.AMOUNT_TEXT:
          sections.items?.push(this.getAmount(item, data));
          break;
        default:
          sections.items?.push(this.getText(item, data));
          break;
      }

    });
    return sections;
  }

  getSummaryTitle(summaryTitle: string, summarySubTitle: string | AmountTitleModel[] | undefined): TitleModel {
    return {
      id: "summaryTitle",
      title: summaryTitle,
      subTitle: summarySubTitle
    }
  }

  getResultSummaryTitle(summaryTitle: string, summarySubTitle: string | AmountTitleModel[] | undefined): TitleModel {
    return {
      id: "summaryTitle",
      title: summaryTitle,
      subTitle: summarySubTitle
    }
  }

  getText(item: TableHeaderModel, data: any) {
    return {
      title: item.title,
      subTitle: item.mapObject ? item.mapObject[data[item.fieldName]] : data[item.fieldName],
    }
  }

  getAmount(item: TableHeaderModel, data: any) {
    return {
      title: item.title,
      subTitle: item.mapObject ? item.mapObject[data[item.fieldName]] : data[item.fieldName] || "0.00",
      currency: item.controlOptions?.currency ? data[item.controlOptions?.currency] ? data[item.controlOptions?.currency] : '608' : '608'
    }
  }

  getDateText(item: TableHeaderModel, data: any) {
    return {
      title: item.title,
      subTitle: item.controlOptions?.format ? this.datePipe.transform(data[item.fieldName], item.controlOptions.format) : data[item.fieldName],
    }
  }

  getCurrentLevel(item: TableHeaderModel, data: any) {
    const futureSecurityLevelsDTOList = getBatchLevels(data);
    return Utils.getCurrentLevelSummaryItem(this.translate, futureSecurityLevelsDTOList);
  }

  getNextLevel(item: TableHeaderModel, data: any) {
    const futureSecurityLevelsDTOList = getBatchLevels(data);
    return Utils.getNextLevelSummaryItem(this.translate, futureSecurityLevelsDTOList);
  }
}

export interface PendingActionPagination {
  page: number,
  rows: number
}

export interface ValidatePendingActionsResponse {
  batchList: BatchList;
  generateChallengeAndOTP?: GenerateChallengeAndOTP;
}

export function getBatchLevels(data: any): [] {
  let levels: [] = [];
  if (data.futureSecurityLevelsDTOList && data.futureSecurityLevelsDTOList.length > 0) {
    levels = data.futureSecurityLevelsDTOList;
  }
  if (data.securityDetails && data.securityDetails.length > 0) {
    levels = data.securityDetails;
  }
  if (data.securityLevelsDTOList && data.securityLevelsDTOList.length > 0) {
    levels = data.securityLevelsDTOList;
  }
  return levels;
}
