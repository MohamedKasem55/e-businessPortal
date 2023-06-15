import {Component} from '@angular/core';
import {TransferBaseComponent} from '../transfer-base/transfer-base.component';
import {OwnTransferService} from '../../../@core/service/transfer/own-transfer/own-transfer.service'
import {
  accountsForm
} from "./own-transfer-controls";
import {FormResult, PageModel} from "../../../@core/model/dto/formModel";
import {SummaryModel} from "arb-design-library/model/summary.model";
import {ResultModal} from "../../../@core/model/dto/result.modal";
import {ValidationsEnum} from "../../../@core/model/dto/validations-enum";
import {CurrencyPipe} from "../../../@core/pipe/currency.pipe";
import {ValidateReqModel} from "../../../@core/model/rest/transfer/ownTransfer/validate-req.model";
import {ConfirmReqModel} from "../../../@core/model/rest/transfer/ownTransfer/confirm-req.model";
import {InitiateResModel} from "../../../@core/model/rest/transfer/ownTransfer/initiate-res.model";
import {ValidateResModel} from "../../../@core/model/rest/transfer/ownTransfer/validate-res.model";
import {ResponseException} from "../../../@core/service/base/responseException";
import {ModelAndListService} from "../../../@core/service/base/modelAndList.service";
import {RequestValidate} from 'app/@core/model/rest/common/otp.model';
import {VerificationService} from 'app/@core/service/base/verification.service';
import {FormButtonClickOutput} from "../../../shared/form/form.component";
import {Utils} from "../../../@core/utility/Utils";
import { SummaryItemModel } from 'arb-design-library/model/summary-item.model';


@Component({
  selector: 'app-transfer-between-accounts',
  templateUrl: '../transfer-base/transfer-base.component.html',
})
export class OwnTransferComponent extends TransferBaseComponent {

  validateResponse!: ValidateResModel;

  currencies: any;
  currenciesIso: any;

  constructor(private transferService: OwnTransferService, private otpService: VerificationService,
              private modelAndListService: ModelAndListService,
              private currencyPipe: CurrencyPipe) {
    super();
    this.setBreadcrumb([{
      text: 'transfer.transfer',
      url: '/transfer'
    }, {text: 'transfer.own-transfer.between-accounts', url: ''}]);
    this.getAccountsList();
    this.fillCurrencyType();
    this.fillCurrencyIso();
    this.pageTitle.id = 'betweenAccounts';
    this.pageTitle.title = 'transfer.own-transfer.between-accounts';
    this.pageTitle.showArrow = true;
    this.drawPage();
  }

  accountsValueChanged(isFrom: boolean = false) {
    if (isFrom) {
      this.getControl(0, 0, "toAccountControl").setValue(null);
      this.getControl(0, 0, "currencyControl").setValue(null);
      this.getControl(0, 0, "currencyControl").controlOptions.options = null;
      this.getControl(0, 0, "currencyControl").hidden = true;
      this.getControl(0, 0, "toAccountControl").controlOptions.options = this.deleteInitDuplicates(this.getControl(0, 0, "fromAccountControl").controlOptions.options, true);
    }
    if (this.getControl(0, 0, "fromAccountControl").value && this.getControl(0, 0, "toAccountControl").value) {
      let showCurrency = this.getControl(0, 0, "fromAccountControl").value.currency !== this.getControl(0, 0, "toAccountControl").value.currency;
      if (showCurrency) {
        this.fillCurrencies(this.getControl(0, 0, "fromAccountControl").value.currency, this.getControl(0, 0, "toAccountControl").value.currency);
        this.getControl(0, 0, "currencyControl").setValue('');
        this.getControl(0, 0, "currencyControl").hidden = false;
        this.getControl(0, 0, "currencyControl").setRequired(true);
      } else {
        this.setCurrencyOptions(this.getControl(0, 0, "fromAccountControl").value.currency);
        this.getControl(0, 0, "currencyControl").hidden = true;
        this.getControl(0, 0, "currencyControl").setRequired(false);
      }
      this.getControl(0, 0, "switchButton").hidden = false;
    }
  }

