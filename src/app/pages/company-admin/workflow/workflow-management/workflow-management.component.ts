import {Component} from '@angular/core';
import {ModelAndListService} from "../../../../@core/service/base/modelAndList.service";
import {Utils} from "../../../../@core/utility/Utils";
import {
  COM_AD,
  COM_AD_WORKFLOW_MANAGEMENT,
  COM_AD_WORKFLOW_MANAGEMENT_E_TRADE,
  COM_AD_WORKFLOW_MANAGEMENT_NON_FINANCIAL
} from "../../../../@core/constants/pages-urls-constants";
import {TransactionFollowBase} from "../../../../shared/transaction-follow-base/transaction-follow-base";
import {FormModel, PageModel} from "../../../../@core/model/dto/formModel";
import {
  getAccountRulesAlerts,
  getAccountRulesForm,
  getAccountRulesPageTitle,
  getAccountRulesTableControl,
  getAccountRulesTitleControl,
  getCompanyAdminButton,
  getDeleteButtonHeader,
  getPageTitle,
  getSearchForm,
  getStepper,
  getSummaryTitle,
  getWorkflow
} from "./workflow-management-controls";
import {FormButtonClickOutput} from "../../../../shared/form/form.component";
import {
  WorkflowManagementService
} from "../../../../@core/service/company-admin/workflow/workflow-management/workflow-management.service";
import {TableControl} from "../../../../@core/model/dto/control/table-control";
import {PopupService} from "../../../../@core/service/base/popup.service";
import {Privilege} from "../../../../@core/model/rest/common/Privilege";
import {TableButtonOutputModel} from "arb-design-library/model/table-button-output.model";
import {
  WorkflowAccountBatch
} from "../../../../@core/model/rest/company-admin/workflow/workflow-management/get-account-levels-res";
import {TitleControl} from "../../../../@core/model/dto/control/title-control";
import {
  ValidateAccountWorkflowReq
} from "../../../../@core/model/rest/company-admin/workflow/workflow-management/validate-account-workflow-req";
import {
  ValidateAccountWorkflowRes
} from "../../../../@core/model/rest/company-admin/workflow/workflow-management/validate-account-workflow-res";
import {ServiceLocator} from "../../../../@core/service/base/service-locator.service";
import {PopupOutputModel} from "../../../../@core/model/dto/popup.model";
import {SelectionControl} from "../../../../@core/model/dto/control/selection-control";
import {AccountsReq} from "../../../../@core/model/rest/accounts/accounts-req";
import {TitleModel} from "arb-design-library/model/title.model";
import {SummarySectionModel} from "arb-design-library/model/summary-section.model";

@Component({
  selector: 'workflow-management',
  templateUrl: './workflow-management.component.html',
})
export class WorkflowManagementComponent extends TransactionFollowBase {

  privileges: Privilege[] = []
  workflowTypePaymentList: WorkflowAccountBatch[] = [];
  editedList: any[] = [];
  validateItems!: ValidateAccountWorkflowRes;
  accounts: any[] = [];
  searchForm: FormModel = getSearchForm();

  protected popupService: PopupService = ServiceLocator.injector.get(PopupService);

  constructor(public modelAndListService: ModelAndListService,
              public workflowManagementService: WorkflowManagementService) {
    super();
    Utils.setBreadcrumb([
      {
        text: 'company-admin.name',
        url: '/company-admin',
      },
      {
        text: 'workflow.workflow',
        url: COM_AD_WORKFLOW_MANAGEMENT
      },
    ]);
    this.pageTitle = getPageTitle();
    this.setAccountsTable();
    this.endButtons = [];
    this.startButtons = [];
  }

