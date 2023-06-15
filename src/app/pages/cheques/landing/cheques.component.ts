import {Component, OnInit} from '@angular/core';
import {PageModel} from "../../../@core/model/dto/formModel";
import {chequeLanding, EndTitleButton, getFilterPopup} from "./cheques.landing.controls";
import {ButtonModel} from "arb-design-library/model/button.model";
import {ServiceLocator} from "../../../@core/service/base/service-locator.service";
import {BreadcrumbService} from "../../../@core/service/base/breadcrumb.service";
import {AccountControl} from "../../../@core/model/dto/control/account-control";
import {ChequesService} from "../../../@core/service/cheques/cheques.service";
import {Cheque, ChequesListReq} from "../../../@core/model/rest/cheques/cheques-list";
import {PaginationValueModel} from "arb-design-library/model/pagination.model";
import {TableControl} from "../../../@core/model/dto/control/table-control";
import {Account} from "../../../@core/model/rest/common/account";
import {ModelAndListService} from "../../../@core/service/base/modelAndList.service";
import {Router} from "@angular/router";
import {PopupService} from "../../../@core/service/base/popup.service";
import {DropdownControl} from "../../../@core/model/dto/control/dropdown-control";
import {AccountsCommonService} from "../../../@core/service/accounts/accounts-common.service";
import {Utils} from "../../../@core/utility/Utils";
import { CompanyWorkflowTypeEnum } from 'app/@core/model/rest/company-admin/workflow/company-workflow-type-enum';
import {AuthenticationUtils} from "../../../@core/utility/authentication-utils";

@Component({
  selector: 'app-cheques',
  templateUrl: './cheques.component.html',
})
export class ChequesComponent implements OnInit {
  pageTitleEndButtons: ButtonModel[] = [];
  chequesLandingPage: PageModel = new PageModel(1, chequeLanding());
  breadcrumbService!: BreadcrumbService;
  paginationValueModel: PaginationValueModel = {
    page: 1,
    size: 10
  }
  selectedAccount!: Account | null;
  statues: any;
  filterPopupModel = getFilterPopup();
  filterType!: "0" | "1";
  selectedCheque!: Cheque;
  showPendingActions: boolean = AuthenticationUtils.showPendingActions;

  constructor(private accountService: AccountsCommonService,
              private router: Router,
              private modelAndList: ModelAndListService,
              private popUpService: PopupService,
              private cheques: ChequesService) {
    this.drawLanding()
  }

  ngOnInit(): void {
  }

  doButtonClick(id: string) {
    switch (id) {
      case "arrowTitle":
        void this.router.navigate(['/accounts'])
        break;
      case "delete":
        void this.router.navigate(['/cheques/delete'])
        break;
      case "create":
        void this.router.navigate(['/cheques/create'])
        break;
      case "requestStatus":
        void this.router.navigate(['/cheques/request-status'])
        break
    }
  }


