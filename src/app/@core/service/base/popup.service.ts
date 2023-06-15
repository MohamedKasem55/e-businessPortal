import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {PopupInputModel, PopupOutputModel} from "../../model/dto/popup.model";

@Injectable()
export class PopupService {

  private showPopupSubject: Subject<PopupInputModel> = new Subject<PopupInputModel>();
  private onPopupDismissSubject: Subject<null> = new Subject<null>();
  private onPopupButtonClickSubject!: Subject<PopupOutputModel>;


  onDismiss(): Observable<null> {
    return this.onPopupDismissSubject.asObservable();
  }

  onShowPopupChange(): Observable<PopupInputModel> {
    return this.showPopupSubject.asObservable();
  }

  showPopup(data: PopupInputModel): Observable<PopupOutputModel> {
    this.onPopupButtonClickSubject = new Subject<PopupOutputModel>()
    this.showPopupSubject.next(data);
    return this.onPopupButtonClickSubject.asObservable();
  }

  onPopupButtonClick(data: PopupOutputModel) {
    this.onPopupButtonClickSubject.next(data);
  }

  dismiss() {
    this.onPopupDismissSubject.next(null);
  }

}
