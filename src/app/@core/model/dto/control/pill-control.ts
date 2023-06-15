import {ControlBase, ControlOptions, ControlType} from "./control.model";
import {PillModel} from "arb-design-library/model/pill.model";


export class PillControl extends ControlBase<null> {
  override controlType = ControlType.PILL;
  override controlOptions!: PillModel;

  constructor(options: PillControlOptions) {
    super(options);
  }

}

export class PillControlOptions extends ControlOptions<any> {
  override controlOptions!: PillModel
}
