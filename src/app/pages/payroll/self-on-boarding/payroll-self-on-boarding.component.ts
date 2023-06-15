import {Component} from '@angular/core';

import {TitleModel} from "arb-design-library/model/title.model";
import {ButtonModel} from "arb-design-library/model/button.model";
import {SummaryModel} from "arb-design-library/model/summary.model";

import {
  buildApplyForm,
  buildFeesBoxesForm,
  buildGenericFeatureListModels,
  fillResult
} from "./self-on-boarding.-controls";
import {PayrollBaseComponent} from "../payroll-base/payroll-base.component";
import {ResultModal} from "../../../@core/model/dto/result.modal";
import {SelfOnBoardingLineCardsModel} from "../../../@core/model/dto/self-on-boarding-line-cards-model";
import {FormResult, PageModel} from "../../../@core/model/dto/formModel";
import {AgreementTemplateDTOList} from "../../../@core/model/rest/payroll/self-on-boarding/payroll-agreement-template-list-res";
import {ServiceType} from "./service-type";
import {FormButtonClickOutput} from "../../../shared/form/form.component";
import {AgreementValidateRes} from "../../../@core/model/rest/payroll/self-on-boarding/agreement-validate-res";
import {RequestValidate} from "../../../@core/model/rest/common/otp.model";
import {AgreementValidateReq} from "../../../@core/model/rest/payroll/self-on-boarding/agreement-validate-req";
import {AgreementConfirmReq} from "../../../@core/model/rest/payroll/self-on-boarding/agreement-confirm-req";
import {PayrollType} from "../payroll-type";
import {AccountsCommonService} from "../../../@core/service/accounts/accounts-common.service";
import {Utils} from "../../../@core/utility/Utils";
import {PayrollPagesNames} from "../payroll-pages-names";
import {AccountsRes} from "../../../@core/model/rest/accounts/accounts-res";
import {downloadButton} from "../../representatives/representatives-add/representatives-add-controls";


@Component({
  selector: 'app-self-on-boarding',
  templateUrl: './payroll-self-on-boarding.component.html'
})
export class PayrollSelfOnBoardingComponent extends PayrollBaseComponent {
  showLanding: boolean = true;
  confirmButton: ButtonModel = {
    id: "Confirm",
    text: 'public.confirm',
    type: "primary"

  }
  proceedButton: ButtonModel = {
    id: "Proceed",
    text: 'public.proceed',
    type: "primary",
    isDisable: true
  }
  landingTitle = 'payroll.payroll-wps-plus.self-onBoarding.welcome'
  startButtons: ButtonModel[] = [];
  endButtons: ButtonModel[] = [];
  summary!: SummaryModel;
  result!: ResultModal;
  lineCards: SelfOnBoardingLineCardsModel[] = [];
  pages: PageModel[] = [];
  pageTitle: TitleModel = {
    id: "sob-wps-plus",
    title: "payroll.payroll-wps-plus.self-onBoarding.page-name",
    stepper: {steps: ['', '', '', ''], stepCounter: 1, stepText: 'public.step', ofText: 'public.of'}
  };
  agreementTemplateList!: AgreementTemplateDTOList[];
  private data: any;
  private formIndex = 0;
  private serviceType!: ServiceType;
  firstTime: boolean = false;
  accountList!: AccountsRes


  constructor(private accountsService: AccountsCommonService) {
    super();
    this.firstTime = history.state.firstTime;
    if (history.state.data) {
      this.goToUpdate()
    } else {
      this.serviceType = ServiceType.register;
      this.drawPage()
    }
  }

  doBoxSelectClick(button?: any) {
    let index = 0
    if (button) {
      index = Number(button.buttonId.replace("box:", "")) - 1
    }
    this.data = this.agreementTemplateList[index]
    this.stepperMoveNext(this.pageTitle)
    this.pages.push(new PageModel(2, buildApplyForm(this.getPayrollType())))
    this.updateFlow(this.data)
  }

  onButtonClick(button: FormButtonClickOutput) {
    if (button.buttonId.startsWith("box:")) {
      this.doBoxSelectClick(button)
    } else {
      switch (button.buttonId) {
        case 'Subscribe':
          this.checkEligibility(this.getPayrollType())
          break
        case 'arrowTitle':
        case 'Cancel':
          this.goToPayrollLanding()
          break
        case 'Proceed':
          this.doSummary();
          break
        case 'goToPayroll':
          void this.router.navigate(['payroll/']);
          this.doSummary();
          break
        case 'Confirm':
          this.validateRequest()
          break;
        case 'termsAndConditionsLink':
          this.downloadFile()
      }
    }
  }

