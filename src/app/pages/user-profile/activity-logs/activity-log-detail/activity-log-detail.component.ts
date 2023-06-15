import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AuditDetails,
  AuditReporFileReq,
} from 'app/@core/model/rest/activity-logs/activity-logs';
import { KeyValueModel } from 'app/@core/model/rest/common/key-value.model';
import { ActivityLogsService } from 'app/@core/service/activity-logs/activity-logs.service';
import { BreadcrumbService } from 'app/@core/service/base/breadcrumb.service';
import { ModelAndListService } from 'app/@core/service/base/modelAndList.service';
import { TableHeaderType } from 'arb-design-library';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { SummaryItemModel } from 'arb-design-library/model/summary-item.model';
import { SummarySectionModel } from 'arb-design-library/model/summary-section.model';
import { SummaryModel } from 'arb-design-library/model/summary.model';
import { TableHeaderModel } from 'arb-design-library/model/table-header.model';

@Component({
  selector: 'app-activity-log-detail',
  templateUrl: './activity-log-detail.component.html',
})
export class ActivityLogDetailComponent implements OnInit {
  activityLogSummarySection: SummarySectionModel[] = [];
  summary!: SummaryModel;
  summaryList: SummaryItemModel[] = [];
  summaryTitle: SummaryItemModel = {};
  summaryData: any;
  userType!: any;
  auditReport!: any;
  auditTransferType!: any;
  auditLinePk: string = '';
  fullData!: any;
  fieldCode: any = '';
  fieldValue: any = '';
  userTypeList!: Array<{ key: string; value: string }>;
  auditTransferTypeList!: Array<{ key: string; value: string }>;
  auditReportsList!: Array<{ key: string; value: string }>;
  currencyList!: Array<{ key: string; value: string }>;
  headers: TableHeaderModel[] = [];
  data!: Object[];
  resultEndButtons: ButtonModel[] = [
    {
      id: 'back',
      type: 'secondary',
      text: 'public.back',
    },
  ];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
    private modelAndListService: ModelAndListService,
    private activityLogsService: ActivityLogsService
  ) {
    this.breadcrumbService.setBreadcrumb([
      {
        text: 'activityLogs.activitylogsTitle',
        url: '/user-profile/activity-logs',
      },
      {
        text: 'activityLogs.details',
        url: '',
      },
    ]);

    this.modelAndListService
      .getList(['userType', 'auditTransferType', 'auditReports', 'currency'])
      .subscribe((res) => {
        this.userTypeList = this.objectToKeyValue(res.userType);
        this.auditReportsList = this.objectToKeyValue(res.auditReports);
        this.auditTransferTypeList = this.objectToKeyValue(
          res.auditTransferType
        );
        this.currencyList = this.objectToKeyValue(res.currency);
      });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((proms) => {
      this.auditLinePk = proms['auditLinePk'];
    });

    this.getActivityLogDetails();
    this.setActivityLogsDetailsTable();
  }

  activityLogSummary() {
    this.summaryList.push({
      title: 'activityLogs.userName',
      subTitle: this.summaryData.userName,
    });
    this.summaryList.push({
      title: 'activityLogs.userId',
      subTitle: this.summaryData.userId,
    });
    this.summaryList.push({
      title: 'activityLogs.organizationId',
      subTitle: this.summaryData.companyId,
    });
    this.summaryList.push({
      title: 'activityLogs.userType',
      subTitle: this.userType?.value,
    });
    this.summaryList.push({
      title: 'activityLogs.operation',
      subTitle: this.summaryData.operation,
    });
    this.summaryList.push({
      title: 'activityLogs.time',
      subTitle: this.summaryData.timeStamp,
    });

    this.activityLogSummarySection = [
      {
        title: {
          id: 'summaryTitle',
          type: 'Section',
          title: this.summaryData.operation,
        },
      },
      { items: this.summaryList },
    ];
  }

  onTitleButtonClick(id: string) {
    if (id == 'arrowTitle') {
      this.router.navigate(['/user-profile/activity-logs']).then(() => {});
    }
  }

  setActivityLogsDetailsTable() {
    this.modelAndListService.getList(['errors']).subscribe((data) => {
      let headers: TableHeaderModel[] = [];

      headers.push({
        title: 'activityLogs.fieldCode',
        type: TableHeaderType.TEXT,
        fieldName: 'fieldCode',
      });
      headers.push({
        title: 'activityLogs.fieldValue',
        type: TableHeaderType.TEXT,
        fieldName: 'fieldValue',
      });
      this.headers = headers;
    });
  }

  fillActivityLogsDetailsTable() {
    if (this.fullData.auditDetailLines?.size) {
      const list: Array<Object> = [];

      this.fullData.auditDetailLines.items.forEach((item: AuditDetails) => {
        this.fieldValue = item.fieldValue;

        this.auditReportsList.find((report) => {
          if (item.fieldCode == report.key) {
            this.fieldCode = report.value;
          }
        });

        this.auditTransferTypeList.find((type: { key: string; value: any }) => {
          if (this.fieldCode == 'Transfer Type') {
            let transferType = item.fieldValue.split('$', 3)[2];
            if (transferType == type.key) {
              this.fieldValue = type.value;
            }
          }
        });

        this.currencyList.find((currency: { key: string; value: any }) => {
          if (this.fieldCode == 'Currency') {
            let currencyType = item.fieldValue.split('$', 3)[2];
            if (currencyType == currency.key) {
              this.fieldValue = currency.value;
            }
          }
        });

        const object = {
          fieldCode: this.fieldCode,
          fieldValue: this.fieldValue,
        };

        list.push(object);
        this.data = list;
      });
    } else {
      this.data = [];
    }
  }

  async getActivityLogDetails() {
    let params: AuditReporFileReq = {
      auditPk: parseInt(this.auditLinePk),
      order: 'string',
      orderType: 'string',
      page: 1,
      rows: 1,
    };

    this.activityLogsService.getActivityLogDetails(params).subscribe((res) => {
      this.fullData = res;
      this.summaryData = res.auditReport;

      if (this.summaryData && this.fullData) {
        this.userType = this.userTypeList?.find((type) => {
          if (this.summaryData.userType == type.key) {
            return type.value;
          } else {
            return null;
          }
        });

        this.activityLogSummary();
        this.fillActivityLogsDetailsTable();
      }
    });
  }

  onBackButtonClick() {
    this.router.navigate(['/user-profile/activity-logs']).then(() => {});
  }

  objectToKeyValue(object: any): KeyValueModel[] {
    let data: KeyValueModel[] = [];
    Object.keys(object).forEach((key) => {
      data.push({ key, value: object[key] });
    });
    return data;
  }
}
