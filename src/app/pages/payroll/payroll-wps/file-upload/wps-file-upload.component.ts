import {Component, OnInit} from '@angular/core';
import {PayrollBaseComponent} from "../../payroll-base/payroll-base.component";
import {
  buildFileUploadForm,
  createRequestValidateEmployeeFile,
  createRequestValidateSalaryFile,
  creteUploadWPSEmployeeFileReq,
  creteUploadWPSSalaryFileReq,
  getAlertModel,
  getDocTypeObject,
  listOfProps,
  paymentPurposes
} from "./file-upload-controls";
import {FormResult, PageModel} from "../../../../@core/model/dto/formModel";
import {FormButtonClickOutput} from "../../../../shared/form/form.component";
import {SummarySectionModel} from "arb-design-library/model/summary-section.model";
import {TableHeaderType} from "arb-design-library";
import {ButtonModel} from "arb-design-library/model/button.model";
import {RequestValidate} from "../../../../@core/model/rest/common/otp.model";
import {StatusPipe} from "../../../../@core/pipe/status-pipe";
import {ResultModal} from "../../../../@core/model/dto/result.modal";
import {ResponseException} from "../../../../@core/service/base/responseException";
import {UploadEmployeeFileValidateRes} from "../../../../@core/model/rest/payroll/upload-file/upload-employee-file-validate-res";
import {DocKey} from "./doc-type";
import {UploadSalaryFileValidateRes} from "../../../../@core/model/rest/payroll/upload-file/upload-salary-file-validate-res";
import {Utils} from "../../../../@core/utility/Utils";
import {ValueChangeResult} from "../../../../@core/model/dto/control/control.model";
import {TitleModel} from "arb-design-library/model/title.model";
import {SummaryModel} from "arb-design-library/model/summary.model";

import {KeyValueModel} from "../../../../@core/model/rest/common/key-value.model";

@Component({
  selector: 'app-file-upload',
  templateUrl: './wps-payroll-file-upload.component.html',
  styleUrls: []
})
export class WpsFileUploadComponent extends PayrollBaseComponent implements OnInit {
  private confirmButton: ButtonModel = {
    id: 'Confirm',
    text: 'public.confirm',
    type: 'primary',
  };
  private proceedButton: ButtonModel = {
    id: 'Proceed',
    text: 'public.proceed',
    type: 'primary',
  };

  override payrollButton: ButtonModel = {
    id: "goToPayroll",
    text: 'payroll.payroll-wps.buttons.go-back-to-wps',
    type: "primary"
  }
  override dashboardButton: ButtonModel = {
    id: "goToDashboard",
    text: 'payroll.payroll-wps.buttons.goDashboard',
    type: "secondary"
  }

  private UploadAgainButton: ButtonModel = {
    id: "UploadAgain",
    type: "primary",
    text: "payroll.payroll-wps.upload-files.buttons.re-upload"
  }
  private backButton: ButtonModel = {
    id: "Back",
    type: "secondary",
    text: "public.back"
  }
  pages!: PageModel[];
  pageTitle: TitleModel = {
    id: "FileUploadPage",
    title: "payroll.payroll-wps.upload-files.page-name",
    stepper: {steps: ["", "", ""], stepCounter: 1, stepText: 'public.step', ofText: 'public.of'}
  };
  endButtons: ButtonModel[] = [this.proceedButton];
  startButtons: ButtonModel[] = [this.cancelButton];
  summary!: SummaryModel;
  result!: ResultModal;


  private uploadFileValidateRes!: UploadSalaryFileValidateRes;
  private uploadEmployeeFileValidateRes!: UploadEmployeeFileValidateRes;
  private props!: any[]


  constructor(private statusPipe: StatusPipe) {
    super();
    this.drawPage()
    this.getFileTypes()
    this.checkDocTypeChanges()
  }

  drawPage() {
    this.endButtons[0].isDisable = true
    this.pages = [new PageModel(1, buildFileUploadForm())];
  }

  onButtonClick(formButtonClickOutPut: FormButtonClickOutput) {
    switch (formButtonClickOutPut.buttonId) {
      case'EmployeeFileTemplate':
        this.wpsService.downloadTemplate("WPS_Payroll_employees_list.xlsm")
        break
      case 'SalaryFileTemplate':
        this.wpsService.downloadTemplate("PSH_WPS_Payroll_Upload_File.xlsm")
        break
      case 'Cancel':
      case 'goToPayroll':
      case 'UploadAgain':
      case this.backButton.id:
        this.backClick()
        break
      case 'Proceed':
        this.uploadWPSFiles()
        break
      case 'Confirm':
        this.confirmUploadWPS()
        break
      case this.dashboardButton.id:
        this.goToDashBoard();
        break

    }
  }