  private drawLanding() {
    this.pageTitleEndButtons = EndTitleButton(this.showPendingActions);
    this.breadcrumbService = ServiceLocator.injector.get(BreadcrumbService);

    Utils.setBreadcrumb([{
      text: 'accounts.acc',
      url: '/accounts'
    }, {
      text: 'accounts.cheques.title',
      url: ''
    }
    ]);
    this.accountService.getSarAccounts().subscribe((res) => {
      let accountControl = (this.chequesLandingPage.forms[0].controls['account'] as AccountControl);
      accountControl.controlOptions.options = res.listAlertsPermissionAccount;
      this.selectedAccount = (res.listAlertsPermissionAccount.length > 0) ? res.listAlertsPermissionAccount[0] : null;
      accountControl.setValue(this.selectedAccount);
      this.getChequesByAccount(this.selectedAccount!.fullAccountNumber);
      this.modelAndList.getModel("checkStatus").subscribe((chequesStatuses) => {
        this.statues = chequesStatuses.checkStatus
        accountControl.valueChanges.subscribe((changedAccount) => {
          this.selectedAccount = changedAccount.value;
          this.getChequesByAccount(this.selectedAccount!.fullAccountNumber)
        })
      })
    });

    this.filterPopupModel.form!.controls['fromDate'].hidden = true;
    this.filterPopupModel.form!.controls['toDate'].hidden = true;
    this.filterPopupModel.form!.controls['chequeNo'].hidden = true;
    (this.filterPopupModel.form?.controls['searchBy'] as DropdownControl)
      .valueChanges.subscribe((res) => {
      this.filterType = res.value.key
      this.filterPopupModel.form!.controls['fromDate'].hidden = res.value.key !== "0";
      this.filterPopupModel.form!.controls['toDate'].hidden = res.value.key !== "0";
      this.filterPopupModel.form!.controls['chequeNo'].hidden = res.value.key !== "1";
    });

    let tableControl = (this.chequesLandingPage.forms[0].controls['chequeTable'] as TableControl);

    tableControl.valueChanges.subscribe((selectedRow) => {
      if (selectedRow.value.length === 1) {
        this.chequesLandingPage.forms[0].controls['delete'].controlOptions.isDisable = false;
        this.selectedCheque = selectedRow.value[0];
      } else
        this.chequesLandingPage.forms[0].controls['delete'].controlOptions.isDisable = true;

    })

    tableControl.onFilterClick.subscribe((() => {
      if (this.selectedAccount)
        this.popUpService.showPopup(this.filterPopupModel).subscribe((res) => {
          switch (res.buttonId) {
            case 'close':
              this.popUpService.dismiss();
              break;
            case 'reset':
              if (this.selectedAccount !== undefined && this.selectedAccount!.fullAccountNumber) {
                let chequesListReq: ChequesListReq = {
                  accountNumber: this.selectedAccount!.fullAccountNumber,
                  page: 1,
                  rows: 10
                }
                this.getCheckList(chequesListReq)
                this.popUpService.dismiss();
              }
              break;
            case "search":
              this.search()
              break;
          }


        })
    }));

    tableControl.externalPagination.subscribe((res) => {
      let chequesListReq: ChequesListReq = {
        accountNumber: this.selectedAccount!.fullAccountNumber,
        page: res.page,
        rows: res.size
      }
      this.getCheckList(chequesListReq)
    });
  }

  private getCheckList(chequesListReq: ChequesListReq) {
    let tableControl = (this.chequesLandingPage.forms[0].controls['chequeTable'] as TableControl);
    this.cheques.getChequesList(chequesListReq).subscribe(
    {next: (res) => {
      tableControl.controlOptions.headers[4].mapObject = this.statues;
      tableControl.controlOptions.data = res.checkDetailsList.items;
      tableControl.controlOptions.total = res.checkDetailsList.total;

    }, error: () => {
      tableControl.controlOptions.data = []
    }})
  }

  private search() {
    if (this.selectedAccount && this.selectedAccount!.fullAccountNumber) {
      let chequesListReq: ChequesListReq = {
        accountNumber: this.selectedAccount!.fullAccountNumber,
        page: 1,
        rows: 10
      }
      if (this.filterType === "0") {
        chequesListReq.dateFrom = this.filterPopupModel.form!.controls['fromDate'].value.year + "-" + this.filterPopupModel.form!.controls['fromDate'].value.month + "-" + this.filterPopupModel.form!.controls['fromDate'].value.day;
        chequesListReq.dateTo = this.filterPopupModel.form!.controls['toDate'].value.year + "-" + this.filterPopupModel.form!.controls['toDate'].value.month + "-" + this.filterPopupModel.form!.controls['toDate'].value.day;
      } else if (this.filterType === "1") {
        chequesListReq.checkNumber = this.filterPopupModel.form!.controls['chequeNo'].value;
      }
      this.getCheckList(chequesListReq);
      this.popUpService.dismiss();
    }
  }

  getChequesByAccount(fullAccountNumber: string) {
    let chequesListReq: ChequesListReq = {
      accountNumber: fullAccountNumber,
      page: this.paginationValueModel.page,
      rows: this.paginationValueModel.size
    }
    this.getCheckList(chequesListReq)
  }
}
