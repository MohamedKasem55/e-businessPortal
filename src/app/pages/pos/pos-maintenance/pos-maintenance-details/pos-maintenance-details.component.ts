import {Component, OnInit} from '@angular/core';
import {POS, POS_MAINTENANCE} from 'app/@core/constants/pages-urls-constants';
import {FormResult, PageModel} from 'app/@core/model/dto/formModel';
import {ResultModal} from 'app/@core/model/dto/result.modal';
import {Account} from 'app/@core/model/rest/common/account';
import {FutureSecurityLevelsDtolist} from 'app/@core/model/rest/common/batchResponse';
import {RequestValidate} from 'app/@core/model/rest/common/otp.model';
import {ModelAndListService} from 'app/@core/service/base/modelAndList.service';
import {VerificationService} from 'app/@core/service/base/verification.service';
import {Utils} from 'app/@core/utility/Utils';
import {FormButtonClickOutput} from 'app/shared/form/form.component';
import {SummaryModel} from 'arb-design-library/model/summary.model';
import {PosBaseComponent} from "../../pos-base/pos-base.component";
import {AccountsCommonService} from "../../../../@core/service/accounts/accounts-common.service";
import {selectTerminalForm} from "./pos-maintenance-details.controls";
import {PosMaintenanceService} from 'app/@core/service/pos/maintenance/pos-maintenance.service';
import {PosMaintananceValidateReq} from 'app/@core/model/rest/pos/maintenance/validate-req';
import {PosMaintananceValidateRes} from 'app/@core/model/rest/pos/maintenance/validate-res';
import {PosMaitananceConfirmReq} from 'app/@core/model/rest/pos/maintenance/confirm-req';

@Component({
  selector: 'app-pos-maintenance-details',
  templateUrl: '../../pos-base/pos-base.component.html',
  styleUrls: []
})
export class PosMaintenanceDetailsComponent extends PosBaseComponent implements OnInit {

  accounts: Account[] = [];
  cities: any;
  posRequestTypes: any;
  posNewRequestValidateRes!: PosMaintananceValidateRes;
  posNewRequestConfirmReq!: PosMaitananceConfirmReq;
  branch: string = '';
  selectedTerminal = '';

  constructor(
    private accountsService: AccountsCommonService,
    private modelAndListService: ModelAndListService,
    private posService: PosMaintenanceService,
    private otpService: VerificationService
  ) {
    super();
    this.breadcrumbService.setBreadcrumb([
      {
        text: 'pos.dashboard.title',
        url: '/pos'
      },
      {
        text: 'pos.maintenance.terminals',
        url: '/pos/pos-ternminals'
      },
      {
        text: 'pos.maintenance.pos-maintenance-request',
        url: ''
      },
    ]);
    this.startButtons = [this.backButton];
    this.endButtons = [this.nextButton];
    this.pages = [new PageModel(1, selectTerminalForm())];
    this.pageTitle = {
      id: 'NewRequestTitle',
      title: 'pos.maintenance.pos-maintenance-request',
      type: 'Page',
      stepper: {
        steps: ['', '', ''],
        stepCounter: 1,
        stepText: 'public.step',
        ofText: 'public.of',
      },
    };
  }

  ngOnInit(): void {
    this.branch = JSON.parse(sessionStorage.getItem('company')!)?.branchNameEn;
    this.setSelectedTerminal();
  }


  setSelectedTerminal() {
    if (!history.state?.selectedTerminal) {
      this.router.navigate([`pos/${POS_MAINTENANCE}`]);
    } else {
      this.selectedTerminal = history.state?.selectedTerminal;
      this.getControl(0, 0, 'pillTitle').controlOptions.text = this.selectedTerminal;
      this.getMainAccounts();
      this.getLookups();
    }
  }


  getMainAccounts() {
    this.accountsService.getPOSMainAccounts().subscribe({
      next: (res) => {
        this.accounts = res.accountListPos;
        this.pages[0].forms[0].controls['toAccountControl'].controlOptions.options = this.accounts;
      },
      error: () => {
        this.accounts = [];
      },
    });
  }

  getLookups() {
    this.modelAndListService
      .getList(['cityType', 'posMaintenanceRequestType'])
      .subscribe((models) => {
        for (let key of Object.keys(models)) {
          switch (key) {
            case 'cityType':
              this.cities = Utils.getModelList(models[key]);
              break;
            case 'posMaintenanceRequestType':
              this.posRequestTypes = Utils.getModelList(models[key]);
              break;
          }
        }

        this.pages[0].forms[0].controls['cityControl'].controlOptions.options = this.cities;
        this.pages[0].forms[0].controls['requestTypeControl'].controlOptions.options = this.posRequestTypes;
      });
  }

