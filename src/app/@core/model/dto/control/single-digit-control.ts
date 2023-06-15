import {ControlBase, ControlType} from "./control.model";

export class SingleDigitControl extends ControlBase<string> {
  override controlType = ControlType.SINGLE_DIGIT;
}
