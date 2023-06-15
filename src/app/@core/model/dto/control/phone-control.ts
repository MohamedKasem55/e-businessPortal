import {ControlBase, ControlOptions, ControlType} from "./control.model";

export class PhoneControl extends ControlBase<string> {
  override controlType = ControlType.PHONE;
  override controlOptions?: PhoneOptionsModel;

  constructor(options: PhoneControlOptions) {
    super(options);
  }
}

export class PhoneControlOptions extends ControlOptions<any> {
  override controlOptions?: PhoneOptionsModel = {phonePrefix: "966"};
}

interface PhoneOptionsModel {
  phonePrefix: string;
}
