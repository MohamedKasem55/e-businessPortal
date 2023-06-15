import { VerificationService } from '../../../../@core/service/base/verification.service';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  FormModel,
  FormResult,
  PageModel,
} from 'app/@core/model/dto/formModel';
import { TransferBaseComponent } from '../../transfer-base/transfer-base.component';
import {
  beneficiaryEditWithinControls,
  beneficiaryEditLocalControls,
  beneficiaryEditInternationalControls,
  detailsForm,
  getDeleteForm,
  deleteButton,
  getModifyForm,
  getSuccessfulForm,
} from './edit-beneficiary-controls';
import { CurrencyPipe } from 'app/@core/pipe/currency.pipe';
import {
  GenerateChallengeAndOTP,
  RequestValidate,
} from 'app/@core/model/rest/common/otp.model';
import { ResponseException } from 'app/@core/service/base/responseException';
import { ModelAndListService } from 'app/@core/service/base/modelAndList.service';
import { BeneficiariesService } from '../../../../@core/service/transfer/beneficiaries/beneficiaries.service';
import { BeneficiaryModifyReqModel } from 'app/@core/model/rest/transfer/beneficiary/beneficiary-modify-req.model';
import { PopupService } from 'app/@core/service/base/popup.service';
import { FormButtonClickOutput } from '../../../../shared/form/form.component';
import { BreadcrumbModel } from 'arb-design-library/model/breadcrumb.model';
import { BeneficiariesDetailsReqModel } from 'app/@core/model/rest/transfer/beneficiary/beneficiaries-details-req.model';
import { PopupOutputModel } from 'app/@core/model/dto/popup.model';
import { BeneficiaryModel } from 'app/@core/model/rest/transfer/beneficiary/beneficiary.model';
import { BeneficiaryDeleteReqModel } from 'app/@core/model/rest/transfer/beneficiary/beneficiary-delete-req.model';
import { Utils } from 'app/@core/utility/Utils';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-beneficiary',
  templateUrl: '../../transfer-base/transfer-base.component.html',
})
export class EditBeneficiaryComponent extends TransferBaseComponent {
  requestValidate!: RequestValidate;
  bankCodes: any;
  countries: any;
  countriesByName: any;
  countryListByName: any;
  category: string = 'INDIVIDUAL';
  productType: string = 'PAY';
  currencies: any;
  countryList: any;
  beneficiary!: BeneficiaryModel[];
  beneficiaryList: any[] = [];
  originPageDetails: boolean = false;
  generateChallengeAndOTP!: GenerateChallengeAndOTP;

  constructor(
    public override translate: TranslateService,
    private modelAndListService: ModelAndListService,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    public otpService: VerificationService,
    private popupService: PopupService,
    public beneficiaryService: BeneficiariesService
  ) {
    super();

    this.getBeneficiary();
    this.setListTitle();
    this.endButtons = this.originPageDetails
      ? [deleteButton, this.confirmButton]
      : [this.confirmButton];
    this.setBreadcrumb(this.getBreadCrumb());

    this.modelAndListService
      .getList(['bankCode', 'backEndCountryCode', 'countryName'])
      .subscribe((res) => {
        this.bankCodes = res.bankCode;
        this.countries = res.backEndCountryCode;
        this.countriesByName = res.countryName;
        this.countryList = Object.entries(this.countries).map(
          ([key, value]) => ({ key, value })
        );
        this.countryListByName = Object.entries(this.countriesByName).map(
          ([key, value]) => ({ key, value })
        );
        if (!this.beneficiary) {
          this.router.navigateByUrl('/transfer/beneficiaries').then(() => {});
        } else {
          this.drawPage();
        }
      });
  }

  getBreadCrumb(): BreadcrumbModel[] {
    let breadCrumb: BreadcrumbModel[] = [];

    breadCrumb.push(
      { text: 'transfer.transfer', url: '/transfer' },
      { text: 'public.beneficiaries', url: '/transfer/beneficiaries' },
      {
        text: 'transfer.beneficiary.list-of-beneficiary',
        url: '/transfer/beneficiaries',
      }
    );

    if (this.originPageDetails) {
      breadCrumb.push({ text: 'public.details', url: '' });
    } else {
      breadCrumb.push({ text: 'public.edit', url: '' });
    }

    return breadCrumb;
  }

