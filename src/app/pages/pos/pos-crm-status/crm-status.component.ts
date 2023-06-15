import { Component, OnInit } from "@angular/core";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { TableControl } from "app/@core/model/dto/control/table-control";
import { FormModel, PageModel } from "app/@core/model/dto/formModel";
import { PopupOutputModel } from "app/@core/model/dto/popup.model";
import { PopupService } from "app/@core/service/base/popup.service";
import { ResponseException } from "app/@core/service/base/responseException";
import { FormButtonClickOutput } from "app/shared/form/form.component";
import { PaginationValueModel } from "arb-design-library/model/pagination.model";
import { crmStatusForm, getSearchForm } from "./crm-status-controls";
import { Utils } from "../../../@core/utility/Utils";
import { PosBaseComponent } from "../pos-base/pos-base.component";
import { ModelAndListService } from "app/@core/service/base/modelAndList.service";
import {CrmStatusReq} from "../../../@core/model/rest/pos/crm-status/crm-status-req";
import {CrmStatusRes, StatusItem} from "../../../@core/model/rest/pos/crm-status/crm-status-res";
import {PosCRMStatusService} from "../../../@core/service/pos/crm-status/crm-status.service";
import { POS, POS_CRM_STATUS_DETAILS } from "app/@core/constants/pages-urls-constants";

@Component({
  selector: 'app-crm-status',
  templateUrl: '../pos-base/pos-base.component.html',
  styleUrls: []
})
export class CrmStatusComponent extends PosBaseComponent implements OnInit {

  searchForm!: FormModel;
  pagingValueInfo: PaginationValueModel = { page: 1, size: 10 };
  crmStatusReq!: CrmStatusReq;
  crmStatusRes!: CrmStatusRes;
  crmReqParams: CrmStatusReq = {
    ticketNumber: "",
    type: "",
    dateFrom: null,
    dateTo: null,
    order: "initiationDate",
    orderType: "desc",
    page: 1,
    rows: 10
  };
  posCRMStatusTypes: any;
  mappingStatusObject: any;

  constructor(
    private posCRMStatusService: PosCRMStatusService,
    private modelAndListService: ModelAndListService,
    private popupService: PopupService) {
    super();
    this.setBreadcrumb([
      {
        text: 'pos.dashboard.title',
        url: '/pos'
      },
      {
        text: 'pos.maintenance.crm-status',
        url: ''
      },
    ]);
    this.pageTitle = {
      id: 'crm-status-id',
      title: 'pos.maintenance.crm-status-title',
      type: 'Page',
      showArrow: true,
    };

    this.pages = [
      new PageModel(1, crmStatusForm())
    ]
    this.endButtons = [];
    this.startButtons = [this.backButton];
    let maxDate = Utils.getToday()
    maxDate.month +=1
    this.searchForm = getSearchForm(maxDate);
  }

  ngOnInit(): void {
    this.modelAndListService
      .getList(['posCRMStatusType'])
      .subscribe((models) => {
        for (let key of Object.keys(models)) {
          switch (key) {
            case 'posCRMStatusType':
              this.mappingStatusObject = models[key];
              this.posCRMStatusTypes = Utils.getModelList(models[key]);
              break;
          }
        }
        this.drawPage();
      });

  }

  drawPage() {

    this.fatechCRMStatusTableData(this.buildRequest(this.crmReqParams));

    (this.getControl(0, 0, "crmStatusTable") as TableControl).externalPagination?.subscribe(
      (data: PaginationValueModel) => {
        this.handleTablePageChangeEvent(data);
      });
    (this.getControl(0, 0, "crmStatusTable") as TableControl).onFilterClick?.subscribe(
      () => {
        this.openSearch();
      });
      (this.getControl(0, 0, "crmStatusTable") as TableControl).buttonClicked?.subscribe(
        (event: any) => {
          const batchItem = event.row as StatusItem;
          this.router.navigate([`pos/${POS_CRM_STATUS_DETAILS}`], {state: {crmStatusDetails: batchItem}})
          console.log(event.row);
        });

  }

