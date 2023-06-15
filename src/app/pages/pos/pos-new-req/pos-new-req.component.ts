import { Component, OnInit } from '@angular/core';
import {
  FormModel,
  FormResult,
  PageModel,
} from '../../../@core/model/dto/formModel';
import { ResultModal } from '../../../@core/model/dto/result.modal';
import { FutureSecurityLevelsDtolist } from '../../../@core/model/rest/common/batchResponse';
import { FormButtonClickOutput } from '../../../shared/form/form.component';
import { SummaryModel } from 'arb-design-library/model/summary.model';
import {
  AuthLevelSummaryHeaders,
  cityControl,
  contactNameControl,
  phoneNumberControl,
  requestStatus,
  requestTypeControl,
  toAccountControl,
  uploadFileControl,
} from './new-request.controls';
import { UploadControl } from 'app/@core/model/dto/control/upload-control';
import { AccountControl } from 'app/@core/model/dto/control/account-control';
import { DropdownControl } from 'app/@core/model/dto/control/dropdown-control';
import { TextInputControl } from 'app/@core/model/dto/control/text-input-control';
import { ModelAndListService } from 'app/@core/service/base/modelAndList.service';
import { Utils } from 'app/@core/utility/Utils';
import { ActivatedRoute } from '@angular/router';
import { POSService } from 'app/@core/service/pos/pos.service';
import {
  POSNewRequestConfirmReq,
  POSNewRequestValidateRes,
} from 'app/@core/model/rest/pos/new-req/new-request-res';
import {
  POS,
  POS_NW_REQQ,
  POS_NW_REQ_STATUS,
} from 'app/@core/constants/pages-urls-constants';
import { SEC_LVL_ST } from 'app/@core/constants/consts';
import { VerificationService } from 'app/@core/service/base/verification.service';
import { RequestValidate } from 'app/@core/model/rest/common/otp.model';
import { Account } from 'app/@core/model/rest/common/account';
import { PosBaseComponent } from '../pos-base/pos-base.component';
import { AccountsCommonService } from '../../../@core/service/accounts/accounts-common.service';
import { PhoneControl } from 'app/@core/model/dto/control/phone-control';
import { TableHeaderModel } from 'arb-design-library/model/table-header.model';
import { SummaryTable } from 'arb-design-library/model/summary-section.model';
import { DividerControl } from 'app/@core/model/dto/control/divider-control';
import { TitleControl } from 'app/@core/model/dto/control/title-control';

@Component({
  selector: 'app-pos-new-req',
  templateUrl: '../pos-base/pos-base.component.html',
  styleUrls: [],
})
export class PosNewReqComponent extends PosBaseComponent implements OnInit {
  newRequestForm: FormModel = new FormModel({
    id: 'newRequestForm',
    controls: {
      requestStatus: new TitleControl(requestStatus),
      divider: new DividerControl({ columnCount: 12, order: 2 }),
      toAccountControl: new AccountControl(toAccountControl),
      requestTypeControl: new DropdownControl(requestTypeControl),
      cityControl: new DropdownControl(cityControl),
      contactNameControl: new TextInputControl(contactNameControl),
      phoneNumberControl: new PhoneControl(phoneNumberControl),
      uploadFileControl: new UploadControl(uploadFileControl),
    },
  });

  accounts: Account[] = [];
  cities: any;
  posRequestTypes: any;
  authLevelList!: any;
  mobileNumber: string = '';
  user: any;
  userDetails: any;
  data: Array<any> = [];

  posNewRequestValidateRes!: POSNewRequestValidateRes;
  posNewRequestConfirmReq!: POSNewRequestConfirmReq;
  branch: string = '';

  constructor(
    private accountsService: AccountsCommonService,
    private route: ActivatedRoute,
    private posService: POSService,
    private otpService: VerificationService,
    private modelAndListService: ModelAndListService
  ) {
    super();

    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) this.router.navigateByUrl(`/${POS}`);

    this.userDetails = JSON.parse(JSON.stringify(storedUser)) as any;

    this.pageTitle = {
      id: 'NewRequestTitle',
      title: 'pos.new-request.title',
      subTitle: '',
      type: 'Page', 
      showArrow: true,
      stepper: {
        steps: ['', '', ''],
        stepCounter: 1,
        stepText: 'public.step',
        ofText: 'public.of',
      },
    };

    this.startButtons = [this.backButton];
    this.endButtons = [this.nextButton];

