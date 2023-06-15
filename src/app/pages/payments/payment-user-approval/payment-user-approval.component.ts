import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { PopupInputModel } from 'app/@core/model/dto/popup.model';
import { BreadcrumbService } from 'app/@core/service/base/breadcrumb.service';
import { ModelAndListService } from 'app/@core/service/base/modelAndList.service';
import { PopupService } from 'app/@core/service/base/popup.service';
import { UserApprovalService } from 'app/@core/service/payments/user-approval/user-approval.service';
import { TableHeaderType } from 'arb-design-library';
import { PaginationValueModel } from "arb-design-library/model/pagination.model";
import { TabModel } from "arb-design-library/model/tab.model";
import { TableButtonOutputModel } from 'arb-design-library/model/table-button-output.model';
import { TableHeaderModel } from 'arb-design-library/model/table-header.model';
import { getDetailForm } from './payment-user-approval-contrlos';


@Component({
  selector: 'app-payment-approval',
  templateUrl: './payment-user-approval.component.html',
  styleUrls: []
})
export class PaymentUserApprovalComponent implements OnInit {

  tabs: TabModel[] = [];
  type: string = "";
  headers: TableHeaderModel[] = [];
  data: any[] | undefined;
  total: number = 0;
  detailsForm: PopupInputModel = getDetailForm();
  exportFileName: string = '';

  constructor(private router: Router, private route: ActivatedRoute, private datePipe: DatePipe, private location: Location,
              private modelAndListService: ModelAndListService, private userApprovalService: UserApprovalService, private popupService: PopupService,private breadcrumbService:BreadcrumbService) {
    this.setTabs();
  }

  setTabs() {
    this.tabs.push({text: "payments.userApproval.billTab", value: "bill"});
    this.tabs.push({
      text: "payments.userApproval.governmentPaymentsTab",
      value: "government-payments"
    });
    this.tabs.push({
      text: "payments.userApproval.governmentRefundsTab",
      value: "government-refunds"
    });
    this.tabs.push({text: "payments.userApproval.esalTab", value: "esal"});
    this.tabs.push({text: "payments.userApproval.aramcoTab", value: "aramco"});
    // this.tabs.push({
    //   text: "payments.userApproval.hajjUmrahAllocatedTab",
    //   value: "hajjUmrah-allocated"
    // });
    // this.tabs.push({
    //   text: "payments.userApproval.hajjUmrahOperationsTab",
    //   value: "hajjUmrah-operations"
    // });
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe((params: any) => {
          this.tabChanged(params.type);
        }
      );
    this.breadcrumbService.setBreadcrumb([
      {
        text: "payments.userApproval.payments",
        url: 'payments'
      },
      {
        text: "payments.userApproval.title",
        url: ''
      }]);
    }

  onTitleButtonClick(id: string) {
    if (id == 'arrowTitle') {
      this.router.navigateByUrl("/payments").then(() => {
      });
    }
  }

