import { Component, OnInit } from '@angular/core';
import { TableControl } from 'app/@core/model/dto/control/table-control';
import { PageModel } from 'app/@core/model/dto/formModel';
import { ResultModal } from 'app/@core/model/dto/result.modal';
import { GenerateChallengeAndOTP, RequestValidate } from 'app/@core/model/rest/common/otp.model';
import {
  ProxyAction,
  ProxyConfirmReqModel,
  ProxyType
} from 'app/@core/model/rest/transfer/alias-management/proxy-confirm-req.model';
import { ProxyListResModel } from 'app/@core/model/rest/transfer/alias-management/proxy-list-res.model';
import { ProxyManageResModel } from 'app/@core/model/rest/transfer/alias-management/proxy-manage-res.model';
import { ProxyValidateReqModel } from 'app/@core/model/rest/transfer/alias-management/proxy-validate-req.model';
import { ResponseException } from 'app/@core/service/base/responseException';
import { VerificationService } from 'app/@core/service/base/verification.service';
import { AliasManagementService } from 'app/@core/service/transfer/alias-management/alias-management.service';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { TableButtonOutputModel } from 'arb-design-library/model/table-button-output.model';
import { TransferBaseComponent } from '../transfer-base/transfer-base.component';
import {
  aliasManagementForm,
  detailManagementForm,
  detailTitleManagementForm,
  errorForm,
  oneDetailForm,
  resonsForm,
  successForm
} from './alias-management-controls';

@Component({
  selector: 'app-alias-management',
  templateUrl: '../transfer-base/transfer-base.component.html',
  styleUrls: []
})
export class AliasManagementComponent extends TransferBaseComponent implements OnInit {

  listAccount: any[] = [];
  iban: string = "";
  alias: string = ""
  generateChallengeAndOTP!: GenerateChallengeAndOTP;
  validateResponse!: ProxyManageResModel;
  checkMarked: {
    type: string,
    marked: boolean
  } = {
    type: '',
    marked: false
  }
  type!: ProxyType
  action!: ProxyAction
  proxyList!: ProxyListResModel
  value!: string
  registrationId!: string

  unlinkButton: ButtonModel = {
    id: 'unlinkAll',
    text: 'alias-management.unlink',
    type: 'primary',
    isDisable: true,
  };

  linkUnlinkButton: ButtonModel = {
    id: 'linkUnlink',
    text: '',
    type: 'primary',
    isDisable: true,
  };

  cancelButton: ButtonModel = {
    id: 'cancel',
    text: 'public.cancel',
    type: 'secondary',
    isDisable: false,
  };

  goDashboardButton: ButtonModel = {
    id: 'dashboard',
    text: 'alias-management.goDashboard',
    type: 'secondary',
    isDisable: false,
  };

  goAliasButton: ButtonModel = {
    id: 'alias',
    text: 'alias-management.goAlias',
    type: 'primary',
    isDisable: false,
  };

  constructor(private otpService: VerificationService, private aliasManagementService: AliasManagementService) {
    super();
    this.setListTitle()
    this.pages = [new PageModel(1, aliasManagementForm())];
    this.startButtons = [];
    this.setBreadcrumb([{
      text: 'transfer.transfer',
      url: '/transfer'
    }, {
      text: 'alias-management.title',
      url: ''
    }]);
    this.getAccounts();
    (this.getControl(0, 0, "aliasesTable") as TableControl).buttonClicked?.subscribe((res) => {
      this.tableButton(res);
    });

  }

  ngOnInit(): void {
  }

  getAccounts() {
    this.aliasManagementService.getAccounts().subscribe(
      {
        next: (res) => {
          this.listAccount = res.listAccount;
          this.getControl(0, 0, "aliasesTable").controlOptions.data = this.listAccount;
          this.getControl(0, 0, "aliasesTable").controlOptions.total = res.total;
          this.getControl(0, 0, "aliasesTable").controlOptions.paginationValue = {
            page: 1,
            size: 20
          }
        },
        error: () => {
          this.nextButton.showLoading = false;
          this.getControl(0, 0, "aliasesTable").controlOptions.data = [];
        }
      });

  }

