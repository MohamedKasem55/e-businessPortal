import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { PaginationValueModel } from "arb-design-library/model/pagination.model";
import { TabModel } from "arb-design-library/model/tab.model";
import { TableHeaderModel } from "arb-design-library/model/table-header.model";
import { TableHeaderType } from 'arb-design-library';
import { Location } from "@angular/common";
import { SmsAlertService } from 'app/@core/service/company-admin/alert-mangement/sms-alert.service';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { getExpiredSearchForm, getSubscribedUserSearchForm, getTitleEndButtons } from './alert-management-controls';
import { PopupService } from 'app/@core/service/base/popup.service';
import { PopupOutputModel } from 'app/@core/model/dto/popup.model';
import { FormModel } from 'app/@core/model/dto/formModel';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbService } from 'app/@core/service/base/breadcrumb.service';
import { SmsAlertListRes, SmsAlertUser } from 'app/@core/model/rest/company-admin/alert-management/sms-alert-list-res';
import { Utils } from 'app/@core/utility/Utils';

@Component({
  selector: 'app-alert-management',
  templateUrl: './alert-management.component.html',
  styleUrls: []
})
export class AlertManagementComponent implements OnInit {

  containsOperatorFields: string[] = ["userId", "userName", "mobileNumber"]
  greterThanOperatorFields: string[] = ["regFromDate", "renewalFromDate", "expiredFromDate", "maxSmsCountFrom", "smsReachedCountFrom"]
  lessThanOperatorFields: string[] = ["regToDate", "renewalToDate", "expiredToDate", "maxSmsCountTo", "smsReachedCountTo"]
  fieldMapping = new Map<string, string>([
    ["userId", "userId"],
    ["userName", "userName"],
    ["mobileNumber", "mobileNumber"],
    ["regFromDate", "registrationDate"],
    ["regToDate", "registrationDate"],
    ["renewalFromDate", "renewalDate"],
    ["renewalToDate", "renewalDate"],
    ["expiredFromDate", "expiryDate"],
    ["expiredToDate", "expiryDate"],
    ["maxSmsCountFrom", "maxSmsCount"],
    ["maxSmsCountTo", "maxSmsCount"],
    ["smsReachedCountFrom", "smsReached"],
    ["smsReachedCountTo", "smsReached"],
  ]);

