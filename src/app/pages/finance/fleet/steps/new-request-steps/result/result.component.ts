import {Component, Input, OnInit} from '@angular/core';
import {PageModel} from 'app/@core/model/dto/formModel';
import {getResultsControl} from './result.component.controls';
import {ResultModal} from '../../../../../../@core/model/dto/result.modal';
import { FinanceBaseComponent } from '../../../../finance-base/finance-base.component';

@Component({
  selector: 'app-result',
  templateUrl: '../../../../finance-base/finance-base.component.html',
  styleUrls: []
})
export class ResultComponent extends FinanceBaseComponent
  implements OnInit {

  @Input() title?: string
  @Input() subTitle!: string
  @Input() type: string = 'Success'


  constructor() {
    super();
    this.drawPage();
    this.pageTitle.stepper!.stepCounter = 7;
    this.startButtons = [];
    this.nextButton = {
      id: "track",
      text: 'finance.fleet.requests.TrackMyApplicationStatus',
      type: "primary",
    };
    this.goToDashboardBtn = {
      id: "dashboard",
      text: 'finance.fleet.requests.GotoDashboard',
      type: "primary",
    };
    this.endButtons = [this.goToDashboardBtn, this.nextButton];
    this.result = this.fillSuccessResult();
  }

  override ngOnInit(): void {
  }

  drawPage() {
    this.pages.push(new PageModel(5, getResultsControl()));
  }

  fillSuccessResult(): ResultModal {
    return {
      type: 'Success',
      title: 'finance.fleet.requests.Success_App',
      subTitle: `${this.translate.instant('finance.fleet.requests.Success_App_subtitle')}
                  ${this.translate.instant('finance.fleet.requests.Dossier_ID')} ${sessionStorage.getItem("DOSSIER_ID")}
                  ${this.translate.instant('finance.fleet.requests.Date')} ${new Date().toISOString().split('T')[0]}
                  `,
      summary: this.summary,
    };
  }

  override onButtonClick(formButtonClickOutput: any) {
    if (formButtonClickOutput.buttonId === 'dashboard') {
      this.router.navigate(['/dashboard'])
    }
    if (formButtonClickOutput.buttonId === 'track') {
      this.router.navigate(['/finance'])
    }
  }

}
