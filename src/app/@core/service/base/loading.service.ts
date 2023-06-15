import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loadingArray: string[] = [];
  private showLoadingSubject: Subject<boolean> = new Subject<boolean>();

  showLoading(url: string): void {
    this.loadingArray.push(url);
    this.showLoadingSubject.next(true);
  }

  hideLoading(url: string): void {
    let itemIndex = -1;
    this.loadingArray.forEach((item: string, index: number) => {
      if (item == url) {
        itemIndex = index;
      }
    });
    if (itemIndex > -1) {
      this.loadingArray.splice(itemIndex, 1);
    }
    if (this.loadingArray.length == 0) {
      this.showLoadingSubject.next(false);
    }
  }

  onShowLoadingChange(): Observable<boolean> {
    return this.showLoadingSubject.asObservable();
  }

}
