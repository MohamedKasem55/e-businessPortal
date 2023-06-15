import {ControlBase, ControlOptions, ControlType} from "./control.model";

export class TextInputControl extends ControlBase<string> {
   override controlType = ControlType.TEXT_INPUT;
  override controlOptions!: null;
  constructor(options: TextInputControlOptions) {
    super(options);
  }
}

export class TextInputControlOptions extends ControlOptions<string> {
  override controlOptions?: null
}
