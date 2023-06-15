import {ControlBase, ControlOptions, ControlType} from "./control.model";

export class SummaryItemControl extends ControlBase<string> {
  override controlType = ControlType.SUMMARY_ITEM;
  override controlOptions!: SummaryItemOptionsModel;

  constructor(options: SummaryItemControlOptions) {
    super(options);
  }
}


export class SummaryItemControlOptions extends ControlOptions<string> {
  override controlOptions?: SummaryItemOptionsModel;
}

export interface SummaryItemOptionsModel {
  currency?: string;
  isLink?:boolean;
}
