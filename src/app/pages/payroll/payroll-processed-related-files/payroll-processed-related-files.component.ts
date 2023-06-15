import {Component, OnInit} from '@angular/core';
import {PayrollBaseComponent} from "../payroll-base/payroll-base.component";
import {FormButtonClickOutput} from "../../../shared/form/form.component";
import {PageModel} from "../../../@core/model/dto/formModel";
import {
  buildProcessedRelatedFileContentForm,
  buildProcessedRelatedFileEmployeeListForm,
  cancellationSummaryToHide_plus,
  cancellationSummaryToHide_WPS,
  cancellationSummaryToShow_plus,
  cancellationSummaryToShow_WPS,
  recordsTableHeaders1,
  recordsTableHeaders2
} from "./payroll-processed-related-files.controls";
import {ButtonModel} from "arb-design-library/model/button.model";
import {TitleModel} from "arb-design-library/model/title.model";
import {SummaryModel} from "arb-design-library/model/summary.model";
import {ResultModal} from "../../../@core/model/dto/result.modal";
import {Account} from "../../../@core/model/rest/common/account";
import {PayrollType} from "../payroll-type";
import {RequestValidate} from "../../../@core/model/rest/common/otp.model";
import {Utils} from "../../../@core/utility/Utils";
import {AuthenticationUtils} from "../../../@core/utility/authentication-utils";

@Component({
  selector: 'app-payroll-processed-related-files',
  templateUrl: './payroll-process-related-files.component.html'
})
export class PayrollProcessedRelatedFilesComponent extends PayrollBaseComponent implements OnInit {

  pages!: PageModel[];
  pageTitle: TitleModel = {
    id: "addEmployee",
    title: "payroll.employee.addEmployee",
  };
  endButtons: ButtonModel[] = [{
    id: "Next",
    text: "public.next",
    type: "primary",
    isDisable: false
  }];
  stopFileButton: ButtonModel = {id: 'StopFile', type: "danger", text: 'payroll.processedFiles.buttons.stop-file'}
  previousFileButton: ButtonModel = {
    id: "previousFile",
    text: "payroll.processedFiles.buttons.previous-file",
    type: "secondary"
  }
  nextFileButton: ButtonModel = {id: "nextFile", text: "payroll.processedFiles.buttons.next-file", type: "primary"}

  startButtons!: ButtonModel[];
  summary!: SummaryModel;
  result!: ResultModal;
  props: any
  fileDetails!: any;
  private validateCancelResponse: any;
  private confirmButton: ButtonModel = {
    id: 'Confirm',
    text: 'public.confirm',
    type: "primary"
  }


  constructor() {
    super();
    this.drawPage()
    if (!history.state.selectedFile) {
      this.goBackToProcessedFiles();
    } else {
      this.getFileDetails(history.state.selectedFile, history.state.payrollCompanyDetails)
      this.creteButtons()
    }

  }

  onButtonClick(button: FormButtonClickOutput) {
    switch (button.buttonId) {
      case 'Back':
        this.goBackToProcessedFiles();
        break
      case this.previousFileButton.id :
        this.previousFileClick()
        break
      case this.nextFileButton.id:
        this.nextFileClick()
        break
      case this.stopFileButton.id:
        this.startCancelFlow()
        break
      case 'systemFileName':
        this.downloadSystemFile();
        break
      case this.cancelButton.id:
        this.cancelTheCancellationFlow();
        break
      case this.confirmButton.id:
        this.cancelFile();
        break
      case this.payrollButton.id:
        this.goBackToPayroll();
        break
      case this.dashboardButton.id:
        this.goToDashBoard();
        break
    }
  }

  goBackToProcessedFiles() {
    void this.router.navigate(['payroll/processed-files', this.getPayrollType()])
  }

  private drawPage() {
    this.pageTitle.id = "processed-related-files-page-title-id";
    this.pageTitle.title = "payroll.processedFiles.name";
    this.pageTitle.endButtons = []
    this.endButtons = []
    this.startButtons = []
    this.pageTitle.stepper = undefined
    this.pages = [new PageModel(1, buildProcessedRelatedFileContentForm(), buildProcessedRelatedFileEmployeeListForm())];

  }