  getBillPayments() {
    this.headers = [];
    this.data = undefined;
    this.total = 0;

    const Status = {
      "P": "payments.userApproval.pending",
      "A": "payments.userApproval.approved",
      "R": "payments.userApproval.rejected"
    }

    let headers: TableHeaderModel[] = [];

    headers.push({
      title: "payments.userApproval.initiationDate",
      type: TableHeaderType.DATE_TEXT,
      fieldName: "initiationDate",
      controlOptions: {format: 'dd/MM/yyyy'}
    });
    headers.push({
      title: "payments.userApproval.accountFrom",
      type: TableHeaderType.TEXT,
      fieldName: "accountNumber"
    });
    headers.push({
      title: "payments.userApproval.billerName",
      type: TableHeaderType.TEXT,
      fieldName: "addDescriptionEn"
    });
    headers.push({
      title: "payments.userApproval.billerRef",
      type: TableHeaderType.TEXT,
      fieldName: "billRef"
    });
    headers.push({
      title: "payments.userApproval.nickname",
      type: TableHeaderType.TEXT,
      fieldName: "nickname"
    });
    headers.push({
      title: "payments.userApproval.originalAmount",
      type: TableHeaderType.AMOUNT_TEXT,
      fieldName: "amountOriginal",
      controlOptions: {currency: 'currency'}
    });
    headers.push({
      title: "payments.userApproval.paymentAmount",
      type: TableHeaderType.AMOUNT_TEXT,
      fieldName: "amountPayment",
      controlOptions: {currency: 'currency'}
    });
    headers.push({
      title: "payments.userApproval.amountWithoutVAT",
      type: TableHeaderType.AMOUNT_TEXT,
      fieldName: "amountWithoutVat",
      controlOptions: {currency: 'currency'}
    });
    headers.push({
      title: "payments.userApproval.VATAmount",
      type: TableHeaderType.AMOUNT_TEXT,
      fieldName: "vatAmount",
      controlOptions: {currency: 'currency'}
    });
    headers.push({
      title: "payments.userApproval.currentLevel",
      type: TableHeaderType.CURRENT_LEVEL,
      fieldName: "securityLevelsDTOList",
      controlOptions: {
        levelFieldName: "level",
        statusFieldName: "status",
        updaterFieldName: "updater",
        dateFieldName: "updateDate",
        dateFormat: "dd/MM/yyyy"
      }
    });
    headers.push({
      title: "payments.userApproval.nextLevel",
      type: TableHeaderType.NEXT_LEVEL,
      fieldName: "securityLevelsDTOList",
      controlOptions: {completed: "payments.userApproval.completed"}
    });
    headers.push({
      title: "payments.userApproval.status",
      type: TableHeaderType.TEXT,
      fieldName: "status",
      mapObject: Status
    });

    this.headers = headers;
    this.fillBillPayments(1, 50);
  }

  fillBillPayments(page: number, rows: number) {
    this.userApprovalService.getBillPaymentUserApproval({
      order: "requestDate",
      orderType: "desc",
      page,
      rows
    }).subscribe({
      next: (res) => {
        if (res.billsPagedResults?.size) {
          this.data = res.billsPagedResults.items;
          this.total = res.billsPagedResults.total;
        } else {
          this.data = [];
        }
      },
      error: () => {
        this.data = [];
        this.total = 0;
      }
    });
  }

  getEsal() {
    this.headers = [];
    this.data = undefined;
    this.total = 0;

    const Status = {
      "P": "payments.userApproval.pending",
      "A": "payments.userApproval.approved",
      "R": "payments.userApproval.rejected"
    }

    let headers: TableHeaderModel[] = [];
    headers.push({
      title: "payments.userApproval.invoiceNumber",
      type: TableHeaderType.TEXT,
      fieldName: "invoiceId"
    });
    headers.push({
      title: "payments.userApproval.supplierName",
      type: TableHeaderType.TEXT,
      fieldName: "billerName"
    });
    headers.push({
      title: "payments.userApproval.supplierID",
      type: TableHeaderType.TEXT,
      fieldName: "billerId"
    });
    headers.push({
      title: "payments.userApproval.amountDue",
      type: TableHeaderType.AMOUNT_TEXT,
      fieldName: "amountDue",
      controlOptions: {currency: 'currency'}
    });
    headers.push({
      title: "payments.userApproval.initiationDate",
      type: TableHeaderType.DATE_TEXT,
      fieldName: "initiationDate",
      controlOptions: {format: 'dd/MM/yyyy'}
    });
    headers.push({
      title: "payments.userApproval.dueDate",
      type: TableHeaderType.DATE_TEXT,
      fieldName: "dateDue",
      controlOptions: {format: 'dd/MM/yyyy'}
    });
    headers.push({
      title: "payments.userApproval.additionalDetails",
      type: TableHeaderType.TEXT,
      fieldName: "additionalDetails"
    });
    headers.push({
      title: "payments.userApproval.buyerName",
      type: TableHeaderType.TEXT,
      fieldName: "buyerName"
    });
    headers.push({
      title: "payments.userApproval.pay",
      type: TableHeaderType.AMOUNT_TEXT,
      fieldName: "amountPayment",
      controlOptions: {currency: 'currency'}
    });
    headers.push({
      title: "payments.userApproval.accountFrom",
      type: TableHeaderType.TEXT,
      fieldName: "accountNumber"
    });
    headers.push({
      title: "payments.userApproval.currentLevel",
      type: TableHeaderType.CURRENT_LEVEL,
      fieldName: "securityLevelsDTOList",
      controlOptions: {
        levelFieldName: "level",
        statusFieldName: "status",
        updaterFieldName: "updater",
        dateFieldName: "updateDate",
        dateFormat: "dd/MM/yyyy"
      }
    });
    headers.push({
      title: "payments.userApproval.nextLevel",
      type: TableHeaderType.NEXT_LEVEL,
      fieldName: "securityLevelsDTOList",
      controlOptions: {completed: "payments.userApproval.completed"}
    });
    headers.push({
      title: "payments.userApproval.status",
      type: TableHeaderType.TEXT,
      fieldName: "status",
      mapObject: Status
    });

    this.headers = headers;

    this.fillEsal(1, 50);
  }

