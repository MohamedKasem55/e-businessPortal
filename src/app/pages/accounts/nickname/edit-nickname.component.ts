import { Component } from '@angular/core';
import { FormResult, PageModel } from 'app/@core/model/dto/formModel';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { getSummaryEndButton, updateNickNameForm } from './edit-nickname.component.contols';
import { TransactionFollowBase } from 'app/shared/transaction-follow-base/transaction-follow-base';
import { AccountsService } from 'app/@core/service/accounts/accounts.service';
import { BaseResponse } from 'app/@core/model/rest/common/base-response';

@Component({
  selector: 'app-nickname',
  templateUrl: './edit-nickname.component.html',
})
export class NickNameComponent extends TransactionFollowBase {
  accountDetails: any;

  constructor(
    private accService: AccountsService
  ) {
    super();
    this.pageTitle = {
      id: "nickname",
      title: "accounts.edit-account-nickname",
    }
    this.drawPage();
    this.setBreadcrumb([
      {
        text: 'accounts.acc',
        url: '/accounts'
      },
      {
        text: 'accounts.online-statement',
        url: '/accounts/statement'
      },
      { text: 'accounts.account-nickname', url: '' }]);
    this.nextButton.text = "public.confirm";
    this.backButton.text = "public.cancel";
    this.pageTitle.stepper = history.state ? {
      steps: ["", "", ""],
      stepCounter: 1,
      stepText: "public.step",
      ofText: "public.of"
    } : undefined;
    this.accountDetails = history.state ? history.state.selectedAccount : null;
    if (this.accountDetails === null || this.accountDetails === undefined) {
      this.router.navigate(['/accounts/statement']);
    }
    this.getControl(0, 0, "nickname").setValue(this.accountDetails?.alias);
    this.nickNameChangeValueEvents();
  }

  drawPage() {
    this.pages = [];
    this.pages = [new PageModel(1, updateNickNameForm())];
  }

  nickNameChangeValueEvents() {
    this.getControl(0, 0, 'nickname').valueChanges.subscribe(
      (formValueChange: any) => {
        this.accountDetails.alias = formValueChange.value;
      }
    );
  }

  nextClick() {
    if (this.pageTitle.stepper?.stepCounter == 1) {
      this.summary = {
        title: {
          id: "",
          title: "Summary"
        },
        sections: [
          {
            items: [
              {
                title: "public.account-number",
                subTitle: this.accountDetails?.fullAccountNumber
              },
              {
                title: "public.nickname",
                subTitle: this.getControl(0, 0, "nickname").value
              }
            ]
          }
        ]
      }
      this.stepperMoveNext();
      this.backButton.text = "public.back";
    } else {
      this.accService.updateNickNameUpdate(this.accountDetails).subscribe((response: BaseResponse) => {
        if (response) {
          this.result = {
            title: "accounts.update-success-message",
            summary: this.summary,
            type: "Success"
          }
          this.startButtons = [];
          this.endButtons = [];
          this.endButtons = getSummaryEndButton();
          this.stepperMoveNext();
        }
      });

    }


  }

  backClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.router.navigate(['/accounts/statement']);
        break;
      case 2:
        this.stepperMoveBack();
        this.endButtons = [this.nextButton];
        break;
    }
  }

  override onResultChanged(data: FormResult[]): void {
    let valid = true;
    data.forEach(item => {
      valid = valid && item.valid;
    })
    this.endButtons[0].isDisable = !valid;
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'Next':
        this.nextClick();
        break;
      case 'Back':
        this.backButton.text = "public.cancel";
        this.backClick();
        break;
      case "goToAccounts":
        this.router.navigate(['/accounts']);
        this.setBreadcrumb([{
          text: 'accounts.accounts',
          url: '/accounts'
        }]);
        break;
      case "to-dashboard":
        this.router.navigate(['/dashboard']);
        this.setBreadcrumb([{
          text: 'accounts.dashboard',
          url: '/dashboard'
        }]);
        break;
    }
  }
}
