import {ControlBase, ControlOptions, ControlType} from "./control.model";

export class PinInputControl extends ControlBase<string> {
  override controlType = ControlType.PIN_INPUT;
  override controlOptions!: null;

  constructor(options: EmptyControlOptions) {
    super(options);
  }
}

export class EmptyControlOptions extends ControlOptions<string> {
  override controlOptions?: null
}


