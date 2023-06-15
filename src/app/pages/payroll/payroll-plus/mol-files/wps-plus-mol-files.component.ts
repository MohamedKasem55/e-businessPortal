import {Component} from '@angular/core';
import {PayrollBaseComponent} from "../../payroll-base/payroll-base.component";
import {FormModel, FormResult, PageModel} from "../../../../@core/model/dto/formModel";
import {TitleModel} from "arb-design-library/model/title.model";
import {ButtonModel} from "arb-design-library/model/button.model";
import {SummaryModel} from "arb-design-library/model/summary.model";
import {ResultModal} from "../../../../@core/model/dto/result.modal";
import {MolFilesListRes, WPSSalaryFileDSO} from "../../../../@core/model/rest/payroll/wps/mol-file/mol-files-list-res";
import {MolFilesListReq} from "../../../../@core/model/rest/payroll/wps/mol-file/mol-files-list-req";
import {FormButtonClickOutput} from "../../../../shared/form/form.component";
import {MultiMolFileDownloadReq} from "../../../../@core/model/rest/payroll/wps/mol-file/multi-mol-file-download-req";
import {Utils} from "../../../../@core/utility/Utils";
import {buildWpsMolFilesForm, getFilterForm} from "./wps-plus-mol-files-controls";
import {SingleMolFileDownloadReq} from "../../../../@core/model/rest/payroll/wps/mol-file/single-mol-file-download-req";
import {PayrollPagesNames} from "../../payroll-pages-names";
import { TableControl } from 'app/@core/model/dto/control/table-control';
import { PopupOutputModel } from 'app/@core/model/dto/popup.model';

@Component({
  selector: 'app-wps-plus-mol-files',
  templateUrl: './wps-plus-mol-files.component.html'
})
export class WpsPlusMolFilesComponent extends PayrollBaseComponent {
  pages: PageModel[] = [];
  pageTitle: TitleModel = {
    id: "WpsMolFilesComponentId",
    title: "payroll.payroll-wps.mol-files.page-name",
    stepper: {
      steps: ['', ''],
      stepCounter: 1,
      stepText: 'public.step',
      ofText: 'public.of',
    }
  };
  startButtons: ButtonModel[] = [this.cancelButton];
  endButtons: ButtonModel[] = [{id: "Download", type: "primary", text: "public.download", isDisable: false}];

  summary!: SummaryModel;
  result!: ResultModal;

  filterForm: FormModel = getFilterForm();

  constructor() {
    super()
    this.payrollButton.text = "payroll.payroll-wps-plus.buttons.go-back-to-wps-plus"
    this.pages = [new PageModel(1, buildWpsMolFilesForm())];
    (
      this.getControl(this.pages, 0, 0, 'wpsMolFilesTable') as TableControl
    ).onFilterClick?.subscribe(() => {
      this.openSearch();
    });
    this.getData();
  }


  getData(params?: MolFilesListReq) {
    const reqParams: MolFilesListReq = params || {
      search: false,
      page: 1,
      rows: 50
    };
    this.wpsPlusPayrollService.getMolFilesList(reqParams).subscribe({
      next: (res: MolFilesListRes) => {
        if (this.filterForm.controls['debitAccount'].controlOptions.options.length == 0) {
          this.filterForm.controls['debitAccount'].controlOptions.options = res.accountList;
        }
        this.getControl(this.pages, 0, 0, "wpsMolFilesTable").controlOptions.data = res.listFile.items || [];
      },
      error: () => {
        this.getControl(this.pages, 0, 0, "wpsMolFilesTable").controlOptions.data = [];
      }
    });
  }

  openSearch(): void {
    this.popService
      .showPopup({ image: '', form: this.filterForm })
      .subscribe((res: PopupOutputModel) => {
        switch (res.buttonId) {
          case 'cancel':
            this.popService.dismiss();
            break;
          case 'reset':
            this.filterForm.controls['batchName'].setValue('');
            this.filterForm.controls['debitAccount'].setValue('');
            this.filterForm.controls['amountfrom'].setValue('');
            this.filterForm.controls['amountto'].setValue('');
            this.filterForm.controls['initiationDatefrom'].setValue('');
            this.filterForm.controls['initiationDateto'].setValue('');
            this.filterForm.controls['paymentDatefrom'].setValue('');
            this.filterForm.controls['paymentDateto'].setValue('');
            this.filterForm.controls['systemFileName'].setValue('');
            this.filterForm.controls['customerReference'].setValue('');
            this.getData();
            this.popService.dismiss();
            break;
          case 'search':
            const reqParams: MolFilesListReq = {
              search: false,
              page: 1,
              rows: 50,
            };
            reqParams.batchName = this.filterForm.controls['batchName']?.value
              ? this.filterForm.controls['batchName']?.value
              : undefined;
            reqParams.debitAccount =
              this.filterForm.controls[
                'debitAccount'
              ]?.value?.fullAccountNumber;
            reqParams.amountfrom = this.filterForm.controls['amountfrom']?.value
              ? this.filterForm.controls['amountfrom']?.value?.toString()
              : undefined;
            reqParams.amountto = this.filterForm.controls['amountto']?.value
              ? this.filterForm.controls['amountto']?.value?.toString()
              : undefined;
            if (this.filterForm.controls['initiationDatefrom']?.value) {
              reqParams.initiationDatefrom = Utils.getDateFormatted(
                this.filterForm.controls['initiationDatefrom']?.value,
                'yyyy-MM-dd'
              );
            }
            if (this.filterForm.controls['initiationDateto']?.value) {
              reqParams.initiationDateto = Utils.getDateFormatted(
                this.filterForm.controls['initiationDateto']?.value,
                'yyyy-MM-dd'
              );
            }
            if (this.filterForm.controls['paymentDatefrom']?.value) {
              reqParams.paymentDatefrom = Utils.getDateFormatted(
                this.filterForm.controls['paymentDatefrom']?.value,
                'yyyy-MM-dd'
              );
            }
            if (this.filterForm.controls['paymentDateto']?.value) {
              reqParams.paymentDateto = Utils.getDateFormatted(
                this.filterForm.controls['paymentDateto']?.value,
                'yyyy-MM-dd'
              );
            }
            reqParams.systemFileName = this.filterForm.controls[
              'systemFileName'
            ]?.value
              ? this.filterForm.controls['systemFileName']?.value
              : undefined;
            reqParams.customerReference = this.filterForm.controls[
              'customerReference'
            ]?.value
              ? this.filterForm.controls['customerReference']?.value
              : undefined;
            this.getData(reqParams);
            this.popService.dismiss();
            break;
        }
      });
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