    this.pages = [new PageModel(1, this.newRequestForm)];
  }

  ngOnInit(): void {
    this.branch = JSON.parse(sessionStorage.getItem('company')!)?.branchNameEn;
    this.newRequestForm.controls['phoneNumberControl'].setValue(
      this.userDetails.mobile ?? ''
    );

    this.setBreadcrumb([
      {
        text: 'pos.dashboard.title',
        url: `/${POS}`,
      },
      {
        text: 'pos.new-request.title',
        url: `/${POS}/${POS_NW_REQQ}`,
      },
    ]);
    this.getLookups();
    this.getMainAccounts();
  }

  getLookups() {
    this.modelAndListService
      .getList(['cityType', 'posRequestType', 'batchSecurityLevelStatus'])
      .subscribe((models) => {
        for (let key of Object.keys(models)) {
          switch (key) {
            case 'cityType':
              this.cities = Utils.getModelList(models[key]);
              break;
            case 'posRequestType':
              this.posRequestTypes = Utils.getModelList(models[key]);
              break;
            case 'batchSecurityLevelStatus':
              this.authLevelList = Utils.getModelList(models[key]);
          }
        }

        this.posRequestTypes = this.posRequestTypes?.filter(
          (a: any) => a.key != 'R003'
        );
        this.newRequestForm.controls['cityControl'].controlOptions.options =
          this.cities;

        this.newRequestForm?.controls['cityControl'].setValue(
          this.cities.find(
            (item: { key: string; value: string }) => item.key === '00000000'
          )
        );

        this.newRequestForm.controls[
          'requestTypeControl'
        ].controlOptions.options = this.posRequestTypes;
      });
  }

  getMainAccounts() {
    this.accountsService.getPOSMainAccounts().subscribe({
      next: (res) => {
        this.accounts = res.accountListPos;
        this.newRequestForm.controls[
          'toAccountControl'
        ].controlOptions.options = this.accounts;
      },
      error: () => {
        this.accounts = [];
      },
    });
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case this.buttonsIDs.next:
        this.moveToSummary();
        break;
      case this.buttonsIDs.confirm:
        this.validateRequest();
        break;
      case this.buttonsIDs.proceed:
        this.confirmRequest();
        break;
      case this.buttonsIDs.edit:
        this.back();
        break;
      case "arrowTitle":  
      case this.buttonsIDs.back:
        this.back();
        break;
      case this.buttonsIDs.backToNew:
        this.router.navigateByUrl(POS);
        break;
      case this.buttonsIDs.backToDash:
        this.router.navigateByUrl('/dashboard');
        break;
      case 'requestStatus':
        this.router.navigateByUrl(
          `/${POS}/${POS_NW_REQQ}/${POS_NW_REQ_STATUS}`
        );
        break;
      default:
        break;
    }
  }

  moveToSummary() {
    this.summary = this.fillSummary();
    this.endButtons = [];
    this.stepperMoveNext();
    this.endButtons = [this.confirmButton];
  }

  moveToSuccess() {
    this.endButtons = [this.successBackToDash, this.successBackToNew];
    this.startButtons = [];

    this.fillSuccess();
    this.stepperMoveNext();
  }

  fillSummary(): SummaryModel {
    return {
      sections: [
        {
          title: {
            id: 'pos-new-request-sumary',
            title: this.getControl(0, 0, 'requestTypeControl').value.value,
            type: 'Section',
            startButtons:
              this.pageTitle &&
              this.pageTitle.stepper &&
              this.pageTitle.stepper.stepCounter > 1
                ? []
                : [this.editButton],
          },
          items: [
            {
              title: 'public.account-number',
              subTitle: this.getControl(0, 0, 'toAccountControl').value
                .fullAccountNumber,
            },
            {
              title: 'pos.new-request.city',
              subTitle: this.getControl(0, 0, 'cityControl').value.value,
            },
            {
              title: 'pos.new-request.contact-name',
              subTitle: this.getControl(0, 0, 'contactNameControl').value,
            },
            {
              title: 'pos.new-request.phone-number',
              subTitle: this.getControl(0, 0, 'phoneNumberControl').value,
            },
            {
              title: 'pos.new-request.uploaded-file',
              subTitle: this.getControl(0, 0, 'uploadFileControl').value.name,
            },
          ],
        },
      ],
    };
  }

  fillSuccess(): ResultModal {
    this.summary = this.fillSummary();
    this.summary.title = {
      id: 'pos-new-request-success-title',
      title: this.getControl(0, 0, 'requestTypeControl').value.value,
      type: 'Section',
    };
    return (this.result = {
      type: 'Success',
      title: 'pos.new-request.success-title',
      subTitle: 'public.thank',
      summary: this.summary,
    });
  }

  validateRequest() {
    let dataList: any[] = [];
    const request = {
      accountNumber: this.getControl(0, 0, 'toAccountControl').value
        .fullAccountNumber,
      mobile: this.getControl(0, 0, 'phoneNumberControl').value,
      contactName: this.getControl(0, 0, 'contactNameControl').value,
      branch: this.branch,
      city: this.getControl(0, 0, 'cityControl').value.key,
      type: this.getControl(0, 0, 'requestTypeControl').value.key,
    };
    const formData = new FormData();
    formData.append('json', JSON.stringify(request));

    const companyRegDoc: File = this.getControl(
      0,
      0,
      'uploadFileControl'
    ).value;

    if (companyRegDoc?.name?.length > 0) formData.append('file', companyRegDoc);

    this.posService.validateRequest(formData).subscribe({
      next: (res) => {
        const authLevelData = res.batch?.futureSecurityLevelsDTOList;

        authLevelData?.forEach((element) => {
          const status = this.authLevelList.find(
            (status: { key: string; value: string }) => {
              if (element.status == status.key) {
                return status.value;
              } else {
                return undefined;
              }
            }
          );

          const object = {
            userLevel: element.level,
            status: status.value,
            userId: element.updater,
            dateTime: '',
          };
          dataList.push(object);
        });
        this.data = dataList;
        this.handleValidateRequestResponse(res);
      },
      error: () => {},
      complete: () => {},
    });
  }

  handleValidateRequestResponse(res: POSNewRequestValidateRes) {
    this.posNewRequestValidateRes = res;

    this.posNewRequestConfirmReq = {
      batch: res.batch,
    };

    switch (this.posNewRequestValidateRes.batch.futureStatus) {
      case SEC_LVL_ST.PROCESS:
        this.handleProcessStatus();
        break;
      case SEC_LVL_ST.PENDING:
        this.handlePendingStatus();
        break;

      case SEC_LVL_ST.NOT_ALLOWED:
        this.handleNotAllowedStatus();
        break;

      default:
        break;
    }
  }

  handleProcessStatus() {
    if (
      this.posNewRequestValidateRes.generateChallengeAndOTP &&
      this.posNewRequestValidateRes.generateChallengeAndOTP.typeAuthentication
    )
      this.showOtp();
    else this.confirmRequest();
  }

  showOtp() {
    this.otpService
      .showVerification(this.posNewRequestValidateRes.generateChallengeAndOTP)
      .subscribe((requestValidate: RequestValidate) => {
        this.posNewRequestConfirmReq.requestValidate = requestValidate;
        this.confirmRequest();
      });
  }

  handlePendingStatus() {
    let secList: FutureSecurityLevelsDtolist[] = [];
    if (
      this.posNewRequestValidateRes?.batch &&
      this.posNewRequestValidateRes?.batch?.futureSecurityLevelsDTOList &&
      this.posNewRequestValidateRes?.batch?.futureSecurityLevelsDTOList
        ?.length > 0
    ) {
      secList =
        this.posNewRequestValidateRes.batch.futureSecurityLevelsDTOList.map(
          (e) => {
            let item: FutureSecurityLevelsDtolist = {
              auditStatus: e.auditStatus,
              batchSecurityPk: e.auditStatus,
              level: e.level,
              pdfStatus: e.pdfStatus,
              status: e.status,
              updateDate: e.updateDate,
              userPk: e.userPk,
              updater: e.updater ?? '',
            };
            return item;
          }
        );
    }

    const summarySection = {
      title: {
        id: 'authLevelSummaryTitle',
        title: 'pos.new-request.auth-level-info',
      },

      table: this.getAuthLevelSummaryTableData(
        this.data,
        AuthLevelSummaryHeaders(this.authLevelList)
      ),
    };

    this.summary.sections?.push(summarySection);

    this.endButtons = [this.proceedButton];
  }

  getAuthLevelSummaryTableData(
    data: any,
    headers: TableHeaderModel[]
  ): SummaryTable {
    return {
      columnId: 'userLevel',
      headers: headers,
      maxDisplayRow: 5,
      data,
      exportFileName: 'pos.new-request.file-name',
    };
  }

  confirmRequest() {
    this.posService.confirmRequest(this.posNewRequestConfirmReq).subscribe({
      next: () => {
        this.moveToSuccess();
      },
    });
  }

  handleNotAllowedStatus() {}

  override onResultChanged(formResult: FormResult[]) {
    if (this.endButtons.length > 0)
      this.endButtons[0].isDisable = !formResult[0].valid;
  }

  back() {
    if (this.pageTitle.stepper!.stepCounter > 1) {
      this.buildEndButtons();
      this.stepperMoveBack();
    } else {
      void this.router.navigateByUrl(`/${POS}`);
    }
  }

  buildEndButtons() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 2:
        this.endButtons = [this.nextButton];
        break;
    }
  }
}
