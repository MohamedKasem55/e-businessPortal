import {
  PendingActionModel,
  PendingActionPage,
  PendingActionPagination, ValidatePendingActionsResponse, WorkflowType
} from "../../../@core/model/dto/pending-actions-model";
import { PendingActionsService } from "../../../@core/service/pending-actions/pending-actions-service";
import { DatePipe } from "@angular/common";
import { TabModel } from "arb-design-library/model/tab.model";
import { Observable, Subscriber } from "rxjs";
import { RequestValidate } from "../../../@core/model/rest/common/otp.model";
import { TableHeaderModel } from "arb-design-library/model/table-header.model";
import { TableHeaderType } from "arb-design-library";
import { getCurrentLevelControlOptions } from "./current-level-control-options";
import { SummarySectionModel, SummaryTable } from "arb-design-library/model/summary-section.model";
import { SummaryModel } from "arb-design-library/model/summary.model";
import { Utils } from "app/@core/utility/Utils";
import { BatchList } from "app/@core/model/rest/common/batchResponse";
import { SummaryItemModel } from "arb-design-library/model/summary-item.model";
import { StatusPipe } from "app/@core/pipe/status-pipe";

export class WPSPayrollsPendingActionsPage implements PendingActionPage {
  mapObject = { "P": "Pending" };
  constructor(private pendingActionsService: PendingActionsService, private datePipe: DatePipe, private counters: { [key: string]: number }, private statusPipe: StatusPipe) {
  }

  title = "pending-actions.wps-payrolls";
  workflowType: WorkflowType[] = [{
    type: 'WL',
    isFinancial: true
  }, {
    type: 'WF',
    isFinancial: true
  }];
  tabs: TabModel[] = buildTabs(this.counters);
  workflowTabs: TabModel[] = buildTabs();
  pendingActions: PendingActionModel[] = buildPendingAction(this.pendingActionsService, this.datePipe, this.counters, this.statusPipe);
}

export function buildPendingAction(pendingActionsService: PendingActionsService, datePipe: DatePipe, counters: any, statusPipe: StatusPipe): PendingActionModel[] {
  let pendingActions: PendingActionModel[] = [];
  if (counters) {
    if (counters.hasOwnProperty('wpsPayrollPayment'))
      pendingActions.push(new SalaryPaymentsPendingAction(pendingActionsService, datePipe, statusPipe))
    if (counters.hasOwnProperty('wpsPayrollUploadFile'))
      pendingActions.push(new ImportPayrollPendingAction(pendingActionsService, datePipe))
  }
  return pendingActions;
}

export function buildTabs(counters?: any): TabModel[] {
  let tabs: TabModel[] = [];
  let tabCount: number = 0;
  if (counters) {
    if (counters.hasOwnProperty('wpsPayrollPayment')) {
      tabs.push({ text: "pending-actions.salary-payments", value: tabCount.toString() })
      tabCount++
    }
    if (counters.hasOwnProperty('wpsPayrollUploadFile')) {
      tabs.push({ text: "pending-actions.payroll", value: tabCount.toString() })
      tabCount++
    }
  } else {
    tabs.push(
      {
        text: "pending-actions.salary-payments",
        value: "0",
      },
      {
        text: "pending-actions.payroll",
        value: "1",
      });
  }
  return tabs;
}


export class SalaryPaymentsPendingAction extends PendingActionModel {
  // mapObject = {"PR": "Refund", "LD": "Load Fund"};
  mapObject = { "P": "Pending" };
  override singleSelection: boolean = true;

  constructor(private pendingActionsService: PendingActionsService, private _datePipe: DatePipe, private statusPipe: StatusPipe) {
    super(_datePipe);
  }


  override successApproveMessage = "pending-actions.selected-salary-payments-approved";
  override successRejectMessage = "pending-actions.selected-salary-payments-rejected";

