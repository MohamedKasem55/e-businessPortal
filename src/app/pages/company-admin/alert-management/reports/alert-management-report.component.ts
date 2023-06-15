import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { PaginationValueModel } from "arb-design-library/model/pagination.model";
import { TableHeaderModel } from "arb-design-library/model/table-header.model";
import { TableHeaderType } from 'arb-design-library';
import { SmsAlertService } from 'app/@core/service/company-admin/alert-mangement/sms-alert.service';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { getSmsReportsSearchForm } from './alert-management-report-controls';
import { PopupService } from 'app/@core/service/base/popup.service';
import { PopupOutputModel } from 'app/@core/model/dto/popup.model';
import { FormModel } from 'app/@core/model/dto/formModel';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbService } from 'app/@core/service/base/breadcrumb.service';
import { SummaryItemModel } from 'arb-design-library/model/summary-item.model';
import { SummarySectionModel } from 'arb-design-library/model/summary-section.model';
import { Utils } from 'app/@core/utility/Utils';

@Component({
  selector: 'app-alert-management-report',
  templateUrl: './alert-management-report.component.html',
  styleUrls: []
})
export class AlertManagementReportComponent implements OnInit {

  containsOperatorFields: string[] = ["userId", "userName", "mobileNumber"]
  greterThanOperatorFields: string[] = ["regFromDate", "expiredFromDate", "maxSmsCountFrom", "smsReachedCountFrom"]
  lessThanOperatorFields: string[] = ["regToDate", "expiredToDate", "maxSmsCountTo", "smsReachedCountTo"]
  fieldMapping = new Map<string, string>([
    ["userId", "userId"],
    ["userName", "userName"],
    ["mobileNumber", "mobileNumber"],
    ["regFromDate", "registrationDate"],
    ["regToDate", "registrationDate"],
    ["expiredFromDate", "expiryDate"],
    ["expiredToDate", "expiryDate"],
    ["maxSmsCountFrom", "maxSmsCount"],
    ["maxSmsCountTo", "maxSmsCount"],
    ["smsReachedCountFrom", "smsReached"],
    ["smsReachedCountTo", "smsReached"],

  ]);

  filterIsActive = false;
  headers: TableHeaderModel[] = [];
  data: any[] | undefined;
  total: number = 0;
  paginationValue: PaginationValueModel = { page: 1, size: 10 };
  exportFileName: string = "company-admin.alert-management.sms-report"
  dataClone: any = [];
  searchForm!: FormModel;
  reqParams: any = {};
  startButton: ButtonModel = {
    id: 'startButton',
    type: 'primary',
    text: '',
    prefixIcon: '',
    isDisable: false,
  };

  registraion_amount!: string;
  max_sms_count_reg!: string;

  summaryDetails: SummaryItemModel[] = [
    {
      title: "company-admin.alert-management.fee-ammount",
      subTitle: "",
      currency: "SAR"
    },
    {
      title: "company-admin.alert-management.max-sms",
      subTitle: "",
    }];

  summarySection: SummarySectionModel = {
    items: this.summaryDetails
  };

  constructor(
    private router: Router,
    private popupService: PopupService,
    private alertService: SmsAlertService,
    private breadcrumbService: BreadcrumbService) {

    this.setBreadcrumb();
    let maxDate = Utils.getToday();
    maxDate.month +=1;
    this.searchForm= getSmsReportsSearchForm(maxDate);
  }

  ngOnInit(): void {

    this.drawPage();

  }

  onButtomEndButtonClicked() {
    this.router
      .navigate(['/company-admin/alert-management'], { queryParams: { type: 'subscribed' } })
      .then(() => { });
  }

  onTitleButtonClick(id: string) {
    console.log("Titile Button cliecked " + id)
    if (id == 'arrowTitle') {
      this.router
        .navigate(['/company-admin/alert-management'], { queryParams: { type: 'subscribed' } })
        .then(() => { });
    }
  }

  drawPage() {
    this.paginationValue = { page: 1, size: 20 };
    this.drawAndGetSmsReportList();
    this.filterIsActive = false;
    this.startButton.text = "public.back"
  }

  drawAndGetSmsReportList() {
    this.headers = [];
    this.total = 0;
    let headers: TableHeaderModel[] = [];
    const privilegeMapping = { 'Y': true, 'N': false }
    headers.push({
      type: TableHeaderType.TEXT,
      title: "company-admin.alert-management.user-id",
      fieldName: "userId"
    });
    headers.push({
      type: TableHeaderType.TEXT,
      title: "company-admin.alert-management.name",
      fieldName: "userName"
    });
    headers.push({
      type: TableHeaderType.TEXT,
      title: "company-admin.alert-management.mobile-number",
      fieldName: "mobileNumber"
    });
    headers.push({
      type: TableHeaderType.CHECK_BOX,
      title: "company-admin.alert-management.alert-privilage",
      fieldName: "alertPrivilegesFlag"
    });
    headers.push({
      type: TableHeaderType.DATE_TEXT,
      title: "company-admin.alert-management.reg-date",
      fieldName: "registrationDate",
      controlOptions: { format: "dd/MM/yyyy" }
    });
    headers.push({
      type: TableHeaderType.DATE_TEXT,
      title: "company-admin.alert-management.expiry-date",
      fieldName: "expiryDate",
      controlOptions: { format: "dd/MM/yyyy" }
    });
    headers.push({
      type: TableHeaderType.TEXT,
      title: "company-admin.alert-management.max-sms-count",
      fieldName: "maxSmsCount"
    });
    headers.push({
      type: TableHeaderType.TEXT,
      title: "company-admin.alert-management.sms-reached",
      fieldName: "smsReached"
    });

    this.headers = headers;
    this.alertService.getSmsReportList().subscribe({
      next: data => {
        this.data = data.reportList;
        this.data.forEach((element) => {
          if (element.alertPrivileges === 'N') {
            element.alertPrivilegesFlag = false
          } else if (element.alertPrivileges === 'Y') {
            element.alertPrivilegesFlag = true
          }
        });
        this.dataClone = structuredClone(this.data);
        this.total = data.reportList.length;
        this.summaryDetails[0].subTitle = data.feeAmountEachReg.toString();
        this.summaryDetails[1].subTitle = data.maxSmsEachReg.toString();
      },
      error: () => {
        this.data = [];
      }
    });
  }