  getFileDetails(selectedFile: any, payrollCompanyDetails: any) {
    let request = {
      file: selectedFile,
      payrollCompanyDetails: payrollCompanyDetails
    }
    let payrollType!: string;

    switch (history.state.productName) {
      case PayrollType.WPS:
        payrollType = 'WPS_PAYROLL';
        break
      case PayrollType.WPS_PLUS:
        payrollType = 'WPS_PAYROLL_PLUS';
        break
    }
    this.wpsService.getRelatedFileDetails(request, payrollType).subscribe({

        next: (details) => {
          this.fileDetails = details
          if (details.salaryFileDetails.type != "s") {
            this.getControl(this.pages, 0, 1, 'employeeListTable').controlOptions.headers = recordsTableHeaders2;
            if (details.salaryFileDetails.salaryFileHeaderDTO.messageCode != null) {
              this.getControl(this.pages, 0, 0, 'messageCode').hidden = false;
              this.getControl(this.pages, 0, 0, 'messageCode').setValue(this.props.feedbackMessageCode[details.salaryFileDetails.salaryFileHeaderDTO.messageCode])
            }


          } else {
            this.getControl(this.pages, 0, 1, 'employeeListTable').controlOptions.headers = recordsTableHeaders1;
          }

          for (const detail of details.salaryFileDetails.wpsSalaryDetailsDTOList) {
            detail.bankName = this.props.payrollBankCode[detail.bankCode]
            detail.messageDescription = this.props.feedbackMessageCode[detail.messageCode]
          }
          let _totalFeesRajhi = Number(details.details.salaryPaymentDetails.totalFeesRajhi);
          let _totalFeesNonRajhi = Number(details.details.salaryPaymentDetails.totalFeesNonRajhi);
          details.details.salaryPaymentDetails.totalFees = _totalFeesRajhi + _totalFeesNonRajhi

          details.salaryFileDetails.fileType = this.props.payrollFileType[details.salaryFileDetails.type]

          history.state.accountList.find((acc: Account) => {
            if (acc.fullAccountNumber === details.details.salaryPaymentDetails.payrollDebitAccount) {
              this.getControl(this.pages, 0, 0, 'debitAccountNickName').setValue(acc.alias, true);
            }
          })


          this.getControl(this.pages, 0, 1, 'employeeListTable').controlOptions.data = details.salaryFileDetails.wpsSalaryDetailsDTOList;


          this.getControl(this.pages, 0, 0, 'productName').setValue(this.translate.instant('payroll.processedFiles.product-name.' + history.state.productName), true);
          this.getControl(this.pages, 0, 0, 'fileType').setValue(details.salaryFileDetails.fileType, true);
          this.getControl(this.pages, 0, 0, 'dateReceived').setValue(request.file.dataReceived, true);
          this.getControl(this.pages, 0, 0, 'batchName').setValue(details.salaryFileDetails.batchName, true);
          this.getControl(this.pages, 0, 0, 'debitAccountNumber').setValue(details.details.salaryPaymentDetails.payrollDebitAccount, true);
          this.getControl(this.pages, 0, 0, 'paymentDate').setValue(request.file.paymentDate, true);
          this.getControl(this.pages, 0, 0, 'systemFileName').setValue(details.salaryFileDetails.fileName, true);
          this.getControl(this.pages, 0, 0, 'customerReference').setValue(details.salaryFileDetails.customerReference, true);
          this.getControl(this.pages, 0, 0, 'companyRemarks').setValue(details.salaryFileDetails.salaryFileHeaderDTO.companyRemarks, true);
          this.getControl(this.pages, 0, 0, 'approvedBy').setValue(details.salaryFileDetails.approvedBy, true);
          this.getControl(this.pages, 0, 0, 'approvedDate').setValue(details.salaryFileDetails.approvedDate, true);
          this.getControl(this.pages, 0, 0, 'initiatedBy').setValue(details.salaryFileDetails.initiatedBy, true);
          this.getControl(this.pages, 0, 0, 'initiatedDate').setValue(details.salaryFileDetails.initiationDate, true);


          this.getControl(this.pages, 0, 1, 'totalAmountOfPayrollRecords').setValue(details.details.salaryPaymentDetails.totalAmount, true);
          this.getControl(this.pages, 0, 1, 'totalFeesOfPayrollRecords').setValue(details.details.salaryPaymentDetails.totalFees, true);
          this.getControl(this.pages, 0, 1, 'countOfPayrollRecords').setValue(details.details.salaryPaymentDetails.numEmployees, true);
          this.getControl(this.pages, 0, 1, 'subtotalAmount').setValue(details.details.salaryPaymentDetails.totalEstimated, true);

          if (this.getPayrollType() === PayrollType.WPS) {
            this.getControl(this.pages, 0, 1, 'totalNumRajhi').setValue(details.details.salaryPaymentDetails.totalNumRajhi);
            this.getControl(this.pages, 0, 1, 'totalNumRajhi').hidden = false;
            this.getControl(this.pages, 0, 1, 'totalFeesRajhi').setValue(details.details.salaryPaymentDetails.totalFeesRajhi);
            this.getControl(this.pages, 0, 1, 'totalFeesRajhi').hidden = false;
            this.getControl(this.pages, 0, 1, 'numRajhiTransfers').setValue(details.details.salaryPaymentDetails.numRajhiTransfers);
            this.getControl(this.pages, 0, 1, 'numRajhiTransfers').hidden = false;
            this.getControl(this.pages, 0, 1, 'totalNumNonRajhi').setValue(details.details.salaryPaymentDetails.totalNumNonRajhi);
            this.getControl(this.pages, 0, 1, 'totalNumNonRajhi').hidden = false;
            this.getControl(this.pages, 0, 1, 'totalFeesNonRajhi').setValue(details.details.salaryPaymentDetails.totalFeesNonRajhi);
            this.getControl(this.pages, 0, 1, 'totalFeesNonRajhi').hidden = false;
            this.getControl(this.pages, 0, 1, 'numNonRajhiTransfers').setValue(details.details.salaryPaymentDetails.numNonRajhiTransfers);
            this.getControl(this.pages, 0, 1, 'numNonRajhiTransfers').hidden = false;
          }
          if (this.allowCancellation()) {
            this.pageTitle.endButtons = [this.stopFileButton]
          } else {
            this.pageTitle.endButtons = []
          }


        },

        //TODO check this
        // error: (err) => {
        //   debugger
        //   this.nextFileClick(1)
        //   this.getControl(this.pages, 0, 1, 'employeeListTable').controlOptions.data = [];
        // }
      }
    )
  }

