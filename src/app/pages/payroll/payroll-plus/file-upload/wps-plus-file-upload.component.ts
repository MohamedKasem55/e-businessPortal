import {Component} from '@angular/core';
import {PayrollBaseComponent} from "../../payroll-base/payroll-base.component";
import {
  buildFileUploadForm,
  createRequestValidateSalaryFile,
  creteUploadWPSSalaryFileReq,
  getDocTypeObject
} from "./file-upload-controls";
import {FormResult, PageModel} from "../../../../@core/model/dto/formModel";
import {FormButtonClickOutput} from "../../../../shared/form/form.component";
import {SummarySectionModel} from "arb-design-library/model/summary-section.model";
import {TableHeaderType} from "arb-design-library";
import {ButtonModel} from "arb-design-library/model/button.model";
import {RequestValidate} from "../../../../@core/model/rest/common/otp.model";
import {ResultModal} from "../../../../@core/model/dto/result.modal";
import {ResponseException} from "../../../../@core/service/base/responseException";
import {WPSPlusEmployeeFileRes} from "../../../../@core/model/rest/payroll/upload-file/upload-employee-file-validate-res";
import {DocKey} from "./doc-type";
import {UploadSalaryFileValidateRes} from "../../../../@core/model/rest/payroll/upload-file/upload-salary-file-validate-res";
import {ValueChangeResult} from "../../../../@core/model/dto/control/control.model";
import {TitleModel} from "arb-design-library/model/title.model";
import {SummaryModel} from "arb-design-library/model/summary.model";
import {getAlertModel, listOfProps} from "../../payroll-wps/file-upload/file-upload-controls";
import {Utils} from "../../../../@core/utility/Utils";
import {StatusPipe} from "../../../../@core/pipe/status-pipe";

@Component({
  selector: 'app-file-upload',
  templateUrl: './wps-plus-file-upload.component.html',
  styleUrls: []
})
export class WpsPlusFileUploadComponent extends PayrollBaseComponent {

  pages!: PageModel[];
  pageTitle: TitleModel = {
    id: "WpsPlusFileUploadPage",
    title: "payroll.uploadFile.name",
    stepper: {steps: ["", "", ""], stepCounter: 1, stepText: 'public.step', ofText: 'public.of'}
  };
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
  private nextButton: ButtonModel = {
    id: "Next",
    text: "public.next",
    type: "primary",
    isDisable: false
  }
  override payrollButton: ButtonModel = {
    id: "goToPayroll",
    text: 'payroll.payroll-wps.buttons.go-back-to-wps',
    type: "primary"
  }
  private uploadAgainButton: ButtonModel = {
    id: "UploadAgain",
    type: "primary",
    text: "re-upload"
  }
  private backButton: ButtonModel = {
    id: "Back",
    type: "secondary",
    text: "public.back"
  }

  endButtons: ButtonModel[] = [this.nextButton];

  startButtons: ButtonModel[] = [this.cancelButton];
  summary!: SummaryModel;
  result!: ResultModal;

  private uploadFileValidateRes!: UploadSalaryFileValidateRes;
  private wPSPlusEmployeeFileRes!: WPSPlusEmployeeFileRes


  constructor(private statusPipe: StatusPipe) {
    super();
    this.drawPage()
    this.getControl(this.pages, 0, 0, "fileType").controlOptions.options = getDocTypeObject();
    this.checkDocTypeChanges()
  }

  drawPage() {
    this.pageTitle.endButtons = []
    this.endButtons = [this.proceedButton]
    this.endButtons[0].isDisable = true
    this.pages = [new PageModel(1, buildFileUploadForm())];
  }

  onButtonClick(formButtonClickOutPut: FormButtonClickOutput) {
    switch (formButtonClickOutPut.buttonId) {
      case DocKey.REQUEST_OPEN_ACCOUNT_FILE:
        this.wpsService.downloadTemplate("PCP_PayrollCardsPlus.xlsm")
        break
      case DocKey.PAYROLL_CARD_MIGRATION_FILE:
        this.wpsService.downloadTemplate("PCPM_PayrollCardsPlusMigration.xlsm")
        break
      case DocKey.SALARY_FILE:
        this.wpsService.downloadTemplate("PSH_WPS_Payroll_Upload_File.xlsm")
        break
      case this.backButton.id:
      case this.uploadAgainButton.id:
      case this.payrollButton.id:
      case this.cancelButton.id:
        this.backClick()
        break
      case this.proceedButton.id:
        this.uploadFiles()
        break
      case this.confirmButton.id:
        this.confirmUpload()
        break
    }
  }


