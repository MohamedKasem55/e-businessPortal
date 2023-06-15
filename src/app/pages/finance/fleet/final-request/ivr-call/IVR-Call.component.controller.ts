import {PopupInputModel} from "../../../../../@core/model/dto/popup.model";
import {FormModel} from "../../../../../@core/model/dto/formModel";

export const IVRCallModel = (): PopupInputModel => {
  let form: FormModel = new FormModel()
  return {
    form: form
  }
}
