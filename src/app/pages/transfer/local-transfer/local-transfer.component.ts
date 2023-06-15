import {Component} from '@angular/core';
import {AccountControl} from 'app/@core/model/dto/control/account-control';
import {AmountControl} from 'app/@core/model/dto/control/amount-control';
import {DropdownControl} from 'app/@core/model/dto/control/dropdown-control';
import {PillControl} from 'app/@core/model/dto/control/pill-control';
import {TextInputControl} from 'app/@core/model/dto/control/text-input-control';
import {TitleControl} from 'app/@core/model/dto/control/title-control';
import {FormModel, FormResult, PageModel} from 'app/@core/model/dto/formModel';
import {ResultModal} from 'app/@core/model/dto/result.modal';
import {ValidationsEnum} from 'app/@core/model/dto/validations-enum';
import {BeneficiariesReqModel} from 'app/@core/model/rest/transfer/beneficiary/beneficiaries-req.model';
import {BeneficiaryModel} from 'app/@core/model/rest/transfer/beneficiary/beneficiary.model';
import {ReasonsModal} from 'app/@core/model/rest/transfer/international-transfer/reasons-res.model';
import {ReasonsReqModel} from 'app/@core/model/rest/transfer/local-transfer/reasons-req.model';
import {ValidateResModel} from 'app/@core/model/rest/transfer/local-transfer/validate-res.model';
import {PendingActionFactory} from 'app/@core/service/base/pending-action-factory.service';
import {VerificationService} from 'app/@core/service/base/verification.service';
import {BeneficiariesService} from 'app/@core/service/transfer/beneficiaries/beneficiaries.service';
import {ChipsModel} from 'arb-design-library/model/chip.model';
import {PaginationValueModel} from "arb-design-library/model/pagination.model";
import {SummarySectionModel} from 'arb-design-library/model/summary-section.model';
import {SummaryModel} from "arb-design-library/model/summary.model";
import {SelectionControl} from "../../../@core/model/dto/control/selection-control";
import {TableControl} from "../../../@core/model/dto/control/table-control";
import {PopupOutputModel} from "../../../@core/model/dto/popup.model";
import {Account} from "../../../@core/model/rest/common/account";
import {RequestValidate} from "../../../@core/model/rest/common/otp.model";
import {ConfirmReqModel} from "../../../@core/model/rest/transfer/local-transfer/confirm-req.model";
import {
  LocalTransferModel,
  ValidateReqModel
} from "../../../@core/model/rest/transfer/local-transfer/validate-req.model";
import {ModelAndListService} from "../../../@core/service/base/modelAndList.service";
import {PopupService} from "../../../@core/service/base/popup.service";
import {ResponseException} from "../../../@core/service/base/responseException";
import {LocalTransferService} from "../../../@core/service/transfer/local_transfer/local-transfer.service";
import {TransferService} from "../../../@core/service/transfer/transfer.service";
import {Utils} from "../../../@core/utility/Utils";
import {FormButtonClickOutput} from "../../../shared/form/form.component";
import {TransferBaseComponent} from '../transfer-base/transfer-base.component';
import {
  accountDetails,
  amountControl,
  deleteButton,
  emailControl,
  fromAccountControl,
  getSearchForm,
  pillControl,
  reasonsControl,
  remarksControl,
  sameDebitCheckControl,
  selectBeneficiariesForm,
  toBeneficiary,
  transferDetails
} from './local-transfer-controls';

@Component({
  selector: 'app-local-transfer',
  templateUrl: '../transfer-base/transfer-base.component.html',
  styleUrls: []
})
export class LocalTransferComponent extends TransferBaseComponent {

  validateResponse!: ValidateResModel;
  beneficiariesReq!: BeneficiariesReqModel;
  searchForm: FormModel = getSearchForm();
  originalAccount!: Account;
  selectedBeneficiaries: BeneficiaryModel[] = [];
  beneficiaryList: any[] = [];

