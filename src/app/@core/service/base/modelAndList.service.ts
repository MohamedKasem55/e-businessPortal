import {Injectable} from '@angular/core'
import {AbstractBaseService} from "./abstract-base.service";
import {Constants} from "./base-urls";
import {Observable, Subscriber} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ModelAndListService extends AbstractBaseService {


  getList(names: string[]): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      let newList: string[] = [];
      names.forEach(item => {
        if (sessionStorage.getItem(item) == 'undefined' || sessionStorage.getItem(item) == null) {
          newList.push(item);
        }
      });

      if (newList.length > 0) {
        this.getListService(newList).subscribe(() => {
          observer.next(this.getListFromSession(names));
        });
      } else {
        observer.next(this.getListFromSession(names));
      }
    });
  }

  getModel(name: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {

      if (sessionStorage.getItem(name) == 'undefined' || sessionStorage.getItem(name) == null) {
        this.getModelService(name).subscribe(() => {
          observer.next(this.getListFromSession([name]));
        });
      } else {
        observer.next(this.getListFromSession([name]));
      }
    });
  }

  private getListFromSession(names: string[]) {
    let data: any = {};
    names.forEach(item => {
      data[item.toString()] = JSON.parse(sessionStorage.getItem(item)!);
    });
    return data;
  }

  private getListService(names: string[]): Observable<void> {
    return new Observable((observer: Subscriber<any>) => {
      this.post(Constants.STATIC_LIST, {names}, {hideLoader: true}).subscribe(
        {
          next: (response) => {
            response.forEach((element: any) => {
              this.addToSave(element.name);
              sessionStorage.setItem(element.name, JSON.stringify(element.props));
            });
            observer.next();
          }
        });
    });
  }

  private getModelService(name: string): Observable<void> {
    return new Observable((observer: Subscriber<any>) => {
      this.post(Constants.STATIC_MODEL, {name}, {hideLoader: true}).subscribe(
        {
          next: (response) => {
            this.addToSave(response.name);
            sessionStorage.setItem(response.name, JSON.stringify(response.props));
            observer.next();
          }
        });
    });
  }

  private addToSave(name: string) {
    let saved = [];
    if (sessionStorage.getItem("SAVED_MODELS")) {
      saved = JSON.parse(sessionStorage.getItem("SAVED_MODELS")!);
    }
    saved.push(name);
    sessionStorage.setItem("SAVED_MODELS", JSON.stringify(saved));
  }

  public deleteSavedModels() {
    let saved = [];
    if (sessionStorage.getItem("SAVED_MODELS")) {
      saved = JSON.parse(sessionStorage.getItem("SAVED_MODELS")!);
    }
    saved.forEach((item: string) => {
      if (!(item == 'currencyIso' || item == 'currencyDecimals' || item == 'currencyType')) {
        sessionStorage.removeItem(item);
      }
    });
  }
}

