import {Component, OnInit} from '@angular/core';
import {ButtonModel} from "arb-design-library/model/button.model";
import {SummarySectionModel} from "arb-design-library/model/summary-section.model";
import {SummaryModel} from "arb-design-library/model/summary.model";
import {TitleModel} from "arb-design-library/model/title.model";
import {FormResult, PageModel} from "../../../../@core/model/dto/formModel";
import {ResultModal} from "../../../../@core/model/dto/result.modal";
import {RequestValidate} from "../../../../@core/model/rest/common/otp.model";
import {EmployeePayroll} from "../../../../@core/model/rest/payroll/emoployee/Employee-payroll";
import {SalaryPaymentConfirmReq} from "../../../../@core/model/rest/payroll/wps/generate-payroll-file/salary-payment-confirm-req";
import {
  SalaryPaymentDetails,
  SalaryPaymentInitRes
} from "../../../../@core/model/rest/payroll/wps/generate-payroll-file/salary-payment-init-res";
import {SalaryPaymentValidateReq} from "../../../../@core/model/rest/payroll/wps/generate-payroll-file/salary-payment-validate-req";
import {SalaryPaymentValidateRes} from "../../../../@core/model/rest/payroll/wps/generate-payroll-file/salary-payment-validate-res";
import {HijriDateFormatPipe} from "../../../../@core/pipe/hijra-date-format-pipe";
import {Utils} from "../../../../@core/utility/Utils";
import {FormButtonClickOutput} from "../../../../shared/form/form.component";
import {PayrollBaseComponent} from "../../payroll-base/payroll-base.component";
import {PayrollPagesNames} from "../../payroll-pages-names";
import {EmployeeSummaryTableHeader, generatePayrollFileForm, paymentPurposes} from "./generate-payroll-file-controls";
import {KeyValueModel} from "../../../../@core/model/rest/common/key-value.model";
import {TableControl} from "../../../../@core/model/dto/control/table-control";
import {TableInputChangeModel, TableUpdateValue} from "arb-design-library/model/table-input-change.model";
import { AuthenticationUtils } from 'app/@core/utility/authentication-utils';


@Component({
  selector: 'app-generate-payroll-file',
  templateUrl: './generate-payroll-file.component.html'
})
export class GeneratePayrollFileComponent extends PayrollBaseComponent implements OnInit {
  private nextButton: ButtonModel = {id: "Next", type: "primary", text: "public.next", isDisable: true};
  private backButton: ButtonModel = {id: "Back", type: "secondary", text: "public.back"};
  override payrollButton: ButtonModel = {
    id: PayrollPagesNames.PAYROLL,
    text: 'payroll.payroll-wps.buttons.go-back-to-wps',
    type: "primary"
  };
  private confirmButton: ButtonModel = {id: "Confirm", type: "primary", text: "public.confirm"}
  override pendingActionsButton: ButtonModel = {id: "goToPendingActions", text: 'public.go-to-pending-actions', type: "primary"};
  pages!: PageModel[];
  pageTitle: TitleModel = {
    id: "GeneratePayrollFile",
    title: "payroll.payroll-wps.generate-payroll-file.page-name",
    stepper: {
      steps: ["", "", ""],
      stepCounter: 1,
      stepText: "public.step",
      ofText: "public.of"
    }
  };
  startButtons: ButtonModel[] = [this.cancelButton];
  endButtons: ButtonModel[] = [this.nextButton];
  summary!: SummaryModel;
  result!: ResultModal;
  employeeList: EmployeePayroll[];
  salaryPaymentInitRes!: SalaryPaymentInitRes
  salaryPaymentValidateRes!: SalaryPaymentValidateRes;
  showPendingActions: boolean = AuthenticationUtils.showPendingActions;
  private props: any[] = [];
  private updatedData: any;

  constructor() {
    super()
    this.employeeList = history.state.employeeList;
    if (!this.employeeList) {
      this.goBackToPayroll()
    }
    this.pages = [new PageModel(1, generatePayrollFileForm())]
    this.getData();
  }

  ngOnInit(): void {
    this.modelAndListService.getModel("payrollPaymentPurpose").subscribe(prop => {
      this.props = this.objectToKeyValue(prop.payrollPaymentPurpose)
      this.props = this.props.filter((itm: any) => {
        return paymentPurposes.includes(itm.key)
      })
    })

  }

  objectToKeyValue(object: any): KeyValueModel[] {
    let data: KeyValueModel[] = [];
    Object.keys(object).forEach((key) => {
      data.push({key, value: object[key]});
    });
    return data;
  }