  openSearch() {

    this.popupService.showPopup({ image: '', form: this.searchForm }).subscribe((res: PopupOutputModel) => {
      if (res.buttonId == "search") {
        let reqParams = this.reqParams;

        res.controls!["userId"].value || res.controls!["userId"].value.trim() == '' ? reqParams.userId = res.controls!["userId"].value : null;
        res.controls!["name"].value || res.controls!["name"].value.trim() == '' ? reqParams.userName = res.controls!["name"].value : null;
        res.controls!["mobileNumber"].value || res.controls!["mobileNumber"].value.trim() == '' ? reqParams.mobileNumber = res.controls!["mobileNumber"].value : null;


        res.controls!["regFromDate"].value ? reqParams.regFromDate = this.convertNgbStructToString(res.controls!["regFromDate"].value) : null;
        res.controls!["regToDate"].value ? reqParams.regToDate = this.convertNgbStructToString(res.controls!["regToDate"].value) : null;

        res.controls!["expiredFromDate"].value ? reqParams.expiredFromDate = this.convertNgbStructToString(res.controls!["expiredFromDate"].value) : null;
        res.controls!["expiredToDate"].value ? reqParams.expiredToDate = this.convertNgbStructToString(res.controls!["expiredToDate"].value) : null;


        res.controls!["maxSmsCountFrom"].value || res.controls!["maxSmsCountFrom"].value.trim() == '' ? reqParams.maxSmsCountFrom = res.controls!["maxSmsCountFrom"].value : null;
        res.controls!["maxSmsCountTo"].value || res.controls!["maxSmsCountTo"].value.trim() == '' ? reqParams.maxSmsCountTo = res.controls!["maxSmsCountTo"].value : null;

        res.controls!["smsReachedCountFrom"].value || res.controls!["smsReachedCountFrom"].value.trim() == '' ? reqParams.smsReachedCountFrom = res.controls!["smsReachedCountFrom"].value : null;
        res.controls!["smsReachedCountTo"].value || res.controls!["smsReachedCountTo"].value.trim() == '' ? reqParams.smsReachedCountTo = res.controls!["smsReachedCountTo"].value : null;


        let expressions: BasicExpression[] = []

        Object.getOwnPropertyNames(this.reqParams).forEach(key => {
          let value = this.reqParams[key];

          if (this.fieldMapping.get(key) && value.trim().length > 0) {
            var mappedKey = this.fieldMapping.get(key)!.toString();
            var operation = "contains";
            if (this.greterThanOperatorFields.includes(key)) {
              operation = "greater_than";
            } else if (this.lessThanOperatorFields.includes(key)) {
              operation = "less_than"
            } else if (this.containsOperatorFields.includes(key)) {
              operation = "contains"
            }
            var isDate = false;
            if (key.includes("Date")) {
              isDate = true;
            }

            var obj: BasicExpression = {
              "key": mappedKey,
              "operation": operation,
              "value": value,
              "isDate": isDate
            }
            expressions.push(obj);
          }
        });
        const _result = this.dataClone?.filter((item: any) => expressions.every(expr => this.evaluateExpression(expr, item)))
        this.data = _result;
        this.filterIsActive = true;
        this.popupService.dismiss();
      } else if (res.buttonId == "reset") {
        this.reqParams = {};
        let maxDate = Utils.getToday()
        maxDate.month +=1
        this.searchForm = getSmsReportsSearchForm(maxDate);
        this.data = this.dataClone;
        this.filterIsActive = false;
        this.popupService.dismiss();
      } else if (res.buttonId == 'close') {
        this.popupService.dismiss();
      }
    });
  }

  evaluateExpression(expression: BasicExpression, obj: any): boolean {
    const { key, operation, value } = expression;
    const propValue = obj[key]
    switch (operation) {
      case "greater_than":
        if (expression.isDate) {
          return new Date(propValue) >= new Date(value);
        }
        else {
          return Number(propValue) >= Number(value);
        }
      case "less_than":
        if (expression.isDate) {
          return new Date(propValue) <= new Date(value);
        }
        else {
          return Number(propValue) <= Number(value);
        }
      case "contains": return new RegExp(value + "").test(propValue + "")
      case "equal":
      default:
        return propValue === value;
    }
  }

  convertNgbStructToString(value: NgbDateStruct): string {
    let transformDate;
    if (value) {
      transformDate = value.year + "-" + value.month + "-" + value.day
    }
    return transformDate ? transformDate : "";
  }

  setBreadcrumb() {
    this.breadcrumbService.setBreadcrumb([
      {
        text: 'company-admin.name',
        url: '/company-admin',
      },
      {
        text: 'company-admin.alert-management.alert-management-name',
        url: '/company-admin/alert-management',
        queryParams: { type: 'subscribed' }
      },
      {
        text: 'company-admin.alert-management.sms-report',
        url: ''
      },
    ]);
  }

  externalPagination(data: PaginationValueModel) {
  }
}

type BasicExpression = {
  key: string;
  operation: string, // "greater_than" | "less_than" | "equal" | "starts_with" | "contains",
  value: string | number;
  isDate: boolean;
}
