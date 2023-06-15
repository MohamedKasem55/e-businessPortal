import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormModel, FormResult, PageModel} from "../../../../@core/model/dto/formModel";
import {Subject, takeUntil} from "rxjs";
import {UUID} from "angular2-uuid";
import {FormButtonClickOutput} from "../../../../shared/form/form.component";
import {batchNameForm, newEmployeeForm} from "./employee-add-controls";
import {TitleModel} from "arb-design-library/model/title.model";
import {ButtonModel} from "arb-design-library/model/button.model";
import {SummaryModel} from "arb-design-library/model/summary.model";
import {ResultModal} from "../../../../@core/model/dto/result.modal";
import {PayrollBaseComponent} from "../../payroll-base/payroll-base.component";
import {ValidateOpenAccountReq} from "../../../../@core/model/rest/payroll/wps-plus/request-open-account/validate-open-account-req";
import {SummarySectionModel} from "arb-design-library/model/summary-section.model";
import {Utils} from "../../../../@core/utility/Utils";
import {RequestValidate} from "../../../../@core/model/rest/common/otp.model";
import {ConfirmOpenAccountReq} from "../../../../@core/model/rest/payroll/wps-plus/request-open-account/confirm-open-account-req";
import {KeyValueModel} from "../../../../@core/model/rest/common/key-value.model";


