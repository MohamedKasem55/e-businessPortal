import {Component} from '@angular/core';
import {PayrollBaseComponent} from "../../../payroll-base/payroll-base.component";
import {FormButtonClickOutput} from "../../../../../shared/form/form.component";
import {PageModel} from "../../../../../@core/model/dto/formModel";
import {TitleModel} from "arb-design-library/model/title.model";
import {ButtonModel} from "arb-design-library/model/button.model";
import {SummaryModel} from "arb-design-library/model/summary.model";
import {ResultModal} from "../../../../../@core/model/dto/result.modal";
import {
  ReInitiateRejectedRecordsInitReq
} from "../../../../../@core/model/rest/payroll/wps-plus/request-open-account/re-initiate-rejected-records-init-req";
import {
  ReInitiateRejectedRecordsInitRes,
  WPSPlusEmployeeBatchDTO
} from "../../../../../@core/model/rest/payroll/wps-plus/request-open-account/re-initiate-rejected-records-init-res";
import {batchNameForm, employeeForm} from "./re-initiate-employee-controls";
import {Utils} from "../../../../../@core/utility/Utils";
import {KeyValueModel} from "../../../../../@core/model/rest/common/key-value.model";
import {PayrollPagesNames} from "../../../payroll-pages-names";
import {
  ReInitiateRejectedRecordsValidateReq
} from "../../../../../@core/model/rest/payroll/wps-plus/request-open-account/re-initiate-rejected-records-validate-req";
import {SummarySectionModel} from "arb-design-library/model/summary-section.model";
import {RequestValidate} from "../../../../../@core/model/rest/common/otp.model";
import {ConfirmOpenAccountReq} from "../../../../../@core/model/rest/payroll/wps-plus/request-open-account/confirm-open-account-req";

@Component({
  selector: 'app-re-initiate-employee',
  templateUrl: './wps-plus-re-initiate-employee.component.html'
})
export class WpsPlusReInitiateEmployeeComponent extends PayrollBaseComponent {
  pages!: PageModel[];
  pageTitle: TitleModel = {
    id: "ReInitiateRejectedEmployee",
    title: "payroll.payroll-wps-plus.open-account.re-initiate-rejected-records.page-name",
    stepper: {steps: ['', '', ''], stepText: 'public.step', ofText: 'public.of', stepCounter: 1}
  };
  nextButton: ButtonModel = {id: 'Next', type: "primary", text: 'public.next', isDisable: true}
  backButton: ButtonModel = {id: 'Back', type: "secondary", text: 'public.back'};
  confirmButton: ButtonModel = {id: 'Confirm', type: "primary", text: 'public.confirm'}
  startButtons: ButtonModel[] = [this.cancelButton];
  endButtons: ButtonModel[] = [this.nextButton];
  summary!: SummaryModel;
  result!: ResultModal;
  initResponse!: ReInitiateRejectedRecordsInitRes
  private validatRequestTopenAccount: any;

  constructor() {
    super()
    if (!history.state.data) {
      void this.router.navigate([PayrollPagesNames.PAYROLL, PayrollPagesNames.RECORDS_DETAILS, this.getPayrollType()])
    } else {
      this.getData()
    }

  }

  getData() {
    this.wpsPlusPayrollService.reInitiateRejectedRecordsInit(this.buildInitReq()).subscribe((res: ReInitiateRejectedRecordsInitRes) => {
        if (!Utils.isEmptyOrNullList(res.employeesList.items)) {
          this.initResponse = res;
          this.modelAndListService.getModel('HumanTitle').subscribe(prop => {
            const keyValueModels: KeyValueModel[] = Utils.getModelList(prop.HumanTitle)
            this.pages = [new PageModel(1, batchNameForm())]
            this.initResponse.employeesList.items.forEach((emp: WPSPlusEmployeeBatchDTO, index: number) => {
              this.pages[0].addForm(employeeForm((index + 1).toString(), emp, keyValueModels))
            })
          })
        } else {
          void this.router.navigate([PayrollPagesNames.PAYROLL, PayrollPagesNames.RECORDS_DETAILS, this.getPayrollType()])
        }
      }
    )
  }

  buildInitReq(): ReInitiateRejectedRecordsInitReq {
    return {
      employees: history.state.data
    }
  }


