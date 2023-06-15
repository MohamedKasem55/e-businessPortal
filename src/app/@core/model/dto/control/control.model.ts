import {ValidationsEnum} from "../validations-enum";
import {Observable} from "rxjs";
import {EventEmitter} from "@angular/core";


export abstract class ControlBase<T> {
  private _value: T | undefined;
  private _required: boolean;
  private _disable: boolean;
  private _validators?: ValidatorsItem[];

  protected controlType?: ControlType;

  get type(): ControlType {
    return this.controlType!;
  }

  label: string;
  hidden: boolean;
  order?: number;
  controlOptions?: any;
  validationLabels?: ValidationLabels;
  columnCount?: number;
  staticColumnCount?: boolean;
  class?: string;
  tempData?: any
  updateOn?: 'change' | 'blur' | 'submit';

  readonly valueChanges: EventEmitter<ValueChangeResult>;
  readonly valueUpdate: EventEmitter<T>;
  readonly requiredUpdate: EventEmitter<boolean>;
  readonly validatorsUpdate: EventEmitter<ValidatorsItem[]>;
  readonly disableUpdate: EventEmitter<boolean>;

  setValue(value: T, updateForm: boolean = true) {
    this._value = value;
    if (updateForm) {
      this.valueUpdate.emit(value);
    }
  }

  get value(): T | undefined {
    return this._value;
  }

  setRequired(value: boolean) {
    this._required = value;
    this.requiredUpdate.emit(value);
  }

  get required(): boolean {
    return this._required;
  }

  setValidators(value: ValidatorsItem[]) {
    this._validators = value;
    this.validatorsUpdate.emit(value);
  }

  getValidators(): ValidatorsItem[] {
    return this._validators || [];
  }

  disable() {
    this._disable = true;
    this.disableUpdate.emit(true);
  }

  get disabled(): boolean {
    return this._disable;
  }

  enable() {
    this._disable = false;
    this.disableUpdate.emit(false);
  }

  get enabled(): boolean {
    return !this._disable;
  }


  protected constructor(options: ControlOptions<T> = {}
  ) {
    this._value = options.value;
    this.label = options.label || '';
    this.hidden = options.hidden || false;
    this._required = !!options.required;
    this._disable = !!options.disable;
    this.order = options.order === undefined ? 100 : options.order;
    this.controlOptions = options.controlOptions;
    this._validators = options.validators;
    this.validationLabels = options.validationLabels;
    this.columnCount = options.columnCount || 6;
    this.staticColumnCount = options.staticColumnCount || false;
    this.class = options.class;
    this.tempData = options.tempData || null;
    this.updateOn = options.updateOn || 'change';

    this.valueChanges = new EventEmitter<ValueChangeResult>();
    this.valueUpdate = new EventEmitter<T>();
    this.requiredUpdate = new EventEmitter<boolean>();
    this.validatorsUpdate = new EventEmitter<ValidatorsItem[]>();
    this.disableUpdate = new EventEmitter<boolean>();
  }

}

export enum ControlType {
  'TEXT_INPUT',
  'NUMBER_INPUT',
  'PASSWORD',
  'DROPDOWN',
  'AMOUNT',
  'PHONE',
  'DATE',
  'SINGLE_DIGIT',
  'SINGLE_PASSWORD_DIGIT',
  'UPLOAD',
  'BUTTON',
  'SELECTION',
  'TITLE',
  'PILL',
  'BOX_LIST',
  'RADIO_GROUP',
  'LINE_CARD',
  'TABLE',
  'EMPTY',
  'TABS',
  'TEXT',
  'SUMMARY_ITEM',
  'DIVIDER',
  'USER_CARD',
  'PIN_INPUT',
  'GENERIC_FEATURE_LIST_GROUP',
  'IMAGE',
  'GENERIC_FEATURE_LIST',
  'PROGRESS',
  'SELECTION_GROUP',
  'PDF_VIEWER',
  'PROCEDURE_STATUS',
  'GOLD_COMPONENT'
}

export interface ValidationLabels {
  required?: string;
  min?: string;
  max?: string;
  minLength?: string;
  maxLength?: string;
  pattern?: string | string[];
  translateOptions?: {};
  customValidator?: string;
}

export interface ValidatorsItem {
  validation: ValidationsEnum,
  options?: string
}

export class ControlOptions<T> {
  value?: T;
  label?: string;
  hidden?: boolean;
  required?: boolean;
  disable?: boolean;
  order?: number;
  controlOptions?: any;
  validators?: { validation: ValidationsEnum, options?: string }[];
  validationLabels?: ValidationLabels;
  columnCount?: number;
  staticColumnCount?: boolean;
  class?: string;
  valueChanges?: Observable<any>;
  tempData?: any;
  updateOn?: 'change' | 'blur' | 'submit';
}


export interface ValueChangeResult {
  value: any;
  formIndex: number;
}
