import { Component, ElementRef, ViewChild } from '@angular/core';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { FormModel } from '../../../@core/model/dto/formModel';
import { TextInputControl } from '../../../@core/model/dto/control/text-input-control';
import { ValidationsEnum } from '../../../@core/model/dto/validations-enum';
import { ButtonControl } from '../../../@core/model/dto/control/button-control';
import { PasswordControl } from '../../../@core/model/dto/control/password-control';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { VerificationService } from '../../../@core/service/base/verification.service';
import { GenerateChallengeAndOTP } from '../../../@core/model/rest/common/otp.model';
import { FormButtonClickOutput } from '../../../shared/form/form.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent {
  type: 'MADA' | 'ABSHER' = 'ABSHER';

  stepper: any = {
    steps: ['', '', ''],
    stepCounter: 1,
    stepText: 'step',
    ofText: 'of',
  };

  startButtons: ButtonModel[] = [
    { id: 'register-back', type: 'secondary', text: 'public.back' },
  ];
  endButtons: ButtonModel[] = [
    { id: 'register-next', type: 'primary', text: 'public.next' },
  ];

  firstStepForm: FormModel[] = [];
  secondStepForm: FormModel[] = [];
  thirdStepForm: FormModel[] = [];

  BasicInfoForm: FormModel = new FormModel({
    id: 'register-steps',
    controls: {
      companyCIC: new TextInputControl({
        label: 'public.cic-number',
        required: true,
        order: 1,
        validators: [
          { validation: ValidationsEnum.MAX_LENGTH, options: '10' },
          { validation: ValidationsEnum.DIGIT_ONLY },
        ],
        validationLabels: {
          required: 'cic-number-is-required',
          minLength: 'Min length is 10',
        },
        value: '',
        columnCount: 12,
      }),
      'owner-number': new TextInputControl({
        label: 'public.owner-number',
        required: true,
        order: 1,
        validators: [
          { validation: ValidationsEnum.MAX_LENGTH, options: '10' },
          { validation: ValidationsEnum.DIGIT_ONLY },
        ],
        validationLabels: {
          required: 'public.validations.required',
          minLength: 'Min length is 10',
        },
        value: '',
        columnCount: 12,
      }),
    },
  });
  buttonsAbsherVerifyForm: FormModel[] = [
    new FormModel({
      id: 'absher-verify-btns',
      controls: {
        'absher-cancel': new ButtonControl({
          order: 1,
          columnCount: 6,
          controlOptions: {
            id: 'absher-cancel',
            type: 'secondary',
            text: 'public.cancel',
          },
        }),
        'absher-next': new ButtonControl({
          order: 1,
          columnCount: 6,
          controlOptions: {
            id: 'absher-next',
            type: 'primary',
            text: 'public.next',
          },
        }),
      },
    }),
  ];
  madaVerificationForm: FormModel = new FormModel({
    id: 'register-steps',
    controls: {
      'mada-card-no': new TextInputControl({
        label: 'cards.mada-card-number',
        required: true,
        order: 1,
        validators: [
          { validation: ValidationsEnum.MAX_LENGTH, options: '18' },
          { validation: ValidationsEnum.DIGIT_ONLY },
        ],
        validationLabels: {
          required: 'public.validations.required',
          minLength: 'Min length is 10',
        },
        value: '',
        columnCount: 12,
      }),
      'mada-pin': new TextInputControl({
        label: 'cards.pin-code',
        required: true,
        order: 1,
        validators: [
          { validation: ValidationsEnum.MAX_LENGTH, options: '6' },
          { validation: ValidationsEnum.DIGIT_ONLY },
        ],
        validationLabels: {
          required: 'public.validations.required',
          minLength: 'Min length is 10',
        },
        value: '',
        columnCount: 12,
      }),
    },
  });

  credentialsFormModel: FormModel = new FormModel({
    id: 'register-steps',
    controls: {
      'user-name': new TextInputControl({
        label: 'cards.assigned-username',
        required: true,
        order: 1,
        validators: [
          { validation: ValidationsEnum.MAX_LENGTH, options: '10' },
          { validation: ValidationsEnum.ENGLISH_NUMBER_CHARS_ONLY },
        ],
        validationLabels: {
          required: 'public.validations.required',
          minLength: 'Min length is 10',
        },
        value: '',
        columnCount: 12,
      }),
      password: new PasswordControl({
        label: 'login.password',
        required: true,
        order: 1,
        validators: [
          { validation: ValidationsEnum.PASSWORD },
          { validation: ValidationsEnum.MAX_LENGTH, options: '14' },
          { validation: ValidationsEnum.MIN_LENGTH, options: '8' },
        ],
        validationLabels: {
          required: 'public.validations.old-password-required',
          maxLength: 'public.validations.max-length',
          minLength: 'public.validations.min-length',
          pattern: 'public.validations.password',
        },
        value: '',
        columnCount: 12,
      }),
      'confirm-password': new PasswordControl({
        label: 'public.confirmPassword',
        required: true,
        order: 1,
        validators: [
          { validation: ValidationsEnum.PASSWORD },
          { validation: ValidationsEnum.MAX_LENGTH, options: '14' },
          { validation: ValidationsEnum.MIN_LENGTH, options: '8' },
        ],
        validationLabels: {
          required: 'public.validations.old-password-required',
          maxLength: 'public.validations.max-length',
          minLength: 'public.validations.min-length',
          pattern: 'public.validations.password',
        },
        value: '',
        columnCount: 12,
      }),
    },
  });

  @ViewChild('redirectionModal')
  redirectionModal!: ElementRef;

  showStatusScreen = false;

  constructor(
    private modalService: NgbModal,
    private modalConfig: NgbModalConfig,
    private activeModal: NgbActiveModal,
    private router: Router,
    private otpService: VerificationService
  ) {
    //TODO Add modal service in case of mada otpService

    modalConfig.backdrop = 'static';
    modalConfig.keyboard = false;

    this.firstStepForm?.push(this.BasicInfoForm);
    this.secondStepForm?.push(this.madaVerificationForm);
    this.thirdStepForm?.push(this.credentialsFormModel);
  }

  click(btn: string) {
    if (btn === 'register-next') {
      if (this.stepper.stepCounter === 3) {
        //TODO Handle webservice call and show modal
        if (this.type === 'ABSHER') {
          this.showStatusScreen = true;
        }
      }
      if (this.type === 'MADA') {
        if (this.stepper.stepCounter === 3) {
          let generateChallengeAndOTP: GenerateChallengeAndOTP = {
            typeAuthentication: 'OTP',
          };
          this.otpService
            .showVerification(generateChallengeAndOTP)
            .subscribe((otp) => {
              this.showStatusScreen = true;
            });
        } else {
          this.stepper.stepCounter++;
        }
      } else if (this.type === 'ABSHER') {
        if (this.stepper.stepCounter === 1) {
          this.modalService.open(this.redirectionModal, { centered: true });
        }
      }
    } else if (btn === 'register-back') {
      if (this.stepper.stepCounter === 1) {
        this.router.navigate(['/']);
      } else {
        this.stepper.stepCounter--;
      }
    }
  }

  doDismiss() {
    this.modalService.dismissAll();
  }

  ClickButtonsAbsher(formButtonClickOutput: FormButtonClickOutput) {
    if (formButtonClickOutput.buttonId === 'absher-cancel') {
      this.doDismiss();
    } else if (formButtonClickOutput.buttonId === 'absher-next') {
      //TODO Dismiss and redirect to Absher
      this.doDismiss();

      this.stepper.stepCounter++;
      this.stepper.stepCounter++;
    }
  }
}
