import {ControlBase, ControlOptions, ControlType} from './control.model';
import {SelectionGroupModel} from 'arb-design-library/model/selection-group.model';

export class SelectionGroupControl extends ControlBase<SelectionGroupModel[]> {
  override controlType = ControlType.SELECTION_GROUP;
  override controlOptions!: SelectionGroupOptions;

  constructor(options: SelectionGroupControlOptions) {
    super(options);
  }
}

export class SelectionGroupControlOptions extends ControlOptions<any> {
  override controlOptions!: SelectionGroupOptions;
}

export interface SelectionGroupOptions {
  id: string;
  items: SelectionGroupModel[];
  title: string;
  textOnStart?: boolean;
  isDisabled?:boolean;}
