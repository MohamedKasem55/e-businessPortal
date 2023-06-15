import {Injectable, Injector, Pipe, PipeTransform} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
@Injectable()
@Pipe({ name: 'statusPipe'})
export class StatusPipe implements PipeTransform {
  constructor(private injector: Injector) {}

  transform(value: string): any {
    if (value === 'I') {
      return this.injector.get(TranslateService).instant('status.initiate')
    } else if (value === 'P') {
      return this.injector.get(TranslateService).instant('status.pending')
    } else if (value === 'A') {
      return this.injector.get(TranslateService).instant('status.approve')
    } else if (value === 'R') {
      return this.injector.get(TranslateService).instant('status.rejected')
    } else if (value === '1') {
      return this.injector.get(TranslateService).instant('status.newShipment')
    } else if (value === 'S') {
      return this.injector.get(TranslateService).instant('status.send')
    }

    return value
  }
}
