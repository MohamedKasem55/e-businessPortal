import { Component, OnInit } from '@angular/core';
import { TableControl } from 'app/@core/model/dto/control/table-control';
import { PageModel } from 'app/@core/model/dto/formModel';
import { PaginationValueModel } from 'arb-design-library/model/pagination.model';
import {
  getOrderNewTokenButton,
  tokenManagementSummaryForm, tokenManagmentForm
} from './token-management-control';
import { FormButtonClickOutput } from "../../../shared/form/form.component";
import { CompanyAdminBaseComponent } from '../company-admin-base/company-admin-base.component';
import { TokenManagmentService } from 'app/@core/service/company-admin/token-management/token-management.service';
import { Router } from '@angular/router';
import { PaginationListReq } from 'app/@core/model/rest/payments/pagination-list-req';
import { TokenCompanySatistics } from 'app/@core/model/rest/company-admin/token-management/token-management-summary-res';
import { TitleModel } from 'arb-design-library/model/title.model';
import { getUserBasePageTitle } from '../company-admin-base/company-admin-base.controls';
import { ModelAndListService } from 'app/@core/service/base/modelAndList.service';

@Component({
  selector: 'app-token-management',
  templateUrl: '../company-admin-base/company-admin-base.component.html',
  styleUrls: []
})
export class TokenManagementComponent extends CompanyAdminBaseComponent implements OnInit {

  override pageTitle: TitleModel = getUserBasePageTitle();
  tokenManagementReq!: PaginationListReq;

  constructor(
    public override router: Router,
    private modelAndListService: ModelAndListService,
    private tokenManagmentService: TokenManagmentService) {

    super();
    this.setBreadcrumb([
      {
        text: "company-admin.name",
        url: '/company-admin'
      },
      {
        text: "company-admin.token-management.name",
        url: ''
      }
    ]);

    this.pageTitle.id = "token-management";
    this.pageTitle.title = "company-admin.token-management.name";
    this.pageTitle.showArrow = true;
    this.pageTitle.endButtons = [getOrderNewTokenButton()];
    this.pageTitle.stepper = undefined;
    this.endButtons = [];
    this.startButtons = [];
    this.pages = [new PageModel(1, tokenManagementSummaryForm(), tokenManagmentForm())];

    this.modelAndListService
      .getList(['tokenType'])
      .subscribe((res) => {
        this.getControl(0, 1, "tokenUserListTable").controlOptions.headers[1].mapObject = res['tokenType'];
        this.buildTokenTablePageModel();
        this.fatechAndSetTokenTableDataSource();
        this.registerTokenTableEventListeners();
      });

    (this.getControl(0, 1, "tokenUserListTable") as TableControl)
      .buttonClicked?.subscribe((res: any) => {
        if (res.buttonId === 'update-token') {
          console.log(res.displayedData.tokenSerialNumber);
          this.tokenManagmentService.getTokenAssignmentStatus(res.displayedData.tokenSerialNumber).subscribe({
            next: data => {
              this.router.navigateByUrl("/company-admin/token-management/edit-token", { state: data }).then(() => {
              });
            },
            error: () => {
              this.getControl(0, 1, "tokenUserListTable").controlOptions.data = [];
            }
          });
        }
      });

  }

  ngOnInit(): void {
  }

  buildTokenTablePageModel(options: PaginationListReq = {}) {
    this.tokenManagementReq = {
      page: options.page || 1,
      rows: options.rows || 10,
    };
  }

  fatechAndSetTokenTableDataSource() {
    this.tokenManagmentService.getTokenManagementSummary(this.tokenManagementReq).subscribe({
      next: data => {
        this.getControl(0, 1, "tokenUserListTable").controlOptions.data = data.tokens.items;
        this.getControl(0, 1, "tokenUserListTable").controlOptions.total = data.tokens.total;
        this.fillSummaryForm(data.tokenCompanySatistics)
      },
      error: () => {
        this.getControl(0, 1, "tokenUserListTable").controlOptions.data = [];
      }
    });
  }

  fillSummaryForm(tokenCompanySatistics: TokenCompanySatistics) {
    this.getControl(0, 0, "numberOfOrginizationUser").setValue(
      tokenCompanySatistics.numberOfCompanyUsers + tokenCompanySatistics.numberOfCompanyAdmins);
    this.getControl(0, 0, "numberOfOrgnizationUserWithToken").setValue(
      tokenCompanySatistics.numberOfCompanyUsersWithToken + tokenCompanySatistics.numberOfCompanyAdminWithToken);
    this.getControl(0, 0, "numberOfUnassignedToken").setValue(tokenCompanySatistics.numberOfUnassignedToken);
  }
  registerTokenTableEventListeners() {
    //Register beneficiary table page change event listener
    (this.getControl(0, 1, "tokenUserListTable") as TableControl).externalPagination?.subscribe(
      (data: PaginationValueModel) => {
        this.handleTablePageChangeEvent(data);
      });
  }

  handleTablePageChangeEvent(data: PaginationValueModel) {
    this.buildTokenTablePageModel({ page: data.page, rows: data.size });
    this.fatechAndSetTokenTableDataSource();
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'OrderNewToken':
        this.router
          .navigate(['/company-admin/token-management/order-token'])
          .then(() => {
          });
        break;
      case 'arrowTitle':
      case 'Back':
        this.router
          .navigate(['/company-admin'])
          .then(() => {
          });
        break;
    }
  }
}