  setListTitle() {
    this.pageTitle = {
      id: "aliasManagement",
      title: "alias-management.title",
      stepper: undefined,
      showArrow: true,
      endButtons: [],
    };
    this.endButtons = [];
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'arrowTitle':
        this.router.navigateByUrl('/transfer').then(() => {
        });
        break;
      case 'unlinkAllStart':
        this.printReasons();
        break;
      case 'linkUnlink':
        this.linkUnlinkOne();
        break;
      case 'unlinkAll':
        this.unlinkAll();
        break;
      case 'cancel':
      case 'alias':
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
          return false;
        }
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/transfer/alias-management']).then(() => {
        });
        break;
      case 'dashboard':
        this.router.navigate(["/dashboard"]).then(() => {
        });
        break;
      case 'email':
      case 'mobile':
      case 'unn':
        this.cardButton(formButtonClickOutput.buttonId);
        break;
      default:
        break;
    }
  }

  fillSuccessResult(): ResultModal {
    return {
      type: 'Warning',
      title: 'alias-management.sureToUnlink',
      subTitle: 'alias-management.note',
      summary: {},
    };
  }

  printReasons() {
    this.pages = [new PageModel(1, resonsForm())];
    this.getControl(0, 0, 'notSatisfied').valueChanges.subscribe(value => {
      this.checked(value.value, 'notSatisfied');
    });
    this.getControl(0, 0, 'privacyConcern').valueChanges.subscribe(value => {
      this.checked(value.value, 'privacyConcern');
    });
    this.getControl(0, 0, 'notFriendy').valueChanges.subscribe(value => {
      this.checked(value.value, 'notFriendy');
    });
    this.getControl(0, 0, 'other').valueChanges.subscribe(value => {
      this.checked(value.value, 'other');
    });
    this.startButtons = [this.cancelButton]
    this.endButtons = [this.unlinkButton]
  }

  checked(value: boolean, type: string) {
    switch (type) {
      case 'notSatisfied':
        if (this.checkMarked.marked) {
          this.getControl(0, 0, 'privacyConcern').setValue(false)
          this.getControl(0, 0, 'notFriendy').setValue(false)
          this.getControl(0, 0, 'other').setValue(false)
        } else {
          this.checkMarked = {
            type: 'notSatisfied',
            marked: true
          }
        }
        if (!value) {
          this.checkMarked = {
            type: '',
            marked: false
          }
        }
        this.endButtons[0].isDisable = !value
        break;
      case 'privacyConcern':
        if (this.checkMarked.marked) {
          this.getControl(0, 0, 'notSatisfied').setValue(false)
          this.getControl(0, 0, 'notFriendy').setValue(false)
          this.getControl(0, 0, 'other').setValue(false)
        } else {
          this.checkMarked = {
            type: 'privacyConcern',
            marked: true
          }
        }
        if (!value) {
          this.checkMarked = {
            type: '',
            marked: false
          }
        }
        this.endButtons[0].isDisable = !value
        break;
      case 'notFriendy':
        if (this.checkMarked.marked) {
          this.getControl(0, 0, 'privacyConcern').setValue(false)
          this.getControl(0, 0, 'notSatisfied').setValue(false)
          this.getControl(0, 0, 'other').setValue(false)
        } else {
          this.checkMarked = {
            type: 'notFriendy',
            marked: true
          }
        }
        if (!value) {
          this.checkMarked = {
            type: '',
            marked: false
          }
        }
        this.endButtons[0].isDisable = !value
        break;
      case 'other':
        if (this.checkMarked.marked) {
          this.getControl(0, 0, 'privacyConcern').setValue(false)
          this.getControl(0, 0, 'notFriendy').setValue(false)
          this.getControl(0, 0, 'notSatisfied').setValue(false)
        } else {
          this.checkMarked = {
            type: 'other',
            marked: true
          }
        }
        if (!value) {
          this.checkMarked = {
            type: '',
            marked: false
          }
        }
        this.endButtons[0].isDisable = !value
        break;

      default:
        break;
    }

  }

  returnValidateRequest(unlinkAll: boolean): ProxyValidateReqModel {

    return {
      iban: this.iban,
      proxyAction: unlinkAll ? ProxyAction.DELINK_ALL : this.action,
      proxyType: unlinkAll ? null : this.type,
      proxyValue: unlinkAll ? null : this.value,
      reason: unlinkAll ? this.translate.instant(this.getControl(0, 0, this.checkMarked.type).controlOptions.title[0].text) : '',
      registrationId: this.action !== ProxyAction.DELINK ? '' : this.registrationId
    }
  }

  unlinkAll() {
    this.validate(true)
  }

  linkUnlinkOne() {
    this.validate(false)
  }

  validate(all: boolean) {
    this.aliasManagementService
      .validate(this.returnValidateRequest(all))
      .subscribe({
        next: (res: any) => {
          this.generateChallengeAndOTP = res.generateChallengeAndOTP;
          this.validateResponse = res;
          this.validateResponse.generateChallengeAndOTP ? this.showOtp(all) : this.confirm(all);
        },
        error: (error: ResponseException) => {
          // this.summary = this.fillSummary();
        }
      });
  }

  showOtp(all: boolean) {
    this.otpService.showVerification(this.validateResponse.generateChallengeAndOTP).subscribe((requestValidate: RequestValidate) => {
      this.confirm(all, requestValidate);
    });
  }

  confirm(all: boolean, requestValidate?: RequestValidate) {
    this.aliasManagementService.confirm(this.returnConfirmRequest(all, requestValidate)).subscribe({
      next: (res) => {
        this.pages = [new PageModel(1, successForm())];
        if(this.action===ProxyAction.LINK){
          this.getControl(0,0,"status").controlOptions.title='alias-management.successfullyLink'
          this.getControl(0,0,"status").controlOptions.subTitle='alias-management.noteLink'
        }
        this.startButtons = []
        this.endButtons = [this.goDashboardButton, this.goAliasButton];
      },
      error: (error: ResponseException) => {
        this.pages = [new PageModel(1, errorForm())];
        if(this.action===ProxyAction.LINK){
          this.getControl(0,0,"status").controlOptions.title='alias-management.errorLink'
        }
        this.startButtons = []
        this.endButtons = [this.goDashboardButton, this.goAliasButton];
      }
    });
  }

  returnConfirmRequest(unlinkAll: boolean, requestValidate?: RequestValidate): ProxyConfirmReqModel {
    return {
      iban: this.iban,
      proxyAction: unlinkAll ? ProxyAction.DELINK_ALL : this.action,
      proxyType: unlinkAll ? null : this.type,
      proxyValue: unlinkAll ? null : this.value,
      reason: unlinkAll ? this.translate.instant(this.getControl(0, 0, this.checkMarked.type).controlOptions.title[0].text) : '',
      registrationId: this.action !== ProxyAction.DELINK ? '' : this.registrationId,
      requestValidate
    }
  }


  tableButton(data: TableButtonOutputModel) {
    switch (data.buttonId) {
      case 'accountText':
      case 'aliasText':
        this.getDetailsRow(data)
        break;
    }
  }

  cardButton(data: string) {
    switch (data) {
      case 'email':
        this.type = ProxyType.EMAIL
        break;
      case 'mobile':
        this.type = ProxyType.MOBILE
        break;
      case 'unn':
        this.type = ProxyType.UNN
        break;
    }

    if (data === 'email' || data === 'mobile' || data === 'unn') {
      if (this.getControl(0, 1, data).controlOptions.button.text === 'alias-management.unlink') {
        this.action = ProxyAction.DELINK
      } else {
        this.action = ProxyAction.LINK
      }

      this.printOneDetail(data)
    }
  }

  printOneDetail(data: string) {
    this.pages = [new PageModel(1, detailTitleManagementForm(), oneDetailForm())];
    this.getControl(0, 1, data).hidden = false
    this.linkUnlinkButton.text = this.action === ProxyAction.DELINK ? 'alias-management.unlink' : 'alias-management.link'
    this.startButtons = [this.cancelButton]
    this.endButtons = [this.linkUnlinkButton]
    if (this.action === ProxyAction.DELINK) {
      this.linkUnlinkButton.isDisable = false
      const type2 = this.type === 'UNN' ? 'CR_OR_UNNID' : (this.type === 'EMAIL' ? 'EMAIL' : 'MOIBLE_NUMBER')
      this.value = this.proxyList.proxyList.slice().reverse().find(e => e.type === type2)?.value!
      this.registrationId = this.proxyList.proxyList.slice().reverse().find(e => e.type === type2)?.registrationId!
      this.getControl(0, 1, data).setValue(this.value)
      this.getControl(0, 1, data).disable()
      this.getControl(0, 0, 'title').controlOptions.endButtons = []

    } else {
      this.getControl(0, 1, data).valueChanges.subscribe(value => {
        this.value = value.value
        if (value.value !== '') {
          this.linkUnlinkButton.isDisable = false
        }
      })
    }

  }

  getDetailsRow(data: TableButtonOutputModel) {
    this.alias = data.row.alias
    this.iban = data.row.ibanNumber
    this.pages = [new PageModel(1, detailTitleManagementForm(), detailManagementForm())];
    this.aliasManagementService.getProxyList(data.row.ibanNumber).subscribe(
      {
        next: (res) => {
          this.proxyList = res
          this.getControl(0, 1, 'email').controlOptions.title = 'alias-management.email'
          this.getControl(0, 1, 'mobile').controlOptions.title = 'alias-management.phone'
          this.getControl(0, 1, 'unn').controlOptions.title = 'alias-management.unnNumber'

          res.proxyList.forEach(element => {
            switch (element.type) {
              case 'EMAIL':
                this.getControl(0, 1, 'email').controlOptions.subTitle = element.value
                break;
              case 'MOIBLE_NUMBER':
                this.getControl(0, 1, 'mobile').controlOptions.subTitle = element.value
                break;
              case 'CR_OR_UNNID':
                this.getControl(0, 1, 'unn').controlOptions.subTitle = element.value
                break;
            }
          });
          if (!res.proxyList.find((e) => e.type === 'EMAIL')) {
            this.getControl(0, 1, 'email').controlOptions.button.text = 'alias-management.link'
          }
          if (!res.proxyList.find((e) => e.type === 'MOIBLE_NUMBER')) {
            this.getControl(0, 1, 'mobile').controlOptions.button.text = 'alias-management.link'
          }
          if (!res.proxyList.find((e) => e.type === 'CR_OR_UNNID')) {
            this.getControl(0, 1, 'unn').controlOptions.button.text = 'alias-management.link'
          }
          this.getControl(0, 0, 'title').controlOptions.endButtons[0].isDisable = res.proxyList.length > 0 ? false : true
        },
        error: () => {
          this.nextButton.showLoading = false;
        }
      });
    this.getControl(0, 0, "title").controlOptions.title = this.alias
    this.getControl(0, 0, "title").controlOptions.subTitle = this.iban
  }
}
