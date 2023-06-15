import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ModelAndListService } from '../../../@core/service/base/modelAndList.service';
import { PaginationValueModel } from 'arb-design-library/model/pagination.model';
import { UserApprovalService } from '../../../@core/service/transfer/user-approval/user-approval.service';
import { TabModel } from 'arb-design-library/model/tab.model';
import { TableHeaderModel } from 'arb-design-library/model/table-header.model';
import { TableHeaderType } from 'arb-design-library';
import { Location } from '@angular/common';
import { Utils } from '../../../@core/utility/Utils';
import { AuthenticationUtils } from '../../../@core/utility/authentication-utils';

@Component({
  selector: 'app-transfer-approval',
  templateUrl: './transfer-user-approval.component.html',
  styleUrls: [],
})
export class TransferUserApprovalComponent implements OnInit {
  tabs: TabModel[] = [];
  type: string = '';
  tableTitle: string = '';
  headers: TableHeaderModel[] = [];
  data: any[] | undefined;
  total: number = 0;
  paginationValue: PaginationValueModel = { page: 1, size: 50 };
  exportFileName: string = 'transfer.userApproval.title';

  constructor(
    private router: Router,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private location: Location,
    private modelAndListService: ModelAndListService,
    private userApprovalService: UserApprovalService
  ) {
    Utils.setBreadcrumb([
      {
        text: 'transfer.transfer',
        url: '/transfer',
      },
      { text: 'public.approvalStatus', url: '' },
    ]);
    this.setTabs();
  }