  handleTablePageChangeEvent(data: PaginationValueModel) {
    this.pagingValueInfo = data;
    this.crmReqParams.page = this.pagingValueInfo.page;
    this.crmReqParams.rows = this.pagingValueInfo.size;

    this.fatechCRMStatusTableData(this.buildRequest(this.crmReqParams))
  }

  fatechCRMStatusTableData(req: CrmStatusReq) {
    this.posCRMStatusService.getCRMStatusList(req).subscribe(
      {
        next: (res) => {
          this.crmStatusRes = res;
          this.crmStatusRes.batchList.items.forEach((a) => {
            a['posCRMStatusType'] = a['typeRequest']
          })
          this.getControl(0, 0, "crmStatusTable").controlOptions.headers[2].mapObject = this.mappingStatusObject;
          this.getControl(0, 0, "crmStatusTable").controlOptions.data = this.crmStatusRes.batchList.items;
          this.getControl(0, 0, "crmStatusTable").controlOptions.total = this.crmStatusRes.batchList.total;

        },
        error: (error: ResponseException) => {
          this.getControl(0, 0, "crmStatusTable").controlOptions.data = [];
          console.error("Error while fetching CRM status data.", error);
        }
      })
  }

  buildRequest(reqParams: any): CrmStatusReq {
    this.crmStatusReq = {
      ticketNumber: reqParams.ticketNumber ? reqParams.ticketNumber : "",
      type: reqParams.type.key ? reqParams.type : "",
      dateTo: reqParams.toDate ? reqParams.toDate : null,
      dateFrom: reqParams.fromDate ? reqParams.fromDate : null,
      order: "initiationDate",
      orderType: "desc",
      page: this.pagingValueInfo.page,
      rows: this.pagingValueInfo.size
    }
    return this.crmReqParams;
  }

  openSearch() {
    this.searchForm.controls['requestType'].controlOptions.options = this.posCRMStatusTypes;
    this.popupService.showPopup({ image: '', form: this.searchForm }).subscribe((res: PopupOutputModel) => {
      if (res.buttonId == "search") {
        let reqParams = this.crmReqParams;
        res.controls!["requestId"].value || res.controls!["requestId"].value.trim() == '' ? reqParams.ticketNumber = res.controls!["requestId"].value : null;
        res.controls!["fromDate"].value ? reqParams.dateFrom = this.convertNgbStructToString(res.controls!["fromDate"].value) : null;
        res.controls!["toDate"].value ? reqParams.dateTo = this.convertNgbStructToString(res.controls!["toDate"].value) : null;
        res.controls!["requestType"].value ? reqParams.type = res.controls!["requestType"].value.key : null;
        this.getControl(0, 0, "crmStatusTable").controlOptions.filterIsActive = true;

        this.fatechCRMStatusTableData(this.buildRequest(reqParams));
        this.popupService.dismiss();
      } else if (res.buttonId == "reset") {
        this.crmReqParams = this.crmStatusReq = this.setDefaultValue();
        this.searchForm.controls['requestType'].setValue("");
        this.fatechCRMStatusTableData(this.crmStatusReq);
        this.getControl(0, 0, "crmStatusTable").controlOptions.filterIsActive = false;
        this.popupService.dismiss();
      } else if (res.buttonId == 'close') {
        this.popupService.dismiss();
      }
    });
  }

  setDefaultValue(): CrmStatusReq {
    return {
      ticketNumber: "",
      type: "",
      dateFrom: null,
      dateTo: null,
      order: "initiationDate",
      orderType: "desc",
      page: 1,
      rows: 10
    };
  }

  convertNgbStructToString(value: NgbDateStruct): string {
    let transformDate;
    if (value) {
      transformDate = value.year + "-" + ('0' + value.month).slice(-2) + "-" + ('0' + value.day).slice(-2)
    }
    return transformDate ? transformDate : "";
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput): void {
    console.log(formButtonClickOutput.buttonId);
    switch (formButtonClickOutput.buttonId) {
      case 'back':
      case 'arrowTitle':
        this.backClick();
        break;
    }
  }

  backClick() {
    void this.router.navigateByUrl(`/${POS}`);;
  }

}