  constructor(private transferService: TransferService, private otpService: VerificationService, private modelAndListService: ModelAndListService, private pendingActionFactory: PendingActionFactory,
              private beneficiariesService: BeneficiariesService, private popupService: PopupService, private localTransferService: LocalTransferService) {
    super();
    this.setBreadcrumb([{
      text: 'transfer.transfer',
      url: '/transfer'
    }, {text: 'transfer.local-transfer.title', url: ''}]);
    this.pageTitle.id = "InternationalTransferTitle";
    this.pageTitle.title = "transfer.local-transfer.title";
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
    this.modelAndListService.getModel('bankCode').subscribe(data => {
      this.getControl(0, 0, "beneficiariesTable").controlOptions.headers[2].mapObject = data['bankCode'];
      this.searchForm.controls['beneficiaryBank'].controlOptions.options = this.objectToKeyValue(data['bankCode']);
    })

  }


  setBeneficiariesReq(options: BeneficiariesReqModel = {}) {
    this.beneficiariesReq = {
      erNumber: "",
      filterBankName: options.filterBankName || '',
      filterBenefName: options.filterBenefName || '',
      filterCriteria: options.filterCriteria || 'beneficiary',
      filterCurrency: "",
      page: options.page || 1,
      pageSize: "",
      rows: options.rows || 10,
      type: "02",
    };
  }

