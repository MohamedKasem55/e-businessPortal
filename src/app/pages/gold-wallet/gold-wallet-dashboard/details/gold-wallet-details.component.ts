import { Component, OnInit } from '@angular/core';
import { PageModel } from 'app/@core/model/dto/formModel';
import { GoldDetails } from 'app/@core/model/rest/gold-wallet/gold-wallet-transactions-res';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { GoldWalletBaseComponent } from '../../gold-wallet-base/gold-wallet-base.component';
import { gwDetailForm } from './gold-wallet-details-contrlos';


@Component({
  selector: 'app-gold-wallet-details',
  templateUrl: '../../gold-wallet-base/gold-wallet-base.component.html',
  styleUrls: []
})
export class GoldWalletDetailsComponent extends GoldWalletBaseComponent implements OnInit {

  goldDetails!: GoldDetails;
  accountNum: string
  walletNum: string


  constructor() {
    super();

    this.goldDetails=this.router.getCurrentNavigation()?.extras?.state?.['info']
    this.accountNum=this.router.getCurrentNavigation()?.extras?.state?.['account']
    this.walletNum=this.router.getCurrentNavigation()?.extras?.state?.['wNumber']

  }

  override ngOnInit(): void {
    this.pageTitle.id = 'details';
    this.pageTitle.title = "gold-wallet.dashboard.details";

    this.setBreadcrumb([{
      text: 'gold-wallet.title',
      url: 'gold-wallet/dashboard'
    }, {text: 'gold-wallet.dashboard.details', url: ''}]);

    this.endButtons=[]
    this.drawPage()

  }


  override onButtonClick(formButtonClickOutput: FormButtonClickOutput): void {
    switch (formButtonClickOutput.buttonId) {
      case 'Back':
        this.router
        .navigate(['/gold-wallet/dashboard'], { queryParams: { type: 'last-transactions' } })
        .then(() => {});
        break;
    }
  }

  drawPage() {
    this.pages = [];
    this.pages = [new PageModel(1, gwDetailForm())];

    this.getControl(0, 0, "walletNum").setValue(this.walletNum);
    this.getControl(0, 0, "refNum").setValue(this.goldDetails.serialNumber);
    this.getControl(0, 0, "goldCode").setValue(this.goldDetails.goldCode);
    this.getControl(0, 0, "paidFrom").setValue(this.accountNum);
    this.getControl(0, 0, "amount").setValue(this.goldDetails.costPrice);
    this.getControl(0, 0, "purity").setValue(this.goldDetails.purity);
    this.getControl(0, 0, "goldSource").setValue(this.goldDetails.goldSource);
    this.getControl(0, 0, "goldVendor").setValue(this.goldDetails.vendorName);
    this.getControl(0, 0, "timestamp").setValue(this.goldDetails.transactionDate);
    this.getControl(0, 0, "transactionStatus").setValue(this.goldDetails.transactionStatus);
    this.getControl(0, 0, "transactionType").setValue(this.goldDetails.transactionType);


  }


}
