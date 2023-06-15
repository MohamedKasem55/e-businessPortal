import {Component} from '@angular/core';
import {Subject, takeUntil} from "rxjs";

import {ButtonModel} from "arb-design-library/model/button.model";

import {PayrollBaseComponent} from "../../payroll-base/payroll-base.component";
import {FormModel, PageModel} from "../../../../@core/model/dto/formModel";
import {ResultModal} from "../../../../@core/model/dto/result.modal";
import {TableControl} from "../../../../@core/model/dto/control/table-control";
import {ValueChangeResult} from "../../../../@core/model/dto/control/control.model";
import {EmployeePayroll} from "../../../../@core/model/rest/payroll/emoployee/Employee-payroll";
import {FormButtonClickOutput} from "../../../../shared/form/form.component";
import {PayrollWPSSearchFilter} from "./wps-plus-employee-list";
import {employeeListForm, getFilterForm} from "./wps-plus-employee-list-controls";
import {EmployeeList} from "../../payroll-wps/employee-list/employee-list";
import {PayrollPagesNames} from "../../payroll-pages-names";
import {GenericFeatureListModel} from "arb-design-library/model/generic-feature-list.model";
import {TitleControl} from "../../../../@core/model/dto/control/title-control";
import {GenericFeatureListGroupControl} from "../../../../@core/model/dto/control/generic-feature-list-group-control";
import {Utils} from "../../../../@core/utility/Utils";
import {TitleModel} from "arb-design-library/model/title.model";
import {SummaryModel} from "arb-design-library/model/summary.model";
import {PopupOutputModel} from "../../../../@core/model/dto/popup.model";

@Component({
  selector: 'wps-plus-employee-list',
  templateUrl: './wps-plus-employee-list.component.html'
})
export class WpsPlusEmployeeListComponent extends PayrollBaseComponent {

  destroy$: Subject<boolean> = new Subject<boolean>()

  pages!: PageModel[];
  pageTitle: TitleModel = {
    id: "payrollTitle",
    type: "Page",
    title: "payroll.payroll-wps-plus.page-name",
    showArrow: true,
  };
  endButtons: ButtonModel[] = [
    {
      id: PayrollPagesNames.DELETE_EMPLOYEE,
      type: "danger",
      text: "public.delete",
      isDisable: true
    },
    {
      id: PayrollPagesNames.EDIT_EMPLOYEE,
      type: "secondary",
      text: "public.edit",
      isDisable: true
    },
    {
      id: PayrollPagesNames.GENERATE_PAYROLL_FILE,
      type: "primary",
      text: "payroll.payroll-wps-plus.buttons.pay",
      isDisable: true
    }
  ];
  startButtons!: ButtonModel[];
  summary!: SummaryModel;
  result!: ResultModal;

  total: number = 0;

  filter: PayrollWPSSearchFilter = {
    page: 1,
    rows: 50,
    listCompletePagination: [true],
    search: true
  }
  showLanding: boolean = true;
  response!: EmployeeList;
  private filterForm: FormModel;


  constructor() {
    super()
    this.getEmployees();
    this.filterForm = getFilterForm()
  }

  buildFeesBoxesForm() {
    let genericFeatureListModels: GenericFeatureListModel[] = [];
    genericFeatureListModels.push({
      id: PayrollPagesNames.REQUEST_OPEN_ACCOUNT,
      cardImg: "arb-icon-userPlus",
      title: "payroll.payroll-wps-plus.landing-page.request-open-account.title",
      features: [
        {text: "payroll.payroll-wps-plus.employee-list.feature-list.open-account.text1"},
        {text: "payroll.payroll-wps-plus.employee-list.feature-list.open-account.text2"},
        {text: "payroll.payroll-wps-plus.employee-list.feature-list.open-account.text3"},
        {text: "payroll.payroll-wps-plus.employee-list.feature-list.open-account.text4"},
        {text: "payroll.payroll-wps-plus.employee-list.feature-list.open-account.text5"},
        {text: "payroll.payroll-wps-plus.employee-list.feature-list.open-account.text6"},
        {text: "payroll.payroll-wps-plus.employee-list.feature-list.open-account.text7"},
        {text: "payroll.payroll-wps-plus.employee-list.feature-list.open-account.text8"}
      ],
      featureButton: {
        id: PayrollPagesNames.REQUEST_OPEN_ACCOUNT,
        type: "primary",
        text: "payroll.payroll-wps-plus.landing-page.start-now"
      },
    })
      // genericFeatureListModels.push({
      //   id: PayrollPagesNames.CARDS_MIGRATIONS,
      //   title: "payroll.payroll-wps-plus.landing-page.cards-migrations.title",
      //   features: [
      //     {text: "payroll.payroll-wps-plus.employee-list.feature-list.cards-migrations.text1"},
      //     {text: "payroll.payroll-wps-plus.employee-list.feature-list.cards-migrations.text2"},
      //     {text: "payroll.payroll-wps-plus.employee-list.feature-list.cards-migrations.text3"},
      //     {text: "payroll.payroll-wps-plus.employee-list.feature-list.cards-migrations.text4"}
      //   ],
      //   featureButton: {
      //     id: PayrollPagesNames.CARDS_MIGRATIONS,
      //     type: "primary",
      //     text: "payroll.payroll-wps-plus.landing-page.start-now"
      //   },
      //   cardImg: "arb-icon-userPlus"
      // })
    return new FormModel({
      id: "boxesFromList",
      controls: {
        boxesTitles: new TitleControl({
          order: 1,
          columnCount: 12,
          controlOptions: {
            id: 'boxesTitles',
            type: 'Section',
          },
        }),
        boxesList: new GenericFeatureListGroupControl({
          order: 2,
          columnCount: 12,
          value: "",
          controlOptions: {
            list: genericFeatureListModels
          },
        })
      }
    });
  }

