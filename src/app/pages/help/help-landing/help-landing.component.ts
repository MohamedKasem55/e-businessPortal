import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BreadcrumbService} from 'app/@core/service/base/breadcrumb.service';
import {PreLoginService} from 'app/@core/service/conatct-us/pre-login.service';
import {BoxModel} from "arb-design-library/model/box.model";
import {BreadcrumbModel} from 'arb-design-library/model/breadcrumb.model';
import {TranslateService} from "@ngx-translate/core";
import {TitleModel} from 'arb-design-library/model/title.model';
import {HelpWizardService} from 'app/@core/service/base/help-wizard.service';

@Component({
  selector: 'app-help-landing',
  templateUrl: './help-landing.component.html'
})
export class HelpLandingComponent implements OnInit {
  boxes: BoxModel[] = [];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private service: PreLoginService,
    private router: Router,
    private translateService: TranslateService,
    private wizardService: HelpWizardService
  ) {
    this.boxes = this.getHelpBoxes();
    this.setBreadcrumb([
      {
        text: 'help.title',
        url: '/help',
      },
    ]);
  }

  ngOnInit(): void {
  }

  setBreadcrumb(breadcrumb: BreadcrumbModel[]) {
    this.breadcrumbService.setBreadcrumb(breadcrumb);
  }

  onBoxClick(boxId: string) {
    switch (boxId) {
      case "alrajhi-faq":
        this.service.getDocument((this.translateService.currentLang === "ar") ?
          'AlRajhi_Business_FAQ_V2.4_ar.pdf'
          : 'AlRajhi_Business_FAQ_V2.4_en.pdf');
        break;
      case "ask-alrajhi":
        this.router.navigate(["/help/ask-al-rajhi"]);
        break;
      case "tooltip":
        this.router.navigate(["/dashboard"]).then(() => {
          HelpWizardService.onHelpWizardStartedSubject.next(true);
        });
        break;
    }
  }

  title: TitleModel = {
    id: "help",
    type: "Page",
    "title": "help.title",
    endButtons: []
  }

  private getHelpBoxes(): BoxModel[] {
    return [
      {
        id: 'tooltip',
        text: 'help.tooltip',
        subTitle: 'help.tooltip-sub-text',
        icon: 'arb-icon-Ruler',
        isDisabled: false,
      },
      {
        id: 'alrajhi-faq',
        text: 'help.Faq-box-text',
        subTitle: 'help.Faq-subtitle-text',
        icon: 'arb-icon-userQuestionMark',
        isDisabled: false,
      },
      {
        id: 'ask-alrajhi',
        text: 'help.ask-alrajhi-box-text',
        subTitle: 'help.ask-alrajhi-subtitle-text',
        icon: 'arb-icon-userAlrajhi',
        isDisabled: false,
      },
    ];
  }

}
