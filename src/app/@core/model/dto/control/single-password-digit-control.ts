import {ControlBase, ControlType} from "./control.model";

export class SinglePasswordDigitControl extends ControlBase<string> {
  override controlType = ControlType.SINGLE_PASSWORD_DIGIT;
}
