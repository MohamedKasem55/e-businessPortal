import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormResult, PageModel } from 'app/@core/model/dto/formModel';
import {
  PendingActionPage,
  ValidatePendingActionsResponse,
} from 'app/@core/model/dto/pending-actions-model';
import { PopupInputModel } from 'app/@core/model/dto/popup.model';
import {
  GenerateChallengeAndOTP,
  RequestValidate,
} from 'app/@core/model/rest/common/otp.model';
import { ModelAndListService } from 'app/@core/service/base/modelAndList.service';
import { PendingActionFactory } from 'app/@core/service/base/pending-action-factory.service';
import { PopupService } from 'app/@core/service/base/popup.service';
import { VerificationService } from 'app/@core/service/base/verification.service';
import { Utils } from 'app/@core/utility/Utils';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { PaginationValueModel } from 'arb-design-library/model/pagination.model';
import { TableHeaderModel } from 'arb-design-library/model/table-header.model';
import { TitleModel } from 'arb-design-library/model/title.model';
import { Observable, Subscriber } from 'rxjs';
import { TableControl } from '../../@core/model/dto/control/table-control';
import { BatchList } from '../../@core/model/rest/common/batchResponse';
import { PendingActionsService } from '../../@core/service/pending-actions/pending-actions-service';
import { TransactionFollowBase } from '../../shared/transaction-follow-base/transaction-follow-base';
import { AramcoPaymentsPendingActionsPage } from './actions-pages/aramco-payments';
import { BalanceCertificatePendingActionsPage } from './actions-pages/balance-certificate';
import { BeneficiariesPendingActionsPage } from './actions-pages/beneficiaries';
import { BillPaymentsPendingActionsPage } from './actions-pages/bill-payments';
import { CardsPendingActionsPage } from './actions-pages/cards';
import { ChequeBookPendingActionsPage } from './actions-pages/chequeBook';
import { EsalPendingActionsPage } from './actions-pages/esal';
import { MoiPendingActionsPage } from './actions-pages/MOI';
import { PayrollPlusPendingActionsPage } from './actions-pages/payroll-plus';
import { PosPendingActionsPage } from './actions-pages/POS';
import { StandingOrdersPendingActionsPage } from './actions-pages/standing-orders';
import { TransfersPendingActionsPage } from './actions-pages/transfers';
import { WPSPayrollsPendingActionsPage } from './actions-pages/wps-payrolls';
import {
  addSteppertoInitialPageTitle,
  approveButton,
  dashboardButton,
  getInitialPageTitle,
  getTitle,
  getWarningPopUpForm,
  pendingActionsButton,
  pendingActionsForm,
  rejectButton,
  rejectForm,
  showWarningModal,
  workflowDetailsButton,
} from './pending-actions-controls';
import { StatusPipe } from 'app/@core/pipe/status-pipe';
import { AddBillService } from 'app/@core/service/payments/add-bill/add-bill.service';

