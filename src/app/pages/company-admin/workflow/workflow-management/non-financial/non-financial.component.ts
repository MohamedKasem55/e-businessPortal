import {Component} from '@angular/core';
import {Utils} from "../../../../../@core/utility/Utils";
import {
  COM_AD,
  COM_AD_WORKFLOW_MANAGEMENT,
  COM_AD_WORKFLOW_MANAGEMENT_E_TRADE,
  COM_AD_WORKFLOW_MANAGEMENT_NON_FINANCIAL
} from "../../../../../@core/constants/pages-urls-constants";
import {
  getCompanyAdminButton,
  getNonFinancialForm,
  getNonFinancialPageTitle,
  getNonFinancialSummaryTableControl,
  getNonFinancialTableControl,
  getNonFinancialTitleControl,
  getPageTitle,
  getStepper,
  getWorkflow
} from "../workflow-management-controls";
import {FormModel, PageModel} from "../../../../../@core/model/dto/formModel";
import {TableControl} from "../../../../../@core/model/dto/control/table-control";
import {FormButtonClickOutput} from "../../../../../shared/form/form.component";
import {
  ValidateNonFinancialWorkflowReq,
  WorkflowNonFinancialBatch
} from "../../../../../@core/model/rest/company-admin/workflow/workflow-management/validate-non-financial-workflow-req";
import {
  ValidateNonFinancialWorkflowRes
} from "../../../../../@core/model/rest/company-admin/workflow/workflow-management/validate-non-financial-workflow-res";
import {TransactionFollowBase} from "../../../../../shared/transaction-follow-base/transaction-follow-base";
import {ModelAndListService} from "../../../../../@core/service/base/modelAndList.service";
import {
  WorkflowManagementService
} from "../../../../../@core/service/company-admin/workflow/workflow-management/workflow-management.service";

@Component({
  selector: 'app-non-financial',
  templateUrl: "../workflow-management.component.html",
})
export class NonFinancialComponent extends TransactionFollowBase {
  workflowList: any;
  validatedItems!: ValidateNonFinancialWorkflowRes;
  editedList: EditedItems[] = []

