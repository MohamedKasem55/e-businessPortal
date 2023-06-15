import {ControlBase, ControlOptions, ControlType} from "./control.model";

export class UploadControl extends ControlBase<string> {
  override controlType = ControlType.UPLOAD;
  override controlOptions!: UploadOptionsModel;

  constructor(options: UploadControlOptions) {
    super(options);
    this.controlOptions = options.controlOptions ||
      {
        acceptedTypes: ["*"],
      }
  }
}

export class UploadControlOptions extends ControlOptions<string> {
  override controlOptions?: UploadOptionsModel;
}

export interface UploadOptionsModel {
  acceptedTypes: string[];
  maxSizeKB?: number
}
