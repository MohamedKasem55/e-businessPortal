import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TitleModel } from 'arb-design-library/model/title.model';
import {
  getBalanceCertificateTableHeaders,
  getDocumentFilterPopup,
  getDocumentsTableHeaders,
  getDocumentTabs,
  getDocumentTitle,
  getMonthlyStatementPopUpDetails,
  getMonthlyStatementTableHeaders,
  getRequestedStatementPopUpDetails,
  getRequestedStatementTableHeaders,
} from './documents.component.controls';
import { TabModel } from 'arb-design-library/model/tab.model';
import { AccountsService } from '../../../@core/service/accounts/accounts.service';
import { TableHeaderModel } from 'arb-design-library/model/table-header.model';
import { ServiceLocator } from '../../../@core/service/base/service-locator.service';
import { BreadcrumbService } from '../../../@core/service/base/breadcrumb.service';
import { BreadcrumbModel } from 'arb-design-library/model/breadcrumb.model';
import { Router } from '@angular/router';
import { MonthlyStatementReq } from '../../../@core/model/rest/accounts/monthly-statement-req';
import { AccountsReq } from '../../../@core/model/rest/accounts/accounts-req';
import { Account } from '../../../@core/model/rest/common/account';
import { DatePipe } from '@angular/common';
import { BalanceCertificateReq } from '../../../@core/model/rest/accounts/balance-certificate-req';
import { ModelAndListService } from '../../../@core/service/base/modelAndList.service';
import { PopupService } from '../../../@core/service/base/popup.service';
import { PopupOutputModel } from '../../../@core/model/dto/popup.model';
import { Utils } from '../../../@core/utility/Utils';
import { AccountsCommonService } from '../../../@core/service/accounts/accounts-common.service';
import { AuthenticationUtils } from '../../../@core/utility/authentication-utils';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
})
export class DocumentsComponent implements OnInit {
  titleModel!: TitleModel;
  tabs: TabModel[] = [];
  selectedTab: string = '';
  tableHeaders: TableHeaderModel[] = getDocumentsTableHeaders();
  docStatus = '01';
  docType = '02';
  data: any[] | undefined;
  private breadcrumbService: BreadcrumbService;
  accounts: Account[] = [];
  showAccounts = false;
  selectedValues!: any[];
  selectedRow: any;
  monthlyStatementControls = getMonthlyStatementPopUpDetails();
  requestedStatementPopup = getRequestedStatementPopUpDetails();
  dataTableFilter = true;
  docFilter = getDocumentFilterPopup();
  documentRequest: any = {
    maxRecs: 20,
    offset: 1,
    reqState: this.docStatus,
    docType: this.docType,
  };
  selectedFilterAccounts!: Account;
  groups: any | null;
  selectedAccount!: Account;
  showPendingActions: boolean = AuthenticationUtils.showPendingActions;
  tableTitle!: string | undefined;

  constructor(
    private translateService: TranslateService,
    private router: Router,
    private datePipe: DatePipe,
    private modelAndListService: ModelAndListService,
    private accountsService: AccountsService,
    private accountsCommonService: AccountsCommonService,
    private popupService: PopupService
  ) {
    this.titleModel = getDocumentTitle();
    if (!this.showPendingActions) {
      this.titleModel.endButtons?.shift();
    }
    this.tabs = getDocumentTabs();
    this.groups = JSON.parse(sessionStorage.getItem('groups')!);
    if (!this.groups) {
      void this.router.navigate(['/login']);
    }
    if (!this.groups.items.BalanceCertificateGroup) {
      let index = this.tabs.findIndex(
        (tab, index) => tab.value === 'balanceCertificate'
      );
      this.tabs.splice(index, 1);
    }
    if (!this.groups.items.CompanyAdmins) {
      let index = this.tabs.findIndex(
        (tab, index) => tab.value === 'accStatement'
      );
      this.tabs.splice(index, 1);
      index = this.tabs.findIndex(
        (tab, index) => tab.value === 'ibanCertificate'
      );
      this.tabs.splice(index, 1);
      index = this.tabs.findIndex(
        (tab, index) => tab.value === 'bnkCertificate'
      );
      this.tabs.splice(index, 1);
    }
    if (!this.groups.items.InquiryGroup) {
      let index = this.tabs.findIndex(
        (tab, index) => tab.value === 'requestedStatement'
      );
      this.tabs.splice(index, 1);
      index = this.tabs.findIndex(
        (tab, index) => tab.value === 'monthlyStatement'
      );
      this.tabs.splice(index, 1);
    }

    this.selectedTab = this.tabs[0] ? this.tabs[0].value : '';
    this.breadcrumbService = ServiceLocator.injector.get(BreadcrumbService);

    this.setBreadcrumb([
      {
        text: 'accounts.acc',
        url: '/accounts',
      },
      {
        text: 'accounts.documents.name',
        url: '/accounts/documents',
      },
    ]);
    this.monthlyStatementControls.form?.controls[
      'docType'
    ].valueChanges.subscribe((res) => {
      if (res.value) {
        this.monthlyStatementControls.form!.controls[
          'download'
        ].controlOptions.isDisable = false;
        this.monthlyStatementControls.form!.controls[
          'print'
        ].controlOptions.isDisable = res.value.key === 'xls';
      }
    });
  }