  override onButtonClick(button: FormButtonClickOutput) {
    this.alert = null;
    if (button.buttonId.includes('add')) {
      this.addNewRule(button);
    } else {
      switch (button.buttonId) {
        case "account-rules":
          break;
        case "non-financial":
          void this.router.navigateByUrl(`/${COM_AD}` + `/${COM_AD_WORKFLOW_MANAGEMENT}` + `/${COM_AD_WORKFLOW_MANAGEMENT_NON_FINANCIAL}`)
          break;
        case "e-trade-rules":
          void this.router.navigateByUrl(`/${COM_AD}` + `/${COM_AD_WORKFLOW_MANAGEMENT}` + `/${COM_AD_WORKFLOW_MANAGEMENT_E_TRADE}`);
          break;
        case "Edit":
          this.enableEditing(true);
          break;
        case "Next":
          this.next();
          break;
        case "Back":
          this.back();
          break;
        case "arrowTitle":
          switch (this.pageTitle.id) {
            case "workflowManagement":
              void this.router.navigateByUrl(`/${COM_AD}`);
              break;
            case "account-rules":
              this.resetChanges(true);
              this.endButtons = [];
              break;
          }
          break;
        case "goToCA":
          void this.router.navigateByUrl(`/${COM_AD}`);
          break;
        case "goToWorkflow":
          location.reload();
          break;
      }
    }
  }

  next() {
    switch (this.pageTitle.stepper!.stepCounter) {
      case 1:
        this.validateAccountRules();
        break;
      case 2:
        this.confirmAccountRules();
        break;
    }
  }

  back() {
    switch (this.pageTitle.stepper!.stepCounter) {
      case 1:
        this.resetChanges(true);
        break;
      case 2:
        this.alert = null
        this.stepperMoveBack()
        break;
    }
  }

  setSummary() {
    this.modelAndListService.getList(['currency', 'branchRbs5', 'WorkflowAccountStatus', 'privileges', 'batchTypes']).subscribe(models => {
      let form: FormModel = new FormModel({id: 'summaryForm', controls: {}});
      let alert = getAccountRulesAlerts();
      alert.message = [];
      for (let index = 0; index < this.validateItems.batchList.toProcess.length; index++) {
        let value: any = this.validateItems.batchList.toProcess[index];
        let titleId = 'title' + index;
        let tableId = 'table' + index;
        let titleText = models.batchTypes[value.paymentId];
        let title = new TitleControl({
          columnCount: 12,
          controlOptions: {
            id: value.paymentId,
            title: titleText,
            type: "Section",
          }
        });
        let message = this.translate.instant('workflow.typeChanged', {module: titleText}) + this.translate.instant('workflow.lastMessage');
        alert.message.push(message);
        this.translate.instant('workflow.typeChanged', {module: titleText})
        let table: TableControl = getAccountRulesTableControl();
        form.addControl(titleId, title);
        form.addControl(tableId, table);
        for (let i = 0; i < value.details.length; i++) {
          value.details[i].col = i
          value.details[i].L1 = value.details[i].levels[0];
          value.details[i].L2 = value.details[i].levels[1];
          value.details[i].L3 = value.details[i].levels[2];
          value.details[i].L4 = value.details[i].levels[3];
          value.details[i].L5 = value.details[i].levels[4];
        }
        table.controlOptions.data = value.details;
      }
      let sections: SummarySectionModel[] = [];
      sections.push(this.getSummarySubtitle());
      sections.push(...Utils.getSummaryWithTablesSections(form));
      this.summary = {
        title: getSummaryTitle(),
        sections: sections,
      }
      this.alert = alert
      this.stepperMoveNext();
    });
  }

