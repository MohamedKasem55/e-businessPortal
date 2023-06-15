import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormModel } from 'app/@core/model/dto/formModel';
import { PopupOutputModel } from 'app/@core/model/dto/popup.model';
import { ResultModal } from 'app/@core/model/dto/result.modal';
import {
  ActivityLogsReq,
  AuditReporFileReq,
  deleteAuditReportFilesReq,
} from 'app/@core/model/rest/activity-logs/activity-logs';
import { KeyValueModel } from 'app/@core/model/rest/common/key-value.model';
import { CompanyUserList } from 'app/@core/model/rest/company-admin/user-management/users-list-res';
import { ActivityLogsService } from 'app/@core/service/activity-logs/activity-logs.service';
import { BreadcrumbService } from 'app/@core/service/base/breadcrumb.service';
import { ModelAndListService } from 'app/@core/service/base/modelAndList.service';
import { PopupService } from 'app/@core/service/base/popup.service';
import { UserManagementService } from 'app/@core/service/company-admin/user-management/users-managment.service';
import { TableHeaderType } from 'arb-design-library';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { PaginationValueModel } from 'arb-design-library/model/pagination.model';
import { TabModel } from 'arb-design-library/model/tab.model';
import { TableButtonOutputModel } from 'arb-design-library/model/table-button-output.model';
import { TableHeaderModel } from 'arb-design-library/model/table-header.model';
import {
  getActivityLogsFilterForm,
  getActivityTabs,
} from './activity-logs-controls';
import {userTypeEnum} from "../../../@core/model/rest/common/usert-type-enum";

@Component({
  selector: 'app-activity-logs',
  templateUrl: './activity-logs.component.html',
  styleUrls: ['./activity-logs.component.scss'],
})
export class ActivityLogsComponent implements OnInit {
  activityLogsFilterForm!: FormModel;
  tabs: TabModel[] = [];
  activityLogsTableHeaders: TableHeaderModel[] = [];
  auditReportFilesTableHeaders: TableHeaderModel[] = [];
  activityLogsTableData!: any[];
  auditReportFilesTableData!: any[];
  totalActivityLogs!: number;
  totalAuditReportFiles!: number;
  currentActiveTab: string = '';
  userType: string = '';
  isFileRequested: boolean = false;
  auditListData: any;
  paginationValue: PaginationValueModel = { page: 1, size: 50 };
  endButtons: ButtonModel[] = [
    {
      id: 'requestLogFile',
      text: 'activityLogs.requestLogFile',
      type: 'secondary',
    },
  ];
  resultEndButtons: ButtonModel[] = [
    {
      id: 'dashboardNavigation',
      type: 'secondary',
      text: 'activityLogs.dashboardNavigation',
    },
    {
      id: 'requestedFilesNavigation',
      type: 'primary',
      text: 'activityLogs.requestedFilesNavigation',
    },
  ];
  exportActivityLogsfileName: string = 'Activity Logs';
  exportAuditReportFilesfileName: string = 'Audit Report Files';
  logsTableDataRequest!: ActivityLogsReq;
  selectedLogFiles: KeyValueModel[] = [];

  requestedFilesEndButtons: ButtonModel[] = [
    {
      id: 'deleteFileBtn',
      text: 'activityLogs.deleteSelected',
      type: 'secondary',
      isDisable: true,
    },
  ];
  result: ResultModal = {
    type: 'Success',
    title: 'accounts.cheques.success',
    summary: undefined,
  };

  constructor(
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private activityLogsService: ActivityLogsService,
    private modelAndListService: ModelAndListService,
    private userManagementService: UserManagementService,
    private popupService: PopupService
  ) {
    this.userType = JSON.parse(sessionStorage.getItem('user')!).type;

    this.breadcrumbService.setBreadcrumb([
      {
        text: 'activityLogs.activitylogsTitle',
        url: '',
      },
    ]);
  }

  ngOnInit(): void {
    this.getLogsTableHeaders();
    this.activityLogsFilterForm = getActivityLogsFilterForm();
    if (this.userType == userTypeEnum.CA) {
      this.activityLogsFilterForm.controls['usersList'].hidden = false;
    }

    this.tabs = getActivityTabs();
    this.currentActiveTab = this.tabs[0]?.value;
    this.getAuditReportFilesTableHeaders();
    this.getInitialLogsTableData();
    this.getAuditReportFilesTableData();
  }

