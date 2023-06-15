import {Component, Input, OnChanges} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {UserDetailsRes} from "app/@core/model/rest/company-admin/user-details/user-details-res";
import {ModelAndListService} from "app/@core/service/base/modelAndList.service";
import {SummaryItemModel} from "arb-design-library/model/summary-item.model";
import {SummarySectionModel} from "arb-design-library/model/summary-section.model";
import {TableHeaderModel} from "arb-design-library/model/table-header.model";
import {TitleModel} from "arb-design-library/model/title.model";
import {ExecutionType} from "../user-main/user-main.controls";
import {getAccountListTitle, getAccountsLevelsTableHeaders, getActivatedServicesTitle} from "./user.accounts.controls";
import {Account} from "../../../../../@core/model/rest/common/account";
import {SelectionGroupOptions} from "../../../../../@core/model/dto/control/selection-group-control";

@Component({
  selector: 'app-user-accounts',
  templateUrl: './user-accounts.component.html',
})
export class UserAccountsComponent implements OnChanges {


  @Input() userDetails!: UserDetailsRes | any;

  @Input() editMode?: ExecutionType = ExecutionType.VIEW;

  pageTitle: TitleModel = getAccountListTitle();

  page2Title: TitleModel = getActivatedServicesTitle();

  headers: TableHeaderModel[] = [];

  summaryLimitsPrivileges: SummaryItemModel[] = [];

  groupsList: any[] = [];

  accountPrivilegesList: SelectionGroupOptions[] = [];

  limitsPrivileges: TitleModel = {
    id: "1",
    type: 'Section',
    title: "company-admin.user-accounts.limitPrivileges"
  };

  limitsPrivilegesSection: SummarySectionModel = {
    items: this.summaryLimitsPrivileges,
    title: this.limitsPrivileges
  };

  accList!: Account[];

  companyUserGroups!: any;



  constructor(private modelAndListService: ModelAndListService,
              private translate: TranslateService) {

  }
  ngOnChanges(): void {
    this.setViewDtls()
  }

  private setViewDtls() {

    this.summaryLimitsPrivileges.push(
      {title: "company-admin.user-accounts.dailyTransfer",
        subTitle:  this.userDetails.companyUserDetails.limit?.toString()},
      {
        title: "company-admin.user-accounts.billPayment",
        subTitle: this.userDetails.companyUserDetails.billPaymentLimit?.toString()
      },
      {
        title: "company-admin.user-accounts.governmentPayment",
        subTitle: this.userDetails.companyUserDetails.governmentPaymentLimit?.toString()
      },
      {
        title: "company-admin.user-accounts.ownACCTransfer",
        subTitle: this.userDetails.companyUserDetails.ownacclimit?.toString()
      },
      {title: "company-admin.user-accounts.esalLimit",
        subTitle: this.userDetails.companyUserDetails.sadadInvoiceHubLimit
      },
      {
        title: "company-admin.user-accounts.withinTransfer",
        subTitle: this.userDetails.companyUserDetails.withinlimit?.toString()
      },
      {
        title: "company-admin.user-accounts.localTransfer",
        subTitle: this.userDetails.companyUserDetails.locallimit?.toString()
      },
      {title: "company-admin.user-accounts.quickPayment",
        subTitle: this.userDetails.companyUserDetails.qtlLimit?.toString()},
      {
        title: "company-admin.user-accounts.internationalTransfer",
        subTitle: this.userDetails.companyUserDetails.internationallimit?.toString()
      },
      {
        title: "company-admin.user-accounts.bulkLimit",
        subTitle: this.userDetails.companyUserDetails.bulkLimit?.toString()
      });

    this.accList = this.userDetails.checkaccountlist;

    this.modelAndListService.getList(['currency', 'companyUserGroups'])
      .subscribe((data) => {
      const currency = data['currency'];
      this.companyUserGroups = data.companyUserGroups
      this.headers = getAccountsLevelsTableHeaders(currency);
    });

    this.setSelectionGroupsData()
  }

  private setSelectionGroupsData() {
    let details = this.userDetails
    if (details) {
      Object.keys(details).forEach((key) => {
        if (key.toLowerCase().includes('group')) {
          if (details[key] instanceof Object && Object.keys(details[key]).length > 0) {
            this.groupsList.push(details[key]);

            let groupIndex = this.groupsList.indexOf((details[key]))
            let listOfSelection: any[] = [];

            Object.keys(this.groupsList[groupIndex]).forEach((subGroupKey) => {
              listOfSelection.push({
                id: this.groupsList[groupIndex][subGroupKey]['groupId'],
                value: (details.companyUserDetails) ?
                  details.companyUserDetails.groups.indexOf(this.groupsList[groupIndex][subGroupKey]['groupId']) !== -1
                  : false,
                title: this.groupsList[groupIndex][subGroupKey]['description'],
              });
            })
            listOfSelection.sort()
            this.accountPrivilegesList.push({
              id: key,
              title: <string>'company-admin.groups.' + key,
              items: listOfSelection,
              textOnStart: false
            });
          }
        }
      })
      this.accountPrivilegesList.sort((a,b)=>{return a.items.length-b.items.length})
    }
  }

}
