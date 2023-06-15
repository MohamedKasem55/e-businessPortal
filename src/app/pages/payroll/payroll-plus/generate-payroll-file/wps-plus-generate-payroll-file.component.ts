import {Component, OnInit} from '@angular/core';
import {FormButtonClickOutput} from "../../../../shared/form/form.component";
import {FormResult, PageModel} from "../../../../@core/model/dto/formModel";
import {TitleModel} from "arb-design-library/model/title.model";
import {ButtonModel} from "arb-design-library/model/button.model";
import {SummaryModel} from "arb-design-library/model/summary.model";
import {ResultModal} from "../../../../@core/model/dto/result.modal";
import {PayrollBaseComponent} from "../../payroll-base/payroll-base.component";
import {Utils} from "../../../../@core/utility/Utils";
import {generateSalaryFileForm, SummaryEmployeeTableHeader} from "./wps-plus-generate-payroll-file-controls";
import {HijriDateFormatPipe} from "../../../../@core/pipe/hijra-date-format-pipe";
import {TableControl} from "../../../../@core/model/dto/control/table-control";
import {TableInputChangeModel, TableUpdateValue} from "arb-design-library/model/table-input-change.model";
import {TableButtonOutputModel} from "arb-design-library/model/table-button-output.model";
import {SalaryPaymentsValidateReq} from "../../../../@core/model/rest/payroll/wps-plus/salary-payment/salary-payments-validate-req";
import {SalaryPaymentsInitRes} from "../../../../@core/model/rest/payroll/wps-plus/salary-payment/salary-payments-init-res";
import {SalaryPaymentsValidateRes} from "../../../../@core/model/rest/payroll/wps-plus/salary-payment/salary-payments-validate-res";
import {WPSSalaryPaymentDetailsDSO} from "../../../../@core/model/rest/payroll/upload-file/wpssalary-payment-details-dso";
import {SummarySectionModel} from "arb-design-library/model/summary-section.model";
import {SalaryPaymentsConfirmReq} from "../../../../@core/model/rest/payroll/wps-plus/salary-payment/salary-payments-confirm-req";
import {RequestValidate} from "../../../../@core/model/rest/common/otp.model";
import {AuthenticationUtils} from "../../../../@core/utility/authentication-utils";

@Component({
  selector: 'app-generate-payroll-file',
  templateUrl: './wps-plus-generate-payroll-file.component.html'
})
export class WpsPlusGeneratePayrollFileComponent extends PayrollBaseComponent implements OnInit {
  pages: PageModel[] = [];
  pageTitle: TitleModel = {
    id: "",
    title: "",
    type: "Page",
    stepper: {
      steps: ['', '', ''],
      stepCounter: 1,
      stepText: "public.step",
      ofText: "public.of"
    }
  };
  private nextButton: ButtonModel = {id: "Next", type: "primary", text: "public.next", isDisable: true};
  private backButton: ButtonModel = {id: "Back", type: "secondary", text: "public.back"};
  private confirmButton: ButtonModel = {id: "Confirm", type: "primary", text: "public.confirm"}
  startButtons: ButtonModel[] = [this.cancelButton];
  endButtons: ButtonModel[] = [this.nextButton];
  summary!: SummaryModel;
  result!: ResultModal;
  private props: any;
  updatedData!: any;
  private salaryPaymentsInitRes!: SalaryPaymentsInitRes;
  private salaryPaymentsValidateRes!: SalaryPaymentsValidateRes;

  constructor() {
    super()
    if (!history.state.selectedRows) {
      this.goBackToPayroll()
    }
    Utils.setBreadcrumb([])
    this.payrollButton.text = 'payroll.payroll-wps-plus.buttons.go-back-to-wps-plus'
    this.pages.push(new PageModel(1, generateSalaryFileForm()))
    this.copyFields(history.state.selectedRows)
    this.getData()
  }

  ngOnInit(): void {
    this.modelAndListService.getModel("payrollPaymentPurpose").subscribe(prop => {
      this.props = prop;
    });
  }

  onButtonClick(data: FormButtonClickOutput) {
    switch (data.buttonId) {
      case this.backButton.id:
      case this.cancelButton.id:
      case this.payrollButton.id:
        this.doBackClick()
        break
      case this.nextButton.id:
        this.doValidateReq();
        break
      case this.confirmButton.id:
        this.doConfirmReq();
        break
      case this.dashboardButton.id:
        this.goToDashBoard();
        break
    }

  }