  checkEligibility(payrollType: string) {
    switch (this.getPayrollType()) {
      case PayrollType.WPS_PLUS:
        break
      case PayrollType.WPS:
        break
    }
    this.payrollAgreementsService.payrollAgreementEligibility.subscribe((res) => {
      if (res.eligibleToUpdate && !res.eligibleToRegister) {
        this.payrollAgreementsService.companyPayrollAgreementTemplateList.subscribe(res => {
          if (res) {
            let hasActive: any
            res.companyPayrollAgreementDTOS.find((item: any) => {
              if (item.status === "ACTIVE") {
                hasActive = item
              }
            })
            if ((hasActive != null) && this.firstTime) {
              this.goToUpdate(hasActive)
            } else {
              this.goToRegister(payrollType)
            }

          } else {
            this.goToRegister(payrollType)
          }
        })
      } else if (res.eligibleToRegister) {
        this.goToRegister(payrollType)
      } else {
        this.goToMultiOwnerForm()
      }
    })
  }

  private goToUpdate(data?: any) {
    this.drawPage();
    this.showLanding = false
    this.formIndex = 0
    this.serviceType = ServiceType.update;
    this.stepperMoveNext(this.pageTitle)
    this.pages.push(new PageModel(2, buildApplyForm(this.getPayrollType())))
    this.updateFlow(data ? data : history.state.data)
  }

  private goToRegister(payrollType: string) {
    this.showLanding = false
    this.serviceType = ServiceType.register
    this.pages = [new PageModel(1, buildFeesBoxesForm(payrollType, this.translate))]
    let PayrollAgreementType!: string;
    switch (payrollType) {
      case PayrollType.WPS:
        PayrollAgreementType = 'WPS_PAYROLL';
        break
      case PayrollType.WPS_PLUS:
        PayrollAgreementType = 'WPS_PAYROLL_PLUS';
        break
    }
    this.payrollAgreementsService.getPayrollAgreementTemplateList(PayrollAgreementType).subscribe((res) => {
      this.agreementTemplateList = res.agreementTemplateDTOList;
      this.getControl(this.pages, 0, 0, "boxesList").controlOptions.list = buildGenericFeatureListModels(this.agreementTemplateList, this.getPayrollType(), this.firstTime, this.translate);
      if (this.getControl(this.pages, 0, 0, "boxesList").controlOptions.list.length === 1) {
        this.doBoxSelectClick()
      }
    })
    this.formIndex = 1
  }


  private goToMultiOwnerForm() {

  }

  private updateFlow(data: any) {
    switch (this.getPayrollType()) {
      case PayrollType.WPS_PLUS:
        this.accountsService.getAllEligibleAccounts({txType: "ECIA", page: 1, rows: 100}).subscribe(res => {
          this.accountList = res
          this.getControl(this.pages, this.formIndex, 0, "selectChargeAccount").controlOptions.options = this.accountList.listAccount
          // this.getControl(this.pages, this.formIndex, 0, "monthlyFees").setValue(data?.monthlyFees)
          this.getControl(this.pages, this.formIndex, 0, "monthlyFees").disable()
          this.getControl(this.pages, this.formIndex, 0, "monthlyFees").hidden = true
          this.getControl(this.pages, this.formIndex, 0, "payrollPlusFees").setValue(data?.blueCollarRajhiFee)

        })
        break
      case PayrollType.WPS:
        this.accountsService.getAllEligibleAccounts({txType: "ECIA", page: 1, rows: 100}).subscribe(res => {
          this.accountList = res
          this.getControl(this.pages, this.formIndex, 0, "selectChargeAccount").controlOptions.options = this.accountList.listAccount
          this.accountList.listAccount.forEach((acc) => {
            if (this.serviceType == ServiceType.update) {
              if (acc.ibanNumber == data.account) {
                this.getControl(this.pages, this.formIndex, 0, "selectChargeAccount").setValue({ibanNumber: data.account}, true)
                this.payrollAgreementsService.getCompanyPayrollAgreementDetails(data.agreementId).subscribe((res) => {
                  let agre = res.companyPayrollAgreementDTOS[0]
                  this.getControl(this.pages, this.formIndex, 0, "molId").setValue(data.mol_ID)
                  this.getControl(this.pages, this.formIndex, 0, "monthlyFees").setValue(agre.agreementTemplate.monthlyFees)
                  this.getControl(this.pages, this.formIndex, 0, "recordFees").setValue(agre.agreementTemplate.employeeFees)
                })
              }
            } else {
              this.getControl(this.pages, this.formIndex, 0, "monthlyFees").setValue(data?.monthlyFees)
              this.getControl(this.pages, this.formIndex, 0, "recordFees").setValue(data?.monthlyFees)

            }

          })
        })
        break
    }


    this.endButtons = [this.proceedButton]
  }


