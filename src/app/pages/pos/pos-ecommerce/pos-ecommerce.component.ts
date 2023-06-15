import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  POS,
  POS_ANLYTIC,
  POS_ECOM_TERMINALS_LIST,
  POS_ECOM_TERMINAL_STATEMENT,
  POS_USR_APPV,
} from 'app/@core/constants/pages-urls-constants';
import { BreadcrumbService } from 'app/@core/service/base/breadcrumb.service';
import { ServiceLocator } from 'app/@core/service/base/service-locator.service';
import { BoxModel } from 'arb-design-library/model/box.model';
import { BreadcrumbModel } from 'arb-design-library/model/breadcrumb.model';
import { TitleModel } from 'arb-design-library/model/title.model';

@Component({
  selector: 'app-pos-ecommerce',
  templateUrl: './pos-ecommerce.component.html',
})
export class PosEcommerceComponent implements OnInit {
  boxes!: BoxModel[];

  boxesIDs = {
    terminalsList: 'terminals-list',
    terminalStatement: 'terminal-statement',
  };

  endButtonsIDs = {
    userApproval: 'user-approval',
    analytics: 'analytics',
  };

  title: TitleModel = {
    id: 'pos-ecommerce-title',
    type: 'Page',
    title: 'pos.e-commerce.title',
    endButtons: [
      {
        id: this.endButtonsIDs.analytics,
        type: 'secondary',
        text: 'pos.dashboard.analytics.title',
      },
      {
        id: this.endButtonsIDs.userApproval,
        type: 'secondary',
        text: 'pos.dashboard.user-approval',
      },
    ],
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService
  ) {
    this.breadcrumbService = ServiceLocator.injector.get(BreadcrumbService);
    this.setBreadcrumb([
      {
        text: 'pos.dashboard.title',
        url: `/${POS}`,
      },
    ]);
    this.boxes = this.getPOSEcommerceBoxes();
  }

  getPOSEcommerceBoxes(): BoxModel[] {
    return [
      {
        id: this.boxesIDs.terminalsList,
        text: 'pos.e-commerce.list-of-terminals.title',
        subTitle: '',
        icon: 'arb-icon-List',
        isDisabled: false,
      },
      {
        id: this.boxesIDs.terminalStatement,
        text: 'pos.e-commerce.terminal-statement.title',
        subTitle: '',
        icon: 'arb-icon-document',
        isDisabled: false,
      },
    ];
  }

  setBreadcrumb(breadcrumb: BreadcrumbModel[]) {
    this.breadcrumbService.setBreadcrumb(breadcrumb);
  }

  ngOnInit(): void {}

  onTitleButtonClick(id: string) {
    switch (id) {
      case 'arrowTitle':
        this.router.navigateByUrl('/pos').then(() => {});
        break;
    }
  }

  onButtonClick(key: string) {
    switch (key) {
      case this.endButtonsIDs.analytics:
        this.router.navigate([POS_ANLYTIC], { relativeTo: this.route });
        break;
      case this.endButtonsIDs.userApproval:
        this.router.navigate([POS_USR_APPV], { relativeTo: this.route });
        break;
    }
  }

  onBoxSelect(key: string) {
    this.router.navigateByUrl('/pos/e-commerce/' + key).then(() => {});
  }
}
