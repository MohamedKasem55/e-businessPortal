import {ControlBase, ControlOptions, ControlType} from "./control.model";

export class ImageControl extends ControlBase<string> {
  override controlType = ControlType.IMAGE;
  override controlOptions!: ImageControlOptions;

  constructor(options: ImageControlOptions) {
    super(options);
  }
}

interface ImageOptionsModel {
  src: string;
  class: string;
}

export class ImageControlOptions extends ControlOptions<any> {
  override controlOptions?: ImageOptionsModel;
}
