import { PendingActionModel, PendingActionPage, PendingActionPagination, ValidatePendingActionsResponse, WorkflowType } from "../../../@core/model/dto/pending-actions-model";
import { PendingActionsService } from "../../../@core/service/pending-actions/pending-actions-service";
import { DatePipe } from "@angular/common";
import { TabModel } from "arb-design-library/model/tab.model";
import { Observable, Subscriber } from "rxjs";
import { RequestValidate } from "../../../@core/model/rest/common/otp.model";
import { TableHeaderModel } from "arb-design-library/model/table-header.model";
import { TableHeaderType } from "arb-design-library";
import { getCurrentLevelControlOptions } from "./current-level-control-options";
import { SummaryTable } from "arb-design-library/model/summary-section.model";

export class BeneficiariesPendingActionsPage implements PendingActionPage {

  constructor(private pendingActionsService: PendingActionsService, private datePipe: DatePipe, private counters: {[key: string]: number}) {
  }

  workflowType: WorkflowType[] = [{
    type: 'BW',
    isFinancial: false,
    text: "pending-actions.al-rajhi",
  }, {
    type: 'BL',
    isFinancial: false,
    text: "pending-actions.local",
  }, {
    type: 'BT',
    isFinancial: false,
    text: "pending-actions.International",
  }];
  title = "pending-actions.beneficiary";
  tabs: TabModel[] = buildTabs(this.counters);
  workflowTabs: TabModel[] = buildTabs();
  pendingActions: PendingActionModel[] = buildPendingAction(this.pendingActionsService, this.datePipe, this.counters);
}

export function buildPendingAction(pendingActionsService: PendingActionsService, datePipe: DatePipe, counters: any): PendingActionModel[] {
  let pendingActions: PendingActionModel[] = [];
  if (counters) {
    if (counters.hasOwnProperty('withinBeneficiary'))
      pendingActions.push(new RajhiBeneficiariesPendingAction(pendingActionsService, datePipe))
    if (counters.hasOwnProperty('localBeneficiary'))
      pendingActions.push(new LocalBeneficiariesPendingAction(pendingActionsService, datePipe))
    if (counters.hasOwnProperty('internationalBeneficiary'))
      pendingActions.push(new InternationalBeneficiariesPendingAction(pendingActionsService, datePipe))
  }
  return pendingActions;
}

export function buildTabs(counters?: any): TabModel[] {
  let tabs: TabModel[] = [];
  let tabCount: number = 0;
  if (counters) {
    if (counters.hasOwnProperty('withinBeneficiary')) {
      tabs.push({icon: 'arb-icon-Alrajhi', text: "pending-actions.al-rajhi", value: tabCount.toString() })
      tabCount++
    }
    if (counters.hasOwnProperty('localBeneficiary')) {
      tabs.push({icon: 'arb-icon-saudiBold', text: "pending-actions.local", value: tabCount.toString() })
      tabCount++
    }
    if (counters.hasOwnProperty('internationalBeneficiary')) {
      tabs.push({icon: 'arb-icon-world', text: "pending-actions.International", value: tabCount.toString() })
      tabCount++
    }
  }
  else {
    tabs.push(
      {
        text: "pending-actions.al-rajhi",
        value: "0",
      },
      {
        text: "pending-actions.local",
        value: "1",
      },
      {
        text: "pending-actions.International",
        value: "2",
      });
  }
  return tabs;
}


export class RajhiBeneficiariesPendingAction extends PendingActionModel {
  override serviceMapObjects = ["bankCode", "countryName", "backEndCountryCode", "batchTypes", "currency"];
  constructor(private pendingActionsService: PendingActionsService, private _datePipe: DatePipe) {
    super(_datePipe);
  }

  override successApproveMessage = "pending-actions.selected-beneficiaries-approved";
  override successRejectMessage = "pending-actions.selected-beneficiaries-rejected";