  filterIsActive = false;
  titleEndButton: ButtonModel[] = getTitleEndButtons();
  tabs: TabModel[] = [];
  type: string = "";
  headers: TableHeaderModel[] = [];
  data: any[] | undefined;
  total: number = 0;
  paginationValue: PaginationValueModel = { page: 1, size: 10 };
  exportFileName: string =  "company-admin.alert-management.alert-management-name"
  dataClone: any = [];
  selectedRows!: SmsAlertUser[];
  responseFormService!: SmsAlertListRes;
  searchForm!: FormModel;
  reqParams: any = {};
  searchPopupTab: string = "";
  endButton: ButtonModel = {
    id: 'endButton',
    type: 'primary',
    text: '',
    prefixIcon: '',
    isDisable: true,
  };


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private popupService: PopupService,
    private alertService: SmsAlertService,
    private breadcrumbService: BreadcrumbService) {

    this.setTabs();
    this.setBreadcrumb();
    let maxDate = Utils.getToday()
    maxDate.month +=1;
    this.searchForm = getSubscribedUserSearchForm(maxDate);
  }

  setTabs() {
    this.tabs.push({ text: "company-admin.alert-management.subscribed", value: "subscribed" });
    this.tabs.push({ text: "company-admin.alert-management.expired", value: "expired" });
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe((params: any) => {
        this.tabChanged(params.type);
      }
      );
  }

  onButtomEndButtonClicked() {
    if (this.type === "expired") {
      this.router.navigateByUrl("/company-admin/alert-management-sms-renewal", { state: this.buildRenewSubscription() }).then(() => {
      });
    }
    if (this.type === "subscribed") {
      this.router.navigateByUrl("/company-admin/alert-management-sms-deactivate", { state: this.buildRenewSubscription() }).then(() => {
      });
    }
    //TODo Need to implement to next ticket.
  }

  doValueChanged(data: any) {
    console.log("Selected value")
    console.log(data);
    this.selectedRows = data;
    if (this.selectedRows.length > 0) {
      this.endButton.isDisable = false;
    }
  }

  buildRenewSubscription(): SmsAlertListRes {
    return {
      feeAmountEachReg: this.responseFormService.feeAmountEachReg,
      maxSmsEachReg: this.responseFormService.maxSmsEachReg,
      listAccountSAR: this.responseFormService.listAccountSAR,
      reportList: this.selectedRows,
      errorDescription: this.responseFormService.errorDescription,
      errorResponse: this.responseFormService.errorResponse
    }
  }

  onTitleButtonClick(id: string) {
    if (id == 'arrowTitle') {
      this.router.navigateByUrl("/company-admin").then(() => {
      });
    }
    if (id == 'reports') {
      this.router.navigateByUrl("/company-admin/alert-management-report").then(() => {
      });
    }
    if (id == 'register_title') {
      this.router.navigateByUrl("/company-admin/alert-management-sms-register").then(() => {
      });
    }
  }

  tabChanged(id: string) {
    this.paginationValue = { page: 1, size: 20 };
    this.type = id;
    let maxDate = Utils.getToday()
    maxDate.month +=1;
    switch (this.type) {
      case "subscribed":
        this.data = []
        this.dataClone = []
        this.location.replaceState('/company-admin/alert-management?type=subscribed');
        this.getSubscribedUserList();
        this.searchForm = getSubscribedUserSearchForm(maxDate);
        this.filterIsActive = false;
        this.endButton.text = "company-admin.alert-management.deactivate"
        break;
      case "expired":
        this.data = []
        this.dataClone = []
        this.location.replaceState('/company-admin/alert-management?type=expired');
        this.getExpiredList();
        this.searchForm = getExpiredSearchForm(maxDate);
        this.filterIsActive = false;
        this.endButton.text = "company-admin.alert-management.renew"
        break;
    }
  }

  getSubscribedUserList() {
    this.headers = [];
    this.total = 0;
    let headers: TableHeaderModel[] = [];
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
      fieldName: "alertPrivilegesFlag",
    });
    headers.push({
      type: TableHeaderType.DATE_TEXT,
      title: "company-admin.alert-management.reg-date",
      fieldName: "registrationDate",
      controlOptions: { format: "dd/MM/yyyy" }
    });
    headers.push({
      type: TableHeaderType.DATE_TEXT,
      title: "company-admin.alert-management.renewal-date",
      fieldName: "renewalDate",
      controlOptions: { format: "dd/MM/yyyy" }
    });
    headers.push({
      type: TableHeaderType.DATE_TEXT,
      title: "company-admin.alert-management.expiry-date",
      fieldName: "expiryDate",
      controlOptions: { format: "dd/MM/yyyy" }
    });

    this.headers = headers;
    this.data = undefined;
    this.alertService.getSmsSubscribedUserList().subscribe({
      next: data => {
        this.responseFormService = data;
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
      },
      error: () => {
        this.data = [];
      }
    });
  }

  getExpiredList() {
    this.headers = [];
    this.total = 0;
    let headers: TableHeaderModel[] = [];
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
    this.data = undefined;
    this.alertService.getSmsExpiredList().subscribe({
      next: data => {
        this.responseFormService = data;
        this.data = data.reportList;
        this.dataClone = structuredClone(this.data);
        this.total = data.reportList.length;
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

        if (this.type === "subscribed") {
          res.controls!["regFromDate"].value ? reqParams.regFromDate = this.convertNgbStructToString(res.controls!["regFromDate"].value) : null;
          res.controls!["regToDate"].value ? reqParams.regToDate = this.convertNgbStructToString(res.controls!["regToDate"].value) : null;

          res.controls!["renewalFromDate"].value ? reqParams.renewalFromDate = this.convertNgbStructToString(res.controls!["renewalFromDate"].value) : null;
          res.controls!["renewalToDate"].value ? reqParams.renewalToDate = this.convertNgbStructToString(res.controls!["renewalToDate"].value) : null;
        }

        if (this.type === "subscribed" || this.type === "expired") {
          res.controls!["expiredFromDate"].value ? reqParams.expiredFromDate = this.convertNgbStructToString(res.controls!["expiredFromDate"].value) : null;
          res.controls!["expiredToDate"].value ? reqParams.expiredToDate = this.convertNgbStructToString(res.controls!["expiredToDate"].value) : null;
        }

        if (this.type === "expired") {
          res.controls!["maxSmsCountFrom"].value || res.controls!["maxSmsCountFrom"].value.trim() == '' ? reqParams.maxSmsCountFrom = res.controls!["maxSmsCountFrom"].value : null;
          res.controls!["maxSmsCountTo"].value || res.controls!["maxSmsCountTo"].value.trim() == '' ? reqParams.maxSmsCountTo = res.controls!["maxSmsCountTo"].value : null;

          res.controls!["smsReachedCountFrom"].value || res.controls!["smsReachedCountFrom"].value.trim() == '' ? reqParams.smsReachedCountFrom = res.controls!["smsReachedCountFrom"].value : null;
          res.controls!["smsReachedCountTo"].value || res.controls!["smsReachedCountTo"].value.trim() == '' ? reqParams.smsReachedCountTo = res.controls!["smsReachedCountTo"].value : null;
        }

        let expressions: BasicExpression[] = []

        Object.getOwnPropertyNames(this.reqParams).forEach(key => {
          let value = this.reqParams[key];
          console.log("Key=>" + key);
          console.log("Value=>" + value);

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
        maxDate.month +=1;
        if (this.type === 'subscribed') {
          this.searchForm = getSubscribedUserSearchForm(maxDate)
        } else if (this.type === 'expired') {
          this.searchForm = getExpiredSearchForm(maxDate)
        }

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
