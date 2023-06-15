import {Component} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ButtonModel} from "arb-design-library/model/button.model";
import {TranslateService} from "@ngx-translate/core";
import {PreLoginService} from "../../../@core/service/conatct-us/pre-login.service";
import {BoxModel} from "arb-design-library/model/box.model";
import {LanguageService} from "../../../@core/service/base/language.service";
import {ModelAndListService} from "../../../@core/service/base/modelAndList.service";
import {ThemeService} from 'app/theme';

@Component({
  selector: 'app-landing',
  templateUrl: './pre-login-landing.component.html',
  styleUrls: ['./pre-login-landing.component.scss'],
})
export class PreLoginLandingComponent {
  toggleMenu: boolean = true;

  boxes: BoxModel[] = [
    {
      isDisabled: false,
      id: 'softTokenGuide',
      text: 'login.sftk-guide',
      icon: 'arb-icon-tokensSmall',
    },
    {
      isDisabled: false,
      id: 'securityTokenUserGuide',
      text: 'login.sftk-sub-user-guide',
      icon: 'arb-icon-star',
    },
    {
      isDisabled: false,
      id: 'securityTokenAdminGuide',
      text: 'login.sftk-adm-guide',
      icon: 'arb-icon-insuranceSharp',
    },
  ];

  start: ButtonModel[] = [
    {
      type: 'secondary',
      id: 'back',
      text: 'public.close',
    },
  ];
  nextTheme: string;
  themeIcon: string;

  constructor(
    private modalService: NgbModal,
    private service: PreLoginService,
    private translateService: TranslateService,
    private modelAndListService: ModelAndListService,
    private themeService: ThemeService,
    private languageService: LanguageService
  ) {
    this.nextTheme = themeService.theme == "light" ? 'public.dark' : "public.light";
    this.themeIcon = themeService.theme != "light" ? 'arb-icon-Sun' : 'arb-icon-Moon';
  }

  openUserResources(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      size: 'xl',
    });
  }

  openImportantTips(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      modalDialogClass: 'modalHeader',
      centered: true,
      size: 'xl',
    });
  }

  toggleMenuEvent() {
    this.toggleMenu = !this.toggleMenu;
  }

  close() {
    this.modalService.dismissAll();
  }

  onBoxClick(id: string) {
    switch (id) {
      case 'softTokenGuide':
        this.service.getDocument(
          this.translateService.currentLang === 'ar'
            ? 'New_Soft_token_user_guide_Arabic.pdf'
            : 'New_Soft_token_user_guide_English.pdf'
        );
        break;
      case 'securityTokenUserGuide':
        this.service.getDocument(
          this.translateService.currentLang === 'ar'
            ? 'Token_eCorporate_-_Company_User_Manual_v1.3-Arabic.pdf'
            : 'Token_eCorporate_-_Company_User_Manual_v1.3-English.pdf'
        );
        break;
      case 'securityTokenAdminGuide':
        this.service.getDocument(
          this.translateService.currentLang === 'ar'
            ? 'Token_eCorporate_-_Company_Administrator_Manual_v1.2-Arabic.pdf'
            : 'Token_eCorporate_-_Company_Administrator_Manual_v1.2-English.pdf'
        );
        break;
    }
  }

  changeLanguage() {
    this.modelAndListService.deleteSavedModels();
    this.languageService.changeLanguage();
  }

  toggleTheme() {
    let activeTheme = this.themeService.getActiveTheme();
    if (activeTheme?.name === 'light') {
      this.themeService.setTheme('dark');
    } else {
      this.themeService.setTheme('light');
    }
    this.nextTheme = this.themeService.theme == "light" ? 'public.dark' : "public.light";
    this.themeIcon = this.themeService.theme != "light" ? 'arb-icon-Sun' : 'arb-icon-Moon';
  }
}
