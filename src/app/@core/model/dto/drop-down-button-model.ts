import {ButtonModel} from "arb-design-library/model/button.model";

export interface DropDownButtonModel extends ButtonModel {
  options: { disabled?: boolean, text: string, id: string }[];
}
