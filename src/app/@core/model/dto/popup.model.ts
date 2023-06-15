import {FormControlModel, FormModel} from "./formModel";
import {ControlBase} from "./control/control.model";
import {NgbModalOptions} from "@ng-bootstrap/ng-bootstrap/modal/modal-config";
import {AlertModel} from "./alert.model";
import {TableButtonOutputModel} from "arb-design-library/model/table-button-output.model";

export interface PopupOutputModel {
  buttonId: string;
  controls: FormControlModel<ControlBase<any>>;
  tableButtonOutputModel?: TableButtonOutputModel;
}

export interface PopupInputModel {
  title?: string,
  alert?: AlertModel,
  showAlert?: boolean,
  image?: string
  form?: FormModel,
  options?: NgbModalOptions,
}

