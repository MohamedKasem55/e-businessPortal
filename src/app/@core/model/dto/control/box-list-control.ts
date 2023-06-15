import { BoxModel } from "arb-design-library/model/box.model";
import {ControlBase, ControlOptions, ControlType} from "./control.model";

export class BoxListControl extends ControlBase<string> {
    override controlType = ControlType.BOX_LIST;
    override controlOptions!: BoxSelectOptions;

  constructor(options: BoxListControlOptions) {
    super(options);
  }
}

export class BoxSelectOptions {
    id!: string;
    box!: BoxModel[];
    columnCount?: number = 3;
    action: 'onSelect' | 'onHover' = 'onSelect';
}

export class BoxListControlOptions extends ControlOptions<any> {
  override controlOptions!: BoxSelectOptions
}
