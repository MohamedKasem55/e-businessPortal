import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core'
import {POS_SERVICES_DETAILS} from 'app/@core/constants/pages-urls-constants';
import {BreadcrumbService} from 'app/@core/service/base/breadcrumb.service';
import {POSService} from 'app/@core/service/pos/pos.service';
import {ButtonModel} from 'arb-design-library/model/button.model';
import {LineCardModel} from "arb-design-library/model/line-card.model";
import { TitleModel } from 'arb-design-library/model/title.model';

@Component({
  selector: 'app-pos-request',
  templateUrl: './pos-request.component.html',
  styleUrls: [],
})
export class PosRequestComponent implements OnInit {

  button: ButtonModel = {id: '1', type: 'outLine', text: this.translate.instant('pos.maintenance.select')};
  terminalsList!: LineCardModel[];
  searchValue: string = '';
  filteredTerminals: LineCardModel[] | undefined = undefined;
  interval: any;
  title: TitleModel = {
    id: 'pos-maintenance-title1',
    title: 'pos.maintenance.services-request',
    subTitle: 'pos.maintenance.terminal-subtitle',
    showArrow: true,
  };


  constructor(
    private posService: POSService,
    private router: Router,
    private translate: TranslateService,
    private breadcrumbService: BreadcrumbService,
  ) {

    this.breadcrumbService.setBreadcrumb([
      {
        text: 'pos.dashboard.title',
        url: '/pos'
      },
      {
        text: 'pos.maintenance.terminals',
        url: ''
      },
    ]);

    this.posService.searchTerminals().subscribe({
      next: (value) => {
        this.terminalsList = [];
        value.terminals.forEach((item, index) => {
          this.terminalsList.push({
            id: item,
            hasBackground: true,
            title: "POS (" + (index + 1) + ")",
            icon: "arb-icon-posSetting",
            subTitle: item,
            button: this.button
          });
        });
        this.setFilteredTerminals(this.terminalsList);
      }, error: () => {
        this.filteredTerminals = [];
      }
    });
  }

  ngOnInit(): void {

  }

  onSelected(terminal: string) {
    if (terminal === '1') return;
    clearInterval(this.interval);
    this.router.navigate([`pos/${POS_SERVICES_DETAILS}`], {state: {selectedTerminal: terminal}})
  }


  onSearchDataChanged(value: string) {
    clearInterval(this.interval);
    this.searchValue = value;
    this.setFilteredTerminals(this.terminalsList.filter((item: LineCardModel) => item.subTitle!.includes(this.searchValue)));
  }


  setFilteredTerminals(lineCards: LineCardModel[]) {
    this.filteredTerminals = [];
    let index = -1;
    this.interval = setInterval(() => {
      index++;
      let lastIndex = (index + 1) * 100;
      if (lineCards.length < lastIndex) {
        lastIndex = lineCards.length;
        clearInterval(this.interval);
      }
      this.filteredTerminals!.push(...lineCards.slice(index * 10, lastIndex));
    }, 500);

  }

  onButtonClick(key: string) {
    switch (key) {
      case 'arrowTitle':
        this.router.navigate(["pos"]);
        break;
    }
  }
}
