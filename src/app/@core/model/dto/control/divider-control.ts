import {ControlBase, ControlOptions, ControlType} from "./control.model";

export class DividerControl extends ControlBase<null> {
  override controlType = ControlType.DIVIDER;
  override controlOptions!: null;

  constructor(options: DividerControlOptions) {
    super(options);
  }
}

export class DividerControlOptions extends ControlOptions<null> {
    override controlOptions?: null
  }
  