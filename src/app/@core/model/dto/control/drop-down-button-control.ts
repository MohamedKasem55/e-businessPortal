import {ControlBase, ControlOptions, ControlType} from "./control.model";
import {DropDownButtonModel} from "../drop-down-button-model";

export class DropDownButtonControl extends ControlBase<string> {
  override controlType = ControlType.DROP_DOWN_BUTTON;
  override controlOptions!: DropDownButtonModel;

  constructor(options:  DropDownButtonControlOptions) {
    super(options);
  }
}

export class  DropDownButtonControlOptions extends ControlOptions<any> {
  override controlOptions?: DropDownButtonModel
}