  checkValueChanges() {
    for (let i = 0; i < this.workflowTypePaymentList.length; i++) {
      let tableId = 'table' + i;
      let table = (this.getControl(0, 0, tableId) as TableControl);
      table.onInputChange.subscribe(value => {
        if (value.column == 'amountMax') {
          let index = value.id
          table.controlOptions.data![index].amountMax = value.row.amountMax_NewValue;
          let nextIndex = value.id + 1
          if (table.controlOptions.data![nextIndex]) {
            let min = parseFloat(table.controlOptions.data![index].amountMax) + 0.01;
            table.updateValues([{
              id: nextIndex.toString(),
              value: min.toString(),
              column: "amountMin"
            }]);
            table.controlOptions.data![nextIndex].amountMin = min.toString();
          }
          this.enableOrDisableNextButton(i, table, index, nextIndex);
          this.addToEdited(tableId);
        }
      });
      table.buttonClicked.subscribe(value => {
        if (value.buttonId == "delete" && table.controlOptions.data!.length > 1) {
          let data: any[] = structuredClone(table.controlOptions.data!);
          data.splice(value.row.col, 1);
          if (value.row.col > 1) {
            data[value.row.col - 1].delete = 1;
          }
          table.controlOptions.data = data;
          this.addToEdited(tableId);
          this.enableOrDisableNextButton(i, table, value.row.col - 1);
        }
      });
      table.onCheckBoxColumnChange.subscribe(value => {
        Object.keys(value).forEach((key) => {
          let index = parseInt(key);
          table.controlOptions.data![index].L1 = value[key].L1
          table.controlOptions.data![index].L2 = value[key].L2
          table.controlOptions.data![index].L3 = value[key].L3
          table.controlOptions.data![index].L4 = value[key].L4
          table.controlOptions.data![index].L5 = value[key].L5
          this.addToEdited(tableId);
          this.enableOrDisableNextButton(i, table, index);
        })
      })
    }

  }

  addToEdited(tableId: string) {
    if (!this.editedList.includes(tableId)) {
      this.editedList.push(tableId);
    }
  }

  setAccountsData(req?: AccountsReq) {
    this.workflowManagementService.getAccounts(req ? req : {}).subscribe(value => {
      if (this.getControl(0, 0, 'workflowTable')) {
        (this.getControl(0, 0, 'workflowTable') as TableControl).controlOptions.data = value.accountList;
        if (this.accounts.length == 0) {
          this.accounts = value.accountList!;
        }
        value.accountList?.forEach((account, index) => {
          let table = (this.getControl(0, 0, 'workflowTable') as TableControl)
          table.controlOptions.headers[0].controlOptions.id = 'account' + index;
        });
      }
    });
  }

  openSearch(table: TableControl, models: any) {
    this.setSearchFormData(models);
    this.popupService.showPopup({image: '', form: this.searchForm}).subscribe((res: PopupOutputModel) => {
      if (res.buttonId == "search") {
        let privileges = []
        if (this.searchForm.controls['privilege'].value) {
          for (let privilege of this.searchForm.controls['privilege'].value) {
            privileges.push(privilege.key)
          }
        }

        let req: AccountsReq = {
          search: true,
          accountNumber: this.searchForm.controls['accounts'].value?.fullAccountNumber ? this.searchForm.controls['accounts'].value?.fullAccountNumber : null,
          accountNickname: this.searchForm.controls['nickName'].value ? this.searchForm.controls['nickName'].value : null,
          branchid: this.searchForm.controls['branch'].value?.key ? this.searchForm.controls['branch'].value?.key : null,
          currency: this.searchForm.controls['currency'].value?.key ? this.searchForm.controls['currency'].value?.key : null,
          searchByPrivilege: this.searchForm.controls['searchByPrivilege'].value ? this.searchForm.controls['searchByPrivilege'].value : false,
          privilege: privileges.length > 0 ? privileges : null,
          serviceActive: this.searchForm.controls['privilegeActive'].value ? this.searchForm.controls['privilegeActive'].value : false,
          status: this.searchForm.controls['status'].value?.key ? this.searchForm.controls['status'].value?.key : null,
        }
        this.setAccountsData(req)
        this.popupService.dismiss();
      } else if (res.buttonId == "reset") {
        for (let key of Object.keys(this.searchForm.controls)) {
          if (['nickName', 'searchByPrivilege', 'privilegeActive'].includes(key)) {
            this.searchForm.controls[key].setValue(key == 'nickName' ? '' : undefined, true)
          } else {
            this.searchForm.controls[key].setValue(undefined, true)
            this.searchForm.controls[key].controlOptions.options = undefined;
          }
        }
        this.setAccountsData();
        this.popupService.dismiss();
      } else {
        this.popupService.dismiss();
      }
    });
  }

