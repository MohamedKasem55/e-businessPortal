import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {ErrorBaseResponse} from "../../model/rest/common/base-response";

@Injectable({
  providedIn: 'root'
})
export class ErrorModalService {
  errorMessage: Subject<ErrorBaseResponse> = new Subject<ErrorBaseResponse>();

  constructor() {
  }

  setMessage(message: ErrorBaseResponse) {
    this.errorMessage.next(message)
  }

  onMessage(): Observable<ErrorBaseResponse> {
    return this.errorMessage.asObservable();
  }
}
