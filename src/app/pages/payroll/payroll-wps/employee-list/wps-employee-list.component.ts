import { Component } from '@angular/core';
import { PopupOutputModel } from 'app/@core/model/dto/popup.model';
import { PopupService } from 'app/@core/service/base/popup.service';
import { ButtonModel } from "arb-design-library/model/button.model";
import { SummaryModel } from "arb-design-library/model/summary.model";
import { TitleModel } from "arb-design-library/model/title.model";
import { Subject, takeUntil } from "rxjs";
import { ValueChangeResult } from "../../../../@core/model/dto/control/control.model";
import { TableControl } from "../../../../@core/model/dto/control/table-control";
import { FormModel, PageModel } from "../../../../@core/model/dto/formModel";
import { ResultModal } from "../../../../@core/model/dto/result.modal";
import { EmployeePayroll } from "../../../../@core/model/rest/payroll/emoployee/Employee-payroll";
import { AuthenticationUtils } from "../../../../@core/utility/authentication-utils";
import { FormButtonClickOutput } from "../../../../shared/form/form.component";
import { PayrollBaseComponent } from "../../payroll-base/payroll-base.component";
import { PayrollPagesNames } from "../../payroll-pages-names";
import { PayrollType } from "../../payroll-type";
import { EmployeeList, PayrollWPSSearchFilter } from "./employee-list";
import { employeeListForm, getSearchForm } from "./wps-employee-list-controls";

@Component({
  selector: 'wps-employee-list',
  templateUrl: './payroll-employee-list.component.html'
})
export class WpsEmployeeListComponent extends PayrollBaseComponent {

  destroy$: Subject<boolean> = new Subject<boolean>()

  pages!: PageModel[];
  pageTitle!: TitleModel;
  endButtons!: ButtonModel[]

  startButtons!: ButtonModel[];
  summary!: SummaryModel;
  result!: ResultModal;

  total: number = 0;

  searchForm: FormModel = getSearchForm();

  filter: PayrollWPSSearchFilter = {
    page: 1,
    rows: 50,
    listCompletePagination: [true],
    search: true
  }


  constructor() {
    super()
    this.drawPage()
    // const selectedEmployees = this.router.getCurrentNavigation()!.extras.state?.['selectedRows'];
    this.getEmployees();
    (this.pages[0].forms[0].controls['listEmpTable'] as TableControl).valueChanges.subscribe((res: ValueChangeResult) => {
      this.onSelectChange(res.value)
    });
    (this.getControl(this.pages, 0, 0, "listEmpTable") as TableControl).onFilterClick?.subscribe(() => {
      this.openSearch();
    });
  }

  drawPage() {
    this.pageTitle = {
      id: "payrollTitle",
      type: "Page",
      title: "payroll.payroll-wps.name",
      showArrow: true,
      endButtons: [
        {
          prefixIcon: "arb-icon-addDocument",
          id: PayrollPagesNames.UPLOAD_FILES,
          type: "secondary",
          text: "payroll.payroll-wps.buttons.upload-files"
        },
        {
          prefixIcon: "arb-icon-add",
          id: PayrollPagesNames.ADD_EMPLOYEE,
          text: "payroll.payroll-wps.buttons.add-employee",
          type: "secondary",
        },
        {
          id: "extraButtons",
          type: "secondary",
          text: "payroll.payroll-wps.buttons.extraButton",
          options: [
            {id: PayrollPagesNames.MOL_FILE, text: "payroll.payroll-wps.buttons.mol-file"},
            {id: PayrollPagesNames.ANALYTICS, text: "payroll.payroll-wps.buttons.analytics"},
            {id: PayrollPagesNames.PROCESSED_FILES, text: "payroll.payroll-wps.buttons.processed-files"}
          ]
        }
      ]
    }
    this.breadcrumbService.setBreadcrumb([{
      text: 'payroll.main-page-name',
      url: '/payroll'
    },
      {
        text: 'payroll.payroll-wps.name',
        url: PayrollPagesNames.PAYROLL + '/' + 'employee/list/' + PayrollType.WPS
      }])

    this.endButtons = [
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
        text: "payroll.payroll-wps.buttons.generate-payroll-file",
        isDisable: true
      }

    ];

    this.pages = [new PageModel(0, employeeListForm())];

  }

  openSearch() {
    this.popService.showPopup({image: '', form: this.searchForm}).subscribe((res: PopupOutputModel) => {
      if (res.buttonId == "search") {
        this.popService.dismiss();
       this.filter={
        page: 1,
        rows: 50,
        listCompletePagination: [true],
        search: true,
        employeeName: res.controls!["employeeName"].value,
        civilianID: res.controls!["civilianId"].value,
        employeeNumber: res.controls!["employeeNum"].value,
      }
        this.getEmployees();
        this.getControl(this.pages,0, 0, "listEmpTable").controlOptions.filterIsActive =
          res.controls!["listEmpTable"].value || res.controls!["listEmpTable"].value.key;
      } else if (res.buttonId == "reset") {
        this.popService.dismiss();
        res.controls!['employeeNum'].setValue('')
        res.controls!['employeeName'].setValue('')
        res.controls!['civilianId'].setValue('')
        this.filter={
          page: 1,
          rows: 50,
          listCompletePagination: [true],
          search: true
        }
        this.getEmployees();
      } else {
        this.popService.dismiss();
      }
    });
  }


  private getEmployees(selectedEmployees?: EmployeePayroll[]): void {
    const tableControl = this.pages[0].forms[0].controls['listEmpTable']
    this.wpsService.getEmployees(this.filter).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: EmployeeList) => {
        res.employeesList.items.forEach((emp: any) => {
          if (this.translate.currentLang === 'ar') {
            emp.bankNameToShow = emp.bankNameAr
          } else {
            emp.bankNameToShow = emp.bankNameEn
          }
        })
        tableControl.controlOptions.data = res.employeesList.items;
        // if (selectedEmployees) {
        //   tableControl.controlOptions.selectedValues = selectedEmployees
        //   this.changeButtonsStatus(false)
        // }
      },
      error: () => {
        tableControl.controlOptions.data = [];
      }});
  }


  onButtonClick(button: FormButtonClickOutput): void {
    switch (button.buttonId) {
      case PayrollPagesNames.UPLOAD_FILES:
      case PayrollPagesNames.PROCESSED_FILES:
      case PayrollPagesNames.ADD_EMPLOYEE:
      case PayrollPagesNames.DELETE_EMPLOYEE:
      case PayrollPagesNames.EDIT_EMPLOYEE:
      case PayrollPagesNames.ANALYTICS:
      case PayrollPagesNames.MOL_FILE:
      case PayrollPagesNames.GENERATE_PAYROLL_FILE:
        void this.router.navigate([PayrollPagesNames.PAYROLL, button.buttonId, this.getPayrollType()],
          {state: {employeeList: this.getControl(this.pages, 0, 0, 'listEmpTable').value}})
        break
      case PayrollPagesNames.ARROW_TITLE:
        this.goToPayrollLanding();
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
