import {ControlBase, ControlOptions, ControlType} from "./control.model";
import { TabModel } from "arb-design-library/model/tab.model";

export class TabsControl extends ControlBase<any> {
  override controlType = ControlType.TABS;
  override controlOptions!: TabsOptions;
  constructor(options: TabsControlOptions) {
    super(options);
  }
}

export class TabsControlOptions extends ControlOptions<any> {
  override controlOptions!: TabsOptions
}

 interface TabsOptions   {
  id: string;
  tabs:TabModel[];
}
