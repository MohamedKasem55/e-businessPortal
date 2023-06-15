import {ControlBase, ControlOptions, ControlType} from "./control.model";

export class RadioGroupControl extends ControlBase<string> {
  override controlType = ControlType.RADIO_GROUP;
  override controlOptions!: RadioGroupOptionsModel;

  constructor(options: RadioGroupControlOptions) {
    super(options);
  }
}

export class RadioGroupControlOptions extends ControlOptions<any> {
  override controlOptions!: RadioGroupOptionsModel
}

export class RadioGroupOptionsModel {
  options!: RadioGroupModel[];
  textOnStart?: boolean = true;
}

interface RadioGroupModel {
  id: string,
  title: string;
  subTitle?: string;
}
