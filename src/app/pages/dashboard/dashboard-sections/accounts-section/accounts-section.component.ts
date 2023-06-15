import {Component, EventEmitter, Output} from '@angular/core';
import {AccountsReq} from 'app/@core/model/rest/accounts/accounts-req';
import {AccountsRes} from 'app/@core/model/rest/accounts/accounts-res';
import {Account} from 'app/@core/model/rest/common/account';
import {AccountsCommonService} from 'app/@core/service/accounts/accounts-common.service';
import {LineCardModel} from 'arb-design-library/model/line-card.model';
import {TitleModel} from 'arb-design-library/model/title.model';
import {DashboardBase} from '../../dashboard-base';
import {ButtonModel} from "arb-design-library/model/button.model";

@Component({
  selector: 'app-accounts-section',
  templateUrl: './accounts-section.component.html',
})
export class AccountsSectionComponent extends DashboardBase {

  @Output() onAccountsFetching: EventEmitter<AccountsRes> = new EventEmitter<AccountsRes>();

  accountLineCards!: LineCardModel[];
  accountTitle: TitleModel = {
    id: "account",
    title: "accounts.your-accounts",
    endButtons: [
      {
        id: "accountViewAll",
        text: "pending-actions.view-all",
        type: "outLine"
      }
    ]
  };

  openMoreAccountsBtn: ButtonModel[] = [
    {
      id: 'open-more-accounts',
      text: 'dashboard-sections.open-account',
      type: 'secondary',
    },
  ];

  accountList:Account[] = [];

  constructor(
    public accountsService: AccountsCommonService,
  ) {
    super()
    this.getAccounts();
  }

  getAccounts() {
    let accountsReq: AccountsReq = {
      order: "",
      orderType: "",
      page: null,
      rows: null,
      txType: "ECAL"
    }
    this.accountsService.getAllEligibleAccounts(accountsReq,true).subscribe({
      next: (res) => {
        this.onAccountsFetching.emit(res);
        this.accountList = res.listAccount!;
        let lineCards: LineCardModel[] = [];
        res.listAccount.forEach((item: Account, index: number) => {
          if (index < 2) {
            lineCards.push({
              id: item.accountPk.toString(),
              title: item.alias ? item.alias : item.fullAccountNumber,
              subTitle: item.alias ? item.fullAccountNumber : '',
              rightSubTitle: "Balance",
              amount: item.availableBalance.toString(),
              currency: item.currency,
              hasBackground: true,
            });
          } else {
            return;
          }
        });
        this.accountLineCards = lineCards;
      },
      error: () => {
      }
    });
  }

  onAccountSelect(accountPk: string) {
    if (accountPk == 'accountViewAll') {
      void this.router.navigate(['accounts']);
    } else {
      let account = this.accountList.filter(item => item.accountPk == parseInt(accountPk));
      void this.router.navigate(['accounts/statement'], {state: {selectedRow: account[0]}});
    }
  }

  onOpenAccountBtnClick(){
    void this.router.navigate(['accounts']);
  }
}
