import { EventEmitter } from "@angular/core";
import { PillModel } from "arb-design-library/model/pill.model";
import { ControlBase, ControlOptions, ControlType } from "./control.model";

export class GoldComponentControl extends ControlBase<string> {
  override controlType = ControlType.GOLD_COMPONENT;
  override controlOptions!: GoldOptions;
  readonly onFinish: EventEmitter<null>;


  constructor(options: GoldControlOptions) {
    super(options);
    this.onFinish = new EventEmitter<null>();
  }
}

class GoldControlOptions extends ControlOptions<any> {
  override controlOptions!: GoldOptions
}

class GoldOptions {
  title!: string;
  balance!:string;
  balanceCurrency?: string;
  prices?: GoldPriceModel[];
  pill?: PillModel;
  note?: string;
  duration?:number;
}

interface GoldPriceModel{
  text:string,
  amount:string,
  currency?:string
}
