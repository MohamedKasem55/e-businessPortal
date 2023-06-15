import {Component} from '@angular/core';
import {AccountControl} from 'app/@core/model/dto/control/account-control';
import {AmountControl} from 'app/@core/model/dto/control/amount-control';
import {TextInputControl} from 'app/@core/model/dto/control/text-input-control';
import {TitleControl} from 'app/@core/model/dto/control/title-control';
import {FormModel, FormResult, PageModel} from 'app/@core/model/dto/formModel';
import {ResultModal} from 'app/@core/model/dto/result.modal';
import {ValidationsEnum} from 'app/@core/model/dto/validations-enum';
import {PendingActionFactory} from 'app/@core/service/base/pending-action-factory.service';
import {AmountTitleModel} from "arb-design-library/model/amount-title.model";
import {ChipsModel} from "arb-design-library/model/chip.model";
import {PaginationValueModel} from "arb-design-library/model/pagination.model";
import {SummarySectionModel} from "arb-design-library/model/summary-section.model";
import {SummaryModel} from "arb-design-library/model/summary.model";
import {DropdownControl} from "../../../@core/model/dto/control/dropdown-control";
import {PillControl} from "../../../@core/model/dto/control/pill-control";
import {SelectionControl} from "../../../@core/model/dto/control/selection-control";
import {TableControl} from "../../../@core/model/dto/control/table-control";
import {PopupOutputModel} from "../../../@core/model/dto/popup.model";
import {Account} from "../../../@core/model/rest/common/account";
import {RequestValidate} from "../../../@core/model/rest/common/otp.model";
import {BeneficiariesReqModel} from "../../../@core/model/rest/transfer/beneficiary/beneficiaries-req.model";
import {BeneficiaryModel} from "../../../@core/model/rest/transfer/beneficiary/beneficiary.model";
import {ConfirmReqModel} from "../../../@core/model/rest/transfer/international-transfer/confirm-req.model";
import {CurrencyReqModel} from "../../../@core/model/rest/transfer/international-transfer/currency-req.model";
import {CurrencyItem} from "../../../@core/model/rest/transfer/international-transfer/currency-res.model";
import {ReasonsReqModel} from "../../../@core/model/rest/transfer/international-transfer/reasons-req.model";
import {ReasonsModal} from "../../../@core/model/rest/transfer/international-transfer/reasons-res.model";
import {
  TransferInt,
  ValidateReqModel
} from "../../../@core/model/rest/transfer/international-transfer/validate-req.model";
import {ValidateResModel} from "../../../@core/model/rest/transfer/international-transfer/validate-res.model";
import {ModelAndListService} from "../../../@core/service/base/modelAndList.service";
import {PopupService} from "../../../@core/service/base/popup.service";
import {ResponseException} from "../../../@core/service/base/responseException";
import {VerificationService} from "../../../@core/service/base/verification.service";
import {BeneficiariesService} from "../../../@core/service/transfer/beneficiaries/beneficiaries.service";
import {
  InternationalTransferService
} from "../../../@core/service/transfer/international-transfer/international-transfer.service";
import {Utils} from "../../../@core/utility/Utils";
import {FormButtonClickOutput} from "../../../shared/form/form.component";
import {TransferBaseComponent} from "../transfer-base/transfer-base.component";
import {
  accountDetails,
  additionalInfo1,
  additionalInfo2,
  amountControl,
  currencyControl,
  deleteButton,
  fromAccountControl,
  getSearchForm,
  pillControl,
  reasonsControl,
  remarksControl,
  sameDebitCheckControl,
  selectBeneficiariesForm,
  toBeneficiary,
  transferDetails
} from './international-transfer-controls';

@Component({
  selector: 'app-alrajhi-transfer',
  templateUrl: '../transfer-base/transfer-base.component.html',
  styleUrls: []
})

export class InternationalTransferComponent extends TransferBaseComponent {

  validateResponse!: ValidateResModel;
  beneficiariesReq!: BeneficiariesReqModel;
  searchForm: FormModel = getSearchForm();
  selectedBeneficiaries: BeneficiaryModel[] = [];
  beneficiaryList: any[] = [];
  remitterCategory: string = "";

