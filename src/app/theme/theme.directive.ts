import {Directive, ElementRef, Injectable, Inject} from '@angular/core';
import {ACTIVE_THEME, Theme} from './symbols';

@Directive({
  selector: '[theme]'
})
@Injectable()
export class ThemeDirective {

  @Inject(ACTIVE_THEME) public _themeName!: string;

  constructor(
    private _elementRef: ElementRef,
  ) {
  }

  setThemeName(theme: string) {
    this._themeName = theme;
  }

  updateTheme(theme: Theme) {
    for (const key in theme.properties) {
      this._elementRef.nativeElement.style.setProperty(key, theme.properties[key]);
    }
    for (const name of this._themeName) {
      this._elementRef.nativeElement.classList.remove(`${name}-theme`);
    }
    this._elementRef.nativeElement.classList.add(`${theme.name}-theme`);
  }

}
