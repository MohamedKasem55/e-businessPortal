import {NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";

export interface Modal {
  component:any,
  modalName: string,
  modalOptions: NgbModalOptions
}
