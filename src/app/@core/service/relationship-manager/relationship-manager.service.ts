import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractBaseService } from '../base/abstract-base.service';

@Injectable()
export class RelationshipManagerService extends AbstractBaseService {

  getRelationShipManagerDetails(): Observable<any> {
    return this.get('relationshipManager/get',{silentError:true});
  }
}