@Component({
  selector: 'app-pending-actions',
  templateUrl: './pending-actions.component.html',
})
export class PendingActionsComponent
  extends TransactionFollowBase
  implements OnInit
{
  maximumAllowedTransactions: number = 0;
  pendingActionPage!: PendingActionPage;
  validateData!: any;
  rejectData!: any[];
  generateChallengeAndOTP?: GenerateChallengeAndOTP;
  selectedPendingAction!: any[];
  headers: TableHeaderModel[] = [];
  data: [] = [];
  selectedTab: number = 0;
  override pageTitle: TitleModel = getInitialPageTitle();
  defaultPaginationValue: PaginationValueModel = { page: 1, size: 20 };
  warning: PopupInputModel = getWarningPopUpForm();

  constructor(
    private pendingActionsService: PendingActionsService,
    private otpService: VerificationService,
    private route: ActivatedRoute,
    private popupService: PopupService,
    private pendingActionFactory: PendingActionFactory,
    private modelAndListService: ModelAndListService,
    private addBillService: AddBillService,
    private statusPipe: StatusPipe,
    private datePipe: DatePipe
  ) {
    super();
    this.getPendingActionsDetails();
  }

  getPendingActionsDetails() {
    if (this.pendingActionPage) {
      (
        this.getControl(0, 0, 'pendingActionsTable') as TableControl
      ).buttonClicked?.subscribe((res: any) => {});
    }
  }

  setTableEvents() {
    (
      this.getControl(0, 0, 'pendingActionsTable') as TableControl
    ).valueChanges.subscribe((value) => {
      this.selectedPendingAction = value['value'];
    });

    (
      this.getControl(0, 0, 'pendingActionsTable') as TableControl
    ).externalPagination.subscribe((value: PaginationValueModel) => {
      this.getPendingActions(value.page, value.size);
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.selectedTab = 0;
      const pendingAction = params.pendingAction;
      this.setPendingActions(pendingAction);
      this.setButtons();
      this.pages = [new PageModel(1, pendingActionsForm())];
      this.setPageDetails();
      this.setTableEvents();
    });
  }

  setButtons() {
    this.pageTitle.endButtons =
      this.pendingActionPage && this.pendingActionPage.workflowType!?.length > 0
        ? [workflowDetailsButton]
        : [];
    this.endButtons = [rejectButton, approveButton];
    this.startButtons = [];
  }

  setPendingActions(pendingAction: string) {
    if (this.pendingActionPage) {
      // const pendingSelected = this.getControl(0, 0, 'pendingActionsTable').value ? this.getControl(0, 0, 'pendingActionsTable').value.length : [];
      this.getControl(0, 0, 'pendingActionsTable').setValue([]);
      if (this.pageTitle.stepper?.stepCounter! > 1) {
        this.endButtons = [rejectButton, approveButton];
        this.endButtons[1].text = 'pending-actions.approve';
        this.pageTitle = getInitialPageTitle();
        void this.router.navigate(['/pendingActions/pending-actions-list']);
      }
    }
    const counters = this.pendingActionsService.getCounters();
    switch (pendingAction) {
      case 'bills':
        this.pendingActionPage = new BillPaymentsPendingActionsPage(
          this.pendingActionsService,
          this.datePipe,
          counters,
          this.addBillService
        );
        break;
      case 'esal':
        this.pendingActionPage = new EsalPendingActionsPage(
          this.pendingActionsService,
          this.datePipe
        );
        break;
      case 'transfer':
        this.pendingActionPage = new TransfersPendingActionsPage(
          this.pendingActionsService,
          this.datePipe,
          counters
        );
        break;
      case 'pos':
        this.pendingActionPage = new PosPendingActionsPage(
          this.pendingActionsService,
          this.datePipe,
          counters
        );
        break;
      case 'chequebook':
        this.pendingActionPage = new ChequeBookPendingActionsPage(
          this.pendingActionsService,
          this.datePipe,
          counters
        );
        break;
      case 'moi':
        this.pendingActionPage = new MoiPendingActionsPage(
          this.pendingActionsService,
          this.datePipe,
          counters
        );
        break;
      case 'balanceCertificate':
        this.pendingActionPage = new BalanceCertificatePendingActionsPage(
          this.pendingActionsService,
          this.datePipe
        );
        break;
      case 'standingOrders':
        this.pendingActionPage = new StandingOrdersPendingActionsPage(
          this.pendingActionsService,
          this.datePipe
        ,this.modelAndListService);
        break;
      case 'aramco':
        this.pendingActionPage = new AramcoPaymentsPendingActionsPage(
          this.pendingActionsService,
          this.datePipe
        );
        break;
      case 'beneficiary':
        this.pendingActionPage = new BeneficiariesPendingActionsPage(
          this.pendingActionsService,
          this.datePipe,
          counters
        );
        break;
      case 'positivePayCheck':
        this.pendingActionPage = new ChequeBookPendingActionsPage(
          this.pendingActionsService,
          this.datePipe,
          counters
        );
        break;
      case 'cards':
        this.pendingActionPage = new CardsPendingActionsPage(
          this.pendingActionsService,
          this.datePipe,
          counters,
          this.modelAndListService
        );
        break;
      case 'wpsPayroll':
        this.pendingActionPage = new WPSPayrollsPendingActionsPage(
          this.pendingActionsService,
          this.datePipe,
          counters,
          this.statusPipe
        );
        break;
      case 'payroll-plus':
        this.pendingActionPage = new PayrollPlusPendingActionsPage(
          this.pendingActionsService,
          this.datePipe,
          counters
        );
        break;
      default:
        void this.router.navigate(['/pendingActions/pending-actions-list']);
        break;
    }
  }

  getPendingActions(
    page: number = this.defaultPaginationValue.page,
    rows: number = this.defaultPaginationValue.size
  ) {
    this.getControl(0, 0, 'pendingActionsTable').controlOptions.data =
      undefined;
    this.pendingActionPage.pendingActions[this.selectedTab]
      .getPendingActions({ page, rows })
      .subscribe({
        next: (res) => {
          if (res && res.items) {
            res.items.forEach((item: any) => {
              if (!item.currency) {
                item.currency = '608';
              }
            });
          }
          const table = this.getControl(
            0,
            0,
            'pendingActionsTable'
          ) as TableControl;
          table.controlOptions.paginationValue = this.defaultPaginationValue;
          table.controlOptions.data = res && res.items ? res.items : [];
          table.controlOptions.total = res && res.total ? res.total : undefined;
          this.maximumAllowedTransactions =
            res && res.maximumAllowedTransactions
              ? res.maximumAllowedTransactions
              : 0;
        },
        error: () => {
          this.getControl(0, 0, 'pendingActionsTable').controlOptions.data = [];
        },
      });
  }

  setPageDetails() {
    this.pageTitle.title = this.pendingActionPage.title;
    if (this.pendingActionPage.subtitle) {
      this.getControl(0, 0, 'pendingActionsTitle').hidden = false;
      this.getControl(0, 0, 'pendingActionsTitle').controlOptions.title =
        this.pendingActionPage.subtitle;
    } else {
      this.getControl(0, 0, 'pendingActionsTitle').hidden = true;
    }
    // this.pageTitle.subTitle = 'pending-actions.pending-actions';
    this.setBreadcrumb([
      {
        text: 'pending-actions.pending-actions',
        url: '/pendingActions/pending-actions-list',
      },
      {
        text: this.pendingActionPage.title,
        url: '',
      },
    ]);

    if (this.pendingActionPage.tabs) {
      this.getControl(0, 0, 'tabsControl').hidden = false;
      this.getControl(0, 0, 'tabsControl').controlOptions.tabs =
        this.pendingActionPage.tabs;
    } else {
      this.getControl(0, 0, 'tabsControl').hidden = true;
    }
    this.getControl(0, 0, 'tabsControl').setValue(this.selectedTab);
    if (this.pendingActionPage.pendingActions.length > 0) {
      this.setTableData();
      this.setExportOptions();
      this.getPendingActions();
    } else {
      void this.router.navigate(['/pendingActions/pending-actions-list']);
    }
  }

  setExportOptions() {
    let title =
      this.pendingActionPage.tabs?.length! > 0
        ? this.pendingActionPage.tabs![this.selectedTab].text
        : this.pendingActionPage.title;
    this.getControl(0, 0, 'pendingActionsTable').controlOptions.exportOptions =
      { title, fileName: title };
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    // this.onHover(securityLevelsDTOList,this.popupService);
    switch (formButtonClickOutput.buttonId) {
      case 'arrowTitle':
      case 'Back':
        this.setBreadcrumb([
          {
            text: 'pending-actions.pending-actions',
            url: '/pendingActions/pending-actions-list',
          },
        ]);
        this.backClick();
        break;
      case 'Approve':
      case 'Confirm':
      case 'Next':
        // this.pageTitle.stepper = addSteppertoInitialPageTitle();
        if (!this.pageTitle.stepper) {
          this.pageTitle.stepper = addSteppertoInitialPageTitle();
        }
        this.pageTitle.endButtons = [];
        this.nextClick();
        break;
      case 'Reject':
        if (!this.pageTitle.stepper) {
          this.pageTitle.stepper = addSteppertoInitialPageTitle();
        }
        this.pageTitle.endButtons = [];
        this.endButtons = [this.backButton, this.nextButton];
        this.reject();
        break;
      case 'Dashboard':
        void this.router.navigate(['/dashboard']);
        break;
      case 'PendingActions':
        void this.router.navigate(['/pendingActions/pending-actions-list']);
        break;
      case 'WorkflowDetails':
        this.setBreadcrumb([
          {
            text: 'pending-actions.pending-actions',
            url: '/pendingActions/pending-actions-list',
          },
          {
            text: this.pendingActionPage.title,
            url: '',
          },
        ]);
        this.router
          .navigateByUrl('/pendingActions/workflow-details', {
            state: {
              tabSelected: this.selectedTab,
              url: this.router.url,
            },
          })
          .then(() => {});
        this.pendingActionsService.setPendingAction(this.pendingActionPage);
        break;
      default:
        this.tabChanged(formButtonClickOutput.buttonId);
    }
  }

  tabChanged(index: string) {
    this.selectedPendingAction = [];
    this.endButtons.forEach((button: ButtonModel) => {
      button.isDisable = true;
    });
    this.getControl(0, 0, 'pendingActionsTable').setValue([]);
    if (parseInt(index) || index == '0') {
      this.selectedTab = parseInt(index);
      this.setTableData();
      this.getControl(
        0,
        0,
        'pendingActionsTable'
      ).controlOptions.paginationValue = {
        page: this.defaultPaginationValue.page,
        size: this.defaultPaginationValue.size,
      };
      this.setExportOptions();
      this.getPendingActions();
    }
  }

  getMapObjects(): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      if (
        this.pendingActionPage.pendingActions[this.selectedTab]
          .serviceMapObjects.length > 0
      ) {
        this.modelAndListService
          .getList(
            this.pendingActionPage.pendingActions[this.selectedTab]
              .serviceMapObjects
          )
          .subscribe((res) => {
            if (res.errors) {
              res.errors = Utils.getErrorsWithoutErrorTable(res.errors);
            }
            observer.next(res);
          });
      } else {
        observer.next({});
      }
    });
  }

  setTableData() {
    this.getMapObjects().subscribe((res) => {
      let headers =
        this.pendingActionPage.pendingActions[this.selectedTab].table;
      headers.forEach((item: TableHeaderModel) => {
        if (item.mapObject) {
          if (res[item.mapObject]) {
            item.mapObject = res[item.mapObject];
          } else {
            if (
              this.pendingActionPage.pendingActions[this.selectedTab]
                .staticMapObjects[item.mapObject]
            ) {
              item.mapObject =
                this.pendingActionPage.pendingActions[
                  this.selectedTab
                ].staticMapObjects[item.mapObject];
            }
          }
        }
      });
      this.getControl(0, 0, 'pendingActionsTable').controlOptions.headers =
        this.pendingActionPage.pendingActions[this.selectedTab].table;
    });
  }

  nextClick() {
    const pendingSelected = this.getControl(0, 0, 'pendingActionsTable').value
      .length;
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.maximumAllowedTransactions > 0 &&
        this.maximumAllowedTransactions < pendingSelected
          ? showWarningModal(this.warning, this.popupService)
          : this.approve();
        break;
      case 2:
        if (this.rejectData && Object.keys(this.rejectData).length !== 0) {
          this.doReject();
        } else {
          this.confirm();
        }
        break;
    }
  }

  approve() {
    this.pageTitle.title = getTitle(
      this.pendingActionPage,
      this.translate,
      this.selectedTab,
      true
    );
    let values = this.getControl(0, 0, 'pendingActionsTable').value;
    this.pendingActionPage.pendingActions[this.selectedTab]
      .validatePendingActions(values)
      .subscribe((res: ValidatePendingActionsResponse) => {
        this.validateData = res['batchList'];
        this.generateChallengeAndOTP = res.generateChallengeAndOTP;
        let title =
          this.pendingActionPage.tabs && this.pendingActionPage.tabs?.length > 0
            ? this.pendingActionPage.tabs[this.selectedTab].text
            : this.pendingActionPage.title;
        this.summary = this.pendingActionPage.pendingActions[
          this.selectedTab
        ].getSummary(
          title,
          true,
          res['batchList'],
          this.pendingActionPage.pendingActions[this.selectedTab].table
        );

        if (this.pages.length > 1) {
          this.pages.splice(1, 1);
        }
        this.stepperMoveNext();
        this.endButtons[1].isDisable = false;
        // this.endButtons[1].text = 'public.confirm-approval';
        this.endButtons[1].text = 'public.confirm';
        this.endButtons[0] = this.backButton;
      });
  }

  confirm() {
    if (
      this.generateChallengeAndOTP &&
      this.generateChallengeAndOTP.typeAuthentication
    ) {
      this.otpService
        .showVerification(this.generateChallengeAndOTP)
        .subscribe((res) => {
          if (this.generateChallengeAndOTP?.typeAuthentication == 'IVR') {
            this.doIVRCheck();
          } else {
            this.doConfirm(res);
          }
        });
    } else {
      this.doConfirm();
    }
  }

  doIVRCheck() {
    this.pendingActionsService
      .getIVRRequestStatus(this.generateChallengeAndOTP?.callBackRequestId!)
      .subscribe({
        next: (res) => {
          this.summary.title = this.pendingActionPage.pendingActions[
            this.selectedTab
          ].getResultSummaryTitle(
            this.summary.title?.title ? this.summary.title.title : '',
            this.summary.title?.subTitle
          );
          if (res.completed) {
            this.result = {
              type: 'Success',
              title: 'company-admin.user-info.delete-success-title',
              showSariaLogo:
                this.pendingActionPage.pendingActions[this.selectedTab]
                  .showSariaLogo,
              subTitle:
                this.pendingActionPage.pendingActions[this.selectedTab]
                  .successApproveMessage,
              summary: this.summary,
            };
          } else {
            this.summary.title = this.pendingActionPage.pendingActions[
              this.selectedTab
            ].getResultSummaryTitle(
              this.summary.title?.title ? this.summary.title.title : '',
              ''
            );
            this.summary.sections?.forEach((section) => {
              section.title!.title! = 'pending-actions.ivr-failed';
            });
            this.result = {
              type: 'Error',
              title: 'pending-actions.ivr-failed',
              showSariaLogo:
                this.pendingActionPage.pendingActions[this.selectedTab]
                  .showSariaLogo,
              subTitle: '',
              summary: this.summary,
            };
          }
          this.endButtons = [dashboardButton, pendingActionsButton];
          this.stepperMoveNext();
          this.pendingActionFactory.fetchPendingActions();
        },
        error: () => {
          this.summary.title = this.pendingActionPage.pendingActions[
            this.selectedTab
          ].getResultSummaryTitle(
            this.summary.title?.title ? this.summary.title.title : '',
            this.summary.title?.subTitle
          );
          this.result = {
            type: 'Error',
            title: 'public.error',
            subTitle: '',
            summary: this.summary,
          };
          this.endButtons = [dashboardButton, pendingActionsButton];
          this.stepperMoveNext();
        },
      });
  }

  reject() {
    this.pageTitle.title = getTitle(
      this.pendingActionPage,
      this.translate,
      this.selectedTab,
      false
    );
    // this.getControl(0, 0, "pendingActionsTitle").setValue("pending-actions.summary");
    let items = this.getControl(0, 0, 'pendingActionsTable').value;
    // let reason = this.getControl(1, 0, "rejectionReason").value ? this.getControl(1, 0, "rejectionReason").value : '';
    this.pendingActionPage.pendingActions[this.selectedTab]
      .rejectValidatePendingActions(items)
      .subscribe((data: any) => {
        let batch: BatchList = {
          toProcess: [],
          toAuthorize: [],
          notAllowed: [],
          toReject: [],
        };

        if (
          (data && data['toProcess']?.length > 0) ||
          (data && data['toAuthorize']?.length > 0) ||
          (data && data['notAllowed']?.length > 0)
        ) {
          if (data && data['toProcess'].length > 0) {
            data['toProcess'].forEach((item: any) => {
              batch['toReject'].push(item);
            });
          }
          if (data && data['toAuthorize'].length > 0) {
            data['toAuthorize'].forEach((item: any) => {
              batch['toReject'].push(item);
            });
          }
          if (data && data['notAllowed'].length > 0) {
            data['notAllowed'].forEach((item: any) => {
              batch['toReject'].push(item);
            });
          }
          this.rejectData = batch['toReject'];
        } else {
          this.rejectData = data;
        }
        batch['toReject'] = this.rejectData;

        if (this.pages.length == 1) {
          this.pages.push(new PageModel(2, rejectForm()));
        }
        let title =
          this.pendingActionPage.tabs && this.pendingActionPage.tabs.length > 0
            ? this.pendingActionPage.tabs[this.selectedTab].text
            : this.pendingActionPage.title;
        this.summary = this.pendingActionPage.pendingActions[
          this.selectedTab
        ].getSummary(
          title,
          false,
          batch,
          this.pendingActionPage.pendingActions[this.selectedTab].table
        );

        this.stepperMoveNext();
      });
    this.endButtons[1].text = 'public.confirm-rejection';
    this.endButtons[1].type = 'danger';
  }

  doReject() {
    this.pendingActionPage.pendingActions[this.selectedTab]
      .rejectPendingActions(
        this.rejectData,
        this.getControl(1, 0, 'rejectionReason').value
      )
      .subscribe({
        next: (res) => {
          this.summary.title = this.pendingActionPage.pendingActions[
            this.selectedTab
          ].getResultSummaryTitle(
            this.summary.title?.title ? this.summary.title.title : '',
            this.summary.title?.subTitle
          );
          this.result = {
            type: 'Success',
            title: 'company-admin.user-info.delete-success-title',
            subTitle:
              this.pendingActionPage.pendingActions[this.selectedTab]
                .successRejectMessage,
            summary: this.summary,
          };
          this.endButtons = [dashboardButton, pendingActionsButton];
          this.stepperMoveNext();
          this.pendingActionFactory.fetchPendingActions();
        },
        error: () => {},
      });
  }

  doConfirm(requestValidate?: RequestValidate) {
    this.pendingActionPage.pendingActions[this.selectedTab]
      .confirmPendingActions(this.validateData, requestValidate)
      .subscribe({
        next: (res) => {
          this.summary.title = this.pendingActionPage.pendingActions[
            this.selectedTab
          ].getResultSummaryTitle(
            this.summary.title?.title ? this.summary.title.title : '',
            this.summary.title?.subTitle
          );
          if (!res.warningResult) {
            this.result = {
              type: 'Success',
              title: 'company-admin.user-info.delete-success-title',
              showSariaLogo:
                this.pendingActionPage.pendingActions[this.selectedTab]
                  .showSariaLogo,
              subTitle:
                this.pendingActionPage.pendingActions[this.selectedTab]
                  .successApproveMessage,
              summary: this.summary,
            };
            this.endButtons[1].text = 'pending-actions.approve';
          } else {
            this.summary = this.pendingActionPage.pendingActions[
              this.selectedTab
            ].getWarningResult(
              '',
              this.pendingActionPage.pendingActions[this.selectedTab].table,
              res.warningResult,
              this.pendingActionPage.pendingActions[this.selectedTab]
                .TableHeaderModelWarning!
            );
            this.result = {
              type: 'Warning',
              title: 'public.warning',
              showSariaLogo:
                this.pendingActionPage.pendingActions[this.selectedTab]
                  .showSariaLogo,
              subTitle: this.translate.instant(
                'pending-actions.success-warning'
              ),
              summary: this.summary,
            };
          }
          this.endButtons = [dashboardButton, pendingActionsButton];
          this.stepperMoveNext();
          this.pendingActionFactory.fetchPendingActions();
        },
        error: () => {
          this.summary.title = this.pendingActionPage.pendingActions[
            this.selectedTab
          ].getResultSummaryTitle(
            this.summary.title?.title ? this.summary.title.title : '',
            this.summary.title?.subTitle
          );
          this.result = {
            type: 'Error',
            title: 'public.error',
            subTitle: '',
            summary: this.summary,
          };
          this.endButtons = [dashboardButton, pendingActionsButton];
          this.stepperMoveNext();
        },
      });
  }

  backClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        void this.router.navigate(['/pendingActions/pending-actions-list']);
        break;
      case 2:
        this.pageTitle.title = this.pendingActionPage.title;
        this.rejectData = [];
        this.endButtons = [rejectButton, approveButton];
        this.stepperMoveBack();
        this.getControl(0, 0, 'tabsControl').setValue(this.selectedTab);
        this.endButtons[1].text = 'pending-actions.approve';
        this.pageTitle.endButtons = [workflowDetailsButton];
        break;
      default:
        void this.router.navigate(['/pendingActions/pending-actions-list']);
        break;
    }
  }

  override onResultChanged(data: FormResult[]): void {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
      default:
        this.endButtons.forEach((button: ButtonModel) => {
          button.isDisable = !data[0].valid;
        });
        if (this.IsSingleSelection()) {
          this.endButtons.forEach((button: ButtonModel) => {
            button.isDisable = this.IsSingleSelection();
          });
        }
        break;
      case 2:
        this.endButtons[1].isDisable = !data[0].valid;
        break;
    }
  }
  IsSingleSelection(): boolean {
    return this.pendingActionPage.pendingActions[this.selectedTab].singleSelection &&
      this.selectedPendingAction &&
      this.selectedPendingAction.length > 1
      ? true
      : false;
  }
}
