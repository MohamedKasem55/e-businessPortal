import {ControlBase, ControlOptions, ControlType} from "./control.model";

export class ProcedureStatusControl extends ControlBase<null> {
  override controlType = ControlType.PROCEDURE_STATUS;
  override controlOptions!: ProcedureStatusOptionsModel;

  constructor(options: ProcedureStatusControlOptions) {
    super(options);
  }
}

export class ProcedureStatusControlOptions extends ControlOptions<null> {
  override controlOptions?: ProcedureStatusOptionsModel
}

export interface ProcedureStatusOptionsModel {
  type: "Success" | "Error" | "Warning";
  title: string;
  subTitle?: string;
}
