import {Injectable, Inject} from '@angular/core';
import {THEMES, Theme} from './symbols';
import {ThemeDirective} from 'app/theme/theme.directive';
import {ServiceLocator} from "app/@core/service/base/service-locator.service";
import {Subject} from "rxjs";

@Injectable()
export class ThemeService {

  themeDirecrive: ThemeDirective;
  theme: string = 'light';

  public static onThemeChanged: Subject<boolean> = new Subject<boolean>();

  constructor(
    @Inject(THEMES) public themes: Theme[],
  ) {
    this.setCurrentThem();
    this.themeDirecrive = ServiceLocator.injector.get(ThemeDirective);
    this.themeDirecrive.setThemeName(this.theme)
  }

  getTheme(name: string) {
    const theme = this.themes.find(t => t.name === name);
    if (!theme) {
      throw new Error(`Theme not found: '${name}'`);
    }
    return theme;
  }

  setCurrentThem() {
    this.theme = localStorage.getItem("ARB_THEME") || 'light';
  }

  getActiveTheme() {
    this.setCurrentThem();
    return this.getTheme(this.theme);
  }

  getProperty(propName: string) {
    return this.getActiveTheme().properties[propName];
  }

  initiatTheme() {
    this.themeDirecrive.updateTheme(this.getActiveTheme())
  }

  setTheme(name: string) {
    this.theme = name;
    localStorage.setItem("ARB_THEME", name);
    this.themeDirecrive.updateTheme(this.getActiveTheme())
    ThemeService.onThemeChanged.next(true);
  }

}