  setListTitle() {
    this.pageTitle = {
      id: 'BeneficiariesTitle',
      title: this.originPageDetails
        ? 'public.beneficiary-details'
        : 'public.edit-beneficiaries',
      stepper: undefined,
      endButtons: [],
      showArrow: true,
    };
    this.endButtons = [];
  }

  getBeneficiary() {
    this.beneficiary =
      this.router.getCurrentNavigation()!.extras.state?.['beneficiary'];
    this.originPageDetails =
      this.router.getCurrentNavigation()!.extras.state?.['details'];
  }

  drawPage() {
    this.pages = [];
    let editForms: FormModel[] = [];
    this.beneficiary.forEach((beneficiaryForm: any, index: number) => {
      let form = new FormModel({
        id: 'formFromAccount-' + (index + 1),
        showDivider: true,
      });
      if (beneficiaryForm.type === '01') {
        form.controls = beneficiaryEditWithinControls();
        form.controls['benefBankTitle'].controlOptions.title =
          this.beneficiary[index].beneficiaryFullName;
        form.controls['accountNumber'].setValue(
          this.beneficiary[index].beneficiaryAccountCode?this.beneficiary[index].beneficiaryAccountCode.trim():''
        );
        form.controls['beneficiaryName'].setValue(this.beneficiary[index].name?this.beneficiary[index].name.trim():'');
        form.controls['nickname'].setValue(
          this.beneficiary[index].beneficiaryFullName
        );
        form.controls['email'].setValue(this.beneficiary[index].email?this.beneficiary[index].email.trim():'');
      } else if (beneficiaryForm.type === '02') {
        form.controls = beneficiaryEditLocalControls();
        form.controls['benefBankTitle'].controlOptions.title =
          this.beneficiary[index].name;
        form.controls['beneficiaryAccountNumber'].setValue(
          this.beneficiary[index].beneficiaryAccountCode?this.beneficiary[index].beneficiaryAccountCode.trim():''
        );
        form.controls['bankName'].setValue(this.beneficiary[index].bankName?this.beneficiary[index].bankName.trim():'');
        form.controls['beneficiaryName'].setValue(this.beneficiary[index].name?this.beneficiary[index].name.trim():'');
        form.controls['email'].setValue(this.beneficiary[index].email?this.beneficiary[index].email.trim():'');
        form.showDivider = true;
      } else {
        form.controls = beneficiaryEditInternationalControls();
        form.controls['benefBankTitle'].controlOptions.title =
          this.beneficiary[index].beneficiaryFullName;
        form.controls['category'].setValue(
          this.beneficiary[index].beneficiaryCategory === 'I'
            ? 'INDIVIDUAL'
            : 'COMPANY'
        );
        form.controls['country'].setValue(this.beneficiary[index].name?this.beneficiary[index].name.trim():'');
        form.controls['bankName'].setValue(this.beneficiary[index].bankName?this.beneficiary[index].bankName.trim():'');
        form.controls['currency'].setValue(
          this.countries
            ? this.countries[this.beneficiary[index].beneficiaryCurrency]
            : ''
        );
        form.controls['benefCategory'].setValue({
          key: this.beneficiary[index].beneficiaryCategory,
          value:
            this.beneficiary[index].beneficiaryCategory === 'I'
              ? 'INDIVIDUAL'
              : 'COMPANY',
          displayText:
            this.beneficiary[index].beneficiaryCategory === 'I'
              ? 'INDIVIDUAL'
              : 'COMPANY',
        });
        form.controls['beneficiaryAccountNumber'].setValue(
          this.beneficiary[index].beneficiaryAccount.fullAccountNumber?this.beneficiary[index].beneficiaryAccount.fullAccountNumber.trim():''
        );
        form.controls['beneficiaryAccountNumberRetype'].setValue(
          this.beneficiary[index].beneficiaryAccount.fullAccountNumber?this.beneficiary[index].beneficiaryAccount.fullAccountNumber.trim():''
        );
        form.controls['shortCode'].setValue(
          this.beneficiary[index].beneficiaryAccount.code000?this.beneficiary[index].beneficiaryAccount.code000.trim():''
        );
        form.controls['beneficiaryName'].setValue(
          this.beneficiary[index].beneficiaryFullName?this.beneficiary[index].beneficiaryFullName.trim():''
        );
        form.controls['customerName'].setValue(
          this.beneficiary[index].beneficiaryFullName?this.beneficiary[index].beneficiaryFullName.trim():''
        );
        form.controls['beneficiaryfullName'].setValue(
          this.beneficiary[index].beneficiaryFullName?this.beneficiary[index].beneficiaryFullName.trim():''
        );
        if (this.beneficiary[index].dateBirth) {
          form.controls['dateOfBirth'].setValue(
            this.datePipe.transform(
              this.beneficiary[index].dateBirth,
              'dd/MM/YYYY'
            )
          );
        } else {
          form.controls['dateOfBirth'].setValue('');
        }
        form.controls['placeOfBirth'].controlOptions.options =
          this.countryListByName;
        form.controls['placeOfBirth'].controlOptions.options =
          this.countryListByName;
        form.controls['placeOfBirth'].setValue({
          key: this.beneficiary[index].placeBirth,
          value: this.countriesByName[this.beneficiary[index].placeBirth],
          displayText: this.countriesByName[this.beneficiary[index].placeBirth],
        });

        if (this.beneficiary[index].beneficiaryCategory === 'C') {
          form.controls['beneficiaryfullName'].hidden = true;
          form.controls['dateOfBirth'].hidden = true;
          form.controls['placeOfBirth'].hidden = true;
        }
        form.controls['beneficiaryType'].setValue(
          this.getBeneficiaryType(this.beneficiary[index].beneficiaryType!)
        );
        form.controls['beneficiaryNationality'].controlOptions.options =
          this.countryList;
        form.controls['beneficiaryNationality'].setValue({
          key: this.beneficiary[index].nationality,
          value: this.countries[this.beneficiary[index].nationality],
          displayText: this.countries[this.beneficiary[index].nationality],
        });
        form.controls['mobile'].setValue(this.beneficiary[index].mobileNo?this.beneficiary[index].mobileNo.trim():'');
        form.controls['email'].setValue(this.beneficiary[index].email?this.beneficiary[index].email.trim():'');
        form.controls['benefAddress1'].setValue(
          this.beneficiary[index].address1?this.beneficiary[index].address1.trim():''
        );
        form.controls['street'].setValue(
          this.beneficiary[index].addressNumber?this.beneficiary[index].addressNumber.trim():''
        );
        form.controls['benefAddress2'].setValue(
          this.beneficiary[index].address1?this.beneficiary[index].address1.trim():''
        );
        form.controls['postalCode'].setValue(
          this.beneficiary[index].poBox
            ? this.beneficiary[index].poBox?this.beneficiary[index].poBox.trim():''
            : ''
        );
        form.controls['countryAddress'].setValue({
          key: this.beneficiary[index].countryCode,
          value: this.countries[this.beneficiary[index].countryCode],
          displayText: this.countries[this.beneficiary[index].countryCode],
        });
        form.controls['countryAddress'].controlOptions.options =
          this.countryList;
        form.controls['poBox'].setValue(
          this.beneficiary[index].poBox
            ? this.beneficiary[index].poBox?this.beneficiary[index].poBox.trim():''
            : ''
        );
        form.controls['poBox'].setRequired(true);
        form.controls['cityState'].setValue(this.beneficiary[index].city?this.beneficiary[index].city.trim():'');
        form.controls['documentId'].setValue(
          this.beneficiary[index].documentId?this.beneficiary[index].documentId.trim():''
        );
        form.controls['idType'].setValue(
          this.beneficiary[index].beneficiaryAccount.typeAccount?this.beneficiary[index].beneficiaryAccount.typeAccount.trim():''
        );
        form.controls['idNumber'].setValue(
          this.beneficiary[index].beneficiaryAccount.branchid?this.beneficiary[index].beneficiaryAccount.branchid.trim():''
        );
        form.controls['IssuedAt'].setValue(
          this.beneficiary[index].beneficiaryAccount.typeAccount?this.beneficiary[index].beneficiaryAccount.typeAccount.trim():''
        );
        form.controls['issueDate'].setValue(
          this.beneficiary[index].beneficiaryAccount.typeAccount?this.beneficiary[index].beneficiaryAccount.typeAccount.trim():''
        );
        form.showDivider = true;
      }

      editForms.push(form);
    });
    this.pages = !this.originPageDetails
      ? [new PageModel(1, ...editForms)]
      : [new PageModel(1, ...editForms, detailsForm())];
    if (this.originPageDetails) {
      this.getDetailsTable();
    }
  }