  getPendingActions(data: PendingActionPagination): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.getPendingActionsService("payrollWPS/pendingActions/salary/list", data).subscribe(res => {
        res['pendingPayrollList']['maximumAllowedTransactions'] = res['maximumAllowedTransactions'];
        observer.next(res.pendingPayrollList);
      });
    });
  }

  validatePendingActions(data: any): Observable<ValidatePendingActionsResponse> {
    const date = new Date();
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("payrollWPS/pendingActions/salary/validate", {
        batch: data[0],
        paymentDate: date
      }).subscribe(res => {
        const batch: any = {};
        batch['generateChallengeAndOTP'] = res['generateChallengeAndOTP']
        batch['payrollCompanyDetails'] = res['payrollCompanyDetails']
        batch['payrollSalaryPaymentBatch'] = res['payrollSalaryPaymentBatch']
        batch['salaryPaymentDetails'] = res['salaryPaymentDetails']
        batch['selectedEmployeeList'] = res['selectedEmployeeList']
        batch['paymentDateMinus1'] = res['paymentDateMinus1']
        res['batchList'] = batch;
        observer.next(res);
      });
    });
  }

  confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("payrollWPS/pendingActions/salary/confirm", {
        payrollSalaryPaymentBatch: data['payrollSalaryPaymentBatch'],
        requestValidate
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }


  rejectPendingActions(data: any, rejectionReason: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("payrollWPS/pendingActions/salary/refuse", {
        batchDetails: data[0],
        rejectionReason
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }

  override table: TableHeaderModel[] = [
    {
      title: "pending-actions.initiation-date",
      type: TableHeaderType.DATE_TEXT,
      controlOptions: { format: 'dd/MM/yyyy' },
      fieldName: 'initiationDate'
    },
    { title: "pending-actions.payment-date", type: TableHeaderType.TEXT, fieldName: 'paymentDate' },
    { title: "pending-actions.batch-name", type: TableHeaderType.TEXT, fieldName: 'batchName' },
    { title: "pending-actions.remark", type: TableHeaderType.TEXT, fieldName: 'remarks' },
    { title: "pending-actions.account", type: TableHeaderType.TEXT, fieldName: 'accountNumber' },
    {
      title: "pending-actions.total-amount",
      type: TableHeaderType.AMOUNT_TEXT,
      controlOptions: { currency: "currency"   /*Account Currency*/ },
      fieldName: 'amount'
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
      controlOptions: { completed: "payments.userApproval.completed" }
    }];


  override getSummary(title: string, isApprove: boolean, data: BatchList, headers: TableHeaderModel[]): SummaryModel {
    let summary: SummaryModel;
    summary = this.buildSummaryPage(title, isApprove, data, headers);
    return summary;
  }

  override buildSummaryPage(title: string, isApprove: boolean, data: any, headers: TableHeaderModel[]): SummaryModel {
    title = "pending-actions.summary"
    let summarySubTitle = "";
    let summary: SummaryModel = {
      title: this.getSummaryTitle(title, summarySubTitle),
    }
    let summarySections: SummarySectionModel[] = [];
    const status = data['salaryPaymentDetails'] ? data['salaryPaymentDetails']['batchStatus'] : '';
    if (status === "PROCESS") {
      summarySections.push(this.buildPayrollSingleSummary('pending-actions.file-content', data, 'file', data['salaryPaymentDetails']));
      summarySections.push(this.buildPayrollSingleSummary('pending-actions.employee-list', data, ''));
      summarySections.push(this.buildPayrollSingleSummary('pending-actions.summary-fees', data, 'summary', data['salaryPaymentDetails']));
      summarySections.push(this.buildPayrollSingleSummary('pending-actions.salary-payments', data, 'salaryPayments'));
      summary.sections = summarySections;
      return summary;
    } else if (status === "PENDING") {
      summarySections.push(this.buildPayrollSingleSummary('pending-actions.file-content', data, 'file', data['salaryPaymentDetails']));
      summarySections.push(this.buildPayrollSingleSummary('pending-actions.employee-list', data, ''));
      summarySections.push(this.buildPayrollSingleSummary('pending-actions.summary-fees', data, 'summary', data['salaryPaymentDetails']));
      summarySections.push(this.buildPayrollSingleSummary('pending-actions.salary-payments', data, 'salaryPayments'));
      summary.sections = summarySections;
      return summary;
    } else {
      summarySections.push(this.buildPayrollSingleSummary('pending-actions.file-content', data['toReject'][0], 'file', data['salaryPaymentDetails']));
      summary.sections = summarySections;
      return summary;
    }
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
      sections.items = getFileContentItemsSalaryPayments(data, details, this.statusPipe);
    } else if (type === 'summary')
      sections.items = getSummaryFeesItemsSalaryPaymentsOldPortal(data, details);
    else if (type === 'salaryPayments') {
      const headers: any[] = getSalaryPaymentsTableHeaders(data)
      let salaryPaymentsTableList: any[] = [];
      salaryPaymentsTableList.push(this.buildList(data['payrollSalaryPaymentBatch']));
      data['salaryPaymentsTableList'] = salaryPaymentsTableList;
      sections.table = getSalaryPaymentsTable(data['salaryPaymentsTableList'] ? data['salaryPaymentsTableList'] : [], headers)
    }
    else {
      const headers: any[] = getEmployeelistTableHeaders(data)
      data['employeeList'] = data['selectedEmployeeList']
      sections.table = getEmployeeTable(data['employeeList'] ? data['employeeList'] : [], headers)
    }
    return sections;
  }
  buildList(data: any): any {
    let salaryPayment: any = {};
    salaryPayment['batchName'] = data['batchName'];
    salaryPayment['fileReference'] = data['fileReference'];
    salaryPayment['account'] = data['accountNumber'];
    salaryPayment['paymentDate'] = data['paymentDate'];
    salaryPayment['amount'] = data['amount'];
    salaryPayment['initiationDate'] = data['paymentDate'];
    salaryPayment['currentStatus'] = data['futureSecurityLevelsDTOList'];
    salaryPayment['nextStatus'] = data['futureSecurityLevelsDTOList'];
    salaryPayment['status'] = data['status'] === 'P' ? 'public.pendingAuthMessage' : data['status'];
    return salaryPayment
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

  getItemFields(type: 'Neutral' | 'Positive' | 'Negative', data: any, title: string, process?: string): SummarySectionModel {
    let sections: SummarySectionModel = {
      pill: {
        text: 'Action #' + '1',
        type,
      },
      items: process ? this.getWPSItems(data[0]) : this.getWPSItems(data['payrollSalaryPaymentBatch'])
    };

    if (title) {
      sections.title = {
        id: "",
        title
      };
    }
    return sections;
  }

  getWPSItems(data: any): any[] {
    let items: any = [
      {
        title: 'pending-actions.initiation-date',
        subTitle: data['initiationDate']
      },
      {
        title: 'pending-actions.payment-date',
        subTitle: data['paymentDate']
      }, {
        title: 'pending-actions.batch-name',
        subTitle: data['batchName']
      }, {
        title: 'pending-actions.remark',
        subTitle: data['remarks']
      }, {
        title: 'pending-actions.account',
        subTitle: data['accountNumber']
      }, {
        title: 'pending-actions.amount',
        subTitle: data['amount']
      }]
    items.push(this.getCurrentLevel(data))
    items.push(this.getNextLevel(data))
    return items;
  }

  override getCurrentLevel(data: any) {
    return Utils.getCurrentLevelSummaryItem(this.translate, data.futureSecurityLevelsDTOList);
  }

  override getNextLevel(data: any) {
    return Utils.getNextLevelSummaryItem(this.translate, data.futureSecurityLevelsDTOList);
  }
}


export class ImportPayrollPendingAction extends PendingActionModel {
  override singleSelection: boolean = false;
  mapObject = { "0": "Due Amount", "1": "Outstanding Amount", "2": "Custom" };


  constructor(private pendingActionsService: PendingActionsService, private _datePipe: DatePipe) {
    super(_datePipe);
  }

  override successApproveMessage = "pending-actions.selected-payroll-approved";
  override successRejectMessage = "pending-actions.selected-payroll-rejected";

  getPendingActions(data: PendingActionPagination): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.getPendingActionsService("payrollWPS/pendingActions/importPayroll/list", data).subscribe(res => {
        res['pendingPayrollUploadList']['maximumAllowedTransactions'] = res['maximumAllowedTransactions'];
        observer.next(res.pendingPayrollUploadList);
      });
    });
  }

  validatePendingActions(data: any): Observable<ValidatePendingActionsResponse> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("payrollWPS/pendingActions/importPayroll/validate", { batchList: data }).subscribe(res => {
        observer.next({
          batchList: res.batchList,
          generateChallengeAndOTP: res.generateChallengeAndOTP
        });
      });
    });
  }

  confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("payrollWPS/pendingActions/importPayroll/confirm", {
        batchList: data,
        requestValidate
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }

  rejectPendingActions(data: any, rejectionReason: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("payrollWPS/pendingActions/importPayroll/refuse", {
        batchDTOList: data,
        rejectionReason
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }

  override table: TableHeaderModel[] = [
    {
      title: "pending-actions.initiation-date",
      type: TableHeaderType.DATE_TEXT,
      controlOptions: { format: 'dd/MM/yyyy' },
      fieldName: 'initiationDate'
    },
    { title: "pending-actions.payment-date", type: TableHeaderType.TEXT, fieldName: 'paymentDate' },
    { title: "pending-actions.batch-name", type: TableHeaderType.TEXT, fieldName: 'batchName' },
    { title: "pending-actions.account", type: TableHeaderType.TEXT, fieldName: 'accountNumber' },
    {
      title: "pending-actions.total-amount",
      type: TableHeaderType.AMOUNT_TEXT,
      controlOptions: { currency: "currency"   /*Account Currency*/ },
      fieldName: 'amount'
    },
    { title: "pending-actions.rajhi-amount", type: TableHeaderType.TEXT, fieldName: 'rajhiRecordAmount' },
    { title: "pending-actions.local-amount", type: TableHeaderType.TEXT, fieldName: 'localRecordAmount' },
    { title: "pending-actions.rajhi-count", type: TableHeaderType.TEXT, fieldName: 'rajhiRecordCount' },
    { title: "pending-actions.local-count", type: TableHeaderType.TEXT, fieldName: 'localRecordCount' },
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
      controlOptions: { completed: "payments.userApproval.completed" }
    }];
}


export function getFileContentItemsSalaryPayments(data: any, details: any, statusPipe: any): SummaryItemModel[] {
  return [
    {
      title: 'pending-actions.batch-name',
      subTitle: details ? data['payrollSalaryPaymentBatch']['batchName'] : data['batchName'],
    },
    {
      title: 'pending-actions.debit-account-number',
      subTitle: details ? data['payrollSalaryPaymentBatch']['accountNumber'] : data['accountNumber'],
    }, {
      title: 'pending-actions.debit-account-nickname',
      subTitle: details ? data['payrollSalaryPaymentBatch']['accountAlias'] : data['accountAlias'],
    }, {
      title: 'pending-actions.payment-date',
      subTitle: details ? data['payrollSalaryPaymentBatch']['paymentDate'] : data['paymentDate'],
    }, {
      title: 'pending-actions.company-remarks',
      subTitle: details ? data['payrollSalaryPaymentBatch']['remarks'] : data['remarks']
    }, {
      title: 'pending-actions.customer-reference',
      subTitle: details ? data['payrollSalaryPaymentBatch']['fileReference'] : data['fileReference']
    }, {
      title: 'pending-actions.mol-id',
      subTitle: details ? data['payrollSalaryPaymentBatch']['molEstbId'] : data['molEstbId']
    }, {
      title: 'pending-actions.payment-purpose',
      subTitle: details ? data['payrollSalaryPaymentBatch']['paymentPurpose'] : data['paymentPurpose'],
    }, {
      title: 'pending-actions.initiated-by',
      subTitle: data['payrollSalaryPaymentBatch'] && data['payrollSalaryPaymentBatch']['securityLevelsDTOList'] ? data['payrollSalaryPaymentBatch']['securityLevelsDTOList'][0]['updater'] : data['securityLevelsDTOList'][0]['updater']
    }, {
      title: 'pending-actions.initiated-date',
      subTitle: details ? data['payrollSalaryPaymentBatch']['initiationDate'] : data['initiationDate']
    },
    {
      title: 'pending-actions.status',
      subTitle: details ? statusPipe.transform(data['payrollSalaryPaymentBatch']['status']) : statusPipe.transform(data['status']),
    }
  ]
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
  ];
}
export function getSalaryPaymentsTableHeaders(data: any): TableHeaderModel[] {
  return [
    {
      title: 'pending-actions.batch-name',
      type: TableHeaderType.TEXT,
      fieldName: 'batchName'
    },
    {
      title: 'pending-actions.customer-reference',
      type: TableHeaderType.TEXT,
      fieldName: 'fileReference'
    },
    {
      title: "pending-actions.account-number",
      type: TableHeaderType.TEXT,
      fieldName: 'account'
    },
    {
      title: 'pending-actions.payment-date',
      type: TableHeaderType.TEXT,
      fieldName: 'paymentDate'
    },
    {
      title: "pending-actions.amount",
      type: TableHeaderType.AMOUNT_TEXT,
      controlOptions: {  currency: "SAR" },
      fieldName: 'amount'
    },
    {
      title: 'pending-actions.initiated-date',
      type: TableHeaderType.TEXT,
      fieldName: 'initiationDate'
    },
    {
      title: "pending-actions.current-level",
      type: TableHeaderType.CURRENT_LEVEL,
      fieldName: "currentStatus",
      controlOptions: getCurrentLevelControlOptions
    },
    {
      title: "pending-actions.next-level",
      type: TableHeaderType.NEXT_LEVEL,
      fieldName: "nextStatus",
      controlOptions: { completed: "payments.userApproval.completed" }
    },
    {
      title: 'pending-actions.status',
      type: TableHeaderType.TEXT,
      fieldName: 'status',
    },
  ];
}

