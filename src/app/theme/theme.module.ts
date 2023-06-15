import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeService } from './theme.service';
import { ThemeDirective } from './theme.directive';
import { THEMES, ACTIVE_THEME, ThemeOptions } from './symbols';
import { PopupThemeDirective } from './popup-theme.directive';

@NgModule({
  imports: [CommonModule],
  providers: [ThemeService, ThemeDirective],
  declarations: [ThemeDirective, PopupThemeDirective],
  exports: [ThemeDirective, PopupThemeDirective]
})
export class ThemeModule {
  static forRoot(options: ThemeOptions): ModuleWithProviders<any> {
    return {
      ngModule: ThemeModule,
      providers: [
        {
          provide: THEMES,
          useValue: options.themes
        },
        {
          provide: ACTIVE_THEME,
          useValue: options.active
        }
      ]
    };
  }
}
