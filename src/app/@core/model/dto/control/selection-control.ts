import {ControlBase, ControlOptions, ControlType} from "./control.model";
import {SelectionTitleModel} from "arb-design-library/model/selection-title.model";

export class SelectionControl extends ControlBase<boolean> {
  override controlType = ControlType.SELECTION;
  override controlOptions!: SelectionOptions;

  constructor(options: SelectionControlOptions) {
    super(options);
  }
}

export class SelectionControlOptions extends ControlOptions<any> {
  override controlOptions!: SelectionOptions
}

class SelectionOptions {
  value?: boolean = false;
  type?: "checkbox" | "toggle" = "checkbox";
  title: SelectionTitleModel[] | string = [];
  subTitle?: string = "";
  textOnStart?: boolean = true;
}
