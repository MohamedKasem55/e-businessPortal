import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {KeyValue} from "@angular/common";

@Injectable()
export class SessionService {

  session: string = "";
  private onSessionChangedSubject: Subject<KeyValue<string, string>> = new Subject<KeyValue<string, string>>();

  setSession(key:string ,value: string) {
    this.session = value;
    sessionStorage.setItem(key, value);
    this.onSessionChangedSubject.next({key:key,value:value});
  }

  onSessionChanged(): Observable<KeyValue<string, string>> {
    return this.onSessionChangedSubject.asObservable();
  }
}
