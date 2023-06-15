import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {ModelAndListService} from "app/@core/service/base/modelAndList.service";
import {TableButtonOutputModel} from "arb-design-library/model/table-button-output.model";
import {TableHeaderModel} from "arb-design-library/model/table-header.model";
import {TitleModel} from "arb-design-library/model/title.model";
import {
  getExportFileName,
  getPageTitle,
  getSearchForm,
  getSectionTitle,
  getTableHeadersList
} from './users-list-controls';
import {take} from "rxjs";
import {FormModel} from "app/@core/model/dto/formModel";
import {PopupService} from "app/@core/service/base/popup.service";
import {PopupOutputModel} from "app/@core/model/dto/popup.model";
import {TranslateService} from "@ngx-translate/core";
import {CompanyUserList} from "app/@core/model/rest/company-admin/user-management/users-list-res";
import {UsersListReq} from "app/@core/model/rest/company-admin/user-management/users-list-req";
import {UserManagementService} from "app/@core/service/company-admin/user-management/users-managment.service";
import {Utils} from "../../../../@core/utility/Utils";

@Component({
  selector: 'app-users-list-management',
  templateUrl: './users-list.component.html'
})
export class UsersListManagementComponent {

  UsersListManagement!: CompanyUserList[]|undefined;

  searchForm: FormModel = getSearchForm();
  headers: TableHeaderModel[] = getTableHeadersList();
  pageTitle: TitleModel = getPageTitle()
  sectionTitle = getSectionTitle();
  exportFileName = getExportFileName();

  reqParams: UsersListReq = {creationDateTo: new Date().toISOString().slice(0, 10), orderType: 'asc'};

  userTypeList: object = {};


  constructor(
    private service: UserManagementService,
    private modelAndListService: ModelAndListService,
    private popupService: PopupService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.getModels();
    Utils.setBreadcrumb([
      {text: 'Company Admin', url: '/company-admin'},
      {text: 'List of Users', url: ''}]);

  }

  ngOnInit(): void {
  }

  getUsersList() {
    this.service.getUsersList(this.reqParams).pipe(take(1)).subscribe({
      next: (res: any) => this.UsersListManagement = res.companyUserList,
      error: () => this.UsersListManagement = [],
    })
  }

  onTableButtonClick(data: TableButtonOutputModel): void {
    void this.router.navigateByUrl(`/company-admin/alrajhi-user-details/${data.displayedData.userId}`);
  }

  openSearch() {
    this.searchForm.controls['userType'].controlOptions.options = Object.entries(this.userTypeList).map(entry => {
      return {"key": [entry[0]], "value": entry[1]};
    });
    this.popupService.showPopup({image: '', form: this.searchForm}).subscribe((res: PopupOutputModel) => {
      switch (res.buttonId) {
        case "search":
          this.reqParams.userId = (res.controls!["userId"].value) ? res.controls!["userId"].value : null;
          this.reqParams.userName = (res.controls!["userName"].value) ? res.controls!["userName"].value : null;
          this.reqParams.iqama = (res.controls!["iqama"].value) ? res.controls!["iqama"].value : null;
          this.reqParams.userType = (res.controls!["userType"].value &&
            res.controls!["userType"].value['key'][0])
            ? res.controls!["userType"].value['key'][0] : null;
          this.reqParams.city = (res.controls!["city"].value) ? res.controls!["city"].value : null;
          this.reqParams.region = (res.controls!["region"].value) ? res.controls!["region"].value : null;
          this.reqParams.mobileNumber = (res.controls!["mobileNumber"].value) ? res.controls!["mobileNumber"].value : null;
          this.reqParams.department = (res.controls!["department"].value) ? res.controls!["department"].value : null;
          this.getUsersList();
          this.popupService.dismiss();
          break;
        case "reset":
          this.reqParams = {creationDateTo: new Date().toISOString().slice(0, 10), orderType: 'asc'};
          this.resetForm()
          this.UsersListManagement = undefined
          this.getUsersList();
          this.popupService.dismiss();
          break
        case "cancel":
          this.popupService.dismiss();
          break
      }
    });
  }

  onButtonClick(id: string) {
    if (id === 'arrowTitle')
      void this.router.navigateByUrl('/company-admin')
    else if (id === 'addUser') {
        void this.router.navigate(['/company-admin/alrajhi-user-details/'])
    }
  }

  private getModels() {
    this.modelAndListService.getList(['userType', 'userStatus']).subscribe((data) => {
      const userType = data['userType'];
      const userStatus = data['userStatus'];
      this.userTypeList = data['userType'];
      this.headers[2].mapObject = userType;
      this.headers[6].mapObject = userStatus;
      this.getUsersList();
    });
  }

  private resetForm() {
    Object.keys(this.searchForm.controls).forEach((key) => {
      this.searchForm.controls[key].setValue(null)
    })
  }
}