  setBreadcrumb(breadcrumb: BreadcrumbModel[]) {
    this.breadcrumbService.setBreadcrumb(breadcrumb);
  }

  ngOnInit(): void {
    if (this.tabs.length > 0) this.onTabChange(this.selectedTab);
  }

  onTabChange(id: string) {
    this.tableTitle = this.tabs.find((element) => element.value === id)?.text;
    this.dataTableFilter =
      id !== 'balanceCertificate' &&
      id !== 'monthlyStatement' &&
      id !== 'requestedStatement';
    this.selectedTab = id;
    this.showAccounts = false;
    this.data = undefined;
    switch (id) {
      case 'accStatement':
        this.tableHeaders = getDocumentsTableHeaders();
        this.docType = '02';
        this.resetDocumentsList();
        break;
      case 'bnkCertificate':
        this.tableHeaders = getDocumentsTableHeaders();
        this.docType = '01';
        this.resetDocumentsList();
        break;
      case 'ibanCertificate':
        this.tableHeaders = getDocumentsTableHeaders();
        this.docType = '05';
        this.resetDocumentsList();
        break;
      case 'monthlyStatement':
        this.tableHeaders = getMonthlyStatementTableHeaders();
        this.showAccounts = true;
        this.getAccounts();
        break;
      case 'balanceCertificate':
        this.tableHeaders = getBalanceCertificateTableHeaders();
        this.getBalanceCertificateList();
        break;
      case 'requestedStatement':
        this.tableHeaders = getRequestedStatementTableHeaders();
        this.getRequestedStatementList();
        break;
    }
  }

  onButtonClick(id: string) {
    switch (id) {
      case 'UserApprovalStatus':
        this.router.navigate([
          '/accounts/documents/balanceCertificate/request-status',
        ]);
        break;
      case 'request-new':
        this.router.navigate(['/accounts/documents/request-new']);
        break;
      case 'arrowTitle':
        this.router.navigate(['/accounts']);
        break;
    }
  }

  private getAccounts() {
    let accountsReq: AccountsReq = {
      order: '',
      orderType: '',
      page: 1,
      rows: null,
      txType: 'ECAL',
    };
    this.accountsCommonService.getAllEligibleAccounts(accountsReq).subscribe({
      next: (res) => {
        this.accounts = res.listAccount;
        if (this.accounts && this.accounts.length > 0) {
          this.selectedAccount = this.accounts[0];
          this.selectAccount(this.selectedAccount);
        }
      },
    });
  }

  /**
   * Online documents
   * */
  private getDocumentDataSet() {
    this.accountsService.getDocsList(this.documentRequest).subscribe({
      next: (res) => {
        this.data = res.docsLst;
      },
      error: () => {
        this.data = [];
      },
    });
  }

  onDownloadClick(data: any) {
    this.selectedRow = data;
    if (data.buttonId === 'docReqStatus') {
      this.accountsService.downloadDocument(data.row.fileNetRef);
    }
    if (data.buttonId === 'download-id') {
      this.popupService
        .showPopup(this.monthlyStatementControls)
        .subscribe((res: PopupOutputModel) => {
          if (res.buttonId) {
            if (res.buttonId === 'close') {
              this.popupService.dismiss();
            }

            if (res.buttonId === 'print' || res.buttonId === 'download') {
              let monthlyStatementReq: MonthlyStatementReq = {
                parameter:
                  res.controls['docType'].value.key === 'pdf'
                    ? this.selectedRow.row.path
                    : this.selectedRow.row.pathX,
              };
              this.accountsService.downloadMonthlyStatement(
                monthlyStatementReq,
                res.buttonId === 'print',
                res.controls['docType'].value.key
              );
              this.popupService.dismiss();
            }
          }
        });
    }
    if (data.buttonId === 'download-req-stat-id') {
      this.accountsService.downloadRequestedStatement({
        parameter: this.selectedRow.row.fileName,
      });
    }
    if (data.buttonId === 'delete-id') {
      this.popupService
        .showPopup(this.requestedStatementPopup)
        .subscribe((res) => {
          if (res.buttonId === 'close') {
            this.popupService.dismiss();
          } else if (res.buttonId === 'delete') {
            this.accountsService
              .deleteRequestedStatement([this.selectedRow.row.fileName])
              .subscribe(() => {
                this.popupService.dismiss();
                this.getRequestedStatementList();
              });
          }
        });
    }
  }

