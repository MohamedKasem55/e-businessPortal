import {addUserInfoAction} from './../../../../../shared/store/shared.action';
import {Component, OnChanges, SimpleChanges} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {UserDetailsRes} from "app/@core/model/rest/company-admin/user-details/user-details-res";

import {
  ExecutionType,
  getBlockForm,
  getDeleteForm,
  getEditButton,
  getEndButton,
  getResetForm,
  getStartButton,
  getUnBlockForm,
  getUserEndButtons,
  getUserSuccessEndButtons,
  getUserSuccessStartButtons,
  getUserTabs,
  getUserTitleModel,
  USER_BLOCK_OP_TYPE,
  USER_DELETE_OP_TYPE,
  USER_MODIFY_OP_TYPE,
  USER_REGISTER_OP_TYPE,
  USER_RESET_PASSWORD_OP_TYPE,
  USER_UNBLOCK_OP_TYPE
} from "./user-main.controls";
import {Utils} from "../../../../../@core/utility/Utils";
import {FormModel, FormResult, PageModel} from "../../../../../@core/model/dto/formModel";
import {PopupService} from "../../../../../@core/service/base/popup.service";
import {PopupInputModel, PopupOutputModel} from "../../../../../@core/model/dto/popup.model";
import {
  UserManagementService
} from "../../../../../@core/service/company-admin/user-management/users-managment.service";
import {
  RequestUserManagementConfirm,
  RequestUserManagementValidate
} from "../../../../../@core/model/rest/company-admin/user-details/user-operation-request";
import {ResultModal} from "../../../../../@core/model/dto/result.modal";
import {getObjectConfigMap, getUserInfoForm, timeArray} from "../user-info/user-info.controls";
import {
  CompanyWorkflowTypeEnum
} from "../../../../../@core/model/rest/company-admin/workflow/company-workflow-type-enum";
import {
  EtradeCompanyDetails,
  RegisterUserInit
} from "../../../../../@core/model/rest/company-admin/user-details/register-user-init";
import {ModelAndListService} from "../../../../../@core/service/base/modelAndList.service";
import {DatePipe} from "@angular/common";
import {
  getEditUserAccountsForm,
  getGroupsLimitsControls,
  getLimitsMatrix
} from "../user-accounts/user.accounts.controls";
import {Account} from "../../../../../@core/model/rest/common/account";
import {getEditUserPrivilegesForm} from "../user-privileges/user-privileges.controls";
import {
  ResUserManagementValidate
} from "../../../../../@core/model/rest/company-admin/user-details/update-user-response";
import {TitleModel} from "arb-design-library/model/title.model";
import {TabModel} from "arb-design-library/model/tab.model";
import {ButtonModel} from "arb-design-library/model/button.model";
import {DropdownControl} from "../../../../../@core/model/dto/control/dropdown-control";
import {FormButtonClickOutput} from "../../../../../shared/form/form.component";
import {TableControl} from "../../../../../@core/model/dto/control/table-control";
import {TableHeaderType} from "arb-design-library";
import {SummaryModel} from "arb-design-library/model/summary.model";
import {Group} from "../../../../../@core/model/rest/common/Group";
import {ValidatorsItem} from "../../../../../@core/model/dto/control/control.model";
import {ValidationsEnum} from "../../../../../@core/model/dto/validations-enum";
import {User} from "app/@core/model/rest/company-admin/user-details/user-operation-request";
import {SharedStoreFactoryService} from "app/shared/store/shared-store-factory.service";
import {Store} from "@ngrx/store";
import {
  IpsPaymentOrderConfigRes
} from "../../../../../@core/model/rest/company-admin/user-details/ips-payment-order-config-res";
import {SummarySectionModel} from "arb-design-library/model/summary-section.model";
import {ChipsModel} from "arb-design-library/model/chip.model";
import {userTypeEnum} from "../../../../../@core/model/rest/common/usert-type-enum";

@Component({
  templateUrl: './user-main.component.html'
})
export class UserMainComponent implements OnChanges {
  /**
   * New
   * */
  editMode: ExecutionType = ExecutionType.VIEW;
  workFlowType: CompanyWorkflowTypeEnum = (JSON.parse(sessionStorage.getItem('company')!).companyWorkflowType !== null) ?
    JSON.parse(sessionStorage.getItem('company')!).companyWorkflowType :
    CompanyWorkflowTypeEnum.WORKFLOW;


  //Add
  pageTitle: TitleModel = getUserTitleModel();
  pages: PageModel[] = [];
  authenticationMethod = JSON.parse(sessionStorage.getItem('company')!)!.authenticationMethod

  endButtons: ButtonModel[] = getEndButton();
  startButtons: ButtonModel[] = getStartButton();
  accTableData: any[] = [];
  accountsGroupsList: any[] = [];
  allGroupsList: any[] = [];
  privilegeTableData: any[] = [];
  summary: SummaryModel = {
    title: {
      id: "summary",
      title: "public.summary"
    },
    sections: []
  };

  /**
   * New
   * */
  currentTab: string = "1";
  tabs: TabModel[] = getUserTabs();
  editButton: ButtonModel = getEditButton();
  startSuccessButtons: ButtonModel[] = getUserSuccessStartButtons();
  endSuccessButtons: ButtonModel[] = getUserSuccessEndButtons();

  userDetails: UserDetailsRes | any = this.activatedRoute?.snapshot?.data['userDetails'];
  initDtls!: RegisterUserInit | any;
  eTradeDtls!: EtradeCompanyDetails;
  userCard!: { userName: string, type: string, loginId: string, image: string };
  result!: ResultModal;
  showStatus = false