  constructor(private popupService: PopupService, private modelAndListService: ModelAndListService,
              private transferService: InternationalTransferService, private otpService: VerificationService, private pendingActionFactory: PendingActionFactory,
              private beneficiariesService: BeneficiariesService) {
    super();
    this.setBreadcrumb([{
      text: 'transfer.transfer',
      url: '/transfer'
    }, {text: 'transfer.international-transfer', url: ''}]);
    this.pageTitle.id = "InternationalTransferTitle";
    this.pageTitle.title = "transfer.international-transfer";
    this.pageTitle.showArrow = true;
    this.pageTitle.stepper!.steps = ["", "", "", ""];
    this.endButtons[0].showLoading = true;
    this.pages = [new PageModel(1, selectBeneficiariesForm(this.translate))];
    let options: BeneficiariesReqModel = history.state.benefName ? {
      filterBenefName: history.state.benefName,
      filterCriteria: "beneficiary"
    } : {};
    this.setBeneficiariesReq(options);
    this.getBeneficiaries();
    this.updateChips();
    this.setBeneficiariesTitle();
    this.nextButton.text = this.translate.instant("transfer.send-transfer", {"0": this.selectedBeneficiaries.length});

    this.getStaticList();

    (this.getControl(0, 0, "beneficiariesTable") as TableControl).externalPagination?.subscribe((data: PaginationValueModel) => {
      this.onTablePagination(data);
    });

    (this.getControl(0, 0, "beneficiariesTable") as TableControl).onFilterClick?.subscribe(() => {
      this.openSearch();
    });
  }

  getStaticList() {

    this.modelAndListService.getList(['currency', 'backEndCountryCode', 'beneficiaryCategory']).subscribe(data => {
      this.getControl(0, 0, "beneficiariesTable").controlOptions.headers[4].mapObject = data['backEndCountryCode'];
      this.getControl(0, 0, "beneficiariesTable").controlOptions.headers[5].mapObject = data['currency'];
      this.getControl(0, 0, "beneficiariesTable").controlOptions.headers[6].mapObject = data['beneficiaryCategory'];
    })

  }


  setBeneficiariesReq(options: BeneficiariesReqModel = {}) {
    this.beneficiariesReq = {
      erNumber: "",
      filterBankCode: "",
      filterBenefName: options.filterBenefName || '',
      filterCriteria: options.filterCriteria || 'beneficiary',
      filterCurrency: "",
      page: options.page || 1,
      pageSize: "",
      rows: options.rows || 10,
      type: "03",
    };
  }


  getBeneficiaries() {
    this.beneficiariesService.getBeneficiaries(this.beneficiariesReq).subscribe({
      next: data => {
        this.beneficiaryList = data.beneficiaryList;
        this.beneficiaryList.forEach(item => {
          item.beneficiaryIdErn = item.beneficiaryId + item.ernumber;
        });
        this.remitterCategory = data.remitterCategory;
        this.getControl(0, 0, "beneficiariesTable").controlOptions.data = this.beneficiaryList;
        this.getControl(0, 0, "beneficiariesTable").controlOptions.total = data.total;
        this.endButtons[0].showLoading = false;

        if (history.state.benefName) {
          this.searchForm.controls['beneficiaryName'].setValue(history.state.benefName);
          this.getControl(0, 0, "beneficiariesTable").controlOptions.filterIsActive = true;
        }

        if (history.state.benefName && this.beneficiaryList.length == 1) {
          this.selectedBeneficiaries = [this.beneficiaryList[0]];
          this.nextClick();
        }

      },
      error: () => {
        this.getControl(0, 0, "beneficiariesTable").controlOptions.data = [];
      }
    });
  }

  onTablePagination(data: PaginationValueModel) {
    this.endButtons[0].showLoading = true;
    this.setBeneficiariesReq({page: data.page, rows: data.size});
    this.getBeneficiaries();
  }


  setBeneficiariesTitle() {
    this.getControl(0, 0, "beneficiariesTable").valueChanges.subscribe(value => {
      this.selectedBeneficiaries = value.value;
      this.updateChips();
      this.nextButton.text = this.translate.instant("transfer.send-transfer", {"0": this.selectedBeneficiaries.length});
    });
  }

  updateChips() {
    let chips: ChipsModel[] = [];
    this.selectedBeneficiaries.forEach(item => {
      chips.push({id: item.beneficiaryId, label: item.beneficiaryFullName, showClose: true});
    });
    this.getControl(0, 0, "selectedCountTitle").controlOptions.chips = chips;
    this.getControl(0, 0, "selectedCountTitle").controlOptions.title =
      this.translate.instant("transfer.selected-beneficiaries", {"0": this.selectedBeneficiaries.length});
    this.nextButton.text = this.translate.instant("transfer.send-transfer", {"0": this.selectedBeneficiaries.length});
    this.nextButton.isDisable = this.selectedBeneficiaries.length <= 0;
  }