  allowCancellation(): boolean {
    let allow = false
    let userAllowed = false
    if (this.fileDetails.salaryFileDetails.type != 's') {
      return allow
    }
    if (this.fileDetails.details.salaryPaymentDetails.paymentDate) {
      const parts = this.fileDetails.details.salaryPaymentDetails.paymentDate.split('-')
      const dt = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
      dt.setDate(dt.getDate() - 1)
      dt.setHours(22, 0, 0, 0)
      if (dt > new Date()) {
        allow = true
      }
    }
    if (this.fileDetails.salaryFileDetails.cancelled == true) {
      allow = false
    }

    switch (this.getPayrollType()) {
      case PayrollType.WPS:
        userAllowed = AuthenticationUtils.hasAccess('WPS_STOP_FILE')
        break
      case PayrollType.WPS_PLUS:
        userAllowed = AuthenticationUtils.hasAccess('WPS_PLUS_STOP_FILE')
        break
    }
    return allow && userAllowed

  }


  private creteButtons(fileName?: any) {
    if (history.state.relatedFilesList.length > 1) {

      this.endButtons = [this.nextFileButton]
      this.startButtons = [this.previousFileButton]

      let _index = this.getCurrentFileIndex(fileName);


      if (_index == 0) {
        this.startButtons = [];
      }

      if (_index == history.state.relatedFilesList.length - 1) {
        this.endButtons = [];
      }

    }

  }

  private nextFileClick(inputIndex?: number) {
    let nextFileIndex;
    let fileName = this.getControl(this.pages, 0, 0, 'systemFileName').value

    nextFileIndex = this.getCurrentFileIndex(fileName) + 1
    if (inputIndex) {

      //FIXME check this case with business
      nextFileIndex += inputIndex
    }
    this.getFileDetails(history.state.relatedFilesList[nextFileIndex], history.state.payrollCompanyDetails)
    this.creteButtons(history.state.relatedFilesList[nextFileIndex].fileName)
  }