  fillEsal(page: number, rows: number) {
    this.userApprovalService.getEsalUserApproval({page: page, rows: rows}).subscribe({
      next: (res) => {
        if (res.batchList?.size) {
          this.data = res.batchList.items;
          this.total = res.batchList.total;
        } else {
          this.data = [];
        }
      },
      error: () => {
        this.data = [];
        this.total = 0;
      }
    });
  }

  getAramcoPayments() {
    this.headers = [];
    this.data = undefined;
    this.total = 0;

    const Status = {
      "P": "payments.userApproval.pending",
      "A": "payments.userApproval.approved",
      "R": "payments.userApproval.rejected"
    }

    let headers: TableHeaderModel[] = [];
    headers.push({
      title: "payments.userApproval.passNumber",
      type: TableHeaderType.TEXT,
      fieldName: "passNumber"
    });
    headers.push({
      title: "payments.userApproval.account",
      type: TableHeaderType.TEXT,
      fieldName: "accountNumber"
    });
    headers.push({
      title: "payments.userApproval.currentLevel",
      type: TableHeaderType.CURRENT_LEVEL,
      fieldName: "securityLevelsDTOList",
      controlOptions: {
        levelFieldName: "level",
        statusFieldName: "status",
        updaterFieldName: "updater",
        dateFieldName: "updateDate",
        dateFormat: "dd/MM/yyyy"
      }
    });
    headers.push({
      title: "payments.userApproval.nextLevel",
      type: TableHeaderType.NEXT_LEVEL,
      fieldName: "securityLevelsDTOList",
      controlOptions: {completed: "payments.userApproval.completed"}
    });
    headers.push({
      title: "payments.userApproval.status",
      type: TableHeaderType.TEXT,
      fieldName: "status",
      mapObject: Status
    });

    this.headers = headers;

    this.fillAramcoPayments(1, 50);
  }

  fillAramcoPayments(page: number, rows: number) {
    this.userApprovalService.getAramcoPaymentUserApproval({page: page, rows: rows}).subscribe({
      next: (res) => {
        if (res.pendingAramcoPaymenList?.size) {
          this.data = res.pendingAramcoPaymenList.items;
          this.total = res.pendingAramcoPaymenList.total;
        } else {
          this.data = [];
        }
      },
      error: () => {
        this.data = [];
        this.total = 0;
      }
    });
  }


