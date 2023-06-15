import { Component, OnInit } from '@angular/core';
import { TitleModel } from 'arb-design-library/model/title.model';
import { TabModel } from 'arb-design-library/model/tab.model';
import { RequestService } from '../../../../@core/service/finance/request/request.service';
import { Router } from '@angular/router';
import { PosService } from '../../../../@core/service/finance/pos/pos.service';
import { AlertModel } from 'app/@core/model/dto/alert.model';
import { ContractList } from '../../../../@core/model/rest/finance/request/contract-list';

@Component({
  selector: 'app-finance-landing',
  templateUrl: './finance-landing.component.html',
  styleUrls: []
})
export class FinanceLandingComponent implements OnInit {
  currentActiveTab: string = "1";
  financeData: any[] = []
  test: any;
  alert: AlertModel | null = null;

  pageTitle: TitleModel = {
    id: 'financeTitle',
    type: 'Page',
    title: 'Finance',
    endButtons: [{id: 'newFinanceReqBtn', type: 'primary', text: `finance.products.newFinanceRequest`},
    ],
  };
  tabs: TabModel[] = [
    {text: 'finance.currentFinance', value: "1", icon: ""},
    {text: 'finance.requestedFinance', value: "2", icon: ""}];

  isUserHaveInProgressAccount: boolean = false;

  constructor(
    private requestService: RequestService,
    private router: Router,
    private posService: PosService,
  ) { }

  ngOnInit(): void {
    this.getContractList();
    this.getPendingContractList();
  }

  getContractList() {
    let data:{category:string} = {
      category: 'ONGOING'
    }
    this.requestService.getContractList(data).subscribe((result:ContractList) => {
        if (result !== null && result.contractItems) {
            result.contractItems.forEach((element) => {
                element['currency'] = 'SAR'
                this.financeData.push(element)
            })
            if (this.financeData.length > 0) {
            }
        }
    })
}

  onButtonClick(event: string) {
    if (event == 'newFinanceReqBtn') {
      if (this.isUserHaveInProgressAccount == false) {
        this.router.navigate(['/finance/request/select-product'])
      }

      return;
    }
  }


  tabChanged(event: string) {
    this.currentActiveTab = event;
  }

  getPendingContractList() {
    this.posService.getContractList('PENDING').subscribe((result) => {
      if (result !== null && result.contractItems) {
        result.contractItems.forEach((element: any) => {
          if (element?.dossierStatus === 'PEN') {
            this.isUserHaveInProgressAccount = true;
          }
        });
      }
    })

  }


}
