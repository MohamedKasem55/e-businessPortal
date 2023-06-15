import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { VerificationService } from '../../../../@core/service/base/verification.service';
import { Component } from '@angular/core';

import { FormResult, PageModel } from 'app/@core/model/dto/formModel';
import { SummaryModel } from "arb-design-library/model/summary.model";

import { beneficiaryForm, returnBoxes, beneficiaryAddForm, AuthLevelSummaryHeaders } from './add-beneficiary-controls';
import { GenerateChallengeAndOTP, RequestValidate } from 'app/@core/model/rest/common/otp.model';
import { SummaryItemModel } from 'arb-design-library/model/summary-item.model';
import { ResultModal } from 'app/@core/model/dto/result.modal';
import { ResponseException } from 'app/@core/service/base/responseException';
import { ModelAndListService } from 'app/@core/service/base/modelAndList.service';
import { BeneficiariesService } from "../../../../@core/service/transfer/beneficiaries/beneficiaries.service";
import {
  BeneficiaryLocalAddRequestModel
} from "../../../../@core/model/rest/transfer/beneficiary/beneficiary-local-add-req.model";
import {
  BeneficiaryInternationalAddV2RequestModel
} from "../../../../@core/model/rest/transfer/beneficiary/beneficiary-international-add-res.model";
import {
  BeneficiaryInternationalBankConfReqModel
} from 'app/@core/model/rest/transfer/beneficiary/beneficiary-international-bank-conf-req.model';
import { BeneficiaryWithinAddReqModel } from 'app/@core/model/rest/transfer/beneficiary/beneficiary-within-add-req.model';
import { FormButtonClickOutput } from "../../../../shared/form/form.component";
import { TransferBaseComponent } from "../../transfer-base/transfer-base.component";
import { DropdownControl } from 'app/@core/model/dto/control/dropdown-control';
import { DateControl } from 'app/@core/model/dto/control/date-control';
import { NumberInputControl } from 'app/@core/model/dto/control/number-input-control';
import { TextInputControl } from 'app/@core/model/dto/control/text-input-control';
import { ValidationsEnum } from 'app/@core/model/dto/validations-enum';
import { ValidationLabels, ValidatorsItem } from 'app/@core/model/dto/control/control.model';
import { MandatoryFields } from "../../../../@core/model/rest/common/mandatory-fields.model";
import { Utils } from "../../../../@core/utility/Utils";
import { AccountRulesModel } from "../../../../@core/model/rest/common/account-rules.model";
import { TableHeaderModel } from 'arb-design-library/model/table-header.model';
import { SummaryTable } from 'arb-design-library/model/summary-section.model';

@Component({
  selector: 'app-add-beneficiary',
  templateUrl: '../../transfer-base/transfer-base.component.html'
})
export class AddBeneficiaryComponent extends TransferBaseComponent {
  requestValidate!: RequestValidate;
  bankCodes: any;
  bankCodesList: any;
  category: string = 'INDIVIDUAL';
  productType: string = 'PAY';
  currencies: any;
  beneficiary: any;
  serviceType: string = '';
  authLevelList!: any;
  data: Array<any> = [];
  generateChallengeAndOTP!: GenerateChallengeAndOTP;
  beneficiaryType: string = '';
  banks: any;
  payload!: {
    beneficiaryBankCode: string;
    beneficiaryCountry: string;
    productCode: string;
    routingCode: string;
    routingIndex: string;
  };


  constructor(private modelAndListService: ModelAndListService, private datePipe: DatePipe,
    public otpService: VerificationService,
    public beneficiaryService: BeneficiariesService) {
    super();

    this.pageTitle.id = "addBeneficiary";
    this.pageTitle.title = "transfer.beneficiary.add-beneficiary";
    this.pageTitle.stepper!.steps = ["", "", ""];

    this.drawPage();
    this.modelAndListService
    .getList(['bankCode', 'batchSecurityLevelStatus'])
    .subscribe((models) => {
      for (let key of Object.keys(models)) {
        switch (key) {
          case 'bankCode':
            this.bankCodesList = Utils.getModelList(models[key]);
            break;
          case 'batchSecurityLevelStatus':
            this.authLevelList = Utils.getModelList(models[key]);
            break;
        }
      }
    });

    this.setBreadcrumb([{
      text: 'transfer.transfer',
      url: '/transfer'
    }, {
      text: 'public.beneficiaries',
      url: '/transfer'
    }, { text: 'transfer.beneficiary.add-new-beneficiary', url: '' }]);
    this.setOnValueChanges();
    this.getBeneficiaryRoute()
  }

  getBeneficiaryRoute() {
    this.beneficiaryType = this.router.getCurrentNavigation()!.extras.state?.['beneficiaryAdd'];
    if (this.beneficiaryType) {
      this.onBeneficiaryTypeChange(this.beneficiaryType);
      this.getControl(0, 0, 'beneficiaryTypeBoxList').setValue(this.beneficiaryType)
    }
  }

  drawPage() {
    this.pages = [];
    this.pages = [new PageModel(1, beneficiaryAddForm(), beneficiaryForm())];

    this.getControl(0, 0, 'beneficiaryTypeBoxList').valueChanges.subscribe(value => {
      this.onBeneficiaryTypeChange(value.value);
    });
  }

