import {ControlBase, ControlOptions, ControlType} from "./control.model";

export class NumberInputControl extends ControlBase<string> {
  override controlType = ControlType.NUMBER_INPUT;
  override controlOptions!: null;

  constructor(options: NumberInputControlOptions) {
    super(options);
  }
}

export interface NumberInputOptionsModel {
  maxlength?: number
}

export class NumberInputControlOptions extends ControlOptions<string> {
  override controlOptions?: NumberInputOptionsModel

}