  getBeneficiaryType(code: string): string {
    let beneficiaryType = '';
    if (code === '01') {
      beneficiaryType = 'Al Rajhi';
    } else if (code === '02') beneficiaryType = 'Local';
    else {
      beneficiaryType = 'International';
    }
    return beneficiaryType;
  }

  getDetailsTable() {
    this.beneficiaryService
      .getBeneficiariesDetails(this.returnBeneficiariesDetailsRequest())
      .subscribe((data) => {
        this.getControl(0, 1, 'beneficiaryDetailsTable').controlOptions.data =
          data['lastTransactionDetails'];
      });
  }

  returnBeneficiariesDetailsRequest(): BeneficiariesDetailsReqModel {
    return {
      beneficiaryId: this.beneficiary
        ? this.beneficiary[0]['beneficiaryId']
        : '',
      ernumber: this.beneficiary ? this.beneficiary[0]['ernumber'] : '',
      type: this.beneficiary ? this.beneficiary[0]['type'] : '',
    };
  }

  override onResultChanged(data: FormResult[]) {
    if (this.originPageDetails) {
      this.endButtons[1].isDisable = data.some((form: FormResult) => {
        return !form.valid;
      });
    } else {
      this.endButtons[0].isDisable = data.some((form: FormResult) => {
        return !form.valid;
      });
    }
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'Confirm':
        this.modifyBeneficiary();
        break;
      case 'arrowTitle':
      case 'Back':
        void this.router.navigate(['/transfer/beneficiaries']);
        this.pages = [];
        break;
      case 'delete':
        this.openDelete();
        break;
    }
  }

  opennewmodify() {
    this.beneficiary.forEach((beneficiary: any, index: any) => {
      if (beneficiary.beneficiaryCategory == 'Individual') {
        beneficiary.beneficiaryCategory = 'I';
      } else {
        beneficiary.beneficiaryCategory = 'C';
      }
      if (beneficiary.type === '01' || beneficiary.type === '02') {
        beneficiary['newEmail='] = this.getControl(0, index, 'email').value;
      }
    });
  }

  trimObject(obj: any): void {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (typeof obj[prop] === 'string') {
          obj[prop] = obj[prop].trim();
        } else if (typeof obj[prop] === 'object' && obj[prop] !== null) {
          this.trimObject(obj[prop]);
        }
      }
    }
  }

  modifyBeneficiary() {
    this.popupService
      .showPopup({
        image: 'assets/img/warning.svg',
        form: getModifyForm(),
      })
      .subscribe((res: PopupOutputModel) => {
        if (res.buttonId == 'modify') {
          this.popupService.dismiss();

          let total = this.beneficiary.length;
          this.beneficiary.forEach((beneficiary: any, index: any) => {
            if (beneficiary.beneficiaryCategory == 'Individual') {
              beneficiary.beneficiaryCategory = 'I';
            } else {
              beneficiary.beneficiaryCategory = 'C';
            }
            if (beneficiary.type === '01' || beneficiary.type === '02') {
              beneficiary['newEmail='] = this.getControl(
                0,
                index,
                'email'
              ).value;
            }
            this.trimObject(beneficiary)
            this.beneficiaryService
              .modifyBeneficiary(
                this.returnRequestBeneficiaryModify(beneficiary)
              )
              .subscribe({
                next: (res) => {
                  total--;
                  if (total === 0) {
                    this.getSuccessPopUp();
                  }
                },
                error: (error: ResponseException) => {
                  this.alert = {
                    id: 'delete',
                    type: 'Critical',
                    message: error.message,
                    showClose: true,
                  };
                  this.router
                    .navigateByUrl('/transfer/beneficiaries')
                    .then(() => {});
                },
              });
          });
        } else {
          this.popupService.dismiss();
        }
      });
  }

  getSuccessPopUp() {
    this.popupService
      .showPopup({
        image: 'assets/img/icon/check.svg',
        form: getSuccessfulForm(),
      })
      .subscribe((res: PopupOutputModel) => {
        if (res.buttonId == 'ok') {
          this.popupService.dismiss();
          this.router.navigateByUrl('/transfer/beneficiaries').then(() => {});
        }
      });
  }

  returnRequestBeneficiaryModify(beneficiary: any): BeneficiaryModifyReqModel {
    let newEmail: string = '';
    if (beneficiary && beneficiary.type === '03') {
      newEmail = this.getControl(0, 0, 'email').value
        ? this.getControl(0, 0, 'email').value.trim()
        : '';
    } else {
      newEmail = beneficiary['newEmail='] ? beneficiary['newEmail='].trim() : '';
    }
    return {
      beneficiary: beneficiary,
      placeBirth:
        beneficiary.type === '03' &&
        this.getControl(0, 0, 'placeOfBirth').value.key
          ? this.getControl(0, 0, 'placeOfBirth').value.key.trim()
          : '',
      poBox:
        beneficiary.type === '03' && this.getControl(0, 0, 'poBox').value
          ? this.getControl(0, 0, 'poBox').value.trim()
          : '',
      category:
        beneficiary.type === '03' &&
        this.getControl(0, 0, 'benefCategory').value.key
          ? this.getControl(0, 0, 'benefCategory').value.key.trim()
          : '',
      addressNumber:
        beneficiary.type === '03' && this.getControl(0, 0, 'street').value
          ? this.getControl(0, 0, 'street').value.trim()
          : '',
      zipCode:
        beneficiary.type === '03' && this.getControl(0, 0, 'postalCode').value
          ? this.getControl(0, 0, 'postalCode').value.trim()
          : '',
      address1:
        beneficiary.type === '03' &&
        this.getControl(0, 0, 'benefAddress1').value
          ? this.getControl(0, 0, 'benefAddress1').value.trim()
          : '',
      mobileNo:
        beneficiary.type === '03' && this.getControl(0, 0, 'mobile').value
          ? this.getControl(0, 0, 'mobile').value.trim()
          : '',
      dateBirth:
        beneficiary.type === '03' && this.getControl(0, 0, 'dateOfBirth').value
          ? (typeof this.getControl(0, 0, 'dateOfBirth').value === 'string'?
          Utils.getDateFormatted(
            {year:this.getControl(0, 0, 'dateOfBirth').value.slice(-4),
            month:this.getControl(0, 0, 'dateOfBirth').value.substring(3, 5),
            day:this.getControl(0, 0, 'dateOfBirth').value.slice(0, 2)},
            'YYYY-MM-dd'
          )
          :
          Utils.getDateFormatted(
              this.getControl(0, 0, 'dateOfBirth').value,
              'YYYY-MM-dd'
            ))
          : '',
      nationality:
        beneficiary.type === '03' &&
        this.getControl(0, 0, 'beneficiaryNationality').value.key
          ? this.getControl(0, 0, 'beneficiaryNationality').value.key
          : '',
      newEmail: newEmail,
    };
  }

  backClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        break;
      case 2:
        this.endButtons = [this.nextButton];
        this.pages[0].deleteFrom(1, 1);
        this.stepperMoveBack();
        break;
    }
  }

  getCountries() {
    this.beneficiaryService
      .beneficiaryInternationalCountryBranch(this.productType)
      .subscribe((res: any) => {
        if (!res.errorCode) {
          this.getControl(0, 0, 'country').controlOptions.options =
            res.countries;
        }
      });
  }

  getBankCode(): string {
    const bankIbanCodeTmp = this.getControl(
      0,
      0,
      'accountNumber'
    ).value.substring(4, 6);
    const bankIbanCode = '0' + bankIbanCodeTmp;
    return bankIbanCode;
  }

  openDelete() {
    this.popupService
      .showPopup({
        image: 'assets/img/warning.svg',
        form: getDeleteForm(),
      })
      .subscribe((res: PopupOutputModel) => {
        if (res.buttonId == 'delete') {
          this.popupService.dismiss();
          this.beneficiary.forEach((item: BeneficiaryModel, index: number) => {
            let data: BeneficiaryDeleteReqModel = {
              beneficiaryId: item.beneficiaryId,
              ernumber: item.ernumber,
            };
            this.beneficiaryService.deleteBeneficiary(data).subscribe({
              next: (res) => {
                this.alert = {
                  id: 'delete',
                  type: 'Success',
                  message: 'transfer.beneficiary.beneficiary-deleted',
                  showClose: true,
                };
                this.router
                  .navigateByUrl('/transfer/beneficiaries')
                  .then(() => {});
              },
              error: (error: ResponseException) => {
                this.alert = {
                  id: 'delete',
                  type: 'Critical',
                  message: error.message,
                  showClose: true,
                };
                this.router
                  .navigateByUrl('/transfer/beneficiaries')
                  .then(() => {});
              },
            });
          });
        } else {
          this.popupService.dismiss();
        }
      });
  }
}
