import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {KeyValue} from "@angular/common";
import {AccountModel} from "arb-design-library/model/account.model";
import {BalanceModel} from "arb-design-library/model/balance.model";
import {AccountsRes} from "../../@core/model/rest/accounts/accounts-res";
import {TranslateService} from "@ngx-translate/core";
import {ModelAndListService} from "../../@core/service/base/modelAndList.service";
import {CurrencyPipe} from "../../@core/pipe/currency.pipe";
import {Utils} from "../../@core/utility/Utils";


@Component({
  selector: ' app-accounts-presentation-wrapper[accountResponse]',
  templateUrl: './accounts-presentation-wrapper.component.html'
})
export class AccountsPresentationWrapperComponent implements OnChanges {

  @Input() accountResponse!: AccountsRes;
  @Input() hasBackground: boolean = true;

  accountsCurrencies!: KeyValue<any, any>[];
  accounts: AccountModel[] = []
  balance!: BalanceModel;


  constructor(private translate: TranslateService, private modelService: ModelAndListService, private currencyPipe: CurrencyPipe) {


  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['accountResponse'] && this.accountResponse) {
      this.modelService.getModel('currency').subscribe({
        next: () => {
          this.accountsCurrencies = Object.keys(this.accountResponse.currencyBalance).map((key) => {
            let KeyValue: KeyValue<any, any> = {key: key, value: this.currencyPipe.transform(key)}
            return KeyValue;
          });
          this.fillAccountPresentation();
        }
      })
    }
  }


  private fillAccountPresentation() {
    this.accountsCurrencies.forEach((accountsCurrencies: KeyValue<any, any>) => {
      if (accountsCurrencies.key != "608") {
        this.accounts.push({
          icon: Utils.getIconByCurrencyIso(accountsCurrencies.key) + " color-arb-primaryColor",
          text: accountsCurrencies.value,
          amount: this.accountResponse.currencyBalance[accountsCurrencies.key].toString(),
          currency: accountsCurrencies.key
        });
      }
    });
    this.balance = {
      header: JSON.parse(sessionStorage.getItem("company")!).companyName,
      title: "accounts.totalBalanceSAR",
      avatarType: "ico",
      avatarValue: "arb-icon-building color-arb-primaryColor",
      amount: this.accountResponse?.totalBalance?.toString(),
      avatarSize: "sm",
      currency: "SAR",
    }
  }

}
