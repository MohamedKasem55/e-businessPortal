import {ControlBase, ControlOptions, ControlType} from "./control.model";

export class UserCardControl extends ControlBase<null> {
  override controlType = ControlType.USER_CARD;
  override controlOptions!: null;

  constructor(options: UserCardControlOptions) {
    super(options);
  }
}

export class UserCardControlOptions extends ControlOptions<null> {
  override controlOptions!: UserCardModel
}

export interface UserCardModel {
  title: string;
  subTitle: string;
  desc: string;
  pillText: string;
  pillType: 'Neutral' | 'Positive' | 'Warning' | 'Negative' | 'Activate';
  avatarValue: string;
  avatarType: "ico" | "img" | "txt";
}

