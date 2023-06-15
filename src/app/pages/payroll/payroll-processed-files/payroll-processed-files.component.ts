import {Component, OnInit} from '@angular/core';
import {PayrollBaseComponent} from "../payroll-base/payroll-base.component";
import {FormButtonClickOutput} from "../../../shared/form/form.component";
import {ProcessedFilesSearchReq} from "../../../@core/model/rest/payroll/processed-files/processed-files-search-req";
import {PageModel} from "../../../@core/model/dto/formModel";
import {
  buildProcessedFilesPage,
  buildRelatedFilesPopUp,
  WPS_HEADERS,
  WPS_PLUS_HEADERS
} from "./payroll-processed-files-controls";
import {TableControl} from "../../../@core/model/dto/control/table-control";
import {PopupOutputModel} from "../../../@core/model/dto/popup.model";
import {TitleModel} from "arb-design-library/model/title.model";
import {ButtonModel} from "arb-design-library/model/button.model";
import {SummaryModel} from "arb-design-library/model/summary.model";
import {ResultModal} from "../../../@core/model/dto/result.modal";
import {TabModel} from "arb-design-library/model/tab.model";
import {PayrollType} from "../payroll-type";
import {PayrollPagesNames} from "../payroll-pages-names";
import {AuthenticationUtils} from "../../../@core/utility/authentication-utils";

@Component({
  selector: 'app-payroll-processed-files',
  templateUrl: './payroll-process-files.component.html'
})
export class PayrollProcessedFilesComponent extends PayrollBaseComponent implements OnInit {
  processedFilesSearchReq!: ProcessedFilesSearchReq;
  private response: any;
  private relatedFiles: any;

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

  startButtons!: ButtonModel[];
  summary!: SummaryModel;
  result!: ResultModal;


  constructor() {
    super();
    this.drawPage()
    this.getTabsData()
  }

  ngOnInit(): void {
    this.getData(this.getControl(this.pages, 0, 0, "tabsControl").value)
  }