  setSearchFormData(models: any) {
    let account = []
    for (let i = 0; i < this.accounts.length; i++) {
      account.push(this.accounts[i].account);
    }
    this.searchForm.controls['accounts'].controlOptions.options = account;


    this.searchForm.controls['currency'].controlOptions.options = Utils.getModelList(models.currency);
    this.searchForm.controls['branch'].controlOptions.options = Utils.getModelList(models.branchRbs5);
    this.searchForm.controls['status'].controlOptions.options = Utils.getModelList(models.WorkflowAccountStatus);
    (this.searchForm.controls['searchByPrivilege'] as SelectionControl).valueChanges.subscribe(res => {
      if (res.value) {
        this.searchForm.controls['privilege'].hidden = false;
        this.searchForm.controls['privilege'].controlOptions.options = Utils.getModelList(models.privileges);
        this.searchForm.controls['privilegeActive'].hidden = false;
        this.searchForm.controls['privilegeActive'].controlOptions.data = true;
      } else {
        this.searchForm.controls['privilege'].hidden = true;
        this.searchForm.controls['privilege'].controlOptions.options = undefined
        this.searchForm.controls['privilegeActive'].hidden = true;
        this.searchForm.controls['privilegeActive'].controlOptions.data = undefined;
      }
    });
  }

  private getSummarySubtitle(): SummarySectionModel {
    let title: TitleModel = {
      id: 'summaryTitle',
      title: 'public.account',
      subTitle: (this.getControl(0, 0, 'accountTitle')).controlOptions.subTitle,
    };
    return {
      title: title
    }
  }


  private enableOrDisableNextButton(tableIndex: number, table: TableControl, index: number, nextIndex?: number) {
    if (this.endButtons[0].id == "Next") {
      let titleId = 'title' + tableIndex;
      let nextValid: boolean = true;
      if (nextIndex && table.controlOptions.data![nextIndex]) {
        let nextRow = table.controlOptions.data![nextIndex];
        nextValid = parseFloat(nextRow.amountMax) >= parseFloat(nextRow.amountMin);
      }
      let row = table.controlOptions.data![index];
      let valid = ((row.L1 || row.L2 || row.L3 || row.L4 || row.L5) && (parseFloat(row.amountMax) >= parseFloat(row.amountMin)));
      this.endButtons[0].isDisable = !(valid && nextValid);
      (this.getControl(0, 0, titleId)! as TitleControl).controlOptions.endButtons![0].isDisable = !(valid && nextValid);
    }
  }

  private setAccountsTable() {
    this.modelAndListService.getList(['currency', 'branchRbs5', 'WorkflowAccountStatus', 'privileges', 'batchTypes']).subscribe(models => {
      this.workflowManagementService.getCompanyDetails().subscribe(eTrade => {
        this.pages.push(new PageModel(1, getAccountRulesForm(models, eTrade?.companyDetails?.companyEtradeFunctionList?.length > 0)));
        this.getControl(0, 0, 'workflowTabs').setValue('account-rules');
        this.setAccountsData();
        let table = (this.getControl(0, 0, 'workflowTable') as TableControl);
        table.onFilterClick.subscribe(() => {
          this.openSearch(table, models);
        });
        table.buttonClicked.subscribe(button => {
            if (button.buttonId.includes('account')) {
              this.selectAccount(button, models);
            }
          }
        );
      })
    });
  }

