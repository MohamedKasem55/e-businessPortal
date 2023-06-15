import {Injectable, Pipe, PipeTransform} from '@angular/core';

@Injectable()
@Pipe({
  name: 'currency'
})
export class CurrencyPipe implements PipeTransform {

  currencyISO: any = null;

  constructor() {
  }


  transform(currency: string): string {
    if (!this.currencyISO) {
      this.currencyISO = JSON.parse(sessionStorage.getItem('currencyIso')!)
    }
    if (this.currencyISO) {
      if (this.currencyISO[currency]) {
        return this.currencyISO![currency];
      }
    }
    return currency;
  }
}