  setStaticLists() {
    this.modelAndListService
      .getList(['activityOperationLog', 'authoritiesLevel'])
      .subscribe((response) => {
        const operationsList = this.objectToKeyValue(
          response?.activityOperationLog
        );
        const authoritiesLevelList = this.objectToKeyValue(
          response?.authoritiesLevel
        );
        this.activityLogsFilterForm.controls[
          'operationsList'
        ].controlOptions.options = operationsList;
        this.activityLogsFilterForm.controls[
          'authorizersList'
        ].controlOptions.options = authoritiesLevelList;
      });
  }

  setUsersList() {
    this.userManagementService
      .getUsersList({ orderType: 'ASC', creationDateTo: '' })
      .subscribe((response) => {
        const usersList = response.companyUserList;
        this.activityLogsFilterForm.controls[
          'usersList'
        ].controlOptions.options = usersList;
      });
  }

  getLogsTableHeaders() {
    this.activityLogsTableHeaders.push(
      {
        title: 'activityLogs.operation',
        type: TableHeaderType.BUTTON,
        fieldName: 'operation',
        controlOptions: {
          id: 'operation',
          text: 'operation',
        },
      },
      {
        title: 'activityLogs.userId',
        type: TableHeaderType.TEXT,
        fieldName: 'userName',
      },
      {
        title: 'activityLogs.date',
        type: TableHeaderType.DATE_TEXT,
        fieldName: 'timeStamp',
        controlOptions: { format: 'dd/MM/yyyy' },
      },
      {
        title: 'activityLogs.time',
        type: TableHeaderType.DATE_TEXT,
        fieldName: 'timeStamp',
        controlOptions: { format: 'HH:mm:ss' },
      },
      {
        title: 'activityLogs.status',
        type: TableHeaderType.PILL,
        fieldName: 'status',
        controlOptions: {
          PositiveCondition: 'Paid',
          NegativeCondition: 'Cancelled',
          WarningCondition: 'Pending',
        },
      }
    );
  }

  getAuditReportFilesTableHeaders() {
    this.auditReportFilesTableHeaders.push({
      title: 'activityLogs.requested',
      fieldName: 'fullAccountNumber',
      type: TableHeaderType.BUTTON,
      controlOptions: {
        id: 'value',
        text: 'value',
      },
    });
  }

  setLogsTableDataRequest(options: ActivityLogsReq) {
    this.logsTableDataRequest = {
      authorities: options.authorities || 'All',
      operation: options.operation || 'allTransactions',
      dateFrom: options.dateFrom || undefined,
      dateTo: options.dateTo || undefined,
      order: 'date',
      orderType: 'desc',
      page: options.page || 1,
      rows: options.rows || 50,
      userId: '',
    };
  }

  externalPagination(data: PaginationValueModel) {
    this.logsTableDataRequest.page = data.page;
    this.logsTableDataRequest.rows = data.size;
    this.getLogsTableData();
  }

  getInitialLogsTableData() {
    this.setLogsTableDataRequest({});
    this.activityLogsService
      .getActivityLogs(this.logsTableDataRequest)
      .subscribe({
        next: (response) => {
          this.auditListData = response;
          this.activityLogsTableData = response.auditReporLines.items;
          this.totalActivityLogs = response.auditReporLines.total;
        },
        error: () => {
          this.activityLogsTableData = [];
        },
      });
  }

  getLogsTableData() {
    this.activityLogsService
      .getActivityLogs(this.logsTableDataRequest)
      .subscribe({
        next: (response) => {
          this.activityLogsTableData = response.auditReporLines.items;
          this.totalActivityLogs = response.auditReporLines.total;
        },
        error: () => {
          this.activityLogsTableData = [];
        },
      });
  }

  getAuditReportFilesTableData() {
    this.auditReportFilesTableData = [];
    let auditFileReq: AuditReporFileReq = {
      order: 'string',
      orderType: 'string',
      page: 1,
    };

    this.activityLogsService.getAuditReportFiles(auditFileReq).subscribe({
      next: (response) => {
        this.auditReportFilesTableData = this.arrayToKeyValue(
          response.auditReporfiles.items
        );
        this.totalAuditReportFiles = response.auditReporfiles.total;
      },
      error: () => {
        this.auditReportFilesTableData = [];
      },
    });
  }