  private selectAccount(button: TableButtonOutputModel, models: any) {

    Utils.setBreadcrumb([
      {
        text: 'company-admin.name',
        url: '/company-admin',
      },
      {
        text: 'workflow.workflow',
        url: COM_AD_WORKFLOW_MANAGEMENT
      },
      {
        text: 'workflow.account-rules',
        url: COM_AD_WORKFLOW_MANAGEMENT
      }
    ]);

    const fullAccountNumber = button.displayedData['account.fullAccountNumber'];
    const subTitle = fullAccountNumber + ' - ' + button.displayedData['account.alias'];
    let req = {accountNumber: fullAccountNumber};

    this.workflowManagementService.getAccountLevels(req).subscribe(accountLevels => {
      this.hideAndDisableControls(0, 0, ['workflowTable']);
      this.pageTitle = getAccountRulesPageTitle();
      (this.getControl(0, 0, 'accountTitle')).controlOptions.subTitle = subTitle;
      this.showAndEnableControls(0, 0, ['accountTitle']);
      this.workflowTypePaymentList = accountLevels.workflowTypePaymentList;
      this.workflowTypePaymentList.forEach((value: WorkflowAccountBatch | any, index) => {
        let titleId = 'title' + index;
        let tableId = 'table' + index;
        let buttonId = 'add' + index;
        let titleText = models.batchTypes[value.paymentId];
        let title = getAccountRulesTitleControl(titleText, buttonId, value.paymentId);
        let table: TableControl = getAccountRulesTableControl();
        this.pages[0].forms[0].addControl(titleId, title);
        this.pages[0].forms[0].addControl(tableId, table);
        for (let i = 0; i < value.details.length; i++) {
          value.details[i].col = i
          value.details[i].L1 = value.details[i].levels[0];
          value.details[i].L2 = value.details[i].levels[1];
          value.details[i].L3 = value.details[i].levels[2];
          value.details[i].L4 = value.details[i].levels[3];
          value.details[i].L5 = value.details[i].levels[4];
          value.details[i].delete = 0;
          value.details[i].oldMinAmount = value.details[i].amountMin;
          value.details[i].oldMaxAmount = value.details[i].amountMax;
        }
        table.controlOptions.data = value.details;
      });
      this.endButtons = [this.editButton];
      this.getControl(0, 0, 'workflowTabs').hidden = true;
    })
  }

  private addNewRule(button: FormButtonClickOutput) {
    let titleId = 'title' + button.buttonId.replace("add", '');
    (this.getControl(0, 0, titleId)! as TitleControl).controlOptions.endButtons![0].isDisable = true;
    let tableId = 'table' + button.buttonId.replace("add", '');
    let table = (this.getControl(0, 0, tableId) as TableControl);
    const index = table.controlOptions.data!.length - 1;
    let data: any[] = structuredClone(table.controlOptions.data!);

    data[data.length - 1].delete = 0;


    let min: number = parseFloat(table.controlOptions.data![index].amountMax) + 0.01;
    let newRule = {
      amountMin: min.toString(),
      amountMax: '0',
      L1: false,
      L2: false,
      L3: false,
      L4: false,
      L5: false,
      col: index + 1
    }
    data.push(newRule);
    table.controlOptions.data = data;
    table.setValue([...table.controlOptions.data, {"col": newRule.col}])
    this.enableOrDisableNextButton(parseInt(button.buttonId.replace("add", '')), table, index + 1);
    this.addToEdited(tableId);
  }

