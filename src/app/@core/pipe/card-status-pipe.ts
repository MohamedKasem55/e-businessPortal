import { Injectable, Injector, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Injectable()
@Pipe({ name: 'cardStatusPipe' })
export class CardStatusPipe implements PipeTransform {
  constructor(private injector: Injector) {}

  transform(value: string): any {
    if (value === '1') {
      return this.injector
        .get(TranslateService)
        .instant('cards.cards-status.closed');
    } else if (value === '2' || value === 'AT'  || value === 'S') {
      return this.injector
        .get(TranslateService)
        .instant('cards.cards-status.active');
    } else if (value === '3') {
      return this.injector
        .get(TranslateService)
        .instant('cards.cards-status.inActive');
    } else if (value === '4') {
      return this.injector
        .get(TranslateService)
        .instant('cards.cards-status.closed-by-bank');
    } else if (value === '5') {
      return this.injector
        .get(TranslateService)
        .instant('cards.cards-status.closed-by-customer');
    } else if (value === 'AC') {
      return this.injector
        .get(TranslateService)
        .instant('cards.cards-status.renewed');
    } else if (value === 'EX') {
      return this.injector
        .get(TranslateService)
        .instant('cards.cards-status.expiring');
    } else if (value === 'SO') {
      return this.injector
        .get(TranslateService)
        .instant('cards.cards-status.blocked');
    } else if (value === 'RP') {
      return this.injector
        .get(TranslateService)
        .instant('cards.cards-status.replaced');
    } else if (value === 'NP') {
      return this.injector
        .get(TranslateService)
        .instant('cards.cards-status.issued');
    }
    else return ''

    return value;
  }
}
