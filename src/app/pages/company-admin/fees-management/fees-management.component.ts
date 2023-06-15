import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {
  BulkFeesRes,
  BulkPaymentsParametersDto,
  GeneralFees,
  GeneralFeesItem,
  GeneralFeesRes,
  PayrollCardFeesItem,
  PayrollCardFeesRes,
} from 'app/@core/model/rest/company-admin/fees-management/fees-management-res';
import {ModelAndListService} from 'app/@core/service/base/modelAndList.service';
import {FeesManagmentService} from 'app/@core/service/company-admin/fees-management/fees-management.service';
import { AuthenticationUtils } from 'app/@core/utility/authentication-utils';
import {SummaryItemModel} from 'arb-design-library/model/summary-item.model';
import {SummarySectionModel} from 'arb-design-library/model/summary-section.model';
import {TabModel} from 'arb-design-library/model/tab.model';
import {TableHeaderModel} from 'arb-design-library/model/table-header.model';
import {TitleModel} from 'arb-design-library/model/title.model';
import {take} from 'rxjs';
import {feesTableHeader} from "./fees-managment.controls";

export interface FessTableItem {
  feesType?: string;
  feesCode?: string;
  totalFee?: string;
  fee?: string;
  vat?: string;
}

@Component({
  selector: 'app-fees-management',
  templateUrl: './fees-management.component.html',
})
export class FeesManagementComponent implements OnInit {
  feesTotalCount = 0;
  feesSelectedList!: FessTableItem[] | undefined;
  summaryList: SummaryItemModel[] = [];
  generalFeesRes: GeneralFees = {
    items: [],
    size: 10,
    total: 10,
  };
  payrollCardFeesList: PayrollCardFeesItem[] = [];
  bulkFeesList: GeneralFeesItem[] = [];
  bulkPaymentsParametersDto: BulkPaymentsParametersDto = {};
  feesSummarySection: SummarySectionModel = {};
  headers: TableHeaderModel[] = [];
  tabsIDs = {
    generalFees: 'general',
    payrollFees: 'payroll',
    payrollCardFees: 'payrollCard',
    bulkFees: 'bulk',
  };
  currentFeesTab: string = this.tabsIDs.generalFees;
  feesTabs: TabModel[] = [
    {
      text: 'company-admin.fees.tabs.general',
      value: this.tabsIDs.generalFees,
    },
    {
      text: 'company-admin.fees.tabs.payroll',
      value: this.tabsIDs.payrollFees,
    },
    ...(AuthenticationUtils.hasPrivilege(['PAYROLL_PRIVILEGE'])
      ? [
          {
            text: 'company-admin.fees.tabs.payroll-card',
            value: this.tabsIDs.payrollCardFees,
          },
        ]
      : []),
    {
      text: 'company-admin.fees.tabs.bulk',
      value: this.tabsIDs.bulkFees,
    },
  ];

  pageTitle: TitleModel = {
    id: ' FeesManagement1',
    type: 'Page',
    title: 'company-admin.fees.title',
  };
  feesTypeLookup: any;
  feesCodeLookup: any;
  bulkInstitutionId: string = '';
  company: any;

  constructor(
    private service: FeesManagmentService,
    private translate: TranslateService,
    private modelAndListService: ModelAndListService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.getLookups();
    this.company = JSON.parse(sessionStorage.getItem('company')!);
  }

  getLookups() {
    this.modelAndListService
      .getList(['feesDataType', 'feesCode'])
      .subscribe((res) => {
        this.feesTypeLookup = res['feesDataType'];
        this.feesCodeLookup = res['feesCode'];
        this.headers = feesTableHeader(this.feesTypeLookup, this.feesCodeLookup)
        this.getGeneralFees();
      });
  }


