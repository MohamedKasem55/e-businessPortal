import {ControlBase, ControlOptions, ControlType} from "./control.model";

export class AmountControl extends ControlBase<string> {
  override controlType = ControlType.AMOUNT;
  override controlOptions!: AmountControlOptions;

  constructor(options: AmountControlOptions) {
    super(options);
  }
}

interface AmountOptionsModel {
  currency: string;
}

export class AmountControlOptions extends ControlOptions<any> {
  override controlOptions?: AmountOptionsModel = {currency: "608"}
}
