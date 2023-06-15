import { Component, OnInit } from '@angular/core';
import { FormResult, PageModel } from 'app/@core/model/dto/formModel';
import { ResultModal } from 'app/@core/model/dto/result.modal';
import { AccountsReq } from 'app/@core/model/rest/accounts/accounts-req';
import { Account } from 'app/@core/model/rest/common/account';
import { GenerateChallengeAndOTP } from 'app/@core/model/rest/common/otp.model';
import {
  AccountAuth,
  Power,
  RepAccntModDtlsDTO,
  RepPowerModRequestDTO,
  RepresentativesDetailRes,
  RequestAddRepresentative,
  RequestRepresentativeDelete,
  RequestRepresentativeModify,
} from 'app/@core/model/rest/representatives/representatives-req.model';
import { AccountsCommonService } from 'app/@core/service/accounts/accounts-common.service';
import { ModelAndListService } from 'app/@core/service/base/modelAndList.service';
import { ResponseException } from 'app/@core/service/base/responseException';
import { VerificationService } from 'app/@core/service/base/verification.service';
import { RepresentativesService } from 'app/@core/service/representatives/representatives.service';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { SelectionGroupModel } from 'arb-design-library/model/selection-group.model';
import { SummaryItemModel } from 'arb-design-library/model/summary-item.model';
import { SummaryModel } from 'arb-design-library/model/summary.model';
import {
  cancelButton,
  deleteForm,
  getEndButtons,
  infoDocForm,
  powersForm,
  repAuthAccForm,
  signForm,
} from './representatives-add-controls';
import { RepresentativesBaseComponent } from '../representatives-base.component';
import { PopupOutputModel } from 'app/@core/model/dto/popup.model';
import { PopupService } from 'app/@core/service/base/popup.service';
import { ErrorBaseResponse } from 'app/@core/model/rest/common/base-response';
import { Utils } from 'app/@core/utility/Utils';

