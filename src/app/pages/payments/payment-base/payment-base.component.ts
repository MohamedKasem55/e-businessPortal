import { BillPaymentValidateRes } from '../../../@core/model/rest/payments/billPayment/bill-payment-validate-res';
import { SummaryModel } from 'arb-design-library/model/summary.model';
import { AmountTitleModel } from 'arb-design-library/model/amount-title.model';
import { SummarySectionModel } from 'arb-design-library/model/summary-section.model';
import { AuthenticationUtils } from '../../../@core/utility/authentication-utils';
import { TransactionFollowBase } from '../../../shared/transaction-follow-base/transaction-follow-base';
import { Component, OnInit } from '@angular/core';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { Utils } from '../../../@core/utility/Utils';

@Component({
  selector: 'app-payment-base',
  templateUrl: './payment-base.component.html',
  styleUrls: [],
})
export class PaymentBaseComponent
  extends TransactionFollowBase
  implements OnInit
{
  additionalRefundButton: ButtonModel = {
    id: 'Add',
    text: 'payments.government.add',
    type: 'secondary',
    isDisable: false,
  };
  paymentsButton: ButtonModel = {
    id: 'Payments',
    type: 'primary',
    text: 'payments.go-to-payments',
  };
  analyticsButton: ButtonModel = {
    id: 'Analytics',
    type: 'secondary',
    text: 'payments.esal.analytics',
  };
  approvalStatusButton: ButtonModel = {
    id: 'UserApprovalStatus',
    type: 'secondary',
    text: 'public.approvalStatus',
  };
  proccessTransactionButton: ButtonModel = {
    id: 'ProcessedTransactions',
    type: 'secondary',
    text: 'transfer.processedTrnx.name',
  };
  statementButton: ButtonModel = {
    id: 'Statement',
    type: 'secondary',
    text: 'payments.esal.esal-statement',
  };

  showPendingActions: boolean = AuthenticationUtils.showPendingActions;

  hasNextApprovalLevel: boolean = false;

  constructor() {
    super();

    this.pageTitle = {
      id: 'paymentTitle',
      title: 'add-bill',
      stepper: {
        steps: ['', '', ''],
        stepCounter: 1,
        stepText: 'public.step',
        ofText: 'public.of',
      },
      endButtons: this.showPendingActions
        ? [this.approvalStatusButton, this.proccessTransactionButton]
        : [this.proccessTransactionButton],
    };
  }

  ngOnInit(): void {}

  goToPayments() {
    void this.router.navigate(['/payments']);
  }

  controlExist(
    pageIndex: number,
    formIndex: number,
    controlKey: string
  ): boolean {
    return this.pages[pageIndex]?.forms[formIndex]?.controls[controlKey]
      ? true
      : false;
  }

  fillBillSummary(
    showEditButton: boolean = true,
    billPaymentValidateRes?: BillPaymentValidateRes
  ): SummaryModel {
    let totalAmounts: AmountTitleModel[] = [];
    let sections: SummarySectionModel[] = [];
    if (billPaymentValidateRes) {
      if (billPaymentValidateRes.batchListsContainer.toProcess.length > 0) {
        billPaymentValidateRes.batchListsContainer.toProcess.forEach(
          (item, index) => {
            let sectionIndex = sections.push({
              pill: { text: item.futureStatus, type: 'Positive' },
              title: {
                id: 'billId' + (index + 1),
                title: item.addDescriptionEn,
                subTitle: item.billRef,
                startButtons: showEditButton ? [this.editButton] : [],
              },
              items: [
                {
                  title: 'payments.bill-payment.table-header.nick-name',
                  subTitle: item?.nickname,
                },
                {
                  title: 'payments.bill-payment.table-header.due-date',
                  subTitle: item?.dueDate?.toString(),
                },
                {
                  title: 'payments.bill-payment.table-header.original-amount',
                  subTitle: item?.amountOriginal?.toString(),
                },
                {
                  title: 'payments.bill-payment.table-header.payment-amount',
                  subTitle: item?.amountPayment?.toString(),
                },
              ],
            });
            if (item?.amountWithoutVat) {
              sections[sectionIndex - 1].items?.push({
                title: 'payments.bill-payment.table-header.amount-without-vat',
                subTitle: item?.amountWithoutVat?.toString(),
              });
            }
            sections[sectionIndex - 1].items?.push({
              title: 'payments.bill-payment.table-header.vat-amount',
              subTitle: item?.vatAmount ? item?.vatAmount?.toString() : '0.00',
            });
            sections[sectionIndex - 1].items?.push(
              Utils.getCurrentLevelSummaryItem(
                this.translate,
                item?.futureSecurityLevelsDTOList
              )
            );
          }
        );
        totalAmounts.push({
          text: 'payments.pay-bill.totalAmountToProcess',
          amount: billPaymentValidateRes.total.totalAmountToProcess.toString(),
          currency: 'SAR',
        });
        if (billPaymentValidateRes.total.totalAmountWithoutVatToProcess != 0)
          totalAmounts.push({
            text: 'payments.pay-bill.totalAmountWithoutVatToProcess',
            amount:
              billPaymentValidateRes.total.totalAmountWithoutVatToProcess.toString(),
            currency: 'SAR',
          });
      }
      if (billPaymentValidateRes.batchListsContainer.toAuthorize?.length) {
        billPaymentValidateRes.batchListsContainer.toAuthorize.forEach(
          (item, index) => {
            let sectionIndex = sections.push({
              pill: { text: item?.futureStatus, type: 'Warning' },
              title: {
                id: 'billId' + (index + 1),
                title: item?.addDescriptionEn,
                subTitle: item?.billRef,
                startButtons: showEditButton ? [this.editButton] : [],
              },
              items: [
                {
                  title: 'payments.bill-payment.table-header.nick-name',
                  subTitle: item?.nickname,
                },
                {
                  title: 'payments.bill-payment.table-header.due-date',
                  subTitle: item?.dueDate?.toString(),
                },
                {
                  title: 'payments.bill-payment.table-header.original-amount',
                  subTitle: item?.amountOriginal?.toString(),
                },
                {
                  title: 'payments.bill-payment.table-header.payment-amount',
                  subTitle: item?.amountPayment?.toString(),
                },
              ],
            });
            if (item?.amountWithoutVat) {
              sections[sectionIndex - 1].items?.push({
                title: 'payments.bill-payment.table-header.amount-without-vat',
                subTitle: item?.amountWithoutVat?.toString(),
              });
            }
            sections[sectionIndex - 1].items?.push({
              title: 'payments.bill-payment.table-header.vat-amount',
              subTitle: item?.vatAmount ? item?.vatAmount?.toString() : '0.00',
            });
            sections[sectionIndex - 1].items?.push(
              Utils.getCurrentLevelSummaryItem(
                this.translate,
                item?.futureSecurityLevelsDTOList
              )
            );
            sections[sectionIndex - 1].items?.push(
              Utils.getNextLevelSummaryItem(
                this.translate,
                item?.futureSecurityLevelsDTOList
              )
            );
          }
        );
        totalAmounts.push({
          text: 'payments.pay-bill.totalAmountToAuthorize',
          amount:
            billPaymentValidateRes.total.totalAmountToAuthorize.toString(),
          currency: 'SAR',
        });
        if (billPaymentValidateRes.total.totalAmountWithoutVatToAuthorize != 0)
          totalAmounts.push({
            text: 'payments.pay-bill.totalAmountWithoutVatToAuthorize',
            amount:
              billPaymentValidateRes.total.totalAmountWithoutVatToAuthorize.toString(),
            currency: 'SAR',
          });
      }
      if (billPaymentValidateRes.batchListsContainer.notAllowed.length > 0) {
        billPaymentValidateRes.batchListsContainer.notAllowed.forEach(
          (item, index) => {
            sections.push({
              pill: { text: item?.futureStatus, type: 'Negative' },
              title: {
                id: 'billId' + (index + 1),
                title: item?.addDescriptionEn,
                subTitle: item?.billRef,
                startButtons: showEditButton ? [this.editButton] : [],
              },
              items: [
                {
                  title: 'payments.bill-payment.table-header.nick-name',
                  subTitle: item?.nickname,
                },
                {
                  title: 'payments.bill-payment.table-header.due-date',
                  subTitle: item?.dueDate?.toString(),
                },
                {
                  title: 'payments.bill-payment.table-header.original-amount',
                  subTitle: item?.amountOriginal?.toString(),
                },
                {
                  title: 'payments.bill-payment.table-header.payment-amount',
                  subTitle: item?.amountPayment?.toString(),
                },
                {
                  title:
                    'payments.bill-payment.table-header.amount-without-vat',
                  subTitle: item?.amountWithoutVat?.toString(),
                },
                {
                  title: 'payments.bill-payment.table-header.vat-amount',
                  subTitle: item?.vatAmount
                    ? item?.vatAmount?.toString()
                    : '0.00',
                },
              ],
            });
          }
        );
        totalAmounts.push(
          {
            text: 'payments.pay-bill.totalAmountNotAllowed',
            amount:
              billPaymentValidateRes.total.totalAmountNotAllowed.toString(),
            currency: 'SAR',
          },
          {
            text: 'payments.pay-bill.totalAmountWithoutVatNotAllowed',
            amount:
              billPaymentValidateRes.total.totalAmountWithoutVatNotAllowed.toString(),
            currency: 'SAR',
          }
        );
      }
    }
    return {
      title: {
        id: 'SummaryTitle',
        title: 'public.summary',
        subTitle: totalAmounts,
        currency: 'SAR',
      },
      sections: sections,
    };
  }
}
