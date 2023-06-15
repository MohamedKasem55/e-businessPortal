import {Component} from '@angular/core';
import {FormButtonClickOutput} from "../../../../../shared/form/form.component";
import {PageModel} from "../../../../../@core/model/dto/formModel";
import {TitleModel} from "arb-design-library/model/title.model";
import {ButtonModel} from "arb-design-library/model/button.model";
import {SummaryModel} from "arb-design-library/model/summary.model";
import {ResultModal} from "../../../../../@core/model/dto/result.modal";
import {PayrollBaseComponent} from "../../../payroll-base/payroll-base.component";
import {PayrollPagesNames} from "../../../payroll-pages-names";
import {buildForm} from "./records-details-controls";
import {
  OpenAccountTrackerDetailsReq,
  WPSPlusAccountStatusDTO
} from "../../../../../@core/model/rest/payroll/wps-plus/request-open-account/open-account-tracker-details-req";
import {TableControl} from "../../../../../@core/model/dto/control/table-control";

@Component({
  selector: 'app-records-details',
  templateUrl: './wps-plus-records-details.component.html'
})
export class WpsPlusRecordsDetailsComponent extends PayrollBaseComponent {
  pages: PageModel[] = [new PageModel(0, buildForm())];
  pageTitle: TitleModel = {
    id: "wps-plus-open-account-records-details",
    title: "payroll.payroll-wps-plus.open-account.records-details.page-name"
  };
  startButtons: ButtonModel[] = [{
    id: "Cancel",
    type: "secondary",
    text: "public.cancel"
  }];
  endButtons: ButtonModel[] = [
    {
      id: PayrollPagesNames.RE_INITIATE,
      type: "secondary",
      text: "payroll.payroll-wps-plus.open-account.records-details.buttons.re-innate-button",
      isDisable: true
    }
  ];
  summary!: SummaryModel;
  result!: ResultModal;
  openAccountTrackerDetailsReq!: OpenAccountTrackerDetailsReq;

  constructor() {
    super()
    if (history.state.data) {
      if (history.state.data.inProgressCount < 1) {
        this.endButtons = []
      }
      this.setTrackerDetailsReq(history.state.data.batchReference, history.state.status);
    } else {
      this.setTrackerDetailsReq();
    }
    this.getData();
  }


  onButtonClick(data: FormButtonClickOutput) {
    switch (data.buttonId) {
      case 'Cancel':
        void this.router.navigate([PayrollPagesNames.PAYROLL, PayrollPagesNames.REQUEST_OPEN_ACCOUNT, this.getPayrollType()]);
        break
      case PayrollPagesNames.RE_INITIATE:
        void this.router.navigate([PayrollPagesNames.PAYROLL, PayrollPagesNames.RE_INITIATE, this.getPayrollType()],
          {state: {data: this.getControl(this.pages, 0, 0, "recordsTable").controlOptions.selectedValues}})
    }
  }

  getData() {
    let control = (this.getControl(this.pages, 0, 0, "recordsTable") as TableControl);
    this.wpsPlusPayrollService.getEmployeesOpenAccountDetails(this.openAccountTrackerDetailsReq).subscribe({
      next: (res) => {
      control.controlOptions.data = res.employeesList;
      control.valueChanges.subscribe(res => {
        this.onSelectChange(res)
      })
    },
    error: () => {
      control.controlOptions.data = [];
    }});
  }

  setTrackerDetailsReq(batchRef?: string, accountStatus?: WPSPlusAccountStatusDTO,) {
    this.openAccountTrackerDetailsReq = {
      offset: 1,
      maxRecs: 50,
      accountStatus: accountStatus,
      batchReference: batchRef
    }
  }

  onSelectChange(employeePayrolls: any) {
    if (employeePayrolls.value.length > 0) {
      this.changeButtonsStatus(false)
      this.endButtons[0].text = this.translate.instant("payroll.payroll-wps-plus.open-account.records-details.buttons.re-innate-button-w-value",
        {value: employeePayrolls.value.length})
    } else {
      this.changeButtonsStatus(true)
      this.endButtons[0].text = 'payroll.payroll-wps-plus.open-account.records-details.buttons.re-innate-button'
    }
  }

  private changeButtonsStatus(status: boolean) {
    this.endButtons.find(button => {
      button.isDisable = status
    })
  }

  ondDataSelect() {
    if ((this.getControl(this.pages, 0, 0, "recordsTable") as TableControl).controlOptions.selectedValues!.length > 0) {
      this.onSelectChange(this.getControl(this.pages, 0, 0, "recordsTable").controlOptions.selectedValues)
    }
  }
}