  override onResultChanged(data: FormResult[]) {
    let valid = true;
    data.forEach(item => {
      valid = valid && item.valid;
    })
    this.endButtons[0].isDisable = !valid;
    this.onDateSelect()
  }

  private onDateSelect() {
    this.getControl(this.pages, 0, 0, "paymentDate").valueChanges.subscribe(data => {
      if (data.value !== "") {
        this.getControl(this.pages, 0, 0, "hijriDate").setValue(
          new HijriDateFormatPipe().transform(
            new Date(data.value.year, data.value.month, data.value.day), 'dd/MM/yyyy')
        )
      }
    })
  }

  private getData() {
    this.wpsPlusPayrollService.salaryPaymentsInit.subscribe(res => {
      this.salaryPaymentsInitRes = res
      let PaymentPurpose = this.props.payrollPaymentPurpose[this.salaryPaymentsInitRes.salaryPaymentDetails.paymentPurpose!]
        this.getControl(this.pages, 0, 0, "debitAccount").controlOptions.options = this.salaryPaymentsInitRes.accountList;
        this.getControl(this.pages, 0, 0, "molId").setValue(this.salaryPaymentsInitRes.salaryPaymentDetails.molId)
        this.getControl(this.pages, 0, 0, "paymentPurpose").setValue(PaymentPurpose)
        if (this.salaryPaymentsInitRes.salaryPaymentDetails.remarks !== "") {
          this.getControl(this.pages, 0, 0, "Remarks").setValue(this.salaryPaymentsInitRes.salaryPaymentDetails.remarks)
        }
        this.getControl(this.pages, 0, 0, "molId").disable()
        this.getControl(this.pages, 0, 0, "paymentPurpose").disable()
        history.state.selectedRows.forEach((emp: any) => {
          emp.currencyCode = 'SAR'
        })
        this.getControl(this.pages, 0, 0, "employeeList").controlOptions.data = history.state.selectedRows;
        this.getControl(this.pages, 0, 0, "employeeList").controlOptions.selectedValues = history.state.selectedRows;

        (this.getControl(this.pages, 0, 0, "employeeList") as TableControl).onInputChange.subscribe((res: TableInputChangeModel) => {
          this.onSelectChange(res)
        });

        (this.getControl(this.pages, 0, 0, "employeeList") as TableControl).buttonClicked.subscribe((data: TableButtonOutputModel) => {
          history.state.selectedRows.forEach((item: any, index: number) => {
            if (item.uniqueEmployeeKey === data.row.uniqueEmployeeKey) history.state.selectedRows.splice(index, 1);
          });
          this.getControl(this.pages, 0, 0, "employeeList").setValue(history.state.selectedRows)
          if (Utils.isEmptyOrNullList(history.state.selectedRows)) {
            this.goBackToPayroll()
          }
        });


    });
  }

  onSelectChange(employeePayrolls: TableInputChangeModel) {
    let salaryBasic = employeePayrolls.row.hasOwnProperty("salaryBasic_NewValue") ? Number(employeePayrolls.row["salaryBasic_NewValue"]) : Number(employeePayrolls.row["salaryBasic"]);
    let allowanceHousing = employeePayrolls.row.hasOwnProperty("allowanceHousing_NewValue") ? Number(employeePayrolls.row["allowanceHousing_NewValue"]) : Number(employeePayrolls.row["allowanceHousing"]);
    let allowanceOther = employeePayrolls.row.hasOwnProperty("allowanceOther_NewValue") ? Number(employeePayrolls.row["allowanceOther_NewValue"]) : Number(employeePayrolls.row["allowanceOther"]);
    let deductions = employeePayrolls.row.hasOwnProperty("deductions_NewValue") ? Number(employeePayrolls.row["deductions_NewValue"]) : Number(employeePayrolls.row["deductions"]);


    let value = salaryBasic + allowanceHousing + allowanceOther - deductions;

    const tableControl = <TableControl>this.getControl(this.pages, 0, 0, "employeeList");
    let values: TableUpdateValue = {
      value,
      id: employeePayrolls.id,
      column: "salary"
    };
    tableControl.updateValues([values]);
    this.updatedData.forEach((item: any) => {
      if (item['uniqueEmployeeKey'] == employeePayrolls.id) {
        item[employeePayrolls.column] = employeePayrolls.row[employeePayrolls.column];
        item["salary"] = value
        item["amount"] = value
        item["salaryBasic"] = salaryBasic
        item["allowanceHousing"] = allowanceHousing
        item["allowanceOther"] = allowanceOther
        item["deductions"] = deductions
      }
    });
    tableControl.updateValues(this.updatedData);
  }