  drawPage() {
    if (this.showLanding) {
      this.pageTitle.endButtons = []
      this.endButtons = []
      this.pages = [new PageModel(1, this.buildFeesBoxesForm())]
    } else {
      this.pages = [new PageModel(1, employeeListForm())];
      this.fillDate(this.response, history.state.selectedRows);
      this.pageTitle.endButtons = [
        {
          prefixIcon: "arb-icon-addDocument",
          id: PayrollPagesNames.UPLOAD_FILES,
          type: "secondary",
          text: "payroll.payroll-wps-plus.buttons.upload-file",
          isDisable: false
        },
        {
          id: "extraButtons",
          type: "secondary",
          text: "payroll.payroll-wps-plus.buttons.extra-button",
          options: [
            {id: PayrollPagesNames.MOL_FILE, text: "payroll.payroll-wps-plus.buttons.mol-file"},
            {id: PayrollPagesNames.ANALYTICS, text: "payroll.payroll-wps-plus.buttons.analytics"},
            {id: PayrollPagesNames.PROCESSED_FILES, text: "payroll.payroll-wps-plus.buttons.processed-files"}
          ]
        },
      ]
    }
  }


  fillDate(data?: EmployeeList, selectedEmployees?: EmployeePayroll[]) {
    const tableControl = this.pages[0].forms[0].controls['listEmpTable']
    tableControl.controlOptions.data = data?.employeesList.items || [];
    if (selectedEmployees) {
      tableControl.controlOptions.selectedValues = selectedEmployees
      this.changeButtonsStatus(false)
    }
    (this.pages[0].forms[0].controls['listEmpTable'] as TableControl).valueChanges.subscribe((res: ValueChangeResult) => {
      this.onSelectChange(res.value)
    });
    (this.pages[0].forms[0].controls['listEmpTable'] as TableControl).onFilterClick?.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.openFilterPopup();
      });
  }

  openFilterPopup() {
    this.popService.showPopup({form: this.filterForm})
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: PopupOutputModel) => {
        if (res.buttonId == 'Search') {
          this.popService.dismiss();
        } else if (res.buttonId == "reset") {
          this.popService.dismiss();
        } else {
          this.popService.dismiss();
        }
      });
  }

  private getEmployees() {
    this.wpsPlusPayrollService.getEmployees(this.filter).pipe(takeUntil(this.destroy$))
      .subscribe((res: EmployeeList) => {
        if (!Utils.isEmptyOrNullList(res.employeesList.items)) {
          this.showLanding = false
          this.response = res;
        }
        this.drawPage()
      })
  }


  onButtonClick(button: FormButtonClickOutput): void {
    switch (button.buttonId) {
      case PayrollPagesNames.UPLOAD_FILES:
      case PayrollPagesNames.REQUEST_OPEN_ACCOUNT:
      case PayrollPagesNames.MOL_FILE:
      case PayrollPagesNames.ANALYTICS:
      case PayrollPagesNames.PROCESSED_FILES:
      case PayrollPagesNames.EDIT_EMPLOYEE:
      case PayrollPagesNames.DELETE_EMPLOYEE:
      case PayrollPagesNames.GENERATE_PAYROLL_FILE:
        void this.router.navigate([PayrollPagesNames.PAYROLL + '/' + button.buttonId, this.getPayrollType()],
          {
            state: {selectedRows: this.pages[0].forms[0].controls['listEmpTable']?.value}
          })
        break
      case PayrollPagesNames.ARROW_TITLE:
        this.goToPayrollLanding()
        break
    }
  }

  onSelectChange(employeePayrolls: EmployeePayroll[]) {
    if (employeePayrolls.length > 0) {
      this.changeButtonsStatus(false)
    } else {
      this.changeButtonsStatus(true)
    }
  }

  private changeButtonsStatus(status: boolean) {
    this.endButtons.find(button => {
      button.isDisable = status
    })
  }
}
