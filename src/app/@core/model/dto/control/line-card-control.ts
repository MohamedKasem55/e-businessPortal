import {ButtonModel} from "arb-design-library/model/button.model";
import {PillModel} from "arb-design-library/model/pill.model";
import {ControlBase, ControlOptions, ControlType} from "./control.model";
import {AvatarModel} from "arb-design-library/model/avatar.model";
import { EventEmitter } from "@angular/core";

export class LineCardControl extends ControlBase<string> {
  override controlType = ControlType.LINE_CARD;
  override controlOptions!: LineCardOptions;


  constructor(options: LineCardControlOptions) {
    super(options);
  }
}

export class LineCardControlOptions extends ControlOptions<any> {
  override controlOptions!: LineCardOptions
}

class LineCardOptions {
  title!: string;
  subTitle?: string;
  icon?: string;
  rightIcon?: string;
  badge?: number;
  hasBackground?: boolean = false;
  button?: ButtonModel;
  amount?: string;
  currency?: string;
  amountPosition?: 'left' | 'right' = 'right';
  rightTitle?: string;
  rightSubTitle?: string;
  card?: string;
  pill?: PillModel;
  avatar?: AvatarModel;
  weight?: 'Bold' | 'Regular' = 'Regular';
  divider?: boolean;
  verticalDivider?: boolean;
  options?: { disabled?: boolean, text: string, id: string }[] | undefined;

}
