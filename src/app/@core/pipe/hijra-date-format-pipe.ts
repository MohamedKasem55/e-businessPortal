import {Injector, Pipe, PipeTransform} from '@angular/core'
import {LangChangeEvent, TranslateService} from '@ngx-translate/core'

// tslint:disable-next-line:no-var-requires
const moment = require('moment-hijri')

@Pipe({name: 'hijriDateFormat', pure: false})
export class HijriDateFormatPipe implements PipeTransform {
  transform(value: any, pattern: string): string | null {
    const hijri = moment(value)
    hijri.locale('en')
    pattern = pattern.toUpperCase()
    pattern = pattern.replace(/MM/g, 'iMM')
    pattern = pattern.replace(/DD/g, 'iDD')
    pattern = pattern.replace(/YYYY/g, 'iYYYY')
    return hijri.format(pattern)
  }

  constructor() {
  }
}