  private enableEditing(flag: boolean) {
    this.pageTitle.stepper = flag ? getStepper() : undefined;

    for (let i = 0; i < this.workflowTypePaymentList.length; i++) {

      let titleId = 'title' + i;
      let title = (this.getControl(0, 0, titleId) as TitleControl);
      title.controlOptions.endButtons![0].isDisable = !flag;

      let tableId = 'table' + i;
      let table = (this.getControl(0, 0, tableId) as TableControl);
      let values: any[] = []
      table.controlOptions.data?.forEach(item => {
        values.push({"col": item.col})
      });
      table.setValue(values);
      flag ? table.enable() : table.disable();

      if (table.controlOptions.data!.length > 1) {
        table.controlOptions.data![table.controlOptions.data!.length - 1].delete = flag ? 1 : 0
      }
      flag ? table.controlOptions.headers.push(getDeleteButtonHeader()) : table.controlOptions.headers.pop();

    }

    this.endButtons = flag ? [this.nextButton] : [this.editButton];
    this.startButtons = flag ? [this.backButton] : [];

    this.checkValueChanges();
    Utils.scrollTop();
  }

  private validateAccountRules() {
    let req: ValidateAccountWorkflowReq = {workflowAccountBatch: this.getValidateItems()}
    this.workflowManagementService.validateAccountWorkflow(req).subscribe(value => {
      this.validateItems = value;
      this.setSummary();
    })
  }

  private confirmAccountRules() {
    this.workflowManagementService.confirmAccountWorkflow(this.validateItems).subscribe(value => {
      this.result = {
        type: "Success",
        title: 'public.success-screen',
        subTitle: 'public.thank',
        summary: undefined
      };
      this.stepperMoveNext();
      this.endButtons = [getWorkflow(), getCompanyAdminButton()];
      this.startButtons = [];
      this.alert = null;
    })
  }

  private getValidateItems(): WorkflowAccountBatch[] {
    let batchArr: WorkflowAccountBatch[] = [];
    for (let i = 0; i < this.editedList.length; i++) {
      let tableId = this.editedList[i];
      let table = (this.getControl(0, 0, tableId) as TableControl);
      let index: number = tableId.replace("table", '');
      let batch: any = {
        accountNumber: this.workflowTypePaymentList[index].accountNumber,
        type: this.workflowTypePaymentList[index].type,
        paymentId: this.workflowTypePaymentList[index].paymentId,
        privilege: this.workflowTypePaymentList[index].privilege,
        details: [],
      };
      table.controlOptions.data?.forEach(value => {
        batch.details.push({
          amountMax: value.amountMax,
          amountMin: value.amountMin, levels: [value.L1, value.L2, value.L3, value.L4, value.L5],
        });
      });
      batchArr.push(batch);
    }
    return batchArr;
  }

  private resetChanges(flag: boolean) {
    if (flag) {
      this.hideAndDisableControls(0, 0, ['accountTitle']);
      this.pageTitle = getPageTitle();
      this.showAndEnableControls(0, 0, ['workflowTable']);
      for (let i = 0; i < this.workflowTypePaymentList.length; i++) {
        let titleId = 'title' + i;
        let tableId = 'table' + i;
        this.pages[0].forms[0].removeControl(titleId)
        this.pages[0].forms[0].removeControl(tableId)
      }
      this.workflowTypePaymentList = [];
      this.getControl(0, 0, 'workflowTabs').hidden = false;
      this.startButtons = [];
      this.endButtons = [];
    } else {
      this.enableEditing(false);
    }
    for (let i = 0; i < this.editedList.length; i++) {
      let tableId = this.editedList[i];
      let table = (this.getControl(0, 0, tableId) as TableControl);
      let data = [];
      for (let index = 0; index < table.controlOptions.data!.length; index++) {
        let current: any = {};
        current = table.controlOptions.data![index];
        current.L1 = table.controlOptions.data![index].levels[0];
        current.L2 = table.controlOptions.data![index].levels[1];
        current.L3 = table.controlOptions.data![index].levels[2];
        current.L4 = table.controlOptions.data![index].levels[3];
        current.L5 = table.controlOptions.data![index].levels[4];
        current.amountMin = table.controlOptions.data![index].oldMinAmount;
        current.amountMax = table.controlOptions.data![index].oldMaxAmount
        data.push(current)
      }
      this.editedList = []
      table.controlOptions.data = data;
    }
  }
}
