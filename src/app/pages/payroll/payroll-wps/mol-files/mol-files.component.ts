import {Component} from '@angular/core';
import {PayrollBaseComponent} from "../../payroll-base/payroll-base.component";
import {MolFilesListReq} from "../../../../@core/model/rest/payroll/wps/mol-file/mol-files-list-req";
import {MolFilesListRes, WPSSalaryFileDSO} from "../../../../@core/model/rest/payroll/wps/mol-file/mol-files-list-res";
import {FormResult, PageModel} from "../../../../@core/model/dto/formModel";
import {FormButtonClickOutput} from "../../../../shared/form/form.component";
import {TitleModel} from "arb-design-library/model/title.model";
import {ButtonModel} from "arb-design-library/model/button.model";
import {SummaryModel} from "arb-design-library/model/summary.model";
import {ResultModal} from "../../../../@core/model/dto/result.modal";
import {Utils} from "../../../../@core/utility/Utils";
import {buildWpsMolFilesForm} from "../../mol-files.controls";
import {MultiMolFileDownloadReq} from "../../../../@core/model/rest/payroll/wps/mol-file/multi-mol-file-download-req";
import {PayrollPagesNames} from "../../payroll-pages-names";
import {SingleMolFileDownloadReq} from "../../../../@core/model/rest/payroll/wps/mol-file/single-mol-file-download-req";

@Component({
  selector: 'app-mol-files',
  templateUrl: './mol-files.component.html'
})
export class MolFilesComponent extends PayrollBaseComponent {
  pages: PageModel[] = [];
  pageTitle: TitleModel = {
    id: "WpsMolFilesComponentId",
    title: "payroll.payroll-wps.mol-files.page-name",
    stepper: {
      steps: ['', ''],
      stepCounter: 1,
      stepText: 'public.step',
      ofText: 'public.of',
    },
    showArrow: true
  };
  startButtons: ButtonModel[] = [this.cancelButton];
  endButtons: ButtonModel[] = [{id: "Download", type: "primary", text: "public.download", isDisable: false}];

  summary!: SummaryModel;
  result!: ResultModal;

  constructor() {
    super()
    Utils.setBreadcrumb([
      {
        text: 'payroll.main-page-name',
        url: PayrollPagesNames.PAYROLL
      }, {
        text: "payroll.payroll-wps.name",
        url: PayrollPagesNames.PAYROLL + '/employee/list/' + this.getPayrollType()
      },
      {
        text: "payroll.payroll-wps.mol-files.page-name",
        url: ""
      }
    ])
    this.payrollButton.text = "payroll.payroll-wps-plus.buttons.go-back-to-wps-plus"
    this.pages = [new PageModel(1, buildWpsMolFilesForm())];
    this.getData();

  }

  getData() {
    this.wpsService.getMolFilesList(this.buildMolFilesListReq()).subscribe({
      next: (res: MolFilesListRes) => {

        this.getControl(this.pages, 0, 0, "wpsMolFilesTable").controlOptions.data = res.listFile.items || [];
      },
      error: () => {
        this.getControl(this.pages, 0, 0, "wpsMolFilesTable").controlOptions.data = [];
      }
    });
  }


  private buildMolFilesListReq(): MolFilesListReq {
    return {
      search: false,
      page: 1,
      rows: 50
    }
  }

  onButtonClick(data: FormButtonClickOutput) {
    switch (data.buttonId) {
      case this.cancelButton.id:
      case this.payrollButton.id:
        this.goBackToPayroll();
        break
      case 'Download':
        this.downloadFiles();
        break
      case this.dashboardButton.id:
        this.goToDashBoard();
        break
      case PayrollPagesNames.ARROW_TITLE:
        this.goBackToPayroll()
        break
    }
  }


  private downloadFiles() {
    let control = this.getControl(this.pages, 0, 0, "wpsMolFilesTable");
    let MolFileList: MultiMolFileDownloadReq = {
      filesSelected: []
    }


    if (control.value) {
      if (control.value.length === 1) {
        let request: SingleMolFileDownloadReq = {file: control.controlOptions.selectedValues[0]}
        let service = this.wpsService.downloadSingleMolFiles(request).subscribe({
          next: (response) => {
            service.unsubscribe()
            this.result = this.fillResult();
            this.stepperMoveNext(this.pageTitle)
            Utils.saveDownloadedBlobFile(response, request.file.fileName)
            this.endButtons = [this.dashboardButton, this.payrollButton]
            this.startButtons = []
          },
          error: (err) => {
            service.unsubscribe()
            this.result = this.fillResult(err.ErrorResponse.errorDescription!)
            this.stepperMoveNext(this.pageTitle)
            this.endButtons = [this.dashboardButton, this.payrollButton]
            this.startButtons = []
          }
        })
      } else if (control.value.length > 1) {
        control.value.forEach((data: WPSSalaryFileDSO) => {
          MolFileList.filesSelected.push(data.fileName)
        })
        let service = this.wpsService.downloadMultiMolFiles(MolFileList).subscribe({
          next: (response) => {
            service.unsubscribe()
            this.result = this.fillResult();
            this.stepperMoveNext(this.pageTitle)
            Utils.saveDownloadedBlobFile(response, 'molFile.zip')
            this.endButtons = [this.dashboardButton, this.payrollButton]
            this.startButtons = []
          },
          error: (err) => {
            service.unsubscribe()
            this.result = this.fillResult(err.ErrorResponse.errorDescription!)
            this.stepperMoveNext(this.pageTitle)
            this.endButtons = [this.dashboardButton, this.payrollButton]
            this.startButtons = []
          }
        })
      }
    } else {
      control.controlOptions.data.forEach((data: WPSSalaryFileDSO) => {
        MolFileList.filesSelected.push(data.fileName)
      });
      let service = this.wpsService.downloadMultiMolFiles(MolFileList).subscribe({
        next: (response) => {
          service.unsubscribe()
          this.result = this.fillResult();
          this.stepperMoveNext(this.pageTitle)
          Utils.saveDownloadedBlobFile(response, 'molFile.zip')
          this.endButtons = [this.dashboardButton, this.payrollButton]
          this.startButtons = []
        },
        error: (err) => {
          service.unsubscribe()
          this.result = this.fillResult(err.ErrorResponse.errorDescription!)
          this.stepperMoveNext(this.pageTitle)
          this.endButtons = [this.dashboardButton, this.payrollButton]
          this.startButtons = []
        }
      })
    }


  }


  private fillResult(err?: string): ResultModal {
    if (err) {
      return {
        type: "Error",
        title: err,
        summary: undefined
      }
    } else {
      return {
        type: "Success",
        title: "payroll.payroll-wps.mol-files.result.success",
        summary: undefined
      }
    }
  }
}