  private doSummary() {
    this.summary = this.fillSummary();
    this.stepperMoveNext(this.pageTitle)
    this.endButtons = [this.confirmButton]
  }

  get accountFromControl(): string {
    let accountText: string = '';
    if (this.serviceType == ServiceType.update) {
      this.getControl(this.pages, this.formIndex, 0, "selectChargeAccount").controlOptions.options.forEach((itm: any) => {
        if (itm.ibanNumber == this.getControl(this.pages, this.formIndex, 0, "selectChargeAccount").value.ibanNumber) {
          accountText = itm.displayText
        }
      })
    } else {
      accountText = this.getControl(this.pages, this.formIndex, 0, "selectChargeAccount").value.displayText
    }
    return accountText;
  }

  private fillSummary() {
    return this.summary = {
      sections: [{
        items: [
          {
            title: 'payroll.self-onBoarding.wps.charge-account',
            subTitle: this.accountFromControl,
          },
          {
            title: "payroll.self-onBoarding.wps.mol_id",
            subTitle: this.getControl(this.pages, this.formIndex, 0, "molId").value
          },
          {
            title: "payroll.self-onBoarding.wps.monthly-fees",
            subTitle: this.getControl(this.pages, this.formIndex, 0, "monthlyFees").value,
            currency: "SAR"
          },
          {
            title: "payroll.self-onBoarding.wps-plus.payroll-plus-fees",
            subTitle: this.getControl(this.pages, this.formIndex, 0, "payrollPlusFees")?.value,
            currency: "SAR"
          }
        ]
      }]
    }
  }

  private validateRequest() {
    this.payrollAgreementsService.payrollCompanyAgreementValidate(this.buildValidateRequest).subscribe({
      next: (res: AgreementValidateRes) => {
        this.verificationService.showVerification(res.generateChallengeAndOTP).subscribe((requestValidate: RequestValidate) => {
          this.confirmRequest(requestValidate);
        })
      }
    })
  }

  get buildValidateRequest(): AgreementValidateReq {
    return {
      account: this.getControl(this.pages, this.formIndex, 0, "selectChargeAccount").value.ibanNumber,
      employeeCount: (this.data.employeeCountMaximum) ? this.data.employeeCountMaximum : this.data.employeeCount,
      agreementTemplateId: (this.data.templateId) ? this.data.templateId : this.data.agreementTemplateId,
      mol_ID: this.getControl(this.pages, this.formIndex, 0, "molId").value
    }
  }

  buildConfirmRequest(requestValidate: RequestValidate): AgreementConfirmReq {
    return {
      account: this.getControl(this.pages, this.formIndex, 0, "selectChargeAccount").value.ibanNumber,
      employeeCount: (this.data.employeeCountMaximum) ? this.data.employeeCountMaximum : this.data.employeeCount,
      agreementTemplateId: (this.data.templateId) ? this.data.templateId : this.data.agreementTemplateId,
      mol_ID: this.getControl(this.pages, this.formIndex, 0, "molId").value,
      requestValidate: requestValidate,
      agreementType: (this.getPayrollType() == PayrollType.WPS_PLUS) ? 'WPS_PAYROLL_PLUS' : 'WPS_PAYROLL'
    }
  }

  private confirmRequest(requestValidate: RequestValidate) {
    this.payrollAgreementsService.payrollCompanyAgreementConfirm(this.buildConfirmRequest(requestValidate)).subscribe({
      next: () => {
        this.result = fillResult(this.translate);
        this.stepperMoveNext(this.pageTitle)
        this.endButtons = [this.dashboardButton, this.payrollButton]
        this.startButtons = []
      },
      error: () => {
        this.endButtons = [this.dashboardButton, this.payrollButton]
        this.startButtons = []
      }
    })

  }


