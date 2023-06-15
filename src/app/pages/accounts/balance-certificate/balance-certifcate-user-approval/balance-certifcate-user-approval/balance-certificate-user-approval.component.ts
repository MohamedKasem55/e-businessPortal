import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {Location} from "@angular/common";
import {ModelAndListService} from "../../../../../@core/service/base/modelAndList.service";
import {TableHeaderModel} from "arb-design-library/model/table-header.model";
import {PaginationValueModel} from "arb-design-library/model/pagination.model";
import {TableHeaderType} from "arb-design-library";
import {AccountsService} from "../../../../../@core/service/accounts/accounts.service";
import {BreadcrumbModel} from "arb-design-library/model/breadcrumb.model";
import {BreadcrumbService} from "../../../../../@core/service/base/breadcrumb.service";
import {ServiceLocator} from "../../../../../@core/service/base/service-locator.service";

@Component({
  selector: 'app-balance-certifcate-user-approval',
  templateUrl: './balance-certificate-user-approval.component.html',
})
export class BalanceCertificateUserApprovalComponent implements OnInit {

  data!: any[];
  headers: TableHeaderModel[] = [];
  total: number = 0;
  paginationValue: PaginationValueModel = {page: 1, size: 50};
  exportFileName: string = "public.request-status"


  constructor(private router: Router, private translate: TranslateService, private route: ActivatedRoute, private location: Location,
              private modelAndListService: ModelAndListService, private accountsService: AccountsService, private breadcrumbService: BreadcrumbService) {

    this.breadcrumbService = ServiceLocator.injector.get(BreadcrumbService);

    this.setBreadcrumb([{
      text: 'accounts.acc',
      url: '/accounts'
    }, {
      text: 'accounts.documents.name',
      url: '/accounts/documents'
    }, {
      text: 'public.request-status',
      url: '/accounts/documents/balanceCertificate/request-status'
    }
    ]);
  }

  ngOnInit(): void {
    this.getBalanceCertificates()
  }

  setBreadcrumb(breadcrumb: BreadcrumbModel[]) {
    this.breadcrumbService.setBreadcrumb(breadcrumb);
  }

  onTitleButtonClick(id: string) {
    if (id == 'arrowTitle') {
      this.router.navigateByUrl("/accounts/documents").then(() => {
      });
    }
  }

  externalPagination(data: PaginationValueModel) {
    this.accountsService.getBalanceCertificateUserApproval({
      page: data.page,
      rows: data.size
    }).subscribe({
      next: data => {
        this.data = data.batchList.items;
        this.total = data.batchList.total
      },
      error: () => {
        this.data = [];
      }});

  }

  getBalanceCertificates() {
    this.headers = [];
    this.total = 0;
    this.modelAndListService.getModel('cityType').subscribe((cities) => {
      const Status = {"I":"status.initiate", "P": "status.pending", "A": "status.approve", "R": "status.rejected"}

      let headers: TableHeaderModel[] = [];
      headers.push({
        title: "public.account",
        type: TableHeaderType.TEXT,
        fieldName: "accountNumber",
      });
      headers.push({
        title: "accounts.documents.balance-certificate.company",
        type: TableHeaderType.TEXT,
        fieldName: "company"
      });
      headers.push({
        title: "accounts.documents.balance-certificate.city",
        type: TableHeaderType.TEXT,
        fieldName: "city",
        mapObject: cities['cityType'],
      });
      headers.push({
        title: "accounts.documents.balance-certificate.postal-code",
        type: TableHeaderType.TEXT,
        fieldName: "postalCode"
      });
      headers.push({
        title: "transfer.userApproval.current-status",
        type: TableHeaderType.CURRENT_LEVEL,
        controlOptions: {
          levelFieldName: "level",
          statusFieldName: "status",
          updaterFieldName: "updater",
          dateFieldName: "updateDate",
          dateFormat: "dd/MM/yyyy"
        }
        ,
        fieldName: "securityLevelsDTOList"
      }); //type Levels
      headers.push({
        title: "transfer.userApproval.next-status",
        type: TableHeaderType.NEXT_LEVEL,
        controlOptions: {completed: "Completed"},
        fieldName: "securityLevelsDTOList"
      }); // type Next Levels
      headers.push({
        title: "transfer.userApproval.status",
        type: TableHeaderType.PILL,
        fieldName: "status",
        mapObject: Status,
        controlOptions: {
          PositiveCondition: 'A',
          NegativeCondition: 'R',
          WarningCondition: 'P',
        }
      });

      this.headers = headers;

      this.accountsService.getBalanceCertificateUserApproval({page: 1, rows: 20}).subscribe({
        next: data => {
          this.data = data.batchList.items;
          this.total = data.batchList.total
        },
        error: () => {
          this.data = [];
        }});
    });
  }
}
