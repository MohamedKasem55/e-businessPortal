import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { POS, POS_NW_REQQ } from 'app/@core/constants/pages-urls-constants';
import { PopupOutputModel } from 'app/@core/model/dto/popup.model';
import { BreadcrumbService } from 'app/@core/service/base/breadcrumb.service';
import { RequestStatusService } from 'app/@core/service/pos/request-status/request-status.service';
import { TableHeaderType } from 'arb-design-library';
import { PaginationValueModel } from 'arb-design-library/model/pagination.model';
import { TabModel } from 'arb-design-library/model/tab.model';
import { TableHeaderModel } from 'arb-design-library/model/table-header.model';
import { FormModel } from '../../../@core/model/dto/formModel';
import { PopupService } from '../../../@core/service/base/popup.service';
import { getSearchForm } from './request-status-controls';

@Component({
  selector: 'app-request-status',
  templateUrl: './request-status.component.html',
})
export class RequestStatusComponent implements OnInit {
  tabs: TabModel[] = [];
  hasTabs: boolean = true;
  headers: TableHeaderModel[] = [];
  paginationValue: PaginationValueModel = { page: 1, size: 10 };
  type: string = '';
  data: any[] | undefined = undefined;
  total: number = 0;
  searchForm: FormModel = getSearchForm();
  exportFileName: string = 'requestStatus.title';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestStatusService: RequestStatusService,
    private breadcrumbService: BreadcrumbService,
    private popupService: PopupService
  ) {
    if (this.router.url == '/pos/new-request/request-status') {
      this.breadcrumbService.setBreadcrumb([
        {
          text: 'pos.dashboard.title',
          url: `/${POS}`,
        },
        {
          text: 'pos.new-request.title',
          url: `/${POS}/${POS_NW_REQQ}`,
        },
        {
          text: 'pos.new-request.request-status.title',
          url: '',
        },
      ]);
      this.hasTabs = false;
    } else {
      this.hasTabs = true;
      this.breadcrumbService.setBreadcrumb([
        {
          text: `pos.dashboard.title`,
          url: `/${POS}`,
        },
        {
          text: 'requestStatus.title',
          url: '',
        },
      ]);
      this.setTabs();
    }
  }

  setTabs() {
    this.tabs.push({
      text: 'requestStatus.newRequest',
      value: 'newRequestTable',
    });
    this.tabs.push({
      text: 'requestStatus.posManagementTableTitle',
      value: 'posManagementTable',
    });
    this.tabs.push({
      text: 'requestStatus.posMaintenanceTableTitle',
      value: 'posMaintenanceTable',
    });
    // this.tabs.push({
    //   text: 'requestStatus.claimsTableTitle',
    //   value: 'claimsTable',
    // });
    this.type = 'newRequestTable';
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.type = params.type ? params.type : 'newRequestTable';
      this.tabChanged(this.type);
    });
  }

  onFilterClick() {
    this.openSearch();
  }

  tabChanged(id: string) {
    this.type = id;
    this.paginationValue = { page: 1, size: 10 };
    this.searchForm.controls!['startDate'].setValue('');
    this.searchForm.controls!['endDate'].setValue('');
    switch (this.type) {
      case 'newRequestTable':
        this.setNewRequestTableHeaders();
        break;
      case 'posManagementTable':
        this.setPOSmanagementTableHeaders();
        break;
      case 'posMaintenanceTable':
        this.setPOSmaintenanceTableHeaders();
        break;
      case 'claimsTable':
        this.setClaimsTableTableHeaders();
        break;
    }
  }

  setClaimsTableTableHeaders() {
      const Status = { P: 'Pending', A: 'Approved', R: 'Rejected' };
      let headers: TableHeaderModel[] = [];
      this.data = undefined;

      headers.push({
        title: 'requestStatus.claimId',
        type: TableHeaderType.TEXT,
        fieldName: 'batchPk',
      });
      headers.push({
        title: 'requestStatus.terminalNumber',
        type: TableHeaderType.TEXT,
        fieldName: 'terminalNumber',
      });
      headers.push({
        title: 'requestStatus.transactionAmount',
        type: TableHeaderType.TEXT,
        fieldName: 'transactionAmount',
      });
      headers.push({
        title: 'requestStatus.initiationDate',
        type: TableHeaderType.DATE_TEXT,
        fieldName: 'initiationDate',
        controlOptions: { format: 'dd/MM/YYYY' },
      });
      headers.push({
        title: 'requestStatus.reconciliationAmount',
        type: TableHeaderType.TEXT,
        fieldName: 'reconciliationAmount',
      });
      headers.push({
        title: 'requestStatus.mobileNumber',
        type: TableHeaderType.TEXT,
        fieldName: 'mobile',
      });
      headers.push({
        title: 'requestStatus.status',
        type: TableHeaderType.TEXT,
        fieldName: 'status',
        mapObject: Status,
      });

      this.headers = headers;
    this.getTableData();
  }

  setPOSmanagementTableHeaders() {
      const Status = { P: 'Pending', A: 'Approved', R: 'Rejected' };
      let headers: TableHeaderModel[] = [];
      this.data = undefined;

      headers.push({
        title: 'requestStatus.terminalNumber',
        type: TableHeaderType.TEXT,
        fieldName: 'terminalNumber',
      });
      headers.push({
        title: 'requestStatus.requestType',
        type: TableHeaderType.TEXT,
        fieldName: 'typeRequest',
      });
      headers.push({
        title: 'requestStatus.contactName',
        type: TableHeaderType.TEXT,
        fieldName: 'contactName',
      });
      headers.push({
        title: 'requestStatus.mobileNumber',
        type: TableHeaderType.TEXT,
        fieldName: 'mobile',
      });
      headers.push({
        title: 'requestStatus.initiationDate',
        type: TableHeaderType.DATE_TEXT,
        fieldName: 'initiationDate',
        controlOptions: { format: 'dd/MM/YYYY' },
      });
      headers.push({
        title: 'requestStatus.currentStatus',
        type: TableHeaderType.CURRENT_LEVEL,
        fieldName: 'securityLevelsDTOList',
        controlOptions: {
          levelFieldName: 'level',
          statusFieldName: 'status',
          updaterFieldName: 'updater',
          dateFieldName: 'updateDate',
          dateFormat: 'dd/MM/yyyy',
        },
      });
      headers.push({
        title: 'requestStatus.nextStatus',
        type: TableHeaderType.NEXT_LEVEL,
        fieldName: 'securityLevelsDTOList',
        controlOptions: { completed: 'Completed' },
      });
      headers.push({
        title: 'requestStatus.status',
        type: TableHeaderType.TEXT,
        fieldName: 'status',
        mapObject: Status,
      });

      this.headers = headers;
    this.getTableData();
  }

  setPOSmaintenanceTableHeaders() {
      const Status = { P: 'Pending', A: 'Approved', R: 'Rejected' };
      let headers: TableHeaderModel[] = [];
      this.data = undefined;

      headers.push({
        title: 'requestStatus.terminalNumber',
        type: TableHeaderType.TEXT,
        fieldName: 'terminalNumber',
      });
      headers.push({
        title: 'requestStatus.requestType',
        type: TableHeaderType.TEXT,
        fieldName: 'typeRequest',
      });
      headers.push({
        title: 'requestStatus.contactName',
        type: TableHeaderType.TEXT,
        fieldName: 'contactName',
      });
      headers.push({
        title: 'requestStatus.mobileNumber',
        type: TableHeaderType.TEXT,
        fieldName: 'mobile',
      });
      headers.push({
        title: 'requestStatus.initiationDate',
        type: TableHeaderType.DATE_TEXT,
        fieldName: 'initiationDate',
        controlOptions: { format: 'dd/MM/YYYY' },
      });
      headers.push({
        title: 'requestStatus.currentStatus',
        type: TableHeaderType.CURRENT_LEVEL,
        fieldName: 'securityLevelsDTOList',
        controlOptions: {
          levelFieldName: 'level',
          statusFieldName: 'status',
          updaterFieldName: 'updater',
          dateFieldName: 'updateDate',
          dateFormat: 'dd/MM/yyyy',
        },
      });
      headers.push({
        title: 'requestStatus.nextStatus',
        type: TableHeaderType.NEXT_LEVEL,
        fieldName: 'securityLevelsDTOList',
        controlOptions: { completed: 'Completed' },
      });
      headers.push({
        title: 'requestStatus.status',
        type: TableHeaderType.TEXT,
        fieldName: 'status',
        mapObject: Status,
      });

      this.headers = headers;
    this.getTableData();
  }

  setNewRequestTableHeaders() {
      const Status = { P: 'Pending', A: 'Approved', R: 'Rejected' };
      let headers: TableHeaderModel[] = [];
      this.data = undefined;

      headers.push({
        title: 'requestStatus.accountNumber',
        type: TableHeaderType.TEXT,
        fieldName: 'accountNumber',
      });
      headers.push({
        title: 'requestStatus.requestType',
        type: TableHeaderType.TEXT,
        fieldName: 'typeRequest',
      });
      headers.push({
        title: 'requestStatus.contactName',
        type: TableHeaderType.TEXT,
        fieldName: 'contactName',
      });
      headers.push({
        title: 'requestStatus.mobileNumber',
        type: TableHeaderType.TEXT,
        fieldName: 'mobile',
      });
      headers.push({
        title: 'requestStatus.initiationDate',
        type: TableHeaderType.DATE_TEXT,
        fieldName: 'initiationDate',
        controlOptions: { format: 'dd/MM/YYYY' },
      });
      headers.push({
        title: 'requestStatus.currentStatus',
        type: TableHeaderType.CURRENT_LEVEL,
        fieldName: 'securityLevelsDTOList',
        controlOptions: {
          levelFieldName: 'level',
          statusFieldName: 'status',
          updaterFieldName: 'updater',
          dateFieldName: 'updateDate',
          dateFormat: 'dd/MM/yyyy',
        },
      });
      headers.push({
        title: 'requestStatus.nextStatus',
        type: TableHeaderType.NEXT_LEVEL,
        fieldName: 'securityLevelsDTOList',
        controlOptions: { completed: 'Completed' },
      });
      headers.push({
        title: 'requestStatus.status',
        type: TableHeaderType.TEXT,
        fieldName: 'status',
        mapObject: Status,
      });

      this.headers = headers;
    this.getTableData();
  }

  externalPagination(data: PaginationValueModel) {
    this.paginationValue = data;
    this.getTableData();
  }

  getTableData() {
    switch (this.type) {
      case 'newRequestTable':
        this.requestStatusService
          .getNewRequestStatusList({
            page: this.paginationValue.page - 1,
            rows: this.paginationValue.size,
          })
          .subscribe({
            next: (data) => {
              this.data = data.posRequestBatchList?.items;
              this.total = data.posRequestBatchList?.total!;
            },
            error: () => {
              this.data = [];
              this.total = 0;
            },
          });
        break;
      case 'posManagementTable':
        this.requestStatusService
          .getPOSManagementStatusList({
            page: this.paginationValue.page - 1,
            rows: this.paginationValue.size,
          })
          .subscribe({
            next: (data) => {
              this.data = data.posManagementBatchList?.items;
              this.total = data.posManagementBatchList?.total!;
            },
            error: () => {
              this.data = [];
              this.total = 0;
            },
          });
        break;
      case 'posMaintenanceTable':
        this.requestStatusService
          .getPOSMaintenanceStatusList({
            page: this.paginationValue.page - 1,
            rows: this.paginationValue.size,
          })
          .subscribe({
            next: (data) => {
              this.data = data.posMaintenanceBatchList?.items;
              this.total = data.posMaintenanceBatchList?.total!;
            },
            error: () => {
              this.data = [];
              this.total = 0;
            },
          });
        break;
      case 'claimsTable':
        this.requestStatusService
          .getClaimsStatusList({
            page: this.paginationValue.page - 1,
            rows: this.paginationValue.size,
          })
          .subscribe({
            next: (data) => {
              this.data = data.posClaimBatchList?.items;
              this.total = data.posClaimBatchList?.total!;
            },
            error: () => {
              this.data = [];
              this.total = 0;
            },
          });
        break;
    }
  }

  onTitleButtonsClick(titleButtonId: string) {
    if (titleButtonId === 'arrowTitle') this.router.navigateByUrl(POS);
    if (
      titleButtonId === 'arrowTitle' &&
      this.router.url == '/pos/new-request/request-status'
    ) {
      this.router.navigateByUrl(`/${POS}/${POS_NW_REQQ}`).then(() => {});
    }
  }

  getFormatDate(date: any): string {
    let day: string = '';
    let month: string = '';
    if (+date['day'] < 10) {
      day = '0' + date['day'];
    }
    if (+date['month'] < 10) {
      month = '0' + date['month'];
    }
    return (
      date.year +
      '-' +
      (month !== '' ? month : date.month) +
      '-' +
      (day !== '' ? day : date.day) +
      'T00:00:00.000Z'
    );
  }

  openSearch() {
    this.popupService
      .showPopup({ image: '', form: this.searchForm })
      .subscribe((res: PopupOutputModel) => {
        this.paginationValue = { page: 1, size: 10 };
        if (res.buttonId == 'search') {
          switch (this.type) {
            case 'newRequestTable':
              this.requestStatusService
                .getNewRequestStatusList({
                  dateFrom: res.controls!['startDate'].value
                    ? this.getFormatDate(res.controls!['startDate'].value)
                    : '',
                  dateTo: res.controls!['endDate'].value
                    ? this.getFormatDate(res.controls!['endDate'].value)
                    : '',
                })
                .subscribe((data) => {
                  (this.data = data.posRequestBatchList?.items),
                    (this.total = data.posRequestBatchList?.total!);
                });
              break;
            case 'posManagementTable':
              this.requestStatusService
                .getPOSManagementStatusList({
                  dateFrom: res.controls!['startDate'].value
                    ? this.getFormatDate(res.controls!['startDate'].value)
                    : '',
                  dateTo: res.controls!['endDate'].value
                    ? this.getFormatDate(res.controls!['endDate'].value)
                    : '',
                })
                .subscribe((data) => {
                  (this.data = data.posManagementBatchList?.items),
                    (this.total = data.posManagementBatchList?.total!);
                });
              break;
            case 'posMaintenanceTable':
              this.requestStatusService
                .getPOSMaintenanceStatusList({
                  dateFrom: res.controls!['startDate'].value
                    ? this.getFormatDate(res.controls!['startDate'].value)
                    : '',
                  dateTo: res.controls!['endDate'].value
                    ? this.getFormatDate(res.controls!['endDate'].value)
                    : '',
                })
                .subscribe((data) => {
                  (this.data = data.posMaintenanceBatchList?.items),
                    (this.total = data.posMaintenanceBatchList?.total!);
                });
              break;
            case 'claimsTable':
              this.requestStatusService
                .getClaimsStatusList({
                  dateFrom: res.controls!['startDate'].value
                    ? this.getFormatDate(res.controls!['startDate'].value)
                    : '',
                  dateTo: res.controls!['endDate'].value
                    ? this.getFormatDate(res.controls!['endDate'].value)
                    : '',
                })
                .subscribe((data) => {
                  (this.data = data.posClaimBatchList?.items),
                    (this.total = data.posClaimBatchList.total!);
                });
              break;
          }
          this.popupService.dismiss();
        } else if (res.buttonId == 'reset') {
          res.controls!['startDate'].setValue('');
          res.controls!['endDate'].setValue('');
          this.paginationValue = { page: 1, size: 10 };
          switch (this.type) {
            case 'newRequestTable':
              this.setNewRequestTableHeaders();
              break;
            case 'posManagementTable':
              this.setPOSmanagementTableHeaders();
              break;
            case 'posMaintenanceTable':
              this.setPOSmaintenanceTableHeaders();
              break;
            case 'claimsTable':
              this.setClaimsTableTableHeaders();
              break;
          }
          this.popupService.dismiss();
        } else {
          this.popupService.dismiss();
        }
      });
  }
}
