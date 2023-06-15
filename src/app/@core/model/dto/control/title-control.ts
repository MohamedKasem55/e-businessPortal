import {ControlBase, ControlOptions, ControlType} from "./control.model";
import {TitleModel} from "arb-design-library/model/title.model";


export class TitleControl extends ControlBase<null> {
  override controlType = ControlType.TITLE;
  override controlOptions!: TitleModel;

  constructor(options: TitleControlOptions) {
    super(options);
  }

}

export class TitleControlOptions extends ControlOptions<null> {
  override controlOptions!: TitleModel;
}
