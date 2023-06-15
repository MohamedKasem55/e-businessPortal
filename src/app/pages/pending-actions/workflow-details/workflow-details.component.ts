import { Component, OnInit } from '@angular/core';
import { PendingActionsService } from 'app/@core/service/pending-actions/pending-actions-service';
import { TableHeaderModel } from 'arb-design-library/model/table-header.model';
import { PendingActionPage, WorkflowType } from 'app/@core/model/dto/pending-actions-model';
import { FormResult, PageModel } from 'app/@core/model/dto/formModel';
import { getHeaders, getPageTitle, workflowDetailsFrom } from './workflow-details.controls';
import { TabModel } from 'arb-design-library/model/tab.model';
import { TransactionFollowBase } from 'app/shared/transaction-follow-base/transaction-follow-base';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { TitleModel } from 'arb-design-library/model/title.model';
import { ButtonModel } from 'arb-design-library/model/button.model';

@Component({
  selector: 'app-workflow-details',
  templateUrl: './workflow-details.component.html',
})
export class WorkflowDetailsComponent extends TransactionFollowBase implements OnInit {
  selectedTab = 1;
  override pageTitle: TitleModel = getPageTitle();
  tabs: TabModel[] = [];
  pendingActionsData!: PendingActionPage;
  accountNumber: any;
  headers: TableHeaderModel[] = []
  override endButtons: ButtonModel[] = [];
  override startButtons: ButtonModel[] = [];

  constructor(private pendingActionsService: PendingActionsService) {
    super();
    const tab = this.router.getCurrentNavigation()?.extras.state ? this.router.getCurrentNavigation()?.extras.state : 0;
    this.selectedTab = tab ? tab!['tabSelected'] : 0;
    this.pendingActionsData = this.pendingActionsService.getPendingAction();
    this.pages.push(new PageModel(1, workflowDetailsFrom()));

    this.getControl(0, 0, "tabsControl").setValue(this.selectedTab);
    if (this.pendingActionsData) {
      this.buildHeaders();
      this.ShowPageByWorkflow();
      this.getControl(0, 0, "tabsControl").hidden = true;

      if (this.pendingActionsData.workflowTabs && this.pendingActionsData.workflowTabs.length > 0) {
        this.getControl(0, 0, "tabsControl").hidden = false;
        this.getControl(0, 0, "tabsControl").controlOptions.tabs = this.pendingActionsData.workflowTabs;
      } else {
        let tabs: TabModel[] = [];
        this.pendingActionsData.workflowType?.forEach((item: WorkflowType, index: number) => {
          if (item.text) {
            tabs.push({
              text: item.text,
              value: index.toString()
            });
          }
        });
        if (tabs.length) {
          this.getControl(0, 0, "tabsControl").hidden = false;
          this.getControl(0, 0, "tabsControl").controlOptions.tabs = tabs;
        }
      }

    } else {
      void this.router.navigate(['/pendingActions/pending-actions-list'])
    }

    this.pageTitle.title = this.translate.instant(this.pendingActionsData.title) + " " + this.translate.instant('pending-actions.workflow-details');
    this.getControl(0, 0, "tableLevels").controlOptions.title = this.pendingActionsData.title;
    this.getControl(0, 0, "selectAccount").valueChanges.subscribe((resVal: any) => {
      if (resVal['value'] !== '') {
        this.getUserlevels(resVal)
      }
    })
  }

  ngOnInit() {
  }

  getAccounts() {
    this.pendingActionsService.getUserAccount().subscribe((data: any) => {
      this.getControl(0, 0, "selectAccount").controlOptions.options = data.accountList;
      this.getControl(0, 0, "selectAccount").setValue(data.accountList[0]);
      this.getUserlevels(data.accountList[0]);
    })
  }

  getUserlevels(accountnumber?: any) {
    const request: any = {
      paymentTypes: [this.pendingActionsData.workflowType![this.selectedTab].type],
      accountNumber: accountnumber['value'] ? accountnumber['value']['fullAccountNumber'] : accountnumber['fullAccountNumber']
    }
    this.pendingActionsService.getUserAccountsLevels(request).subscribe((data: any) => {
      data['workflowTypePaymentList'][0]['details'].map(function (detailsLevel: any, index: string | number) {
        detailsLevel['L1'] = detailsLevel['levels'][0];
        detailsLevel['L2'] = detailsLevel['levels'][1];
        detailsLevel['L3'] = detailsLevel['levels'][2];
        detailsLevel['L4'] = detailsLevel['levels'][3];
        detailsLevel['L5'] = detailsLevel['levels'][4];
      })
      this.getControl(0, 0, "tableLevels").controlOptions.data = data['workflowTypePaymentList'].length > 0 ? data['workflowTypePaymentList'][0]['details'] : []
    })
  }

  getNonFinanciallevels() {
    const request: any = {
      paymentTypes: [this.pendingActionsData.workflowType![this.selectedTab].type]
    }
    this.pendingActionsService.getUserNonFinancialLevels(request).subscribe((data: any) => {
      for (let x = 0; x < data['workflowList'].length; x++) {
        let levels = {}
        data['workflowList'][x].levels.forEach(
          (currElement: boolean, index: number) => {
            let level = { [`L${index + 1}`]: currElement };
            levels = { ...levels, ...level };
            data['workflowList'][x] = { ...data['workflowList'][x], ...levels };
          })
      }
      this.getControl(0, 0, "tableLevels").controlOptions.data = data['workflowList'].length > 0 ? data['workflowList'] : [];
    })
  }

  buildHeaders() {
    const isFinancial = this.pendingActionsData!.workflowType ? this.pendingActionsData!.workflowType[this.selectedTab].isFinancial : false;
    this.getControl(0, 0, "tableLevels").controlOptions.headers = getHeaders(isFinancial);
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'arrowTitle':
        this.location.back();
        break;
      case "0":
      case "1":
      case "2":
      case "3":
        this.tabChanged(formButtonClickOutput.buttonId);
    }
  }

  override onResultChanged(data: FormResult[]): void {
    let valid = true;
    data.forEach(item => {
      valid = valid && item.valid;
    })
    this.endButtons[0].isDisable = !valid;
  }

  tabChanged(index: string) {
    this.getControl(0, 0, "selectAccount").controlOptions.options = [];
    this.getControl(0, 0, "tableLevels").controlOptions.data = [];
    if (parseInt(index) || index == "0") {
      this.selectedTab = parseInt(index);
    }
    this.buildHeaders();
    this.ShowPageByWorkflow()
  }

  ShowPageByWorkflow() {
    if (this.pendingActionsData && this.pendingActionsData.workflowType && this.pendingActionsData.workflowType[this.selectedTab].isFinancial) {
      this.getControl(0, 0, "selectAccount").setRequired(true);
      this.getControl(0, 0, "selectAccount").hidden = false;
      this.getControl(0, 0, "title").hidden = false;
      this.getControl(0, 0, "selectAccount").controlOptions.options = [];
      this.getAccounts();
    } else {
      this.getControl(0, 0, "selectAccount").hidden = true;
      this.getControl(0, 0, "title").hidden = true;
      this.getNonFinanciallevels()
    }
  }
}