  getHajjUmrahCardsOperations() {
    this.headers = [];
    this.data = undefined;
    this.total = 0;
    this.modelAndListService.getList(['hajjUmrahcardsOperations']).subscribe(data => {
      const Status = {
        "P": "payments.userApproval.pending",
        "A": "payments.userApproval.approved",
        "R": "payments.userApproval.rejected"
      }
      const hajjUmrahcardsOperations = data['hajjUmrahcardsOperations'];

      let headers: TableHeaderModel[] = [];
      headers.push({
        title: "payments.userApproval.initiationDate",
        type: TableHeaderType.DATE_TEXT,
        fieldName: "initiationDate",
        controlOptions: {format: 'dd/MM/yyyy'}
      });
      headers.push({
        title: "payments.userApproval.cardNumber",
        type: TableHeaderType.TEXT,
        fieldName: "cardNumber"
      });
      headers.push({
        title: "payments.userApproval.cardHolder",
        type: TableHeaderType.TEXT,
        fieldName: "cardHolderName"
      });
      headers.push({
        title: "payments.userApproval.passport",
        type: TableHeaderType.TEXT,
        fieldName: "passportNumber"
      });
      headers.push({
        title: "payments.userApproval.visaNumber",
        type: TableHeaderType.TEXT,
        fieldName: "visaNumber"
      });
      headers.push({
        title: "payments.userApproval.operationtype",
        type: TableHeaderType.TEXT,
        fieldName: "operation",
        mapObject: hajjUmrahcardsOperations
      });
      headers.push({
        title: "payments.userApproval.amount",
        type: TableHeaderType.AMOUNT_TEXT,
        fieldName: "amount",
        controlOptions: {currency: 'currency'}
      });
      headers.push({
        title: "payments.userApproval.fees",
        type: TableHeaderType.AMOUNT_TEXT,
        fieldName: "expectedFees",
        controlOptions: {currency: 'currency'}
      });
      headers.push({
        title: "payments.userApproval.currentLevel",
        type: TableHeaderType.CURRENT_LEVEL,
        fieldName: "securityLevelsDTOList",
        controlOptions: {
          levelFieldName: "level",
          statusFieldName: "status",
          updaterFieldName: "updater",
          dateFieldName: "updateDate",
          dateFormat: "dd/MM/yyyy"
        }
      });
      headers.push({
        title: "payments.userApproval.nextLevel",
        type: TableHeaderType.NEXT_LEVEL,
        fieldName: "securityLevelsDTOList",
        controlOptions: {completed: "payments.userApproval.completed"}
      });
      headers.push({
        title: "payments.userApproval.status",
        type: TableHeaderType.TEXT,
        fieldName: "status",
        mapObject: Status
      });

      this.headers = headers;
      this.fillHajjUmrahCardsOperations(1, 50);
    });
  }

  fillHajjUmrahCardsOperations(page: number, rows: number) {
    this.userApprovalService.getHajjOperationUserApproval({
      page: page,
      rows: rows,
      order: "desc",
      orderType: "initiationDate"
    }).subscribe({
      next: (res) => {
        if (res.listOperationsDSO?.size) {
          this.data = res.listOperationsDSO.items;
          this.total = res.listOperationsDSO.total;
        } else {
          this.data = [];
        }
      },
      error: () => {
        this.data = [];
        this.total = 0;
      }
    });
  }

  getHajjUmrahCardsAllocation() {
    this.headers = [];
    this.data = undefined;
    this.total = 0;

    const Status = {
      "P": "payments.userApproval.pending",
      "A": "payments.userApproval.approved",
      "R": "payments.userApproval.rejected"
    }

    let headers: TableHeaderModel[] = [];
    headers.push({
      title: "payments.userApproval.initiationDate",
      type: TableHeaderType.DATE_TEXT,
      fieldName: "initiationDate",
      controlOptions: {format: 'dd/MM/yyyy'}
    });
    headers.push({
      title: "payments.userApproval.cardNumber",
      type: TableHeaderType.TEXT,
      fieldName: "cardNumber"
    });
    headers.push({
      title: "payments.userApproval.cardHolder",
      type: TableHeaderType.TEXT,
      fieldName: "cardHolderName"
    });
    headers.push({
      title: "payments.userApproval.passport",
      type: TableHeaderType.TEXT,
      fieldName: "passportNumber"
    });
    headers.push({
      title: "payments.userApproval.visaNumber",
      type: TableHeaderType.TEXT,
      fieldName: "visaNumber"
    });
    headers.push({
      title: "payments.userApproval.visaExpiryDate",
      type: TableHeaderType.DATE_TEXT,
      fieldName: "visaExpiryDate",
      controlOptions: {format: 'dd/MM/yyyy'}
    });
    headers.push({
      title: "payments.userApproval.amount",
      type: TableHeaderType.AMOUNT_TEXT,
      fieldName: "amount",
      controlOptions: {currency: 'currency'}
    });
    headers.push({
      title: "payments.userApproval.fees",
      type: TableHeaderType.AMOUNT_TEXT,
      fieldName: "expectedFees",
      controlOptions: {currency: 'currency'}
    });
    headers.push({
      title: "payments.userApproval.currentLevel",
      type: TableHeaderType.CURRENT_LEVEL,
      fieldName: "securityLevelsDTOList",
      controlOptions: {
        levelFieldName: "level",
        statusFieldName: "status",
        updaterFieldName: "updater",
        dateFieldName: "updateDate",
        dateFormat: "dd/MM/yyyy"
      }
    });
    headers.push({
      title: "payments.userApproval.nextLevel",
      type: TableHeaderType.NEXT_LEVEL,
      fieldName: "securityLevelsDTOList",
      controlOptions: {completed: "payments.userApproval.completed"}
    });
    headers.push({
      title: "payments.userApproval.status",
      type: TableHeaderType.TEXT,
      fieldName: "status",
      mapObject: Status
    });

    this.headers = headers;
    this.fillHajjUmrahCardsAllocation(1, 50);

  }