  onButtonClick(data: FormButtonClickOutput) {
    switch (data.buttonId) {
      case 'DeleteEmployeeFromList':
        this.pages[0].deleteFrom(data.formIndex!, 1)
        break
      case this.backButton.id:
      case this.cancelButton.id:
        this.doBackCklick()
        break
      case this.nextButton.id:
        this.doValidateReq()
        break
      case this.confirmButton.id:
        this.doConfirm()
        break
      case this.dashboardButton.id:
        this.goToDashBoard()
        break
      case this.payrollButton.id:
        this.goBackToPayroll()
        break


    }

  }

  private doBackCklick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 3:
        break
      case 2:
        this.stepperMoveBack(this.pageTitle)
        this.endButtons = [this.cancelButton,this.nextButton]
        this.startButtons = [this.cancelButton]
        break
      case 1:
        void this.router.navigate([PayrollPagesNames.PAYROLL, PayrollPagesNames.RECORDS_DETAILS, this.getPayrollType()])

    }
  }


  private doValidateReq() {
    this.wpsPlusPayrollService.reInitiateRejectedRecordsValidate(this.buildValidateReq()).subscribe((res) => {
      this.validatRequestTopenAccount = res
      this.summary = this.fillSummary()
      this.stepperMoveNext(this.pageTitle)
      this.endButtons = [this.confirmButton]
      this.startButtons = [this.backButton]
    })
  }

  private buildValidateReq(): ReInitiateRejectedRecordsValidateReq {
    let request: ReInitiateRejectedRecordsValidateReq = {
      listEmployees: [],
      batchName: this.pages[0].forms[0].controls['batchName'].value
    };
    this.initResponse.employeesList.items.forEach((emp: WPSPlusEmployeeBatchDTO, index: number) => {
      index += 1
      emp.nickName = this.pages[0].forms[index].controls['nickName'].value
      emp.civilianId = this.pages[0].forms[index].controls['civilianId'].value
      emp.contractStartDate = Utils.getDateFormatted(this.pages[0].forms[index].controls['contractStartDate'].value, 'yyyy-MM-dd')
      emp.title = this.pages[0].forms[index].controls['title'].value.key
      emp.employeeNumber = this.pages[0].forms[index].controls['employeeNumber'].value
      emp.birthDate = Utils.getDateFormatted(this.pages[0].forms[index].controls['birthDate'].value, 'yyyy-MM-dd')
      emp.mobile = this.pages[0].forms[index].controls['mobile'].value
      request.listEmployees.push(emp)
    })

    return request
  }

  fillSummary(): SummaryModel {
    let sections: SummarySectionModel[] = [];
    if (!Utils.isEmptyOrNullList(this.validatRequestTopenAccount.batchContainer.toProcess)) {
      sections.push({
        title: {id: "batchName", title: "BatchName", type: "Section"},
        items: [{title : this.validatRequestTopenAccount.batchContainer.toProcess[0].batchName}]
      })
      this.validatRequestTopenAccount.batchContainer.toProcess.forEach((toProcess: any, index: number) => {
        let number = index + 1
        sections.push({
          title: {id: ("newEmployee" + number), title: ("New Employee# " + number)},
          items: [
            {title: "name", subTitle: toProcess.nickName},
            {title: "number", subTitle: toProcess.employeeNumber},
            {title: "id", subTitle: toProcess.civilianId},
            {title: "mobile", subTitle: toProcess.mobile},
            {title: "contract", subTitle: toProcess.contractStartDate},
            {title: "dateOfbirth", subTitle: toProcess.birthDate},
            {title: "baiscSalary", subTitle: toProcess.salaryBasic},
            {title: "house", subTitle: this.getNumberValue(toProcess.allowanceHousing)},
            {title: "other", subTitle: this.getNumberValue(toProcess.allowanceOther)},
            {title: "detuction", subTitle: this.getNumberValue(toProcess.deductions)},
            {title: "totalSalary", subTitle: this.getNumberValue(toProcess.salary)}
          ]
        })
      })
      sections.push(Utils.getCurrentLevelAndNextLevelSummarySection(this.translate, this.validatRequestTopenAccount.batchContainer.toProcess[0].futureSecurityLevelsDTOList))
    }
    if (!Utils.isEmptyOrNullList(this.validatRequestTopenAccount.batchContainer.toAuthorize)) {
      sections.push({
        title: {id: "batchName", title: "BatchName", type: "Section"},
        items: [this.validatRequestTopenAccount.batchContainer.toAuthorize[0].batchName]
      })
      this.validatRequestTopenAccount.batchContainer.toAuthorize.forEach((itm: any) => {
        sections.push({
          items: [
            {title: "name", subTitle: itm.nickName},
            {title: "number", subTitle: itm.employeeNumber},
            {title: "id", subTitle: itm.civilianId},
            {title: "mobile", subTitle: itm.mobile},
            {title: "contract", subTitle: itm.contractStartDate},
            {title: "dateOfbirth", subTitle: itm.birthDate},
            {title: "baiscSalary", subTitle: itm.salaryBasic},
            {title: "house", subTitle: itm.allowanceHousing},
            {title: "other", subTitle: itm.allowanceOther},
            {title: "detuction", subTitle: itm.deductions},
            {title: "totalSalary", subTitle: itm.salary}
          ]
        })
      })
      sections.push(Utils.getCurrentLevelAndNextLevelSummarySection(this.translate, this.validatRequestTopenAccount.batchContainer.toAuthorize[0].futureSecurityLevelsDTOList))
    }
    if (!Utils.isEmptyOrNullList(this.validatRequestTopenAccount.batchContainer.notAllowed)) {
      sections.push({
        title: {id: "batchName", title: "BatchName", type: "Section"},
        items: [this.validatRequestTopenAccount.batchContainer.notAllowed[0].batchName]
      })
      this.validatRequestTopenAccount.batchContainer.notAllowed.forEach((itm: any) => {
        sections.push({
          items: [
            {title: "name", subTitle: itm.nickName},
            {title: "number", subTitle: itm.employeeNumber},
            {title: "id", subTitle: itm.civilianId},
            {title: "mobile", subTitle: itm.mobile},
            {title: "contract", subTitle: itm.contractStartDate},
            {title: "dateOfbirth", subTitle: itm.birthDate},
            {title: "baiscSalary", subTitle: itm.salaryBasic},
            {title: "house", subTitle: itm.allowanceHousing},
            {title: "other", subTitle: itm.allowanceOther},
            {title: "detuction", subTitle: itm.deductions},
            {title: "totalSalary", subTitle: itm.salary}
          ]
        })
      })
      sections.push(Utils.getCurrentLevelAndNextLevelSummarySection(this.translate, this.validatRequestTopenAccount.batchContainer.notAllowed[0].futureSecurityLevelsDTOList))
    }


    return {
      title: {
        id: 'SummaryTitle',
      },
      sections: sections
    }
  }


  getNumberValue(value: any): number {
    if (value && value !== '') {
      return Number(Number(value).toFixed(2))
    }
    return 0
  }

  private doConfirm() {
    if (!Utils.isEmptyOrNullList(this.validatRequestTopenAccount.batchContainer.toProcess)) {
      this.verificationService.showVerification(this.validatRequestTopenAccount.generateChallengeAndOTP).subscribe((requestValidate: RequestValidate) => {
        this.subimtConfrim(requestValidate)
      })
    } else {
      this.subimtConfrim()
    }
  }


  subimtConfrim(requestValidate?: RequestValidate) {
    this.wpsPlusPayrollService.reInitiateRejectedRecordsConfirm(this.buildConfirmReq(requestValidate)).subscribe({
      next: () => {
        this.result = this.fillResult()
        this.stepperMoveNext(this.pageTitle)
        this.endButtons = [this.dashboardButton, this.payrollButton]
        this.startButtons = []
      },
      error: (err) => {
        this.result = this.fillResult(err)
        this.stepperMoveNext(this.pageTitle)
        this.endButtons = [this.dashboardButton, this.payrollButton]
        this.startButtons = []
      }
    })
  }

  fillResult(err?: any): ResultModal {
    if (err) {
      return {
        type: 'Error',
        title: err.ErrorResponse.errorDescription,
        summary: undefined
      };
    } else {
      return {
        type: 'Success',
        title: 'public.success-screen',
        subTitle: "public.thank",
        summary: undefined
      };
    }

  }

  private buildConfirmReq(requestValidate?: RequestValidate): ConfirmOpenAccountReq {
    return {
      requestValidate: requestValidate,
      batchList: {
        toProcess: this.validatRequestTopenAccount.batchContainer.toProcess,
        notAllowed: this.validatRequestTopenAccount.batchContainer.notAllowed,
        toAuthorize: this.validatRequestTopenAccount.batchContainer.toAuthorize
      },
      batchName: this.validatRequestTopenAccount.batchName
    };
  }

}
