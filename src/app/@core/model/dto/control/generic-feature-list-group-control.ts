import {ControlBase, ControlOptions, ControlType} from "./control.model";
import {GenericFeatureListModel} from "arb-design-library/model/generic-feature-list.model";

export class GenericFeatureListGroupControl extends ControlBase<string> {
  override controlType = ControlType.GENERIC_FEATURE_LIST_GROUP;
  override controlOptions!: GenericFeatureListGroupOptions;

  constructor(options: CardListControlOptions) {
    super(options);
  }
}

export class GenericFeatureListGroupOptions {
  list!: GenericFeatureListModel[];
  selectedId?: string;
  selectedHint?: string;
}

export class CardListControlOptions extends ControlOptions<any> {
  override controlOptions!: GenericFeatureListGroupOptions
}
