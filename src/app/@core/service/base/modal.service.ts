import {Injectable} from '@angular/core';
import {Modal} from "../../model/dto/modal";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private componentsSubject: Subject<Modal> = new Subject<Modal>();

  addModal(modalData: Modal) {
    this.componentsSubject.next(modalData);
  }

  onModalAdding(){
    return this.componentsSubject.asObservable()
  }

}