  setTabs() {
    AuthenticationUtils.hasAccess('TransferRequestStatus') ? this.tabs.push({text: "transfer.transfer", value: "transfer"}) : null
    AuthenticationUtils.hasAccess('BeneficiaryRequestStatus') ? this.tabs.push({
      text: "transfer.beneficiary.beneficiary-title",
      value: "beneficiary"
    }) : null;
    AuthenticationUtils.hasAccess('StandingOrderRequestStatus') ? this.tabs.push({
      text: "transfer.standingOrder.name",
      value: "standingOrder"
    }) : null;
    AuthenticationUtils.hasAccess('BulkPaymentsRequestStatus') ? this.tabs.push({text: "transfer.bulk-payment", value: "bulk"}) : null;

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.tabChanged(params.type);
    });
  }

  onTitleButtonClick(id: string) {
    if (id == 'arrowTitle') {
      this.router.navigateByUrl('/transfer').then(() => {});
    }
  }

  getTransfers() {
    this.headers = [];
    this.total = 0;
    this.modelAndListService
      .getList(['batchTypes', 'backEndCountryCode', 'bankCode'])
      .subscribe((data) => {
        const Status = { P: 'Pending', A: 'Approved', R: 'Rejected' };
        const batchTypes = data['batchTypes'];
        const backEndCountryCode = data['backEndCountryCode'];
        const bankCode = data['bankCode'];
        let headers: TableHeaderModel[] = [];
        headers.push({
          type: TableHeaderType.TEXT,
          title: 'transfer.userApproval.trans-type',
          fieldName: 'batchType',
          mapObject: batchTypes,
        });
        headers.push({
          type: TableHeaderType.DATE_TEXT,
          title: 'transfer.userApproval.init-date',
          fieldName: 'initiationDate',
          controlOptions: { format: 'dd/MM/yyyy' },
        });
        headers.push({
          type: TableHeaderType.TEXT,
          title: 'transfer.userApproval.from-acc',
          fieldName: 'accountFrom.fullAccountNumber',
        });
        headers.push({
          type: TableHeaderType.TEXT,
          title: 'transfer.userApproval.bene-name',
          fieldName: 'beneficiaryName',
        });
        headers.push({
          type: TableHeaderType.TEXT,
          title: 'transfer.userApproval.country',
          fieldName: 'country',
          mapObject: backEndCountryCode,
        });
        headers.push({
          type: TableHeaderType.TEXT,
          title: 'transfer.userApproval.bene-bank',
          fieldName: 'bankName',
          mapObject: bankCode,
        });
        headers.push({
          type: TableHeaderType.TEXT,
          title: 'transfer.userApproval.bene-acc',
          fieldName: 'beneficiaryAccount',
        });
        headers.push({
          type: TableHeaderType.AMOUNT_TEXT,
          title: 'transfer.userApproval.amount',
          fieldName: 'amount',
          controlOptions: { currency: 'currency' },
        });
        headers.push({
          type: TableHeaderType.TEXT,
          title: 'transfer.userApproval.reason-trans',
          fieldName: 'purposeDescriptionEN',
        });
        headers.push({
          type: TableHeaderType.CURRENT_LEVEL,
          title: 'transfer.userApproval.current-status',
          fieldName: 'securityDetails',
          controlOptions: {
            levelFieldName: 'level',
            statusFieldName: 'status',
            updaterFieldName: 'updater',
            dateFieldName: 'updateDate',
            dateFormat: 'dd/MM/yyyy',
          },
        });
        headers.push({
          type: TableHeaderType.NEXT_LEVEL,
          title: 'transfer.userApproval.next-status',
          fieldName: 'securityDetails',
          controlOptions: { completed: 'Completed' },
        });
        headers.push({
          type: TableHeaderType.TEXT,
          title: 'transfer.userApproval.status',
          fieldName: 'status',
          mapObject: Status,
        });

        this.headers = headers;
        this.getTableData(this.paginationValue);
      });
  }

  getBeneficiaries() {
    this.headers = [];
    this.total = 0;
    this.modelAndListService
      .getList(['batchTypes', 'backEndCountryCode', 'bankCode'])
      .subscribe((data) => {
        const Status = {
          P: 'public.approvalStatusList.P',
          A: 'public.approvalStatusList.A',
          R: 'public.approvalStatusList.R',
        };
        const batchTypes = data['batchTypes'];
        const backEndCountryCode = data['backEndCountryCode'];
        const bankCode = data['bankCode'];
        const category = {
          I: 'transfer.userApproval.ben.category.I',
          C: 'transfer.userApproval.ben.category.C',
        };

        let headers: TableHeaderModel[] = [];
        headers.push({
          title: 'transfer.userApproval.bene-name',
          type: TableHeaderType.TEXT,
          fieldName: 'beneficiaryName',
        });
        headers.push({
          title: 'transfer.userApproval.bene-type',
          type: TableHeaderType.TEXT,
          fieldName: 'batchType',
          mapObject: batchTypes,
        });
        headers.push({
          title: 'transfer.userApproval.bene-bank',
          type: TableHeaderType.TEXT,
          fieldName: 'bankName',
          mapObject: bankCode,
        });
        headers.push({
          title: 'transfer.userApproval.country',
          type: TableHeaderType.TEXT,
          fieldName: 'country',
          mapObject: backEndCountryCode,
        });
        headers.push({
          title: 'transfer.userApproval.category',
          type: TableHeaderType.TEXT,
          fieldName: 'category',
          mapObject: category,
        });
        headers.push({
          title: 'transfer.userApproval.init-date',
          type: TableHeaderType.DATE_TEXT,
          fieldName: 'initiationDate',
          controlOptions: { format: 'dd/MM/YYYY' },
        });
        headers.push({
          title: 'transfer.userApproval.current-status',
          type: TableHeaderType.CURRENT_LEVEL,
          controlOptions: {
            levelFieldName: 'level',
            statusFieldName: 'status',
            updaterFieldName: 'updater',
            dateFieldName: 'updateDate',
            dateFormat: 'dd/MM/yyyy',
          },
          fieldName: 'securityLevels',
        });
        headers.push({
          title: 'transfer.userApproval.next-status',
          type: TableHeaderType.NEXT_LEVEL,
          controlOptions: { completed: 'Completed' },
          fieldName: 'securityLevels',
        });
        headers.push({
          title: 'transfer.userApproval.status',
          type: TableHeaderType.TEXT,
          fieldName: 'status',
          mapObject: Status,
        });

        this.headers = headers;
        this.getTableData(this.paginationValue);
      });
  }

  getStandingOrders() {
    this.headers = [];
    this.total = 0;
    this.modelAndListService
      .getList(['batchTypes', 'backEndCountryCode', 'bankCode', 'purposeType'])
      .subscribe((res) => {
        const Status = {
          P: 'Pending',
          A: 'Approved',
          R: 'Rejected',
        };
        const operation = {
          '00': 'transfer.userApproval.standingOrder.operation.add',
          '01': 'transfer.userApproval.standingOrder.operation.mod',
          '02': 'transfer.userApproval.standingOrder.operation.del',
        };
        const frequency = {
          '1 ': 'transfer.standingOrder.frequency.oneMon',
          '1': 'transfer.standingOrder.frequency.oneMon',
          '3': 'transfer.standingOrder.frequency.threeMon',

          '3 ': 'transfer.standingOrder.frequency.threeMon',
          '6 ': 'transfer.standingOrder.frequency.sixMon',
          '6': 'transfer.standingOrder.frequency.sixMon',
          '12 ': 'transfer.standingOrder.frequency.twelveMon',

          '12': 'transfer.standingOrder.frequency.twelveMon',
        };

        let headers: TableHeaderModel[] = [];
        headers.push({
          title: 'transfer.userApproval.init-date',
          type: TableHeaderType.DATE_TEXT,
          fieldName: 'initiationDate',
          controlOptions: { format: 'dd/MM/YYYY' },
        });
        headers.push({
          title: 'transfer.userApproval.bene-acc',
          type: TableHeaderType.TEXT,
          fieldName: 'beneficiaryAccount',
        });
        headers.push({
          title: 'transfer.userApproval.amount',
          type: TableHeaderType.AMOUNT_TEXT,
          fieldName: 'amount',
          controlOptions: { currency: 'currency' },
        });

        headers.push({
          title: 'transfer.userApproval.operation',
          type: TableHeaderType.TEXT,
          fieldName: 'option',
          mapObject: operation,
        });
        headers.push({
          title: 'transfer.userApproval.pay-type',
          type: TableHeaderType.TEXT,
          fieldName: 'paymentType',
          mapObject: frequency,
        });
        headers.push({
          title: 'transfer.userApproval.current-status',
          type: TableHeaderType.CURRENT_LEVEL,
          controlOptions: {
            levelFieldName: 'level',
            statusFieldName: 'status',
            updaterFieldName: 'updater',
            dateFieldName: 'updateDate',
            dateFormat: 'dd/MM/yyyy',
          },
          fieldName: 'securityLevelsDTOList',
        }); //type Levels
        headers.push({
          title: 'transfer.userApproval.next-status',
          type: TableHeaderType.NEXT_LEVEL,
          controlOptions: { completed: 'Completed' },
          fieldName: 'securityLevelsDTOList',
        }); // type Next Levels
        headers.push({
          title: 'transfer.userApproval.status',
          type: TableHeaderType.TEXT,
          fieldName: 'status',
          mapObject: Status,
        });

        this.headers = headers;
        this.getTableData(this.paginationValue);
      });
  }

  getBulkPayments() {
    this.headers = [];
    this.total = 0;
    this.modelAndListService
      .getList(['batchTypes', 'backEndCountryCode', 'bankCode'])
      .subscribe(() => {
        const Status = {
          P: 'status.pending',
          A: 'status.approve',
          R: 'status.rejected',
          I: 'status.initiate',
        };

        let headers: TableHeaderModel[] = [];
        headers.push({
          title: 'transfer.userApproval.init-date',
          type: TableHeaderType.DATE_TEXT,
          fieldName: 'initiationDate',
          controlOptions: { format: 'dd/MM/YYYY' },
        });
        headers.push({
          title: 'transfer.userApproval.batch-name',
          type: TableHeaderType.TEXT,
          fieldName: 'batchName',
        });
        headers.push({
          title: 'transfer.userApproval.cust-ref',
          type: TableHeaderType.TEXT,
          fieldName: 'fileReference',
        });
        headers.push({
          title: 'transfer.userApproval.acc-num',
          type: TableHeaderType.TEXT,
          fieldName: 'accountNumber',
        });
        headers.push({
          title: 'transfer.userApproval.val-date',
          type: TableHeaderType.TEXT,
          fieldName: 'paymentDate',
        });
        headers.push({
          title: 'transfer.userApproval.tot-amount',
          type: TableHeaderType.TEXT,
          fieldName: 'totalAmountPlusFees',
        });
        headers.push({
          title: 'transfer.userApproval.tot-record-count',
          type: TableHeaderType.TEXT,
          fieldName: 'count',
        });
        headers.push({
          title: 'transfer.userApproval.status',
          type: TableHeaderType.CURRENT_LEVEL,
          controlOptions: {
            levelFieldName: 'level',
            statusFieldName: 'status',
            updaterFieldName: 'updater',
            dateFieldName: 'updateDate',
            dateFormat: 'dd/MM/yyyy',
          },
          fieldName: 'securityLevelsDTOList',
        });

        headers.push({
          title: 'transfer.userApproval.next-status',
          type: TableHeaderType.NEXT_LEVEL,
          controlOptions: { completed: 'Completed' },
          fieldName: 'securityLevelsDTOList',
        });
        headers.push({
          title: 'transfer.userApproval.reqs-status',
          type: TableHeaderType.TEXT,
          fieldName: 'statusX',
          mapObject: Status,
        });
        this.headers = headers;
        this.getTableData(this.paginationValue);
      });
  }

  tabChanged(id: string) {
    this.data = undefined;
    this.paginationValue = { page: 1, size: 20 };
    this.tableTitle = `transfer.userApproval.tabs.${id}`
    this.type = id;
    switch (this.type) {
      case 'transfer':
        this.location.replaceState('/transfer/approval?type=transfer');
        this.getTransfers();
        break;
      case 'beneficiary':
        this.location.replaceState('/transfer/approval?type=beneficiary');
        this.getBeneficiaries();
        break;
      case 'standingOrder':
        this.location.replaceState('/transfer/approval?type=standingOrder');
        this.getStandingOrders();
        break;
      case 'bulk':
        this.location.replaceState('/transfer/approval?type=bulk');
        this.getBulkPayments();
        break;
    }
  }

  externalPagination(data: PaginationValueModel) {
    this.getTableData(data);
  }

  getTableData(data: PaginationValueModel) {
    switch (this.type) {
      case 'transfer':
        this.userApprovalService
          .getTransferUserApproval({
            page: data.page,
            pending: false,
            rows: data.size,
          })
          .subscribe({
            next: (data) => {
              this.data = data.transfers.items;
              this.total = data.transfers.total;
            },
            error: () => {
              this.data = [];
            },
          });
        break;
      case 'beneficiary':
        this.userApprovalService
          .getBeneficiariesList({
            pending: false,
            page: data.page,
            rows: data.size,
          })
          .subscribe({
            next: (data) => {
              this.data = data.beneficiaries.items;
              this.total = data.beneficiaries.total;
            },
            error: () => {
              this.data = [];
            },
          });
        break;
      case 'standingOrder':
        this.userApprovalService
          .getStandingOrdersList({
            pending: false,
            page: data.page,
            rows: data.size,
          })
          .subscribe({
            next: (data) => {
              this.data = data.standingOrderList.items;
              this.total = data.standingOrderList.total;
            },
            error: () => {
              this.data = [];
            },
          });
        break;
      case 'bulk':
        this.userApprovalService
          .getBulkPaymentsList({
            pending: false,
            page: data.page,
            rows: data.size,
          })
          .subscribe({
            next: (data) => {
              this.data = data.bulkPaymentsList;
              for (let x = 0; x < data.bulkPaymentsList.length; x++) {
                data.bulkPaymentsList[x]['statusX'] =
                  data.bulkPaymentsList[x]['status'];
              }
              this.total = data.total;
            },
            error: () => {
              this.data = [];
            },
          });
        break;
    }
  }
}