export function getSummaryFeesItemsSalaryPaymentsOldPortal(data: any, details: any): SummaryItemModel[] {
  return [
    {
      title: 'pending-actions.numberOfEmployee',
      subTitle: details ? details['numEmployees'].toString() : ''
    }, {
      title: 'pending-actions.numberRajhiTransfer',
      subTitle: details ? details['numRajhiTransfers'].toString() : ''
    }, {
      title: 'pending-actions.numberNonRajhiTransfer',
      subTitle: details ? details['numNonRajhiTransfers'].toString() : ''
    }, {
      title: 'pending-actions.rajhiRecordFeesAmount',
      subTitle: details ? details['totalFeesRajhi'].toString() : '', currency: "SAR"
    }, {
      title: 'pending-actions.nonRajhiRecordFeesAmount',
      subTitle: details ? details['localBankFee'].toString() : '', currency: "SAR"
    }, {
      title: 'pending-actions.total-amount',
      subTitle: details ? details['totalAmount'].toString() : '', currency: "SAR"
    }, {
      title: 'pending-actions.totalRajhiTransfer',
      subTitle: details ? details['totalNumRajhi'].toString() : '', currency: "SAR"
    }, {
      title: 'pending-actions.totalNonRajhiTransfer',
      subTitle: details ? details['totalNumNonRajhi'].toString() : '', currency: "SAR"
    }, {
      title: 'pending-actions.total_rajhi_fee',
      subTitle: details ? details['totalFeesRajhi'].toString() : '', currency: "SAR"
    }, {
      title: 'pending-actions.totalFeesNonRajhi',
      subTitle: details ? details['totalFeesNonRajhi'].toString() : '', currency: "SAR"
    }, {
      title: 'pending-actions.total-estimated-amount',
      subTitle: details ? details['totalEstimated'].toString() : '', currency: "SAR"
    }]
}

export function getEmployeeTable(data: any, headers: TableHeaderModel[]): SummaryTable {
  return {
    columnId: "employeePk",
    headers: headers,
    maxDisplayRow: 5,
    data,
  }
}
export function getSalaryPaymentsTable(data: any, headers: TableHeaderModel[]): SummaryTable {
  return {
    columnId: "fileReference",
    headers: headers,
    maxDisplayRow: 5,
    data,
  }
}
