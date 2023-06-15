import {ControlBase, ControlOptions, ControlType} from "./control.model";
import {DropdownOptionsModel} from "./dropdown-control";

export class AccountControl extends ControlBase<any> {
  override controlType = ControlType.DROPDOWN;
  override controlOptions!: DropdownOptionsModel;

  constructor(options: AccountControlOptions) {
    super(options);
    this.controlOptions = options.controlOptions ||
      {
        columnId: 'accountPk',
        textField: ['alias', 'fullAccountNumber'],
        hasSearch: false,
        endTextField: 'availableBalance',
        endTextCurrencyField: 'currency',
        options: [],
        disabledField: "disabled",
      }
  }
}


export class AccountControlOptions extends ControlOptions<any> {
  override controlOptions?: DropdownOptionsModel
}