@Component({
  selector: 'app-representatives-add',
  templateUrl: '../representatives-base.component.html',
})
export class RepresentativesAddComponent
  extends RepresentativesBaseComponent
  implements OnInit
{
  generateChallengeAndOTP!: GenerateChallengeAndOTP;
  rep: string = '';
  dataDet!: RepresentativesDetailRes;
  dataPow: SelectionGroupModel[] = [];
  currencyIso: Record<string, string> = {};

  constructor(
    private accountsService: AccountsCommonService,
    private otpService: VerificationService,
    private modelAndListService: ModelAndListService,
    private representativesService: RepresentativesService,
    private popupService: PopupService
  ) {
    super();
    if (this.router.getCurrentNavigation()?.extras.state) {
      this.rep = this.router.getCurrentNavigation()?.extras.state!['rep'];
      this.representativesService.getDetails(this.rep).subscribe({
        next: (response) => {
          this.dataDet = response;
          this.drawPage(response);
        },
        error: () => {},
      });
      this.pageTitle.id = 'representativesDetail';
      this.pageTitle.title = 'representatives.detail.title';
      this.pageTitle.showArrow = true;
      this.pageTitle.stepper = undefined;
      this.editButton.type = 'primary';
      this.endButtons = [this.deleteButton, this.editButton];
      this.setBreadcrumb([
        {
          text: 'representatives.title',
          url: '/representatives',
        },
        {
          text: 'representatives.detail.title',
          url: '/representatives/addRepresentative',
        },
      ]);
    } else {
      this.pageTitle.id = 'representativesAdd';
      this.pageTitle.title = 'representatives.add.title';
      this.pageTitle.showArrow = true;
      this.pageTitle.stepper!.steps = ['', '', '', '', ''];
      this.drawPage();
      this.setBreadcrumb([
        {
          text: 'representatives.title',
          url: '/representatives',
        },
        {
          text: 'representatives.add.title',
          url: '/representatives/addRepresentative',
        },
      ]);
    }
  }

  ngOnInit(): void {}

  drawPage(detail?: RepresentativesDetailRes): void {
    this.modelAndListService.getModel('powerList').subscribe((powerRes) => {
      this.modelAndListService.getList(['currencyIso']).subscribe((res) => {
        this.currencyIso = res.currencyIso;
        Object.keys(powerRes.powerList).forEach((key) => {
          this.dataPow.push({
            id: key,
            title: powerRes.powerList[key],
            value: false,
          });
        });
        this.dataPow.sort((a, b) => a.id.localeCompare(b.id));
        if (detail) {
          this.pages = [
            new PageModel(
              1,
              infoDocForm(),
              repAuthAccForm(detail.repAccntsAuthLst, this.currencyIso),
              powersForm(this.parseDetPow(detail.repPowerLst))
            ),
          ];

          this.setDetail(detail);
        } else {
          const accountsReq: AccountsReq = {
            order: '',
            orderType: '',
            page: null,
            rows: null,
            txType: 'ECAL',
          };
          this.accountsService.getAllEligibleAccounts(accountsReq).subscribe({
            next: (res) => {
              this.pages = [];
              this.pages = [
                new PageModel(1, infoDocForm()),
                new PageModel(
                  2,
                  repAuthAccForm(res.listAccount, this.currencyIso)
                ),
                new PageModel(3, powersForm(this.dataPow), signForm()),
              ];
            },
            error: () => {},
          });
        }
      });
    });
  }

  setDetail(detail: RepresentativesDetailRes) {
    this.getControl(0, 0, 'firstName').disable();
    this.getControl(0, 0, 'firstName').setValue(detail.repGivenName);
    this.getControl(0, 0, 'middleName').disable();
    this.getControl(0, 0, 'middleName').setValue(detail.repMiddleName || '-');
    this.getControl(0, 0, 'paternalName').disable();
    this.getControl(0, 0, 'paternalName').setValue(
      detail.repPaternalName || '-'
    );
    this.getControl(0, 0, 'lastName').disable();
    this.getControl(0, 0, 'lastName').setValue(detail.repFamilyName);
    this.getControl(0, 0, 'phoneNumber').disable();
    this.getControl(0, 0, 'phoneNumber').setValue(detail.repPhone.repPhoneNum);
    this.getControl(0, 0, 'birthDate').disable();
    this.getControl(0, 0, 'birthDate').setValue(
      this.parseDate(detail.repBirthDt, 'detail')
    );
    this.getControl(0, 0, 'idNumber').disable();
    this.getControl(0, 0, 'idNumber').setValue(detail.repIdentityInfo.repIDNum);
    this.getControl(0, 0, 'issuedBy').disable();
    this.getControl(0, 0, 'issuedBy').setValue(
      detail.repIdentityInfo.repIDIssuerName
    );
    this.getControl(0, 0, 'issueDate').disable();
    this.getControl(0, 0, 'issueDate').setValue(
      this.parseDate(detail.repIdentityInfo.repIDIssueDt, 'detail')
    );
    this.getControl(0, 0, 'expiryDate').disable();
    this.getControl(0, 0, 'expiryDate').setValue(
      this.parseDate(detail.repIdentityInfo.repIDExpDt, 'detail')
    );
    this.getControl(0, 1, 'accounts').disable();
    this.getControl(0, 1, 'accounts').setValue(
      this.selectDetAcc(detail.repAccntsAuthLst)
    );
    this.getControl(0, 2, 'from').disable();
    this.getControl(0, 2, 'from').setValue(
      this.parseDate(detail.repStartDate, 'detail')
    );
    this.getControl(0, 2, 'to').disable();
    this.getControl(0, 2, 'to').setValue(
      this.parseDate(detail.repEndDate, 'detail')
    );
    this.getControl(0, 2, 'powers').disable();
    this.getControl(0, 2, 'powers').setValue(
      this.parseDetPow(detail.repPowerLst)
    );
  }

  drawEdit(detail: RepresentativesDetailRes) {
    this.pages = [
      new PageModel(
        1,
        repAuthAccForm(detail.repAccntsAuthLst, this.currencyIso),
        powersForm(this.parseDetPow(detail.repPowerLst))
      ),
    ];

    this.setEdit(detail);
  }

  setEdit(detail: RepresentativesDetailRes) {
    this.getControl(0, 0, 'accounts').setValue(
      this.selectDetAcc(detail.repAccntsAuthLst)
    );
    this.getControl(0, 1, 'from').setValue(
      this.parseDate(detail.repStartDate, 'detail')
    );
    this.getControl(0, 1, 'to').setValue(
      this.parseDate(detail.repEndDate, 'detail')
    );
    this.getControl(0, 1, 'powers').setValue(
      this.parseDetPow(detail.repPowerLst)
    );
    this.updateChips();
  }

  selectDetAcc(detailAcc: AccountAuth[]): AccountAuth[] {
    return detailAcc
      .filter((element) => element.enabled)
      .map((element) => {
        return {
          fullAccountNumber: element.fullAccountNumber,
          alias: element.alias,
          currency: this.currencyIso[element.currency],
          accountPk: element.accountPk,
          availableBalance: element.availableBalance,
          enabled: element.enabled,
        };
      });
  }

  parseDetPow(detailPow: Power[]): SelectionGroupModel[] {
    return detailPow.map((element) => {
      return {
        id: element.repPower,
        title: element.dis,
        value: element.enabled,
      };
    });
  }

  override onResultChanged(data: FormResult[]) {
    this.updateChips();
    if (this.endButtons[this.endButtons.length - 1].id !== 'Edit') {
      if (data.find((element) => element.valid === false)) {
        this.endButtons[this.endButtons.length - 1].isDisable = true;
      } else {
        this.endButtons[this.endButtons.length - 1].isDisable = false;
      }
    }
  }
  updateChips() {
    let powersValue: SelectionGroupModel[];
    let title;
    if (this.rep) {
      if (!this.getControl(0, 1, 'powers')?.value) {
        return;
      }
      powersValue = this.getControl(0, 1, 'powers').value;
      title = this.getControl(0, 1, 'titlePowers');
    } else {
      if (!this.getControl(2, 0, 'powers')?.value) {
        return;
      }
      powersValue = this.getControl(2, 0, 'powers').value;
      title = this.getControl(2, 0, 'titlePowers');
    }
    title.controlOptions.chips = powersValue
      .filter((element: SelectionGroupModel) => element.value === true)
      .map((element) => {
        return {
          id: element.id,
          label: element.title,
          showClose: true,
        };
      });
  }

  showOtp(): void {
    this.otpService
      .showVerification(this.generateChallengeAndOTP)
      .subscribe(() => {
        this.confirmRepresentative();
      });
  }

  confirmRepresentative(): void {
    this.nextButton.showLoading = true;
    this.representativesService
      .confirmRepresentative(this.returnRequestConfirmRepresentative())
      .subscribe({
        next: (res) => {
          this.stepperMoveNext();
          this.startButtons = [];
          this.endButtons = getEndButtons();
          this.summary = {};
          this.result = this.fillSuccessResult();
        },
        error: (error: ResponseException) => {
          this.stepperMoveNext();
          this.startButtons = [];
          this.endButtons = getEndButtons();
          this.summary = {};
          this.result = this.fillErrorResult(
            error.ErrorResponse.errorDescription!
          );
        },
      });
  }

  returnRequestConfirmRepresentative(): RequestAddRepresentative {
    return {
      repGivenName: this.getControl(0, 0, 'firstName').value,
      repMiddleName: this.getControl(0, 0, 'middleName').value || null,
      repPaternalName: this.getControl(0, 0, 'paternalName').value || null,
      repFamilyName: this.getControl(0, 0, 'lastName').value,
      repPhone: {
        repPhoneNum: this.getControl(0, 0, 'phoneNumber').value,
      },
      repBirthDt: Utils.getDateFormatted(
        this.getControl(0, 0, 'birthDate').value,
        'yyyy-MM-dd'
      ),

      repIdentityInfo: {
        repIDNum: this.getControl(0, 0, 'idNumber').value,
        repIDIssuerName: this.getControl(0, 0, 'issuedBy').value,
        repIDIssueDt: Utils.getDateFormatted(
          this.getControl(0, 0, 'issueDate').value,
          'yyyy-MM-dd'
        ),
        repIDExpDt: Utils.getDateFormatted(
          this.getControl(0, 0, 'expiryDate').value,
          'yyyy-MM-dd'
        ),
      },
      repAccntsAuthLst: this.buildAccounts(
        this.getControl(1, 0, 'accounts').value
      ),
      repStartDate: Utils.getDateFormatted(
        this.getControl(2, 0, 'from').value,
        'yyyy-MM-dd'
      ),
      repEndDate: Utils.getDateFormatted(
        this.getControl(2, 0, 'to').value,
        'yyyy-MM-dd'
      ),
      repPowerLst: this.buildPowers(
        this.getControl(2, 0, 'powers').value,
        'id'
      ),
      repImage: this.getControl(2, 1, 'img').value.name,
    };
  }

  editRepresentative(): void {
    this.nextButton.showLoading = true;
    this.representativesService
      .editRepresentative(this.returnRequestEditRepresentative())
      .subscribe({
        next: (res) => {
          this.stepperMoveNext();
          this.startButtons = [];
          this.endButtons = getEndButtons();
          this.summary = {};
          this.result = this.fillSuccessEditResult();
        },
        error: (error: ErrorBaseResponse) => {
          this.stepperMoveNext();
          this.startButtons = [];
          this.endButtons = getEndButtons();
          this.summary = {};
          if (error?.errorResponse?.description) {
            this.result = this.fillErrorEditResult(
              error.errorResponse.description!
            );
          } else {
            this.result = this.fillErrorEditResult();
          }
        },
      });
  }

  returnRequestEditRepresentative(): RequestRepresentativeModify {
    return {
      repAuthId: this.rep,
      repAccntsModLst: this.parseAccEd(
        this.buildAccounts(this.getControl(0, 0, 'accounts').value)
      ),
      repPowerModLst: this.parsePowEd(
        this.buildPowers(this.getControl(0, 1, 'powers').value, 'id')
      ),
      updtdRepEndDt: this.parseDate(this.getControl(0, 1, 'to').value, 'edit'),
    };
  }

  nextClick(): void {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.stepperMoveNext();
        break;
      case 2:
        this.stepperMoveNext();
        break;
      case 3:
        this.summary = this.fillSummary(true);
        this.stepperMoveNext();
        this.endButtons = [this.confirmButton];
        break;
      case 4:
        this.generateChallengeAndOTP &&
        this.generateChallengeAndOTP.typeAuthentication
          ? this.showOtp()
          : this.confirmRepresentative();
        break;
      case 5:
        break;
    }
  }

  backClick(): void {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.router.navigate(['/representatives']);
        break;
      case 2:
        this.stepperMoveBack();
        break;
      case 3:
        this.stepperMoveBack();
        break;
      case 4:
        this.endButtons = [this.nextButton];
        this.stepperMoveBack();
        break;
      default:
        this.router.navigate(['/representatives']);
        break;
    }
  }

  editClick(formIndex?: number): void {
    if (this.rep) {
      this.pageTitle.stepper = {
        steps: ['', '', ''],
        stepCounter: 1,
        stepText: 'public.step',
        ofText: 'public.of',
      };
      this.startButtons = [];
      this.endButtons = [cancelButton, this.proceedButton];
      this.drawEdit(this.dataDet);
    } else {
      this.endButtons = [this.nextButton];
      switch (formIndex) {
        case 0:
        case 1:
          this.pageTitle.stepper!.stepCounter = 1;
          setTimeout(() => {
            window.scrollTo(0, 0);
          });
          break;
        case 2:
          this.pageTitle.stepper!.stepCounter = 2;
          setTimeout(() => {
            window.scrollTo(0, 0);
          });
          break;
        case 3:
          this.pageTitle.stepper!.stepCounter = 3;
          setTimeout(() => {
            window.scrollTo(0, 0);
          });
          break;
      }
    }
  }

  proceedClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.summary = this.fillEditSummary();
        this.stepperMoveNext();
        this.startButtons = [this.backButton];
        break;
      case 2:
        this.generateChallengeAndOTP &&
        this.generateChallengeAndOTP.typeAuthentication
          ? this.showOtp()
          : this.editRepresentative();
        break;
      case 3:
        break;
    }
  }

  delete(): void {
    const popupContent = {
      form: deleteForm(),
      image: 'assets/img/warning.svg',
    };

    const body: RequestRepresentativeDelete[] = [
      {
        repAuthId: this.rep,
        repDelReason: 'Delete',
      },
    ];

    this.popupService
      .showPopup(popupContent)
      .subscribe((res: PopupOutputModel) => {
        if (res.buttonId === 'delete') {
          this.popupService.dismiss();

          this.representativesService.deleteRepresentative(body).subscribe({
            next: () => {
              this.router.navigate(['/representatives']);
              this.popupService.dismiss();
              window.scrollTo(0, 0);
            },
            error: (error: ResponseException) => {
              console.log(error);
              window.scrollTo(0, 0);
            },
          });
        } else {
          this.popupService.dismiss();
        }
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
      case 'arrowTitle':
      case 'Back':
        this.backClick();
        break;
      case 'goToDashboard':
        this.setBreadcrumb([]);
        this.router.navigate(['/dashboard']);
        break;
      case 'goToRepresentatives':
        this.pages = [];
        this.router.navigate(['/representatives']);
        break;
      case 'Delete':
        this.delete();
        break;
      case 'Proceed':
        this.proceedClick();
        break;
      case 'Cancel':
        this.router.navigate(['/representatives']);
        break;
      case 'Edit':
        this.editClick(formButtonClickOutput.formIndex);
        break;
      case 'Download':
        this.getDownload();
        break;
      default:
        this.deleteChips(formButtonClickOutput.buttonId);
        break;
    }
  }

  deleteChips(id: string) {
    let powersValue: SelectionGroupModel[];
    if (this.rep) {
      powersValue = this.getControl(0, 1, 'powers').value;
    } else {
      powersValue = this.getControl(2, 0, 'powers').value;
    }

    const idx = powersValue.findIndex((item) => item.id == id);
    powersValue[idx].value = false;

    if (this.rep) {
      this.getControl(0, 1, 'powers').setValue(powersValue);
    } else {
      this.getControl(2, 0, 'powers').setValue(powersValue);
    }

    this.updateChips();
  }

  fillSummary(showEditButton: boolean = false): SummaryModel {
    return {
      sections: [
        {
          title: {
            id: 'repInfo',
            title: 'representatives.add.representatives-information',
            startButtons: showEditButton ? [this.editButton] : [],
          },
          items: this.getSummaryItems('repInfo'),
        },
        {
          title: {
            id: 'docInfo',
            title: 'representatives.add.document-information',
            startButtons: showEditButton ? [this.editButton] : [],
          },
          items: this.getSummaryItems('docInfo'),
        },
        {
          title: {
            id: 'repAcc',
            title: 'representatives.add.authorized-accounts',
            startButtons: showEditButton ? [this.editButton] : [],
          },
          items: this.getSummaryItems('repAcc'),
        },
        {
          title: {
            id: 'repPow',
            title: 'representatives.add.representative-power',
            startButtons: showEditButton ? [this.editButton] : [],
          },
          items: this.getSummaryItems('repPow'),
        },
      ],
    };
  }

  getSummaryItems(section?: string): SummaryItemModel[] | null {
    switch (section) {
      case 'repInfo':
        return [
          {
            title: 'representatives.add.first-name',
            subTitle: this.getControl(0, 0, 'firstName').value,
          },
          {
            title: 'representatives.add.middle-name',
            subTitle: this.getControl(0, 0, 'middleName').value || '-',
          },
          {
            title: 'representatives.add.paternal-name',
            subTitle: this.getControl(0, 0, 'paternalName').value || '-',
          },
          {
            title: 'representatives.add.last-name',
            subTitle: this.getControl(0, 0, 'lastName').value,
          },
          {
            title: 'representatives.add.phone-number',
            subTitle: this.getControl(0, 0, 'phoneNumber').value,
          },
          {
            title: 'representatives.add.birth-date',
            subTitle: this.parseDate(
              this.getControl(0, 0, 'birthDate').value,
              'summary'
            ),
          },
        ];
      case 'docInfo':
        return [
          {
            title: 'representatives.add.id-number',
            subTitle: this.getControl(0, 0, 'idNumber').value,
          },
          {
            title: 'representatives.add.issued-by',
            subTitle: this.getControl(0, 0, 'issuedBy').value,
          },
          {
            title: 'representatives.add.issue-date',
            subTitle: this.parseDate(
              this.getControl(0, 0, 'issueDate').value,
              'summary'
            ),
          },
          {
            title: 'representatives.add.expiry-date',
            subTitle: this.parseDate(
              this.getControl(0, 0, 'expiryDate').value,
              'summary'
            ),
          },
        ];
      case 'repAcc':
        return [
          {
            title: 'representatives.add.authorized-accounts',
            subTitle: this.buildAccounts(
              this.getControl(1, 0, 'accounts').value
            ).toString(),
          },
        ];
      case 'repPow':
        return [
          {
            title: 'representatives.add.validity-period-from',
            subTitle: this.parseDate(
              this.getControl(2, 0, 'from').value,
              'summary'
            ),
          },
          {
            title: 'representatives.add.validity-period-to',
            subTitle: this.parseDate(
              this.getControl(2, 0, 'to').value,
              'summary'
            ),
          },
          {
            title: 'representatives.add.power-selection',
            subTitle: this.buildPowers(
              this.getControl(2, 0, 'powers').value
            ).toString(),
          },
        ];
    }
    return [];
  }

  fillEditSummary(): SummaryModel {
    return {
      sections: [
        {
          title: {
            id: 'repAcc',
            title: 'representatives.add.authorized-accounts',
          },
          items: this.getEditItems('repAcc'),
        },
        {
          title: {
            id: 'repPow',
            title: 'representatives.add.representative-power',
          },
          items: this.getEditItems('repPow'),
        },
      ],
    };
  }

  getEditItems(section?: string): SummaryItemModel[] | null {
    switch (section) {
      case 'repAcc':
        return [
          {
            title: 'representatives.add.authorized-accounts',
            subTitle: this.buildAccounts(
              this.getControl(0, 0, 'accounts').value
            ).toString(),
          },
        ];
      case 'repPow':
        return [
          {
            title: 'representatives.add.validity-period-from',
            subTitle: this.parseDate(
              this.getControl(0, 1, 'from').value,
              'summary'
            ),
          },
          {
            title: 'representatives.add.validity-period-to',
            subTitle: this.parseDate(
              this.getControl(0, 1, 'to').value,
              'summary'
            ),
          },
          {
            title: 'representatives.add.power-selection',
            subTitle: this.buildPowers(
              this.getControl(0, 1, 'powers').value
            ).toString(),
          },
        ];
    }
    return [];
  }

  buildAccounts(accounts: Account[]): string[] {
    return accounts.map((element) => element['fullAccountNumber']);
  }

  parseAccEd(accounts: string[]): RepAccntModDtlsDTO[] {
    return accounts.map((element) => {
      return {
        fullAccountNumber: element,
        enabled: true,
      };
    });
  }

  parseDate(date: any, type: string): any {
    switch (type) {
      case 'detail':
        const dateSplitted = date.split('-', 3);
        return {
          year: dateSplitted[0],
          month: dateSplitted[1],
          day: dateSplitted[2],
        };
      case 'summary':
        return date.day + '/' + date.month + '/' + date.year;
      case 'add':
        return date.year + '-' + date.month + '-' + date.day;
      case 'edit':
        return date.year + '-' + date.month + '-' + date.day + 'T00:00:00.000Z';
    }
  }

  buildPowers(powersValue: SelectionGroupModel[], type?: string): string[] {
    const powers = powersValue.filter(
      (element: SelectionGroupModel) => element.value === true
    );
    if (type === 'id') {
      return powers.map((element) => element['id']);
    } else {
      return powers.map((element) => element['title']);
    }
  }
  parsePowEd(powers: string[]): RepPowerModRequestDTO[] {
    return powers.map((element) => {
      return {
        repPower: element,
        enabled: true,
      };
    });
  }

  fillSuccessResult(): ResultModal {
    return {
      type: 'Success',
      title: 'representatives.add.representative-added',
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

  fillSuccessEditResult(): ResultModal {
    return {
      type: 'Success',
      title: 'representatives.detail.result',
      summary: this.fillEditSummary(),
    };
  }

  fillErrorEditResult(errString?: string): ResultModal {
    return {
      type: 'Error',
      title: errString || '',
      summary: this.fillEditSummary(),
    };
  }
  getDownload() {
    this.representativesService.getDocument('RepresentativeSignature.png');
  }
}
