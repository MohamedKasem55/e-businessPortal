import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { POS } from 'app/@core/constants/pages-urls-constants';
import { ExternalAppTokenRes } from 'app/@core/model/rest/pos/external-app/external-app-token-res';
import { BreadcrumbService } from 'app/@core/service/base/breadcrumb.service';
import { POSService } from 'app/@core/service/pos/pos.service';
import { ButtonModel } from 'arb-design-library/model/button.model';

@Component({
  selector: 'app-pos-management',
  templateUrl: './pos-management.component.html',
  styleUrls: ['./pos-management.component.scss'],
})
export class PosManagementComponent implements OnInit {
  endButtons: ButtonModel[] = [
    {
      id: 'goToETrade',
      type: 'primary',
      text: 'pos.dashboard.boxes.pos-management.pos-management-portal',
    },
  ];

  constructor(
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private translate: TranslateService,
    private posService: POSService
  ) {
    this.breadcrumbService.setBreadcrumb([
      {
        text: 'pos.dashboard.title',
        url: `/${POS}`,
      },
      {
        text: this.translate.instant(
          'pos.dashboard.boxes.pos-management.pos-management'
        ),
        url: '',
      },
    ]);
  }

  ngOnInit(): void {}

  onTitleButtonClick(id: string) {
    switch (id) {
      case 'arrowTitle':
        this.router.navigateByUrl(`/${POS}`).then(() => {});
        break;
    }
  }

  goToLink() {
    this.posService.getToken('emcrey').subscribe((res: ExternalAppTokenRes) => {
      let lang = this.translate.currentLang;
      const url =
        res.redirectLink +
        res.token +
        '&lang=' +
        (lang === 'en' ? lang + '_US' : lang + '_SA');
      window.open(url, '_blank');
    });
  }
}