  getBeneficiaries() {
    this.beneficiariesService.getBeneficiaries(this.beneficiariesReq).subscribe({
      next: data => {
        this.beneficiaryList = data.beneficiaryList;
        this.beneficiaryList.forEach(item => {
          item.beneficiaryIdErn = item.beneficiaryId + item.ernumber;
        });
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
      this.selectedBeneficiaries.slice(0, 1);
      this.updateChips();
      this.nextButton.text = this.translate.instant("transfer.send-transfer", {"0": this.selectedBeneficiaries.length});
    });

    this.setSearchFormChanges();
  }

  setSearchFormChanges() {
    this.searchForm.controls['beneficiaryName'].valueChanges.subscribe(() => {
      this.searchForm.controls['beneficiaryBank'].setValue('');
    });
    this.searchForm.controls['beneficiaryBank'].valueChanges.subscribe(() => {
      this.searchForm.controls['beneficiaryName'].setValue('');
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
          "reasonsControl": new DropdownControl(structuredClone(reasonsControl)),
          "emailControl": new TextInputControl(structuredClone(emailControl)),
        },
      });
      if (index === 0 && this.selectedBeneficiaries.length && this.selectedBeneficiaries.length > 1) {
        form.updateControl('sameDebitCheckControl', new SelectionControl(sameDebitCheckControl));
        form.controls['sameDebitCheckControl'].controlOptions.title[0].text = "transfer.use-same-account";
      }
      form.controls["pill"].controlOptions.text = "TRANSFER #" + (index + 1);
      form.controls["title"].controlOptions.title = item.name;
      form.controls["title"].controlOptions.subTitle = item.bankCode ? this.getControl(0, 0, "beneficiariesTable").controlOptions.headers[2].mapObject[item.bankCode] + ' - ' + item.beneficiaryAccountCode : item.beneficiaryAccountCode;
      form.controls["emailControl"].setValue(this.selectedBeneficiaries[index].email);
      form.controls["title"].controlOptions.endButtons = index > 0 ? [deleteButton] : [];

      page.addForm(form);
    });
    this.pages = [this.pages[0], page];
    this.initiateLocalTransfer();
    this.stepperMoveNext();
    this.getReasons();
    this.endButtons[0].showLoading = false;
    this.endButtons[0].isDisable = true;
    this.endButtons[0].text = "public.next";

    this.getControl(1, 0, "fromAccountControl").valueChanges.subscribe(() => {
      this.setSameDebitAccount();
    });
    this.getControl(1, 0, "amountControl").valueChanges.subscribe(() => {
      this.setSameDebitAccount();
    });

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
      case 'TableFilter':
        this.openSearch();
        break;
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
        this.router.navigateByUrl('/transfer/add-beneficiaries', {state: {beneficiaryAdd: 'local'}}).then(() => {
        });
        break;
      case 'delete':
        this.deleteTransfer(formButtonClickOutput.formIndex || 0);
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
        let filterCriteria = res.controls["beneficiaryBank"].value ? 'bankCode' : 'beneficiary';
        this.setBeneficiariesReq({
          filterCriteria,
          filterBenefName: res.controls["beneficiaryName"].value,
          filterBankName: res.controls["beneficiaryBank"].value?.key || '',
        });
        this.getBeneficiaries();
        this.getControl(0, 0, "beneficiariesTable").controlOptions.filterIsActive = res.controls!["beneficiaryName"].value || res.controls["beneficiaryBank"].value;
      } else if (res.buttonId == "reset") {
        this.popupService.dismiss();
        res.controls!['beneficiaryName'].setValue('')
        res.controls!['beneficiaryBank'].setValue('')
        this.setBeneficiariesReq();
        this.getBeneficiaries();
      } else {
        this.popupService.dismiss();
      }
    });
  }

  deleteTransfer(id: number) {
    this.pages[1].deleteFrom(id, 1);

    if (id === 0 && this.selectedBeneficiaries.length > 1) {
      this.pages[1].forms[id].updateControl('sameDebitCheckControl', new SelectionControl(sameDebitCheckControl));
      this.pages[1].forms[id].controls['sameDebitCheckControl'].controlOptions.title[0].text = "transfer.use-same-account";
    }
    if (this.pages[1].forms.length == 1) {
      this.getControl(1, 0, "sameDebitCheckControl").hidden = true;
    }

    this.pages[1].forms.forEach((item: FormModel, index: number) => {
      item.controls["pill"].controlOptions.text = 'TRANSFER #' + (index + 1);
    });
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
        this.validateResponse.checkAndSeparateInitiatitionPermission.toProcess.length > 0 ? this.showOtp() : this.confirmLocalTransfer();
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
        this.endButtons[0].isDisable = false;
        this.stepperMoveBack();
        break;
      case 3:
        this.stepperMoveBack();
        this.endButtons = [this.nextButton];
        break;
    }
  }

  fillSummary(showEditButton: boolean = true): SummaryModel {
    let sections: SummarySectionModel[] = [];
    let totalAmount = 0;

    let res = [];
    res.push(...this.validateResponse.checkAndSeparateInitiatitionPermission.toAuthorize || []);
    res.push(...this.validateResponse.checkAndSeparateInitiatitionPermission.toProcess);

    res.forEach((item, index) => {
      totalAmount += item.amount!;
      sections.push(
        {
          title: {
            id: 'transferDetailsTitle' + (index + 1),
            title: item.beneficiary,
            subTitle: this.getControl(0, 0, "beneficiariesTable").controlOptions.headers[2].mapObject[item.bankName] + ' - ' + item.accountTo,
            startButtons: showEditButton ? [this.editButton] : [],
          },
          pill: {
            text: 'TRANSFER #' + (index + 1),
            type: 'Neutral'
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
              currency: "608",
            },
            {
              title: 'transfer.remarks',
              subTitle: item.remarks!,
            },
            {
              title: 'public.email',
              subTitle: item.email,
            },
            Utils.getCurrentLevelSummaryItem(this.translate, item.futureSecurityLevelsDTOList),
            Utils.getNextLevelSummaryItem(this.translate, item.futureSecurityLevelsDTOList)
          ]
        });
    });
    return {
      title: {
        id: 'SummaryTitle',
        title: 'public.summary',
        subTitle: 'public.total-amount',
        amount: totalAmount.toString(),
        currency: 'SAR'
      },
      sections: sections
    }
  }

  fillSuccessResult(hasNextApprovalLevel: boolean): ResultModal {
    return {
      type: (hasNextApprovalLevel) ? 'Pending' : 'Success',
      title: (hasNextApprovalLevel) ? 'public.submit-success' : 'transfer.money-successfully-transferred',
      subTitle: 'transfer.local-transfer.success',
      showSariaLogo: true,
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

  fillBeneficiaries() {
    this.endButtons[0].showLoading = true;
    this.beneficiariesService.fillBeneficiaries({
      listBeneficiariesSelected: this.selectedBeneficiaries,
      remitterCategory: ""
    }).subscribe(res => {
      this.selectedBeneficiaries = res.listBeneficiaries;
      this.drawPages();
    });

  }

  updateReasons(reason: ReasonsModal, formIndex: number) {
    // let flag = reason.purposeCode == "32";
    let flag = true;
    // this.pages[1].forms[formIndex].controls["descriptionControl"].hidden = !flag;
    // this.pages[1].forms[formIndex].controls["invoiceControl"].hidden = !flag;
    // this.pages[1].forms[formIndex].controls["descriptionControl"].setRequired(flag);
    // this.pages[1].forms[formIndex].controls["invoiceControl"].setRequired(flag);
  }

  initiateLocalTransfer() {
    this.endButtons[0].showLoading = true;
    this.localTransferService.getInitiate().subscribe((res) => {
      this.pages[1].forms.forEach((item) => {
        item.controls['fromAccountControl'].controlOptions.options = res.listAccount;
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
        item.controls['reasonsControl'].valueChanges.subscribe(value => {
          this.updateReasons(value.value, value.formIndex);
        });
        if (res.listAccount.length > 0) {
          item.controls['fromAccountControl'].setValue(res.listAccount[0]);
          this.originalAccount = res.listAccount[0];
        }
      });
    })
    this.endButtons[0].showLoading = false;
  }

  getValidateRequest(): ValidateReqModel {
    let listTransfers: LocalTransferModel[] = [];
    this.pages[1].forms.forEach((item) => {
      let listTransfersLocal: LocalTransferModel = {
        accountForm: item.controls['fromAccountControl'].value,
        amount: item.controls['amountControl'].value.toString(),
        currency: 608,
        email: this.getControl(1, 0, "emailControl").value,
        remarks: item.controls['remarksControl'].value,
        purposeCodeTransfer: item.controls['reasonsControl'].value.purposeCode,
      }
      listTransfers.push(listTransfersLocal);
    });
    let date = new Date();
    return {
      listBeneficiaries: this.selectedBeneficiaries,
      operationDate: date.toISOString(),
      segment: JSON.parse(sessionStorage.getItem('welcome')!).segment,
      listTransfersLocal: listTransfers
    }
  }

  validateTransfer() {
    this.endButtons[0].showLoading = true;
    this.localTransferService.validateLocalTransfer(this.getValidateRequest()).subscribe({
      next: (res) => {
        this.validateResponse = res;
        this.summary = this.fillSummary();
        this.stepperMoveNext();
        this.endButtons = [this.confirmButton];
        this.nextButton.showLoading = false;
      },
      error: () => {
        this.nextButton.showLoading = false;
      }
    });
  }

  returnRequestConfirmLocalTransfer(otp?: RequestValidate): ConfirmReqModel {
    return {
      batchList: this.validateResponse.checkAndSeparateInitiatitionPermission,
      requestValidate: otp
    }
  }

  showOtp() {
    this.otpService.showVerification(this.validateResponse.generateChallengeAndOTP).subscribe((requestValidate: RequestValidate) => {
      this.confirmLocalTransfer(requestValidate);
    });
  }

  confirmLocalTransfer(otp?: RequestValidate) {
    let confirmReqModel = this.returnRequestConfirmLocalTransfer(otp);
    this.localTransferService.confirmLocalTransfer(confirmReqModel).subscribe(
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
          this.endButtons = [this.transferButton];
          this.startButtons = [];
          this.summary = {};
          this.result = this.fillErrorResult(error.ErrorResponse.errorDescription!);
        }
      });
  }

  getReasons() {
    let data: ReasonsReqModel = {transferPurposeType: "LOCAL"};
    this.transferService.getTransferPurpose(data).subscribe((res: any) => {
      this.pages[1].forms.forEach((item) => {
        item.controls["reasonsControl"].controlOptions.options = res.transferReasonsList;
        item.controls["reasonsControl"].controlOptions.textField = this.translate.currentLang == "en" ? "purposeDescriptionEn" : "purposeDescriptionAr";
      });
    });
  }

}
