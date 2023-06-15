import {ControlBase, ControlOptions, ControlType} from "./control.model";
import {ButtonModel} from "arb-design-library/model/button.model";

export class ButtonControl extends ControlBase<string> {
  override controlType = ControlType.BUTTON;
  override controlOptions!: ButtonModel;

  constructor(options: ButtonControlOptions) {
    super(options);
  }
}

export class ButtonControlOptions extends ControlOptions<any> {
  override controlOptions?: ButtonModel
}