  fillHajjUmrahCardsAllocation(page: number, rows: number) {
    this.userApprovalService.getHajjAllocatedUserApproval({
      page: page,
      rows: rows,
      order: "desc",
      orderType: "initiationDate"
    }).subscribe({
      next: (res) => {
        if (res.listAllocationDTO?.size) {
          this.data = res.listAllocationDTO.items;
          this.total = res.listAllocationDTO.total;
        } else {
          this.data = [];
        }
      },
      error: () => {
        this.data = [];
        this.total = 0;
      }
    });
  }

  getGovernmentPayments() {
    this.headers = [];
    this.data = undefined;
    this.total = 0;
    this.modelAndListService.getList(['eGovApplicationTypeAll']).subscribe(data => {
      const Status = {
        "P": "payments.userApproval.pending",
        "A": "payments.userApproval.approved",
        "R": "payments.userApproval.rejected"
      }
      const eGovApplicationTypeAll = data['eGovApplicationTypeAll'];

      let headers: TableHeaderModel[] = [];
      headers.push({
        title: "payments.userApproval.initiationDate",
        type: TableHeaderType.DATE_TEXT,
        fieldName: "initiationDate",
        controlOptions: {format: 'dd/MM/yyyy'}
      });
      headers.push({
        title: "payments.userApproval.serviceType",
        type: TableHeaderType.TEXT,
        fieldName: "applicationType",
        mapObject: eGovApplicationTypeAll
      });
      headers.push({
        title: "payments.userApproval.beneficiaryName",
        type: TableHeaderType.TEXT,
        fieldName: "beneficiaryName"
      });
      headers.push({
        title: "payments.userApproval.amount",
        type: TableHeaderType.BUTTON,
        fieldName: "amount",
        controlOptions: {
          id: "amount",
          text: "amount",
        }
      });
      headers.push({
        title: "payments.userApproval.fees",
        type: TableHeaderType.TEXT,
        fieldName: "fees",
      });
      headers.push({
        title: "payments.userApproval.currentLevel",
        type: TableHeaderType.CURRENT_LEVEL,
        fieldName: "securityLevelsDTOList",
        controlOptions: {
          levelFieldName: "level",
          statusFieldName: "status",
          updaterFieldName: "updater",
          dateFieldName: "updateDate",
          dateFormat: "dd/MM/yyyy"
        }
      });
      headers.push({
        title: "payments.userApproval.nextLevel",
        type: TableHeaderType.NEXT_LEVEL,
        fieldName: "securityLevelsDTOList",
        controlOptions: {completed: "payments.userApproval.completed"}
      });
      headers.push({
        title: "payments.userApproval.status",
        type: TableHeaderType.BUTTON,
        fieldName: "status",
        mapObject: Status,
        controlOptions: {
          id: "status",
          text: "status",
          disableCondition: "P"
        }
      });

      this.headers = headers;

      this.fillGovernmentPayments(1, 50);
    });
  }