  private getFileTypes() {
    this.getControl(this.pages, 0, 0, "fileType").controlOptions.options = getDocTypeObject(this.getPayrollType());
  }

  checkDocTypeChanges() {
    this.getControl(this.pages, 0, 0, "fileType").valueChanges.subscribe((res: ValueChangeResult) => {
      switch (res.value.key) {
        case DocKey.SALARY_FILE:
          this.getControl(this.pages, 0, 0, "batchName").hidden = false;
          this.getControl(this.pages, 0, 0, "batchName").enable();
          this.getControl(this.pages, 0, 0, "paymentPurpose").controlOptions.options = this.props
          this.getControl(this.pages, 0, 0, "paymentPurpose").enable()
          this.getControl(this.pages, 0, 0, "paymentPurpose").hidden = false;
          if (sessionStorage.getItem("JuridicalState") !== "0014") {
            this.getControl(this.pages, 0, 0, "paymentPurpose").hidden = true;
            this.getControl(this.pages, 0, 0, "paymentPurpose").disable()
            this.getControl(this.pages, 0, 0, "paymentPurpose").setValue({key: paymentPurposes[0]})
          }
          break
        default:
          this.getControl(this.pages, 0, 0, "batchName").hidden = true;
          this.getControl(this.pages, 0, 0, "paymentPurpose").disable()
          this.getControl(this.pages, 0, 0, "batchName").disable();
          break
      }
    })
  }