  onBeneficiaryTypeChange(value: string) {
    this.hideAndDisableControls(0, 0, [
      "accountNumber",
      "name",
      "email",
      "nickName",
      "countrySwift",
      "country",
      "currency",
      "branch",
      "swiftCode",
      "bankName",
      "benefTitle",
      "beneficiaryName",
      "mobile"
    ]);

    switch (value) {
      case 'alRajhi':
        if (this.pages[0].forms.length > 1) {
          this.pages[0].deleteFrom(1, 1);
        }
        this.getControl(0, 0, "name").setRequired(false);
        this.getControl(0, 0, "accountNumber").label = 'public.account-number';
        this.showAndEnableControls(0, 0, ["accountNumber", "name"]);
        this.showAndEnableControls(0, 0, ["email", "nickName"]);
        break;
      case 'local':
        if (this.pages[0].forms.length > 1) {
          this.pages[0].deleteFrom(1, 1);
        }
        this.getControl(0, 0, "name").setRequired(true);
        this.showAndEnableControls(0, 0, ["accountNumber", "name"]);
        this.showAndEnableControls(0, 0, ["bankName", "mobile", "email", "benefTitle"]);
        this.getControl(0, 0, "bankName").disable();
        this.getControl(0, 0, "bankName").controlOptions.options = this.bankCodesList;

        this.getControl(0, 0, "accountNumber").label = 'public.account-number-iban';
        this.getControl(0, 0, "accountNumber").setValue("SA")
        break;

      case 'international':
        this.getControl(0, 0, "country").setRequired(true);
        this.getControl(0, 0, "currency").setRequired(true);
        this.getControl(0, 0, "branch").setRequired(true);
        if (this.pages[0].forms.length === 1) {
          this.pages[0].addForm(beneficiaryForm());
        }
        this.showAndEnableControls(0, 0, ["countrySwift", "swiftCode", "country", "currency", "branch", "bankName"]);
        this.getCountries();
        this.getControl(0, 0, "countrySwift").setValue('country');
        this.getControl(0, 0, "swiftCode").disable();
        break;
    }
  }

  setOnValueChanges() {

    this.getControl(0, 0, "swiftCode").valueChanges.subscribe((value: any) => {
      if (value.value) {
        this.getSwiftCode(value.value);
      }
    });
    this.getControl(0, 0, "accountNumber").valueChanges.subscribe((value: any) => {
      if (value) {
        const bankName = this.bankCodesList.find((bank: any) => {
          if (bank.key === this.getBankCode()) {
            this.getControl(0, 0, "bankName").controlOptions.columnId = 'key'
            this.getControl(0, 0, "bankName").controlOptions.textField = 'value'
            this.getControl(0, 0, "bankName").setValue({
              key: bank.key,
              value: bank.value,
              displayText: bank.value
            });
            return bank.value
          } else {
            return ''
          }
        });
      }
    });

    this.getControl(0, 0, "country").valueChanges.subscribe((value: any) => {
      if (value.value && this.getControl(0, 0, 'beneficiaryTypeBoxList').value === 'international') {
        if (!this.getControl(0, 0, "swiftCode").value && this.getControl(0, 0, "countrySwift").value === 'country') {
          this.getBankName();
        }
      }
    });

    this.getControl(0, 0, "bankName").valueChanges.subscribe((value: any) => {
      if (value.value && this.getControl(0, 0, "countrySwift").value === 'country') {
        this.getControl(0, 0, "swiftCode").setValue(this.getControl(0, 0, "bankName").value.swiftCode);
        this.getCurrencies();
      }
    });

    this.getControl(0, 0, "branch").valueChanges.subscribe((value: any) => {
      if (value && this.getControl(0, 0, "country").value && this.getControl(0, 0, "countrySwift").value === 'country') {
        this.endButtons[0].isDisable = true;
        this.getBankConfiguration();
      }
    });

    this.getControl(0, 0, "currency").valueChanges.subscribe((value: any) => {
      if (value.value && this.getControl(0, 0, "country").value) {
        this.getBankBranches();
      }
    });

    this.getControl(0, 0, "countrySwift").valueChanges.subscribe((value: any) => {
      this.getControl(0, 0, "country").setValue('');
      this.getControl(0, 0, "bankName").setValue('');
      this.showAndEnableControls(0, 0, ["swiftCode", "country", "currency", "branch", "bankName"]);
      if (value.value === 'country') {
        this.getControl(0, 0, "bankName").controlOptions.columnId = 'key'
        this.getControl(0, 0, "bankName").controlOptions.textField = 'bankName'
        this.getControl(0, 0, "branch").setValue('')
        this.getControl(0, 0, "branch").enable()
        this.getControl(0, 0, "bankName").enable()
        this.getControl(0, 0, "country").enable()
        this.getControl(0, 0, "swiftCode").setValue('');
        this.getControl(0, 0, "swiftCode").disable();
      } else {
        this.getControl(0, 0, "swiftCode").enable();
        this.getControl(0, 0, "swiftCode").setRequired(true);
      }
    });

    this.getControl(0, 1, "individualCompany").valueChanges.subscribe((value: any) => {
      if (value.value && this.getControl(0, 0, "currency").value && this.getControl(0, 0, "branch").value) {
        if (value.value === 'individual') {
          this.getControl(0, 1, "individualCompany").setValue('individual');
        } else {
          this.category = 'COMPANY';
          this.showAndEnableControls(0, 1, ["individualCompany"]);
          this.getControl(0, 1, "individualCompany").setValue('company');
        }
      }
    });
  }

  ngOnInit(): void {
  }

