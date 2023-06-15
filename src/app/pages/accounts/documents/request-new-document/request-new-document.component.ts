import { Component } from '@angular/core';
import { ServiceLocator } from '../../../../@core/service/base/service-locator.service';
import { BreadcrumbService } from '../../../../@core/service/base/breadcrumb.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { FormResult, PageModel } from '../../../../@core/model/dto/formModel';
import { AlertModel } from '../../../../@core/model/dto/alert.model';
import { TitleModel } from 'arb-design-library/model/title.model';
import {
  getAccountCertificateControls,
  getAlertModel,
  getBalanceCertificateControls,
  getBankCertificateControls,
  getEndButton,
  getIBANControls,
  getPageModel,
  getRequestedStatementControls,
  getRequestNewDocTitle,
  getStartButton,
  getSummaryEndButton,
  getSummery,
  getSWIFTStatementControls,
} from './request-new-document.controls';
import { AccountsService } from '../../../../@core/service/accounts/accounts.service';
import { CreateCustDocRequest } from '../../../../@core/model/rest/accounts/create-cust-doc-request';
import { ResultModal } from '../../../../@core/model/dto/result.modal';
import { Router } from '@angular/router';
import { SarAccountsRes } from '../../../../@core/model/rest/accounts/sar-accounts-res';
import { MonthlyStatementReq } from '../../../../@core/model/rest/accounts/monthly-statement-req';
import { AccountsReq } from '../../../../@core/model/rest/accounts/accounts-req';
import { ModelAndListService } from '../../../../@core/service/base/modelAndList.service';
import { KeyValueModel } from '../../../../@core/model/rest/common/key-value.model';
import { BalanceCertificateValidateReq } from '../../../../@core/model/rest/accounts/balance-certificate-validate-req';
import { BalanceCertificateValidateRes } from '../../../../@core/model/rest/accounts/balance-certificate-validate-res';
import { Utils } from '../../../../@core/utility/Utils';
import { VerificationService } from '../../../../@core/service/base/verification.service';
import { BalanceCertificateConfirmReq } from '../../../../@core/model/rest/accounts/balance-certificate-confirm-req';
import { FormButtonClickOutput } from '../../../../shared/form/form.component';
import { SummaryModel } from 'arb-design-library/model/summary.model';
import { DatePipe } from '@angular/common';
import { Account } from '../../../../@core/model/rest/common/account';
import { SwiftDownloadReq } from '../../../../@core/model/rest/accounts/swift-download-req';
import { RequestNewStatementReq } from '../../../../@core/model/rest/accounts/request-new-statement-req';
import { AccountsCommonService } from '../../../../@core/service/accounts/accounts-common.service';
import { AuthenticationUtils } from '../../../../@core/utility/authentication-utils';