  drawPage() {
    this.pages = [];
    this.pages = [new PageModel(1, accountsForm())];

    this.getControl(0, 0, "fromAccountControl").valueChanges.subscribe((value: any) => {
      this.accountsValueChanged(true);
    });
    this.getControl(0, 0, "toAccountControl").valueChanges.subscribe((value: any) => {
      this.accountsValueChanged();
    });

    this.getControl(0, 0, "currencyControl").valueChanges.subscribe((value: any) => {
      this.getControl(0, 0, "amountControl").controlOptions = {currency: value.value.key};
    });
  }

  setCurrencyOptions(currency: string) {
    let value = {key: currency, value: this.currencyPipe.transform(currency)};
    this.getControl(0, 0, "currencyControl").controlOptions.options = [value];
    this.getControl(0, 0, "currencyControl").setValue(value)
    this.getControl(0, 0, "amountControl").controlOptions = {currency: value.key};
  }

  fillCurrencies(fromCurrency: string, toCurrency: string) {
    let currencyOptions = [];
    currencyOptions.push({
      key: fromCurrency,
      value: this.currencies[fromCurrency],
      code: this.currenciesIso[fromCurrency]
    });
    currencyOptions.push({key: toCurrency, value: this.currencies[toCurrency], code: this.currenciesIso[toCurrency]});
    this.getControl(0, 0, "currencyControl").controlOptions.options = currencyOptions;
  }


  override onResultChanged(data: FormResult[]) {
    this.endButtons[0].isDisable = !data[0].valid;
  }


  fillCurrencyType() {
    this.modelAndListService.getModel("currencyType").subscribe(data => {
      this.currencies = data.currencyType;
    });
  }

  fillCurrencyIso() {
    this.modelAndListService.getModel("currencyIso").subscribe(data => {
      this.currenciesIso = data.currencyIso;
    });
  }

  fillSummary(showEditButton: boolean = true): SummaryModel {
    return {
      title: {
        id: 'SummaryTitle',
        title: 'public.summary',
        subTitle: 'public.total-amount',
        amount: this.getControl(0, 0, "amountControl").value,
        currency: this.getControl(0, 0, "currencyControl").value.value,
      },
      sections: [
        {
          title: {
            id: 'transferDetailsTitle',
            title: 'transfer.transfer-details',
            startButtons: showEditButton ? [this.editButton] : [],
          },
          items: [
            {
              title: 'public.from',
              subTitle: this.getControl(0, 0, "fromAccountControl").value.alias + ' ' +
                this.getControl(0, 0, "fromAccountControl").value.fullAccountNumber
            },
            {
              title: 'public.to',
              subTitle: this.getControl(0, 0, "toAccountControl").value.alias + ' ' + this.getControl(0, 0, "toAccountControl").value.fullAccountNumber
            },
            {
              title: 'public.amount',
              subTitle: this.getControl(0, 0, "amountControl").value!,
              currency: this.getControl(0, 0, "currencyControl").value.value,
            },
            ...(this.getControl(0, 0, 'fromAccountControl').value.currency !==
            this.getControl(0, 0, 'toAccountControl').value.currency
              ? [
                  {
                    title: 'transfer.deposit-amount',
                    subTitle: this.validateResponse?.inqRates?.contraAmt,
                    currency: this.validateResponse?.toCurrency,
                  },
                  {
                    title: 'transfer.exchange-rate',
                    subTitle: this.validateResponse?.inqRates?.rate,
                  },
                ]
              : []),
            {
              title: 'transfer.remarks',
              subTitle: this.getControl(0, 0, "remarksControl").value!,
            },
            Utils.getCurrentLevelSummaryItem(this.translate, this.validateResponse.checkAndSeparateInitiationPermission.toProcess.length > 0 ? this.validateResponse.checkAndSeparateInitiationPermission.toProcess[0].futureSecurityLevelsDTOList : this.validateResponse.checkAndSeparateInitiationPermission.toAuthorize ? this.validateResponse.checkAndSeparateInitiationPermission.toAuthorize[0].futureSecurityLevelsDTOList : undefined),
            Utils.getNextLevelSummaryItem(this.translate, this.validateResponse.checkAndSeparateInitiationPermission.toProcess.length > 0 ? this.validateResponse.checkAndSeparateInitiationPermission.toProcess[0].futureSecurityLevelsDTOList : this.validateResponse.checkAndSeparateInitiationPermission.toAuthorize ? this.validateResponse.checkAndSeparateInitiationPermission.toAuthorize[0].futureSecurityLevelsDTOList : undefined),
          ],
        },
      ],
    };
  }