  getCurrentFileIndex(selectedFileName?: any, fileList?: any): number {
    let _listFiles = history.state.relatedFilesList;
    let _selectedFileName = history.state.selectedFile.fileName;
    if (fileList) {
      _listFiles = fileList;
    }
    if (selectedFileName) {
      _selectedFileName = selectedFileName;
    }

    let _index = 0;
    _listFiles.forEach((item: any, index: number) => {
      if (_selectedFileName == item.fileName) {
        _index = index;
      }
    });
    return _index;
  }

  private previousFileClick() {
    let previousFileIndex;
    let fileName = this.getControl(this.pages, 0, 0, 'systemFileName').value
    previousFileIndex = this.getCurrentFileIndex(fileName) - 1
    this.getFileDetails(history.state.relatedFilesList[previousFileIndex], history.state.payrollCompanyDetails)
    this.creteButtons(history.state.relatedFilesList[previousFileIndex].fileName)
  }

  ngOnInit(): void {
    this.modelAndListService.getList(['bankType', 'bankCode', 'payrollBankCode', 'currencyIso', 'payrollFileType', 'feedbackMessageCode']).subscribe((props) => {
      this.props = props;
    });
  }

  private downloadSystemFile() {
    let request = {
      details: this.fileDetails.details,
      salaryFileDetails: this.fileDetails.salaryFileDetails
    }
    const services = this.wpsService
      .downloadSystemFile(request).subscribe((response) => {
          services.unsubscribe()
          if (response === null) {
          } else {
            Utils.saveDownloadedBlobFile(response, request.salaryFileDetails.fileName)
          }
        }
      )
  }

  private startCancelFlow() {
    this.wpsService.validateCancel().subscribe({
        next: (response) => {
          this.validateCancelResponse = response;
          this.showCancellationFess()

        }
      }
    )
  }


  private showCancellationFess() {
    this.pageTitle.endButtons![0].isDisable = true;
    this.endButtons = [this.confirmButton]
    this.startButtons = [this.cancelButton]
    let rajhiCount = 0
    let rajhiFee = 0
    let rajhiTotal = 0;
    let localCount = 0
    let localFee = 0
    let localTotal = 0;


    switch (this.getPayrollType()) {
      case PayrollType.WPS:
        cancellationSummaryToShow_WPS.forEach(itm => {
          this.getControl(this.pages, 0, 1, itm).hidden = false
        })
        cancellationSummaryToHide_WPS.forEach(itm => {
          this.getControl(this.pages, 0, 1, itm).hidden = true
        })


        rajhiCount = Number(this.fileDetails.details.salaryPaymentDetails.numRajhiTransfers)
        rajhiFee = 0
        rajhiTotal = Number(rajhiCount * rajhiFee)
        localCount = Number(this.fileDetails.details.salaryPaymentDetails.numNonRajhiTransfers)
        localFee = 0
        localTotal = Number()


        this.getControl(this.pages, 0, 1, 'numberOfRajhiRecordsToCancel').setValue(rajhiCount);
        this.getControl(this.pages, 0, 1, 'rajhiAmountPerTransactionToCancel').setValue(rajhiFee);
        this.getControl(this.pages, 0, 1, 'rajhiTotalAmountToCancel').setValue(rajhiTotal);

        this.getControl(this.pages, 0, 1, 'numberOfLocalRecordsToCancel').setValue(localCount);
        this.getControl(this.pages, 0, 1, 'localAmountPerTransactionToCancel').setValue(localFee);
        this.getControl(this.pages, 0, 1, 'localTotalAmountToCancel').setValue(localTotal);

        this.getControl(this.pages, 0, 1, 'numberOfRajhiRecordsToRefund').setValue(rajhiCount);
        this.getControl(this.pages, 0, 1, 'rajhiAmountPerTransactionToRefund').setValue(rajhiFee);
        this.getControl(this.pages, 0, 1, 'rajhiTotalAmountToRefund').setValue(rajhiTotal);

        this.getControl(this.pages, 0, 1, 'numberOfLocalRecordsToRefund').setValue(localCount);
        this.getControl(this.pages, 0, 1, 'localAmountPerTransactionToRefund').setValue(localFee);
        this.getControl(this.pages, 0, 1, 'localTotalAmountToToRefund').setValue(localTotal);


        break;
      case PayrollType.WPS_PLUS:
        cancellationSummaryToShow_plus.forEach(itm => {
          this.getControl(this.pages, 0, 1, itm).hidden = false
        })
        cancellationSummaryToHide_plus.forEach(itm => {
          this.getControl(this.pages, 0, 1, itm).hidden = true
        })
        rajhiCount = Number(this.fileDetails.details.salaryPaymentDetails.numRajhiTransfers)
        rajhiFee = Number(this.fileDetails.details.salaryPaymentDetails.blueCollarRajhiCancelFee)
        rajhiTotal = Number(rajhiCount * rajhiFee)

        this.getControl(this.pages, 0, 1, 'numberOfRajhiRecordsToCancel').setValue(rajhiCount);
        this.getControl(this.pages, 0, 1, 'rajhiAmountPerTransactionToCancel').setValue(rajhiFee);
        this.getControl(this.pages, 0, 1, 'rajhiTotalAmountToCancel').setValue(rajhiTotal);
        this.getControl(this.pages, 0, 1, 'numberOfRajhiRecordsToRefund').setValue(rajhiCount);
        this.getControl(this.pages, 0, 1, 'rajhiAmountPerTransactionToRefund').setValue(rajhiFee);
        this.getControl(this.pages, 0, 1, 'rajhiTotalAmountToRefund').setValue(rajhiTotal);

        break;
    }
  }

