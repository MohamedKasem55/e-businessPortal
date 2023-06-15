import {
  PendingActionModel,
  PendingActionPage,
  PendingActionPagination, ValidatePendingActionsResponse, WorkflowType
} from "../../../@core/model/dto/pending-actions-model";
import {PendingActionsService} from "../../../@core/service/pending-actions/pending-actions-service";
import {DatePipe} from "@angular/common";
import {TabModel} from "arb-design-library/model/tab.model";
import {Observable, Subscriber} from "rxjs";
import {RequestValidate} from "../../../@core/model/rest/common/otp.model";
import {TableHeaderModel} from "arb-design-library/model/table-header.model";
import {TableHeaderType} from "arb-design-library";
import {getCurrentLevelControlOptions} from "./current-level-control-options";
import {SummaryModel} from "arb-design-library/model/summary.model";
import {SummarySectionModel, SummaryTable} from "arb-design-library/model/summary-section.model";
import {Batch, BatchList} from "app/@core/model/rest/common/batchResponse";
import {SummaryItemModel} from "arb-design-library/model/summary-item.model";

export class PayrollPlusPendingActionsPage implements PendingActionPage {
  constructor(private pendingActionsService: PendingActionsService, private datePipe: DatePipe, private counters: { [key: string]: number }) {
  }

  title = "pending-actions.payroll-plus";
  workflowType: WorkflowType[] = [{
    // definir tipos de workflowº !!!!
    type: 'WPSP',
    isFinancial: true
  },
    {
      type: 'WPSP_E',
      isFinancial: false
    },
    // {
    //   type: 'CP',
    //   isFinancial: false
    // }
  ];
  tabs: TabModel[] = buildTabs(this.counters);
  workflowTabs: TabModel[] = buildTabs();
  pendingActions: PendingActionModel[] = buildPendingAction(this.pendingActionsService, this.datePipe, this.counters);
}

export function buildPendingAction(pendingActionsService: PendingActionsService, datePipe: DatePipe, counters: any): PendingActionModel[] {
  let pendingActions: PendingActionModel[] = [];
  if (counters) {
    if (counters.hasOwnProperty('wpsPlusEmployee'))
      pendingActions.push(new payrollPlusOpenAccountPendingAction(pendingActionsService, datePipe))
    if (counters.hasOwnProperty('wpsPlusPayment'))
      pendingActions.push(new payrollPlusSalaryPaymentPendingAction(pendingActionsService, datePipe))
    // if (counters.hasOwnProperty('wpsPlusPayment'))
    //   pendingActions.push(new payrollPlusMigrationPendingAction(pendingActionsService, datePipe))
  }
  return pendingActions;
}

export function buildTabs(counters?: any): TabModel[] {
  let tabs: TabModel[] = [];
  let tabCount: number = 0;
  if (counters) {

    if (counters.hasOwnProperty('wpsPlusEmployee')) {
      tabs.push({
        text: "pending-actions.open-account", value: tabCount.toString()
      })
      tabCount++
    }
    if (counters.hasOwnProperty('wpsPlusPayment')) {
      tabs.push({text: "pending-actions.salary-payment", value: tabCount.toString()})
      tabCount++
    }
    // if (counters.hasOwnProperty('wpsPlusPayment')) {
    //   tabs.push({ Text: "pending-actions.migration", value: tabCount.toString() })
    //   tabCount++
    // }
  } else {
    tabs.push(
      {
        text: "pending-actions.open-account",
        value: "0",
      },
      {
        text: "pending-actions.salary-payment",
        value: "1",
      })
    // {
    //   text: "pending-actions.migration",
    //   value: "0",
    // };
  }
  return tabs;
}


export class payrollPlusOpenAccountPendingAction extends PendingActionModel {
  mapObject = {"P": "Pending"};

  constructor(private pendingActionsService: PendingActionsService, private _datePipe: DatePipe) {
    super(_datePipe);
  }

  // override serviceMapObjects = ["bankCode", "countryName", "backEndCountryCode", "batchTypes", "currency"];
  override successApproveMessage = "pending-actions.selected-payroll-plus-approved";
  override successRejectMessage = "pending-actions.selected-payroll-plus-rejected";