@Component({
  selector: 'app-request-new-document',
  templateUrl: './request-new-document.component.html',
})
export class RequestNewDocumentComponent {
  endButtonList: ButtonModel[] = [];
  startButtonList: ButtonModel[] = [];
  pages: PageModel[] = [];
  alert: AlertModel | null = null;
  pageTitle!: TitleModel;
  selectedDocType: any;
  loadView: boolean = true;
  summary!: SummaryModel;
  result!: ResultModal;
  sarAccountsRes!: SarAccountsRes;
  balanceCertificateValidateRes!: BalanceCertificateValidateRes;
  monthsSwiftList: any[] = [];
  dailySwiftList: any[] = [];
  selectedDailyFreq = '';
  selectedMonthlyFreq = '';
  selectedSwiftAccount!: Account;
  newStatementReq: RequestNewStatementReq = new RequestNewStatementReq();
  groups: any | null;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private modelAndListService: ModelAndListService,
    private verificationService: VerificationService,
    private datePipe: DatePipe,
    private accountsService: AccountsService,
    private accountsCommonService: AccountsCommonService
  ) {
    this.drawLandingPage();
    this.setBreadcrumb();
  }

  setBreadcrumb() {
    ServiceLocator.injector.get(BreadcrumbService).setBreadcrumb([
      {
        text: 'accounts.acc',
        url: '/accounts',
      },
      {
        text: 'accounts.documents.name',
        url: '/accounts/documents',
      },
      {
        text: 'accounts.documents.requestNewDoc',
        url: 'accounts/documents/request-new',
      },
    ]);
  }

  onButtonClick(formButtonClickOutPut: FormButtonClickOutput) {
    if (formButtonClickOutPut.buttonId === 'back') {
      if (this.pageTitle.stepper!.stepCounter === 1) {
        this.router.navigate(['/accounts/documents/']);
      }
      if (this.pageTitle.stepper!.stepCounter === 2) {
        this.endButtonList[0].text = 'public.next';
      }
      this.pageTitle.stepper!.stepCounter--;
    } else if (formButtonClickOutPut.buttonId === 'next') {
      if (this.pageTitle.stepper?.stepCounter === 1) {
        this.endButtonList[0].text = 'public.confirm';
        switch (this.selectedDocType.key) {
          case '101':
            this.validateBalanceCertificate();
            break;
          default:
            this.setSummary();
            break;
        }
      } else if (this.pageTitle.stepper?.stepCounter === 2) {
        switch (this.selectedDocType.key) {
          case '101':
            if (
              this.balanceCertificateValidateRes.batch.nextStatus === '100' &&
              this.balanceCertificateValidateRes.generateChallengeAndOTP
            ) {
              this.verificationService
                .showVerification(
                  this.balanceCertificateValidateRes.generateChallengeAndOTP
                )
                .subscribe((requestValidate) => {
                  const balanceCertificateConfirmReq: BalanceCertificateConfirmReq =
                    {
                      batch: this.balanceCertificateValidateRes.batch,
                      requestValidate: requestValidate,
                    };
                  this.accountsService
                    .confirmBalanceCertificate(balanceCertificateConfirmReq)
                    .subscribe(() => {
                      this.startButtonList = [];
                      this.result = {
                        type: 'Success',
                        title:
                          'accounts.documents.balance-certificate.success-title',
                        subTitle:
                          'accounts.documents.balance-certificate.success-desc',
                        summary: this.summary,
                      };
                      this.endButtonList = getSummaryEndButton();
                      this.pageTitle.stepper!.stepCounter++;
                    });
                });
            } else {
              const balanceCertificateConfirmReq: BalanceCertificateConfirmReq =
                {
                  batch: this.balanceCertificateValidateRes.batch,
                  requestValidate: {},
                };
              this.accountsService
                .confirmBalanceCertificate(balanceCertificateConfirmReq)
                .subscribe(() => {
                  this.startButtonList = [];
                  this.result = {
                    type: 'Success',
                    title:
                      'accounts.documents.balance-certificate.success-title',
                    subTitle:
                      'accounts.documents.balance-certificate.success-desc',
                    summary: this.summary,
                  };
                  this.endButtonList = getSummaryEndButton();
                  this.pageTitle.stepper!.stepCounter++;
                });
            }
            break;
          case '103':
            this.accountsService
              .requestNewStatement(this.newStatementReq)
              .subscribe(
                (res) => {
                  this.result = {
                    type: 'Success',
                    title: 'accounts.documents.request-statement.req-accepted',
                    subTitle:
                      this.translate.instant(
                        'accounts.documents.request-statement.statement-req'
                      ) +
                      ' : ' +
                      res.fileName,
                    summary: this.summary,
                  };
                  this.startButtonList = [];
                  this.endButtonList = [];
                  this.endButtonList = getSummaryEndButton();
                  this.pageTitle.stepper!.stepCounter++;
                },
                () => {
                  this.startButtonList = [];
                  this.result = {
                    type: 'Error',
                    title: 'accounts.documents.request-statement.req-failed',
                    summary: this.summary,
                  };
                }
              );
            break;
          default:
            this.confirmRequest();
            break;
        }
      }
    } else if (formButtonClickOutPut.buttonId === 'to-dashboard') {
      this.router.navigate(['/dashboard']);
    } else if (formButtonClickOutPut.buttonId === 'to-docs') {
      this.router.navigate(['/accounts/documents/']);
    } else if (formButtonClickOutPut.buttonId === 'downloadDaily') {
      let swiftDownloadReq: SwiftDownloadReq = {
        accountNumber: this.selectedSwiftAccount.fullAccountNumber,
        allAccounts: false,
        finalDate: this.selectedDailyFreq,
        frequency: 'daily',
      };
      this.accountsService
        .getSwiftStatement(swiftDownloadReq)
        .subscribe((res) => {
          this.document(res);
        });
    } else if (formButtonClickOutPut.buttonId === 'downloadMonthly') {
      let swiftDownloadReq: SwiftDownloadReq = {
        accountNumber: this.selectedSwiftAccount.fullAccountNumber,
        allAccounts: false,
        finalDate: this.selectedMonthlyFreq,
        frequency: 'Monthly',
      };
      this.accountsService
        .getSwiftStatement(swiftDownloadReq)
        .subscribe((res) => {
          this.document(res);
        });
    }
  }

  onResultChange(formResult: FormResult[]) {
    if (this.endButtonList.length > 0 && formResult.length > 1)
      this.endButtonList[0].isDisable =
        !formResult[1].valid || !formResult[0].valid;
  }

  /**
   *  01 Bank Certificate
   *  02 Account Statement
   *  05 IBAN Certificate
   *  dummy
   *  100 Monthly Statementha
   *  101 Balance Certificate
   * */
  private drawLandingPage() {
    this.pageTitle = getRequestNewDocTitle();

    this.pages.push(getPageModel());

    this.groups = sessionStorage.getItem('groups');

    if (!this.groups) {
      void this.router.navigate(['/login']);
    } else {
      this.groups = JSON.parse(this.groups);
    }
    let option =
      this.pages[0].forms[0].controls['docType'].controlOptions.options;
    if (!AuthenticationUtils.isCompanyAdmin) {
      let index = option.findIndex((tab: any) => tab.name.key === '01');
      option.splice(index, 1);
      index = option.findIndex((tab: any) => tab.name.key === '02');
      option.splice(index, 1);
      index = option.findIndex((tab: any) => tab.name.key === '05');
      option.splice(index, 1);
    }
    if (!AuthenticationUtils.hasAccess('BalanceCertificateMenu')) {
      let index = option.findIndex((tab: any) => tab.name.key === '101');
      option.splice(index, 1);
    }
    if (!AuthenticationUtils.hasAccess('SwiftMt940Statement')) {
      let index = option.findIndex((tab: any) => tab.name.key === '102');
      option.splice(index, 1);
    }
    if (!AuthenticationUtils.hasAccess('AccountsMenu')) {
      let index = option.findIndex((tab: any) => tab.name.key === '103');
      option.splice(index, 1);
    }

    this.pages[0].forms[0].controls['docType'].controlOptions.options = option;

    this.pages[0].forms[0].controls['docType'].valueChanges.subscribe((val) => {
      this.pageTitle.stepper!.steps = ['', '', ''];
      this.selectedDocType = val.value;
      this.alert = null;
      this.pages[0].forms[0].controls['accounts'].hidden = true;
      this.pages[0].forms[0].controls['docDetails'].hidden = true;
      this.pages[0].deleteFrom(1, 1);
      this.startButtonList = [];
      this.endButtonList = [];
      this.startButtonList.push(getStartButton());
      this.endButtonList.push(getEndButton());
      if (!val.value.key.includes('10')) {
        this.accountsService.getDocEligibility(val.value.key).subscribe({
          next: (res) => {
            if (!res.custDocEligible) {
              this.alert = getAlertModel();
            } else {
              this.getSarAccounts();
              this.pages[0].forms[0].controls['docDetails'].hidden = false;
              switch (val.value.key) {
                case '01':
                  this.pages[0].addForm(getBankCertificateControls());
                  break;
                case '02':
                  let maxDate = Utils.getToday();
                  maxDate.month += 1;
                  this.pages[0].addForm(getAccountCertificateControls(maxDate));
                  break;
                case '05':
                  this.pages[0].addForm(getIBANControls());
                  break;
              }
            }
          },
          error: () => {},
        });
      } else {
        switch (val.value.key) {
          case '101':
            this.getEligibleAccounts();
            this.pages[0].addForm(getBalanceCertificateControls());
            this.getCities();
            break;
          case '102':
            this.startButtonList = [];
            this.endButtonList = [];
            this.initSwiftStatement();
            break;
          case '103':
            this.getEligibleAccounts();
            this.pages[0].addForm(getRequestedStatementControls());
            this.modelAndListService.getModel('filterType').subscribe((res) => {
              const filterTypeList: any[] = Utils.getOrderFilterType(res.filterType);
              this.pages[0].forms[1].controls['filter'].controlOptions.options =
                filterTypeList;
            });
            break;
        }
      }
    });
  }

  private initSwiftStatement() {
    this.pageTitle.stepper!.steps = [''];
    this.monthsSwiftList = [];
    this.accountsService.inItSwiftStatement().subscribe((res) => {
      this.pages[0].forms[0].controls['accounts'].hidden = false;
      this.pages[0].forms[0].controls['accounts'].controlOptions.options =
        res.listAccount;
      for (let month of res.months) {
        this.monthsSwiftList.push({
          key: month,
          value: this.datePipe.transform(month, 'MMMM yyyy'),
        });
      }
      for (let day of res.days) {
        this.dailySwiftList.push({
          key: day,
          value: this.datePipe.transform(day, 'd MMMM yyyy'),
        });
      }
      this.pages[0].addForm(getSWIFTStatementControls());
      this.pages[0].forms[1].controls['daily'].controlOptions.options =
        this.dailySwiftList;
      this.pages[0].forms[1].controls['monthly'].controlOptions.options =
        this.monthsSwiftList;
    });
    this.pages[0].forms[0].controls['accounts'].valueChanges.subscribe(
      (selectedAccount) => {
        this.selectedSwiftAccount = selectedAccount.value;
        this.pages[0].forms[1].controls['daily'].enable();
        this.pages[0].forms[1].controls['monthly'].enable();
        this.pages[0].forms[1].controls['daily'].valueChanges.subscribe(
          (dailyFreq) => {
            this.pages[0].forms[1].controls[
              'downloadDaily'
            ].controlOptions.isDisable = false;
            this.selectedDailyFreq = dailyFreq.value.key.replace(/-/g, '');
          }
        );
        this.pages[0].forms[1].controls['monthly'].valueChanges.subscribe(
          (monthlyFreq) => {
            this.pages[0].forms[1].controls[
              'downloadMonthly'
            ].controlOptions.isDisable = false;
            this.selectedMonthlyFreq = monthlyFreq.value.key.replace(/-/g, '');
          }
        );
      }
    );
  }

  /**
   * frequency
   * Date
   * Download Button
   *
   * */
  private getMonthlyStatementDataSet(fullAccountNumber: string) {
    let params: MonthlyStatementReq = {
      parameter: fullAccountNumber,
    };
    this.accountsService.getMonthlyStatement(params).subscribe({
      next: (res) => {
        this.endButtonList[0].isDisable = true;
        for (let item of res.listStatement) {
          item['date'] = item.year + '-' + item.month + '-' + '1';
        }
        this.pages[0].forms[1].controls['table'].controlOptions.data =
          res.listStatement;
        this.pages[0].forms[1].controls['table'].valueChanges.subscribe(
          (selected: any[]) => {
            this.endButtonList[0].isDisable = selected.length === 0;
          }
        );
      },
    });
  }

  private setSummary() {
    this.summary = getSummery();
    this.summary!.sections![0].items = [];
    switch (this.selectedDocType.key) {
      case '01':
        this.summary!.sections![0].items!.push(
          {
            title: 'accounts.documents.docType.docType',
            subTitle: this.selectedDocType.value,
          },
          {
            title: 'public.account',
            subTitle:
              this.pages[0].forms[0].controls['accounts'].value.alias +
              ' - ' +
              this.pages[0].forms[0].controls['accounts'].value
                .fullAccountNumber,
          },
          {
            title: this.pages[0].forms[1].controls['lang'].label,
            subTitle: this.pages[0].forms[1].controls['lang'].value.value,
          },
          {
            title: this.pages[0].forms[1].controls['date'].label,
            subTitle:
              this.pages[0].forms[1].controls['date'].value.day +
              '/' +
              this.pages[0].forms[1].controls['date'].value.month +
              '/' +
              this.pages[0].forms[1].controls['date'].value.year,
          }
        );
        this.pageTitle.stepper!.stepCounter++;
        break;
      case '02':
        this.summary!.sections![0].items!.push(
          {
            title: 'accounts.documents.docType.docType',
            subTitle: this.selectedDocType.value,
          },
          {
            title: 'public.account',
            subTitle:
              this.pages[0].forms[0].controls['accounts'].value.alias +
              ' - ' +
              this.pages[0].forms[0].controls['accounts'].value
                .fullAccountNumber,
          },
          {
            title: this.pages[0].forms[1].controls['lang'].label,
            subTitle: this.pages[0].forms[1].controls['lang'].value.value,
          },
          {
            title: this.pages[0].forms[1].controls['startDate'].label,
            subTitle:
              this.pages[0].forms[1].controls['startDate'].value.day +
              '/' +
              this.pages[0].forms[1].controls['startDate'].value.month +
              '/' +
              this.pages[0].forms[1].controls['startDate'].value.year,
          },
          {
            title: this.pages[0].forms[1].controls['endDate'].label,
            subTitle:
              this.pages[0].forms[1].controls['endDate'].value.day +
              '/' +
              this.pages[0].forms[1].controls['endDate'].value.month +
              '/' +
              this.pages[0].forms[1].controls['endDate'].value.year,
          }
        );
        this.pageTitle.stepper!.stepCounter++;
        break;
      case '05':
        this.summary!.sections![0].items!.push(
          {
            title: 'accounts.documents.docType.docType',
            subTitle: this.selectedDocType.value,
          },
          {
            title: 'public.account',
            subTitle:
              this.pages[0].forms[0].controls['accounts'].value.alias +
              ' - ' +
              this.pages[0].forms[0].controls['accounts'].value
                .fullAccountNumber,
          },
          {
            title: this.pages[0].forms[1].controls['lang'].label,
            subTitle: this.pages[0].forms[1].controls['lang'].value.value,
          }
        );
        this.pageTitle.stepper!.stepCounter++;
        break;
      case '101':
        this.summary!.sections![0].items!.push(
          {
            title: 'accounts.documents.docType.docType',
            subTitle: this.selectedDocType.value,
          },
          {
            title: 'public.account',
            subTitle:
              this.pages[0].forms[0].controls['accounts'].value.alias +
              ' - ' +
              this.pages[0].forms[0].controls['accounts'].value
                .fullAccountNumber,
          },
          {
            title: this.pages[0].forms[1].controls['city'].label,
            subTitle: this.pages[0].forms[1].controls['city'].value.value,
          },
          {
            title: this.pages[0].forms[1].controls['company'].label,
            subTitle: this.pages[0].forms[1].controls['company'].value,
          },
          {
            title: this.pages[0].forms[1].controls['postalCode'].label,
            subTitle: this.pages[0].forms[1].controls['postalCode'].value,
          }
        );
        this.summary.sections?.push(
          Utils.getCurrentLevelAndNextLevelSummarySection(
            this.translate,
            this.balanceCertificateValidateRes.batch
              .futureSecurityLevelsDTOList!
          )
        );
        this.pageTitle.stepper!.stepCounter++;
        break;
      case '103':
        this.handleRequestedStatementSummary();
        break;
    }
  }

  private confirmRequest() {
    let creatDocReq: CreateCustDocRequest = {
      acctNum:
        this.pages[0].forms[0].controls['accounts'].value.fullAccountNumber,
      docType: this.selectedDocType.key,
      language: this.pages[0].forms[1].controls['lang'].value.key,
    };
    switch (this.selectedDocType.key) {
      case '01':
        creatDocReq = {
          ...creatDocReq,
          amt: {
            amount: 0,
            currency: '608',
          },
          balanceDate:
            this.pages[0].forms[1].controls['date'].value.year +
            '-' +
            this.pages[0].forms[1].controls['date'].value.month +
            '-' +
            this.pages[0].forms[1].controls['date'].value.day,
          reportedBalance: true,
          nameOfCertificate: 'BankOfCertificate',
        };
        break;

      case '02':
        creatDocReq = {
          ...creatDocReq,
          fromDate:
            this.pages[0].forms[1].controls['startDate'].value.year +
            '-' +
            this.pages[0].forms[1].controls['startDate'].value.month +
            '-' +
            this.pages[0].forms[1].controls['startDate'].value.day,
          toDate:
            this.pages[0].forms[1].controls['endDate'].value.year +
            '-' +
            this.pages[0].forms[1].controls['endDate'].value.month +
            '-' +
            this.pages[0].forms[1].controls['endDate'].value.day,
          isHijriDate: false,
        };
        break;
    }
    this.accountsService.createCustomerDocs(creatDocReq).subscribe({
      next: () => {
        this.result = {
          type: 'Success',
          title: 'accounts.documents.success-title',
          subTitle: 'accounts.documents.success-desc',
          summary: this.summary,
        };
        this.result.type = 'Success';
        this.startButtonList = [];
        this.endButtonList = [];
        this.endButtonList = getSummaryEndButton();
        this.pageTitle.stepper!.stepCounter++;
      },
    });
  }

  /**
   * Balance Certificate
   * */
  validateBalanceCertificate() {
    let balanceCertificateValidateReq: BalanceCertificateValidateReq = {
      city: this.pages[0].forms[1].controls['city'].value.key,
      company: this.pages[0].forms[1].controls['company'].value,
      postalCode: this.pages[0].forms[1].controls['postalCode'].value,
      accountNumber:
        this.pages[0].forms[0].controls['accounts'].value.fullAccountNumber,
    };
    this.accountsService
      .validateBalanceCertificate(balanceCertificateValidateReq)
      .subscribe({
        next: (res: BalanceCertificateValidateRes) => {
          this.balanceCertificateValidateRes = res;
          this.setSummary();
        },
      });
  }

  /**
   * Balance Certificate
   * */

  /**
   * Accounts
   * */
  getSarAccounts() {
    this.accountsCommonService.getSarAccounts().subscribe({
      next: (res) => {
        this.sarAccountsRes = res;
        this.pages[0].forms[0].controls['accounts'].hidden = false;
        this.pages[0].forms[0].controls['accounts'].controlOptions.options =
          this.sarAccountsRes.listAlertsPermissionAccount;
      },
    });
  }

  private getEligibleAccounts() {
    let accountsReq: AccountsReq = {
      order: '',
      orderType: '',
      page: 1,
      rows: null,
      txType: 'ECAL',
    };
    this.accountsCommonService.getAllEligibleAccounts(accountsReq).subscribe({
      next: (res) => {
        this.pages[0].forms[0].controls['accounts'].hidden = false;
        this.pages[0].forms[0].controls['accounts'].controlOptions.options =
          res.listAccount;
        this.pages[0].forms[0].controls['accounts'].valueChanges.subscribe(
          (val) => {
            if (this.selectedDocType.key === '100') {
              this.getMonthlyStatementDataSet(val.value.fullAccountNumber);
            }
          }
        );
      },
    });
  }

  private getCities() {
    this.modelAndListService.getModel('cityType').subscribe((cities) => {
      let keyValueList: KeyValueModel[] = [];
      for (let key of Object.keys(cities['cityType'])) {
        const KeyValueModel: KeyValueModel = {
          key: key,
          value: cities['cityType'][key],
        };
        keyValueList.push(KeyValueModel);
      }
      this.pages[0].forms[1].controls['city'].controlOptions.options =
        keyValueList;
    });
  }

  private handleRequestedStatementSummary() {
    this.newStatementReq.amountFrom = null;
    this.newStatementReq.amountTo = null;
    this.newStatementReq.dateTo = '';
    this.newStatementReq.dateFrom = '';
    this.newStatementReq.filterBySelected = [];

    this.newStatementReq.accountNumber =
      this.pages[0].forms[0].controls['accounts'].value.fullAccountNumber;
    this.newStatementReq.language =
      this.pages[0].forms[1].controls['lang'].value.key.toLowerCase();
    this.newStatementReq.type =
      this.pages[0].forms[1].controls['type'].value.key;
    this.newStatementReq.typeTransaction =
      this.pages[0].forms[1].controls['transType'].value.key;

    this.summary!.sections![0].items!.push(
      {
        title: 'accounts.documents.docType.docType',
        subTitle: this.selectedDocType.value,
      },
      {
        title: 'public.account',
        subTitle:
          this.pages[0].forms[0].controls['accounts'].value.alias +
          ' - ' +
          this.pages[0].forms[0].controls['accounts'].value.fullAccountNumber,
      },
      {
        title: this.pages[0].forms[1].controls['lang'].label,
        subTitle: this.pages[0].forms[1].controls['lang'].value.value,
      },
      {
        title: this.pages[0].forms[1].controls['type'].label,
        subTitle: this.pages[0].forms[1].controls['type'].value.value,
      }
    );

    if (this.pages[0].forms[1].controls['fromDate'].value) {
      let date =
        this.pages[0].forms[1].controls['fromDate'].value.year +
        '-' +
        this.pages[0].forms[1].controls['fromDate'].value.month +
        '-' +
        this.pages[0].forms[1].controls['fromDate'].value.day;
      this.summary!.sections![0].items!.push({
        title: this.pages[0].forms[1].controls['fromDate'].label,
        subTitle: date,
      });
      this.newStatementReq.dateFrom = date;
    }
    if (this.pages[0].forms[1].controls['toDate'].value) {
      let date =
        this.pages[0].forms[1].controls['toDate'].value.year +
        '-' +
        this.pages[0].forms[1].controls['toDate'].value.month +
        '-' +
        this.pages[0].forms[1].controls['toDate'].value.day;
      this.summary!.sections![0].items!.push({
        title: this.pages[0].forms[1].controls['toDate'].label,
        subTitle: date,
      });
      this.newStatementReq.dateTo = date;
    }

    if (this.pages[0].forms[1].controls['fromRange'].value) {
      this.summary!.sections![0].items!.push({
        title: this.pages[0].forms[1].controls['fromRange'].label,
        subTitle: this.pages[0].forms[1].controls['fromRange'].value,
      });
      this.newStatementReq.amountFrom =
        this.pages[0].forms[1].controls['fromRange'].value;
    }
    if (this.pages[0].forms[1].controls['toRange'].value) {
      this.summary!.sections![0].items!.push({
        title: this.pages[0].forms[1].controls['toRange'].label,
        subTitle: this.pages[0].forms[1].controls['toRange'].value,
      });
      this.newStatementReq.amountTo =
        this.pages[0].forms[1].controls['toRange'].value;
    }

    this.summary!.sections![0].items!.push({
      title: this.pages[0].forms[1].controls['transType'].label,
      subTitle: this.pages[0].forms[1].controls['transType'].value.value,
    });

    if (
      this.pages[0].forms[1].controls['filter'].value &&
      this.pages[0].forms[1].controls['filter'].value.length > 0
    ) {
      let arrayFilter = [];
      let subTitle = '';
      for (const filter of this.pages[0].forms[1].controls['filter'].value) {
        if (subTitle.length === 0) {
          subTitle = filter.value;
        } else {
          subTitle = subTitle + ', ' + filter.value;
        }
        arrayFilter.push(filter.key);
      }
      this.newStatementReq.filterBySelected = arrayFilter;
      this.summary!.sections![0].items!.push({
        title: this.pages[0].forms[1].controls['filter'].label,
        subTitle: subTitle,
      });
    }

    this.pageTitle.stepper!.stepCounter++;
  }

  private document(res: string) {
    const blob = new Blob([res], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = this.selectedMonthlyFreq;
    link.click();
    link.remove();
  }
}