  drawPages() {

    let page: PageModel = new PageModel(2);
    this.selectedBeneficiaries.forEach((item, index) => {
      let form = new FormModel({
        id: 'formFromAccount-' + (index + 1),
        showDivider: true,
        controls: {
          "title": new TitleControl(structuredClone(toBeneficiary)),
          "pill": new PillControl(structuredClone(pillControl)),
          "accountDetails": new TitleControl(structuredClone(accountDetails)),
          "fromAccountControl": new AccountControl(structuredClone(fromAccountControl)),
          "amountControl": new AmountControl(structuredClone(amountControl)),
          "transferDetails": new TitleControl(structuredClone(transferDetails)),
          "remarksControl": new TextInputControl(structuredClone(remarksControl)),
          "currencyControl": new DropdownControl(structuredClone(currencyControl)),
          "reasonsControl": new DropdownControl(structuredClone(reasonsControl)),
          "additionalInfo1": new TextInputControl(structuredClone(additionalInfo1)),
          "additionalInfo2": new TextInputControl(structuredClone(additionalInfo2)),
        },
      });
      if (index === 0 && this.selectedBeneficiaries.length && this.selectedBeneficiaries.length > 1) {
        form.updateControl('sameDebitCheckControl', new SelectionControl(sameDebitCheckControl));
        form.controls['sameDebitCheckControl'].controlOptions.title[0].text = "transfer.use-same-account";
      }
      form.controls["title"].controlOptions.id = "TITLE";
      form.controls["title"].controlOptions.title = "TITLE";
      form.controls["pill"].controlOptions.text = "INTERNATIONAL TRANSFER #" + (index + 1);
      form.controls["title"].controlOptions.title = item.name;
      form.controls["title"].controlOptions.subTitle = item.bankName ? item.bankName + ' - ' + item.beneficiaryAccountCode : item.beneficiaryAccountCode;
      form.controls["title"].controlOptions.endButtons = index > 0 ? [deleteButton] : [];
      this.endButtons[0].showLoading = false;
      this.endButtons[0].isDisable = true;
      page.addForm(form);
    });
    this.pages = [this.pages[0], page];

    this.initiateInternationalTransfer();
    this.stepperMoveNext();
    this.getReasons();
    this.endButtons[0].text = "public.next";

    this.getControl(1, 0, "fromAccountControl").valueChanges.subscribe(() => {
      this.setSameDebitAccount();
    });
    this.getControl(1, 0, "amountControl").valueChanges.subscribe(() => {
      this.setSameDebitAccount();
    });

    // this.getControl(1, 0, "currencyControl").valueChanges.subscribe(() => {
    //   this.setSameDebitAccount();
    // });

    this.getControl(1, 0, "sameDebitCheckControl")?.valueChanges.subscribe(() => {
      this.setSameDebitAccount();
    });
  }

  setSameDebitAccount() {
    if (this.getControl(1, 0, 'sameDebitCheckControl')?.value === true) {
      const account = this.getControl(1, 0, "fromAccountControl").value;
      const amount = this.getControl(1, 0, "amountControl").value;
      this.pages[1].forms.forEach((item, index) => {
        if (index > 0) {
          if (item.controls['fromAccountControl'].value != account) {
            this.onAccountChange(account, index);
          }
          item.controls['fromAccountControl'].setValue(account);
          item.controls['amountControl'].setValue(amount);
        }
      });
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
      case 'Confirm':
        this.nextClick();
        break;
      case 'arrowTitle':
      case 'Back':
      case 'Edit':
        this.backClick();
        break;
      case 'SwitchAccounts':
        break;
      case 'PendingActions':
        void this.router.navigate(["/pendingActions/pending-actions-list"]);
        break;
      case 'Transfers':
        void this.router.navigate(['/transfer']);
        break;
      case 'AddNewBeneficiary':
        this.router.navigateByUrl('/transfer/add-beneficiaries', {state: {beneficiaryAdd: 'international'}}).then(() => {
        });
        break;
      case 'delete':
        this.deleteTransfer(formButtonClickOutput.formIndex!);
        break;
      case 'goToDashboard':
        this.router.navigate(['/dashboard']).then(() => {
        });
        break;
      default:
        this.deleteChips(formButtonClickOutput.buttonId);
        break;
    }
  }

