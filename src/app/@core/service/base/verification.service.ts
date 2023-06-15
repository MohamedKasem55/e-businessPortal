import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {GenerateChallengeAndOTP, RequestValidate} from "../../model/rest/common/otp.model";

@Injectable()
export class VerificationService {

  private onVerificationDisplayChange: Subject<GenerateChallengeAndOTP> = new Subject<GenerateChallengeAndOTP>();
  private onVerificationCompleted!: Subject<RequestValidate>;
  private onVerificationDismiss: Subject<null> = new Subject<null>();
  //To listen on recall & received
  private onEventTrigger: Subject<any> = new Subject<any>();
  private onCloseVerification: Subject<null> = new Subject<null>();

  onVerificationChangeDisplay(): Observable<GenerateChallengeAndOTP> {
    return this.onVerificationDisplayChange.asObservable();
  }

  onDismiss(): Observable<any> {
    return this.onVerificationDismiss.asObservable();
  }

  showVerification(data: GenerateChallengeAndOTP): Observable<RequestValidate> {
      
    this.onVerificationCompleted = new Subject<RequestValidate>()
    this.onVerificationDisplayChange.next(data);
    return this.onVerificationCompleted.asObservable();
  }

  setVerification(data: RequestValidate) {
    this.onVerificationCompleted.next(data);
  }

  setDismiss() {
    this.onVerificationDismiss.next(null);
  }
  /**
   * return recall || received
   * */
  setEvent(type: any) {
    this.onEventTrigger.next(type);
  }

  onEventTriggered(): Observable<any> {
    return this.onEventTrigger.asObservable();
  }

  setCloseVerification() {
    this.onCloseVerification.next(null);
  }

  closeVerification(): Observable<null> {
    return this.onCloseVerification.asObservable();
  }
}
