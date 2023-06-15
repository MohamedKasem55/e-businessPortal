import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ModelAndListService} from 'app/@core/service/base/modelAndList.service';
import {CardsApprovalService} from 'app/@core/service/cards/business-cards/cards-approval.service';
import {TableHeaderType} from 'arb-design-library';
import {PaginationValueModel} from 'arb-design-library/model/pagination.model';
import {TableHeaderModel} from 'arb-design-library/model/table-header.model';
import {TableButtonOutputModel} from "arb-design-library/model/table-button-output.model";
import {CardsBaseComponent} from '../cards-base/cards-base.component';

@Component({
  selector: 'app-cards-user-approval',
  templateUrl: './cards-user-approval.component.html'
})
export class CardsUserApprovalComponent extends CardsBaseComponent implements OnInit {

  headers: TableHeaderModel[] = [];
  data!: any[];
  total: number = 0;
  paginationValue: PaginationValueModel = {page: 1, size: 20};

  constructor(private route: ActivatedRoute,
              private modelAndListService: ModelAndListService, private cardsApprovalService: CardsApprovalService) {

    super();
    this.setBreadcrumb([
      {
        text: 'cards.cards',
        url: '/cards'
      },
      {
        text: 'cards.request-status',
        url: ''
      }]);
    this.getCardsRequestStatus();
  }

  getCardsRequestStatus() {
    this.modelAndListService.getList(['currency', 'billStatus', 'batchSecurityLevelStatus', 'positivePayStatus']).subscribe(data => {
      const PaymentTypeMap = {"0": "Due Amount", "1": "Outstanding Amount", "2": "Custom"}
      const Status = {"P": "Pending", "A": "Approved", "R": "Rejected"}
      let headers: TableHeaderModel[] = [];
      headers.push({
        type: TableHeaderType.LINE_CARD,
        title: "cardsApproval.card-number",
        fieldName: "cardAccountNumber",
        controlOptions: {
          image: "image",
          subTitle: ""
        }
      });
      headers.push({
        type: TableHeaderType.DATE_TEXT,
        title: "cardsApproval.init-date",
        fieldName: "initiationDate",
        controlOptions: {format: "dd/MM/yyyy"}
      });
      headers.push({
        type: TableHeaderType.TEXT,
        title: "cardsApproval.pay-type",
        fieldName: "paymentOption",
        mapObject: PaymentTypeMap
      });
      headers.push({
        type: TableHeaderType.AMOUNT_TEXT,
        title: "cardsApproval.amount",
        fieldName: "amount",
        controlOptions: {currency: 'currency'}
      });

      headers.push({
        type: TableHeaderType.CURRENT_LEVEL,
        title: "public.current-level",
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
        type: TableHeaderType.NEXT_LEVEL,
        title: "public.next-level",
        fieldName: "securityLevelsDTOList",
        controlOptions: {completed: "Completed"}
      });
      headers.push({
        type: TableHeaderType.BUTTON,
        title: "cardsApproval.status",
        fieldName: "status",
        mapObject: Status,
        controlOptions: {
          id: "status",
          text: "status",
          disableCondition: "A"
        }
      });
      this.headers = headers;
    });

    this.getCardsApprovalData(this.paginationValue);
  }

  getCardsApprovalData(page: PaginationValueModel) {
    this.cardsApprovalService.getCardsApprovalList(page.page, page.size).subscribe({
      next: data => {

      this.data = data.businessCardsPagedResults.items;
      this.data.forEach((item: { image: string; }) => {
        item.image = "assets/img/cards/arb-card-prepaid-eb.png";
      });
      this.total = data.businessCardsPagedResults.total;
    },
    error: () => {
      this.data = [];
    }});
  }

  onTitleButtonClick(id: string) {
    if (id == 'arrowTitle') {
      this.router.navigateByUrl("/cards").then(() => {
      });
    }
  }

  externalPagination(data: PaginationValueModel) {
    this.paginationValue.page = data.page;
    this.paginationValue.size = data.size;
    this.getCardsApprovalData(this.paginationValue);
  }

  goToReject(data: TableButtonOutputModel) {
    this.router.navigateByUrl("/cards/card-approval-reject", {state: data.row}).then(() => {
    });
  }
}