  getData(buttonId?: any) {
    this.processedFilesSearchReq = new ProcessedFilesSearchReq()
    if (buttonId) {
      if (buttonId == PayrollType.WPS_PLUS) {
        this.wpsPlusPayrollService.searchProcessedFiles(this.processedFilesSearchReq).subscribe({
          next: (res) => {
            this.response = res;
            this.modelAndListService.getList(['currency', 'payrollPaymentPurpose', 'bulkFilePurpose']).subscribe((props) => {
              for (const file of this.response.listFile.items) {
                let _paymentPurposeValue = file.paymentPurpose
                file.paymentPurposeValue = props.payrollPaymentPurpose[_paymentPurposeValue]
                file.totalRecords = file.rajhiRecordCount + file.localRecordCount;
              }

            })
            this.getControl(this.pages, 0, 0, 'processedFilesTable').controlOptions.headers=WPS_PLUS_HEADERS
            this.getControl(this.pages, 0, 0, 'processedFilesTable').controlOptions.data = this.response.listFile.items;
            this.getControl(this.pages, 0, 0, 'processedFilesTable').controlOptions.total = this.response.listFile.total
            this.getControl(this.pages, 0, 0, 'processedFilesTable').controlOptions.paginationValue = {
              page: 1,
              size: this.response.listFile.size
            }
          },
          error: () => {
            this.getControl(this.pages, 0, 0, 'processedFilesTable').controlOptions.data = [];
          }
        });
      } else if (buttonId == PayrollType.WPS) {
        this.wpsService.searchProcessedFiles(this.processedFilesSearchReq).subscribe({
          next: (res) => {
            this.response = res;
            this.modelAndListService.getList(['currency', 'payrollPaymentPurpose', 'bulkFilePurpose']).subscribe((props) => {
              for (const file of this.response.listFile.items) {
                let _paymentPurposeValue = file.paymentPurpose
                file.paymentPurposeValue = props.payrollPaymentPurpose[_paymentPurposeValue]
                file.totalRecords = file.rajhiRecordCount + file.localRecordCount;
              }
            })
            this.getControl(this.pages, 0, 0, 'processedFilesTable').controlOptions.headers=WPS_HEADERS
            this.getControl(this.pages, 0, 0, 'processedFilesTable').controlOptions.data = this.response.listFile.items;
            this.getControl(this.pages, 0, 0, 'processedFilesTable').controlOptions.total = this.response.listFile.total
            this.getControl(this.pages, 0, 0, 'processedFilesTable').controlOptions.paginationValue = {
              page: 1,
              size: this.response.listFile.size
            }
          },
          error: () => {
            this.getControl(this.pages, 0, 0, 'processedFilesTable').controlOptions.data = [];
          }
        });
      } else if (buttonId == PayrollType.STANDARD) {
        this.wpsService.searchProcessedFiles(this.processedFilesSearchReq).subscribe({
          next: (res) => {
            this.response = res;
            this.modelAndListService.getList(['currency', 'payrollPaymentPurpose', 'bulkFilePurpose']).subscribe((props) => {
              for (const file of this.response.listFile.items) {
                let _paymentPurposeValue = file.paymentPurpose
                file.paymentPurposeValue = props.payrollPaymentPurpose[_paymentPurposeValue]
                file.totalRecords = file.rajhiRecordCount + file.localRecordCount;
              }

            })
            this.getControl(this.pages, 0, 0, 'processedFilesTable').controlOptions.data = this.response.listFile.items;
            this.getControl(this.pages, 0, 0, 'processedFilesTable').controlOptions.total = this.response.listFile.total
            this.getControl(this.pages, 0, 0, 'processedFilesTable').controlOptions.paginationValue = {
              page: 1,
              size: this.response.listFile.size
            }
          },
          error: () => {
            this.getControl(this.pages, 0, 0, 'processedFilesTable').controlOptions.data = [];
          }
        });
      } else if (buttonId == PayrollType.WMS) {
        this.wpsService.searchProcessedFiles(this.processedFilesSearchReq).subscribe({
          next: (res) => {
            this.response = res;
            this.modelAndListService.getList(['currency', 'payrollPaymentPurpose', 'bulkFilePurpose']).subscribe((props) => {
              for (const file of this.response.listFile.items) {
                let _paymentPurposeValue = file.paymentPurpose
                file.paymentPurposeValue = props.payrollPaymentPurpose[_paymentPurposeValue]
                file.totalRecords = file.rajhiRecordCount + file.localRecordCount;
              }

            })
            this.getControl(this.pages, 0, 0, 'processedFilesTable').controlOptions.data = this.response.listFile.items;
            this.getControl(this.pages, 0, 0, 'processedFilesTable').controlOptions.total = this.response.listFile.total
            this.getControl(this.pages, 0, 0, 'processedFilesTable').controlOptions.paginationValue = {
              page: 1,
              size: this.response.listFile.size
            }
          },
          error: () => {
            this.getControl(this.pages, 0, 0, 'processedFilesTable').controlOptions.data = [];
          }
        });
      }
    }

    (this.getControl(this.pages, 0, 0, "processedFilesTable") as TableControl).buttonClicked?.subscribe((relatedFile) => {
      this.getRelated(relatedFile.row, this.response.payrollCompanyDetails)
    });
  }

  onButtonClick(button: FormButtonClickOutput) {
    switch (button.buttonId) {
      case 'Back':
        this.backClick();
        break
      case PayrollType.STANDARD:
      case PayrollType.WPS:
      case PayrollType.WPS_PLUS:
      case PayrollType.WMS:
        void this.router.navigate([PayrollPagesNames.PAYROLL + '/' + PayrollPagesNames.PROCESSED_FILES + '/' + button.buttonId])
        this.getData(button.buttonId)
        break
      case PayrollPagesNames.ARROW_TITLE:
        this.goToPayrollLanding()
        break
    }
  }