  fillGovernmentPayments(page: number, rows: number) {
    this.userApprovalService.getGovernmentPaymentsUserApproval({page: page, rows: rows}).subscribe({
      next: (res) => {
        if (res.requestStatusEgovSPList?.size) {
          this.data=[]
          res.requestStatusEgovSPList.items.forEach(element => {

            let strFee: string =''
            if(element.fees){
              const values: string[] = element.fees?.map((obj) => obj.feeAmount.toString());
              strFee = values.join(', ');
            }

            this.data?.push(
              {
                batchPk: element.batchPk,
                type:element.type,
                status: element.status,
                accountNumber: element.accountNumber,
                accountAlias: element.accountAlias,
                rejectedReason: element.rejectedReason,
                initiationDate: element.initiationDate,
                hostRequest: element.hostRequest,
                nextStatus: element.nextStatus,
                securityLevelsDTOList: element.securityLevelsDTOList,
                futureSecurityLevelsDTOList: element.futureSecurityLevelsDTOList,
                beStatus: element.beStatus,
                cic: element.cic,
                parentBatchFk: element.parentBatchFk,
                serviceType: element.serviceType,
                transactionType: element.transactionType,
                applicationType: element.applicationType,
                paymentId: element.paymentId,
                unusedBalance: element.unusedBalance,
                amount: element.amount,
                beneficiaryName: element.beneficiaryName,
                errorCode: element.errorCode,
                errorDescription: element.errorDescription,
                details: element.details,
                fees: strFee,
                completeFees: element.fees,
                violations: element.violations,
                userHasPrivilege: element.userHasPrivilege,
                pdfSecurityLevelsDTOList: element.pdfSecurityLevelsDTOList,
                futureStatus: element.futureStatus,
              }
            )
          });

          this.total = res.requestStatusEgovSPList.total;
        } else {
          this.data = [];
        }
      },
      error: () => {
        this.data = [];
        this.total = 0;
      }
    });
  }

  getGovernmentRefunds() {
    this.headers = [];
    this.data = undefined;
    this.total = 0;
    this.modelAndListService.getList(['eGovApplicationTypeAll']).subscribe(data => {
      const Status = {
        "P": "payments.userApproval.pending",
        "A": "payments.userApproval.approved",
        "R": "payments.userApproval.rejected"
      }
      const eGovApplicationTypeAll = data['eGovApplicationTypeAll'];

      let headers: TableHeaderModel[] = [];
      headers.push({
        title: "payments.userApproval.initiationDate",
        type: TableHeaderType.DATE_TEXT,
        fieldName: "initiationDate",
        controlOptions: {format: 'dd/MM/yyyy'}
      });
      headers.push({
        title: "payments.userApproval.serviceType",
        type: TableHeaderType.TEXT,
        fieldName: "applicationType",
        mapObject: eGovApplicationTypeAll
      });
      headers.push({
        title: "payments.userApproval.beneficiaryName",
        type: TableHeaderType.TEXT,
        fieldName: "beneficiaryName"
      });
      headers.push({
        title: "payments.userApproval.fees",
        type: TableHeaderType.TEXT,
        fieldName: "fees",
      });
      headers.push({
        title: "payments.userApproval.currentLevel",
        type: TableHeaderType.CURRENT_LEVEL,
        fieldName: "securityLevelsDTOList",
        controlOptions: {
          levelFieldName: "level",
          statusFieldName: "status",
          updaterFieldName: "updater",
          dateFieldName: "updateDate",
          dateFormat: "dd/MM/yyyy"
        }
      });
      headers.push({
        title: "payments.userApproval.nextLevel",
        type: TableHeaderType.NEXT_LEVEL,
        fieldName: "securityLevelsDTOList",
        controlOptions: {completed: "payments.userApproval.completed"}
      });
      headers.push({
        title: "payments.userApproval.status",
        type: TableHeaderType.BUTTON,
        fieldName: "status",
        mapObject: Status,
        controlOptions: {
          id: "status",
          text: "status",
          disableCondition: "P"
        }
      });

      this.headers = headers;

     this.fillGovernmentRefunds(1,50);
    });
  }