  private backClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 3:
        this.goBackToPayroll()
        break
      case 2:
        this.uploadAgainClick()
        break
      case 1:
        this.goBackToPayroll()
        break
    }
  }


  override onResultChanged(data: FormResult[]): void {
    let valid = true;
    data.forEach(item => {
      valid = valid && item.valid;
    })
    for (const button of this.endButtons) {
      button.isDisable = !valid

    }

  }

  fillSummary() {
    switch (this.getControl(this.pages, 0, 0, "fileType").value.key) {
      case DocKey.SALARY_FILE:
        this.doSalaryFileSummary()
        break
      case DocKey.EMPLOYEE_FILE:
        this.doEmployeeFileSummary()
        break
    }
  }

  private uploadWPSFiles() {
    switch (this.getControl(this.pages, 0, 0, "fileType").value.key) {
      case DocKey.SALARY_FILE:
        this.wpsService.validateUploadSalaryFile(createRequestValidateSalaryFile(
          this.getControl(this.pages, 0, 0, "fileControl").value,
          this.getControl(this.pages, 0, 0, "batchName").value,
          this.getControl(this.pages, 0, 0, "paymentPurpose").value.key)
        ).subscribe((res) => {
            this.uploadFileValidateRes = res;
            this.fillSummary()
            this.stepperMoveNext(this.pageTitle)
          }
        )
        break
      case DocKey.EMPLOYEE_FILE:
        this.wpsService.validateUploadEmployeeFile(
          createRequestValidateEmployeeFile(this.getControl(this.pages, 0, 0, "fileControl").value)
        ).subscribe((res) => {
          this.uploadEmployeeFileValidateRes = res;
          this.fillSummary()
          this.stepperMoveNext(this.pageTitle)

        })
        break
    }
    this.endButtons = []
    this.startButtons = []


  }

  private uploadAgainClick() {
    this.stepperMoveBack(this.pageTitle)
    this.endButtons = [this.proceedButton]
    this.startButtons = [this.cancelButton]
  }


  private confirmUploadWPS() {
    switch (this.getControl(this.pages, 0, 0, "fileType").value.key) {
      case DocKey.SALARY_FILE:
        if (this.uploadFileValidateRes.payrollBatch.futureSecurityLevelsDTOList!.length > 1) {
          this.confirmUploadSalaryFileWPS()
        } else {
          this.verificationService.showVerification(this.uploadFileValidateRes.generateChallengeAndOTP).subscribe((requestValidate: RequestValidate) => {
            this.confirmUploadSalaryFileWPS(requestValidate)
          })
        }
        break
      case DocKey.EMPLOYEE_FILE:
        this.saveEmployeeFile()
    }

  }


  confirmUploadSalaryFileWPS(requestValidate?: RequestValidate) {
    this.wpsService.confirmUploadSalaryFile(creteUploadWPSSalaryFileReq(this.uploadFileValidateRes, requestValidate)).subscribe({
      next: () => {
        this.stepperMoveNext(this.pageTitle);
        this.summary = {};
        this.endButtons = [this.dashboardButton, this.payrollButton];
        this.startButtons = [];
        this.result = this.fillSuccessResult('payroll.payroll-wps.upload-files.wps-upload-salary-file-successful', 'payroll.payroll-wps.upload-files.wps-upload-salary-file-successful-sub');
        window.scrollTo(0, 0);
      },
      error: (error: ResponseException) => {
        this.stepperMoveNext(this.pageTitle);
        this.summary = {};
        this.endButtons = [this.dashboardButton, this.payrollButton];
        this.startButtons = [];
        this.result = this.fillErrorResult(error.ErrorResponse.errorDescription!);
        window.scrollTo(0, 0);
      }
    })
  }

  fillSuccessResult(titleText: string, subTitleText: string): ResultModal {
    return {
      type: 'Success',
      title: titleText,
      subTitle: subTitleText,
      summary: undefined
    };
  }

  fillErrorResult(errString: string): ResultModal {
    return {
      type: 'Error',
      title: errString,
      summary: undefined
    }

  }

  private doSalaryFileSummary() {
    let sections: SummarySectionModel[] = [];
    if (this.uploadFileValidateRes.linesWithError > 0) {
      this.modelAndListService.getModel("errors").subscribe((res) => {

        for (const error of this.uploadFileValidateRes.lineValidationList) {
          let errorCode = 'errorTable.' + error.errorCode;
          error.errorCode = res.errors[errorCode];
        }
        sections.push({
          items: [
            {title: "payroll.payroll-wps.upload-files.summary.fileName", subTitle: this.uploadFileValidateRes.fileName},
            {
              title: "payroll.payroll-wps.upload-files.summary.NumberOfLinesWithErrors",
              subTitle: this.uploadFileValidateRes.linesWithError.toString()
            }
          ],
          table: {
            columnId: '',
            data: this.uploadFileValidateRes.lineValidationList,
            headers: [
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.lineNumber",
                type: TableHeaderType.TEXT,
                fieldName: 'lineNumber'
              },
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.errorDescription",
                type: TableHeaderType.TEXT,
                fieldName: 'errorCode'
              },
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.fieldName",
                type: TableHeaderType.TEXT,
                fieldName: 'fieldName'
              },
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.fieldData",
                type: TableHeaderType.TEXT,
                fieldName: 'fieldData'
              }
            ],
            maxDisplayRow: 5,
          }
        });
        sections.push({
          items: [
            {
              title: "payroll.payroll-wps.upload-files.summary.missing-info-title",
              subTitle: "payroll.payroll-wps.upload-files.summary.missing-info-message"
            }
          ]
        });
        this.summary = {
          sections: sections
        }
      });
      this.endButtons = [this.UploadAgainButton]
    } else {
      this.modelAndListService.getList(listOfProps()).subscribe(() => {

        if (this.uploadFileValidateRes.files.length > 0) {
          let susFiles: string[] = [];
          for (let file of this.uploadFileValidateRes.files) {
            susFiles.push(
              `${this.translate.instant('payroll.payroll-wps.upload-files.summary.batchName') + ': '} ${file.batchName}` + "  " +
              `${this.translate.instant('status.name') + ': '} ${this.statusPipe.transform(file.type)}`
            )
          }
          this.alertModel = getAlertModel(susFiles);
        }

        sections.push({
          title: {id: "uploadFileContentId", title: "payroll.payroll-wps.upload-files.summary.uploaded-file-content"},
          items: [
            {
              title: "payroll.payroll-wps.upload-files.summary.items.debitAccountNumber",
              subTitle: this.uploadFileValidateRes.payrollBatch.accountNumber
            },
            {
              title: "payroll.payroll-wps.upload-files.summary.items.debitAccountNickName",
              subTitle: this.uploadFileValidateRes.payrollBatch.accountAlias
            },
            {
              title: "payroll.payroll-wps.upload-files.summary.items.companyRemarks",
              subTitle: this.uploadFileValidateRes.payrollBatch.remarks
            },
            {
              title: "payroll.payroll-wps.upload-files.summary.items.paymentDate",
              subTitle: this.uploadFileValidateRes.payrollBatch.paymentDate.toString()
            },
            {
              title: "payroll.payroll-wps.upload-files.summary.items.batchName",
              subTitle: this.uploadFileValidateRes.payrollBatch.batchName
            },
            {
              title: "payroll.payroll-wps.upload-files.summary.items.status",
              subTitle: this.uploadFileValidateRes.payrollBatch.status
            }
          ]
        })
        sections.push(Utils.getCurrentLevelAndNextLevelSummarySection(this.translate, this.uploadFileValidateRes.payrollBatch.futureSecurityLevelsDTOList!))
        sections.push({
          title: {id: 'tableID', title: "payroll.payroll-wps.upload-files.summary.employee-list"},
          table: {
            columnId: 'civilianId',
            data: this.uploadFileValidateRes.companyEmployeeList,
            headers: [
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.employeeReference",
                type: TableHeaderType.TEXT,
                fieldName: 'employeeReference',
                isPin: false
              },
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.civilianId",
                type: TableHeaderType.TEXT,
                fieldName: 'civilianId'
              },
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.empName",
                type: TableHeaderType.TEXT,
                fieldName: 'name'
              },
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.bankNameEn",
                type: TableHeaderType.TEXT,
                fieldName: 'bankNameEn'
              },
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.account",
                type: TableHeaderType.TEXT,
                fieldName: 'account'
              },
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.salary",
                type: TableHeaderType.TEXT,
                fieldName: 'salary'
              },
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.salaryBasic",
                type: TableHeaderType.TEXT,
                fieldName: 'salaryBasic'
              },
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.allowanceHousing",
                type: TableHeaderType.TEXT,
                fieldName: 'allowanceHousing'
              },
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.allowanceOther",
                type: TableHeaderType.TEXT,
                fieldName: 'allowanceOther'
              },
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.deductions",
                type: TableHeaderType.TEXT,
                fieldName: 'deductions'
              },
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.remarks",
                type: TableHeaderType.TEXT,
                fieldName: 'remarks'
              },
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.departmentId",
                type: TableHeaderType.TEXT,
                fieldName: 'departmentId'
              },
            ],
            maxDisplayRow: 5,
            exportFileName: "employeesData"
          },
        });
        sections.push({
          title: {id: 'summaryAndFeesId', title: "payroll.payroll-wps.upload-files.summary.summary-and-fees"},
          items: [
            {
              title: "payroll.payroll-wps.upload-files.summary.items.totalAmountAlrajhiRecords",
              subTitle: this.uploadFileValidateRes.salaryPaymentDetails.totalNumRajhi?.toString()
            },
            {
              title: "payroll.payroll-wps.upload-files.summary.items.totalFeesAlrajhiRecords",
              subTitle: this.uploadFileValidateRes.salaryPaymentDetails.totalFeesRajhi?.toString()
            },
            {
              title: "payroll.payroll-wps.upload-files.summary.items.countAlrajhiRecords",
              subTitle: this.uploadFileValidateRes.salaryPaymentDetails.numRajhiTransfers?.toString()
            },
            {
              title: "payroll.payroll-wps.upload-files.summary.items.totalAmountLocalBankRecords",
              subTitle: this.uploadFileValidateRes.salaryPaymentDetails.totalNumNonRajhi?.toString()
            },
            {
              title: "payroll.payroll-wps.upload-files.summary.items.totalFeesLocalBankRecords",
              subTitle: this.uploadFileValidateRes.salaryPaymentDetails.totalFeesNonRajhi?.toString()
            },
            {
              title: "payroll.payroll-wps.upload-files.summary.items.countLocalBankRecords",
              subTitle: this.uploadFileValidateRes.salaryPaymentDetails.numNonRajhiTransfers?.toString()
            },
            {
              title: "payroll.payroll-wps.upload-files.summary.items.totalAmount",
              subTitle: this.uploadFileValidateRes.salaryPaymentDetails.totalAmount?.toString()
            },
            {
              title: "payroll.payroll-wps.upload-files.summary.items.totalFees",
              subTitle: this.uploadFileValidateRes.salaryPaymentDetails.transactionFee?.toString()
            },
            {
              title: "payroll.payroll-wps.upload-files.summary.items.countRecords",
              subTitle: this.uploadFileValidateRes.salaryPaymentDetails.numEmployees?.toString()
            },
            {
              title: "payroll.payroll-wps.upload-files.summary.items.subtotalAmount",
              subTitle: this.uploadFileValidateRes.salaryPaymentDetails.totalEstimated?.toString()
            },
          ]
        })

        this.summary = {
          sections: sections
        }
      })
      this.endButtons = [this.confirmButton]
      this.startButtons = [this.backButton]
    }
  }

  private doEmployeeFileSummary() {
    let sections: SummarySectionModel[] = [];
    if (this.uploadEmployeeFileValidateRes.linesWithError > 0) {
      this.modelAndListService.getModel("errors").subscribe((res) => {
        for (const error of this.uploadEmployeeFileValidateRes.lineValidationList) {
          let errorCode = 'errorTable.' + error.errorCode;
          error.errorCode = res.errors[errorCode];
        }
        sections.push({
          items: [
            {
              title: "payroll.payroll-wps.upload-files.summary.fileName",
              subTitle: this.uploadEmployeeFileValidateRes.fileName
            },
            {
              title: "payroll.payroll-wps.upload-files.summary.NumberOfLinesWithErrors",
              subTitle: this.uploadEmployeeFileValidateRes.linesWithError.toString()
            }
          ],
          table: {
            columnId: '',
            data: this.uploadEmployeeFileValidateRes.lineValidationList,
            headers: [
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.lineNumber",
                type: TableHeaderType.TEXT,
                fieldName: 'lineNumber'
              },
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.errorDescription",
                type: TableHeaderType.TEXT,
                fieldName: 'errorCode'
              },
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.fieldName",
                type: TableHeaderType.TEXT,
                fieldName: 'fieldName'
              },
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.fieldData",
                type: TableHeaderType.TEXT,
                fieldName: 'fieldData'
              }
            ],
            maxDisplayRow: 5,
          }
        });
        sections.push({
          items: [
            {
              title: "payroll.payroll-wps.upload-files.summary.missing-info-title",
              subTitle: "payroll.payroll-wps.upload-files.summary.missing-info-message"
            }
          ]
        });
        this.summary = {
          sections: sections
        }
      });
      this.endButtons = [this.UploadAgainButton]
    } else {
      this.modelAndListService.getList(listOfProps()).subscribe(() => {
        sections.push({
          title: {id: 'tableID', title: "payroll.payroll-wps.upload-files.summary.employee-list"},
          table: {
            columnId: 'civilianId',
            data: this.uploadEmployeeFileValidateRes.companyEmployeeList,
            headers: [
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.employeeReference",
                type: TableHeaderType.TEXT,
                fieldName: 'employeeReference',
              },
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.civilianId",
                type: TableHeaderType.TEXT,
                fieldName: 'civilianId'
              },
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.empName",
                type: TableHeaderType.TEXT,
                fieldName: 'name'
              },
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.bankNameEn",
                type: TableHeaderType.TEXT,
                fieldName: 'bankNameEn'
              },
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.account",
                type: TableHeaderType.TEXT,
                fieldName: 'account'
              },
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.salary",
                type: TableHeaderType.TEXT,
                fieldName: 'salary'
              },
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.salaryBasic",
                type: TableHeaderType.TEXT,
                fieldName: 'salaryBasic'
              },
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.allowanceHousing",
                type: TableHeaderType.TEXT,
                fieldName: 'allowanceHousing'
              },
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.allowanceOther",
                type: TableHeaderType.TEXT,
                fieldName: 'allowanceOther'
              },
              {
                title: "payroll.payroll-wps.upload-files.summary.table-headers.deductions",
                type: TableHeaderType.TEXT,
                fieldName: 'deductions'
              },
            ],
            maxDisplayRow: 5,
            exportFileName: "employeesData",
          },
        });
        this.summary = {
          sections: sections
        }
      })
      this.endButtons = [this.confirmButton]
    }
  }

  private saveEmployeeFile() {
    this.wpsService.confirmUploadEmployeeFile(creteUploadWPSEmployeeFileReq(this.uploadEmployeeFileValidateRes)).subscribe({
      next: () => {
        this.stepperMoveNext(this.pageTitle);
        this.summary = {};
        this.endButtons = [this.dashboardButton, this.payrollButton];
        this.startButtons = [];
        this.result = this.fillSuccessResult('payroll.payroll-wps.upload-files.wps-upload-salary-file-successful', 'payroll.payroll-wps.upload-files.wps-upload-salary-file-successful-sub');
        window.scrollTo(0, 0);
      },
    })
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
}

