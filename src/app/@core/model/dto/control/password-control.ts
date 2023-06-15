import {ControlBase, ControlOptions, ControlType} from "./control.model";

export class PasswordControl extends ControlBase<string> {
  override controlType = ControlType.PASSWORD;
  override controlOptions!: null;

  constructor(options: PasswordControlOptions) {
    super(options);
  }
}

export class PasswordControlOptions extends ControlOptions<string> {
  override controlOptions?: null
}
