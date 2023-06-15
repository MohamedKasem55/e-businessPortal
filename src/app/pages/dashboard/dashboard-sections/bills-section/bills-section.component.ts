import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {LineCardModel} from 'arb-design-library/model/line-card.model';
import {TitleModel} from 'arb-design-library/model/title.model';
import {TopBillReportViews} from 'app/@core/model/rest/dashboard/dashboard-top-bills-transfers-res.model';
import {DashboardBase} from '../../dashboard-base';
import {ButtonModel} from "arb-design-library/model/button.model";

@Component({
  selector: 'app-bills-section',
  templateUrl: './bills-section.component.html',
})
export class BillsSectionComponent extends DashboardBase implements OnChanges {

  @Input() billsList!: TopBillReportViews[];

  topBillsTitle: TitleModel = {
    id: "topBillsAction",
    title: "accounts.fav-bills",
    endButtons: [
      {
        id: "viewAllBills",
        text: "pending-actions.view-all",
        type: "outLine"
      }
    ]
  }

  goToBillsBtn: ButtonModel[] = [
    {
      id: 'go-to-bills',
      text: 'dashboard-sections.go-to-bills',
      type: 'secondary',
    },
  ];

  billsLineCards!: LineCardModel[];

  columnCount: number = 1;
  DISPLAYED_LIST_LENGHT = 5;

  constructor() {
    super()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['billsList']) {
      this.billsList && this.setCardsLineCards(this.billsList)
    }
  }

  setCardsLineCards(bills: TopBillReportViews[]) {
    bills = bills.slice(0, this.DISPLAYED_LIST_LENGHT);
    bills.forEach((bill: TopBillReportViews) => {
      bill.image = 'assets/billerIcon/' + bill.billCode.substring(bill.billCode.length - 3, bill.billCode.length) + '.png';
    });
    this.billsLineCards = [];
    let tempLineCards: LineCardModel[] = [];
    bills.forEach((item, index) => {
      tempLineCards.push({
        id: item.billRef,
        title:
          item.nickName ||
          (this.translate.currentLang === 'en'
            ? item.billDescriptionEn
            : item.billDescriptionAr),
        card: item.image,
        subTitle: item.billRef,
        // rightSubTitle: 'pending-actions.due-amount',
        // amount: item.total.toString(),
        // amountPosition: 'right',
        currency: 'SAR', // need to check if needed to return from service
        hasBackground: true,
      });
    });
    this.billsLineCards = tempLineCards;
    // if (this.billsLineCards.length > 3) this.columnCount = 2;
  }

  onBillClick(billRef: string): void {
    if (billRef === 'viewAllBills') {
      return void this.router.navigate(['/payments/bill-payment']);
    } else {
      const bill = this.billsList.filter(item => item.billRef == billRef)[0];
      void this.router.navigateByUrl("/payments/one-time-payment", {state: bill})
    }

  }


  onGoToBillsClick(){
    void this.router.navigate(['/payments/bill-payment']);
  }

}
