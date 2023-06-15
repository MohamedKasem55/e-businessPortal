import {Injectable} from '@angular/core';
import {AbstractBaseService} from '../../base/abstract-base.service';
import {map, Observable} from 'rxjs';
import {Constants} from './processed-transactions-service-url';
import {
  ProcessedTransactionsRes,
  AccountsComboDataReq,
  ProcessedTransactionsRequest
} from 'app/@core/model/rest/processed-transactions/list-res';
import {ProcessedTransactionsReq} from 'app/@core/model/rest/processed-transactions/list-req';

@Injectable()
export class ProcessedTransactionsService extends AbstractBaseService {
  constructor() {
    super();
  }

  getProcessedTransactionsList(processedTransactionsReq: ProcessedTransactionsReq): Observable<ProcessedTransactionsRes> {
    return this.post(Constants.PROCESSED_TRANSACTIONS, processedTransactionsReq, {hideLoader: true})
      .pipe(map(data => data.transfers));
  }

  getProcessedTransactionsDetails(transaction: ProcessedTransactionsRequest): Observable<any> {

    return this.post(Constants.PROCESSED_TRANSACTIONS_DETAILS, transaction, {hideLoader: true})
      .pipe(map(data => data.withinTransfers));
  }

  getUsersComboData(): Observable<any> {
    return this.get(Constants.USERS_COMBO_DATA)
      .pipe(map(data => data.userIds));
  }

  getAccountsComboData(accountsComboDataReq: AccountsComboDataReq): Observable<any> {
    return this.post(Constants.ACCOUNTS_COMBO_DATA, accountsComboDataReq)
      .pipe(map(data => data.accountComboList));
  }

  getBankNames(bankNamesReq: any): Observable<any> {
    return this.post(Constants.BANK_NAMES, bankNamesReq)
      .pipe(map(data => data));
  }
}
