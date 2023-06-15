import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  AddFormModel,
  AddingControlModel,
  DeleteFormModel,
  FormModel,
  FormResult,
  FormValidator,
  PageModel,
} from "../../@core/model/dto/formModel";
import {FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {ValidationService} from "../../@core/service/base/validation-service";
import {TitleModel} from "arb-design-library/model/title.model";
import {PillModel} from "arb-design-library/model/pill.model";
import {ControlBase, ControlType, ValidatorsItem} from "../../@core/model/dto/control/control.model";
import {NgbAccordion} from "@ng-bootstrap/ng-bootstrap";
import {ButtonModel} from "arb-design-library/model/button.model";
import {CalenderType} from "../../@core/model/dto/control/date-control";
import {environment} from "../../../environments/environment";
import {Subject, Subscription, takeUntil} from "rxjs";

@Component({
  selector: 'app-form[forms],app-form[form],app-form[page] ',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})

export class FormComponent implements OnInit, OnChanges, OnDestroy {

  _page!: PageModel;
  isProd: boolean = environment.production;

  @Input() set page(page: PageModel) {
    this._page = page;
  }

  @Input() set forms(forms: FormModel[]) {
    this._page = new PageModel(1, ...forms);
  }

  @Input() set form(form: FormModel) {
    this._page = new PageModel(1, form);
  }

  @Output() onButtonClick = new EventEmitter<FormButtonClickOutput>();

  @Output() onResultChanged = new EventEmitter<FormResult[]>();

  @ViewChild('ngbAccordion')
  formAccordion!: NgbAccordion;

  public formsGroup: FormGroupModel[] = [];
  destroy$ = new Subject();

  constructor(private validationService: ValidationService) {

  }


  expandAll() {
    this.formsGroup.forEach(form => {
      if (form.accordionTitle) {
        form.accordionTitle.endButtons = [HideButton()];
      }
    });
    try {
      this.formAccordion.expandAll();
    } catch (any) {

    }
  }

  collapseAll() {
    this.formsGroup.forEach(form => {
      if (form.accordionTitle) {
        form.accordionTitle.endButtons = [ShowButton()];
      }
    });
    this.formAccordion.collapseAll();
  }

  expand(id: string) {
    if (this._page.closeOtherPanels) {
      this.collapseAll();
    }
    this.formsGroup.forEach(form => {
      if (form.id == id && form.accordionTitle) {
        form.accordionTitle.endButtons = [HideButton()];
      }
    });
    this.formAccordion.expand(id + '-panel');
  }

  accordionToggle(id: string) {
    if (this.formAccordion.isExpanded(id + '-panel')) {
      this.formsGroup.forEach(form => {
        if (form.id == id) {
          form.accordionTitle!.endButtons = [ShowButton()];
        }
      });
      if (this._page.closeOtherPanels) {
        this.collapseAll();
      }
      this.formAccordion.collapse(id + '-panel');
    } else {
      this.expand(id);
    }

  }

  isExpanded(id: string) {
    if (this.formAccordion) {
      return this.formAccordion.isExpanded(id + '-panel');
    } else {
      return false;
    }
  }

  ngOnInit(): void {
    this.setFormAccordion();
  }


  setFormAccordion() {
    setTimeout(() => {
      this.formAccordion.closeOtherPanels = this._page.closeOtherPanels || false;
      this.formAccordion.animation = false;
      this.expandAll();
      this.formAccordion.animation = true;
    })
  }


  getXxlColumnCount(count: number | undefined): number {
    if (count && count > 0 && count < 13) {
      switch (count) {
        case 6:
          return 3;
        case 5:
        case 4:
          return 2;
        case 3:
        case 2:
        case 1:
          return 1;
        default:
          return count;
      }
    }
    return 3;
  }

  getXlColumnCount(count: number | undefined): number {
    if (count && count > 0 && count < 13) {
      switch (count) {
        case 6:
          return 4;
        case 5:
        case 4:
          return 3;
        case 3:
        case 2:
        case 1:
          return 1;
        default:
          return count;
      }
    }
    return 3;
  }

  getLgColumnCount(count: number | undefined): number {
    if (count && count > 0 && count < 13) {
      return count;
    }
    return 6;
  }

  getMdColumnCount(count: number | undefined, staticColumnCount: boolean): number {
    if (count && count > 0) {
      if (!staticColumnCount) {
        if (count < 6) {
          switch (count) {
            case 5:
            case 4:
              return 6;
            case 3:
            case 2:
              return 3;
            case 1:
              return 1;
          }
        } else {
          return 12;
        }
      } else {
        return count;
      }
    }
    return 12;

  }

  getSmColumnCount(count: number | undefined, staticColumnCount: boolean): number {
    if (count && count > 0) {
      if (!staticColumnCount) {
        if (count < 6) {
          switch (count) {
            case 5:
            case 4:
              return 6;
            case 3:
            case 2:
              return 3;
            case 1:
              return 1;
          }
        } else {
          return 12;
        }
      } else {
        return count;
      }
    }
    return 12;
  }

  public get controlType(): typeof ControlType {
    return ControlType;
  }

  public get calenderType(): typeof CalenderType {
    return CalenderType;
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log("ngOnChanges");

      this._page.onAddFrom.pipe(takeUntil(this.destroy$)).subscribe((res: AddFormModel) => {
        this.initializeForm(res.form, res.index);
        this.setFormAccordion();
      });

      this._page.onDeleteFrom.pipe(takeUntil(this.destroy$)).subscribe((res: DeleteFormModel) => {
        this.formsGroup.splice(res.formIndex, res.count);
        this.setResults();
        this.setFormAccordion();
      });

      this._page.expandAll.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.expandAll();
      });

      this._page.collapseAll.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.collapseAll();
      });

      this._page.expand.pipe(takeUntil(this.destroy$)).subscribe((id: string) => {
        this.expand(id);
      });


    this.buildForms();
    this.setFormAccordion();
  }

  buildForms() {
    this.formsGroup = [];
    if (this._page && this._page.forms) {
      this._page.forms.forEach((form: FormModel) => {
        this.initializeForm(form);
      });
      this.setResults();
    }
  }

  initializeForm(form: FormModel, index?: number) {

    let formGroup: FormGroupModel = this.createFormGroup(form);
    if (!index) {
      this.formsGroup.push(formGroup);
    } else {
      if (this.formsGroup.length > index) {
        this.formsGroup.splice(index, 0, formGroup);
      } else {
        this.formsGroup.push(formGroup);
      }
    }

    formGroup.formGroup.updateValueAndValidity();

      formGroup.formGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this._page.valueChanges.emit(this.getFormIndex(formGroup.id));
      });

      formGroup.formGroup.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.setResults();
      });
  }

  getFormIndex(formID: string) {
    let _index = 0;
    this.formsGroup.forEach((item: FormGroupModel, index: number) => {
      if (item.id == formID) {
        _index = index;
      }
    });
    return _index;
  }

  setResults() {
    let formsResult: FormResult[] = [];
    this.formsGroup.forEach((form: FormGroupModel) => {
      formsResult.push({id: form.id, valid: form.formGroup.valid && form.errors == null})
    });
    this.onResultChanged.emit(formsResult);
  }

  doButtonClick(buttonId: string, formIndex: number) {
    this.onButtonClick.emit({buttonId, formIndex});
  }

  getFormGroupById(id: string): FormGroupModel | null {
    let form = null;
    this.formsGroup.forEach(item => {
      if (item.id == id) {
        form = item;
      }
    });
    return form;
  }

  getFormById(id: string): FormModel | null {
    let form = null;
    this._page.forms.forEach(item => {
      if (item.id == id) {
        form = item;
      }
    });
    return form;
  }

  createFormGroup(form: FormModel): FormGroupModel {
    //console.log("toFormGroup");
    const group: any = {};


    // On Controls changed

      form.controlsUpdate.pipe(takeUntil(this.destroy$)).subscribe(() => {
        let formGroup = this.getFormGroupById(form.id);
        if (formGroup) {
          formGroup = this.createFormGroup(formGroup);
          formGroup.formGroup.updateValueAndValidity();
          this.setResults();
        }
      });

    //// Add Control to Form Group and Form

      form.addingControl.pipe(takeUntil(this.destroy$)).subscribe((item: AddingControlModel) => {
        let formGroup = this.getFormGroupById(form.id);
        if (formGroup) {
          formGroup.formGroup.addControl(item.controlID, this.createControl(formGroup.id, item.controlID, item.control));
          formGroup.controls[item.controlID] = item.control;
          formGroup.sortedControls = this.getSortedForm(formGroup);
        }
      });

    //// Delete Control from Form Group and Form

      form.removingControl.pipe(takeUntil(this.destroy$)).subscribe((controlID: string) => {
        let formGroup = this.getFormGroupById(form.id);
        if (formGroup) {
          formGroup.formGroup.removeControl(controlID);
          formGroup.sortedControls = this.getSortedForm(formGroup);
        }
      });

      form.onAddFormValidator.pipe(takeUntil(this.destroy$)).subscribe((formValidator: FormValidator) => {
        let formGroup = this.getFormGroupById(form.id);
        if (formGroup) {
          formGroup.formGroup.addValidators(formValidator.validatorFunc);
          this.setFormAccordion();
        }
      });

      form.onDeleteFormValidator.pipe(takeUntil(this.destroy$)).subscribe(() => {
        let formGroup = this.getFormGroupById(form.id);
        if (formGroup) {
          formGroup.formGroup.clearValidators();
          this.setFormAccordion();
        }
      });


    // Create Controls
    for (const [key, control] of Object.entries(form.controls)) {
      group[key] = this.createControl(form.id, key, control);
    }
      form.errorsUpdate.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
        this.updateErrors(form.id, value)
      });

    let formGroup: FormGroup = new FormGroup(group);

    form.formValidator?.forEach(item => {
      formGroup.addValidators(item.validatorFunc);
    });


      formGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
        form.valueChanges.emit();
      });

    let accordionTitle: TitleModel | undefined = undefined;
    if (form.accordion) {
      accordionTitle = form.accordion as TitleModel;
      accordionTitle.endButtons = [ShowButton()];
    }


    return new FormGroupModel({
      id: form.id,
      controls: form.controls,
      showDivider: form.showDivider,
      formGroup,
      errors: form.errors,
      sortedControls: this.getSortedForm(form),
      formValidator: form.formValidator ? [...form.formValidator] : [],
      accordionTitle
    });

  }

  createControl(formId: string, key: string, control: ControlBase<any>): FormControl {
    let formControl = new FormControl({value: control.value, disabled: control.disabled}, {updateOn: control.updateOn});
    let validators: ValidatorFn[] = [];
    if (control.required) {
      validators.push(Validators.required);
    }

    control.getValidators()?.forEach(item => {
      validators.push(this.validationService.getValidation(item.validation, item.options));
    })

    formControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      this.controlValueChanged(formId, key);
      control.valueChanges.emit({value, formIndex: this.getFormIndex(formId)});
    });

    control.valueUpdate.subscribe((value: any) => {
      this.controlValueUpdate(formId, key, value);
    });

    control.requiredUpdate.subscribe((value: boolean) => {
      this.controlRequiredUpdate(formId, key, value);
    });

    control.validatorsUpdate.subscribe((value: ValidatorsItem[]) => {
      this.controlValidatorsUpdate(formId, key, value);
    });

      control.disableUpdate.pipe(takeUntil(this.destroy$)).subscribe((value: boolean) => {
        value ? formControl.disable() : formControl.enable();
        formControl.updateValueAndValidity();
      });

    formControl.setValidators(validators);
    formControl.updateValueAndValidity({emitEvent: false});
    return formControl;
  }


  controlValueChanged(formId: string, key: string) {
    //console.log("controlValueChanged");
    let formGroup = this.getFormGroupById(formId);
    if (formGroup) {
      if (formGroup.controls) {
        let control = formGroup.controls[key];
        if (control) {
          control.setValue(structuredClone(formGroup.formGroup.controls[key].value), false);
        }
      }
    }
  }


  controlValueUpdate(formId: string, key: string, value: any) {
    let formGroup = this.getFormGroupById(formId);
    if (formGroup) {
      if (formGroup.formGroup?.controls[key]) {
        formGroup.formGroup.controls[key].setValue(structuredClone(value), {emitEvent: false});
      }
    }
  }

  controlRequiredUpdate(formId: string, key: string, value: boolean) {
    let formGroup = this.getFormGroupById(formId);
    if (formGroup) {
      if (value) {
        if (!formGroup.formGroup.controls[key].hasValidator(Validators.required)) {
          formGroup.formGroup.controls[key].addValidators(Validators.required);
        }
      } else {
        if (formGroup.formGroup.controls[key].hasValidator(Validators.required)) {
          formGroup.formGroup.controls[key].removeValidators(Validators.required);
        }
      }
      formGroup.formGroup.controls[key].updateValueAndValidity({onlySelf: true});
      this.setResults();
    }
  }

  controlValidatorsUpdate(formId: string, key: string, validators: ValidatorsItem[]) {
    let formGroup = this.getFormGroupById(formId);
    if (formGroup) {
      let hasRequired: boolean = false;
      if (formGroup.formGroup.controls[key].hasValidator(Validators.required)) {
        hasRequired = true;
      }
      formGroup.formGroup.controls[key].clearValidators();
      let validatorsFn: ValidatorFn[] = [];
      validators?.forEach(item => {
        validatorsFn.push(this.validationService.getValidation(item.validation, item.options));
      });

      formGroup.formGroup.controls[key].setValidators(validatorsFn);

      if (hasRequired) {
        formGroup.formGroup.controls[key].addValidators(Validators.required);
      }
      formGroup.formGroup.controls[key].updateValueAndValidity({onlySelf: true})
      this.setResults();
    }
  }

  getSortedForm(form: FormModel) {
    return Object.entries(form.controls).sort((a, b) =>
      (form.controls[a[0]].order || 100) - (form.controls[b[0]].order || 100)
    )
  }

  updateErrors(formId: string, errors: string[]) {

    let formGroup = this.getFormGroupById(formId);
    if (formGroup) {
      formGroup.setErrors(errors);
      this.setResults();
    }

  }

  submit(formId: string) {
    let formGroup = this.getFormGroupById(formId);
    if (formGroup?.formGroup.valid) {
      let form: FormModel | null = this.getFormById(formId);
      if (form) {
        form!.onSubmit.emit(formId);
      }
    }
  }


  stringify(object: any) {
    let simpleObject: any = {};
    for (let prop in object) {
      if (!object.hasOwnProperty(prop)) {
        continue;
      }
      if (typeof (object[prop]) == 'object') {
        continue;
      }
      if (typeof (object[prop]) == 'function') {
        continue;
      }
      simpleObject[prop] = object[prop];
    }
    return JSON.stringify(simpleObject);
  }

  getValidationArray(text: string | string[]): string[] {
    if (typeof text == 'string') {
      return [text];
    }
    return text;
  }


  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}