  private accountsLevels!: any;
  private selectedAccountList: any[] = [];
  private addSelectedGroup: any[] = [];
  private userEtradeFunctions: any[] = [];
  private userAccountPrivileges: any;
  private validateUserResponse!: ResUserManagementValidate;
  private privilegesListKeys: any;
  //View
  viewEndButtons: ButtonModel[] = getUserEndButtons(this.userDetails!)
  ipsConfig!: IpsPaymentOrderConfigRes;
  userImage: any = "";

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private translate: TranslateService,
              private popupService: PopupService,
              private modelAndListService: ModelAndListService,
              private datePipe: DatePipe,
              private store: Store,
              private sharedStoreService: SharedStoreFactoryService,
              private userManagementService: UserManagementService
  ) {
    if (this.userDetails) {
      this.editMode = ExecutionType.VIEW
    } else {
      this.editMode = ExecutionType.ADD
    }
    if (this.editMode === ExecutionType.ADD) {
      this.userManagementService.getCompanyIPSPaymentOrderConfig().subscribe(({
        next: (res) => {
          this.ipsConfig = res;
          Utils.setBreadcrumb([
            {text: 'company-admin.user-details.companyAdmin', url: '/company-admin'},
            {text: 'company-admin.user-details.listOfUsers', url: '/company-admin/alrajhi-user-management'},
            {text: 'company-admin.user-details.adduser', url: ''}]);
          this.setSteps();
          this.preparePages();
        }
      }));
    } else if (this.editMode === ExecutionType.VIEW) {
      Utils.setBreadcrumb([
        {text: 'company-admin.user-details.companyAdmin', url: '/company-admin'},
        {text: 'company-admin.user-details.listOfUsers', url: '/company-admin/alrajhi-user-management'},
        {text: 'company-admin.user-details.user-dtls', url: ''}]);
      this.userCard = {
        userName: this.userDetails.companyUserDetails.userName,
        type: this.translate.instant("company-admin.user-details." + this.userDetails.companyUserDetails.type),
        image: (this.userDetails.userImage) ? this.userDetails.userImage : './assets/img/profile.svg',
        loginId: this.translate.instant("company-admin.user-details.loginIdTxt") + this.userDetails.companyUserDetails.userId
      };
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.editMode === ExecutionType.EDIT) {
      Utils.setBreadcrumb([
        {text: 'company-admin.user-details.companyAdmin', url: '/company-admin'},
        {text: 'company-admin.user-details.ListOfUsers', url: '/company-admin/alrajhi-user-management'},
        {text: 'company-admin.user-details.user-dtls', url: ''}]);
      this.preparePages();
    }
  }

  /**
   * View
   * */

  onBackArrowClick() {
    void this.router.navigateByUrl('/company-admin/alrajhi-user-management');
  }

  onEditClick() {
    this.userManagementService.getCompanyIPSPaymentOrderConfig().subscribe(({
      next: (res) => {
        this.ipsConfig = res;
        this.editMode = ExecutionType.EDIT;
        this.preparePages()
      }
    }));
  }

  tabChanged(value: string) {
    this.currentTab = value;
  }

  doButtonClick(id: any) {
    switch (id) {
      case "goToHome":
        void this.router.navigate(['dashboard'])
        break;
      case "userManagement":
        void this.router.navigate(['/company-admin/alrajhi-user-management'])
        break;
    }
  }

  onActionsButtonClick(id: string) {
    const userDetails: RequestUserManagementValidate = {
      typeOperation: "",
      companyUser: this.userDetails.companyUserDetails,
      listAccount: this.userDetails.checkaccountlist,
      backEndAccountPrivileges: this.userDetails.backEndAccountPrivileges,
      userEtradeFunctions: this.userDetails.userEtradeFunctions,
      selectedGroupList: this.getSelectedGroupList(),
    }
    switch (id) {
      case'delete':
        this.deleteAction(userDetails);
        break;
      case 'block':
        this.blockAction(userDetails)
        break;
      case 'restPassword':
        this.resetAction(userDetails)
        break;
      case 'unblock':
        this.unblockAction(userDetails)
        break;
    }
  }


  private getSelectedGroupList(): Group[] {
    let groups: Group[] = [];
    if (this.workFlowType === CompanyWorkflowTypeEnum.WORKFLOW) {
      for (const stringGroup of
        this.userDetails.companyUserDetails.groups) {
        let group: Group;
        if (Object.keys(this.userDetails.groupListPayments).indexOf(stringGroup) != -1) {
          group = this.userDetails.groupListPayments[stringGroup];
          groups.push(group)
          continue;
        }
        if (Object.keys(this.userDetails.groupListCM).indexOf(stringGroup) != -1) {
          group = this.userDetails.groupListCM[stringGroup];
          groups.push(group)
          continue;
        }
        if (Object.keys(this.userDetails.groupListOthers).indexOf(stringGroup) != -1) {
          group = this.userDetails.groupListOthers[stringGroup];
          groups.push(group)
          continue;
        }
        if (Object.keys(this.userDetails.groupListTransfers).indexOf(stringGroup) != -1) {
          group = this.userDetails.groupListTransfers[stringGroup];
          groups.push(group)
          continue;
        }
        if (Object.keys(this.userDetails.groupListBills).indexOf(stringGroup) != -1) {
          group = this.userDetails.groupListBills[stringGroup];
          groups.push(group)
          continue;
        }
        if (Object.keys(this.userDetails.groupListCheckBook).indexOf(stringGroup) != -1) {
          group = this.userDetails.groupListCheckBook[stringGroup];
          groups.push(group)
          continue;
        }
        if (Object.keys(this.userDetails.groupListSadadInvoiceHub).indexOf(stringGroup) != -1) {
          group = this.userDetails.groupListSadadInvoiceHub[stringGroup];
          groups.push(group)
          continue;
        }
        if (Object.keys(this.userDetails.groupListAramcoPayments).indexOf(stringGroup) != -1) {
          group = this.userDetails.groupListAramcoPayments[stringGroup];
          groups.push(group)
          continue;
        }
        if (Object.keys(this.userDetails.groupListBusinessCards).indexOf(stringGroup) != -1) {
          group = this.userDetails.groupListBusinessCards[stringGroup];
          groups.push(group)
          continue;
        }
        if (Object.keys(this.userDetails.groupListPrepaidCards).indexOf(stringGroup) != -1) {
          group = this.userDetails.groupListPrepaidCards[stringGroup];
          groups.push(group)
          continue;
        }
        if (Object.keys(this.userDetails.groupListCustomizeReport).indexOf(stringGroup) != -1) {
          group = this.userDetails.groupListCustomizeReport[stringGroup];
          groups.push(group)
        }
      }
    }
    return groups
  }

  private deleteAction(userDetails: RequestUserManagementValidate) {
    userDetails.typeOperation = USER_DELETE_OP_TYPE;
    this.validationAndExecution(userDetails, "company-admin.user-info.delete-success-message")
  }

  private blockAction(userDetails: RequestUserManagementValidate) {
    userDetails.typeOperation = USER_BLOCK_OP_TYPE;
    userDetails.companyUser.blocked = "1"
    userDetails.companyUser.userStatus = "B"
    this.validationAndExecution(userDetails, "company-admin.user-info.block-success-message")
  }

  private resetAction(userDetails: RequestUserManagementValidate) {
    userDetails.typeOperation = USER_RESET_PASSWORD_OP_TYPE;
    this.validationAndExecution(userDetails, "company-admin.user-info.reset-success-message")
  }

  private unblockAction(userDetails: RequestUserManagementValidate) {
    userDetails.typeOperation = USER_UNBLOCK_OP_TYPE;
    userDetails.companyUser.blocked = "0"
    userDetails.companyUser.userStatus = "A"
    this.validationAndExecution(userDetails, "company-admin.user-info.unblock-success-message")
  }

  /**
   * View
   * */
  private preparePages() {
    this.modelAndListService.getList([
      "languages",
      "nationalityCode",
      "userType",
      'currency'
    ]).subscribe((models) => {
      this.userManagementService.getCompanyDetails().subscribe((eTradeDtls) => {
        this.eTradeDtls = eTradeDtls;
        if (this.editMode === ExecutionType.ADD) {
          this.userManagementService.registerInIt()
            .subscribe((initDtls) => {
              this.initDtls = initDtls;
              this.processPagesDtls(models);
              this.setSteps();
            });
        } else if (ExecutionType.EDIT) {
          this.processEditPagesDtls(models);
          this.setSteps();
        }
      })
    });
  }

  /**`
   * View end
   * */

  /**
   * common
   * */
  private processEditPagesDtls(models: any) {
    this.buildCommonForms(models);
    if (this.workFlowType === CompanyWorkflowTypeEnum.WORKFLOW) {
      this.onChangeCheckboxAccountsLevels();
      let order = 2;
      this.setSelectedGroups(order);
      this.changePrivilegeSubscriptions(true);
    }
  }

  private processPagesDtls(models: any) {
    this.buildCommonForms(models);
    if (this.workFlowType === CompanyWorkflowTypeEnum.WORKFLOW) {
      this.onChangeCheckboxAccountsLevels();
      this.setAccountsData();
      let order = 2;
      this.setPrivileges(order);
      order = 30;
      getGroupsLimitsControls().forEach((control) => {
        order++
        control[1].order = order;
        this.pages[1].forms[0].addControl(
          control[0], control[1]
        );
      });
      this.changePrivilegeSubscriptions();
      this.pages[1].forms[0]
        .controls['dailyTransfer'].valueChanges.subscribe(() => {
        this.setDailyLimitCheck()
      })
    }
  }

  private buildCommonForms(models: any) {
    this.pages.push(new
    PageModel(1, getUserInfoForm((this.userDetails)
        ? this.userDetails
        : null, Utils.getModelList(models.languages),
      Utils.getModelList(models.nationalityCode),
      this.datePipe,
      this.editMode!,
      this.workFlowType,
      models.userType)));
    if (this.workFlowType === CompanyWorkflowTypeEnum.WORKFLOW) {
      this.pages.push(new PageModel(2, getEditUserAccountsForm((this.userDetails
        ? this.userDetails
        : null), models.currency)));
      this.pages.push(new PageModel(3, getEditUserPrivilegesForm((this.userDetails)
        ? this.userDetails
        : null)));
    }
    this.changeUserInfoSubscriptions();
    this.setUserInfoData()
  }

  private addSummary() {
    this.summary.sections = [];
    let userDetailsSummaryItems = Utils.getSummaryWithTablesSections(this.pages[0].forms[0]);
    if (this.pages[0].forms[0].controls['accessTime'].value) {
      let days: ChipsModel[] = []
      for (let dayValue of this.pages[0].forms[0].controls['days'].value) {
        for (let dayOption of this.pages[0].forms[0].controls['days'].controlOptions.options) {
          if (dayOption.key == dayValue.dayValue) {
            const day: ChipsModel = {
              id: dayOption.key,
              label: dayOption.value
            }
            days.push(day)
          }
        }
      }
      let summarySectionModel: SummarySectionModel = {
        title: {
          id: 'accessTime',
          type: 'Section',
          title: this.pages[0].forms[0].controls['accessTime'].controlOptions.title,
          chips: days
        },
        items: [
          {
            title: this.pages[0].forms[0].controls['fromTime'].label,
            subTitle: this.pages[0].forms[0].controls['fromTime'].value.value
          },
          {
            title: this.pages[0].forms[0].controls['toTime'].label,
            subTitle: this.pages[0].forms[0].controls['toTime'].value.value
          }
        ],
      }

      userDetailsSummaryItems.push(summarySectionModel)
    }
    if (this.workFlowType === CompanyWorkflowTypeEnum.WORKFLOW) {
      let accountsSummaryItems = Utils.getSummaryWithTablesSections(this.pages[1].forms[0]);
      let privilegeSummaryItems = Utils.getSummaryWithTablesSections(this.pages[2].forms[0]);

      this.summary.sections = [...userDetailsSummaryItems, ...accountsSummaryItems, ...privilegeSummaryItems];
    } else {
      this.summary.sections = [...userDetailsSummaryItems];
    }
  }

  private setSteps() {
    if (this.workFlowType === CompanyWorkflowTypeEnum.BASIC ||
      this.workFlowType === CompanyWorkflowTypeEnum.MAKER_CHECKER) {
      this.pageTitle.stepper!.steps = ['', '', ''];
    } else {
      this.pageTitle.stepper!.steps = ['', '', '', '', '']
    }
    if (this.editMode === ExecutionType.EDIT) {
      this.pageTitle.stepper!.stepCounter = JSON.parse(this.currentTab);
    }
  }

  onResultChange($event: FormResult[]) {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        if (this.workFlowType === CompanyWorkflowTypeEnum.MAKER_CHECKER) {
          this.endButtons[0].isDisable = !$event[0].valid ||
            (!this.pages[0].forms[0].controls['maker'].value &&
              !this.pages[0].forms[0].controls['checker'].value)
        } else {
          this.endButtons[0].isDisable = !$event[0].valid
        }

        break;
      case 2:
        this.endButtons[0].isDisable = !$event[0].valid
        break;
    }
  }

  onButtonClick($event: FormButtonClickOutput) {
    switch ($event.buttonId) {
      case 'next':
        if (this.workFlowType !== CompanyWorkflowTypeEnum.WORKFLOW) {
          if (this.pageTitle.stepper!.stepCounter === 1) {
            let req = this.prepareRequest()
            this.executeValidate(req)
          } else if (this.pageTitle.stepper!.stepCounter === 2) {
            this.addUserConfirm()
          }
        } else {
          if (this.pageTitle.stepper!.stepCounter === 3) {
            let req = this.prepareRequest()
            this.executeValidate(req)
          } else if (this.pageTitle.stepper!.stepCounter === 4) {
            this.addUserConfirm()
          } else {
            this.pageTitle.stepper!.stepCounter++
          }
        }
        break
      case 'back':
        if (this.pageTitle.stepper?.stepCounter === 1) {
          this.router.navigate(['/company-admin/alrajhi-user-management'])
        } else {
          this.pageTitle.stepper!.stepCounter--;
        }
        break;
      case 'arrowTitle':
        this.onBackArrowClick()
        break
    }
  }

  /**
   * common end
   * */
  /**
   * user info Start
   * */
  private changeUserInfoSubscriptions() {
    this.pages[0].forms[0].controls['accessTime']
      .valueChanges.subscribe((val) => {
      let controls = ['fromTime', 'toTime', 'days']
      if (val.value) {
        Utils.changeControlsState(this.pages[0].forms[0], controls, true);
        this.pages[0].forms[0].controls['days'].hidden = false;
        this.pages[0].forms[0].controls['days'].setRequired(true);
        this.pages[0].forms[0].controls['fromTime'].setRequired(true);
      } else {
        Utils.changeControlsState(this.pages[0].forms[0], controls, false);
      }
    })

    this.pages[0].forms[0].controls['fromTime']
      .valueChanges.subscribe(
      (res) => {
        if (res?.value?.key) {
          this.pages[0].forms[0].controls['toTime'].setValue(null)
          this.pages[0].forms[0].controls['toTime'].setRequired(true);
          let timeArrayList = timeArray();
          let index = timeArrayList.findIndex((object) => {
            return object.key === res.value.key
          });
          let length = timeArrayList.length;
          if (index === length - 1) {
            this.pages[0].forms[0].controls['toTime'].disable();
          } else {
            (this.pages[0].forms[0].controls['toTime'] as DropdownControl)
              .controlOptions.options = (timeArrayList.slice(index + 1, length))
            this.pages[0].forms[0].controls['toTime'].enable();
          }
        }
      }
    );

    this.pages[0].forms[0].controls['securityMethod']
      .valueChanges.subscribe((valueChange) => {
      this.onSecurityMethodChange(valueChange)
    })
    if (this.editMode === ExecutionType.EDIT &&
      (this.userDetails?.companyUserDetails?.authenticationMethod === "CHALLENGE" ||
        this.userDetails?.companyUserDetails?.authenticationMethod === "TOKEN")) {

      (this.pages[0].forms[0].controls['tokens'] as DropdownControl).hidden = false;
      (this.pages[0].forms[0].controls['tokenLang'] as DropdownControl).hidden = false;
      (this.pages[0].forms[0].controls['passwordDelivery'] as DropdownControl).hidden = false;

      (this.pages[0].forms[0].controls['tokens'] as DropdownControl).enable();
      (this.pages[0].forms[0].controls['tokenLang'] as DropdownControl).enable();
      (this.pages[0].forms[0].controls['passwordDelivery'] as DropdownControl).enable();

      (this.pages[0].forms[0].controls['tokens'] as DropdownControl).controlOptions.options =
        Utils.getModelList([this.userDetails.companyUserDetails.tokenSerial,
          ...this.userDetails.unassignedHardSerialList, ...this.userDetails.unassignedSoftSerialList]);

      (this.pages[0].forms[0].controls['tokens'] as DropdownControl).setValue({
        key: 0,
        value: this.userDetails.companyUserDetails.tokenSerial
      });

      (this.pages[0].forms[0].controls['tokenLang'] as DropdownControl)
        .setValue({key: this.userDetails.companyUserDetails.tokenLanguage});

      (this.pages[0].forms[0].controls['passwordDelivery'] as DropdownControl)
        .setValue({key: this.userDetails.companyUserDetails.passDelivery});

    }
    this.pages[0].forms[0].controls['image'].valueChanges.subscribe(val => {
      Utils.blobToBase64(val.value).then(r => {
        this.userImage = r;
      })
    })
  }

  private onSecurityMethodChange(valueChange: any) {
    let value = (valueChange.value) ? valueChange.value : valueChange;
    let controls = ['passwordDelivery', 'tokenLang', 'tokens']
    if (value === "CHALLENGE") {
      Utils.changeControlsState(this.pages[0].forms[0], controls, true);
      if (this.userDetails) {
        (this.pages[0].forms[0].controls['tokens'] as DropdownControl).controlOptions.options =
          Utils.getModelList([...this.userDetails.unassignedHardSerialList, ...this.userDetails.unassignedSoftSerialList])
      } else {
        (this.pages[0].forms[0].controls['tokens'] as DropdownControl).controlOptions.options =
          Utils.getModelList([...this.initDtls.unassignedHardSerialList, ...this.initDtls.unassignedSoftSerialList])
      }

    } else {
      Utils.changeControlsState(this.pages[0].forms[0], controls, false);
    }
  }

  private setUserInfoData() {
    this.setAuthMethods()
  }

  private setAuthMethods() {
    let options = [];
    if (this.authenticationMethod === "OTP"
      || this.authenticationMethod === "STATIC") {
      options.push({
        id: 'OTP',
        title: 'company-admin.user-details.OTP'
      })
    } else if (this.authenticationMethod === "CHALLENGE") {
      options.push(
        {
          id: 'CHALLENGE',
          title: 'company-admin.user-details.TOKEN'
        })
    } else if (this.authenticationMethod === "BOTH") {
      options.push({
          id: 'OTP',
          title: 'company-admin.user-details.OTP'
        },
        {
          id: 'CHALLENGE',
          title: 'company-admin.user-details.TOKEN'
        })
    }
    this.pages[0].forms[0].controls['securityMethod'].controlOptions.options = options;
  }

  /**
   * user info End
   * */

  /**
   * Accounts Start
   * */
  private onChangeCheckboxAccountsLevels() {
    (this.pages[1].forms[0].controls['functionalityTable'] as TableControl)
      .onCheckBoxColumnChange.subscribe((markedData: any) => {
      Object.keys(markedData).forEach((accountNumber: any) => {
        for (let x = 0; x < this.pages[1].forms[0].controls['functionalityTable']
          .controlOptions.data.length; x++) {
          if (this.pages[1].forms[0].controls['functionalityTable']
            .controlOptions.data[x].accNum === accountNumber) {
            this.pages[1].forms[0].controls['functionalityTable'].controlOptions.data[x] =
              {
                ...this.pages[1].forms[0].controls['functionalityTable'].controlOptions.data[x],
                ...markedData[accountNumber]
              }
            this.accountsLevels = markedData;
          }
        }
      })
    });

  }

  private setAccountsData() {
    if (!this.pages[1].forms[0].controls['functionalityTable'].controlOptions.data) {
      this.initDtls.accountList.map((account: any) => {
        let levels = {}
        account.accountLevels.forEach((currElement: boolean, index: number) => {
          let level = {[`L${index + 1}`]: currElement}
          levels = {...levels, ...level}
        });
        const data = {
          accNum: account.fullAccountNumber,
          nickname: account.alias,
          inquiry: account.inquiry,
          ...levels
        }
        this.accTableData.push(data)
      });
      this.pages[1].forms[0].controls["functionalityTable"].controlOptions.data = this.accTableData;
    }
  }

  private setPrivileges(order: number) {
    Object.keys(this.initDtls).forEach((key) => {
      if (key.toLowerCase().includes('group')) {
        if (this.initDtls[key] instanceof Object && Object.keys(this.initDtls[key]).length > 0) {
          this.allGroupsList.push(this.initDtls[key]);

          let groupIndex = this.allGroupsList.indexOf((this.initDtls[key]))
          let listOfSelection: any[] = [];

          Object.keys(this.allGroupsList[groupIndex]).forEach((subGroupKey) => {
            listOfSelection.push({
              id: this.allGroupsList[groupIndex][subGroupKey]['groupId'],
              value: (this.initDtls.companyUserDetails) ?
                this.initDtls.companyUserDetails.groups.indexOf(this.allGroupsList[groupIndex][subGroupKey]['groupId']) !== -1
                : false,
              title: this.allGroupsList[groupIndex][subGroupKey]['description'],
            });
          })
          this.accountsGroupsList.push({
            id: key,
            title: <string>this
              .translate
              .instant('company-admin.groups.' + key),
            items: listOfSelection,
            textOnStart: false
          });
        }
      }
    })
    this.setGroupsControls(order);
  }

  /**
   * Bind Selected Groups and show in all the checkbox list
   * */
  private setSelectedGroups(order: number) {
    //fetch the groups objects from the userDetails object
    for (let z = 0; z < Object.keys(this.userDetails).length; z++) {
      if (Object.keys(this.userDetails)[z].toLowerCase().includes('group')) {
        let key = Object.keys(this.userDetails)[z];
        //fetch eligible groups for the company
        if (this.userDetails[key] instanceof Object
          && Object.keys(this.userDetails[key]).length > 0) {
          //Add it to the main list
          this.allGroupsList.push(this.userDetails[key]);
          //get its index
          let groupIndex = this.allGroupsList.indexOf((this.userDetails[key]))

          let selectionList: any[] = [];

          for (let x = 0; x < Object.keys(this.allGroupsList[groupIndex]).length; x++) {
            let groupKey = Object.keys(this.allGroupsList[groupIndex])[x];
            selectionList.push({
              id: this.allGroupsList[groupIndex][groupKey]['groupId'],
              title: this.allGroupsList[groupIndex][groupKey]['description'],
            });
          }
          let selectedGroups: any[] = [];
          for (let y = 0; y < selectionList.length; y++) {
            let group = selectionList[y];
            if (this.userDetails.companyUserDetails.groups.indexOf(group.id) != -1) {
              selectedGroups.push(group);
            }
          }
          this.accountsGroupsList.push({
            id: key,
            value: selectedGroups,
            title: <string>this
              .translate
              .instant('company-admin.groups.' + key),
            items: selectionList,
            textOnStart: false
          });
        }
      }
    }
    this.setGroupsControls(order)
    getGroupsLimitsControls().forEach((control) => {
      control[1].order = 30;
      this.pages[1].forms[0].addControl(
        control[0], control[1]
      );
    });
    this.pages[1].forms[0]
      .controls['dailyTransfer']?.setValue(this.userDetails.companyUserDetails.limit);
    this.pages[1].forms[0]
      .controls['dailyTransfer'].valueChanges.subscribe(() => {
      this.setDailyLimitCheck()
    })
    setTimeout(() => {
      this.checkLimits();
    });
  }

  private setGroupsControls(order: number) {
    for (let privilege of this.accountsGroupsList) {
      order++;
      this.pages[1].forms[0].addControl(privilege.id, new DropdownControl({
        columnCount: 6,
        order: order,
        label: privilege.title,
        value: privilege?.value!,
        controlOptions: {
          isCheckboxList: true,
          columnId: 'id',
          textField: 'title',
          options: privilege.items,
          showSelectAll: true
        }
      }));
      this.pages[1].forms[0].controls[privilege.id].valueChanges.subscribe(() => {
        this.checkLimits();
      });
    }
  }

  private checkLimits() {
    for (let row of getLimitsMatrix()) {
      if (this.pages[1].forms[0].controls[row[1]]) {
        let selectedList = this.pages[1].forms[0].controls[row[1]].value;
        if (!selectedList || selectedList.length === 0) {
          Utils.changeControlsState(this.pages[1].forms[0], [row[0]], false);
          this.pages[1].forms[0].controls[row[0]]?.setValue(null);
        } else {
          for (let group of selectedList) {
            if (group.id === row[2]) {
              Utils.changeControlsState(this.pages[1].forms[0], [row[0]], true);
              let controlName = ''
              if (row[0] === 'localTransferQuickPaymentLimits') {
                this.pages[1].forms[0].controls[row[0]]?.setValue((this.editMode === ExecutionType.EDIT) ? this.userDetails.companyUserDetails.qtlLimit : '');
              } else if (row[0] === 'ownACCTransfer') {
                controlName = 'ownACCTransfer'
                this.pages[1].forms[0].controls[row[0]]?.setValue((this.editMode === ExecutionType.EDIT) ? this.userDetails.companyUserDetails.ownacclimit : '');
              } else if (row[0] === 'withinTransfer') {
                controlName = 'withinTransfer'
                this.pages[1].forms[0].controls[row[0]]?.setValue((this.editMode === ExecutionType.EDIT) ? this.userDetails.companyUserDetails.withinlimit : '');
              } else if (row[0] === 'localTransfer') {
                controlName = 'localTransfer'
                this.pages[1].forms[0].controls[row[0]]?.setValue((this.editMode === ExecutionType.EDIT) ? this.userDetails.companyUserDetails.locallimit : '');
              } else if (row[0] === 'internationalTransfer') {
                controlName = 'internationalTransfer'
                this.pages[1].forms[0].controls[row[0]]?.setValue((this.editMode === ExecutionType.EDIT) ? this.userDetails.companyUserDetails.internationallimit : '');
              } else if (row[0] === 'billPayment') {
                controlName = 'billPayment'
                this.pages[1].forms[0].controls[row[0]]?.setValue((this.editMode === ExecutionType.EDIT) ? this.userDetails.companyUserDetails.billPaymentLimit : '');
              } else if (row[0] === 'governmentPayment') {
                controlName = 'governmentPayment'

                this.pages[1].forms[0].controls[row[0]]?.setValue((this.editMode === ExecutionType.EDIT) ? this.userDetails.companyUserDetails.governmentPaymentLimit : '');
              } else if (row[0] === 'esalLimit') {
                controlName = 'esalLimit'
                this.pages[1].forms[0].controls[row[0]]?.setValue((this.editMode === ExecutionType.EDIT) ? this.userDetails.companyUserDetails.sadadInvoiceHubLimit : '');
              } else if (row[0] === 'bulkLimit') {
                controlName = 'bulkLimit'
                this.pages[1].forms[0].controls[row[0]]?.setValue((this.editMode === ExecutionType.EDIT) ? this.userDetails.companyUserDetails.bulkLimit : '');
              }
            }
          }
          this.setDailyLimitCheck()
        }
      }
    }
  }

  setDailyLimitCheck() {
    for (const row of getGroupsLimitsControls()) {
      if (!this.pages[1].forms[0].controls[row[0]].hidden && row[0] !== 'dailyTransfer') {
        let validatorsItems: ValidatorsItem[] = [];
        validatorsItems.push({
          validation: ValidationsEnum.MAX,
          options: (this.editMode === ExecutionType.EDIT && row[0] === 'localTransferQuickPaymentLimits')
            ? ((this.userDetails.companyUserDetails.type === userTypeEnum.CA)
              ? this.ipsConfig.maxQTL : this.ipsConfig.qtl)
            : (row[0] === 'localTransferQuickPaymentLimits')
              ? this.ipsConfig.qtl : (this.pages[1].forms[0].controls['dailyTransfer'].value)
        })
        this.pages[1].forms[0].controls[row[0]].validationLabels =
          {
            max: (row[0] === 'localTransferQuickPaymentLimits') ?
              this.translate.instant("company-admin.user-accounts.qtlLimitValidation") + ' '
              + validatorsItems[0].options :
              "company-admin.user-accounts.dailyLimitValidation"
          }
        this.pages[1].forms[0].controls[row[0]].setValidators(validatorsItems)
      }
    }

  }

  /**
   * Accounts End
   * */
  /**
   * Privilege start
   * */
  private changePrivilegeSubscriptions(isEdit: boolean = false) {
    let details = (!isEdit) ? this.initDtls : this.userDetails
    this.privilegesListKeys = this.translate.instant("company-admin.privileges.functionality");
    if (!this.pages[2].forms[0].controls['functionalityTable']?.controlOptions?.data) {
      let tempPrivileges = []
      let privilegesAcceptance = []

      for (let [k, v] of Object.entries(details.backEndAccountPrivileges)) {
        if (!(v instanceof Array)) {
          let key = k.substring(0, k.indexOf('Privilege')).toLowerCase()
          privilegesAcceptance.push({[key]: v});
        }
      }
      for (let privilege of privilegesAcceptance) {
        let [privilegeKey, v] = Object.entries(privilege)[0]
        if (v) {
          for (let [k, v] of Object.entries(details.backEndAccountPrivileges)) {
            if (v instanceof Array && k.toLowerCase().includes(privilegeKey)) {
              tempPrivileges.push({
                id: k,
                title: <string>'company-admin.privileges.functionality.' + k,
                value: details.backEndAccountPrivileges[k]
              })
              break;
            }
          }
        }
      }
      this.privilegeTableData = tempPrivileges;
      this.privilegeTableData.forEach((record) => {
        record['L1'] = record.value[0];
        record['L2'] = record.value[1];
        record['L3'] = record.value[2];
        record['L4'] = record.value[3];
        record['L5'] = record.value[4];
      })
      this.pages[2].forms[0].controls['functionalityTable'].controlOptions.data = this.privilegeTableData;
    }
    (this.pages[2].forms[0].controls['functionalityTable'] as TableControl)
      .onCheckBoxColumnChange.subscribe((res) => {
      Object.keys(res).forEach((privilegeKey) => {
        for (let x = 0; x < this.pages[2].forms[0].controls['functionalityTable'].controlOptions.data.length; x++) {
          if (privilegeKey === this.pages[2].forms[0].controls['functionalityTable'].controlOptions.data[x].id) {
            this.pages[2].forms[0].controls['functionalityTable'].controlOptions.data[x] =
              {...this.pages[2].forms[0].controls['functionalityTable'].controlOptions.data[x], ...res[privilegeKey]}
          }
        }
      })
    })
    if (this.eTradeDtls?.companyDetails?.companyEtradeFunctionList?.length > 0 &&
      !this.pages[2].forms[0].controls['eTrade']?.controlOptions?.data) {
      this.pages[2].forms[0].addControl('eTrade', new TableControl({
        columnCount: 12,
        order: 3,
        controlOptions: {
          title: 'company-admin.user-info.e-trade',
          pageSizes: [50, 100],
          paginationValue: {
            page: 1,
            size: 50
          },
          headers: [
            {title: 'Functionality', fieldName: "title", type: TableHeaderType.TEXT},
            {title: 'company-admin.user-info.e-trade-initiate', fieldName: "initiate", type: TableHeaderType.CHECK_BOX},
            {title: 'L1', fieldName: "L1", type: TableHeaderType.CHECK_BOX},
            {title: 'L2', fieldName: "L2", type: TableHeaderType.CHECK_BOX},
            {title: 'L3', fieldName: "L3", type: TableHeaderType.CHECK_BOX},
            {title: 'L4', fieldName: "L4", type: TableHeaderType.CHECK_BOX},
            {title: 'L5', fieldName: "L5", type: TableHeaderType.CHECK_BOX},
          ],
          columnId: 'id',
        }
      }));
      let data: any = [];
      for (let functions of this.eTradeDtls.companyDetails.companyEtradeFunctionList) {
        data.push({
          id: functions.etradeFunction.functionId,
          title: (this.translate.currentLang === 'en') ? functions.etradeFunction.descriptionEn :
            functions.etradeFunction.descriptionAr,
          initiate: false,
          L1: false,
          L2: false,
          L3: false,
          L4: false,
          L5: false
        })
      }
      (this.pages[2].forms[0].controls['eTrade'] as TableControl).controlOptions.data = data;
      if (isEdit) {
        let functions = details.userEtradeFunctions;
        if (functions && functions.length > 0) {
          for (let i = 0; i < functions.length; i++) {
            for (let j = 0; j < data.length; j++) {
              data[j].initiate = !!functions[i].initiator;
              if (functions[i].level)
                if (data[j].id === functions[i].etradeFunction.functionId) {
                  for (let k = 1; k <= functions[i].level; k++) {
                    data[j]['L' + k] = true;
                  }
                }
            }

          }
        }
      }
      (this.pages[2].forms[0].controls['eTrade'] as TableControl).onCheckBoxColumnChange.subscribe(
        (changesBoxes: any) => {
          Object.keys(changesBoxes).forEach((keyChanged) => {
            for (let x = 0; x < this.pages[2].forms[0].controls['eTrade'].controlOptions.data.length; x++) {
              if (keyChanged === this.pages[2].forms[0].controls['eTrade'].controlOptions.data[x].id) {
                this.pages[2].forms[0].controls['eTrade'].controlOptions.data[x] =
                  {
                    ...this.pages[2].forms[0].controls['eTrade'].controlOptions.data[x],
                    ...changesBoxes[keyChanged]
                  }
                break;
              }
            }
          })

        }
      )
    }
  }

  /**
   * Privilege End
   * */
  /**
   * Service preparations
   * */
  private prepareRequest() {

    let userObject = Utils.getObjectFromFormControls(this.pages[0].forms[0],
      getObjectConfigMap(), {});

    this.prepareUserInfo(userObject);

    if (this.editMode === ExecutionType.EDIT)
      userObject.userPk = this.userDetails.companyUserDetails.userPk

    if (this.workFlowType === CompanyWorkflowTypeEnum.WORKFLOW) {
      //groups
      this.prepareGroups()
      //Limits
      this.prepareLimits(userObject)
      //Accounts
      this.prepareAccounts()
      //Privileges
      this.preparePrivilege()
      //ETrade
      this.prepareETrade()
    }
    if (this.userImage) {
      userObject.userImage = this.userImage;
      return userObject
    } else {
      return userObject
    }
  }

  private prepareUserInfo(userObject: any) {
    userObject.nationality = userObject?.nationality?.key;
    userObject.preferedLanguage = userObject?.preferedLanguage?.key;
    userObject.birthDate = (userObject.birthDate) ? userObject.birthDate.year +
      '-' + userObject.birthDate.month + '-' +
      userObject.birthDate.day : null;
    userObject.idExpireDate = (userObject.idExpireDate &&
      userObject.idExpireDate instanceof Object) ?
      userObject.idExpireDate.year
      + '-' + userObject.idExpireDate.month + '-'
      + userObject.idExpireDate.day : '';
    if (userObject.accessLimited) {
      if (userObject.daysOfWeek instanceof Array) {
        userObject.daysOfWeek.forEach((value: any, index: number) => {
          userObject.daysOfWeek[index] = {dayValue: value.key}
        });
      } else {
        userObject.daysOfWeek = null;
      }
      userObject.accessFrom = userObject.accessFrom.key
      userObject.accessTo = userObject.accessTo.key
    } else {
      userObject.accessLimited = false
    }
    if (userObject.authenticationMethod === 'CHALLENGE') {
      userObject.passDelivery = userObject.passDelivery.key;
      userObject.tokenLanguage = userObject.tokenLanguage.key;
      userObject.tokenSerial = userObject.tokenSerial.value;
    }
  }

  private prepareGroups() {
    this.addSelectedGroup = [];
    for (let y = 0; y < Object.keys(this.pages[1].forms[0].controls).length; y++) {
      let control = Object.keys(this.pages[1].forms[0].controls)[y]
      if (control.toLowerCase().includes('group')) {
        if (this.pages[1].forms[0].controls[control] instanceof Object &&
          Object.keys(this.pages[1].forms[0].controls[control]).length > 0) {
          if (this.pages[1].forms[0].controls[control].value instanceof Array) {
            for (let x = 0; x < this.pages[1].forms[0].controls[control].value.length; x++) {
              let groupCheckBox = this.pages[1].forms[0].controls[control].value[x]
              if (this.editMode === ExecutionType.EDIT) {
                this.addSelectedGroup.push(this.userDetails[control][groupCheckBox.id])
              } else {
                this.addSelectedGroup.push(this.initDtls[control][groupCheckBox.id])
              }
            }
          }
        }
      }
    }
  }

  private prepareLimits(userObject: any) {
    userObject.limit = this.pages[1].forms[0].controls['dailyTransfer']?.value;
    userObject.qtlLimit = this.pages[1].forms[0].controls['localTransferQuickPaymentLimits']?.value;
    userObject.ownacclimit = this.pages[1].forms[0].controls['ownACCTransfer']?.value;
    userObject.withinlimit = this.pages[1].forms[0].controls['withinTransfer']?.value;
    userObject.locallimit = this.pages[1].forms[0].controls['localTransfer']?.value;
    userObject.internationallimit = this.pages[1].forms[0].controls['internationalTransfer']?.value;
    userObject.billPaymentLimit = this.pages[1].forms[0].controls['billPayment']?.value;
    userObject.governmentPaymentLimit = this.pages[1].forms[0].controls['governmentPayment']?.value;
    userObject.sadadInvoiceHubLimit = this.pages[1].forms[0].controls['esalLimit']?.value;
    userObject.bulkLimit = this.pages[1].forms[0].controls['bulkLimit']?.value;
  }

  private prepareAccounts() {
    this.selectedAccountList = (this.editMode === ExecutionType.ADD && this.initDtls) ?
      this.initDtls.accountList : this.userDetails.checkaccountlist;
    if (this.accountsLevels) {
      Object.keys(this.accountsLevels).forEach((accountNumber) => {
        this.selectedAccountList.forEach((account: Account) => {
          if (account.fullAccountNumber === accountNumber) {
            account.inquiry = this.accountsLevels[accountNumber].inquiry
            account.accountLevels = [
              this.accountsLevels[accountNumber].L1,
              this.accountsLevels[accountNumber].L2,
              this.accountsLevels[accountNumber].L3,
              this.accountsLevels[accountNumber].L4,
              this.accountsLevels[accountNumber].L5]
            account.payment = account.accountLevels.includes(true)
          }
        })
      })
    }
  }

  private preparePrivilege() {
    this.userAccountPrivileges =
      (this.editMode === ExecutionType.ADD && this.initDtls)
        ? this.initDtls?.backEndAccountPrivileges
        : this.userDetails.backEndAccountPrivileges;
    this.pages[2].forms[0].controls['functionalityTable']?.controlOptions?.data?.forEach(
      (userPrivilege: any) => {
        this.userAccountPrivileges[userPrivilege.id][0] = userPrivilege.L1;
        this.userAccountPrivileges[userPrivilege.id][1] = userPrivilege.L2;
        this.userAccountPrivileges[userPrivilege.id][2] = userPrivilege.L3;
        this.userAccountPrivileges[userPrivilege.id][3] = userPrivilege.L4;
        this.userAccountPrivileges[userPrivilege.id][4] = userPrivilege.L5;
      }
    )
  }

  private prepareETrade() {
    this.userEtradeFunctions = [];
    if (this.pages[2].forms[0].controls['eTrade']?.controlOptions?.data) {
      this.pages[2].forms[0].controls['eTrade']
        .controlOptions.data.forEach((eTradefunction: any) => {
        let selected = this.eTradeDtls.companyDetails.companyEtradeFunctionList.filter((func) => {
          return eTradefunction.id === func.etradeFunction.functionId
        });
        let level: any = null;
        Object.keys(eTradefunction).forEach((key) => {
          if (key.includes('L')) {
            if (eTradefunction[key])
              (level) ? level++ : level = 1;
          }
        })
        let etFunction = {...selected[0], initiator: eTradefunction.initiate, level: level, userEtradeFunctionsPk: null}
        this.userEtradeFunctions.push(etFunction)
      })
    }
  }

  /**
   * Service preparations end
   * */

  /**
   * Web service start
   * */
  private validationAndExecution(userDetails: RequestUserManagementValidate,
                                 successMessage: string) {
    this.userManagementService.validateUserOperation(userDetails).subscribe((res) => {
      let formModel: FormModel
      switch (userDetails.typeOperation) {
        case USER_BLOCK_OP_TYPE:
          formModel = getBlockForm();
          break
        case USER_DELETE_OP_TYPE:
          formModel = getDeleteForm();
          break
        case USER_RESET_PASSWORD_OP_TYPE:
          formModel = getResetForm();
          break
        default:
          formModel = getUnBlockForm();
      }
      let data: PopupInputModel = {
        image: 'assets/img/warning.svg',
        form: formModel
      }

      this.popupService.showPopup(data).subscribe((PopupOutputModel: PopupOutputModel) => {
        switch (PopupOutputModel.buttonId) {
          case 'cancel':
            this.popupService.dismiss()
            break;
          case 'delete':
            switch (userDetails.typeOperation) {
              case USER_BLOCK_OP_TYPE:
                this.userManagementService.blockUserOperation({userId: res.user.userId, sendMail: false}).subscribe(
                  () => {
                    this.showStatus = true;
                    this.result = {
                      title: "company-admin.user-info.delete-success-title",
                      subTitle: successMessage,
                      type: "Success",
                      summary: undefined,
                    }
                    this.popupService.dismiss()
                  }
                )
                break;
              case USER_UNBLOCK_OP_TYPE:
                this.userManagementService.unBlockUserOperation({userId: res.user.userId, sendMail: false}).subscribe(
                  () => {
                    this.showStatus = true;
                    this.result = {
                      title: "company-admin.user-info.delete-success-title",
                      subTitle: successMessage,
                      type: "Success",
                      summary: undefined,
                    }
                    this.popupService.dismiss()
                  }
                )
                break;
              case USER_RESET_PASSWORD_OP_TYPE:
                this.userManagementService.resetPasswordUserOperation({
                  userId: res.user.userId,
                  sendMail: false
                }).subscribe(
                  () => {
                    this.showStatus = true;
                    this.result = {
                      title: "company-admin.user-info.delete-success-title",
                      subTitle: successMessage,
                      type: "Success",
                      summary: undefined,
                    }
                    this.popupService.dismiss()
                  }
                )
                break;
              default:
                this.userManagementService.confirmUserOperation({user: res.user, requestValidate: {}}).subscribe(
                  () => {
                    this.showStatus = true;
                    this.result = {
                      title: "company-admin.user-info.delete-success-title",
                      subTitle: successMessage,
                      type: "Success",
                      summary: undefined,
                    }
                    this.popupService.dismiss()
                  }
                )
                break
            }
            break;
        }
      });
    })

  }

  private executeValidate(userObject: any) {
    if (this.editMode === ExecutionType.ADD) {
      this.addUserValidate(userObject)
    }
    if (this.editMode === ExecutionType.EDIT) {
      this.updateUser(userObject)
    }
  }

  private addUserValidate(userObject: any) {
    const userDetails: RequestUserManagementValidate = {
      backEndAccountPrivileges: this.userAccountPrivileges,
      companyUser: userObject,
      listAccount: this.selectedAccountList,
      listWebSCIC: [],
      profileNumber: JSON.parse(sessionStorage.getItem('company')!).profileNumber,
      typeOperation: USER_REGISTER_OP_TYPE,
      userEtradeFunctions: this.userEtradeFunctions,
      selectedGroupList: this.addSelectedGroup,
    }
    this.userManagementService.validateUserOperation(userDetails).subscribe({
        next: (res) => {
          Utils.scrollTop();
          this.validateUserResponse = res;
          this.addSummary();
          this.pageTitle.stepper!.stepCounter++
        },
        error: () => {
        }
      }
    );
  }

  private updateUser(userObject: any) {
    let userDetailsTemp = structuredClone(this.userDetails);
    userDetailsTemp.companyUserDetails = {...userObject}
    const userDetails: RequestUserManagementValidate = {
      typeOperation: USER_MODIFY_OP_TYPE,
      companyUser: userDetailsTemp.companyUserDetails,
      listAccount: userDetailsTemp.checkaccountlist,
      backEndAccountPrivileges: userDetailsTemp.backEndAccountPrivileges,
      userEtradeFunctions: this.userEtradeFunctions,
      selectedGroupList: this.addSelectedGroup,
    }
    this.userManagementService.validateUserOperation(userDetails).subscribe((res) => {
      Utils.scrollTop();
      this.validateUserResponse = res;
      this.addSummary();
      this.pageTitle.stepper!.stepCounter++
    });
  }

  private addUserConfirm() {
    if (this.editMode === ExecutionType.EDIT) {
      this.validateUserResponse.user.typeUser = this.userDetails.companyUserDetails.type
      this.validateUserResponse.user.userPk = this.userDetails.companyUserDetails.userPk
      this.validateUserResponse.user.blocked = this.userDetails.companyUserDetails.blocked
    }
    let userDetails: RequestUserManagementConfirm = {
      user: this.validateUserResponse.user,
      requestValidate: {}
    }
    this.userManagementService.confirmUserOperation(userDetails)
      .subscribe(() => {
        Utils.scrollTop();
        this.showStatus = true;
        if (this.editMode !== ExecutionType.EDIT && this.workFlowType === CompanyWorkflowTypeEnum.BASIC) {
          this.result = {
            title: 'company-admin.success-creation',
            subTitle: 'company-admin.maker-checker-suggestion',
            type: "Success",
            summary: this.summary,
          }
        } else {
          this.result = {
            title: "company-admin.success-title",
            subTitle: (this.editMode === ExecutionType.EDIT) ?
              'company-admin.success-update' : 'company-admin.success-creation',
            type: "Success",
            summary: this.summary,
          }
        }
        this.pageTitle.stepper!.stepCounter++;
        this.updateCurrentUserInfo(this.validateUserResponse.user);
      })
  }

  async updateCurrentUserInfo(user: User) {
    const currentUser = await this.sharedStoreService.getUserStoredInfo();
    if (currentUser?.userId === user?.userId) {
      let updatedUser = {...currentUser, userName: user.userName};
      updatedUser.userImage = user.userImage ? user.userImage : currentUser.userImage;
      this.store.dispatch(
        addUserInfoAction({
          userInfo: updatedUser,
        })
      );
    }
  }

  /**
   * Web service end
   * */


  getUserStatus() {
    if (this.userDetails.companyUserDetails.userStatus === 'A')
      return 'public.active'
    else if (this.userDetails.companyUserDetails.userStatus === 'I')
      return 'public.inactive'
    else if (this.userDetails.companyUserDetails.userStatus === 'E')
      return 'public.expired'
    else
      return 'public.blocked'

  }
}