  private drawPage() {
    switch (this.getPayrollType()) {
      case PayrollType.WPS_PLUS:
        Utils.setBreadcrumb([
          {
            text: 'payroll.main-page-name',
            url: PayrollPagesNames.PAYROLL
          },
          {
            text: 'payroll.self-onBoarding.page-name',
            url: ''
          },
          {
            text: 'payroll.self-onBoarding.wps-plus.page-name',
            url: ''
          }
        ])
        this.landingTitle = 'payroll.self-onBoarding.wps-plus.welcome'
        this.pageTitle = {
          id: "sob-wps",
          title: "payroll.self-onBoarding.wps-plus.page-name",
          stepper: {steps: ['', '', '', ''], stepCounter: 1, stepText: 'public.step', ofText: 'public.of'}
        }
        this.lineCards = [
          {
            image: "assets/img/arb-icon.svg",
            title: "payroll.self-onBoarding.wps-plus.landing-cards.card1.title",
            subTitle: ""
          },
          {
            image: "assets/img/arb-icon.svg",
            title: "payroll.self-onBoarding.wps-plus.landing-cards.card2.title",
            subTitle: ""
          },
          {
            image: "assets/img/arb-icon.svg",
            title: "payroll.self-onBoarding.wps-plus.landing-cards.card3.title",
            subTitle: ""
          },
          {
            image: "assets/img/arb-icon.svg",
            title: "payroll.self-onBoarding.wps-plus.landing-cards.card4.title",
            subTitle: ""
          }

        ]
        this.payrollButton.text = 'payroll.payroll-wps-plus.buttons.go-back-to-wps-plus'
        break
      case PayrollType.WPS:
        Utils.setBreadcrumb([
          {
            text: 'payroll.main-page-name',
            url: PayrollPagesNames.PAYROLL
          },
          {
            text: 'payroll.self-onBoarding.page-name',
            url: ''
          },
          {
            text: 'payroll.self-onBoarding.wps.page-name',
            url: ''
          }
        ])
        this.landingTitle = 'payroll.self-onBoarding.wps.welcome'
        this.pageTitle = {
          id: "sob-wps",
          title: "payroll.self-onBoarding.wps.page-name",
          stepper: {steps: ['', '', '', ''], stepCounter: 1, stepText: 'public.step', ofText: 'public.of'}
        }
        this.lineCards = [
          {
            image: "assets/img/arb-icon.svg",
            title: "payroll.self-onBoarding.wps.landing-cards.card1.title",
            subTitle: ""
          },
          {
            image: "assets/img/arb-icon.svg",
            title: "payroll.self-onBoarding.wps.landing-cards.card2.title",
            subTitle: ""
          },
          {
            image: "assets/img/arb-icon.svg",
            title: "payroll.self-onBoarding.wps.landing-cards.card3.title",
            subTitle: ""
          },
          {
            image: "assets/img/arb-icon.svg",
            title: "payroll.self-onBoarding.wps.landing-cards.card4.title",
            subTitle: ""
          }

        ]
        break
    }
  }

  override onResultChanged(forms: FormResult[], endButtons: ButtonModel[]): void {
    let valid: boolean[] = [];
    forms.forEach(form => {
      if (form.valid && this.isAvailableBalanceMoreThanZero()) {
        valid.push(true)
      } else {
        valid.push(false)
      }
    })
    for (let button of endButtons) {
      button.isDisable = valid.includes(false);
    }
  }

  private isAvailableBalanceMoreThanZero(): boolean {
    let valid = false
    let getAccount: '';
    if (this.pages.length === 1 && this.getControl(this.pages, 0, 0, "selectChargeAccount").value) {
      getAccount = this.getControl(this.pages, 0, 0, "selectChargeAccount").value.ibanNumber
    } else if (this.pages.length > 1 && this.getControl(this.pages, 1, 0, "selectChargeAccount").value) {
      getAccount = this.getControl(this.pages, 1, 0, "selectChargeAccount").value.ibanNumber
    }
    // }
    this.accountList?.listAccount.find(acc => {
      if (acc.ibanNumber === getAccount) {
        if (acc.availableBalance > 0) {
          valid = true;
        } else {
          valid = false
        }
      }
    })
    return valid
  }

  private downloadFile() {
    switch (this.getPayrollType()) {
      case PayrollType.WPS_PLUS:
        this.wpsPlusPayrollService.getDocument("Payroll-Plus-Service-Agreement.pdf")
        break
    }
  }
}