  getGeneralFees() {
    this.service
      .getGeneralFeesList()
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.buildGeneralFeesSections(res);
        },
        error: () =>
          (this.feesSelectedList = []),
      });
  }

  getPayrollFeesList() {
    const newHeaders: any[] = this.headers;
    newHeaders.find(
      (a: any) => a.title === 'company-admin.fees.table-headers.fees-type'
    ).fieldName = 'dataType';
    newHeaders.find(
      (a: any) => a.title === 'company-admin.fees.table-headers.code'
    ).fieldName = 'code';
    newHeaders.find(
      (a: any) => a.title === 'company-admin.fees.table-headers.total-fee'
    ).fieldName = 'amount';
    newHeaders.find(
      (a: any) => a.title === 'company-admin.fees.table-headers.fee'
    ).fieldName = 'amount';
    newHeaders.find(
      (a: any) => a.title === 'company-admin.fees.table-headers.vat'
    ).fieldName = 'amount';
    this.headers = newHeaders;

    this.service
      .getPayrollFeesList()
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.buildPayrollSections(res.payrollCompanyDetails.payrollDebitAccount);
          this.feesSelectedList = res.generalFees.items;
        },
        error: () => (this.feesSelectedList = []),
      });
  }

  getPayrollCardFeesList() {
    this.service
      .getPayrollCardFeesList()
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.buildPayrollCardSections(res);
        },
        error: () => (this.feesSelectedList = []),
      });
  }

  getBulkStatementFeesList() {
    this.service
      .getBulkStatementFeesList()
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.buildBulkStatementFeesSections(res);
        },
        error: () => (this.feesSelectedList = []),
      });
  }

  private buildGeneralFeesSections(res: GeneralFeesRes) {
    this.summaryList.push({
      title: 'company-admin.fees.organization',
      subTitle: this.company.profileNumber,
    });
    this.feesSummarySection.items = this.summaryList;
    this.feesSelectedList = [];

    this.generalFeesRes = res.generalFees;

    this.generalFeesRes.items.forEach((item) => {
      const feesItem: FessTableItem = {
        feesType: item.dataType,
        feesCode: item.code,
        totalFee: item.amount ? `${item.amount}` : '0.00',
        fee: item.amount ? `${item.amount}` : '0.00',
        vat: item.amount ? `${item.amount}` : '0.00',
      };

      this.feesSelectedList!.push(feesItem);
    });
    if (!isNaN(res?.generalFees?.total)) this.feesTotalCount = res?.generalFees?.total;
  }

  private buildPayrollSections(payrollAccount: string) {
    this.summaryList.push({
      title: 'company-admin.fees.payroll-account',
      subTitle: payrollAccount,
    });
    this.feesSummarySection.items = this.summaryList;
  }

  private buildPayrollCardSections(res: PayrollCardFeesRes) {
    this.bulkInstitutionId = res?.institutionId;
    this.summaryList.push(
      {
        title: 'company-admin.fees.organization',
        subTitle: this.company.profileNumber,
      },
      {
        title: 'company-admin.fees.institution-id',
        subTitle: this.bulkInstitutionId,
      }
    );
    this.feesSummarySection.items = this.summaryList;

    this.feesSelectedList = [];
    this.payrollCardFeesList = res?.listFees;

    this.payrollCardFeesList.forEach((item) => {
      const feesItem: FessTableItem = {
        feesType: item.functionCode,
        feesCode:
          this.translate.currentLang == 'ar'
            ? item.arabicDescription
            : item.englishDescription,
        totalFee: item.feesAmount ? `${item.feesAmount}`: '0.00',
        fee: item.feesAmount ? `${item.feesAmount}`: '0.00',
        vat: item.feesAmount ? `${item.feesAmount}`: '0.00',
      };

      this.feesSelectedList!.push(feesItem);
    });
  }

  private buildBulkStatementFeesSections(res: BulkFeesRes) {
    this.bulkPaymentsParametersDto = res?.bulkPaymentsParametersDTO;
    this.summaryList.push(
      {
        title: 'company-admin.fees.organization',
        subTitle: this.company.profileNumber,
      },
      {
        title: 'company-admin.fees.bulk-code',
        subTitle: `${this.bulkPaymentsParametersDto.companyCode}`,
      },
      {
        title: 'company-admin.fees.change-account',
        subTitle: `${this.bulkPaymentsParametersDto.chargeAccountNumber}`,
      }
    );
    this.feesSummarySection.items = this.summaryList;

    this.feesSelectedList = [];
    this.bulkFeesList = res?.generalFees?.items;

    this.bulkFeesList.forEach((item) => {
      const feesItem: FessTableItem = {
        feesType: item.dataType,
        feesCode: item.code,
        totalFee: item.amount ? `${item.amount}`: '0.00',
        fee: item.amount ? `${item.amount}`: '0.00',
        vat: item.amount ? `${item.amount}`: '0.00',
      };

      this.feesSelectedList!.push(feesItem);
    });
    if (!isNaN(res?.generalFees?.total))
      this.feesTotalCount = res?.generalFees?.total;
  }

  onButtonClick() {
    void this.router.navigateByUrl('/company-admin');
  }

  feesTabChanged(key: string) {
    this.feesSelectedList = undefined;
    this.summaryList = [];
    this.feesSummarySection = {};
    switch (key) {
      case this.tabsIDs.generalFees:
        this.getGeneralFees();
        break;
      case this.tabsIDs.payrollFees:
        this.getPayrollFeesList();
        break;
      case this.tabsIDs.payrollCardFees:
        this.getPayrollCardFeesList();
        break;
      case this.tabsIDs.bulkFees:
        this.getBulkStatementFeesList();
        break;
      default:
        break;
    }
  }
}