  getPendingActions(data: PendingActionPagination): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      let newData: any = data;
      newData['pending'] = true;
      this.pendingActionsService.getPendingActionsService("beneficiaries/batch/list", newData).subscribe(res => {
        res['beneficiaries']['items'] = res['beneficiaries']['items'].filter((transfer: any) => transfer['batchType'] === 'BW')
        observer.next(res.beneficiaries);
      });
    });
  }

  validatePendingActions(data: any): Observable<ValidatePendingActionsResponse> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("beneficiaries/pendingActions/validate", { beneficiaries: data }).subscribe(res => {
        const batchs = getBatchValidateSelected(res);
        getExtraFields(data, batchs)
        batchs['batchListAlrajhi'] = res['batchListAlrajhi']
        batchs['batchListInternational'] = res['batchListInternational']
        batchs['batchListLocal'] = res['batchListLocal']
        res['batchList'] = null;
        res['batchList'] = batchs
        res['generateChallengeAndOTP'] = res['generateChallengeAndOTP'];
        observer.next(res);
      });
    });
  }



  confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("beneficiaries/pendingActions/confirm", {
        batchListAlrajhi: data['batchListAlrajhi'],
        batchListLocal: data['batchListLocal'],
        batchListInternational: data['batchListInternational'],
        requestValidate
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }


  rejectPendingActions(data: any, reason: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("beneficiaries/pendingActions/refuse", {
        beneficiaries: data,
        reason
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }

  override table: TableHeaderModel[] = [
    {
      title: "pending-actions.beneficiary-name",
      type: TableHeaderType.TEXT,
      fieldName: 'beneficiaryName',
    },
    {
      title: "pending-actions.beneficiary-account",
      type: TableHeaderType.TEXT,
      fieldName: 'beneficiaryAccount',
    },
    {
      title: "pending-actions.currency",
      type: TableHeaderType.TEXT,
      fieldName: 'currency',
      mapObject: 'currency'
    },
    {
      title: "pending-actions.initiated-by",
      type: TableHeaderType.TEXT,
      fieldName: 'createdBy'
    },
    {
      title: "pending-actions.initiated-date",
      type: TableHeaderType.DATE_TEXT,
      controlOptions: { format: 'dd/MM/yyyy' },
      fieldName: 'initiationDate'
    },
    {
      title: "pending-actions.current-level",
      type: TableHeaderType.CURRENT_LEVEL,
      fieldName: "securityLevels",
      controlOptions: getCurrentLevelControlOptions
    },
    {
      title: "pending-actions.next-level",
      type: TableHeaderType.NEXT_LEVEL,
      fieldName: "securityLevels",
      controlOptions: { completed: "payments.userApproval.completed" }
    }
  ];



  override getSummaryTable(data: any, headers: any[]): SummaryTable {
    data['updater'] = getUpdater(data)
    return {
      columnId: "batchPk",
      headers: headers,
      maxDisplayRow: 5,
      data,
    }
  }






}

export class LocalBeneficiariesPendingAction extends PendingActionModel {
  override serviceMapObjects = ["bankCode", "countryName", "backEndCountryCode", "batchTypes", "currency"];
  constructor(private pendingActionsService: PendingActionsService, private _datePipe: DatePipe) {
    super(_datePipe);
  }

  override successApproveMessage = "pending-actions.selected-beneficiaries-approved";
  override successRejectMessage = "pending-actions.selected-beneficiaries-rejected";

  getPendingActions(data: PendingActionPagination): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      let newData: any = data;
      newData['pending'] = true;
      this.pendingActionsService.getPendingActionsService("beneficiaries/batch/list", newData).subscribe(res => {
        res['beneficiaries']['items'] = res['beneficiaries']['items'].filter((transfer: any) => transfer['batchType'] === 'BL')
        observer.next(res.beneficiaries);
      });
    });
  }

  validatePendingActions(data: any): Observable<ValidatePendingActionsResponse> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("beneficiaries/pendingActions/validate", { beneficiaries: data }).subscribe(res => {
        const batchs = getBatchValidateSelected(res);
        getExtraFields(data, batchs)
        batchs['batchListAlrajhi'] = res['batchListAlrajhi']
        batchs['batchListInternational'] = res['batchListInternational']
        batchs['batchListLocal'] = res['batchListLocal']
        res['batchList'] = null;
        res['batchList'] = batchs
        res['generateChallengeAndOTP'] = res['generateChallengeAndOTP'];
        observer.next(res);
      });
    });
  }



  confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("beneficiaries/pendingActions/confirm", {
        batchListAlrajhi: data['batchListAlrajhi'],
        batchListLocal: data['batchListLocal'],
        batchListInternational: data['batchListInternational'],
        requestValidate
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }


  rejectPendingActions(data: any, reason: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("beneficiaries/pendingActions/refuse", {
        beneficiaries: data,
        reason
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }

  override table: TableHeaderModel[] = [
    {
      title: "pending-actions.beneficiary-name",
      type: TableHeaderType.TEXT,
      fieldName: 'beneficiaryName',
    },
    {
      title: "pending-actions.beneficiary-account",
      type: TableHeaderType.TEXT,
      fieldName: 'beneficiaryAccount',
    },
    {
      title: "pending-actions.beneficiary-bank",
      type: TableHeaderType.TEXT,
      fieldName: 'bankName',
    },
    {
      title: "pending-actions.currency",
      type: TableHeaderType.TEXT,
      fieldName: 'currency',
      mapObject: 'currency'
    },
    {
      title: "pending-actions.initiated-by",
      type: TableHeaderType.TEXT,
      fieldName: 'createdBy'
    },
    {
      title: "pending-actions.initiated-date",
      type: TableHeaderType.DATE_TEXT,
      controlOptions: { format: 'dd/MM/yyyy' },
      fieldName: 'initiationDate'
    },
    {
      title: "pending-actions.current-level",
      type: TableHeaderType.CURRENT_LEVEL,
      fieldName: "securityLevels",
      controlOptions: getCurrentLevelControlOptions
    },
    {
      title: "pending-actions.next-level",
      type: TableHeaderType.NEXT_LEVEL,
      fieldName: "securityLevels",
      controlOptions: { completed: "payments.userApproval.completed" }
    }
  ];



  override getSummaryTable(data: any, headers: any[]): SummaryTable {
    data['updater'] = getUpdater(data)
    return {
      columnId: "batchPk",
      headers: headers,
      maxDisplayRow: 5,
      data,
    }
  }

}

export class InternationalBeneficiariesPendingAction extends PendingActionModel {
  override serviceMapObjects = ["bankCode", "countryName", "backEndCountryCode", "batchTypes", "currency"];
  constructor(private pendingActionsService: PendingActionsService, private _datePipe: DatePipe) {
    super(_datePipe);
  }

  override successApproveMessage = "pending-actions.selected-beneficiaries-approved";
  override successRejectMessage = "pending-actions.selected-beneficiaries-rejected";

  getPendingActions(data: PendingActionPagination): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      let newData: any = data;
      newData['pending'] = true;
      this.pendingActionsService.getPendingActionsService("beneficiaries/batch/list", newData).subscribe(res => {
        res['beneficiaries']['items'] = res['beneficiaries']['items'].filter((transfer: any) => transfer['batchType'] === 'BT')
        observer.next(res.beneficiaries);
      });
    });
  }

  validatePendingActions(data: any): Observable<ValidatePendingActionsResponse> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("beneficiaries/pendingActions/validate", { beneficiaries: data }).subscribe(res => {
        const batchs = getBatchValidateSelected(res);
        getExtraFields(data, batchs)
        batchs['batchListAlrajhi'] = res['batchListAlrajhi']
        batchs['batchListInternational'] = res['batchListInternational']
        batchs['batchListLocal'] = res['batchListLocal']
        res['batchList'] = null;
        res['batchList'] = batchs
        res['generateChallengeAndOTP'] = res['generateChallengeAndOTP'];
        observer.next(res);
      });
    });
  }



  confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("beneficiaries/pendingActions/confirm", {
        batchListAlrajhi: data['batchListAlrajhi'],
        batchListLocal: data['batchListLocal'],
        batchListInternational: data['batchListInternational'],
        requestValidate
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }


  rejectPendingActions(data: any, reason: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("beneficiaries/pendingActions/refuse", {
        beneficiaries: data,
        reason
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }

  override table: TableHeaderModel[] = [
    {
      title: "pending-actions.beneficiary-name",
      type: TableHeaderType.TEXT,
      fieldName: 'beneficiaryName',
    },
    {
      title: "pending-actions.country",
      type: TableHeaderType.TEXT,
      fieldName: 'country',
      mapObject: 'backEndCountryCode'
    },
    {
      title: "pending-actions.beneficiary-account",
      type: TableHeaderType.TEXT,
      fieldName: 'beneficiaryAccount',
    },
    {
      title: "pending-actions.beneficiary-bank",
      type: TableHeaderType.TEXT,
      fieldName: 'bankName',
    },
    {
      title: "pending-actions.currency",
      type: TableHeaderType.TEXT,
      fieldName: 'currency',
      mapObject: 'currency'
    },
    {
      title: "pending-actions.initiated-by",
      type: TableHeaderType.TEXT,
      fieldName: 'createdBy'
    },
    {
      title: "pending-actions.initiated-date",
      type: TableHeaderType.DATE_TEXT,
      controlOptions: { format: 'dd/MM/yyyy' },
      fieldName: 'initiationDate'
    },
    {
      title: "pending-actions.current-level",
      type: TableHeaderType.CURRENT_LEVEL,
      fieldName: "securityLevels",
      controlOptions: getCurrentLevelControlOptions
    },
    {
      title: "pending-actions.next-level",
      type: TableHeaderType.NEXT_LEVEL,
      fieldName: "securityLevels",
      controlOptions: { completed: "payments.userApproval.completed" }
    }
  ];



  override getSummaryTable(data: any, headers: any[]): SummaryTable {
    data['updater'] = getUpdater(data)
    return {
      columnId: "batchPk",
      headers: headers,
      maxDisplayRow: 5,
      data,
    }
  }

}

export function buildBatchList(specificResponse: any): any {
  const batch = reviewBatchObject(specificResponse)
  return batch;
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
        validateResponse['batchType'] = pendingSelected['batchType'];
        validateResponse['country'] = pendingSelected['country'];
        validateResponse['bankName'] = pendingSelected['bankName'];
        validateResponse['currency'] = pendingSelected['currency'];
        validateResponse['bankName'] = pendingSelected['bankName'];
        validateResponse['createdBy'] = pendingSelected['createdBy'];
        validateResponse['securityLevels'] = pendingSelected['securityLevels'];
      }
    })
  })
}


export function getUpdater(batch: any): void {
  batch.forEach((element: any) => {
    element['updater'] = element['securityLevelsDTOList'].length > 0 ? element['securityLevelsDTOList'][0]['updater'] : ''
  });
}

export function reviewBatchObject(object: any): any | null {

  const batchFormat: any = {
    notAllowed: [],
    toAuthorize: [],
    toProcess: [],
  };

  if (object['notAllowed'] && object['notAllowed'].length > 0) {
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

export function getBatchValidateSelected(response: any): any {

  const finalData: any = {
    notAllowed: [],
    toAuthorize: [],
    toProcess: [],
  };

  const totalBatch: any[] = []
  if (response['batchListAlrajhi']) {
    totalBatch.push(buildBatchList(response['batchListAlrajhi']));
  }
  if (response['batchListInternational']) {
    totalBatch.push(buildBatchList(response['batchListInternational']));
  }
  if (response['batchListLocal']) {
    totalBatch.push(buildBatchList(response['batchListLocal']));
  }

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
