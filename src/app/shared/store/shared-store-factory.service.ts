import { getUserInfo } from './shared.reducer';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { lastValueFrom, take } from 'rxjs';

@Injectable()
export class SharedStoreFactoryService {

  constructor(private store: Store) { }

  async getUserStoredInfo(): Promise<any> {
    return await lastValueFrom(
      this.store.select(getUserInfo).pipe(take(1))
    );
  }
}
