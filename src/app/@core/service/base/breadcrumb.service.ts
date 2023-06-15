import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {BreadcrumbModel} from "arb-design-library/model/breadcrumb.model";

@Injectable()
export class BreadcrumbService {


  private onBreadcrumbChangedSubject: Subject<BreadcrumbModel[]> = new Subject<BreadcrumbModel[]>();

  setBreadcrumb(breadcrumbModel: BreadcrumbModel[]) {
    this.onBreadcrumbChangedSubject.next(breadcrumbModel);
  }

  onBreadcrumbChanged(): Observable<BreadcrumbModel[]> {
    return this.onBreadcrumbChangedSubject.asObservable();
  }

}
