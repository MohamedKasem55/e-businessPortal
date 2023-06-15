import { FormModel } from "app/@core/model/dto/formModel"
import { PopupInputModel } from "app/@core/model/dto/popup.model"


export const IVRCallModel = (): PopupInputModel => {
  let form: FormModel = new FormModel({
    id: 'IVRCallModel',
    controls: {


    }
  })
  return {
    form: form
  }
}
