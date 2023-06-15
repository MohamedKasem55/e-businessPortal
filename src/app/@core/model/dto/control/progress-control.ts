import { ControlBase, ControlOptions, ControlType } from './control.model';

export class ProgressControl extends ControlBase<null> {
  override controlType = ControlType.PROGRESS;
  override controlOptions!: ProgressOptions;

  constructor(options: progressControlOptions) {
    super(options);
  }
}

export class ProgressOptions {
  title!:string;
  textEnd!:string;
  textBottomEnd!:string;
  progress!:number;
  progressMax!:number
}
export class progressControlOptions extends ControlOptions<any> {
  override controlOptions!: ProgressOptions
}
