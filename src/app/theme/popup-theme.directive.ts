import { Directive, ElementRef, OnInit } from '@angular/core';
import { ThemeService } from './theme.service';
import { Theme } from './symbols';

@Directive({
  selector: '[popupTheme]'
})
export class PopupThemeDirective implements OnInit {
 
  constructor(
    private _elementRef: ElementRef,
    private _themeService: ThemeService
  ) {}

  ngOnInit() {
    const active = this._themeService.getActiveTheme();
    if (active) {
     this.updateTheme(active);
    }
  }

  updateTheme(theme: Theme) {
    for (const key in theme.properties) {
      this._elementRef.nativeElement.style.setProperty(key, theme.properties[key]);
    }

    for (const name of this._themeService.theme) {
      this._elementRef.nativeElement.classList.remove(`${name}-theme`);
    }

    this._elementRef.nativeElement.classList.add(`${theme.name}-theme`);
  }

}
