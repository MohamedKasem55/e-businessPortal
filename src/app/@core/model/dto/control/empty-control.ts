import {ControlBase, ControlOptions, ControlType} from "./control.model";

export class EmptyControl extends ControlBase<null> {
  override controlType = ControlType.EMPTY;
  override controlOptions!: null;

  constructor(options: EmptyControlOptions) {
    super(options);
  }
}

export class EmptyControlOptions extends ControlOptions<null> {
  override controlOptions?: null
}