  constructor(private modelAndListService: ModelAndListService,
              private workflowManagementService: WorkflowManagementService) {
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
        text: 'workflow.non-financial',
        url: COM_AD_WORKFLOW_MANAGEMENT_NON_FINANCIAL
      }
    ]);
    this.pageTitle = getPageTitle();
    this.pages = [];
    this.endButtons = [this.editButton];
    this.endButtons[0].isDisable = true;
    this.startButtons = [];
    this.setNonFinancialTable();
  }

  private static isEqual(item: any, value: any, i: any) {
    return item.L1 === value[i].L1 && item.L2 === value[i].L2 && item.L3 === value[i].L3 && item.L4 === value[i].L4 && item.L5 === value[i].L5;
  }

  override onButtonClick(button: FormButtonClickOutput) {
    switch (button.buttonId) {
      case "account-rules":
        void this.router.navigateByUrl(`/${COM_AD}` + `/${COM_AD_WORKFLOW_MANAGEMENT}`);
        break;
      case "non-financial":
        break;
      case "e-trade-rules":
        void this.router.navigateByUrl(`/${COM_AD}` + `/${COM_AD_WORKFLOW_MANAGEMENT}` + `/${COM_AD_WORKFLOW_MANAGEMENT_E_TRADE}`);
        break;
      case "Edit":
        this.pageTitle = getNonFinancialPageTitle();
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
          case "non-financial":
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

  setNonFinancialTable() {
    this.modelAndListService.getList(['privilegesWorkflow', 'batchTypes']).subscribe(models => {
      this.workflowManagementService.getCompanyDetails().subscribe(eTrade => {
        this.pages.push(new PageModel(1, getNonFinancialForm(eTrade?.companyDetails?.companyEtradeFunctionList?.length > 0)));
        this.getControl(0, 0, 'workflowTabs').setValue('non-financial');
        this.setNonFinancialData(models);
      })
    });
  }

  next() {
    switch (this.pageTitle.stepper!.stepCounter) {
      case 1:
        this.validateNonFinancial();
        break;
      case 2:
        this.confirmNonFinancial();
        break;
    }
  }

  setSummary() {
    {
      this.modelAndListService.getList(['privilegesWorkflow', 'batchTypes']).subscribe(models => {
        let form: FormModel = new FormModel({id: 'summaryForm', controls: {}});
        for (let index = 0; index < this.validatedItems.batchList.toProcess.length; index++) {
          let value: any = this.validatedItems.batchList.toProcess[index];
          let tableId = 'table' + index;
          let titleText = models.batchTypes[value.paymentId];

          let titleId = 'title' + index;
          let title = getNonFinancialTitleControl(titleText, titleId);
          let data: any[] = []
          let table: TableControl = getNonFinancialSummaryTableControl();
          form.addControl(titleId, title);
          form.addControl(tableId, table);

          value.privilege = models.batchTypes[value.paymentId]
          value.L1 = value.levels[0];
          value.L2 = value.levels[1];
          value.L3 = value.levels[2];
          value.L4 = value.levels[3];
          value.L5 = value.levels[4];
          data.push(value);
          table.controlOptions.data = data;
        }
        this.summary = {
          title: undefined,
          sections: Utils.getSummaryWithTablesSections(form),
        }
        this.stepperMoveNext();
      });
    }
  }

  back() {
    switch (this.pageTitle.stepper!.stepCounter) {
      case 1:
        this.resetChanges();
        break;
      case 2:
        this.stepperMoveBack();
        break;
    }
  }

  addToEditedList(tableId: string, key: string) {
    let exist = false;
    for (let index = 0; index < this.editedList.length; index++) {
      if ((this.editedList[index].tableId === tableId && this.editedList[index].key === key)) {
        exist = true;
      }
    }
    if (!exist) {
      this.editedList.push({tableId, key});
    }
  }

  private setNonFinancialData(models: any) {
    this.workflowManagementService.getNonFinancialWorkflowLevels().subscribe(value => {
      this.pages[0].forms[0].removeControl('emptyTable');
      this.endButtons[0].isDisable = false;
      this.workflowList = value.workflowList;
      if (!this.workflowList) {
        this.endButtons[0].isDisable = true;
        return;
      }
      Object.keys(this.workflowList).forEach((key) => {
        let titleText = models.privilegesWorkflow[key];
        let tableId = 'table' + key;
        let table: TableControl = getNonFinancialTableControl(titleText);
        this.pages[0].forms[0].addControl(tableId, table);
        let data: any[] = []
        this.workflowList[key].forEach((batch: any) => {
          batch.privilege = models.batchTypes[batch.paymentId]
          batch.L1 = batch.levels[0];
          batch.L2 = batch.levels[1];
          batch.L3 = batch.levels[2];
          batch.L4 = batch.levels[3];
          batch.L5 = batch.levels[4];
          data.push(batch);
        });
        table.controlOptions.data = data;
      });
    });
  }

  private edit(flag: boolean) {

    this.pageTitle.stepper = flag ? getStepper() : undefined;

    Object.keys(this.workflowList).forEach((key) => {
      let tableId = 'table' + key;
      let table = (this.getControl(0, 0, tableId) as TableControl);
      flag ? table.enable() : table.disable();
      this.checkValueChanges(key, tableId, table);
    })

    this.endButtons = flag ? [this.nextButton] : [this.editButton];
    this.startButtons = flag ? [this.backButton] : [];

  }

  private checkValueChanges(key: string, tableId: string, table: TableControl) {
    table.onCheckBoxColumnChange.subscribe(value => {
      this.workflowList[key].forEach((item: any) => {
        let i = item.privilege;
        if (!NonFinancialComponent.isEqual(item, value, i)) {
          item.L1 = value[i].L1;
          item.L2 = value[i].L2;
          item.L3 = value[i].L3;
          item.L4 = value[i].L4;
          item.L5 = value[i].L5;
          this.addToEditedList(tableId, item.privilege)
        }
      });
      this.endButtons[0].isDisable = false;
    });
  }

  private validateNonFinancial() {
    let req: ValidateNonFinancialWorkflowReq = {workflowList: this.getItems()}
    this.workflowManagementService.validateNonFinancialWorkflow(req).subscribe(value => {
      this.validatedItems = value;
      this.setSummary();
    })
  }

  private confirmNonFinancial() {
    this.workflowManagementService.confirmNonFinancialWorkflow(this.validatedItems).subscribe(value => {
      this.result = {
        type: "Success",
        title: 'public.success-screen',
        subTitle: 'public.thank',
        summary: undefined
      };
      this.stepperMoveNext()
      this.endButtons = [getWorkflow(), getCompanyAdminButton()];
      this.startButtons = [];
    })
  }

  private getItems() {
    let batches: WorkflowNonFinancialBatch[] = [];
    for (let i = 0; i < this.editedList.length; i++) {
      let tableId = this.editedList[i].tableId;
      let table = (this.getControl(0, 0, tableId) as TableControl);
      table.controlOptions.data?.forEach(value => {
        if (value.privilege === this.editedList[i].key) {
          let batch: any = {
            paymentId: value.paymentId,
            levels: [value.L1, value.L2, value.L3, value.L4, value.L5]
          }
          batches.push(batch);
        }
      })
    }
    return batches;
  }

  private resetChanges() {
    for (let i = 0; i < this.editedList.length; i++) {
      let tableId = this.editedList[i].tableId;
      let table = (this.getControl(0, 0, tableId) as TableControl);
      let data = [];
      for (let index = 0; index < table.controlOptions.data!.length; index++) {
        let current: any = table.controlOptions.data![index];
        current = table.controlOptions.data![index];
        current.L1 = table.controlOptions.data![index].levels[0];
        current.L2 = table.controlOptions.data![index].levels[1];
        current.L3 = table.controlOptions.data![index].levels[2];
        current.L4 = table.controlOptions.data![index].levels[3];
        current.L5 = table.controlOptions.data![index].levels[4];
        data.push(current)
      }
      table.controlOptions.data = data;
    }
    this.editedList = [];
    this.edit(false);
  }
}

interface EditedItems {
  tableId: string,
  key: string
}