  fillSummary(): SummaryModel {
    return {
      sections: [
        {
          title: {
            id: 'selectedTerminalSummary',
            title: 'pos.maintenance.selected-terminal',
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
              title: 'pos.maintenance.selected-terminal',
              subTitle: this.selectedTerminal
            },
          ]
        },
        {
          title: {
            id: 'pos-new-request-sumary',
            title: 'pos.maintenance.request-details',
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
              title: 'public.request-type',
              subTitle: this.getControl(0, 0, 'requestTypeControl').value.value,
            },
            {
              title: 'public.city',
              subTitle: this.getControl(0, 0, 'cityControl').value.value,
            },
            {
              title: 'public.contact-name',
              subTitle: this.getControl(0, 0, 'contactNameControl').value,
            },
            {
              title: 'public.phone-number',
              subTitle: this.getControl(0, 0, 'phoneNumberControl').value,
            }
          ],
        },
      ],
    };
  }

  moveToSummary() {
    this.summary = this.fillSummary();
    this.endButtons = [];
    this.stepperMoveNext();
    this.endButtons = [this.confirmButton];
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case this.buttonsIDs.next:
        this.moveToSummary();
        break;
      case this.buttonsIDs.edit:
        this.back();
        break;
      case this.buttonsIDs.back:
        this.back();
        break;
      case this.buttonsIDs.confirm:
        this.validateRequest();
        break;
      case this.buttonsIDs.backToNew:
        this.router.navigateByUrl(POS);
        break;
      case this.buttonsIDs.backToDash:
        this.router.navigateByUrl('/dashboard');
        break;
      default:
        this.getControl(0, 0, 'selectedTerminalTitle').controlOptions.chips = [];
        this.router.navigate(['pos/pos-ternminals']);
        break;
    }
  }

  validateRequest() {
    const request: PosMaintananceValidateReq = {
      mobile: this.getControl(0, 0, 'phoneNumberControl').value,
      contactName: this.getControl(0, 0, 'contactNameControl').value,
      branch: this.branch,
      city: this.getControl(0, 0, 'cityControl').value.key,
      type: this.getControl(0, 0, 'requestTypeControl').value.key,
      terminals: [this.selectedTerminal]
    };

    this.posService.validateMaintenanceRequest(request).subscribe({
      next: (res) => {
        this.handleValidateRequestResponse(res);
      },
      error: (err) => {
      },
      complete: () => {
      },
    });
  }

  handleValidateRequestResponse(res: PosMaintananceValidateRes) {
    this.posNewRequestValidateRes = res;

    this.posNewRequestConfirmReq = {
      batchList: res.batchList,
    };

    if (this.posNewRequestValidateRes.batchList.toProcess.length > 0) {
      this.handleProcessStatus();
    } else if (this.posNewRequestValidateRes.batchList.toAuthorize?.length) {
      this.handlePendingStatus();
    }
  }

  handlePendingStatus() {
    let secList: FutureSecurityLevelsDtolist[] = [];
    if (
      this.posNewRequestValidateRes?.batchList &&
      this.posNewRequestValidateRes?.batchList?.toAuthorize &&
      this.posNewRequestValidateRes?.batchList?.toAuthorize.length > 0 &&
      this.posNewRequestValidateRes?.batchList?.toAuthorize[0].futureSecurityLevelsDTOList &&
      this.posNewRequestValidateRes?.batchList?.toAuthorize[0].futureSecurityLevelsDTOList
        ?.length > 0
    ) {
      secList =
        this.posNewRequestValidateRes?.batchList?.toAuthorize[0].futureSecurityLevelsDTOList.map(
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
    const summarySection = Utils.getCurrentLevelAndNextLevelSummarySection(
      this.translate,
      secList
    );
    this.summary.sections?.push(summarySection);

    this.endButtons = [this.proceedButton];
  }

  handleProcessStatus() {
    if (
      this.posNewRequestValidateRes.generateChallengeAndOTP &&
      this.posNewRequestValidateRes.generateChallengeAndOTP.typeAuthentication
    ) {
      this.showOtp();
    } else {
      this.confirmRequest();
    }
  }

  showOtp() {
    this.otpService
      .showVerification(this.posNewRequestValidateRes.generateChallengeAndOTP)
      .subscribe((requestValidate: RequestValidate) => {
        this.posNewRequestConfirmReq.requestValidate = requestValidate;
        this.confirmRequest();
      });
  }

  confirmRequest() {
    this.posService.confirmMaintenceRequest(this.posNewRequestConfirmReq).subscribe({
      next: (res) => {
        this.moveToSuccess();
      },
      error: (err) => {
        let errorDescription = err!.ErrorResponse!.errorResponse!.description;
        let errorRef = err!.ErrorResponse!.errorResponse!.reference
        this.moveToError(errorDescription, errorRef);
      }
    });
  }

  moveToError(errorTitle: string, errorRef: string) {
    this.endButtons = [this.successBackToDash, this.successBackToNew];
    this.startButtons = [];
    this.fillErrorResult(errorTitle, errorRef)
    this.stepperMoveNext();

  }

  moveToSuccess() {
    this.endButtons = [this.successBackToDash, this.successBackToNew];
    this.startButtons = [];

    this.fillSuccess();
    this.stepperMoveNext();
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

  fillErrorResult(errorTitle: string, errorRef: string): ResultModal {
    this.summary = this.fillSummary();
    return (this.result = {
      type: 'Error',
      title: errorTitle ? errorTitle : "",
      subTitle: errorRef ? errorRef : "",
      summary: this.summary,
    });
  }

  override onResultChanged(formResult: FormResult[]) {
    if (this.endButtons.length > 0)
      this.endButtons[0].isDisable = !formResult[0].valid;
  }

  back() {
    if (this.pageTitle.stepper!.stepCounter > 1) {
      this.buildEndButtons();
      this.stepperMoveBack();
    } else {
      void this.router.navigateByUrl(`/${POS}/${POS_MAINTENANCE}`);
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
