import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {WorkflowType} from 'app/@core/model/dto/pending-actions-model';
import {
  TopBillReportViews,
  TopTansferReport
} from 'app/@core/model/rest/dashboard/dashboard-top-bills-transfers-res.model';
import {LineCardModel} from 'arb-design-library/model/line-card.model';
import {TitleModel} from 'arb-design-library/model/title.model';
import {DashboardBase} from '../../dashboard-base';
import {ButtonModel} from "arb-design-library/model/button.model";

@Component({
  selector: 'app-transfers-section',
  templateUrl: './transfers-section.component.html',
})
export class TransfersSectionComponent extends DashboardBase implements OnChanges {

  @Input() transfersList!: TopTansferReport[];

  topTransfersTitle: TitleModel = {
    id: "topTransfersAction",
    title: "accounts.quick-transfer",
    endButtons: [
      {
        id: "viewAllTransfers",
        text: "pending-actions.view-all",
        type: "outLine"
      }
    ]
  }

  transfersTypes: WorkflowType[] = [{
    type: 'TO',
    isFinancial: true,
    text: "pending-actions.own-transfer",
  }, {
    type: 'TW',
    isFinancial: true,
    text: "pending-actions.within-transfer",
  }, {
    type: 'TL',
    isFinancial: true,
    text: "pending-actions.local-transfer",
  }, {
    type: 'TI',
    isFinancial: true,
    text: "pending-actions.international-transfer",
  }];

  transfersLineCards!: LineCardModel[];

  goToTransfersBtn: ButtonModel[] = [
    {
      id: 'go-to-transfers',
      text: 'dashboard-sections.go-to-transfers',
      type: 'secondary',
    },
  ];

  columnCount: number = 1;
  DISPLAYED_LIST_LENGHT = 10;

  constructor() {
    super()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transfersList']) {
      this.transfersList && this.setCardsLineCards(this.transfersList);
    }
  }

  setCardsLineCards(transfers: TopTansferReport[]) {
    transfers = transfers.slice(0, this.DISPLAYED_LIST_LENGHT);
    transfers.forEach((item: TopTansferReport) => {
      item.image = 'assets/banksLogo/' + item.bankCode + '.png';
    });


    this.transfersLineCards = [];
    let tempLineCards: LineCardModel[] = [];
    transfers.forEach((item, index) => {
      tempLineCards.push({
        id: index.toString(),
        title: item.beneficiaryName,
        card: item.image,
        subTitle: this.getTransferType(item.transferType) + ' - ' + item.accountTo,
        hasBackground: true,
      });
    });
    this.transfersLineCards = tempLineCards;
    if (this.transfersLineCards.length > 5) this.columnCount = 2;
  }

  getTransferType(type: string) {
    const transferTxt = type && this.transfersTypes.find(item => item.type == type)?.text;
    return transferTxt && this.translate.instant(transferTxt);
  }

  onTransferClick(index: string): void {
    if (index === 'viewAllTransfers') {
      void this.router.navigate(['/transfer/beneficiaries']);
    } else {
      let item = this.transfersList[parseInt(index)];
      const state = {state: {benefName: item.beneficiaryName}};
      switch (item.transferType) {
        case "TW":
          this.router.navigateByUrl('/transfer/alrajhi-transfer', state);
          break;
        case "TL":
          this.router.navigateByUrl('/transfer/local-transfer', state);
          break;
        case "TI":
          this.router.navigateByUrl('/transfer/international-transfer', state);
          break;
      }

    }

  }

  onGoToTransfersClick(){
    void this.router.navigate(['/transfer/beneficiaries']);
  }


}