class FormGroupModel extends FormModel {
  formGroup!: FormGroup;
  sortedControls: any;
  accordionTitle!: TitleModel | undefined;

  override get controls(): FormControlModel<ControlBase<any>> {
    return this._controls;
  }

  constructor(options: {
                id: string;
                title?: TitleModel;
                pill?: PillModel;
                controls?: FormControlModel<ControlBase<any>>;
                errors?: string[] | null;
                showDivider?: boolean;
                formGroup?: FormGroup;
                sortedControls?: any;
                formValidator?: FormValidator[];
                accordionTitle?: TitleModel,
              }
                = {id: "form"}
  ) {
    super(options);
    this.formGroup = options.formGroup!;
    this.sortedControls = options.sortedControls!;
    this.accordionTitle = options.accordionTitle;
  }

  override set errors(value: string[] | null) {
    this.errors = value;
  }
}

interface FormControlModel<T extends ControlBase<any>> {
  [key: string]: T;
}

export interface FormButtonClickOutput {
  buttonId: string;
  formIndex?: number;
}


function ShowButton(): ButtonModel {
  return {
    id: "show",
    type: "outLine",
    text: "Show",
    suffixIcon: ' arb-icon-chevronDown'
  }
}

function HideButton(): ButtonModel {
  return {
    id: "hide",
    type: "outLine",
    text: "Hide",
    suffixIcon: ' arb-icon-chevronUp'
  }
}