  fillSuccessResult(hasNextApprovalLevel: boolean): ResultModal {
    return {
      type: (hasNextApprovalLevel) ? 'Pending' : 'Success',
      title: (hasNextApprovalLevel) ? 'public.submit-success' : 'transfer.money-successfully-transferred',
      subTitle: 'transfer.own-transfer.between-accounts',
      summary: this.fillSummary(false),
    };
  }

  fillErrorResult(errString: string): ResultModal {
    return {
      type: 'Error',
      title: errString,
      summary: this.fillSummary(false),
    };
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'Next':
        this.nextClick();
        break;
      case 'Confirm':
        this.nextClick();
        break;
      case 'arrowTitle':
      case 'Back':
      case 'Edit':
        this.backClick();
        break;
      case 'SwitchAccounts':
        this.switchAccounts();
        break;
      case 'PendingActions':
        void this.router.navigate(["/pendingActions/pending-actions-list"]);
        break;
      case 'goToDashboard':
        this.router.navigate(['/dashboard']).then(() => {
        });
        break;
      case 'Transfers':
        void this.router.navigate(['/transfer']);
        break;
    }
  }

  nextClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.validateTransfer();
        break;
      case 2:
        // this.validateResponse.checkAndSeparateInitiationPermission.toProcess.length > 0 && (this.getControl(0, 0, "toAccountControl").value.currency !== '608' || this.getControl(0, 0, "fromAccountControl").value.currency !== '608') ? this.showOtp() : this.confirmTransfer();
        this.validateResponse.generateChallengeAndOTP ? this.showOtp() : this.confirmTransfer();
        break;
    }
  }

  backClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        void this.router.navigate(['/transfer']);
        break;
      case 2:
        this.stepperMoveBack();
        this.nextButton.showLoading = false;
        this.endButtons = [this.nextButton];
        break;
    }
  }

  showOtp() {
    this.otpService.showVerification(this.validateResponse.generateChallengeAndOTP).subscribe((requestValidate: RequestValidate) => {
      this.confirmTransfer(requestValidate);
    });
  }

  switchAccounts() {
    let fromValue = this.getControl(0, 0, "fromAccountControl").value;
    let toValue = this.getControl(0, 0, "toAccountControl").value;
    this.getControl(0, 0, "fromAccountControl").setValue(toValue);
    this.getControl(0, 0, "toAccountControl").controlOptions.options = this.deleteInitDuplicates(this.getControl(0, 0, "fromAccountControl").controlOptions.options, true);
    setTimeout(() => {
      this.getControl(0, 0, "toAccountControl").setValue(fromValue);
    });
  }


  returnRequestValidate(): ValidateReqModel {
    const accountDTOTo = this.getControl(0, 0, "toAccountControl").value;
    delete accountDTOTo.displayText;
    delete accountDTOTo.selected;
    const accountDTOFrom = this.getControl(0, 0, "fromAccountControl").value;
    delete accountDTOFrom.displayText;
    delete accountDTOFrom.selected;

    return {
      amount: parseFloat(this.getControl(0, 0, "amountControl").value!),
      accountDTOTo: accountDTOTo,
      accountDTOFrom: accountDTOFrom,
      remarks: this.getControl(0, 0, "remarksControl").value!,
      dealCurrency: this.getControl(0, 0, "fromAccountControl").value.currency !== this.getControl(0, 0, "toAccountControl").value.currency ? this.getControl(0, 0, "currencyControl").value.code : this.getControl(0, 0, "currencyControl").value.value,
      segment: JSON.parse(sessionStorage.getItem('welcome')!).segment,
    }
  }


  getAccountsList() {
    this.endButtons[0].showLoading = true;
    this.transferService.initiateOwnTransfer().subscribe((res: InitiateResModel) => {
      this.getControl(0, 0, "fromAccountControl").controlOptions.options = res.accountList;
      this.getControl(0, 0, "toAccountControl").controlOptions.options = res.accountList;
      this.getControl(0, 0, "amountControl").setValidators([{validation: ValidationsEnum.MIN, options: "0.1"}, {
        validation: ValidationsEnum.MAX,
        options: res.transferLimit?.toString()
      }]);
      this.getControl(0, 0, "amountControl").validationLabels = {
        min: "transfer.amount-is-required",
        required: 'transfer.amount-is-required',
        max: 'transfer.maximum-transfer-limit',
        translateOptions: {"0": res.transferLimit?.toString() || '0'}
      };

      if (res.accountList.length > 0) {
        this.getControl(0, 0, "fromAccountControl").setValue(res.accountList[0]);
        this.getControl(0, 0, "toAccountControl").controlOptions.options = this.deleteInitDuplicates(res.accountList);
        if (res.accountList.length == 2) {
          this.getControl(0, 0, "toAccountControl").setValue(res.accountList[1]);
          this.getControl(0, 0, "switchButton").hidden = false;
        }
        this.setCurrencyOptions(res.accountList[0].currency);
      }
      this.endButtons[0].showLoading = false;
    });
  }

  validateTransfer() {
    this.endButtons[0].showLoading = true;
    this.transferService.validateOwnTransfer(this.returnRequestValidate()).subscribe({
      next: (res) => {
        this.validateResponse = res;
        this.summary = this.fillSummary();
        this.stepperMoveNext();
        this.endButtons = [this.confirmButton];
        this.endButtons[0].showLoading = false;
      },
      error: () => {
        this.endButtons[0].showLoading = false;
      }
    });
  }

  confirmTransfer(otp?: RequestValidate) {
    let confirmReqModel = this.returnConfirmRequest(otp);
    this.transferService.confirmOwnTransfer(confirmReqModel).subscribe({
      next: (res) => {
        this.stepperMoveNext();
        this.startButtons = [];
        this.summary = {};
        this.hasNextApprovalLevel = this.validateResponse.checkAndSeparateInitiationPermission.toAuthorize ? this.validateResponse.checkAndSeparateInitiationPermission.toAuthorize?.length > 0 : false;
        this.result = this.fillSuccessResult(this.hasNextApprovalLevel);
        this.endButtons = (this.hasNextApprovalLevel && (this.showPendingActions)) ? [this.pendingActionsButton, this.transferButton] : [this.goToDashboardButton, this.transferButton];
      },
      error: (error: ResponseException) => {
        this.nextButton.showLoading = false;
      }
    });
  }

  returnConfirmRequest(otp?: RequestValidate): ConfirmReqModel {
    return {
      amountDealt: parseFloat(this.getControl(0, 0, "amountControl").value!),
      accountDTOTo: this.getControl(0, 0, "toAccountControl").value,
      accountDTOFrom: this.getControl(0, 0, "fromAccountControl").value,
      remarks: this.getControl(0, 0, "remarksControl").value!,
      currencyDeal: this.getControl(0, 0, "fromAccountControl").value.currency !== this.getControl(0, 0, "toAccountControl").value.currency ? this.getControl(0, 0, "currencyControl").value.code : this.getControl(0, 0, "currencyControl").value.value,
      requestValidate: otp ? otp : {},
      batchList: this.validateResponse.checkAndSeparateInitiationPermission,
      inqRates: this.validateResponse.inqRates
    }
  }

  deleteInitDuplicates(accountList?: any, fromChanged?: boolean): any {
    let accountListInitUpdated: any = structuredClone(accountList);
    let _index = -1;
    accountList.forEach((item: any, index: number) => {
      if (item.accountPk === this.getControl(0, 0, "fromAccountControl").value.accountPk) {
        _index = index
      }
    });
    if (_index >= 0) {
      accountListInitUpdated.splice(_index, 1);
    }

    if (fromChanged) {
      const accountsNotFiltered: any = accountListInitUpdated;
      if (
        this.getControl(0, 0, 'fromAccountControl').value.currency !== '608'
      ) {
        accountListInitUpdated = accountsNotFiltered.filter(
          (element: any) =>
            element.currency === '608' ||
            element.currency ===
            this.getControl(0, 0, 'fromAccountControl').value.currency
        );
      }
    }
    return accountListInitUpdated;
  }
}
