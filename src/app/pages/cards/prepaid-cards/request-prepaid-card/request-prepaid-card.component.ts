import { DocCode, PrepaidCardAttachmentReqModel } from 'app/@core/model/rest/cards/prepaid-cards/attachment.model';
import { Component, OnInit } from '@angular/core';
import { FormResult, PageModel } from 'app/@core/model/dto/formModel';
import { Account } from 'app/@core/model/rest/common/account';
import { UserProfileService } from 'app/@core/service/user-profile/user-profile.service';
import { PrepaidCardsService } from 'app/@core/service/cards/prepaid-cards/prepaid-cards.service';
import { lastValueFrom, take } from 'rxjs';
import { CardsBaseComponent } from '../../cards-base/cards-base.component';
import {
  cardRequesterList,
  gender,
  selectAccountForm,
  editAccoutButton,
  documentInformationForm,
} from './request-prepaid-card-controls';
import { SummaryModel } from "arb-design-library/model/summary.model";
import { SummarySectionModel } from 'arb-design-library/model/summary-section.model';
import { ModelAndListService } from 'app/@core/service/base/modelAndList.service';
import { VerificationService } from 'app/@core/service/base/verification.service';
import { RequestValidate } from 'app/@core/model/rest/common/otp.model';
import { PrepaidRequestNewConfirmReqModel } from 'app/@core/model/rest/cards/prepaid-cards/request-new-confirm-req.model';
import {
  PrepaidRequestNewValidateResModel
} from 'app/@core/model/rest/cards/prepaid-cards/request-new-validate-res.model';
import {
  PrepaidRequestNewValidateReqModel
} from 'app/@core/model/rest/cards/prepaid-cards/request-new-validate-req.model';
import {
  PrepaidRequestCardOwnerDataResModel
} from 'app/@core/model/rest/cards/prepaid-cards/request-new-owner-data-res.model';
import { KeyValueModel } from 'app/@core/model/rest/common/key-value.model';
import { ResponseException } from 'app/@core/service/base/responseException';
import { ResultModal } from 'app/@core/model/dto/result.modal';
import { FormButtonClickOutput } from "../../../../shared/form/form.component";
import { APPLY_NEW_CARD, CARDS } from 'app/@core/constants/pages-urls-constants';
import { ButtonModel } from 'arb-design-library/model/button.model';