  private backClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.goBackToPayroll()
        break
      case 2:
        break
      default:
        this.goToPayrollLanding()
        break
    }
  }

  private drawPage() {
    this.pageTitle.id = "processed-files-page-title-id";
    this.pageTitle.title = "payroll.processedFiles.name";
    this.pageTitle.showArrow = true
    this.breadcrumbService.setBreadcrumb([
      {
        text: "payroll.main-page-name",
        url: PayrollPagesNames.PAYROLL + '/'
      },
      {
        text: "payroll.processedFiles.name",
        url: PayrollPagesNames.PROCESSED_FILES + '/',
      },

    ])
    this.pageTitle.endButtons = []
    this.endButtons = []
    this.pages = [new PageModel(1, buildProcessedFilesPage())];
  }


  private getRelated(row: any, payrollCompanyDetails: any) {
    this.wpsService.getRelatedFiles({
      payrollCompanyDetails: payrollCompanyDetails,
      file: row,
      page: 1,
      rows: 50
    }).subscribe((relatedFiles) => {
      this.modelAndListService.getList(['payrollFileType']).subscribe((props) => {
        this.relatedFiles = relatedFiles.files;
        for (const file of this.relatedFiles) {
          file.fileType = props.payrollFileType[file.type]
        }
        this.popService.showPopup({
          title: "payroll.processedFiles.popup.title",
          form: buildRelatedFilesPopUp(this.relatedFiles)
        }).subscribe((model: PopupOutputModel) => {
          if (model.tableButtonOutputModel?.buttonId === "processed-related-file") {
            this.openRelatedFiles(model, row, payrollCompanyDetails)
            this.popService.dismiss()
          }else {
            this.popService.dismiss()
          }
        })
      })
    })


  }

  private openRelatedFiles(model: PopupOutputModel, mainFile: any, payrollCompanyDetails: any) {
    void this.router.navigate(['payroll/' + model.tableButtonOutputModel?.buttonId, this.getPayrollType()],
      {
        state: {
          payrollCompanyDetails: payrollCompanyDetails,
          mainFile: mainFile,
          selectedFile: model.tableButtonOutputModel?.row,
          relatedFilesList: this.relatedFiles,
          productName: this.getControl(this.pages, 0, 0, "tabsControl").value,
          accountList: this.response.accountListLocal
        }
      })
  }

  private getTabsData() {
    let tabs: TabModel[] = [];
    if (AuthenticationUtils.hasAccess('WPS_MENU')) {
      tabs.push({text:'payroll.processedFiles.tabs.wps' , value: PayrollType.WPS})
    }
    if (AuthenticationUtils.hasAccess('WPS_PLUS_MENU')) {
      tabs.push({text: 'payroll.processedFiles.tabs.wps-plus', value: PayrollType.WPS_PLUS})
    }
    // if (AuthenticationUtils.hasAccess('WMSPayrollViewProcessedFiles')) {
    //   tabs.push({text: PayrollType.WMS, value: PayrollType.WMS})
    // }
    // if (AuthenticationUtils.hasAccess('PayrollViewProcessedFiles')) {
    //   tabs.push({text: 'payroll.processedFiles.tabs.standard', value: PayrollType.STANDARD})
    // }
    this.getControl(this.pages, 0, 0, "tabsControl").controlOptions.tabs = tabs

    this.setTabsValue(tabs)

  }

  private setTabsValue(tabs: TabModel[]) {
    if (this.getPayrollType() != PayrollPagesNames.PROCESSED_FILES && this.getPayrollType()) {
      this.getControl(this.pages, 0, 0, "tabsControl").setValue(this.getPayrollType())
    } else {
      this.getControl(this.pages, 0, 0, "tabsControl").setValue(tabs[0].value)
    }
    void this.router.navigate([PayrollPagesNames.PAYROLL, PayrollPagesNames.PROCESSED_FILES, this.getControl(this.pages, 0, 0, "tabsControl").value])
  }


}