  fillGovernmentRefunds(page: number, rows: number) {
    this.userApprovalService.getGovernmentRefundsUserApproval({page: page, rows: rows}).subscribe({
      next: (res) => {
        if (res.requestStatusEgovSRList?.size) {
          this.data=[]
          res.requestStatusEgovSRList.items.forEach(element => {

            let strFee: string =''
            if(element.fees){
              const values: string[] = element.fees?.map((obj) => obj.feeAmount.toString());
              strFee = values.join(', ');
            }

            this.data?.push(
              {
                batchPk: element.batchPk,
                type:element.type,
                status: element.status,
                accountNumber: element.accountNumber,
                accountAlias: element.accountAlias,
                rejectedReason: element.rejectedReason,
                initiationDate: element.initiationDate,
                hostRequest: element.hostRequest,
                nextStatus: element.nextStatus,
                securityLevelsDTOList: element.securityLevelsDTOList,
                futureSecurityLevelsDTOList: element.futureSecurityLevelsDTOList,
                beStatus: element.beStatus,
                cic: element.cic,
                parentBatchFk: element.parentBatchFk,
                serviceType: element.serviceType,
                transactionType: element.transactionType,
                applicationType: element.applicationType,
                paymentId: element.paymentId,
                unusedBalance: element.unusedBalance,
                amount: element.amount,
                beneficiaryName: element.beneficiaryName,
                errorCode: element.errorCode,
                errorDescription: element.errorDescription,
                details: element.details,
                fees: strFee,
                completeFees: element.fees,
                violations: element.violations,
                userHasPrivilege: element.userHasPrivilege,
                pdfSecurityLevelsDTOList: element.pdfSecurityLevelsDTOList,
                futureStatus: element.futureStatus,
              }
            )
          });

          this.total = res.requestStatusEgovSRList.total;
        } else {
          this.data = [];
        }
      },
      error: () => {
        this.data = [];
        this.total = 0;
      }
    });
  }

  tabChanged(id: string) {
    this.type = id;
    this.exportFileName = this.tabs.find(({value}) => value === this.type)?.text!
    switch (this.type) {
      case "bill":
        this.location.replaceState('/payments/approval?type=bill');
        this.getBillPayments();
        break;
      case "government-payments":
        this.location.replaceState('/payments/approval?type=government-payments');
        this.getGovernmentPayments();
        break;
      case "government-refunds":
        this.location.replaceState('/payments/approval?type=government-refunds');
        this.getGovernmentRefunds();
        break;
      case "esal":
        this.location.replaceState('/payments/approval?type=esal');
        this.getEsal();
        break;
      case "aramco":
        this.location.replaceState('/payments/approval?type=aramco');
        this.getAramcoPayments();
        break;
      case "hajjUmrah-allocated":
        this.location.replaceState('/payments/approval?type=hajjUmrah-allocated');
        this.getHajjUmrahCardsAllocation();
        break;
      case "hajjUmrah-operations":
        this.location.replaceState('/payments/approval?type=hajjUmrah-operations');
        this.getHajjUmrahCardsOperations();
        break;
    }
  }


  externalPagination(data: PaginationValueModel) {
    switch (this.type) {
      case "bill":
        this.fillBillPayments(data.page, data.size);
        break;
      case "government-payments":
        this.fillGovernmentPayments(data.page, data.size);
        break;
      case "government-refunds":
        this.fillGovernmentRefunds(data.page, data.size);
        break;
      case "esal":
        this.fillEsal(data.page, data.size);
        break;
      case "aramco":
        this.fillAramcoPayments(data.page, data.size);
        break;
      case "hajjUmrah-allocated":
        this.fillHajjUmrahCardsAllocation(data.page, data.size);
        break;
      case "hajjUmrah-operations":
        this.fillHajjUmrahCardsOperations(data.page, data.size);
        break;
    }
  }

  goToReject(data: TableButtonOutputModel) {
    switch (data.buttonId) {
      case 'status':
        const row = data.row;
        if (this.type==='government-payments' || this.type==='government-refunds') {
          row.fees = data.row.completeFees;
          delete row.completeFees;
        }
        this.router.navigateByUrl("/payments/payment-status/details", {state: row}).then(() => {
        });
        break;
      case 'amount':
        this.detailsForm.title = 'payments.userApproval.paymentDetails';
        this.detailsForm.form!.controls!["date"].setValue(data.row.initiationDate ? this.datePipe.transform(data.row.initiationDate, 'dd/MM/YYYY') : "")
        this.detailsForm.form!.controls!["sponsorId"].setValue(data.row.details && data.row.details.length > 0 ? data.row.details[0].value : "")
        this.detailsForm.form!.controls!["amount"].setValue(data.row.amount ? data.row.amount : "")
        this.detailsForm.form!.controls!["account"].setValue(data.row.accountNumber ? data.row.accountNumber : "")
        this.popupService.showPopup(this.detailsForm);
        break;
    }
  }


}