  private doBackClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 2:
        this.stepperMoveBack(this.pageTitle)
        this.endButtons=[this.nextButton]
        this.startButtons=[this.cancelButton]
        if (this.alertModel) {
          // @ts-ignore
          this.alertModel = undefined
        }
        break
      case 1:
      case 3:
        this.goBackToPayroll()
        break

    }
  }

  private doValidateReq() {
    // @ts-ignore
    this.alertModel = undefined
    this.wpsPlusPayrollService.salaryPaymentsValidate(this.buildRequestSalaryPaymentsValidate()).subscribe((res: SalaryPaymentsValidateRes) => {
      if (res) {
        this.salaryPaymentsValidateRes = res
        if (!Utils.isEmptyOrNullList(this.salaryPaymentsValidateRes.errors)) {
          let message = this.salaryPaymentsValidateRes.errors.join(', ')
          this.alertModel = {
            id: 'errors',
            type: 'Critical',
            title: 'public.error',
            message: message
          }
        } else {
          if (!Utils.isEmptyOrNullList(this.salaryPaymentsValidateRes.warnings)) {
            let message = this.salaryPaymentsValidateRes.warnings.join(', ')
            this.alertModel = {
              id: 'errors',
              type: 'Normal',
              title: 'public.error',
              message: message
            }
          }
          this.summary = this.fillSummary()
          this.stepperMoveNext(this.pageTitle)
          this.startButtons = [this.backButton]
          this.endButtons = [this.confirmButton]
        }
      }
    })
  }

  buildRequestSalaryPaymentsValidate(): SalaryPaymentsValidateReq {
    let salaryPaymentDetails: WPSSalaryPaymentDetailsDSO = this.salaryPaymentsInitRes.salaryPaymentDetails;
    salaryPaymentDetails.batchName = this.getControl(this.pages, 0, 0, "batchName").value
    salaryPaymentDetails.remarks = this.getControl(this.pages, 0, 0, "Remarks").value
    salaryPaymentDetails.paymentDate = Utils.getDateFormatted(this.getControl(this.pages, 0, 0, "paymentDate").value, 'yyyy-MM-dd')
    salaryPaymentDetails.customerReference = this.getControl(this.pages, 0, 0, "customerRef").value
    return {
      employees: this.updatedData,
      salaryPaymentDetails: salaryPaymentDetails,
      accountNumber: this.getControl(this.pages, 0, 0, 'debitAccount').value.fullAccountNumber
    }
  }

  private fillSummary(): SummaryModel {
    let sections: SummarySectionModel[] = [];
    sections.push({
      items: [
        {
          title: "payroll.payroll-wps-plus.generate-payroll-file.summary.account",
          subTitle: this.getControl(this.pages, 0, 0, "debitAccount").value.fullAccountNumber
        },
        {
          title: "payroll.payroll-wps-plus.generate-payroll-file.summary.account-nickname",
          subTitle: this.getControl(this.pages, 0, 0, "debitAccount").value.alias
        },
        {
          title: "payroll.payroll-wps-plus.generate-payroll-file.summary.batch-name",
          subTitle: this.salaryPaymentsValidateRes.salaryPaymentDetails.batchName
        },
        {
          title: "payroll.payroll-wps-plus.generate-payroll-file.summary.payment-date",
          subTitle: this.salaryPaymentsValidateRes.salaryPaymentDetails.paymentDate
        },
        {
          title: "payroll.payroll-wps-plus.generate-payroll-file.summary.hijri-date",
          subTitle: this.getControl(this.pages, 0, 0, "hijriDate").value
        },
        {
          title: "payroll.payroll-wps-plus.generate-payroll-file.summary.customer-reference",
          subTitle: this.salaryPaymentsValidateRes.salaryPaymentDetails.customerReference
        },
        {
          title: "payroll.payroll-wps-plus.generate-payroll-file.summary.mol-id",
          subTitle: this.salaryPaymentsValidateRes.salaryPaymentDetails.molId
        },
        {
          title: "payroll.payroll-wps-plus.generate-payroll-file.summary.payment-purpose",
          subTitle: this.props.payrollPaymentPurpose[this.salaryPaymentsValidateRes.salaryPaymentDetails.paymentPurpose!]
        },
        {
          title: "payroll.payroll-wps-plus.generate-payroll-file.summary.remarks",
          subTitle: this.salaryPaymentsValidateRes.salaryPaymentDetails.remarks
        },
        Utils.getCurrentLevelSummaryItem(this.translate, this.salaryPaymentsValidateRes.salaryPaymentDetails.futureSecurityLevelsDTOList!),
        Utils.getNextLevelSummaryItem(this.translate, this.salaryPaymentsValidateRes.salaryPaymentDetails.futureSecurityLevelsDTOList!)
      ],
      table: {
        data: this.updatedData,
        maxDisplayRow: 5,
        headers: SummaryEmployeeTableHeader,
        columnId: "uniqueEmployeeKey",
        exportFileName: "summaryEmployeeFile",
        isDisabled: true
      }
    });
    sections.push({
      title: {
        id: "summaryAndFees-generate-payroll-wps-plus-file-summary",
        title: "payroll.payroll-wps-plus.generate-payroll-file.summary.summary-and-fees",
      },
      items: [
        {
          title: "payroll.payroll-wps-plus.generate-payroll-file.summary.total-amount-payroll-plus",
          subTitle: (this.salaryPaymentsValidateRes.salaryPaymentDetails.totalAmount!).toString()
        },
        {
          title: "payroll.payroll-wps-plus.generate-payroll-file.summary.total-fees-payroll-plus",
          subTitle: (this.salaryPaymentsValidateRes.salaryPaymentDetails.totalFeesRajhi!).toString()
        },
        {
          title: "payroll.payroll-wps-plus.generate-payroll-file.summary.count-payroll-plus",
          subTitle: (this.salaryPaymentsValidateRes.salaryPaymentDetails.numEmployees!).toString()
        },
        {
          title: "payroll.payroll-wps-plus.generate-payroll-file.summary.subtotal-amount",
          subTitle: (this.salaryPaymentsValidateRes.salaryPaymentDetails.totalEstimated!).toString()
        }
      ]
    })
    return {
      sections: sections
    };
  }

  private doConfirmReq() {

    if (this.getControl(this.pages, 0, 0, 'updateSalaryPaymentDetails').value === true) {
      this.wpsPlusPayrollService.confirmModifyEmployees(
        {employees: this.updatedData}
      ).subscribe(() => {
        if (this.salaryPaymentsValidateRes.generateChallengeAndOTP) {
          this.verificationService.showVerification(this.salaryPaymentsValidateRes.generateChallengeAndOTP).subscribe((requestValidate: RequestValidate) => {
            this.sendConfirmRequest(requestValidate)
          })
        } else {
          this.sendConfirmRequest()
        }
      })
    } else {
      if (this.salaryPaymentsValidateRes.generateChallengeAndOTP) {
        this.verificationService.showVerification(this.salaryPaymentsValidateRes.generateChallengeAndOTP).subscribe((requestValidate: RequestValidate) => {
          this.sendConfirmRequest(requestValidate)
        })
      } else {
        this.sendConfirmRequest()
      }
    }


  }

  private buildRequestSalaryPaymentsConfirm(requestValidate?: RequestValidate): SalaryPaymentsConfirmReq {
    return {
      salaryPaymentDetails: this.salaryPaymentsValidateRes.salaryPaymentDetails,
      selectedEmployeeList: this.updatedData,
      requestValidate: requestValidate
    };
  }

  private fillResult(err?: string): ResultModal {
    if (err) {
      return {
        title: err,
        type: "Error",
        summary: undefined
      };
    } else {
      return {
        title: "payroll.payroll-wps-plus.generate-payroll-file.summary.success-message",
        subTitle: "public.thank",
        type: "Success",
        summary: undefined
      };
    }
  }

  private sendConfirmRequest(requestValidate?: RequestValidate) {
    this.wpsPlusPayrollService.salaryPaymentsConfirm(this.buildRequestSalaryPaymentsConfirm(requestValidate)).subscribe({
      next: () => {
        this.result = this.fillResult()
        this.stepperMoveNext(this.pageTitle)
        this.startButtons = [];
        this.endButtons = [this.dashboardButton, this.payrollButton]
        // @ts-ignore
        this.alertModel = undefined
      }
      ,
      error: (err) => {
        this.result = this.fillResult(err.ErrorResponse.errorDescription)
        this.stepperMoveNext(this.pageTitle)
        this.startButtons = [];
        this.endButtons = [this.dashboardButton, this.payrollButton]
        // @ts-ignore
        this.alertModel = undefined
      }
    })
  }


  private copyFields(selectedRows: any) {
    this.updatedData = structuredClone(selectedRows);
    this.updatedData.forEach((item: any) => {
      item['employeeReference'] = item.employeeNumber
    })
  }
}