  checkDocTypeChanges() {
    this.getControl(this.pages, 0, 0, "fileType").valueChanges.subscribe((res: ValueChangeResult) => {
      switch (res.value.key) {
        case DocKey.REQUEST_OPEN_ACCOUNT_FILE:
        case DocKey.SALARY_FILE:
          this.getControl(this.pages, 0, 0, "batchName").hidden = false;
          this.getControl(this.pages, 0, 0, "batchName").enable();
          break
        default:
          this.getControl(this.pages, 0, 0, "batchName").hidden = true;
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

  fillSummary(fileRes: any, showEditButton: boolean = true) {
    switch (this.getControl(this.pages, 0, 0, "fileType").value.key) {
      case DocKey.SALARY_FILE:
        this.doSalaryFileSummary()
        break
      case DocKey.REQUEST_OPEN_ACCOUNT_FILE:
        this.doEmployeeFileSummary(fileRes)
        break
    }
  }

  private uploadFiles() {
    switch (this.getControl(this.pages, 0, 0, "fileType").value.key) {
      case DocKey.SALARY_FILE:
        this.wpsPlusPayrollService.validateUploadSalaryFile(createRequestValidateSalaryFile(
          this.getControl(this.pages, 0, 0, "fileControl").value,
          this.getControl(this.pages, 0, 0, "batchName").value)
        ).subscribe((res: UploadSalaryFileValidateRes) => {
            this.uploadFileValidateRes = res;
            this.fillSummary(this.uploadFileValidateRes)
            this.stepperMoveNext(this.pageTitle)
          }
        )
        break
      case DocKey.PAYROLL_CARD_MIGRATION_FILE:
        break
      case DocKey.REQUEST_OPEN_ACCOUNT_FILE:
        this.wpsPlusPayrollService.validateUploadRequestAccountOpenFile(
          {
            file: this.getControl(this.pages, 0, 0, "fileControl").value,
            batchName: this.getControl(this.pages, 0, 0, "batchName").value
          }).subscribe((res: WPSPlusEmployeeFileRes) => {
          this.wPSPlusEmployeeFileRes = res;
          this.fillSummary(this.wPSPlusEmployeeFileRes)
          this.stepperMoveNext(this.pageTitle)
        })
    }


  }

  private uploadAgainClick() {
    this.stepperMoveBack(this.pageTitle)
    this.endButtons = [this.proceedButton]
    this.startButtons = [this.cancelButton]
  }


  private confirmUpload() {
    switch (this.getControl(this.pages, 0, 0, "fileType").value.key) {
      case DocKey.REQUEST_OPEN_ACCOUNT_FILE:
        this.doREQUEST_OPEN_ACCOUNT_FILE();
        break
      case DocKey.SALARY_FILE:
        this.doSALARY_FILE();
        break
      case DocKey.PAYROLL_CARD_MIGRATION_FILE:
        this.doPAYROLL_CARD_MIGRATION_FILE();
        break
    }

  }


  confirmUploadSalaryFileWPS(requestValidate?: RequestValidate) {
    this.wpsPlusPayrollService.confirmUploadSalaryFile(creteUploadWPSSalaryFileReq(this.uploadFileValidateRes, requestValidate)).subscribe({
      next: () => {
        this.stepperMoveNext(this.pageTitle);
        this.summary = {};
        this.endButtons = [{id: "goToPayroll", text: "go to payroll-service", type: "primary"}];
        this.startButtons = [];
        this.result = this.fillSuccessResult("wps-upload-salary-file-successful", "wps-upload-salary-file-successful-sub");
        window.scrollTo(0, 0);
      },
      error: (error: ResponseException) => {
        this.stepperMoveNext(this.pageTitle);
        this.summary = {};
        this.endButtons = [{id: "goToPayroll", text: "go to payroll-service", type: "primary"}];
        this.startButtons = [];
        this.result = this.fillErrorResult(error.ErrorResponse.errorDescription!);
        window.scrollTo(0, 0);
      }
    })
  }

  fillSuccessResult(titleKey: string, subTitle: string): ResultModal {
    return {
      type: 'Success',
      title: this.translate.instant('payroll.uploadFile.' + titleKey),
      subTitle: this.translate.instant('payroll.uploadFile.' + subTitle),
      summary: {}
    };
  }

  fillErrorResult(errString: string): ResultModal {
    return {
      type: 'Error',
      title: errString,
      summary: {}
    };
  }

  doSalaryFileSummary() {
    //TODO to be added in a common place as it's the same as WPS
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
      this.endButtons = [this.uploadAgainButton]
    } else {
      this.modelAndListService.getList(listOfProps()).subscribe(() => {

        if (this.uploadFileValidateRes.files) {
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
        sections.push(Utils.getCurrentLevelAndNextLevelSummarySection(this.translate, this.uploadFileValidateRes.payrollBatch.futureSecurityLevelsDTOList!));
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
              title: "payroll.payroll-wps-plus.upload-file.summary.items.total-amount-payroll-plus",
              subTitle: (this.uploadFileValidateRes.salaryPaymentDetails.totalAmount!).toString()
            },
            {
              title: "payroll.payroll-wps-plus.upload-file.summary.items.total-fees-payroll-plus",
              subTitle: (this.uploadFileValidateRes.salaryPaymentDetails.totalFeesRajhi!).toString()
            },
            {
              title: "payroll.payroll-wps-plus.upload-file.summary.items.count-payroll-plus",
              subTitle: (this.uploadFileValidateRes.salaryPaymentDetails.numRajhiTransfers!).toString()
            },
            {
              title: "payroll.payroll-wps-plus.upload-file.summary.items.subtotal-amount",
              subTitle: (this.uploadFileValidateRes.salaryPaymentDetails.totalEstimated!).toString()
            }
          ]
        });
        this.summary = {
          sections: sections
        }
      })
      this.endButtons = [this.confirmButton]
      this.startButtons = [this.backButton]
    }
  }


