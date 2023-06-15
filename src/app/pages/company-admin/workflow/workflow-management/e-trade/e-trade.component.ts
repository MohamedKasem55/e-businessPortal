import {Component} from '@angular/core';
import {FormButtonClickOutput} from "../../../../../shared/form/form.component";
import {
  COM_AD,
  COM_AD_WORKFLOW_MANAGEMENT,
  COM_AD_WORKFLOW_MANAGEMENT_E_TRADE,
  COM_AD_WORKFLOW_MANAGEMENT_NON_FINANCIAL
} from "../../../../../@core/constants/pages-urls-constants";
import {UserManagementService} from "../../../../../@core/service/company-admin/user-management/users-managment.service";
import {WorkflowManagementService} from "../../../../../@core/service/company-admin/workflow/workflow-management/workflow-management.service";
import {Utils} from "../../../../../@core/utility/Utils";
import {
  getCompanyAdminButton,
  getETradeForm,
  getETradePageTitle,
  getETradeTableControl,
  getETradeTitleControl,
  getPageTitle,
  getStepper,
  getWorkflow
} from "../workflow-management-controls";
import {FormModel, PageModel} from "../../../../../@core/model/dto/formModel";
import {TableControl} from "../../../../../@core/model/dto/control/table-control";
import {TitleControl} from "../../../../../@core/model/dto/control/title-control";
import {
  CompanyETradeFunction,
  ValidateETradeWorkflowReq
} from "../../../../../@core/model/rest/company-admin/workflow/workflow-management/validate-e-trade-workflow-req";
import {ValidateETradeWorkflowRes} from "../../../../../@core/model/rest/company-admin/workflow/workflow-management/validate-e-trade-workflow-res";
import {TransactionFollowBase} from "../../../../../shared/transaction-follow-base/transaction-follow-base";
import {TableInputChangeModel} from "arb-design-library/model/table-input-change.model";
import {CompanyEtradeWorkflow} from "../../../../../@core/model/rest/company-admin/user-details/register-user-init";

@Component({
  selector: 'app-e-trade',
  templateUrl: "../workflow-management.component.html",
})
export class ETradeComponent extends TransactionFollowBase {

  CompanyETradeFunctionList!: any[];
  validatedItems!: ValidateETradeWorkflowRes;
  editedList: any[] = [];