  private cancelTheCancellationFlow() {
    if (this.pageTitle.endButtons?.length! > 0) {
      this.pageTitle.endButtons![0].isDisable = false;
    }

    switch (this.getPayrollType()) {
      case PayrollType.WPS:
        cancellationSummaryToShow_WPS.forEach(itm => {
          this.getControl(this.pages, 0, 1, itm).hidden = true
        })
        cancellationSummaryToHide_WPS.forEach(itm => {
          this.getControl(this.pages, 0, 1, itm).hidden = false
        })
        break;
      case PayrollType.WPS_PLUS:
        cancellationSummaryToShow_plus.forEach(itm => {
          this.getControl(this.pages, 0, 1, itm).hidden = true
        })
        cancellationSummaryToHide_plus.forEach(itm => {
          this.getControl(this.pages, 0, 1, itm).hidden = false
        })
        break;
    }

    this.creteButtons()
  }

  private cancelFile() {
    this.verificationService.showVerification(this.validateCancelResponse.generateChallengeAndOTP).subscribe((requestValidate: RequestValidate) => {
      this.wpsService.cancelFile({
        feedBackFilesDetails: this.fileDetails.salaryFileDetails,
        requestValidate: requestValidate
      }).subscribe({
        next: () => {
          this.result = this.fillResult()
          this.pageTitle.stepper = {
            stepCounter: 1,
            ofText: '',
            stepText: '',
            steps: ['', '']
          }
          this.startButtons = []
          this.endButtons = [this.dashboardButton, this.getPayrollButton()]
          this.stepperMoveNext(this.pageTitle)

        },
        error: (err) => {
          this.result = this.fillResult(err)
          this.pageTitle.stepper = {
            stepCounter: 1,
            ofText: '',
            stepText: '',
            steps: ['', '']
          }
          this.startButtons = []
          this.endButtons = [this.dashboardButton, this.getPayrollButton()]
          this.stepperMoveNext(this.pageTitle)
        }
      })
    })
  }

  private fillResult(err?: any): ResultModal {
    if (err) {
      return {
        type: "Error",
        title: err.ErrorResponse.errorDescription!,
        summary: undefined
      }
    } else {
      return {
        type: "Success",
        title: 'You Request Submitted',
        subTitle: 'public.thank',
        summary: undefined
      }
    }

  }

  private getPayrollButton(): ButtonModel {
    switch (this.getPayrollType()) {
      case PayrollType.WPS:
        return this.payrollButton
      case PayrollType.WPS_PLUS:
        this.payrollButton.text = 'payroll.payroll-wps-plus.buttons.go-back-to-wps-plus';
        return this.payrollButton
      default:
        return this.payrollButton
    }
  }
}
