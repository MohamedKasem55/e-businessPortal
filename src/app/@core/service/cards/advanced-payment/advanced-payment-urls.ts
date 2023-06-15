export class ADV_PAYMNT_CONST {
  static OWNER_CARDS_CURR_CYCL_AMNT = 'paymentAdvance/currentCycleAmount';
  static OWNER_CARDS_PAYMENT = 'paymentAdvance/sendHost';
  static BUSINESS_CARDS_PAYMENT_VALIDATE = 'businessCards/cardPayment/validate';
  static BUSINESS_CARDS_PAYMENT_CONFIRM = 'businessCards/cardPayment/confirm';
  static PAYMENT_OPTIONS = {
    dueAmount: '0',
    outstandingAmount: '1',
    custom: '2',
  };
}
