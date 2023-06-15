import {ControlBase} from "./control/control.model";
import {EventEmitter} from "@angular/core";
import {Observable} from "rxjs";
import {ValidatorFn} from "@angular/forms";
import {AmountTitleModel} from "arb-design-library/model/amount-title.model";

export class FormModel {
  id!: string;
  protected _controls!: FormControlModel<ControlBase<any>>;
  protected _errors: string[] | null = null;
  readonly onSubmit: EventEmitter<string>;
  readonly valueChanges: EventEmitter<null>;
  showDivider?: boolean;
  accordion?: FormAccordion;
  protected _formValidator?: FormValidator[];


  get controls(): Readonly<FormControlModel<ControlBase<any>>> {
    return this._controls;
  }

  set controls(controls: FormControlModel<ControlBase<any>>) {
    this._controls = controls;
    this.controlsUpdate.emit(controls);
  }

  setErrors(value: string[] | null) {
    this._errors = value;
    this.errorsUpdate.emit(value);
  }

  get errors(): string[] | null {
    return this._errors;
  }

  addControl(controlID: string, control: ControlBase<any>) {
    this._controls[controlID] = control;
    this.addingControl.emit({controlID, control});
  }

  removeControl(controlID: string) {
    delete this._controls[controlID];
    this.removingControl.emit(controlID);
  }

  updateControl(controlID: string, control: ControlBase<any>) {
    this._controls[controlID] = control;
  }


  disableControls() {
    Object.keys(this.controls).forEach(key => {
      this._controls[key].disable();
    });
  }

  enableControls() {
    Object.keys(this.controls).forEach(key => {
      this._controls[key].enable();
    });
  }

  get formValidator(): readonly FormValidator[] {
    return this._formValidator!;
  }

  deleteFormValidator() {
    this._formValidator = [];
    this.onDeleteFormValidator.emit();
  }

  addFormValidator(formValidator: FormValidator) {
    this._formValidator?.push(formValidator);
    this.onAddFormValidator.emit(formValidator);
  }

  readonly addingControl: EventEmitter<AddingControlModel>;
  readonly removingControl: EventEmitter<string>;
  readonly errorsUpdate: EventEmitter<string[] | null>;
  readonly controlsUpdate: EventEmitter<FormControlModel<ControlBase<any>>>;
  readonly onAddFormValidator: EventEmitter<FormValidator>;
  readonly onDeleteFormValidator: EventEmitter<null>;

  constructor(options: {
                id: string;
                controls?: FormControlModel<ControlBase<any>>;
                errors?: string[] | null;
                showDivider?: boolean;
                onSubmit?: Observable<string>;
                formValidator?: FormValidator[];
                accordion?: FormAccordion;
              }
                = {id: "form"}
  ) {
    this.id = options.id;
    this._controls = options.controls!;
    this._errors = options.errors!;
    this.showDivider = options.showDivider!;
    this._formValidator = options.formValidator;
    this.accordion = options.accordion;
    this.errorsUpdate = new EventEmitter<string[] | null>;
    this.onSubmit = new EventEmitter<string>;
    this.addingControl = new EventEmitter<AddingControlModel>;
    this.removingControl = new EventEmitter<string>;
    this.controlsUpdate = new EventEmitter<FormControlModel<ControlBase<any>>>;
    this.valueChanges = new EventEmitter<null>();
    this.onAddFormValidator = new EventEmitter<FormValidator>;
    this.onDeleteFormValidator = new EventEmitter<null>;
  }

}

export class PageModel {
  order!: number;
  closeOtherPanels!: boolean;
  private readonly _forms!: FormModel[];

  readonly valueChanges: EventEmitter<number>;
  readonly onAddFrom: EventEmitter<AddFormModel>;
  readonly onDeleteFrom: EventEmitter<DeleteFormModel>;

  readonly expandAll: EventEmitter<null>;
  readonly collapseAll: EventEmitter<null>;
  readonly expand: EventEmitter<string>;

  constructor(order: number, ...forms: FormModel[] | []) {
    this._forms = forms || [];
    this.order = order || 1;
    this.valueChanges = new EventEmitter<number>();
    this.onAddFrom = new EventEmitter<AddFormModel>;
    this.onDeleteFrom = new EventEmitter<DeleteFormModel>;
    this.expandAll = new EventEmitter<null>;
    this.collapseAll = new EventEmitter<null>;
    this.expand = new EventEmitter<string>;
  }

  get forms(): readonly FormModel[] {
    return this._forms;
  }

  get length(): number {
    return Object.keys(this._forms).length;
  }

  addForm(form: FormModel) {
    this._forms.push(form);
    this.onAddFrom.emit({form});
  }


  addFormAtIndex(form: FormModel, index: number) {
    this._forms.splice(index, 0, form);
    this.onAddFrom.emit({form, index});
  }

  deleteFrom(formIndex: number, count?: number) {
    this._forms.splice(formIndex, count || 1);
    this.onDeleteFrom.emit({formIndex, count: count || 1});
  }

}

export interface AddFormModel {
  form: FormModel;
  index?: number
}

export interface DeleteFormModel {
  formIndex: number;
  count: number;
}


export interface FormResult {
  id: string;
  valid: boolean;
}

export interface FormControlModel<T extends ControlBase<any>> {
  [key: string]: T;
}

export interface AddingControlModel {
  controlID: string;
  control: ControlBase<any>;
}


export interface FormValidator {
  errorName: string;
  validatorFunc: ValidatorFn;
  errorMessage: string;
}

export class FormAccordion {
  title: string | undefined;
  subTitle?: string | AmountTitleModel[] | undefined;
}