@Component({
  selector: 'app-request-prepaid-card',
  templateUrl: '../../cards-base/cards-base.component.html',
})
export class RequestPrepaidCardComponent
  extends CardsBaseComponent
  implements OnInit {
  accountsList: Account[] = [];
  cardRequesterList = cardRequesterList;
  genders = gender;
  citiesList: KeyValueModel[] = [];
  nationalitiesList: KeyValueModel[] = [];
  selectedRequester: any;
  selectedAccount: any;
  birthDate!: any;
  validateResponse!: PrepaidRequestNewValidateResModel;
  ownerHasMissingData: boolean | undefined;
  ownerDetails: PrepaidRequestCardOwnerDataResModel | undefined;

  goApplyButton: ButtonModel = {
    id: "goApply",
    text: 'cards.new-card.goToApply',
    type: "primary",
    isDisable: false
  };

  constructor(
    private userProfileService: UserProfileService,
    private prepaidCardService: PrepaidCardsService,
    private modelAndListService: ModelAndListService,
    private otpService: VerificationService,
  ) {
    super();
    this.setBreadcrumb([
      {
        text: 'cards.cards',
        url: '/cards',
      },
      { text: 'cards.new-card.new-card', url: '' },
    ]);
  }

  override ngOnInit(): void {
    this.loadAccountsList();
    this.initiatPage();
    this.loadCardRequesterList();
  }

  initiatPage() {
    this.pageTitle.id = 'newCardTitle';
    this.pageTitle.title = 'cards.new-card.apply-for-card';
    this.pageTitle.stepper!.steps = ['', '', '', '', ''];
    this.pageTitle.stepper!.stepCounter = 2;
    this.endButtons[0].isDisable = true;
    this.pages = [new PageModel(2, selectAccountForm())];
  }

  loadCardRequesterList() {
    this.assignDropdownListFieldValues(
      'cardRequester',
      0,
      0,
      this.cardRequesterList,
      {
        textField: 'text',
      }
    );
  }

  loadAccountsList() {
    this.userProfileService
      .getSARAccountList()
      .pipe(take(1))
      .subscribe((res) => {
        if (res.listAlertsPermissionAccount?.length) {
          this.accountsList = res.listAlertsPermissionAccount;
          this.assignDropdownListFieldValues(
            'linkedAccount',
            0,
            0,
            this.accountsList,
            {
              textField: 'fullAccountNumber',
              endTextField: 'availableBalance',
              endTextCurrencyField: 'currency',
            }
          );
        }
      });
  }

  override onResultChanged(data: FormResult[]): void {
    let valid = true;
    data.forEach(item => {
      valid = valid && item.valid;
    })
    if (this.pageTitle?.stepper?.stepCounter !== 3) {
      this.endButtons[0].isDisable = !valid
    } else {
      if (this.getControl(1, 0, 'terms').value && this.pageTitle?.stepper?.stepCounter === 3) {
        this.endButtons[0].isDisable = !valid
      } else {
        this.endButtons[0].isDisable = !this.getControl(1, 0, 'terms').value;
      }
    }
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'Next':
        this.nextClick();
        break;
      case 'Back':
      case 'Edit':
        this.backClick();
        break;
      case 'edit-account-btn':
        if (this.pageTitle?.stepper?.stepCounter! > 3) {
          this.stepperMoveBack();
        }
        this.backClick();
        this.pages.pop();
        break;
      case 'Confirm':
        this.requestValidateOTP();
        break;
      case 'terms-cond':
        this.prepaidCardService.getDocument("Terms-and-Conditions-of-Issuing-Business-Prepaid-Card.pdf");
        break;
      case this.backToCardsButton.id:
        this.router.navigate(['/cards']);
        break;
      case this.backToDashboardButton.id:
        this.router.navigate(['/dashboard']);
        break;
      case this.goApplyButton.id:
        this.router.navigate(['/cards/apply-new-card']);
        break;
    }
  }

  backClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 2:
        this.router.navigate([`/${CARDS}/${APPLY_NEW_CARD}`]);
        break;
      case 3:
      case 4:
        this.stepperMoveBack();
        this.endButtons = [this.nextButton]
        break;
    }
  }

  nextClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 2:
        this.endButtons[0].isDisable = true
        this.submitSelectAccountForm();
        break;
      case 3:
        this.goToSummary();
        this.endButtons = [this.confirmButton]
        break;
    }
  }

  async submitSelectAccountForm() {
    this.selectedRequester = this.getControl(0, 0, 'cardRequester').value;
    this.selectedAccount = this.getControl(0, 0, 'linkedAccount').value;
    this.stepperMoveNext();
    this.ownerHasMissingData = true;

    if (this.selectedRequester?.value === 'owner') {
      this.ownerDetails = await this.loadOwnerDetails();
      // this.ownerHasMissingData = !this.ownerDetails;
      this.ownerHasMissingData = !(this.ownerDetails?.birthDate&&this.ownerDetails?.city&&this.ownerDetails?.companyEmbossingName&&this.ownerDetails?.firstName
        &&this.ownerDetails?.gender&&this.ownerDetails?.lastName&&this.ownerDetails?.mobileNumber&&this.ownerDetails?.nationalId&&this.ownerDetails?.nationality)

    }
    if (this.pages.length > 1) {
      this.pages.splice(-1, 1, new PageModel(3,
        documentInformationForm(
          this.selectedRequester?.value,
          this.ownerDetails,
          this.ownerHasMissingData,
        )));
    } else {
      this.pages.push(new PageModel(3,
        documentInformationForm(
          this.selectedRequester?.value,
          this.ownerDetails,
          this.ownerHasMissingData
        )));
    }
    this.prepareDocumentInformationData()
    if (this.ownerDetails) {
      this.fillMissingFormData(this.ownerDetails);
    }
  }

  prepareDocumentInformationData() {
    this.loadCitiesNationalitiesList();
    this.getControl(1, 0, 'linkedAccountSummary')
      .setValue(this.selectedAccount.fullAccountNumber)
    this.getControl(1, 0, 'cardRequesterSummary')
      .setValue(this.selectedRequester.value)
  }

  loadCitiesNationalitiesList() {
    this.modelAndListService
      .getList(['nationalityCode', 'cityType'])
      .pipe(take(1))
      .subscribe((res) => {
        this.citiesList = this.objectToKeyValue(res.cityType);
        this.nationalitiesList = this.objectToKeyValue(res.nationalityCode);
        if (this.ownerHasMissingData) {
          this.fillFormLists();
        }
      });
  }

  fillFormLists() {
    if(this.getControl(1, 0, 'gender'))
      this.assignDropdownListFieldValues('gender', 1, 0, this.genders,
        {
          textField: 'value',
        }
      );
    if(this.getControl(1, 0, 'nationality'))
      this.assignDropdownListFieldValues('nationality', 1, 0, this.nationalitiesList,
        {
          textField: 'value',
        }
      );
    if(this.getControl(1, 0, 'city'))
      this.assignDropdownListFieldValues('city', 1, 0, this.citiesList,
        {
          textField: 'value',
        }
      );
  }

  async loadOwnerDetails(): Promise<any> {
    try {
      const ownerDetails = await lastValueFrom(
        this.prepaidCardService
          .getNewPrepaidOwnerData()
          .pipe(take(1))
      );
      return ownerDetails;
    } catch (error) {
      return;
    }
  }

  fillMissingFormData(ownerDetails: PrepaidRequestCardOwnerDataResModel | undefined) {
    if (ownerDetails?.firstName&&this.getControl(1, 0, 'cardFName')) {
      this.getControl(1, 0, 'cardFName').setValue(ownerDetails.firstName)
    }
    if (ownerDetails?.lastName&&this.getControl(1, 0, 'cardLName')) {
      this.getControl(1, 0, 'cardLName').setValue(ownerDetails.lastName)
    }
    if (ownerDetails?.mobileNumber&&this.getControl(1, 0, 'mobileNumber')) {
      const mobile = ownerDetails.mobileNumber.substring(4, ownerDetails.mobileNumber.length - 1);
      this.getControl(1, 0, 'mobileNumber').setValue(mobile);
    }
    if (ownerDetails?.nationalId&&this.getControl(1, 0, 'nationalId')) {
      this.getControl(1, 0, 'nationalId').setValue(ownerDetails.nationalId)
    }
    if (ownerDetails?.birthDate&&this.getControl(1, 0, 'birthDate')) {
      const date = ownerDetails.birthDate.split('-');
      this.getControl(1, 0, 'birthDate').setValue({
        year: Number(date[0]),
        month: Number(date[1]),
        day: Number(date[2]),
      });
    }
    if (ownerDetails?.city&&this.getControl(1, 0, 'city')) {
      this.getControl(1, 0, 'city').setValue({ key: ownerDetails.city });
    }
    if (ownerDetails?.gender&&this.getControl(1, 0, 'gender')) {
      this.getControl(1, 0, 'gender').setValue({ key: ownerDetails.gender });
    }
    if (ownerDetails?.nationality&&this.getControl(1, 0, 'nationality')) {
      this.getControl(1, 0, 'nationality').setValue({ key: ownerDetails.nationality });
    }
  }

  goToSummary() {
    this.stepperMoveNext();
    this.summary = this.fillSummary()
  }

  fillSummary(enableEditButton = true): SummaryModel {
    let sections: SummarySectionModel[] = [];
    this.birthDate = this.ownerHasMissingData
      ? this.getControl(1, 0, 'birthDate').value
      : this.ownerDetails?.birthDate;
    this.pages[1].forms.forEach((item) => {
      sections.push({
        title: {
          id: 'selected-account-requester',
          title: 'cards.new-card.request-information',
          endButtons: enableEditButton ? [editAccoutButton] : [],
        },
        items: [
          {
            title: 'cards.new-card.linked-account',
            subTitle: this.getControl(0, 0, 'linkedAccount').value.fullAccountNumber,
          },
          {
            title: 'cards.new-card.card-requester',
            subTitle: this.getControl(0, 0, 'cardRequester').value.text,
          },
        ]
      });
      sections.push({
        title: {
          id: 'new-document-information',
          title: 'cards.new-card.document-information',
          endButtons: enableEditButton ? [this.editButton] : [],
        },
        items: [
          {
            title: 'cards.new-card.company-emb-name',
            subTitle: this.getControl(1, 0, 'companyEmbName').value,
          },
        ]
      });
      sections.push({
        title: {
          id: 'new-request-application-details',
          title: 'cards.new-card.appication-details',
          endButtons: enableEditButton ? [this.editButton] : [],
        },
        items: this.fillApplicationDetailsItems(),
      });
    });
    return {
      sections: sections
    }
  }

  fillApplicationDetailsItems() {
    const items = [
      {
        title: 'cards.new-card.nation-id-iqama',
        subTitle: this.ownerHasMissingData&& this.getControl(1, 0, 'nationalId')
          ? this.getControl(1, 0, 'nationalId').value
          : this.ownerDetails?.nationalId,
      },
      {
        title: 'cards.new-card.holder-fname',
        subTitle: this.ownerHasMissingData&& this.getControl(1, 0, 'cardFName')
          ? this.getControl(1, 0, 'cardFName').value
          : this.ownerDetails?.firstName,
      },
      {
        title: 'cards.new-card.holder-lname',
        subTitle: this.ownerHasMissingData&& this.getControl(1, 0, 'cardLName')
          ? this.getControl(1, 0, 'cardLName').value
          : this.ownerDetails?.lastName,
      },
      {
        title: 'cards.new-card.birth-date',
        subTitle: this.ownerHasMissingData && this.getControl(1, 0, 'birthDate')
          ? `${this.birthDate.day}-${this.birthDate.month}-${this.birthDate.year}`
          : this.birthDate,
      },
      {
        title: 'cards.new-card.gender',
        subTitle: this.ownerHasMissingData&& this.getControl(1, 0, 'gender')
          ? this.getControl(1, 0, 'gender').value.value
          : this.genders.find(gender => gender.key == this.ownerDetails?.gender)?.value,
      },
      {
        title: 'cards.new-card.nationality',
        subTitle: this.ownerHasMissingData&& this.getControl(1, 0, 'nationality')
          ? this.getControl(1, 0, 'nationality').value.value
          : this.nationalitiesList.find(nationality => nationality.key == this.ownerDetails?.nationality)?.value,
      },
      {
        title: 'cards.new-card.city',
        subTitle: this.ownerHasMissingData&& this.getControl(1, 0, 'city')
          ? this.getControl(1, 0, 'city').value.value
          : this.citiesList.find(city => city.key == this.ownerDetails?.city)?.value,
      },
      {
        title: 'cards.new-card.mobile-number',
        subTitle: this.ownerHasMissingData&& this.getControl(1, 0, 'mobileNumber')
          ? this.getControl(1, 0, 'mobileNumber').value
          : this.ownerDetails?.mobileNumber.substring(4, this.ownerDetails?.mobileNumber.length - 1),
      },
    ];

    if (this.selectedRequester?.value === 'employee') {
      items.push(
        {
          title: 'cards.new-card.id-iqama',
          subTitle: this.getControl(1, 0, 'idDocument').value.name,
        },
        {
          title: 'cards.new-card.employee-cert',
          subTitle: this.getControl(1, 0, 'empCertDocument').value.name,
        }
      )
    }
    if (this.selectedRequester?.value === 'owner') {
      items.push(
        {
          title: 'cards.new-card.company-registration-document',
          subTitle: this.getControl(1, 0, 'companyRegistrationDoc').value.name,
        }
      )
    }

    return items
  }

  requestValidateOTP() {
    const request: PrepaidRequestNewValidateReqModel = {
      prepaidCardsRequestNewDSO: {
        accountNumber: this.getControl(0, 0, 'linkedAccount').value
          .fullAccountNumber,
        countryCode: this.getControl(1, 0, 'nationality')?this.getControl(1, 0, 'nationality').value.key:this.ownerDetails?.nationality,
        nationalId: this.getControl(1, 0, 'nationalId')?.value || this.ownerDetails?.nationalId,
        mobileNumber: this.getControl(1, 0, 'mobileNumber')?.value || this.ownerDetails?.mobileNumber,
        nationality: this.getControl(1, 0, 'nationality')?this.getControl(1, 0, 'nationality')?.value.key : this.ownerDetails?.nationality,
        firstName: this.getControl(1, 0, 'cardFName')?.value || this.ownerDetails?.firstName,
        lastName: this.getControl(1, 0, 'cardLName')?.value || this.ownerDetails?.lastName,
        gender: this.getControl(1, 0, 'gender')?this.getControl(1, 0, 'gender')?.value.key : this.ownerDetails?.gender,
        birthDate: this.birthDate.year
          ? `${this.birthDate.year}-${this.birthDate.month}-${this.birthDate.day}`
          : this.birthDate,
        city: this.getControl(1, 0, 'city')?this.getControl(1, 0, 'city')?.value.key : this.ownerDetails?.city,
        companyEmbossingName: this.getControl(1, 0, 'companyEmbName').value,
        ownerEmbossingName: 0,
        requesterType: this.getControl(0, 0, 'cardRequester').value
          .value.toUpperCase(),
      },
    };
    this.prepaidCardService
      .validatePrepaidCardNewRequest(request)
      .pipe(take(1))
      .subscribe((res) => {
        if (res?.generateChallengeAndOTP) {
          this.validateResponse = res;
          this.showOtp()
        }
      });
  }

  showOtp() {
    this.otpService
      .showVerification(this.validateResponse.generateChallengeAndOTP)
      .subscribe((requestValidate: RequestValidate) => {
        this.confirmNewCardRequest(requestValidate);
      });
  }

  confirmNewCardRequest(requestValidate: RequestValidate) {
    const request: PrepaidRequestNewConfirmReqModel = {
      prepaidCardsRequestNewDSO: this.validateResponse.prepaidCardsRequestNewDSO,
      requestValidate: requestValidate,
    }
    this.prepaidCardService
      .confirmPrepaidCardNewRequest(request)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          if (res?.cardOrderId) {
            this.stepperMoveNext();
            this.summary = {};
            this.endButtons = [this.backToDashboardButton, this.backToCardsButton];
            this.startButtons = [];
            this.result = this.fillSuccessResult();
            this.uploadAttachmnets(res.cardOrderId)
          }

        },
        error: (error: ResponseException) => {
          this.stepperMoveNext();
          this.summary = {};
          this.startButtons = [];
          this.endButtons=[this.goApplyButton]
          this.result = this.fillErrorResult(error.ErrorResponse?.errorDescription);
        }
      });
  }

  fillSuccessResult(): ResultModal {
    return {
      type: 'Success',
      title: 'cards.new-card.request-successfully',
      summary: this.fillSummary(false),
    };
  }

  fillErrorResult(errString?: string): ResultModal {
    return {
      type: 'Error',
      title: errString?errString:'public.error',
      summary: this.fillSummary(false),
    };
  }

  uploadAttachmnets(cardOrderId: string) {
    if (this.selectedRequester?.value === 'employee') {
      const idDoc = this.getControl(1, 0, 'idDocument').value;
      const empCertDoc = this.getControl(1, 0, 'empCertDocument').value;
      this.proceedUploadDocument(idDoc, cardOrderId, {
        fileType: 'ID',
        fileCode: DocCode.ID,
      });
      this.proceedUploadDocument(empCertDoc, cardOrderId, {
        fileType: 'EMP_CERT',
        fileCode: DocCode.EMP_CERT,
      });
    }
    if (this.selectedRequester?.value === 'owner') {
      const companyRegDoc = this.getControl(1, 0, 'companyRegistrationDoc').value;
      this.proceedUploadDocument(companyRegDoc, cardOrderId, {
        fileType: 'COMMREG',
        fileCode: DocCode.COMMREG,
      });
    }
  }

  proceedUploadDocument(file: any, cardOrderId: string, fileInfo: any) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const readFile = {
        fileContent: reader.result,
        fileName: file.name,
        fileType: file.type,
      }
      const request: PrepaidCardAttachmentReqModel = {
        dossierId: cardOrderId,
        fileContent: readFile.fileContent || '',
        fileName: readFile.fileName,
        fileType: fileInfo.fileType,
        fileCode: fileInfo.fileCode,
      }
      this.prepaidCardService
        .submitPrepaidCardDocuments(request)
        .pipe(take(1))
        .subscribe((res) => {
        });
    }
  }

}