  constructor(public workflowManagementService: WorkflowManagementService,
              private userManagementService: UserManagementService) {
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
      {
        text: 'workflow.e-trade-rules',
        url: COM_AD_WORKFLOW_MANAGEMENT_E_TRADE
      }
    ]);

    this.pageTitle = getPageTitle();
    this.pages = [];
    this.endButtons = [this.editButton];
    this.startButtons = [];
    this.setETradeData();
  }

  setETradeData() {

    this.pages.push(new PageModel(1, getETradeForm()));
    this.getControl(0, 0, 'workflowTabs').setValue('e-trade-rules');
    this.userManagementService.getCompanyDetails().subscribe(res => {
      this.CompanyETradeFunctionList = res.companyDetails.companyEtradeFunctionList;
      for (let functionItem of this.CompanyETradeFunctionList) {
        functionItem.companyEtradeWorkflows.sort((a: CompanyEtradeWorkflow, b: CompanyEtradeWorkflow) => a.level - b.level)
      }
      if (!this.CompanyETradeFunctionList) {
        this.endButtons[0].isDisable = true;
        return;
      }
      for (let i = 0; i < this.CompanyETradeFunctionList.length; i++) {
        let titleId = 'title' + i;
        let tableId = 'table' + i;
        let buttonId = 'add' + i;
        let titleText = this.CompanyETradeFunctionList[i].etradeFunction.descriptionEn;
        let title = getETradeTitleControl(titleText, titleId);
        if (this.CompanyETradeFunctionList[i].companyEtradeWorkflows.length < 5) {
          title.controlOptions.endButtons = [{
            text: "workflow.add-new",
            id: buttonId,
            type: "secondary",
            prefixIcon: "arb-icon-circlePlus",
            isDisable: true,
          }];
        }
        let table: TableControl = getETradeTableControl(titleText);
        this.pages[0].forms[0].addControl(titleId, title);
        this.pages[0].forms[0].addControl(tableId, table);
        for (let index = 0; index < this.CompanyETradeFunctionList[i].companyEtradeWorkflows.length; index++) {
          let current = this.CompanyETradeFunctionList[i].companyEtradeWorkflows[index];

          current.col = index;
          current.amountMin = index > 0 ? (this.CompanyETradeFunctionList[i].companyEtradeWorkflows[index - 1].amount + 0.01) : 0;
          current.oldMinAmount = index > 0 ? (this.CompanyETradeFunctionList[i].companyEtradeWorkflows[index - 1].amount + 0.01) : 0;
          current.oldAmount = current.amount;
        }
        table.controlOptions.data = this.CompanyETradeFunctionList[i].companyEtradeWorkflows;
      }
    });
  }

  override onButtonClick(button: FormButtonClickOutput) {
    if (button.buttonId.includes('add')) {
      this.addNewRule(button);
    } else {
      switch (button.buttonId) {
        case "account-rules":
          void this.router.navigateByUrl(`/${COM_AD}` + `/${COM_AD_WORKFLOW_MANAGEMENT}`);
          break;
        case "non-financial":
          void this.router.navigateByUrl(`/${COM_AD}` + `/${COM_AD_WORKFLOW_MANAGEMENT}` + `/${COM_AD_WORKFLOW_MANAGEMENT_NON_FINANCIAL}`);
          break;
        case "e-trade-rules":
          break;
        case "Edit":
          this.pageTitle = getETradePageTitle();
          this.edit(true);
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
            case "e-trade":
              this.resetChanges();
              this.pageTitle = getPageTitle();
              break;
          }
          break;
        case "goToCA":
          void this.router.navigateByUrl(`/${COM_AD}`);
          break;
        case "goToWorkflow":
          void this.router.navigateByUrl(`/${COM_AD}` + `/${COM_AD_WORKFLOW_MANAGEMENT}`);
          break;
      }
    }
  }

  next() {
    switch (this.pageTitle.stepper!.stepCounter) {
      case 1:
        this.validateETrade();
        break;
      case 2:
        this.confirmETrade();
        break;
    }
  }

  back() {
    switch (this.pageTitle.stepper!.stepCounter) {
      case 1:
        this.resetChanges()
        break;
      case 2:
        this.stepperMoveBack()
        break;
    }
  }

  edit(flag: boolean) {
    this.pageTitle.stepper = flag ? getStepper() : undefined;

    for (let i = 0; i < this.CompanyETradeFunctionList.length; i++) {

      let titleId = 'title' + i;
      let title = (this.getControl(0, 0, titleId) as TitleControl);
      if (title.controlOptions.endButtons) {
        title.controlOptions.endButtons![0].isDisable = !flag;
      }


      let tableId = 'table' + i;
      let table = (this.getControl(0, 0, tableId) as TableControl);
      let values: any[] = []
      table.controlOptions.data?.forEach(item => {
        values.push({"col": item.col})
      });
      table.setValue(values);
      flag ? table.enable() : table.disable();

      if (flag) {
        table.onInputChange.subscribe(value => {
          this.inputChanged(value, table, tableId);
        });
      }
    }

    this.endButtons = flag ? [this.nextButton] : [this.editButton];
    this.startButtons = flag ? [this.backButton] : [];
  }

  inputChanged(value: TableInputChangeModel, table: TableControl, tableId: string) {
    if (value.column == 'amount') {
      let index = value.id;
      table.controlOptions.data![index].amount = value.row.amount_NewValue;
      const nextIndex = index + 1
      if (table.controlOptions.data![nextIndex]) {
        let min = parseFloat(table.controlOptions.data![index].amount) + 0.01;
        table.updateValues([{
          id: nextIndex.toString(),
          value: min.toString(),
          column: "amountMin"
        }]);
        table.controlOptions.data![nextIndex].amountMin = min.toString();
      }
      this.checkAmountsValidation(table, index, nextIndex);
      this.addToEdited(tableId);
    }
  }

  checkAmountsValidation(table: TableControl, index: number, nextIndex?: number) {
    if (this.endButtons[0].id == "Next") {
      let nextValid: boolean = true;
      if (nextIndex && table.controlOptions.data![nextIndex]) {
        let nextRow = table.controlOptions.data![nextIndex];
        nextValid = parseFloat(nextRow.amount) >= parseFloat(nextRow.amountMin);
      }
      let currentRow = table.controlOptions.data![index];
      let valid = ((parseFloat(currentRow.amount) >= parseFloat(currentRow.amountMin)) && (table.controlOptions.data!.length <= 5))
      this.endButtons[0].isDisable = !(valid && nextValid);
    }
  }

  validateETrade() {
    let req: ValidateETradeWorkflowReq = {batchList: this.getItems()}
    this.workflowManagementService.validateETradeWorkflow(req).subscribe(value => {
      this.validatedItems = value;
      this.setSummary();
    })
  }

  setSummary() {
    let form: FormModel = new FormModel({id: 'summaryForm', controls: {}});
    for (let index = 0; index < this.validatedItems.batchList.toProcess.length; index++) {
      let value: any = this.validatedItems.batchList.toProcess[index];
      let titleId = 'title' + index;
      let tableId = 'table' + index;
      let titleText = value.etradeFunction.descriptionEn;
      let title = getETradeTitleControl(titleText, titleId);
      let table: TableControl = getETradeTableControl(titleText);
      form.addControl(titleId, title);
      form.addControl(tableId, table);
      for (let i = 0; index < value.levels.length; index++) {
        let current = value.levels[i];
        current.col = index;
      }
      table.controlOptions.data = value.levels;
    }
    this.summary = {
      title: undefined,
      sections: Utils.getSummaryWithTablesSections(form),
    }
    this.stepperMoveNext();
  }

  confirmETrade() {
    this.workflowManagementService.confirmETradeWorkflow(this.validatedItems).subscribe(value => {
      this.result = {
        type: "Success",
        title: 'public.success-screen',
        subTitle: 'public.thank',
        summary: undefined
      };
      this.stepperMoveNext();
      this.endButtons = [getWorkflow(), getCompanyAdminButton()];
      this.startButtons = [];
    })
  }

  addNewRule(button: FormButtonClickOutput) {
    const i = button.buttonId.replace("add", '');
    let tableId = 'table' + i;
    let table = (this.getControl(0, 0, tableId) as TableControl);
    const index = table.controlOptions.data!.length - 1;
    let data: any[] = structuredClone(table.controlOptions.data!);

    let min: number = parseFloat(table.controlOptions.data![index].amount) + 0.01;
    let newRule = {
      amountMin: min.toString(),
      amount: '0',
      col: index + 1,
      level: index + 2,
    }
    data.push(newRule);
    table.controlOptions.data = data;
    table.setValue([...table.controlOptions.data, {"col": newRule.col}])
    if (table.controlOptions.data.length == 5) {
      const titleId = 'title' + i;
      let title = (this.getControl(0, 0, titleId) as TitleControl);
      title.controlOptions.endButtons = [];
    }
    this.checkAmountsValidation(table, index + 1);
    this.addToEdited(tableId);
  }

  addToEdited(tableId: string) {
    if (!this.editedList.includes(tableId)) {
      this.editedList.push(tableId);
    }
  }

  private getItems() {
    let batchArr: CompanyETradeFunction[] = [];
    for (let i = 0; i < this.editedList.length; i++) {
      let tableId = this.editedList[i];
      let table = (this.getControl(0, 0, tableId) as TableControl);
      let index: number = tableId.replace("table", '');
      let batch: CompanyETradeFunction = {
        companyEtradeFunctionsPk: this.CompanyETradeFunctionList[index].companyEtradeFunctionsPk,
        etradeFunction: this.CompanyETradeFunctionList[index].etradeFunction,
        limit: this.CompanyETradeFunctionList[index].limit,
        companyEtradeWorkflows: [],
      };
      table.controlOptions.data?.forEach(value => {
        batch.companyEtradeWorkflows.push({
          companyEtradeWorkflowPk: value.companyEtradeWorkflowPk,
          amount: value.amount, level: value.level,
        });
      });
      batchArr.push(batch);
    }
    return batchArr;
  }

  private resetChanges() {
    for (let i = 0; i < this.editedList.length; i++) {
      let tableId = this.editedList[i];
      let table = (this.getControl(0, 0, tableId) as TableControl);
      let data = [];
      for (let index = 0; index < table.controlOptions.data!.length; index++) {
        let current: any = {};
        current = table.controlOptions.data![index];
        current.amount = current.oldAmount;
        current.amountMin = current.oldMinAmount;
        data.push(current);
      }
      table.controlOptions.data = data;
    }
    this.editedList = [];
    this.edit(false);
  }
}
