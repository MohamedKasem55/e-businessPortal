import {ControlBase, ControlOptions, ControlType} from "./control.model";
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";

export class DateControl extends ControlBase<NgbDateStruct | "" | null> {
  override controlType = ControlType.DATE;
  override controlOptions?: DateOptions;

  constructor(options: DateControlOptions) {
    super(options);
    this.controlOptions = options.controlOptions;
  }
}

export class DateControlOptions extends ControlOptions<NgbDateStruct | "" | null> {
  override controlOptions?: DateOptions
}

interface DateOptions {
  displayPattern?: string;
  selectTodayText?: string;
  applyText?: string;
  maxDate?: NgbDateStruct;
  minDate?: NgbDateStruct;
  type?: CalenderType;
  showCalendersType?: boolean;
  disableSelectToday?: boolean;
}

export enum CalenderType {
  GREGORIAN = 0,
  HIJRI = 1
}
