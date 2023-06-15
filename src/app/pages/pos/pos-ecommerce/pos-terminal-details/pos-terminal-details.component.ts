import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { POS_ECOM_TERMINALS_LIST } from 'app/@core/constants/pages-urls-constants';
import { TerminalItem } from 'app/@core/model/rest/pos/e-commerce/terminals-list-res';
import { BreadcrumbService } from 'app/@core/service/base/breadcrumb.service';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { SummaryItemModel } from 'arb-design-library/model/summary-item.model';
import { SummarySectionModel } from 'arb-design-library/model/summary-section.model';

@Component({
  selector: 'app-pos-terminal-details',
  templateUrl: './pos-terminal-details.component.html',
})
export class PosTerminalDetailsComponent implements OnInit {
  @Input() terminals: Array<any> = [];

  terminalSummarySection: SummarySectionModel = {};
  summaryList: SummaryItemModel[] = [];
  summaryData: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService
  ) {
    this.breadcrumbService.setBreadcrumb([
      {
        text: 'pos.dashboard.title',
        url: '/pos',
      },
      {
        text: 'pos.e-commerce.title',
        url: '/pos/e-commerce',
      },
      {
        text: 'pos.e-commerce.list-of-terminals.details.title',
        url: '',
      },
    ]);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((proms) => {
      this.summaryData = proms;
    });
    this.terminalSummary();
    console.log(this.summaryData);
  }

  private terminalSummary() {
    this.summaryList.push({
      title: 'pos.e-commerce.list-of-terminals.details.summary.terminal-id',
      subTitle: this.summaryData.terminalId,
    });
    this.summaryList.push({
      title: 'pos.e-commerce.list-of-terminals.details.summary.region',
      subTitle: this.summaryData.region,
    });
    this.summaryList.push({
      title: 'pos.e-commerce.list-of-terminals.details.summary.account',
      subTitle: this.summaryData.account,
    });
    this.summaryList.push({
      title: 'pos.e-commerce.list-of-terminals.details.summary.terminal-name',
      subTitle: this.summaryData.terminalName,
    });
    this.summaryList.push({
      title: 'pos.e-commerce.list-of-terminals.details.summary.city',
      subTitle: this.summaryData.city,
    });
    this.summaryList.push({
      title: 'pos.e-commerce.list-of-terminals.details.summary.location',
      subTitle: this.summaryData.location,
    });
    this.summaryList.push({
      title: 'pos.e-commerce.list-of-terminals.details.summary.phone',
      subTitle: this.summaryData.phone,
    });
    this.summaryList.push({
      title: 'pos.e-commerce.list-of-terminals.details.summary.mobile-number',
      subTitle: this.summaryData.mobileNumber,
    });
    this.summaryList.push({
      title: 'pos.e-commerce.list-of-terminals.details.summary.fax-number',
      subTitle: this.summaryData.fax,
    });
    this.summaryList.push({
      title: 'pos.e-commerce.list-of-terminals.details.summary.email',
      subTitle: this.summaryData.email,
    });
    this.summaryList.push({
      title: 'pos.e-commerce.list-of-terminals.details.summary.po-box',
      subTitle: this.summaryData.poBox,
    });
    this.summaryList.push({
      title: 'pos.e-commerce.list-of-terminals.details.summary.zip-code',
      subTitle: this.summaryData.zipCode,
    });

    this.terminalSummarySection.items = this.summaryList;

    const terminalItem: TerminalItem = {
      terminalId: this.summaryData.terminalId,
      name: this.summaryData.terminalName,
      account: this.summaryData.account,
      region: this.summaryData.region,
      location: this.summaryData.location,
      city: this.summaryData.city,
      mobile: this.summaryData.mobileNumber,
      telephone: this.summaryData.phone,
      fax: this.summaryData.fax,
      email: this.summaryData.email,
      pobox: this.summaryData.poBox,
      zipCode: this.summaryData.zipCode,
    };
  }

  onTitleButtonClick(_id?: string) {
    this.router.navigateByUrl('/pos/'+POS_ECOM_TERMINALS_LIST).then(() => {});
  }

  backButton: ButtonModel = {
    id: 'back',
    type: 'primary',
    text: 'public.back',
  };
}
