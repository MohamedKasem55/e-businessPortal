import {ControlBase, ControlOptions, ControlType} from "./control.model";

export class TextControl extends ControlBase<string> {
  override controlType = ControlType.TEXT;
  override controlOptions!: null;

  constructor(options: TextControlOptions) {
    super(options);
  }
}
export class TextControlOptions extends ControlOptions<string> {
  override controlOptions?: {
    prefixIcon?:string;
  }
}