  openSearch() {
    this.popupService.showPopup({image: '', form: this.searchForm}).subscribe((res: PopupOutputModel) => {
      if (res.buttonId == "search") {
        this.popupService.dismiss();
        this.setBeneficiariesReq({filterBenefName: res.controls!["beneficiaryName"].value});
        this.getBeneficiaries();
        this.getControl(0, 0, "beneficiariesTable").controlOptions.filterIsActive = res.controls!["beneficiaryName"].value != '';
      } else if (res.buttonId == "reset") {
        this.popupService.dismiss();
        res.controls!['beneficiaryName'].setValue('')
        this.setBeneficiariesReq();
        this.getBeneficiaries();
      } else {
        this.popupService.dismiss();
      }
    });
  }

  deleteTransfer(id: number) {
    this.pages[1].deleteFrom(id);
    if (this.pages[1].forms.length == 1) {
      this.pages[1].forms[0].controls['title'].controlOptions.endButtons = []
    }

    this.pages[1].forms.forEach((item: FormModel, index: number) => {
      item.controls["pill"].controlOptions.text = 'INTERNATIONAL TRANSFER #' + (index + 1);
    });

    if (this.pages[1].forms.length === 1) {
      this.getControl(1, 0, 'sameDebitCheckControl').hidden = true;
    }
  }

  deleteChips(id: string) {
    const idx = this.selectedBeneficiaries.findIndex(item => item.beneficiaryId == id);
    if (idx >= 0) {
      this.selectedBeneficiaries.splice(idx, 1);
    }
    this.getControl(0, 0, "beneficiariesTable").setValue(this.selectedBeneficiaries);
    this.updateChips();
  }

  nextClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.fillBeneficiaries();
        break;
      case 2:
        this.validateTransfer();
        break;
      case 3:
        this.validateResponse.checkAndSeparateInitiatitionPermission.toProcess.length > 0 ? this.showOtp() : this.confirmTransfer();
        break;
    }
  }

  backClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        void this.router.navigate(['/transfer']);
        break;
      case 2:
        this.nextButton.text = this.translate.instant("transfer.send-transfer", {"0": this.selectedBeneficiaries.length});
        this.endButtons = [this.nextButton];
        this.stepperMoveBack();
        break
      case 3:
        this.endButtons = [this.nextButton];
        this.stepperMoveBack();
        break;
      case 4:
        this.stepperMoveBack();
        this.nextButton.showLoading = false;
        this.endButtons = [this.nextButton];
        break;
    }
  }

  fillSummary(showEditButton: boolean = true): SummaryModel {
    let sections: SummarySectionModel[] = [];
    let totalAmount: any = {}

    let res = [];
    res.push(...this.validateResponse.checkAndSeparateInitiatitionPermission.toAuthorize || []);
    res.push(...this.validateResponse.checkAndSeparateInitiatitionPermission.toProcess);

    res.forEach((item, index) => {

      totalAmount[item.currency || '608'] = (totalAmount[item.currency || "608"] || 0) + item.amount;
      sections.push(
        {
          pill: {
            text: "INTERNATIONAL TRANSFER #" + (index + 1),
            type: "Neutral"
          },
          title: {
            id: 'transferDetailsTitle' + (index + 1),
            title: item.beneficiary,
            subTitle: item.bankName ? item.bankName + ' - ' + item.accountTo : item.accountTo,
            startButtons: showEditButton ? [this.editButton] : [],
          },
          items: [
            {
              title: 'public.from',
              subTitle: Utils.getAccountAndAlias(this.getControl(1, 0, "fromAccountControl").controlOptions.options, item.accountNumber),
            },
            {
              title: 'public.date',
              subTitle: new Date().toDateString()
            },
            {
              title: 'public.amount',
              subTitle: item.amount!.toString(),
              currency: item.currency || ''
            },
            {
              title: 'public.fees',
              subTitle: item.feesAmount,
              currency: '608'
            },
            Utils.getCurrentLevelSummaryItem(this.translate, item.futureSecurityLevelsDTOList),
            Utils.getNextLevelSummaryItem(this.translate, item.futureSecurityLevelsDTOList),
            {
              title: 'transfer.remarks',
              subTitle: item.remarks
            },
          ]
        });
    });
    let subTitle: AmountTitleModel[] = [];
    Object.keys(totalAmount).forEach(item => {
      subTitle.push({
        text: 'public.total-amount',
        amount: totalAmount[item],
        currency: item
      })

    })
    return {
      title: {
        id: 'SummaryTitle',
        title: 'public.summary',
        subTitle,
      },
      sections: sections
    }
  }

  fillSuccessResult(hasNextApprovalLevel: boolean): ResultModal {
    return {
      type: (hasNextApprovalLevel) ? 'Pending' : 'Success',
      title: (hasNextApprovalLevel) ? 'public.submit-success' : 'transfer.money-successfully-transferred',
      subTitle: 'transfer.international-transfer',
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

  onAccountChange(account: Account, formIndex: number) {
    let data: CurrencyReqModel = {
      beneficiaryCurrency: this.selectedBeneficiaries[formIndex].beneficiaryCurrency,
      selectedAccount: account
    }
    this.transferService.getCurrencyInternationalTransfer(data).subscribe(res => {
      this.pages[1].forms[formIndex].controls["currencyControl"].controlOptions.options = res.currencies;
    });
  }


  updateCurrency(currency: CurrencyItem, formIndex: number) {
    this.pages[1].forms[formIndex].controls["amountControl"].controlOptions.currency = currency.currencyCode;
  }

  updateReasons(reason: ReasonsModal, formIndex: number) {
    this.pages[1].forms[formIndex].controls["additionalInfo1"].hidden = true;
    this.pages[1].forms[formIndex].controls["additionalInfo1"].setRequired(false);
    this.pages[1].forms[formIndex].controls["additionalInfo2"].hidden = true;
    this.pages[1].forms[formIndex].controls["additionalInfo2"].setRequired(false);
    if (reason.additionalInfo1En || reason.additionalInfo1Ar) {
      this.pages[1].forms[formIndex].controls["additionalInfo1"].hidden = false;
      this.pages[1].forms[formIndex].controls["additionalInfo1"].setRequired(true);
      this.pages[1].forms[formIndex].controls["additionalInfo1"].label = this.translate.currentLang == 'en' ? reason.additionalInfo1En : reason.additionalInfo1Ar;
    }
    if (reason.additionalInfo2En || reason.additionalInfo2Ar) {
      this.pages[1].forms[formIndex].controls["additionalInfo2"].hidden = false;
      this.pages[1].forms[formIndex].controls["additionalInfo2"].setRequired(true);
      this.pages[1].forms[formIndex].controls["additionalInfo2"].label = this.translate.currentLang == 'en' ? reason.additionalInfo2En : reason.additionalInfo2Ar;
    }
  }

  initiateInternationalTransfer() {
    this.endButtons[0].showLoading = true;
    this.transferService.initiateInternationalTransfer({listBeneficiaries: []}).subscribe((res) => {
      this.pages[1].forms.forEach((item, index) => {
        item.controls['fromAccountControl'].valueChanges.subscribe(value => {
          this.onAccountChange(value.value, value.formIndex);
        });
        if (this.selectedBeneficiaries[index].currencyDTO.code!=='608') {
          item.controls['fromAccountControl'].controlOptions.options =
          res.listAccount.filter(
            (element) =>
              element.currency === '608' ||
              element.currency ===
                this.selectedBeneficiaries[index].currencyDTO.code
          );
        } else {
          item.controls['fromAccountControl'].controlOptions.options = res.listAccount;
        }
        item.controls['amountControl'].setValidators([{validation: ValidationsEnum.MIN, options: "0.1"}, {
          validation: ValidationsEnum.MAX,
          options: res.transferLimit.toString()
        }]);
        item.controls['amountControl'].validationLabels = {
          min: "transfer.amount-is-required",
          required: 'transfer.amount-is-required',
          max: 'transfer.maximum-transfer-limit',
          translateOptions: {"0": res.transferLimit.toString()}
        };
        item.controls['currencyControl'].valueChanges.subscribe(value => {
          this.updateCurrency(value.value, value.formIndex);
        });

        item.controls['reasonsControl'].valueChanges.subscribe(value => {
          this.updateReasons(value.value, value.formIndex);
        });

        // if (res.listAccount.length > 0) {
        //   item.controls['fromAccountControl'].setValue(res.listAccount[0]);
        // }
        this.endButtons[0].showLoading = false;
      });
    })
  }

  getValidateRequest(): ValidateReqModel {
    let transferIntList: TransferInt[] = [];
    let listBeneficiaries: BeneficiaryModel[] = [];
    this.pages[1].forms.forEach((item, index) => {
      let transferIntItem: TransferInt = {
        accountFrom: item.controls['fromAccountControl'].value.fullAccountNumber,
        additionalInfo1: item.controls['additionalInfo1'].value || "",
        additionalInfo1Lbl: item.controls['additionalInfo2'].required ? item.controls['additionalInfo1'].label : "",
        additionalInfo2: item.controls['additionalInfo2'].value || "",
        additionalInfo2Lbl: item.controls['additionalInfo2'].required ? item.controls['additionalInfo2'].label : "",
        additionalInfoFlag: item.controls['additionalInfo1'].required || item.controls['additionalInfo2'].required ? "1" : "0",
        amount: item.controls['amountControl'].value.toString(),
        currency: item.controls['currencyControl'].value.currencyCode.toString(),
        email: this.selectedBeneficiaries[index].email,
        payType: this.selectedBeneficiaries[index].payCode,
        remarks: item.controls['remarksControl'].value,
        transferReason: item.controls['reasonsControl'].value.purposeCode,
        transferReasonLbl: "prupose",
      }
      transferIntList.push(transferIntItem);

      let beneficiariy = this.selectedBeneficiaries[index];
      beneficiariy.beneficiaryAccountFrom = item.controls['fromAccountControl'].value;
      listBeneficiaries.push(beneficiariy);
    });
    let date = new Date();
    return {
      listBeneficiaries,
      operationDate: date.toISOString(),
      segment: JSON.parse(sessionStorage.getItem('welcome')!).segment,
      transferIntList,
      remitterCategory: this.remitterCategory
    }
  }

  validateTransfer() {
    this.transferService.validateInternationalTransfer(this.getValidateRequest()).subscribe((res) => {
      this.validateResponse = res;
      this.stepperMoveNext();
      this.summary = this.fillSummary();
      this.endButtons = [this.confirmButton];
    });
  }

  getConfirmRequest(requestValidate?: RequestValidate): ConfirmReqModel {
    return {
      batchList: this.validateResponse.checkAndSeparateInitiatitionPermission,
      totalAmountProcess: this.validateResponse.totalAmountProcess,
      listbatchToDelete: [],
      emailChecked: '',
      requestValidate: requestValidate,
      typeBatchList: 'batchListSelectedInternational'
    }
  }

  fillBeneficiaries() {
    this.endButtons[0].showLoading = true;
    this.beneficiariesService.fillBeneficiaries({
      listBeneficiariesSelected: this.selectedBeneficiaries,
      remitterCategory: this.remitterCategory
    }).subscribe(res => {
      this.selectedBeneficiaries = res.listBeneficiaries;
      this.drawPages();
    });

  }

  getReasons() {

    this.pages[1].forms.forEach((item, index) => {
      let beneficiary = this.selectedBeneficiaries[index];
      let data: ReasonsReqModel = {
        beneficiaryCategory: beneficiary.beneficiaryCategory,
        payCode: beneficiary.payCode,
        remitterCategory: this.remitterCategory,
      };
      this.transferService.getReasonsInternationalTransfer(data).subscribe(reasonsList => {
        item.controls["reasonsControl"].controlOptions.options = reasonsList.transferReasonsList;
        item.controls["reasonsControl"].controlOptions.textField = this.translate.currentLang == "en" ? "purposeDescriptionEn" : "purposeDescriptionAr";
      });
    });
  }

  showOtp() {
    this.otpService.showVerification(this.validateResponse.generateChallengeAndOTP).subscribe((requestValidate: RequestValidate) => {
      this.confirmTransfer(requestValidate);
    });
  }

  confirmTransfer(requestValidate?: RequestValidate) {
    let confirmReqModel = this.getConfirmRequest(requestValidate);
    this.transferService.confirmInternationalTransfer(confirmReqModel).subscribe(
      {
        next: (res) => {
          this.stepperMoveNext();
          this.startButtons = [];
          this.summary = {};
          this.hasNextApprovalLevel = this.validateResponse.checkAndSeparateInitiatitionPermission.toAuthorize ? this.validateResponse.checkAndSeparateInitiatitionPermission.toAuthorize.length > 0 : false;
          this.result = this.fillSuccessResult(this.hasNextApprovalLevel);
          this.endButtons = (this.hasNextApprovalLevel && (this.showPendingActions)) ? [this.pendingActionsButton, this.transferButton] : [this.goToDashboardButton, this.transferButton];
          if (this.hasNextApprovalLevel)
            this.pendingActionFactory.fetchPendingActions();
        },
        error: (error: ResponseException) => {
          this.nextButton.showLoading = false;
        }
      });
  }

}