  override onResultChanged(data: FormResult[]) {
    let beneficiaryType = this.getControl(0, 0, 'beneficiaryTypeBoxList').value;

    if (beneficiaryType === 'international') {
      this.endButtons[0].isDisable = data[1] ? !data[0].valid || !data[1].valid : !data[0].valid;
    } else {
      this.endButtons[0].isDisable = !data[0].valid;
    }
  }

  nextClick() {
    let beneficiaryType = this.getControl(0, 0, 'beneficiaryTypeBoxList').value;

    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        if (beneficiaryType === 'alRajhi') {
          this.validateWithinAdd()
        } else if (beneficiaryType === 'local') {
          this.validateLocalAdd()
        } else {
          this.validateInternationalAdd()
        }
        break;
      case 2:
        if (beneficiaryType === 'alRajhi') {
          this.generateChallengeAndOTP && this.generateChallengeAndOTP.typeAuthentication ? this.showOtp() : this.confirmWithin();
        } else if (beneficiaryType === 'local') {
          this.generateChallengeAndOTP && this.generateChallengeAndOTP.typeAuthentication ? this.showOtp() : this.confirmLocal();
        } else {
          this.generateChallengeAndOTP && this.generateChallengeAndOTP.typeAuthentication ? this.showOtp() : this.confirmInternational();
        }
        break;
      case 3:
        this.pages = [];
        void this.router.navigate(['/transfer']);
        break;
    }
  }

  showOtp() {
    this.otpService.showVerification(this.generateChallengeAndOTP).subscribe((requestValidate: RequestValidate) => {
      this.summary = {};
      this.startButtons = [];
      this.result = this.fillSuccessResult();
      this.stepperMoveNext();
      this.transferButton.text = 'transfer.start-transfer';
      this.endButtons = [this.beneficiaryButton, this.transferButton];
    });
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'Next':
        this.nextClick();
        break;
      case 'Confirm':
        this.nextClick();
        break;
      case 'Back':
      case 'Edit':
        this.backClick();
        break;
      case 'Beneficiary':
        void this.router.navigate(['/transfer/beneficiaries']);
        break;
      case 'Transfers':
        this.pages = [];
        void this.router.navigate(['/transfer']);
        break;
    }
  }

  confirmInternational() {
    this.nextButton.showLoading = true;
    this.beneficiaryService.beneficiaryInternationalAddV2(this.returnRequestbeneficiariesInternationalAdd()).subscribe(
      {
        next: (res) => {
          this.stepperMoveNext();
          this.startButtons = [];
          this.endButtons = [this.beneficiaryButton, this.transferButton];
          this.summary = {};
          this.result = this.fillSuccessResult();
        },
        error: (error: ResponseException) => {
          this.stepperMoveNext();
          this.startButtons = [];
          this.endButtons = [this.beneficiaryButton, this.transferButton];
          this.summary = {};
          this.result = this.fillErrorResult(error.ErrorResponse.errorDescription!);
        }
      });
  }

  localLabelChange() {
    this.getControl(0, 0, "accountNumber").label = 'public.account-number-iban';
    this.getControl(0, 0, "mobile").label = 'phone-number-optional';
    this.getControl(0, 0, "email").label = 'email-optional';
    this.getControl(0, 0, "bankName").label = 'bank-optional';
  }

  backClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        void this.router.navigate(['/transfer/beneficiaries']);
        break;
      case 2:
        this.endButtons = [this.nextButton];
        this.stepperMoveBack();
        break;
    }
  }

  getCountries() {
    this.beneficiaryService.beneficiaryInternationalCountryBranch(this.productType).subscribe((res: any) => {
      if (!res.errorCode) {
        this.getControl(0, 0, "country").controlOptions.options = res.countries;
      }
    });
  }

  getBankName() {
    this.beneficiaryService.beneficiaryInternationalGetBankList(this.returnRequestGetBankAndCurrency('country')).subscribe((res: any) => {
      if (!res.errorCode) {
        this.getControl(0, 0, "bankName").controlOptions.options = res.banks;
        this.banks = Object.entries(res.banks).map(([key, value]) => ({ key, value }))
      }
    });
  }

  getBankConfiguration() {
    this.beneficiaryService.beneficiaryInternationalBankConfiguration(this.returnRequestGetBankConfiguration()).subscribe((res: any) => {
      if (!res.errorCode) {
        this.serviceType = res.transferType;
        this.showAndEnableControls(0, 1, ["individualCompany", "beneficiaryTitle"]);
        this.getControl(0, 1, "individualCompany").setValue('individual');
        this.buildMandatoryForm(res.mandatoryFields, res.accountRules)
      }
    });
  }

  getBankBranches() {
    this.beneficiaryService.beneficiaryInternationalBranch(this.returnRequestValidateLocalTransfer()).subscribe({
      next: (res) => {
        if (!res.errorCode) {
          this.getControl(0, 0, 'branch').controlOptions.options =
            res.bankBranchList;
          if (this.payload && this.getControl(0, 0, 'currency')) {
            this.endButtons[0].isDisable = true;
            this.getBankConfiguration();
          }
        }
      },
      error: () => {
        this.endButtons[0].isDisable = true;
      },
    });
  }

  getCurrencies() {
    this.beneficiaryService.beneficiaryInternationalCurrency(this.returnRequestGetBankAndCurrency('bank')).subscribe((res: any) => {
      if (!res.errorCode) {
        this.getControl(0, 0, "currency").controlOptions.options = res.currencies;
      }
    });
  }

  validateInternationalAdd() {
    let dataList: any[] = [];
    this.beneficiaryService.beneficiaryInternationalValidateAddV2(this.returnRequestbeneficiariesInternationalAdd()).subscribe({
      next: (res: any) => {
        const authLevelData = res.beneficiary.futureSecurityLevelsDTOList;
        authLevelData?.forEach((element: any) => {
          const status = this.authLevelList.find(
            (status: { key: string; value: string }) => {
              if (element.status == status.key) {
                return status.value;
              } else {
                return undefined;
              }
            }
          );

          const object = {
            userLevel: element.level,
            status: status.value,
            userId: element.updater,
            dateTime: '',
          };
          dataList.push(object);
        });
        this.data = dataList;

        this.generateChallengeAndOTP = res.generateChallengeAndOTP;
        this.summary = this.fillSummary();
        this.stepperMoveNext();
        this.endButtons = [this.confirmButton];
      },
      error: (error: ResponseException) => {
      }
    });
  }


  confirmLocal() {
    this.pageTitle.title = "";
    this.beneficiaryService.beneficiaryLocalAdd(this.returnRequestbeneficiariesLocalAdd()).subscribe({
      next: (res) => {
        this.stepperMoveNext();
        this.summary = {};
        this.result = this.fillSuccessResult();
        this.startButtons = [];
        this.endButtons = [this.beneficiaryButton, this.transferButton];
      },
      error: (error: ResponseException) => {
        this.stepperMoveNext();
        this.summary = {};
        this.result = this.fillErrorResult(error.ErrorResponse.errorDescription!);
        this.startButtons = [];
        this.endButtons = [this.beneficiaryButton, this.transferButton];
      }
    });
  }

  confirmWithin() {
    this.beneficiaryService.beneficiaryWithinAdd(this.returnRequestBeneficiaryWithinAdd(), this.getControl(0, 0, "accountNumber").value).subscribe({
      next: (res) => {
        this.stepperMoveNext();
        this.summary = {};
        this.result = this.fillSuccessResult();
        this.startButtons = [];
        this.endButtons = [this.beneficiaryButton, this.transferButton];
      },
      error: (error: ResponseException) => {
        this.stepperMoveNext();
        this.summary = {};
        this.result = this.fillErrorResult(error.ErrorResponse.errorDescription!);
        this.startButtons = [];
        this.endButtons = [this.beneficiaryButton, this.transferButton];
      }
    });
  }

  returnRequestbeneficiariesLocalAdd(): BeneficiaryLocalAddRequestModel {
    return {
      bankCode: this.getBankCode(),
      beneficiaryAccountNumber: this.getControl(0, 0, "accountNumber").value,
      beneficiaryName: this.getControl(0, 0, "beneficiaryName").value,
      requestValidate: this.requestValidate
    }
  }

  returnRequestbeneficiariesInternationalAdd(): BeneficiaryInternationalAddV2RequestModel {
    let dateIsoString: any = '';
    if (this.getControl(0, 1, "BeneficiaryBirthDate")) {
      const date = this.getControl(0, 1, "BeneficiaryBirthDate").value ? this.getControl(0, 1, "BeneficiaryBirthDate").value : null
      dateIsoString = new Date(date.year + '-' + date.month + '-' + (date.day)).toISOString();
    }

    return {
      benefFirstName: this.getControl(0, 1, "BeneficiaryFirstName") ? this.getControl(0, 1, "BeneficiaryFirstName").value : null,
      benefLastName: this.getControl(0, 1, "BeneficiaryLastName") ? this.getControl(0, 1, "BeneficiaryLastName").value : null,
      benefNationality: this.getControl(0, 1, "BeneficiaryNationality") ? this.getControl(0, 1, "BeneficiaryNationality").value.key : null,
      benefBankAcct: this.getControl(0, 1, "BeneficiaryBankAcct") ? this.getControl(0, 1, "BeneficiaryBankAcct").value : null,
      beneficiaryBranchDtls: null,
      benefMobileNum: this.getControl(0, 0, "mobile") ? this.getControl(0, 0, "mobile").value : null,
      benefMobilePrefix: null,
      benefBankIBAN: this.getControl(0, 1, "BeneficiaryIBAN") ? this.getControl(0, 1, "BeneficiaryIBAN").value : null,
      beneficiaryIndianBankCtry: null,
      benefEmail: this.getControl(0, 0, "email") ? this.getControl(0, 0, "email").value : '',
      benefBirthDate: this.getControl(0, 1, "BeneficiaryBirthDate") ? dateIsoString : '',
      benefFullName: null,
      productType: this.productType,
      serviceType: 'DIRFRC',
      juridicalStatus: this.category,
      category: 'I',
      benefCurrency: this.getControl(0, 0, "currency") ? this.getControl(0, 0, "currency").value.currencyISO : '',
      benefCountry: this.getControl(0, 0, "country") ? this.getControl(0, 0, "country").value.countryISO.trim() : '',
      benefBankName: this.getControl(0, 0, "bankName") ? this.getControl(0, 0, "bankName").value.bankName : '',
      benefBankId: this.getControl(0, 0, "bankName") ? this.getControl(0, 0, "bankName").value.bankCode : '',
      benefBranchCode: this.getControl(0, 0, "branch") ? this.getControl(0, 0, "branch").value.beneficiaryBranchCAB : '',
      benefBranchName: this.getControl(0, 0, "branch") ? this.getControl(0, 0, "branch").value.beneficiaryBankBranch : '',
      routingBeneficiaryCode: this.getControl(0, 0, "branch") ? this.getControl(0, 0, "branch").value.beneficiaryBranchCAB : '',
      benefBankCountry: this.getControl(0, 0, "country") ? this.getControl(0, 0, "country").value.countryISO.trim() : '',
      benefSWIFTCode: this.getControl(0, 0, "bankName") ? this.getControl(0, 0, "bankName").value.swiftCode : '',
      routingIndex: this.getControl(0, 0, "bankName") ? this.getControl(0, 0, "bankName").value.routingIndex : '',
      countryNumber: this.getControl(0, 0, "country") ? this.getControl(0, 0, "country").value.countryCode : '',
      pobox: this.getControl(0, 1, "BeneficiaryPOBox") ? this.getControl(0, 1, "BeneficiaryPOBox").value : null,
      requestValidate: this.requestValidate ? this.requestValidate : {}
    }
  }

  returnRequestValidateLocalTransfer() {
    if (this.payload) {
      return this.payload;
    } else {
      return {
        beneficiaryBankCode: this.getControl(0, 0, "bankName").value.bankCode,
        beneficiaryCountry: this.getControl(0, 0, "country").value.countryCode,
        productCode: this.productType,
        routingCode: this.getControl(0, 0, "bankName").value.swiftCode,
        routingIndex: this.getControl(0, 0, "bankName").value.routingIndex
      }
    }
  }

  returnRequestGetBankAndCurrency(endUrl: string): string {
    const productCode: string = this.productType + '/';
    const countryCode: string = this.getControl(0, 0, "country").value.countryCode;
    let countryIso: string = '';
    endUrl === 'bank' ? countryIso = '/' + this.getControl(0, 0, "bankName").value.bankCode : countryIso = '/' + this.getControl(0, 0, "country").value.countryISO.trim();
    const urlparameter = productCode + countryCode + countryIso
    return urlparameter;
  }

  returnRequestGetBankConfiguration(): BeneficiaryInternationalBankConfReqModel {
    return {
      productType: this.productType,
      serviceType: null,
      country: this.getControl(0, 0, "country").value.countryCode,
      currency: this.getControl(0, 0, "currency").value.currencyCode,
      bankCode: this.getControl(0, 0, "bankName").value.bankCode ? this.getControl(0, 0, 'bankName').value.bankCode
      : this.getControl(0, 0, 'bankName').value.beneficiaryBankABI,
      juridicalStatus: this.category,
      bankSwiftCode: this.getControl(0, 0, "bankName").value.swiftCode ? this.getControl(0, 0, 'bankName').value.swiftCode
      : this.payload.routingCode,
      corespondentBankLanguage: ''
    };
  }

  fillSummary(showEditButton: boolean = true): SummaryModel {
    let beneficiaryType = this.getControl(0, 0, 'beneficiaryTypeBoxList').value;
    let summary: any;
    switch (beneficiaryType) {
      case 'international':
        summary = {
          title: {
            id: 'SummaryTitle',
            title: 'public.summary',
          },
          sections: [{
            title: {
              id: 'transferDetailsTitle',
              title: 'transfer.beneficiary.international.category',
              subTitle: this.getControl(0, 0, "accountNumber").value,
              startButtons: showEditButton ? [this.editButton] : [],
            },
            items: this.getSummaryItems('category')
          },
          {
            title: {
              id: 'transferDetailsTitle',
              title: 'transfer.beneficiary.international.beneficiary-bank-details',
              subTitle: this.getControl(0, 0, "accountNumber").value,
              startButtons: showEditButton ? [this.editButton] : [],
            },
            items: this.getSummaryItems('bankDetails')
          },
          {
            title: {
              id: 'transferDetailsTitle',
              title: 'transfer.beneficiary.international.beneficiary-details',
              subTitle: this.getControl(0, 0, "accountNumber").value,
              startButtons: showEditButton ? [this.editButton] : [],
            },
            items: this.getSummaryItems('benefDetails')},
          {
            title: {
              id: 'authLevelSummaryTitle',
              title: 'pos.new-request.auth-level-info',
            },

            table: this.getAuthLevelSummaryTableData(
              this.data,
              AuthLevelSummaryHeaders(this.authLevelList)
            ),
          },
          ]
        }
        break;
      case 'alRajhi':
      case 'local':
        summary = {
          title: {
            id: 'SummaryTitle',
            title: 'public.summary',
          },
          sections: [{
            title: {
              id: 'transferDetailsTitle',
              title: this.beneficiary ? this.beneficiary.beneficiaryName : this.getControl(0, 0, "beneficiaryName").value,
              subTitle: this.getControl(0, 0, "accountNumber").value,
              startButtons: showEditButton ? [this.editButton] : [],
            },
            items: this.getSummaryItems()
          }
          ]
        }
        break;
    }
    return summary;
  }

  getSummaryItems(section?: string): SummaryItemModel[] | null {
    let beneficiaryType = this.getControl(0, 0, 'beneficiaryTypeBoxList').value;
    let items: any;
    switch (beneficiaryType) {
      case 'alRajhi':
        items = [
          {
            title: 'public.email',
            subTitle: this.getControl(0, 0, "email").value
          },
          {
            title: 'transfer.beneficiary.beneficiary-name',
            subTitle: this.beneficiary.beneficiaryName
          },
          {
            title: 'transfer.beneficiary.beneficiary-type',
            subTitle: returnBoxes[0].text
          },
          {
            title: 'public.nickname',
            subTitle: this.getControl(0, 0, "nickName").value
          },
        ];
        break;
      case 'local':
        items = [
          {
            title: 'public.iban-account-number',
            subTitle: this.getControl(0, 0, "accountNumber").value
          },

          {
            title: 'transfer.beneficiary.beneficiary-type',
            subTitle: returnBoxes[1].text
          },
          {
            title: 'transfer.beneficiary.beneficiary-name',
            subTitle: this.getControl(0, 0, "name").value
          },
          {
            title: 'transfer.beneficiary.bank-name',
            subTitle: this.getControl(0, 0, "bankName").value.value
          },
          {
            title: 'public.phone-number',
            subTitle: this.getControl(0, 0, "mobile").value
          },
          {
            title: 'public.email',
            subTitle: this.getControl(0, 0, "email").value
          },
        ];
        break;
      default:
        if (section && section === 'category') {
          items = [
            {
              title: 'public.category',
              subTitle: `transfer.beneficiary.international.${this.category}`
            }
          ];
        } else if (section && section === 'bankDetails') {
          items = [
            {
              title: 'public.country',
              subTitle: this.getControl(0, 0, "country").value.countryDesc
            },
            {
              title: 'public.swift-code',
              subTitle: this.getControl(0, 0, "swiftCode").value
            },
            {
              title: 'transfer.beneficiary.international.bank-name',
              subTitle: this.getControl(0, 0, "bankName").value.bankName ? this.getControl(0, 0, 'bankName').value.bankName
              : this.getControl(0, 0, 'bankName').value.beneficiaryBankName,
            },
            {
              title: 'public.branch',
              subTitle: this.getControl(0, 0, "branch").value.beneficiaryBankBranch
            },
            {
              title: 'public.currency',
              subTitle: this.getControl(0, 0, "currency").value.currencyName
            }
          ];
        } else if (section && section === 'benefDetails') {
          items = this.getItemDetails()
        } else {
          items = []
        }
    }
    return items;
  }

  getItemDetails(): any[] {
    let items = [];


    if (this.getControl(0, 1, "BeneficiaryFirstName")) {
      items.push({
        title: 'transfer.beneficiary.international.beneficiary-first-name',
        subTitle: this.getControl(0, 1, "BeneficiaryFirstName").value
      }
      );
    }
    if (this.getControl(0, 1, "BeneficiaryLastName")) {
      items.push({
        title: 'transfer.beneficiary.international.beneficiary-family-name',
        subTitle: this.getControl(0, 1, "BeneficiaryLastName").value
      }
      );
    }
    if (this.getControl(0, 1, "BeneficiaryNationality")) {
      items.push({
        title: 'transfer.beneficiary.international.beneficiary-nationality',
        subTitle: this.getControl(0, 1, "BeneficiaryNationality").value.value
      }
      );
    }
    if (this.getControl(0, 1, "BeneficiaryBranchDtls")) {
      items.push({
        title: 'transfer.international.BeneficiaryBranchDtls',
        subTitle: this.getControl(0, 1, "BeneficiaryBranchDtls").value
      }
      );
    }
    if (this.getControl(0, 1, "BeneficiaryBankAcct")) {
      items.push({
        title: 'public.account-number',
        subTitle: this.getControl(0, 1, "BeneficiaryBankAcct").value
      }
      );
    }
    if (this.getControl(0, 1, "BeneficiaryIBAN")) {
      items.push({
        title: 'transfer.international.BeneficiaryIBAN',
        subTitle: this.getControl(0, 1, "BeneficiaryIBAN").value
      }
      );
    }
    if (this.getControl(0, 1, "BeneficiaryAddress")) {
      items.push({
        title: 'transfer.international.BeneficiaryAddress',
        subTitle: this.getControl(0, 1, "BeneficiaryAddress").value
      }
      );
    }
    if (this.getControl(0, 1, "BeneficiaryAddress2")) {
      items.push({
        title: 'transfer.international.BeneficiaryAddress2',
        subTitle: this.getControl(0, 1, "BeneficiaryAddress2").value
      }
      );
    }
    if (this.getControl(0, 1, "BeneficiaryPOBox")) {
      items.push({
        title: 'transfer.international.BeneficiaryPOBox',
        subTitle: this.getControl(0, 1, "BeneficiaryPOBox").value
      }
      );
    }

    if (this.getControl(0, 1, "BeneficiaryZipCode")) {
      items.push({
        title: 'transfer.international.BeneficiaryZipCode',
        subTitle: this.getControl(0, 1, "BeneficiaryZipCode").value
      }
      );
    }
    if (this.getControl(0, 1, "BeneficiaryCity")) {
      items.push({
        title: 'transfer.international.Beneficiary-state-city',
        subTitle: this.getControl(0, 1, "BeneficiaryCity").value
      }
      );
    }

    if (this.getControl(0, 1, "BeneficiaryBirthDate")) {
      items.push({
        title: 'transfer.international.BeneficiaryBirthDate',
        subTitle: Utils.getDateFormatted(
          this.getControl(0, 1, 'BeneficiaryBirthDate').value,
          'dd/MM/yyyy'
        ),
        //this.convertDate(this.getControl(0, 1, "BeneficiaryBirthDate").value, 'EEEE, MMMM d, y, h:mm:ss a zzzz')
      }
      );
    }

    if (this.getControl(0, 1, "BeneficiaryBirthPlace")) {
      items.push({
        title: 'transfer.international.BeneficiaryBirthPlace',
        subTitle: this.getControl(0, 1, "BeneficiaryBirthPlace").value
      }
      );
    }
    if (this.getControl(0, 1, "BeneficiaryRegion")) {
      items.push({
        title: 'transfer.international.BeneficiaryRegion',
        subTitle: this.getControl(0, 1, "BeneficiaryRegion").value
      }
      );
    }
    if (this.getControl(0, 1, "RemitLinkTypeCode")) {
      items.push({
        title: 'transfer.international.Relation-beneficiary',
        subTitle: this.getControl(0, 1, "RemitLinkTypeCode").value.value
      }
      );
    }
    return items;

  }

  validateWithinAdd() {
    this.beneficiaryService.beneficiaryWithinValidateAdd(this.returnRequestBeneficiaryWithinAdd(), this.getControl(0, 0, "accountNumber").value).subscribe(
      {
        next: (res) => {
          this.beneficiary = res.beneficiary;
          this.generateChallengeAndOTP = res.generateChallengeAndOTP!;
          this.summary = this.fillSummary();
          this.stepperMoveNext();
          this.endButtons = [this.confirmButton];
        },
        error: () => {
          this.nextButton.showLoading = false;
        }
      });
  }

  getAuthLevelSummaryTableData(
    data: any,
    headers: TableHeaderModel[]
  ): SummaryTable {
    return {
      columnId: 'userLevel',
      headers: headers,
      maxDisplayRow: 5,
      data,
      exportFileName: 'pos.new-request.file-name',
    };
  }

  validateLocalAdd() {
    this.beneficiaryService.beneficiaryLocalValidateAdd(this.returnRequestBeneficiaryLocalAdd()).subscribe(
      {
        next: (res) => {
          this.beneficiary = res.beneficiary;
          this.generateChallengeAndOTP = res.generateChallengeAndOTP!;
          this.summary = this.fillSummary();
          this.stepperMoveNext();
          this.endButtons = [this.confirmButton];
        },
        error: () => {
          this.nextButton.showLoading = false;
        }
      });
  }

  returnRequestBeneficiaryWithinAdd(): BeneficiaryWithinAddReqModel {
    return {
      email: this.getControl(0, 0, "email").value ? this.getControl(0, 0, "email").value : '',
      nickName: this.getControl(0, 0, "nickName").value ? this.getControl(0, 0, "nickName").value : '',
      requestValidate: this.requestValidate
    }
  }

  returnRequestBeneficiaryLocalAdd(): BeneficiaryLocalAddRequestModel {

    return {
      beneficiaryAccountNumber: this.getControl(0, 0, "accountNumber").value,
      phoneNumber: this.getControl(0, 0, "mobile").value ? this.getControl(0, 0, "mobile").value : null,
      email: this.getControl(0, 0, "email").value ? this.getControl(0, 0, "email").value : '',
      beneficiaryName: this.getControl(0, 0, "beneficiaryName").value,
      bankCode: this.getBankCode(),
      requestValidate: this.requestValidate
    }
  }

  getBankCode(): string {
    const bankIbanCodeTmp = this.getControl(0, 0, "accountNumber").value.substring(4, 6)
    const bankIbanCode = '0' + bankIbanCodeTmp
    return bankIbanCode;
  }

  fillSuccessResult(): ResultModal {
    return {
      type: 'Success',
      title: this.generateChallengeAndOTP ? this.translate.instant('transfer.beneficiary.beneficiary-pending-IVR') : this.translate.instant('transfer.beneficiary.beneficiary-pending-authorization'),
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

  convertDate(date: NgbDateStruct, format: string) {
    return this.datePipe.transform(new Date(date.year, date.month, date.day), format)
  }

  // ROYCMSMSXXX
  getSwiftCode(swiftCode: string) {
    this.beneficiaryService.beneficiaryInternationalBranchDetails(this.productType, swiftCode).subscribe({
      next: (res) => {
      if (!res.errorCode) {

        this.getControl(0, 0, "bankName").controlOptions.columnId = 'beneficiaryBankName';
        this.getControl(0, 0, "bankName").controlOptions.textField = 'beneficiaryBankName';
        this.getControl(0, 0, "bankName").controlOptions.options = res.bankBranchList;
        this.getControl(0, 0, "bankName").setValue(res.bankBranchList[0]);
        this.getControl(0, 0, "bankName").disable();

        this.getControl(0, 0, "branch").controlOptions.options = structuredClone(res.bankBranchList);
        this.getControl(0, 0, "branch").setValue(res.bankBranchList[0]);
        this.getControl(0, 0, "branch").disable();

        this.getControl(0, 0, "country").controlOptions.options = structuredClone([res.country]);
        this.getControl(0, 0, "country").setValue(res.country);
        this.getControl(0, 0, "country").disable()

        this.getControl(0, 0, 'currency').setValue(undefined);
        this.getControl(0, 0, "currency").controlOptions.options = res.bankCurrencies;

        this.payload = {
          beneficiaryBankCode: res.bankBranchList[0]?.beneficiaryBankABI,
          beneficiaryCountry: res.country?.countryCode,
          productCode: this.productType,
          routingCode: res.routingCode,
          routingIndex: res.routingIndex,
        };
      }
    },
    error: () => {
      this.endButtons[0].isDisable = true;
      }
    });
  }


  buildMandatoryForm(mandatoryList: [], accountRules: AccountRulesModel[]) {
    mandatoryList.forEach((item: MandatoryFields) => {
      let skip = false;
      if (item.label && item.name && item.type) {
        if (
          accountRules.length != 0 &&
          accountRules[0].ibanMandatory == true
        ) {
          if (item.name === 'BeneficiaryBankAcct') {
            skip = true;
          }
        } else {
          if (item.name === 'BeneficiaryIBAN') {
            skip = true;
          }
        }
        if (!skip) {
          this.buildMandatoryControl(item, accountRules);
        }
      }
    });
  }

  buildMandatoryControl(item: MandatoryFields, accountRules: AccountRulesModel[]): any {
    let validators: ValidatorsItem[] = [];
    let validationLabels: ValidationLabels = {
      required: 'transfer.international.' + item.name + '-is-required',
      pattern: []
    };

    if (item.validation) {

      const validationSeparate = item.validation.split('|')
      validationSeparate.forEach((validation: any) => {
        const validationKey = validation.split(':')

        if (item.type != 'date') {
          switch (validationKey[0]) {
            case 'min':
              validators.push({
                validation: ValidationsEnum.MIN_LENGTH,
                options: validationKey[1],
              });
              validationLabels.minLength = 'transfer.min';
              validationLabels.translateOptions = { ...{ "0": validationKey[1] } };
              break;
            case 'max':
              validators.push({
                validation: ValidationsEnum.MAX_LENGTH,
                options: validationKey[1],
              });
              validationLabels.maxLength = 'transfer.max';
              validationLabels.translateOptions = { ...{ "1": validationKey[1] } };
              break;
          }
        }
      });

      validationLabels.pattern = [];
      if (item.validation.includes('onlyAlphabetic') && item.validation.includes('noEngLetters')) {
        validators.push({
          validation: ValidationsEnum.ONLY_ARABIC_LETTERS,
        });
        validationLabels.pattern!.push("transfer.international.only-alphabetical", "transfer.internationalonly-english-alphabets");
      } else if (item.validation.includes('onlyAlphabetic')) {
        validators.push({
          validation: ValidationsEnum.ONLY_ALPHABETIC,
        });
        validationLabels.pattern!.push("transfer.international.only-alphabetical");
      } else if (item.validation.includes('noSpecialChar')) {
        validators.push({
          validation: ValidationsEnum.NO_SPECIAL_CHAR,
        });
        validationLabels.pattern!.push("transfer.international.no-special-char");
      } else if (
        item.validation.includes('onlyAlphabetic') &&
        item.validation.includes('noArabic')
      ) {
        validators.push({
          validation: ValidationsEnum.ONLY_ENGLISH_LETTERS,
        });
        validationLabels.pattern!.push("transfer.international.only-alphabetical", "transfer.international.notArabic");
      }
    }
    if (item.name === 'BeneficiaryIBAN' && accountRules.length === 1) {
      validators = [{ validation: ValidationsEnum.INTERNATIONAL_IBAN, options: accountRules[0].ibanFormat }];
      validationLabels.customValidator = "transfer.international.invalid-iban-format";
    }
    if (item.name === 'BeneficiaryBankAcct') {
      if (accountRules.length != 0 && accountRules[0].acceptedAccountFrmats != null) {
        validators = [{
          validation: ValidationsEnum.INTERNATIONAL_ACCOUNT,
          options: JSON.stringify(accountRules[0].acceptedAccountFrmats)
        }];
        validationLabels.customValidator = "transfer.international.invalid-account-format";
      } else {
        validators = [];
      }
    }

    switch (item.type) {
      case 'mixed':
        this.pages[0].forms[1].addControl(item.name, new DropdownControl({
          label: item.label,
          required: true,
          controlOptions: {
            columnId: "key",
            textField: 'value',
            options: item.items,
            hasSearch: true,
          },
          validators,
          validationLabels
        }));
        break;
      case 'date':
        let dateControl = new DateControl({
          label: item.label,
          required: true,
          value: '',
          controlOptions: {},
          validationLabels: { required: 'transfer.international.' + item.name + '-is-required' }
        });

        if (item.validation.includes("min:today")) {
          dateControl.controlOptions!.minDate = Utils.getToday();
        }

        if (item.validation.includes("max:today")) {
          dateControl.controlOptions!.maxDate = Utils.getToday();
        }
        this.pages[0].forms[1].addControl(item.name, dateControl);
        break;
      case 'numeric':
        this.pages[0].forms[1].addControl(item.name, new NumberInputControl({
          label: 'transfer.international.' + item.name,
          required: true,
          value: '',
          validators,
          validationLabels,
        }))
        break;
      case 'string':
        let textControl = new TextInputControl({
          label: item.label,
          required: true,
          value: '',
          validators,
          validationLabels
        });

        // if (item.name === 'BeneficiaryIBAN' && accountRules.length > 1) {
        //   if (accountRules[0].ibanFormat) {
        //   }
        // }

        this.pages[0].forms[1].addControl(item.name, textControl);
        break;

      case 'email':
        this.pages[0].forms[1].addControl(item.name, new TextInputControl({
          label: item.label,
          required: true,
          value: '',
          validators: [{ validation: ValidationsEnum.EMAIL }],
          validationLabels: { required: 'transfer.email-required', pattern: 'transfer.email-format' },
        }))
        break;
    }
  }
}
