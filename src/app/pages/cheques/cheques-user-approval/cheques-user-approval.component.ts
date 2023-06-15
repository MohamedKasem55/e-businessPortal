import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {ModelAndListService} from "../../../@core/service/base/modelAndList.service";
import {PaginationValueModel} from "arb-design-library/model/pagination.model";
import {TabModel} from "arb-design-library/model/tab.model";
import {TableHeaderModel} from "arb-design-library/model/table-header.model";
import {Location} from "@angular/common";
import {ChequesService} from "../../../@core/service/cheques/cheques.service";
import {BreadcrumbModel} from 'arb-design-library/model/breadcrumb.model';
import {BreadcrumbService} from 'app/@core/service/base/breadcrumb.service';
import {ServiceLocator} from "../../../@core/service/base/service-locator.service";
import {getChequeHeaders, getStopChequeHeaders} from "./cheques-user-approval.controls";

@Component({
  selector: 'app-transfer-approval',
  templateUrl: './cheques-user-approval.component.html',
  styleUrls: []
})
export class ChequesUserApprovalComponent implements OnInit {

  tabs: TabModel[] = [];
  type: string = "";
  headers: TableHeaderModel[] = getChequeHeaders();
  data!: any[];
  total: number = 0;
  paginationValue: PaginationValueModel = {page: 1, size: 50};
  exportFileName: string = "accounts.cheques.reqStatus"


  constructor(private router: Router, private translate: TranslateService, private route: ActivatedRoute, private location: Location,
              private modelAndListService: ModelAndListService, private chequeService: ChequesService,
              private breadcrumbService: BreadcrumbService) {
    this.setTabs();
    this.breadcrumbService = ServiceLocator.injector.get(BreadcrumbService);

    this.setBreadcrumb([{
      text: 'accounts.acc',
      url: '/accounts'
    }, {
      text: 'accounts.cheques.title',
      url: '/cheques'
    }, {
      text: 'public.approvalStatus',
      url: '/accounts/documents/balanceCertificate/request-status'
    }
    ]);
  }

  setTabs() {
    let groups: any = JSON.parse(sessionStorage.getItem("groups")!);
    if (groups!.items.RequestCheckBookGroup) {
      this.tabs.push({text: "accounts.cheques.request-status-create", value: "create"});
    }
    if (groups!.items.StopCheckBookGroup) {
      this.tabs.push({text: "accounts.cheques.request-status-stop", value: "stop"});
    }

  }

  ngOnInit(): void {
    this.type = this.tabs[0].value;
    this.setData();

  }

  onTitleButtonClick(id: string) {
    if (id == 'arrowTitle') {
      this.router.navigateByUrl("/cheques").then(() => {
      });
    }
  }

  tabChanged(id: string) {
    this.paginationValue = {page: 1, size: 20};
    this.type = id;
    this.total = 0;
    this.setData();
  }

  externalPagination(data: PaginationValueModel) {
    this.getChequesList(data);
  }

  setBreadcrumb(breadcrumb: BreadcrumbModel[]) {
    this.breadcrumbService.setBreadcrumb(breadcrumb);
  }

  setData() {
    this.getChequesList({page: 1, size: 20})
  }

  getChequesList(paginationData: PaginationValueModel): void {
    switch (this.type) {
      case "create":
        this.headers = getChequeHeaders();
        this.chequeService.getCreateChequesList({
          page: paginationData.page,
          rows: paginationData.size
        }).subscribe({
          next: data => {
            this.data = data.batchList.items;
            this.total = data.batchList.total
          },
          error: () => {
            this.data = [];
          }
        });
        break;
      case "stop":
        this.headers = getStopChequeHeaders();
        this.chequeService.getStopChequesList({
          page: paginationData.page,
          rows: paginationData.size
        }).subscribe({
          next: data => {
            this.data = data.batchList.items;
            this.total = data.batchList.total
          },
          error: () => {
            this.data = [];
          }
        });
        break;
    }
  }
}