  private doEmployeeFileSummary(fileRes: WPSPlusEmployeeFileRes) {
    const tableData = (fileRes.batchContainer.toProcess.length > 0) ? fileRes.batchContainer.toProcess : fileRes.batchContainer.toAuthorize? fileRes.batchContainer.toAuthorize : [];
    let sections: SummarySectionModel[] = [];
    sections.push({
      title: {id: 'tableID', title: "empList"},
      table: {
        columnId: 'civilianId',
        data: tableData,
        headers: [
          {title: "payroll.employee.emp-no", type: TableHeaderType.TEXT, fieldName: 'employeeNumber'},
          {title: "payroll.employee.emp-name", type: TableHeaderType.TEXT, fieldName: 'nickName'},
          {title: "payroll.employee.emp-id", type: TableHeaderType.TEXT, fieldName: 'civilianId'},
          {title: "payroll.employee.mobile", type: TableHeaderType.TEXT, fieldName: 'mobile'},
          {title: "payroll.employee.contractStartDate", type: TableHeaderType.DATE_TEXT, fieldName: 'contractStartDate',controlOptions:{format:'dd/MM/yyyy'}},
          {title: "payroll.employee.birthDate", type: TableHeaderType.DATE_TEXT, fieldName: 'birthDate',controlOptions:{format:'dd/MM/yyyy'}},
          {title: "payroll.employee.emp-total-salary", type: TableHeaderType.TEXT, fieldName: 'salary'},
          {title: "payroll.employee.emp-basic-salary", type: TableHeaderType.TEXT, fieldName: 'salaryBasic'},
          {title: "payroll.employee.emp-housing-allowance", type: TableHeaderType.TEXT, fieldName: 'allowanceHousing'},
          {title: "payroll.emp-other-allowance", type: TableHeaderType.TEXT, fieldName: 'allowanceOther'},
          {title: "payroll.employee.emp-deductions", type: TableHeaderType.TEXT, fieldName: 'deductions'},
        ],
        maxDisplayRow: 5,
        exportFileName:  "employeesData",
      },
      items: [{title: "batchName", subTitle: this.getControl(this.pages, 0, 0, "batchName").value}]
    });
    sections.push({items: [{title: "CountOfPayrollPlusRecords", subTitle: (tableData.length).toString()}]})
    this.summary = {
      sections: sections
    }
    this.endButtons = [this.confirmButton]
    this.startButtons = [this.backButton]
  }

