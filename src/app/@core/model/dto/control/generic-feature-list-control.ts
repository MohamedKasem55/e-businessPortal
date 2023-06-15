import {ControlBase, ControlOptions, ControlType} from "./control.model";
import {GenericFeatureAmountModel} from "arb-design-library/model/generic-feature-amount.model";
import {ButtonModel} from "arb-design-library/model/button.model";
import { AmountModel } from 'arb-design-library/model/amount.model';

export class GenericFeatureListControl extends ControlBase<string> {
  override controlType = ControlType.GENERIC_FEATURE_LIST;
  override controlOptions!: GenericFeatureListControlOptions;

  constructor(options: GenericFeatureListControlOptions) {
    super(options);
  }
}

interface GenericFeatureListOptionsModel {
  cardImg?: string;
  title: string;
  subTitle?: string;
  amounts?: AmountModel[];
  description?: string;
  showBorder: boolean;
  features?: GenericFeatureAmountModel[];
  submitButton?: ButtonModel;
}

export class GenericFeatureListControlOptions extends ControlOptions<any> {
  override controlOptions?: GenericFeatureListOptionsModel;
}
