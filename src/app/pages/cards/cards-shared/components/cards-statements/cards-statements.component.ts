import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CARD_TYPE } from 'app/@core/model/dto/cards-enums';
import { AmountControl } from 'app/@core/model/dto/control/amount-control';
import { ControlBase } from 'app/@core/model/dto/control/control.model';
import { DropdownControl } from 'app/@core/model/dto/control/dropdown-control';
import {
  FormModel,
  FormResult,
  PageModel,
} from 'app/@core/model/dto/formModel';
import {
  CardStatementsRequest,
  statementsHeaders,
} from 'app/@core/model/rest/cards/common/statements-list-models';
import { AmountPipe } from 'app/@core/pipe/amount.pipe';
import { CardsStatementsService } from 'app/@core/service/cards/cards-statements/cards-statements.service';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { CurrencyPipe } from 'arb-design-library';
import { TableHeaderModel } from 'arb-design-library/model/table-header.model';
import {
  amountControl,
  StatmentTableModel,
  transactionMonthsControl,
} from './card-statements-controls';

@Component({
  selector: 'app-cards-statements',
  templateUrl: './cards-statements.component.html',
})
export class CardsStatementsComponent implements OnInit {
  @Input() cardSeq: string = '';
  @Input() cardType: string = '';

  page!: PageModel;
  statementsHeaders: TableHeaderModel[] = statementsHeaders;
  statementsTableModel: StatmentTableModel[] = [];

  searchForm!: FormModel;
  pageNumber: number = 1;
  rows: number = 20;
  statementList: any;

  constructor(
    private cardsStatementsService: CardsStatementsService,
    private translateService: TranslateService,
    private amountPipe: AmountPipe,
    private datePipe: DatePipe
  ) {
    this.searchForm = new FormModel({
      id: 'searchForm',
      controls: {
        transactionMonthsControl: new DropdownControl(
          transactionMonthsControl()
        ),
        //amountControl: new AmountControl(amountControl),
      },
    });

    this.page = new PageModel(1, this.searchForm);
  }

  ngOnInit(): void {
    this.loadCardStatements(true);
  }

  loadCardStatements(isFirstLoad: boolean = true) {
    const request: CardStatementsRequest =
      this.buildStatementsRequest(isFirstLoad);
    switch (this.cardType) {
      case CARD_TYPE.PREPAID:
        this.cardsStatementsService
          .getPrepaidCardStatements(request)
          .subscribe({
            next: (res) => {
              this.handleStatementsResponse(res);
              console.log(res);
            },
          });
        break;
      case CARD_TYPE.OWNER:
        this.cardsStatementsService.getOwnerCardStatements(request).subscribe({
          next: (res) => {
            this.handleStatementsResponse(res);
            console.log(res);
          },
        });
        break;
      case CARD_TYPE.BUSINESS:
        this.cardsStatementsService
          .getBusinessCardStatements(request)
          .subscribe({
            next: (res) => {
              this.handleStatementsResponse(res);
              console.log(res);
            },
          });
        break;
    }
  }
  handleStatementsResponse(result: any) {
    this.statementList = result.statementList;
    this.statementList.forEach((statement: any) => {
      const date = new Date(statement['stmtDate']);
      statement.value =
        date.getFullYear() != 9999
          ? this.datePipe.transform(statement['stmtDate'], 'dd MMMM yyyy')
          : this.translateService.instant('cards-statement.currentMonth');
    });

    this.statementList.forEach((element: any) => {
      this.statementsTableModel.push({
        amount: element.amount,
        merchantDescription: element.description,
        postingDate: element.value,
      });
    });
  }

  private buildStatementsRequest(isFirstLoad: boolean): CardStatementsRequest {
    if (isFirstLoad) {
      return { cardSeqNumber: this.cardSeq };
    }

    const date =
      this.page.forms[0].controls['transactionMonthsControl']?.value?.vaue;
    return {
      order: '',
      orderType: 'desc',
      page: this.pageNumber,
      rows: this.rows,
      stmtDate: date,
      cardSeqNumber: this.cardSeq,
    };
  }

  doResultChanged(data: FormResult[]) {
    //this.loadCardStatements(false);
  }

  doButtonClick(formButtonClickOutput: FormButtonClickOutput) {}
}
