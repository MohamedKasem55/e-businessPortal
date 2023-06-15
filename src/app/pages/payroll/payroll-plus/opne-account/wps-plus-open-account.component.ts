import {Component} from '@angular/core';
import {PayrollBaseComponent} from "../../payroll-base/payroll-base.component";
import {FormButtonClickOutput} from "../../../../shared/form/form.component";
import {TitleModel} from "arb-design-library/model/title.model";
import {ButtonModel} from "arb-design-library/model/button.model";
import {SummaryModel} from "arb-design-library/model/summary.model";
import {ResultModal} from "../../../../@core/model/dto/result.modal";
import {FormModel, PageModel} from "../../../../@core/model/dto/formModel";
import {PayrollPagesNames} from "../../payroll-pages-names";
import {buildForm, getSearchForm} from "./wps-plus-open-account-controls";
import {TableControl} from "../../../../@core/model/dto/control/table-control";
import {Utils} from "../../../../@core/utility/Utils";
import {TableButtonOutputModel} from "arb-design-library/model/table-button-output.model";
import {PopupOutputModel} from "../../../../@core/model/dto/popup.model";
import {OpenAccountTrackerListReq} from "../../../../@core/model/rest/payroll/wps-plus/request-open-account/open-account-tracker-list-req";
import {PaginationValueModel} from "arb-design-library/model/pagination.model";
import {WPSPlusAccountStatusDTO} from "../../../../@core/model/rest/payroll/wps-plus/request-open-account/open-account-tracker-details-req";

@Component({
  selector: 'app-wps-plus-open-account',
  templateUrl: './wps-plus-open-account.component.html'
})
export class WpsPlusOpenAccountComponent extends PayrollBaseComponent {
  pages: PageModel[] = [new PageModel(1, buildForm())];
  pageTitle: TitleModel = {
    id: "wps-plus-open-account",
    title: "payroll.payroll-wps-plus.open-account.page-name",
    endButtons: [
      {
        id: PayrollPagesNames.UPLOAD_FILES,
        type: "secondary",
        text: "payroll.payroll-wps-plus.open-account.download-file"
      },
      {
        id: PayrollPagesNames.RECORDS_DETAILS,
        type: "secondary",
        text: "payroll.payroll-wps-plus.open-account.rejected-records"
      }
    ],
  };
  startButtons: ButtonModel[] = [{
    id: "Cancel",
    type: "secondary",
    text: "public.cancel"
  }];
  endButtons: ButtonModel[] = [];
  summary!: SummaryModel;
  result!: ResultModal;
  openAccountTrackerListReq!: OpenAccountTrackerListReq;
  searchForm: FormModel = getSearchForm();

  constructor() {
    super()
    this.setTrackerListReq()
    this.getData();

    (this.getControl(this.pages, 0, 0, "masterRecordsTable") as TableControl).externalPagination?.subscribe((data: PaginationValueModel) => {
      this.onTablePagination(data);
    });

    (this.getControl(this.pages, 0, 0, "masterRecordsTable") as TableControl).onFilterClick?.subscribe(() => {
      this.openSearch();
    })
  }

  onTablePagination(data: PaginationValueModel) {
    this.setTrackerListReq({offset: data.page, maxRecs: data.size});
    this.getData()
  }

  setTrackerListReq(options?: { offset?: number, maxRecs?: number, batchName?: string }) {
    this.openAccountTrackerListReq = {
      offset: options?.offset || 1,
      maxRecs: options?.maxRecs || 50,
      batchName: options?.batchName
    }

  }

  onButtonClick(input: FormButtonClickOutput) {
    switch (input.buttonId) {
      case 'arrowTitle':
        this.goBackToPayroll()
        break
      case PayrollPagesNames.ON_BOARDING_NEW_EMPLOYEES:
      case PayrollPagesNames.UPLOAD_FILES:
      case PayrollPagesNames.RECORDS_DETAILS:
        void this.router.navigate([PayrollPagesNames.PAYROLL, input.buttonId, this.getPayrollType()])
        break
      case 'Cancel':
        this.goBackToPayroll()
    }

  }


  getData() {
    this.wpsPlusPayrollService.getPendingEmployeesOpenAccount(this.openAccountTrackerListReq).subscribe({
      next: (res) => {
      if (!Utils.isEmptyOrNullList(res.wpsPlusTracker)) {
        this.getControl(this.pages, 0, 0, 'masterRecordsTable').controlOptions.data = res.wpsPlusTracker;
      } else {
        this.getControl(this.pages, 0, 0, 'masterRecordsTable').controlOptions.data = [];
      }
      (this.getControl(this.pages, 0, 0, 'masterRecordsTable') as TableControl).buttonClicked.subscribe((data: TableButtonOutputModel) => {
        switch (data.buttonId) {
          case'batchName':
            this.router.navigate([PayrollPagesNames.PAYROLL, PayrollPagesNames.RECORDS_DETAILS, this.getPayrollType()],
              {state: {data: data.row}})
            break
          case 'inProgressCount':
            this.router.navigate([PayrollPagesNames.PAYROLL, PayrollPagesNames.RECORDS_DETAILS, this.getPayrollType()],
              {
                state: {
                  data: data.row,
                  status: WPSPlusAccountStatusDTO.IN_PROGRESS
                }
              })
            break
        }
      })
    }, error: () => {
      this.getControl(this.pages, 0, 0, 'masterRecordsTable').controlOptions.data = [];
    }});

  }

  private openSearch() {
    this.popService.showPopup({form: this.searchForm}).subscribe((res: PopupOutputModel) => {
      if (res.buttonId == "search") {
        this.popService.dismiss();
        this.setTrackerListReq({batchName: res.controls['batchName'].value})
        this.getData()
        this.getControl(this.pages, 0, 0, "masterRecordsTable").controlOptions.filterIsActive = res.controls!["batchName"].value != '';
      } else if (res.buttonId == "reset") {
        this.popService.dismiss();
        res.controls!['batchName'].setValue('')
        this.setTrackerListReq();
        this.getData()
      } else {
        this.popService.dismiss();
      }
    })
  }
}
