import {ControlBase, ControlOptions, ControlType} from "./control.model";
import {StickyObject} from "arb-design-library/model/sticky-object.model";

export class DropdownControl extends ControlBase<any> {
  override controlType = ControlType.DROPDOWN;
  override controlOptions!: DropdownOptionsModel;

  constructor(options: DropdownControlOptions) {
    super(options);
  }
}


export class DropdownControlOptions extends ControlOptions<any> {
  override controlOptions!: DropdownOptionsModel
}

export interface DropdownOptionsModel {
  textField: string | string[];
  columnId: string;
  hasSearch?: boolean;
  options?: any[];
  imageField?: string;
  iconField?: string;
  endTextField?: string;
  endTextCurrencyField?: string;
  disabledField?: string;
  isCheckboxList?: boolean;
  stickyObject?: StickyObject;
  showSelectAll?:boolean
}