  requestNewFile() {
    this.activityLogsService
      .requestNewFile(this.logsTableDataRequest)
      .subscribe({
        next: () => (this.isFileRequested = true),
        error: () => (this.isFileRequested = false),
      });
  }

  objectToKeyValue(object: any): KeyValueModel[] {
    let data: KeyValueModel[] = [];
    Object.keys(object).forEach((key) => {
      data.push({ key, value: object[key] });
    });
    return data;
  }

  arrayToKeyValue(arr: any[]): KeyValueModel[] {
    let data: KeyValueModel[] = [];
    arr.forEach((_, i) => {
      data.push({ key: i.toString(), value: arr[i] });
    });
    return data;
  }

  formatDate(obj: any) {
    return obj ? `${obj.year}-${obj.month}-${obj.day}` : '';
  }

  // event listeners

  onLogsTableFilterClicked() {
    this.setStaticLists();
    this.setUsersList();
    this.popupService
      .showPopup({ image: '', form: this.activityLogsFilterForm })
      .subscribe((res: PopupOutputModel) => {
        if (res.buttonId == 'search') {
          this.setLogsTableDataRequest({
            authorities:
              this.activityLogsFilterForm.controls['authorizersList'].value
                ?.key,
            operation:
              this.activityLogsFilterForm.controls['operationsList'].value?.key,
            userId:
              this.activityLogsFilterForm.controls['usersList'].value?.key,
            dateFrom: this.formatDate(
              this.activityLogsFilterForm.controls['fromDate'].value
            ),
            dateTo: this.formatDate(
              this.activityLogsFilterForm.controls['toDate'].value
            ),
          });
          this.getLogsTableData();
          this.popupService.dismiss();
        } else if (res.buttonId == 'reset') {
          this.resetLogsTableFilterForm();
        } else {
          this.popupService.dismiss();
        }
      });
  }

  resetLogsTableFilterForm() {
    this.activityLogsFilterForm.controls['operationsList'].setValue('');
    this.activityLogsFilterForm.controls['authorizersList'].setValue('');
    this.activityLogsFilterForm.controls['usersList'].setValue('');
  }

  onTitleActionsClick(id: string) {
    if (id === 'requestLogFile') {
      this.requestNewFile();
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  tabChanged(tabValue: string) {
    this.currentActiveTab = tabValue;
  }

  onFileNameClicked(tableRow: TableButtonOutputModel) {
    this.activityLogsService
      .downloadAuditReportFiles({
        parameter: tableRow?.displayedData?.value,
      })
      .subscribe({
        next: (binaryResponse) => {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(binaryResponse);
          link.download = tableRow?.displayedData?.value;
          link.click();
          link.remove();
        },
      });
  }

  OnAuditReportTableChecked(selectedValues: KeyValueModel[]) {
    this.selectedLogFiles = selectedValues;
    this.requestedFilesEndButtons[0].isDisable = !selectedValues.length;
  }

  onButtonClick(formButtonClickOutput: string) {
    switch (formButtonClickOutput) {
      case 'dashboardNavigation':
        this.router.navigate(['dashboard']);
        break;
      case 'requestedFilesNavigation':
        this.isFileRequested = false;
        this.currentActiveTab = this.tabs[1].value;
        break;
      default:
        break;
    }
  }

  onLogClicked($event: any) {
    let auditLinePk = $event.row.auditLinePk;
    this.router
      .navigate(['/user-profile/activity-logs/detail'], {
        queryParams: { auditLinePk },
      })
      .then(() => {});
  }

  onDeleteClicked(_: string) {
    const selectedValuesAsStrings: string[] = this.selectedLogFiles.map(
      (obj) => obj.value
    );
    const filesToDeleteReq: deleteAuditReportFilesReq = {
      auditReporfiles: selectedValuesAsStrings,
      errorCode: '',
      errorDescription: '',
      errorResponse: {},
      size: 0,
      total: 0,
    };
    this.activityLogsService
      .deleteAuditReportFiles(filesToDeleteReq)
      .subscribe({
        next: () => {
          this.getAuditReportFilesTableData();
        },
      });
  }
}