  // private saveEmployeeFile() {
  //   const request: UploadPayrollFileReq = {
  //     file: this.getControl(this.pages, 0, 0, "fileControl").value,
  //     batchName: this.getControl(this.pages, 0, 0, "batchName").value
  //   }
  //   this.wpsPlusPayrollService.confirmUploadEmployeeFile(request).subscribe({
  //     next: () => {
  //       this.stepperMoveNext(this.pageTitle);
  //       this.summary = {};
  //       this.endButtons = [{id: "goToPayroll", text: "go to payroll-service", type: "primary"}];
  //       this.startButtons = [];
  //       this.result = this.fillSuccessResult("wps-upload-salary-file-successful", "wps-upload-salary-file-successful-sub");
  //       window.scrollTo(0, 0);
  //     },
  //
  //   })
  // }
  private doREQUEST_OPEN_ACCOUNT_FILE() {
    if (this.wPSPlusEmployeeFileRes.batchContainer.toProcess.length > 1) {
      this.verificationService.showVerification(this.wPSPlusEmployeeFileRes.generateChallengeAndOTP).subscribe((requestValidate: RequestValidate) => {
        this.wpsPlusPayrollService.confirmUploadRequestAccountOpenFile({
          file: this.getControl(this.pages, 0, 0, "fileControl").value,
          batchName: this.getControl(this.pages, 0, 0, "batchName").value,
          requestValidate: requestValidate
        }).subscribe({
          next: () => {
            this.stepperMoveNext(this.pageTitle);
            this.summary = {};
            this.endButtons = [{id: "goToPayroll", text: "go to payroll-service", type: "primary"}];
            this.startButtons = [];
            this.result = this.fillSuccessResult("wps-upload-salary-file-successful", "wps-upload-salary-file-successful-sub");
            window.scrollTo(0, 0);
          },
          error: (error) => {
            this.stepperMoveNext(this.pageTitle);
            this.summary = {};
            this.endButtons = [{id: "goToPayroll", text: "go to payroll-service", type: "primary"}];
            this.startButtons = [];
            this.result = this.fillErrorResult(error.ErrorResponse.errorDescription!);
            window.scrollTo(0, 0);
          }
        })
      })
    } else {
      this.wpsPlusPayrollService.confirmUploadRequestAccountOpenFile({
        file: this.getControl(this.pages, 0, 0, "fileControl").value,
        batchName: this.getControl(this.pages, 0, 0, "batchName").value,
      }).subscribe({
        next: () => {
          this.stepperMoveNext(this.pageTitle);
          this.summary = {};
          this.endButtons = [{id: "goToPayroll", text: "go to payroll-service", type: "primary"}];
          this.startButtons = [];
          this.result = this.fillSuccessResult("wps-upload-salary-file-successful", "wps-upload-salary-file-successful-sub");
          window.scrollTo(0, 0);
        },
        error: (error) => {
          this.stepperMoveNext(this.pageTitle);
          this.summary = {};
          this.endButtons = [{id: "goToPayroll", text: "go to payroll-service", type: "primary"}];
          this.startButtons = [];
          this.result = this.fillErrorResult(error.ErrorResponse.errorDescription!);
          window.scrollTo(0, 0);
        }
      })
    }

  }

  private doSALARY_FILE() {
    if (this.uploadFileValidateRes.payrollBatch.futureSecurityLevelsDTOList!.length > 1) {
      this.confirmUploadSalaryFileWPS()
    } else {
      this.verificationService.showVerification(this.uploadFileValidateRes.generateChallengeAndOTP).subscribe((requestValidate: RequestValidate) => {
        this.confirmUploadSalaryFileWPS(requestValidate)
      })
    }

  }

  private doPAYROLL_CARD_MIGRATION_FILE() {

  }
}

