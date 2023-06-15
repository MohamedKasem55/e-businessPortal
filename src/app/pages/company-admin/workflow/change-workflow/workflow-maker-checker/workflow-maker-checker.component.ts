import {Component, OnInit} from '@angular/core';
import {ChangeWorkflowBaseComponent} from "../change-workflow-base/change-workflow-base.component";
import {createMakerCheckerPageTitle, getMakerCheckerForm} from "../change-workflow-base/change-workflow-controls";
import {take} from "rxjs";
import {PageModel} from "../../../../../@core/model/dto/formModel";
import {TableControl} from "../../../../../@core/model/dto/control/table-control";
import {FormButtonClickOutput} from "../../../../../shared/form/form.component";
import {CompanyWorkflowTypeEnum} from "../../../../../@core/model/rest/company-admin/workflow/company-workflow-type-enum";
import {COM_AD, COM_AD_WORKFLOW} from "../../../../../@core/constants/pages-urls-constants";
import {SummaryModel} from "arb-design-library/model/summary.model";

@Component({
  templateUrl: "../change-workflow-base/change-workflow-base.component.html",
  selector: 'app-workflow-maker-checker'
})
export class WorkflowMakerCheckerComponent extends ChangeWorkflowBaseComponent implements OnInit {

  ngOnInit(): void {
    this.fetchUserDetailsList();
  }

  fetchUserDetailsList() {
    this.userManagementService.getUsersList({
      creationDateTo: new Date().toISOString().slice(0, 10),
      orderType: 'asc',
      lessDetails: true
    }).pipe(take(1)).subscribe({
      next: (res: any) => {
        this.pageTitle = createMakerCheckerPageTitle();
        this.endButtons = [this.nextButton];
        this.startButtons = [this.backButton];
        this.data = res.companyUserList;
        this.pages = [new PageModel(1, getMakerCheckerForm())];
        let table = (this.pages[0].forms[0].controls['makerChecker'] as TableControl);
        table.controlOptions.data = this.data;

        table.onCheckBoxColumnChange.subscribe((valueChangeResult: any) => {
          this.updateData(valueChangeResult);
          this.endButtons[0].isDisable = false;
        });
      }
    })
  }

  updateData(data: any) {
    Object.keys(data).forEach(key => {
      this.data.forEach((item) => {
        if (item.userId == key) {
          item.maker = data[key]["maker"];
          item.checker = data[key]["checker"];
        }
      });
    });
  }

  override onButtonClick(button: FormButtonClickOutput) {

    switch (button.buttonId) {
      case 'Next':
        switch (this.pageTitle.stepper?.stepCounter) {
          case 1:
            this.summary = this.getSummary();
            this.stepperMoveNext();
            break;
          case 2:
            this.validateSelection(CompanyWorkflowTypeEnum.MAKER_CHECKER)
            break;
        }
        break;

      case 'Back':
        switch (this.pageTitle.stepper!.stepCounter) {
          case 1:
            void this.router.navigateByUrl(`${COM_AD}/` + `${COM_AD_WORKFLOW}`).then();
            break;
          case 2:
            this.stepperMoveBack();
            break;
        }
        break;

      case 'goToDashboard':
        void this.router.navigateByUrl('/dashboard').then();
        break;
    }
  }

  private getSummary(): SummaryModel {
    return {
      sections: [
        {
          title: {
            id: "changeWorkflowTo",
            type: 'Section',
            title: 'workflow.changeWorkflowTo',
          },
          pill: {
            text: 'workflow.makerChecker',
            type: "Neutral",
          },
        }, {
          title: {
            id: "new-user-levels",
            type: 'Section',
            title: 'workflow.new-user-levels',
          },
          table: {
            columnId: "summaryTable",
            data: this.data,
            headers: this.getControl(0, 0, "makerChecker").controlOptions.headers,
            isDisabled: true,
          },
        }
      ]
    };
  }
}