  onButtonClick(data: FormButtonClickOutput) {
    switch (data.buttonId) {
      case this.nextButton.id:
        this.nextClick();
        break
      case this.confirmButton.id:
        this.nextClick();
        break
      case this.cancelButton.id:
      case this.backButton.id:
      case PayrollPagesNames.PAYROLL:
        this.BackClick();
        break
      case this.pendingActionsButton.id:
        this.router.navigate(['/pendingActions/pending-actions-list']).then(() => {
        });
        break
      case 'upload-file':
        this.router.navigate(["/payroll/upload-file/wps"]).then(() => {
        });
        break;
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

  getData() {
    this.wpsService.salaryPaymentInit.subscribe((res) => {
      this.salaryPaymentInitRes = res;


      this.getControl(this.pages, 0, 0, "debitAccount").controlOptions.options = res.accountList;
      if (res.salaryPaymentDetails.molId) {
        this.getControl(this.pages, 0, 0, "molId").setValue(res.salaryPaymentDetails.molId)
        this.getControl(this.pages, 0, 0, "molId").disable()
      }

      this.getControl(this.pages, 0, 0, "paymentPurpose").controlOptions.options = this.props;
      if (res.salaryPaymentDetails.remarks !== "") {
        this.getControl(this.pages, 0, 0, "Remarks").setValue(res.salaryPaymentDetails.remarks)
      }
      this.updatedData = structuredClone(this.employeeList);
      const tableControl = this.pages[0].forms[0].controls['employeeList']
      tableControl.controlOptions.data = this.employeeList;
      (tableControl as TableControl).onInputChange.subscribe((res: TableInputChangeModel) => {
        this.onSelectChange(res)
      })

      if (this.salaryPaymentInitRes.juridicalState !== '0014') {
        this.getControl(this.pages, 0, 0, "paymentPurpose").disable()
        this.getControl(this.pages, 0, 0, "paymentPurpose").setValue({key: paymentPurposes[0]})
      }


    })


  }

  onSelectChange(employeePayrolls: TableInputChangeModel) {
    let salaryBasic = employeePayrolls.row.hasOwnProperty("salaryBasic_NewValue") ? Number(employeePayrolls.row["salaryBasic_NewValue"]) : Number(employeePayrolls.row["salaryBasic"]);
    let allowanceHousing = employeePayrolls.row.hasOwnProperty("allowanceHousing_NewValue") ? Number(employeePayrolls.row["allowanceHousing_NewValue"]) : Number(employeePayrolls.row["allowanceHousing"]);
    let allowanceOther = employeePayrolls.row.hasOwnProperty("allowanceOther_NewValue") ? Number(employeePayrolls.row["allowanceOther_NewValue"]) : Number(employeePayrolls.row["allowanceOther"]);
    let deductions = employeePayrolls.row.hasOwnProperty("deductions_NewValue") ? Number(employeePayrolls.row["deductions_NewValue"]) : Number(employeePayrolls.row["deductions"]);
    let name = employeePayrolls.row.hasOwnProperty("name_NewValue") ? employeePayrolls.row["name_NewValue"] : employeePayrolls.row["name"];
    let employeeReference = employeePayrolls.row.hasOwnProperty("employeeReference_NewValue") ? employeePayrolls.row["employeeReference_NewValue"] : employeePayrolls.row["employeeReference"];
    let account = employeePayrolls.row.hasOwnProperty("account_NewValue") ? employeePayrolls.row["account_NewValue"] : employeePayrolls.row["account"];
    let departmentId = employeePayrolls.row.hasOwnProperty("departmentId_NewValue") ? employeePayrolls.row["departmentId_NewValue"] : employeePayrolls.row["departmentId"];
    let civilianId = employeePayrolls.row.hasOwnProperty("civilianId_NewValue") ? employeePayrolls.row["civilianId_NewValue"] : employeePayrolls.row["civilianId"];
    let remarks = employeePayrolls.row.hasOwnProperty("remarks_NewValue") ? employeePayrolls.row["remarks_NewValue"] : employeePayrolls.row["remarks"];


    let value = salaryBasic + allowanceHousing + allowanceOther - deductions;

    const tableControl = <TableControl>this.pages[0].forms[0].controls['employeeList'];
    let values: TableUpdateValue = {
      value,
      id: employeePayrolls.id,
      column: "salary"
    };
    tableControl.updateValues([values]);
    this.updatedData.forEach((item: any) => {
      if (item['employeePk'] == employeePayrolls.id) {
        item[employeePayrolls.column] = employeePayrolls.row[employeePayrolls.column];
        item["salary"] = value
        item["amount"] = value
        item["salaryBasic"] = salaryBasic
        item["allowanceHousing"] = allowanceHousing
        item["allowanceOther"] = allowanceOther
        item["deductions"] = deductions
        item["name"] = name
        item["employeeReference"] = employeeReference
        item["account"] = account
        item["departmentId"] = departmentId
        item["civilianId"] = civilianId
        item["remarks"] = remarks

      }
    });
    tableControl.updateValues(this.updatedData);
  }

  private BackClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 3:
        this.goBackToPayroll()
        break
      case 2:
        this.stepperMoveBack(this.pageTitle);
        this.startButtons = [this.backButton]
        this.endButtons = [this.nextButton]
        // @ts-ignore
        this.alertModel = undefined;
        break
      case 1:
        this.goBackToPayroll()
        break
      default:
        this.goBackToPayroll()
        break
    }
  }

  nextClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.doValidateReq();
        this.stepperMoveNext(this.pageTitle)
        break;
      case 2:
        this.doConfirmReq();
        break;
      case 3:
        break;
    }
  }
  
  onDateSelect() {
    this.getControl(this.pages, 0, 0, "paymentDate").valueChanges.subscribe(data => {
      if (data.value !== "") {
        this.getControl(this.pages, 0, 0, "hijriDate").setValue(
          new HijriDateFormatPipe().transform(
            new Date(data.value.year, data.value.month, data.value.day), 'dd/MM/yyyy')
        )
      }
    })
  }

  private doValidateReq() {
    this.wpsService.salaryPaymentValidate(this.createSalaryPaymentValidateReq()).subscribe((res: SalaryPaymentValidateRes) => {
      this.salaryPaymentValidateRes = res
      if (!Utils.isEmptyOrNullList(res.errors)) {
        this.alertModel = {
          id: 'alert',
          type: "Critical",
          message: res.errors,
          showClose: false,
        }
      } else {
        if (!Utils.isEmptyOrNullList(res.warnings)) {
          this.alertModel = {
            id: 'alert',
            type: "Normal",
            message: res.warnings,
            showClose: false,
          }
        }
        this.summary = this.fillSummary()
        this.startButtons = [this.backButton]
        this.endButtons = [this.confirmButton]
      }
    })
  }

  createSalaryPaymentValidateReq(): SalaryPaymentValidateReq {
    let salaryPaymentDetails: SalaryPaymentDetails = this.salaryPaymentInitRes.salaryPaymentDetails;
    salaryPaymentDetails.batchName = this.getControl(this.pages, 0, 0, "batchName").value
    salaryPaymentDetails.remarks = this.getControl(this.pages, 0, 0, "Remarks").value
    salaryPaymentDetails.paymentDate = Utils.getDateFormatted(this.getControl(this.pages, 0, 0, "paymentDate").value, 'yyyy-MM-dd')
    salaryPaymentDetails.customerReference = this.getControl(this.pages, 0, 0, "customerRef").value
    salaryPaymentDetails.molId = this.getControl(this.pages, 0, 0, "molId").value
    salaryPaymentDetails.paymentPurpose = this.getControl(this.pages, 0, 0, "paymentPurpose").value.key
    return {
      accountNumber: this.getControl(this.pages, 0, 0, "debitAccount").value.fullAccountNumber,
      salaryPaymentDetails: salaryPaymentDetails,
      selectedEmployeesList: this.updatedData
    }
  }


  fillSummary(): SummaryModel {
    let section: SummarySectionModel[] = []
    section.push({
      items: [
        {
          title: "payroll.payroll-wps.generate-payroll-file.summary.account",
          subTitle: this.getControl(this.pages, 0, 0, "debitAccount").value.fullAccountNumber
        },
        {
          title: "payroll.payroll-wps.generate-payroll-file.summary.account-nickname",
          subTitle: this.getControl(this.pages, 0, 0, "debitAccount").value.alias
        },
        {
          title: "payroll.payroll-wps.generate-payroll-file.summary.batch-name",
          subTitle: this.salaryPaymentValidateRes.salaryPaymentDetails.batchName
        },
        {
          title: "payroll.payroll-wps.generate-payroll-file.summary.payment-date",
          subTitle: this.salaryPaymentValidateRes.salaryPaymentDetails.paymentDate
        },
        {
          title: "payroll.payroll-wps.generate-payroll-file.summary.hijri-date",
          subTitle: this.getControl(this.pages, 0, 0, "hijriDate").value
        },
        {
          title: "payroll.payroll-wps.generate-payroll-file.summary.customer-reference",
          subTitle: this.salaryPaymentValidateRes.salaryPaymentDetails.customerReference
        },
        {
          title: "payroll.payroll-wps.generate-payroll-file.summary.mol-id",
          subTitle: this.salaryPaymentValidateRes.salaryPaymentDetails.molId
        },
        {
          title: "payroll.payroll-wps.generate-payroll-file.summary.payment-purpose",
          subTitle: this.props.find(x => this.salaryPaymentValidateRes.salaryPaymentDetails.paymentPurpose!).value
        },
        {
          title: "payroll.payroll-wps.generate-payroll-file.summary.remarks",
          subTitle: this.salaryPaymentValidateRes.salaryPaymentDetails.remarks
        },
        Utils.getCurrentLevelSummaryItem(this.translate, this.salaryPaymentValidateRes.salaryPaymentDetails.futureSecurityLevelsDTOList!),
        Utils.getNextLevelSummaryItem(this.translate, this.salaryPaymentValidateRes.salaryPaymentDetails.futureSecurityLevelsDTOList!)
      ],
      table: {
        data: this.updatedData,
        maxDisplayRow: 5,
        headers: EmployeeSummaryTableHeader,
        columnId: "civilianId",
        exportFileName: "summaryEmployeeFile",
        isDisabled: true
      }
    });
    section.push({
      title: {
        id: "summaryAndFees-generate-payroll-file-summary",
        title: "payroll.payroll-wps.generate-payroll-file.summary.summary-and-fees",
      },
      items: [
        {
          title: "payroll.payroll-wps.generate-payroll-file.summary.total-amount-rajhi",
          subTitle: (this.salaryPaymentValidateRes.salaryPaymentDetails.totalNumRajhi!).toString()
        },
        {
          title: "payroll.payroll-wps.generate-payroll-file.summary.total-fees-rajhi",
          subTitle: (this.salaryPaymentValidateRes.salaryPaymentDetails.totalFeesRajhi!).toString()
        },
        {
          title: "payroll.payroll-wps.generate-payroll-file.summary.count-rajhi",
          subTitle: (this.salaryPaymentValidateRes.salaryPaymentDetails.numRajhiTransfers!).toString()
        },
        {
          title: "payroll.payroll-wps.generate-payroll-file.summary.total-amount-local",
          subTitle: (this.salaryPaymentValidateRes.salaryPaymentDetails.totalNumNonRajhi!).toString()
        },
        {
          title: "payroll.payroll-wps.generate-payroll-file.summary.total-fees-local",
          subTitle: (this.salaryPaymentValidateRes.salaryPaymentDetails.totalFeesNonRajhi!).toString()
        },
        {
          title: "payroll.payroll-wps.generate-payroll-file.summary.count-local",
          subTitle: (this.salaryPaymentValidateRes.salaryPaymentDetails.numNonRajhiTransfers!).toString()
        },
        {
          title: "payroll.payroll-wps.generate-payroll-file.summary.total-amount",
          subTitle: (this.salaryPaymentValidateRes.salaryPaymentDetails.totalAmount!).toString()
        },
        {
          title: "payroll.payroll-wps.generate-payroll-file.summary.total-fees",
          subTitle: (Number(Number(this.salaryPaymentValidateRes.salaryPaymentDetails.totalFeesRajhi) + Number(this.salaryPaymentValidateRes.salaryPaymentDetails.totalFeesNonRajhi)).toFixed(2))
        },
        {
          title: "payroll.payroll-wps.generate-payroll-file.summary.total-count",
          subTitle: (this.salaryPaymentValidateRes.salaryPaymentDetails.numEmployees!).toString()
        },
        {
          title: "payroll.payroll-wps.generate-payroll-file.summary.subtotal-amount",
          subTitle: (this.salaryPaymentValidateRes.salaryPaymentDetails.totalEstimated!).toString()
        },
      ]
    })
    return {
      sections: section
    };
  }

  private doConfirmReq() {
    if (this.salaryPaymentValidateRes.generateChallengeAndOTP) {
      this.verificationService.showVerification(this.salaryPaymentValidateRes.generateChallengeAndOTP).subscribe((requestValidate: RequestValidate) => {
        this.confirmSalaryPayment(requestValidate)
      })
    } else {
      this.confirmSalaryPayment()
    }
  }

  confirmSalaryPayment(requestValidate?: RequestValidate) {
    this.wpsService.salaryPaymentConfirm(this.buildReqSalaryPaymentConfirm(requestValidate)).subscribe({
      next: (res) => {
        this.result = this.fillResult()
        this.stepperMoveNext(this.pageTitle)
        this.startButtons = [];
        this.endButtons = res.fileName ? [this.dashboardButton, this.payrollButton] : [this.pendingActionsButton, this.payrollButton];
        // @ts-ignore
        this.alertModel = undefined
      },
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

  buildReqSalaryPaymentConfirm(requestValidate?: RequestValidate): SalaryPaymentConfirmReq {
    return {
      selectedEmployeeList: this.updatedData,
      salaryPaymentDetails: this.salaryPaymentValidateRes.salaryPaymentDetails,
      requestValidate: requestValidate
    }
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
        title: "payroll.payroll-wps.generate-payroll-file.summary.success-message",
        subTitle: "public.thank",
        type: "Success",
        summary: undefined
      };
    }
  }
}
