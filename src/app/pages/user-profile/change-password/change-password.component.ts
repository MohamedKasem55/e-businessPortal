import {Component, OnInit} from '@angular/core';
import {AbstractControl, ValidationErrors,} from '@angular/forms';
import {Router} from '@angular/router';
import {PasswordControl} from 'app/@core/model/dto/control/password-control';
import {FormModel, FormResult} from 'app/@core/model/dto/formModel';
import {ResultModal} from 'app/@core/model/dto/result.modal';
import {ValidationsEnum} from 'app/@core/model/dto/validations-enum';
import {BreadcrumbService} from 'app/@core/service/base/breadcrumb.service';
import {ChangePasswordService} from 'app/@core/service/change-password/change-password.service';
import {ButtonModel} from 'arb-design-library/model/button.model';
import {Utils} from 'app/@core/utility/Utils';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordProceeeded: boolean = false;
  result: ResultModal = {
    type: 'Success',
    title: 'public.password-changed',
    summary: undefined,
  };

  startButtons: ButtonModel[] = [
    {
      id: 'back',
      type: 'secondary',
      text: 'public.back',
      showLoading: false,
    },
  ];

  endButtons: ButtonModel[] = [
    {
      id: 'cancel',
      type: 'primary',
      text: 'public.cancel',
      showLoading: false,
    },
    {
      id: 'proceed',
      type: 'primary',
      text: 'public.proceed',
      showLoading: false,
      isDisable: true,
    },
  ];

  changePasswordForm: FormModel = new FormModel({
    id: 'changePasswordForm',
    controls: {},
    formValidator: [
      {
        validatorFunc: (controls: AbstractControl): ValidationErrors | null => {
          const password = controls.get('newPassword')?.value;
          const passwordConfirmation = controls.get('confirmPassword')?.value;
          if (password !== passwordConfirmation) {
            return { invalidConfirmation: 'invalidConfirmation' };
          } else {
            return null;
          }
        },
        errorName: 'invalidConfirmation',
        errorMessage: 'public.misMatchPassword',
      },
      {
        validatorFunc: (controls: AbstractControl): ValidationErrors | null => {
          const password = controls.get('newPassword')?.value;
          if (!Utils.checkRegex(password)) {
            return { invalidNewPassword: 'invalidNewPassword' };
          } else {
            return null;
          }
        },
        errorName: 'invalidNewPassword',
        errorMessage: 'public.invalidNewPassword',
      },
    ],
    showDivider: true,
  });

  newPassword: string = '';

  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private changePasswordService: ChangePasswordService
  ) {
    this.breadcrumbService.setBreadcrumb([
      {
        text: 'public.preferences',
        url: '/dashboard',
      },
      {
        text: 'public.changePassword',
        url: '/change-password',
      },
    ]);
    this.buildChangePasswordForm();
  }

  ngOnInit(): void {}

  onTitleButtonClick(id: string) {
    switch (id) {
      case 'arrowTitle':
        this.router.navigateByUrl('/dashboard').then(() => {});
        break;
    }
  }

  buildChangePasswordForm() {
    this.changePasswordForm.addControl(
      'oldPassword',
      new PasswordControl({
        label: 'public.oldPassword',
        required: true,
        order: 1,
        columnCount: 4,
        value: '',
      })
    );

    this.changePasswordForm.addControl(
      'newPassword',
      new PasswordControl({
        label: 'public.newPassword',
        required: true,
        order: 2,
        validators: [
          {validation: ValidationsEnum.PASSWORD},
          {validation: ValidationsEnum.MAX_LENGTH, options: '14'},
          { validation: ValidationsEnum.MIN_LENGTH, options: '8' },
        ],
        validationLabels: {
          required: 'public.validations.old-password-required',
          maxLength: 'public.validations.max-length',
          minLength:'public.validations.min-length',
          pattern: "public.validations.password"
        },
        columnCount: 4,
        value: '',
      })
    );

    this.changePasswordForm.addControl(
      'confirmPassword',
      new PasswordControl({
        label: 'public.confirmPassword',
        required: true,
        order: 3,
        validators: [
          {validation: ValidationsEnum.PASSWORD},
          {validation: ValidationsEnum.MAX_LENGTH, options: '14'},
          { validation: ValidationsEnum.MIN_LENGTH, options: '8' },
        ],
        validationLabels: {
          required: 'public.validations.old-password-required',
          maxLength: 'public.validations.max-length',
          minLength:'public.validations.min-length',
          pattern: "public.validations.password"
        },
        columnCount: 4,
        value: '',
      })
    );
  }

  onButtonClick(formButtonClickOutput: string) {
    switch (formButtonClickOutput) {
      case 'back':
      case 'cancel':
      case 'back-to-dash':
        this.router.navigate(['dashboard']);
        break;
      case 'proceed':
        this.changePasswordProceed();
        break;
      default:
        break;
    }
  }

  getFormValidity(formResult: FormResult[]) {
    if (formResult[0].id === 'changePasswordForm') {
      this.endButtons[1].isDisable = !formResult[0].valid;
    }
  }

  changePasswordProceed() {
    const oldPassword = this.changePasswordForm.controls['oldPassword'].value;
    const password = this.changePasswordForm.controls['newPassword'].value;
    this.changePasswordService
      .changePassword({ oldPassword, password })
      .subscribe({
        next: () => {
          this.changePasswordProceeeded = true;
          this.endButtons = [
            {
              id: 'back-to-dash',
              type: 'secondary',
              text: 'pos.new-request.back-to-dash',
            },
          ];
        },
        error: () => {
          this.changePasswordProceeeded = false;
        },
      });
  }
}