  /**
   * Online documents
   * */

  /**
   * Monthly Statement
   *
   * */
  selectAccount(account: any) {
    this.getMonthlyStatementDataSet(account.fullAccountNumber);
  }

  private getMonthlyStatementDataSet(fullAccountNumber: string) {
    this.data = undefined;
    let params: MonthlyStatementReq = {
      parameter: fullAccountNumber,
    };
    this.accountsService.getMonthlyStatement(params).subscribe({
      next: (res) => {
        this.data = res.listStatement;
        for (let item of this.data!) {
          item['date'] = new Date(item.year + '-' + item.month + '-1');
        }
      },
      error: () => {
        this.data = [];
      },
    });
  }

  /**
   * Monthly Statement
   *
   * */

  /**
   * Balance Certificate
   *
   * */
  getBalanceCertificateList() {
    this.data = undefined;
    let params: BalanceCertificateReq = {
      order: 'requestDate',
      orderType: 'desc',
      page: 1,
      rows: null,
    };
    this.accountsService.getBalanceCertificatesList(params).subscribe({
      next: (res) => {
        this.modelAndListService.getModel('cityType').subscribe((cities) => {
          this.data = res.cetificates;
          this.tableHeaders[3].mapObject = cities['cityType'];
        });
      },
      error: () => {
        this.data = [];
      },
    });
  }

  private getRequestedStatementList() {
    this.data = undefined;
    let params: MonthlyStatementReq = {
      parameter: '',
    };
    this.accountsService.getRequestedStatement(params).subscribe({
      next: (res) => {
        const tempArray = [];
        for (let item of res.listStatement) {
          tempArray.push({ fileName: item });
        }
        this.data = tempArray;
      },
      error: () => {
        this.data = [];
      },
    });
  }

  onFilterClick() {
    let accountsReq: AccountsReq = {
      order: '',
      orderType: '',
      page: 1,
      rows: null,
      txType: 'ECAL',
    };
    this.accountsCommonService.getAllEligibleAccounts(accountsReq).subscribe({
      next: (res) => {
        this.docFilter.form!.controls['accounts'].controlOptions.options =
          res.listAccount;

        this.docFilter.form!.controls['accounts'].valueChanges.subscribe(
          (resVal) => {
            this.selectedFilterAccounts = resVal.value;
          }
        );

        this.docFilter.form!.controls['docStatus'].valueChanges.subscribe(
          (resVal) => {
            this.docStatus = resVal.value.key;
          }
        );

        this.modelAndListService
          .getModel('custDocsReqStates')
          .subscribe((res) => {
            this.docFilter.form!.controls['docStatus'].controlOptions.options =
              Utils.getModelList(res.custDocsReqStates);

            this.popupService
              .showPopup(this.docFilter)
              .subscribe((outputModel: PopupOutputModel) => {
                if (outputModel.buttonId === 'close') {
                  this.popupService.dismiss();
                }

                if (outputModel.buttonId === 'reset') {
                  this.docFilter.form!.controls['accounts'].setValue(null);
                  this.docFilter.form!.controls['docStatus'].setValue(null);
                  this.docFilter.form!.controls['requesterId'].setValue(null);
                  delete this.documentRequest.requesterId;
                  delete this.documentRequest.accountNum;
                  this.resetDocumentsList();
                  this.popupService.dismiss();
                }

                if (outputModel.buttonId === 'search') {
                  this.documentRequest = {
                    maxRecs: 20,
                    offset: 1,
                    reqState: this.docStatus,
                    docType: this.docType,
                  };
                  if (this.docFilter.form?.controls['requesterId'].value) {
                    this.documentRequest.requesterId =
                      this.docFilter.form?.controls['requesterId'].value;
                  }
                  if (this.docFilter.form?.controls['accounts'].value) {
                    this.documentRequest.accountNum =
                      this.docFilter.form?.controls[
                        'accounts'
                      ].value.fullAccountNumber;
                  }
                  this.getDocumentDataSet();
                  this.popupService.dismiss();
                }
              });
          });
      },
    });
  }

  private resetDocumentsList() {
    this.documentRequest = {
      maxRecs: 20,
      offset: 1,
      reqState: '01',
      docType: this.docType,
    };
    this.getDocumentDataSet();
  }
}
