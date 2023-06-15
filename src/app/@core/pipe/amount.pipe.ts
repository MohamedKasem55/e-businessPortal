import {Injectable, Pipe, PipeTransform} from '@angular/core';

@Injectable()
@Pipe({
  name: 'currency'
})
export class AmountPipe implements PipeTransform {

  currencyDecimals: any = null;

  constructor(
  ) {
  }


  transform(amount: string, type: 'A' | 'F' = 'A', currency: string): string {
    if (!this.currencyDecimals) {
      this.currencyDecimals =  JSON.parse(sessionStorage.getItem('currencyDecimals')!);
    }
    if (!this.isNumeric(amount)) {
      if (type === 'F') {
        return '';
      }
      return amount;
    }
    return type === 'A' ? this.getAmount(amount) : this.getFraction(amount, currency);
  }


  getFraction(amount: string, currency: string): string {
    let decimals: string = "2";
    if (this.currencyDecimals[currency]) {
      decimals = this.currencyDecimals[currency];
    }
    amount = parseFloat(amount).toFixed(parseInt(decimals));
    try {
      return amount.toString().split('.')[1] !== undefined ? '.' + amount.split('.')[1] :
        '.' + (0).toFixed(parseInt(decimals)).toString().split('.')[1]
    } catch (e) {
      return '';
    }
  }

  getAmount(text: string): string {
    try {
      if (text.toString().includes('.'))
        return parseInt(text.toString().split('.')[0]).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
      else
        return parseInt(text).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    } catch (e) {
      return '';
    }
  }

  isNumeric(value: string) {
    return /^-?[0-9]+(?:\.[0-9]+)?$/.test(value);
  }

}