@Component({
  selector: 'app-employee-add',
  templateUrl: './wps-plus-add.component.html'
})
export class WpsPlusEmployeeAddComponent extends PayrollBaseComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>()
  pages: PageModel[] = [];
  pageTitle: TitleModel = {
    id: "addEmployee",
    title: "payroll.employee.addEmployee",
    stepper: {steps: ['', '', ''], stepCounter: 1, stepText: 'public.step', ofText: 'public.of'}
  };

  savePayrollEmployeesButton: ButtonModel = {
    id: "savePayrollEmployees",
    type: "primary",
    text: 'public.save',
    isDisable: true
  }
  addMoreButton: ButtonModel = {
    id: "addMore",
    type: "secondary",
    text: 'payroll.employee.add-more',
    prefixIcon: " arb-icon-add"
  }
  confirmButton: ButtonModel = {
    id: "Confirm",
    text: "public.confirm",
    type: "primary"
  }
  backButton: ButtonModel = {id: "Back", text: "public.back", type: "secondary"}
  endButtons: ButtonModel[] = [this.addMoreButton, this.savePayrollEmployeesButton];
  startButtons: ButtonModel[] = [this.cancelButton];
  summary!: SummaryModel;
  result!: ResultModal;
  private validatRequestTopenAccount: any;
  keyValueModels: KeyValueModel[] = []


  constructor() {
    super()
    this.payrollButton.text = 'payroll.payroll-wps-plus.buttons.go-back-to-wps-plus'
    this.modelAndListService.getModel('HumanTitle').subscribe(prop => {
      this.keyValueModels = Utils.getModelList(prop.HumanTitle)
      this.pages = [new PageModel(1, batchNameForm(), newEmployeeForm(UUID.UUID(), this.keyValueModels))];
      this.pages[0].valueChanges.subscribe(formIdx => {
        this.formChanges(formIdx)
      })
    })
  }


  ngOnInit(): void {
  }


  onButtonClick(event: FormButtonClickOutput) {
    switch (event.buttonId) {
      case 'deleteButton':
        this.pages[0].deleteFrom(event.formIndex!, 1)
        break
      case this.addMoreButton.id:
        this.pages[0].addForm(newEmployeeForm(UUID.UUID(), this.keyValueModels))
        break
      case this.savePayrollEmployeesButton.id:
        this.validateSaveEmployee();
        break
      case this.backButton.id:
      case this.payrollButton.id:
      case this.cancelButton.id:
        this.doBackClick()
        break
      case this.dashboardButton.id:
        this.goToDashBoard();
        break
      case this.confirmButton.id:
        this.confirmRequest();
        break

    }
  }


  validateSaveEmployee(): void {
    let validateRequest: ValidateOpenAccountReq = {
      batchName: "",
      listEmployees: []
    };
    this.pages[0].forms.forEach((f: FormModel) => {
      if (f.id === "batchNameForm") {
        validateRequest.batchName = f.controls['batchNameControl'].value
      } else {
        const emp: any = {
          title: f.controls['title'].value.key,
          birthDate: Utils.getDateFormatted(f.controls['DateOfBirth'].value,'yyyy-MM-dd'),
          contractStartDate: Utils.getDateFormatted(f.controls['contractStartDate'].value,'yyyy-MM-dd'),
          mobile: f.controls['mobileNumber'].value,
          allowanceHousing: this.getNumberValue(f.controls['housingAllowance'].value),
          allowanceOther: this.getNumberValue(f.controls['otherAllowance'].value),
          civilianId: f.controls['civilianId'].value,
          deductions: this.getNumberValue(f.controls['deduction'].value),
          employeeNumber: f.controls['empNumber'].value,
          nickName: f.controls['empName'].value,
          salary: this.calculateTotalSalary(f),
          salaryBasic: this.getNumberValue(f.controls['basicSalary'].value)
        }
        validateRequest.listEmployees.push(emp)
      }

    })
    this.wpsPlusPayrollService.validateRequestToOpenAccount(validateRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.validatRequestTopenAccount = res
          this.summary = this.fillSummary()
          this.stepperMoveNext(this.pageTitle)
          this.endButtons = [this.confirmButton]
          this.startButtons = [this.backButton]
        }

      })

  }


  getNumberValue(value: any): number {
    if (value && value !== '') {
      return Number(Number(value).toFixed(2))
    }
    return 0
  }

  calculateTotalSalary(f: FormModel): number {
    const basicSalary = Number(f.controls['basicSalary']?.value);
    const deduction = Number(f.controls['deduction']?.value);
    const housingAllowance = Number(f.controls['housingAllowance']?.value);
    const otherAllowance = Number(f.controls['otherAllowance']?.value);
    return Number((basicSalary + housingAllowance + otherAllowance - deduction).toFixed(2))
  }

  ngOnDestroy(): void {
    this.destroy$.next(true)
  }

  formChanges(formIndex: number) {
    if (formIndex > 0) {
      const form: FormModel = this.pages[0].forms[formIndex];
      const totalSalary = this.calculateTotalSalary(form)
      form.controls['totalSalary'].controlOptions.subTitle[0].amount = totalSalary.toString()
    }
  }

  fillSummary(): SummaryModel {
    let sections: SummarySectionModel[] = [];
    sections.push({
      title: {id: "batchName", title: "BatchName", type: "Section"},
      items: [{title: this.getControl(this.pages, 0, 0, "batchNameControl").value}]
    })
    if (!Utils.isEmptyOrNullList(this.validatRequestTopenAccount.batchContainer.toProcess)) {
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

  private confirmRequest() {
    if (!Utils.isEmptyOrNullList(this.validatRequestTopenAccount.batchContainer.toProcess)) {
      this.verificationService.showVerification(this.validatRequestTopenAccount.generateChallengeAndOTP).subscribe((requestValidate: RequestValidate) => {

        this.subimtConfrim(requestValidate)
      })
    } else {
      this.subimtConfrim()
    }
  }

  subimtConfrim(requestValidate?: RequestValidate) {
    this.wpsPlusPayrollService.confirmRequestToOpenAccount(this.buildConfirmReq(requestValidate)).subscribe({
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

  private doBackClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 3:
        this.goBackToPayroll()
        break
      case 2:
        this.stepperMoveBack(this.pageTitle)
        this.endButtons = [this.addMoreButton,this.savePayrollEmployeesButton]
        this.startButtons = [this.cancelButton]
        break
      case 1:
        this.goBackToPayroll()
        break
    }

  }
}