  getPendingActions(data: PendingActionPagination): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.getPendingActionsService("payroll/wps-plus/employee/add/pending/list", data).subscribe(res => {
        if (res) {
          // res = mockOpenAccount;
        }
        observer.next(res);
      });
    });
  }


  validatePendingActions(data: any): Observable<ValidatePendingActionsResponse> {
    const batchRefList = getbatchRefList(data)
    return new Observable((observer: Subscriber<any>) => {
      // this.pendingActionsService.postPendingActionsService("payroll/wps-plus/employee/add/pending/validate", { batchName: 'test', listEmployees: data }).subscribe(res => {
      this.pendingActionsService.postPendingActionsService("payroll/wps-plus/employee/add/pending/validate", {batchRefList}).subscribe(res => {
        const batchs = getBatchValidateSelected(res);
        getExtraFields(data, batchs)
        let batchList: any = {};
        batchList = res['batchContainer'];
        batchList['invalidEmployees'] = res['invalidEmployees'];
        batchList['requiredSFA'] = res['requiredSFA'];
        batchList['totalAmountProcess'] = res['totalAmountProcess'];
        batchList['totalAmountAuth'] = res['totalAmountAuth'];
        batchList['totalNotAllowed'] = res['totalNotAllowed'];
        batchList['generateChallengeAndOTP'] = res['generateChallengeAndOTP'];
        res['batchList'] = null;
        res['batchList'] = batchList
        observer.next(res);
      });
    });
  }

  confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("payroll/wps-plus/employee/add/pending/confirm", {
        batchList: data,
        requestValidate
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }

  rejectPendingActions(data: any, rejectionReason: string): Observable<any> {
    const batchRefList = getbatchRefList(data)
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("payroll/wps-plus/employee/add/pending/refuse", {
        batchRefList: batchRefList,
        rejectionReason
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }

  override table: TableHeaderModel[] = [
    {
      title: "pending-actions.batch-name",
      type: TableHeaderType.BUTTON,
      fieldName: 'batchName',
      controlOptions: {id: "batchName", text: "batchName"}
    },
    // {
    //   title: "pending-actions.total-count",
    //   type: TableHeaderType.TEXT,
    //   fieldName: 'accountNumber'
    // },
    {
      title: "pending-actions.initiation-date",
      type: TableHeaderType.DATE_TEXT,
      controlOptions: {format: 'dd/MM/yyyy'},
      fieldName: 'initiationDate'
    },
    {
      title: "pending-actions.status",
      type: TableHeaderType.TEXT,
      fieldName: 'status',
      mapObject: this.mapObject
    },
    {
      title: "pending-actions.current-level",
      type: TableHeaderType.CURRENT_LEVEL,
      fieldName: "securityLevelsDTOList",
      controlOptions: getCurrentLevelControlOptions
    },
    {
      title: "pending-actions.next-level",
      type: TableHeaderType.NEXT_LEVEL,
      fieldName: "securityLevelsDTOList",
      controlOptions: {completed: "payments.userApproval.completed"}
    }];


  override buildTablePage(title: string, isApprove: boolean, data: BatchList, headers: TableHeaderModel[]): SummaryModel {
    let summaryModel: SummaryModel = super.buildTablePage(title, isApprove, data, headers);
    if (summaryModel['sections']) {
      summaryModel['sections'].forEach((section: any) => {
        section['title']['title'] = 'pending-actions.selected-migration-batchs';
      })
    }
    return summaryModel;
  }

  override getSummary(title: string, isApprove: boolean, data: BatchList, headers: TableHeaderModel[]): SummaryModel {
    let length = 0;
    let summary: SummaryModel;
    if (data.notAllowed || data.toAuthorize || data.toProcess) {
      length = data.notAllowed.length + (data.toAuthorize ? data.toAuthorize.length : 0) + data.toProcess.length;
    }
    if (data.toReject && data.toReject.length > 0) {
      length = data.toReject.length;
    }
    console.warn(length);
    if (length && length >= 1) {
      summary = this.buildTablePage(title, isApprove, data, headers);
    } else {
      summary = this.buildSummaryPage(title, isApprove, data, headers);
    }
    return summary;
  }


  override createSummaryItem(type: 'Neutral' | 'Positive' | 'Negative', title: string, index: number, data: any, headers: TableHeaderModel[]): SummarySectionModel {
    let sections: SummarySectionModel = {
      pill: {
        text: 'Action #' + index,
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

    return sections;
  }

  buildPayrollSingleSummary(title: string, data: any, type: string): SummarySectionModel {

    let sections: SummarySectionModel = {
      items: []
    };

    if (data) {
      sections.title = {
        id: "",
        title: title
      };
    }

    if (type === 'file') {
      sections.items = getFileContentItemsMigrationOpenAccount(data);
    } else if (type === 'summary')
      sections.items = getSummaryFeesItemsMigrationOpenAccount(data);
    else {
      const headers: any[] = getEmployeelistTableHeadersOpenAccount(data)
      // data['employeeList'] = employeeListMock;

      sections.table = getEmployeeTable(data['employeeList'] ? data['employeeList']['items'] : [], headers)
    }
    return sections;
  }


  override buildSummaryPage(title: string, isApprove: boolean, data: BatchList, headers: TableHeaderModel[]): SummaryModel {
    title = "pending-actions.summary"
    let summarySubTitle = "";
    let summary: SummaryModel = {
      title: this.getSummaryTitle(title, summarySubTitle),
    }
    let summarySections: SummarySectionModel[] = [];

    if (isApprove) {
      let counter = 0;
      data.toProcess.forEach((item: Batch, index: number) => {
        // counter = counter + 1;
        // summarySections.push(this.createSummaryItem('Positive', 'pending-actions.actions-will-be-complete', counter, item, headers));
        summarySections.push(this.buildPayrollSingleSummary('pending-actions.file-content', item, 'file'));
        summarySections.push(this.buildPayrollSingleSummary('pending-actions.employee-list', item, ''));
        summarySections.push(this.buildPayrollSingleSummary('pending-actions.summary-fees', item, 'summary'));
      });
      data.toAuthorize?.forEach((item: Batch, index: number) => {
        // counter = counter + 1;
        summarySections.push(this.createSummaryItem('Neutral', 'pending-actions.actions-will-approved', counter, item, headers));
      });
      data.notAllowed.forEach((item: Batch, index: number) => {
        // counter = counter + 1;
        summarySections.push(this.createSummaryItem('Neutral', 'pending-actions.actions-will-approved', counter, item, headers));
      });
      summary.sections = summarySections;
      return summary;
    } else {
      data.toReject.forEach((item: Batch, index: number) => {
        summarySections.push(this.createSummaryItem('Neutral', "", index + 1, item, headers));
      });
      summary.sections = summarySections;
      return summary;
    }
  }


}

export class payrollPlusSalaryPaymentPendingAction extends PendingActionModel {
  mapObject = {"P": "Pending"};

  constructor(private pendingActionsService: PendingActionsService, private _datePipe: DatePipe) {
    super(_datePipe);
  }

  override successApproveMessage = "pending-actions.selected-payroll-plus-approved";
  override successRejectMessage = "pending-actions.selected-payroll-plus-rejected";

  getPendingActions(data: PendingActionPagination): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("payroll/wps-plus/pending/salary-payment/list", data).subscribe(res => {
        // this.pendingActionsService.getPendingActionsService("payroll/wps-plus/pending/salary-payment/list", data).subscribe(res => {
        // res = mockSalaryPayments;
        observer.next(res);
      });
    });
  }

  validatePendingActions(data: any): Observable<ValidatePendingActionsResponse> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("payroll/wps-plus/pending/salary-payment/validate", {batchList: data}).subscribe(res => {
        let batchList: any = {};
        batchList = res['batchList'];
        batchList['requiredSFA'] = res['requiredSFA'];
        batchList['salaryPaymentDetails'] = res['salaryPaymentDetails'];
        batchList['generateChallengeAndOTP'] = res['generateChallengeAndOTP'];
        res['batchList'] = null;
        res['batchList'] = batchList
        observer.next(res);
      });
    });
  }

  confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("payroll/wps-plus/pending/salary-payment/confirm", {
        batchList: data,
        requestValidate
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }


  rejectPendingActions(data: any, rejectionReason: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("payroll/wps-plus/pending/salary-payment/refuse", {
        batchDTOList: data,
        rejectionReason
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }

  override table: TableHeaderModel[] = [
    {
      title: "pending-actions.batch-name",
      type: TableHeaderType.BUTTON,
      fieldName: 'batchName',
      controlOptions: {id: "batchName", text: "batchName"}
    },
    {
      title: "pending-actions.from-account",
      type: TableHeaderType.TEXT,
      fieldName: 'accountNumber',
    },
    {
      title: "pending-actions.payment-date",
      type: TableHeaderType.DATE_TEXT,
      controlOptions: {format: 'dd/MM/yyyy'},
      fieldName: 'paymentDate'
    },
    // {
    //   title: "pending-actions.total-count",
    //   type: TableHeaderType.TEXT,
    //   fieldName: 'numberOfPayments'
    // },
    {
      title: "pending-actions.total-amount",
      type: TableHeaderType.TEXT,
      fieldName: 'totalAmount',
    },
    {
      title: "pending-actions.initiation-date",
      type: TableHeaderType.DATE_TEXT,
      controlOptions: {format: 'dd/MM/yyyy'},
      fieldName: 'initiationDate'
    },
    {
      title: "pending-actions.current-level",
      type: TableHeaderType.CURRENT_LEVEL,
      fieldName: "securityLevelsDTOList",
      controlOptions: getCurrentLevelControlOptions
    },
    {
      title: "pending-actions.next-level",
      type: TableHeaderType.NEXT_LEVEL,
      fieldName: "securityLevelsDTOList",
      controlOptions: {completed: "payments.userApproval.completed"}
    }];


  override buildTablePage(title: string, isApprove: boolean, data: BatchList, headers: TableHeaderModel[]): SummaryModel {
    let summaryModel: SummaryModel = super.buildTablePage(title, isApprove, data, headers);
    if (summaryModel['sections']) {
      summaryModel['sections'].forEach((section: any) => {
        section['title']['title'] = 'pending-actions.selected-salary-payments-batchs';
      })
    }
    return summaryModel;
  }

  override getSummary(title: string, isApprove: boolean, data: BatchList, headers: TableHeaderModel[]): SummaryModel {
    let length = 0;
    let summary: SummaryModel;
    if (data.notAllowed || data.toAuthorize || data.toProcess) {
      length = data.notAllowed.length + (data.toAuthorize ? data.toAuthorize.length : 0) + data.toProcess.length;
    }
    if (data.toReject && data.toReject.length > 0) {
      length = data.toReject.length;
    }
    // if (length && length >= 2) {
    if (length && length > 1) {
      summary = this.buildTablePage(title, isApprove, data, headers);
    } else {
      summary = this.buildSummaryPage(title, isApprove, data, headers);
    }
    return summary;
  }


  override createSummaryItem(type: 'Neutral' | 'Positive' | 'Negative', title: string, index: number, data: any, headers: TableHeaderModel[]): SummarySectionModel {
    let sections: SummarySectionModel = {
      pill: {
        text: 'Action #' + index,
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

    // headers.forEach((item: TableHeaderModel) => {

    //   switch (item.type) {
    //     case TableHeaderType.DATE_TEXT:
    //       sections.items?.push(this.getDateText(item, data));
    //       break;
    //     case TableHeaderType.CURRENT_LEVEL:
    //       sections.items?.push(this.getCurrentLevel(item, data));
    //       break;
    //     case TableHeaderType.NEXT_LEVEL:
    //       sections.items?.push(this.getNextLevel(item, data));
    //       break;
    //     case TableHeaderType.AMOUNT_TEXT:
    //       sections.items?.push(this.getAmount(item, data));
    //       break;
    //     default:
    //       sections.items?.push(this.getText(item, data));
    //       break;
    //   }

    // })
    return sections;
  }

  buildPayrollSingleSummary(title: string, data: any, type: string, details?: any): SummarySectionModel {
    let sections: SummarySectionModel = {
      items: []
    };

    if (data) {
      sections.title = {
        id: "",
        title: title
      };
    }
    if (type === 'file') {
      sections.items = getFileContentItemsSalaryPayments(data, details);
    } else if (type === 'summary')
      sections.items = getSummaryFeesItemsSalaryPaymentsOldPortal(data, details);
    else {
      const headers: any[] = getEmployeelistTableHeaders(data)
      data['employeeList'] = data['listEmployees']

      sections.table = getEmployeeTable(data['employeeList'] ? data['employeeList'] : [], headers)
    }
    return sections;
  }


  override buildSummaryPage(title: string, isApprove: boolean, data: any, headers: TableHeaderModel[]): SummaryModel {
    title = "pending-actions.summary"
    let summarySubTitle = "";
    let summary: SummaryModel = {
      title: this.getSummaryTitle(title, summarySubTitle),
    }
    let summarySections: SummarySectionModel[] = [];

    if (isApprove) {
      let counter = 0;
      data.toProcess.forEach((item: Batch, index: number) => {
        summarySections.push(this.buildPayrollSingleSummary('pending-actions.file-content', item, 'file', data['salaryPaymentDetails']));
        summarySections.push(this.buildPayrollSingleSummary('pending-actions.employee-list', item, ''));
        summarySections.push(this.buildPayrollSingleSummary('pending-actions.summary-fees', item, 'summary', data['salaryPaymentDetails']));
      });
      data.toAuthorize?.forEach((item: Batch, index: number) => {
        summarySections.push(this.buildPayrollSingleSummary('pending-actions.file-content', item, 'file', data['salaryPaymentDetails']));
        summarySections.push(this.buildPayrollSingleSummary('pending-actions.employee-list', item, ''));
        summarySections.push(this.buildPayrollSingleSummary('pending-actions.summary-fees', item, 'summary', data['salaryPaymentDetails']));
      });
      data.notAllowed.forEach((item: Batch, index: number) => {
        summarySections.push(this.buildPayrollSingleSummary('pending-actions.file-content', item, 'file', data['salaryPaymentDetails']));
        summarySections.push(this.buildPayrollSingleSummary('pending-actions.employee-list', item, ''));
        summarySections.push(this.buildPayrollSingleSummary('pending-actions.summary-fees', item, 'summary', data['salaryPaymentDetails']));
      });
      summary.sections = summarySections;
      return summary;
    } else {
      data.toReject.forEach((item: Batch, index: number) => {
        summarySections.push(this.buildPayrollSingleSummary('pending-actions.file-content', item, 'file', data['salaryPaymentDetails']));
      });
      summary.sections = summarySections;
      return summary;
    }
  }


}


export class payrollPlusMigrationPendingAction extends PendingActionModel {
  mapObject = {"P": "Pending"};

  constructor(private pendingActionsService: PendingActionsService, private _datePipe: DatePipe) {
    super(_datePipe);
  }

  override successApproveMessage = "pending-actions.selected-payroll-plus-approved";
  override successRejectMessage = "pending-actions.selected-payroll-plus-rejected";

  getPendingActions(data: PendingActionPagination): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.getPendingActionsService("payroll/wps-plus/pending/salary-payment/list", data).subscribe(res => {
        if (res) {
          // res.pendingPayrollList = mockPayrollPlus.pendingPayrollList;
          // res.pendingPayrollList['employeesList'] = employeeListMock;
        }
        observer.next(res.pendingPayrollList);
      });
    });
  }

  validatePendingActions(data: any): Observable<ValidatePendingActionsResponse> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("payroll/wps-plus/pending/salary-payment/validate", {batchList: data}).subscribe(res => {
        observer.next(res);
      });
    });
  }

  confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.putPendingActionsService("payroll/wps-plus/pending/salary-payment/confirm", {
        batchList: data,
        requestValidate
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }


  rejectPendingActions(data: any, rejectionReason: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.putPendingActionsService("chequeBook/pendingActions/stop/refuse", {
        batchList: data,
        rejectionReason
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }

  override table: TableHeaderModel[] = [
    {
      title: "pending-actions.batch-name",
      type: TableHeaderType.BUTTON,
      fieldName: 'accountNumber',
      controlOptions: {id: "accountNumber", text: "accountNumber"}
    },
    {
      title: "pending-actions.total-count",
      type: TableHeaderType.TEXT,
      fieldName: 'accountNumber'
    },
    {
      title: "pending-actions.initiation-date",
      type: TableHeaderType.DATE_TEXT,
      controlOptions: {format: 'dd/MM/yyyy'},
      fieldName: 'initiationDate'
    },
    {
      title: "pending-actions.status",
      type: TableHeaderType.TEXT,
      fieldName: 'typeCheck',
    },
    {
      title: "pending-actions.current-level",
      type: TableHeaderType.CURRENT_LEVEL,
      fieldName: "securityLevelsDTOList",
      controlOptions: getCurrentLevelControlOptions
    },
    {
      title: "pending-actions.next-level",
      type: TableHeaderType.NEXT_LEVEL,
      fieldName: "securityLevelsDTOList",
      controlOptions: {completed: "payments.userApproval.completed"}
    }];


  override buildSummaryPage(title: string, isApprove: boolean, data: BatchList, headers: TableHeaderModel[]): SummaryModel {
    title = "pending-actions.summary"
    let summarySubTitle = "";
    let summary: SummaryModel = {
      title: this.getSummaryTitle(title, summarySubTitle),
    }
    let summarySections: SummarySectionModel[] = [];

    if (isApprove) {
      let counter = 0;
      data.toProcess.forEach((item: Batch, index: number) => {
        // counter = counter + 1;
        // summarySections.push(this.createSummaryItem('Positive', 'pending-actions.actions-will-be-complete', counter, item, headers));
        summarySections.push(this.buildPayrollSingleSummary('pending-actions.file-content', item, 'file'));
        summarySections.push(this.buildPayrollSingleSummary('pending-actions.employee-list', item, ''));
        summarySections.push(this.buildPayrollSingleSummary('pending-actions.summary-fees', item, 'summary'));
      });
      data.toAuthorize?.forEach((item: Batch, index: number) => {
        // counter = counter + 1;
        summarySections.push(this.createSummaryItem('Neutral', 'pending-actions.actions-will-approved', counter, item, headers));
      });
      data.notAllowed.forEach((item: Batch, index: number) => {
        // counter = counter + 1;
        summarySections.push(this.createSummaryItem('Neutral', 'pending-actions.actions-will-approved', counter, item, headers));
      });
      summary.sections = summarySections;
      return summary;
    } else {
      data.toReject.forEach((item: Batch, index: number) => {
        summarySections.push(this.createSummaryItem('Neutral', "", index + 1, item, headers));
      });
      summary.sections = summarySections;
      return summary;
    }
  }

  override getSummary(title: string, isApprove: boolean, data: BatchList, headers: TableHeaderModel[]): SummaryModel {
    let length = 0;
    let summary: SummaryModel;
    if (data.notAllowed || data.toAuthorize || data.toProcess) {
      length = data.notAllowed.length + (data.toAuthorize ? data.toAuthorize.length : 0) + data.toProcess.length;
    }
    if (length && length >= 2) {
      summary = this.buildTablePage(title, isApprove, data, headers);
    } else {
      summary = this.buildSummaryPage(title, isApprove, data, headers);
    }
    return summary;
  }

  override buildTablePage(title: string, isApprove: boolean, data: BatchList, headers: TableHeaderModel[]): SummaryModel {
    let summaryModel: SummaryModel = super.buildTablePage(title, isApprove, data, headers);
    if (summaryModel['sections']) {
      summaryModel['sections'].forEach((section: any) => {
        section['title']['title'] = 'pending-actions.selected-migration-batchs';
      })
    }
    return summaryModel;
  }

  buildPayrollSingleSummary(title: string, data: any, type: string): SummarySectionModel {

    let sections: SummarySectionModel = {
      items: []
    };

    if (data) {
      sections.title = {
        id: "",
        title: title
      };
    }

    if (type === 'file') {
      sections.items = getFileContentItemsMigrationOpenAccount(data);
    } else if (type === 'summary')
      sections.items = getSummaryFeesItemsMigrationOpenAccount(data);
    else {
      const headers: any[] = getEmployeelistTableHeadersOpenAccount(data)
      sections.table = getEmployeeTable(data['employeeList'] ? data['employeeList']['items'] : [], headers)
    }
    return sections;
  }

  override createSummaryItem(type: 'Neutral' | 'Positive' | 'Negative', title: string, index: number, data: any, headers: TableHeaderModel[]): SummarySectionModel {
    let sections: SummarySectionModel = {
      pill: {
        text: 'Action #' + index,
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

    // headers.forEach((item: TableHeaderModel) => {

    //   switch (item.type) {
    //     case TableHeaderType.DATE_TEXT:
    //       sections.items?.push(this.getDateText(item, data));
    //       break;
    //     case TableHeaderType.CURRENT_LEVEL:
    //       sections.items?.push(this.getCurrentLevel(item, data));
    //       break;
    //     case TableHeaderType.NEXT_LEVEL:
    //       sections.items?.push(this.getNextLevel(item, data));
    //       break;
    //     case TableHeaderType.AMOUNT_TEXT:
    //       sections.items?.push(this.getAmount(item, data));
    //       break;
    //     default:
    //       sections.items?.push(this.getText(item, data));
    //       break;
    //   }

    // })
    return sections;
  }
}

export function getEmployeelistTableHeaders(data: any): TableHeaderModel[] {
  return [
    {
      title: "pending-actions.employee-no",
      type: TableHeaderType.TEXT,
      fieldName: 'civilianId'
    },
    {
      title: "pending-actions.employee-name",
      type: TableHeaderType.TEXT,
      fieldName: 'name'
    },
    {
      title: "pending-actions.civilian-id",
      type: TableHeaderType.TEXT,
      fieldName: 'bankNameEn'
    },
    {
      title: "pending-actions.bank",
      type: TableHeaderType.TEXT,
      fieldName: 'employeeReference'
    },
    {
      title: "pending-actions.account-number",
      type: TableHeaderType.TEXT,
      fieldName: 'account'
    },
    {
      title: "pending-actions.employee-nickname",
      type: TableHeaderType.TEXT,
      fieldName: 'employeeReference'
    },
    {
      title: "pending-actions.total-salary",
      type: TableHeaderType.TEXT,
      fieldName: 'salary',
    },
    {
      title: "pending-actions.basic-salary",
      type: TableHeaderType.TEXT,
      fieldName: 'salaryBasic',
    },
    {
      title: "pending-actions.housing-allowance",
      type: TableHeaderType.TEXT,
      fieldName: 'allowanceHousing',
    },
    {
      title: "pending-actions.other-allowance",
      type: TableHeaderType.TEXT,
      fieldName: 'allowanceOther',
    },
    {
      title: "pending-actions.deduction",
      type: TableHeaderType.TEXT,
      fieldName: 'deductions',
    },
    {
      title: "pending-actions.department",
      type: TableHeaderType.TEXT,
      fieldName: 'departmentId',
    },
    {
      title: "pending-actions.remarks",
      type: TableHeaderType.TEXT,
      fieldName: 'remarks',
    },
    // {
    //   title: "pending-actions.current-level",
    //   type: TableHeaderType.CURRENT_LEVEL,
    //   fieldName: "securityLevelsDTOList",
    //   controlOptions: getCurrentLevelControlOptions
    // },
    // {
    //   title: "pending-actions.next-level",
    //   type: TableHeaderType.NEXT_LEVEL,
    //   fieldName: "securityLevelsDTOList",
    //   controlOptions: { completed: "payments.userApproval.completed" }
    // }
  ];
}

export function getEmployeeTable(data: any, headers: TableHeaderModel[]): SummaryTable {
  return {
    columnId: "employeePk",
    headers: headers,
    maxDisplayRow: 5,
    data,
  }
}

export function getEmployeelistTableHeadersOpenAccount(data: any): TableHeaderModel[] {
  return [
    {
      title: "pending-actions.employee-no",
      type: TableHeaderType.TEXT,
      fieldName: 'civilianId'
    },
    {
      title: "pending-actions.employee-nickname",
      type: TableHeaderType.TEXT,
      fieldName: 'employeeReference'
    },
    // {
    //   title: "pending-actions.employee-name",
    //   type: TableHeaderType.TEXT,
    //   fieldName: 'name'
    // },
    {
      title: "pending-actions.civilian-id",
      type: TableHeaderType.TEXT,
      fieldName: 'bankNameEn'
    },
    {
      title: "pending-actions.mobile-number",
      type: TableHeaderType.TEXT,
      fieldName: 'mobileNumber'
    },
    {
      title: "pending-actions.employee-contract-start-date",
      type: TableHeaderType.TEXT,
      fieldName: 'startDate'
    },
    {
      title: "pending-actions.birth-date",
      type: TableHeaderType.TEXT,
      fieldName: 'birthDate'
    },
    {
      title: "pending-actions.total-salary",
      type: TableHeaderType.TEXT,
      fieldName: 'salary',
    },
    {
      title: "pending-actions.basic-salary",
      type: TableHeaderType.TEXT,
      fieldName: 'salaryBasic',
    },
    {
      title: "pending-actions.housing-allowance",
      type: TableHeaderType.TEXT,
      fieldName: 'allowanceHousing',
    },
    {
      title: "pending-actions.other-allowance",
      type: TableHeaderType.TEXT,
      fieldName: 'allowanceOther',
    },
    {
      title: "pending-actions.deduction",
      type: TableHeaderType.TEXT,
      fieldName: 'deductions',
    },
    {
      title: "pending-actions.department",
      type: TableHeaderType.TEXT,
      fieldName: 'departmentId',
    },
    {
      title: "pending-actions.remarks",
      type: TableHeaderType.TEXT,
      fieldName: 'remarks',
    },
  ];
}


export function getFileContentItemsSalaryPayments(data: any, details: any): SummaryItemModel[] {
  return [
    {
      title: 'pending-actions.debit-account-number',
      subTitle: data['accountNumber']
    }, {
      title: 'pending-actions.debit-account-nickname',
      subTitle: data['accountAlias'],
    }, {
      title: 'pending-actions.payment-date',
      subTitle: data['paymentDate']
    }, {
      title: 'pending-actions.company-remarks',
      subTitle: data['remarks']
    }, {
      title: 'pending-actions.customer-reference',
      subTitle: data['payrollFileHeader'] ? data['payrollFileHeader']['fileReference'] : data['fileReference']
    }, {
      title: 'pending-actions.mol-id',
      subTitle: details ? details['molId'] : ''
    }, {
      title: 'pending-actions.payment-purpose',
      subTitle: data['paymentPurpose']
    }, {
      title: 'pending-actions.initiated-by',
      subTitle: data['initiatedBy']
    }, {
      title: 'pending-actions.initiated-date',
      subTitle: data['initiationDate']
    }
  ]
}

export function getFileContentItemsMigrationOpenAccount(data: any): SummaryItemModel[] {
  return [
    {
      title: 'pending-actions.batch-name',
      subTitle: data['batchName']
    }, {
      title: 'pending-actions.initiated-by',
      subTitle: data['']
    }, {
      title: 'pending-actions.initiated-date',
      subTitle: data['initiationDate']
    },
    {
      title: 'pending-actions.file-type',
      subTitle: data['fileType']
    }
  ]
}

export function getSummaryFeesItemsSalaryPayments(data: any, details: any): SummaryItemModel[] {
  return [
    {
      title: 'pending-actions.total-amount-payroll-plus',
      subTitle: data['amount']
    }, {
      title: 'pending-actions.total-fees-payroll-plus',
      subTitle: details ? details['totalFeesRajhi'] : ''
    }, {
      title: 'pending-actions.count-of-payroll-plus-records',
      subTitle: data['rajhiRecordCount'] ? data['rajhiRecordCount'] : 0
    }, {
      title: 'pending-actions.subtotal-amount',
      subTitle: details ? details['totalEstimated'] : '',
    }]
}

export function getSummaryFeesItemsSalaryPaymentsOldPortal(data: any, details: any): SummaryItemModel[] {
  console.log("🚀 ~ file: payroll-plus.ts:904 ~ getSummaryFeesItemsSalaryPayments ~ details:", details)
  return [
    {
      title: 'pending-actions.numberOfEmployee',
      subTitle: details ? details['numEmployees'] : ''
    }, {
      title: 'pending-actions.numberRajhiTransfer',
      subTitle: details ? details['numRajhiTransfers'] : ''
    }, {
      title: 'pending-actions.numberNonRajhiTransfer',
      subTitle: details ? details['numNonRajhiTransfers'] : ''
    }, {
      title: 'pending-actions.rajhiRecordFeesAmount',
      subTitle: details ? details['totalFeesRajhi'] : '',
    }, {
      title: 'pending-actions.nonRajhiRecordFeesAmount',
      subTitle: details ? details['totalFeesNonRajhi'] : ''
    }, {
      title: 'pending-actions.total-amount',
      subTitle: details ? details['totalAmount'] : ''
    }, {
      title: 'pending-actions.totalRajhiTransfer',
      subTitle: details ? details['totalNumRajhi'] : ''
    }, {
      title: 'pending-actions.totalNonRajhiTransfer',
      subTitle: details ? details['totalNumNonRajhi'] : ''
    }, {
      title: 'pending-actions.total_rajhi_fee',
      subTitle: details ? details['totalFeesRajhi'] : '',
    }, {
      title: 'pending-actions.totalFeesNonRajhi',
      subTitle: details ? details['totalFeesNonRajhi'] : ''
    },]
}

export function getSummaryFeesItemsMigrationOpenAccount(data: any): SummaryItemModel[] {
  return [
    {
      title: 'pending-actions.count-of-payroll-plus-records',
      subTitle: data['batchPk'] ? data['batchPk'] : 3
    }]
}

export function isEmptyList(responseList: []): [] {
  return responseList && responseList.length > 0 ? responseList : [];
}


export function getExtraFields(selectedData: any, response: any) {
  let listResponse: any[] = []
  listResponse.push(...isEmptyList(response['notAllowed']));
  listResponse.push(...isEmptyList(response['toProcess']));
  listResponse.push(...isEmptyList(response['toAuthorize']));

  selectedData.forEach((pendingSelected: any) => {
    listResponse.forEach((validateResponse: any) => {
      if (pendingSelected.batchPk === validateResponse.batchPk) {
        validateResponse['securityLevelsDTOList'] = pendingSelected['securityLevelsDTOList'];
        // validateResponse['beneficiaryName'] = pendingSelected['beneficiaryName'];
        // validateResponse['alias'] = pendingSelected['alias'];
        // validateResponse['beneficiaryAccount'] = pendingSelected['beneficiaryAccount'];
        // validateResponse['bankName'] = pendingSelected['bankName'];
        // validateResponse['debitAmount'] = pendingSelected['debitAmount'];
        // validateResponse['batchType'] = pendingSelected['batchType'];
        // validateResponse['country'] = pendingSelected['country'];
        // validateResponse['securityDetails'] = pendingSelected['securityDetails'];
      }
    })
  })
}

export function reviewBatchObject(object: any): any | null {
  const batchFormat: any = {
    notAllowed: [],
    toAuthorize: [],
    toProcess: [],
  };

  if (object['notAllowed'].length > 0) {
    object['notAllowed'].forEach((element: any) => {
      batchFormat.notAllowed.push(element)
    });
  }
  if (object['toProcess'].length > 0) {
    object['toProcess'].forEach((element: any) => {
      batchFormat.toProcess.push(element)
    });
  }
  if (object['toAuthorize'].length > 0) {
    object['toAuthorize'].forEach((element: any) => {
      batchFormat.toAuthorize.push(element)
    });
  }
  return batchFormat
}

export function buildBatchList(specificResponse: any): any {
  const batch = reviewBatchObject(specificResponse)
  return batch;
}

export function getBatchValidateSelected(response: any): any {

  const finalData: any = {
    notAllowed: [],
    toAuthorize: [],
    toProcess: [],
  };
  const totalBatch: any[] = []

  if (response['batchContainer']) {
    totalBatch.push(buildBatchList(response['batchContainer']));
  }
  // if (response['localAuthorizationPermission']) {
  //   totalBatch.push(buildBatchList(response['localAuthorizationPermission']));
  // }
  // if (response['ownAuthorizationPermission']) {
  //   totalBatch.push(buildBatchList(response['ownAuthorizationPermission']));
  // }
  // if (response['withinAuthorizationPermission']) {
  //   totalBatch.push(buildBatchList(response['withinAuthorizationPermission']));
  // }

  totalBatch.forEach((element: any, index) => {
    if (element['notAllowed'] && element['notAllowed'].length > 0) {
      finalData['notAllowed'].push(...element['notAllowed'])
    }
    if (element['toAuthorize'] && element['toAuthorize'].length > 0) {
      finalData['toAuthorize'].push(...element['toAuthorize'])
    }
    if (element['toProcess'] && element['toProcess'].length > 0) {
      finalData['toProcess'].push(...element['toProcess'])
    }
  });

  return finalData;
}


export function getbatchRefList(data: any): any[] {
  const batchRefList: any[] = [];
  data.forEach((batch: any) => {
    batchRefList.push(batch.batchReference)

  });

  return batchRefList
}
