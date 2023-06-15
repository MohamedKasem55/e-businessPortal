import {Inject, Injectable} from '@angular/core';
import {TranslateService, TranslationChangeEvent} from "@ngx-translate/core";
import {I18nService} from "arb-design-library";
import {DOCUMENT} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(private translate: TranslateService, private i18nService: I18nService,
              @Inject(DOCUMENT) private document: Document) {
  }


  changeLanguage(reload: boolean = false) {
    let lang = this.translate.currentLang === "en" ? "ar" : "en";
    this.translate.use(lang).subscribe(() => {
      if (!reload) {
        this.setLang(lang);
      } else {
        location.reload();
      }
    });
  }

  setLang(lang: string | null): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!lang) {
        lang = localStorage.getItem("lang") || "ar";
      } else {
        localStorage.setItem("lang", lang);
      }
      this.changeLang(lang!).then((value: any) => {
        return resolve(value);
      });
      this.translate.onLangChange.subscribe((language: TranslationChangeEvent) => {
        localStorage.setItem("lang", language.lang);
      });
    });
  }

  private changeLang(lang: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const htmlTag = this.document.getElementsByTagName("html")[0] as HTMLHtmlElement;
      if (lang === 'en') {
        htmlTag.dir = "ltr";
        htmlTag.lang = 'en';
        this.i18nService.setLang('en');
        this.translate.setDefaultLang('en');
        return resolve(this.translate.use('en').toPromise());
      } else {
        htmlTag.dir = "rtl";
        htmlTag.lang = "ar";
        this.i18nService.setLang('ar');
        this.translate.setDefaultLang('ar');
        return resolve(this.translate.use('ar').toPromise());
      }
    });
  }
}

