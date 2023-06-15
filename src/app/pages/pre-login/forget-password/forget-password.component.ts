import { Component } from '@angular/core';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { Router } from '@angular/router';
import { ButtonControl } from 'app/@core/model/dto/control/button-control';
import { VerificationService } from 'app/@core/service/base/verification.service';
import { TextInputControl } from 'app/@core/model/dto/control/text-input-control';
import { FormModel, FormResult } from '../../../@core/model/dto/formModel';
import { UserService } from '../../../@core/service/login/user.service';
import {
  GenerateChallengeAndOTP,
  RequestValidate,
} from '../../../@core/model/rest/common/otp.model';
import { PasswordControl } from '../../../@core/model/dto/control/password-control';
import {
  ChallengeQuestion,
  ConfirmResetPasswordRequest,
  ForgetPasswordValidateOTP,
  ForgetPasswordValidateUser,
  QuestionDTO,
  ValidateForgetPasswordQuestion,
} from '../../../@core/model/rest/login/validate-user';
import { ValidationsEnum } from '../../../@core/model/dto/validations-enum';
import { Utils } from '../../../@core/utility/Utils';
import { NumberInputControl } from '../../../@core/model/dto/control/number-input-control';
import { SessionService } from '../../../@core/service/base/session.service';
import { LoadAfterLoginService } from '../../../@core/service/base/load-after-login.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent {
  showStatusScreen = false;
  //Basic Info Form
  basicInfoForm: FormModel[] = [
    new FormModel({
      id: 'forget-basicInfo-step',
      controls: {
        companyCIC: new NumberInputControl({
          label: 'login.orgProf',
          required: true,
          order: 1,
          validators: [
            { validation: ValidationsEnum.MAX_LENGTH, options: '10' },
            { validation: ValidationsEnum.DIGIT_ONLY },
          ],
          validationLabels: {
            required: 'public.validations.required',
            maxLength: 'public.validations.max-length-10',
          },
          value: '',
          columnCount: 12,
        }),
        userId: new TextInputControl({
          label: 'login.userId',
          required: true,
          order: 1,
          validators: [],
          validationLabels: {
            required: 'public.validations.required',
          },
          value: '',
          columnCount: 12,
        }),
      },
    }),
  ];
  //Challenge Questions Form
  challengeQuestionsForm: FormModel[] = [
    new FormModel({
      id: 'challengeQuestions-step',
      controls: {},
    }),
  ];
  challengeQuestionControls: any[] = [
    {
      tempData: ['1'],
      label: 'login.questions.food',
      required: true,
      order: 1,
      validationLabels: {
        required: 'public.validations.required',
      },
      value: '',
      columnCount: 12,
    },
    {
      tempData: ['2'],
      label: 'login.questions.book',
      required: true,
      order: 1,
      validationLabels: {
        required: 'public.validations.required',
      },
      value: '',
      columnCount: 12,
    },
    {
      tempData: ['3'],
      label: 'login.questions.mother-name',
      required: true,
      order: 1,
      validationLabels: {
        required: 'public.validations.required',
      },
      value: '',
      columnCount: 12,
    },
    {
      label: 'login.questions.mobile-number',
      required: true,
      order: 1,
      validators: [{ validation: ValidationsEnum.MOBILE_NUMBER_WITH_05 }],
      validationLabels: {
        required: 'public.validations.required',
        pattern: 'public.validations.invalid-format',
      },
      value: '',
      tempData: ['4'],
      columnCount: 12,
    },
  ];
  //Credential Form
  credentialsQuestionsForm: FormModel[] = [
    new FormModel({
      id: 'credentialsQuestions-step',
      controls: {},
    }),
  ];
  credentialsQuestionControls: any = {
    userID: new TextInputControl({
      label: 'cards.assigned-username',
      required: true,
      order: 1,
      validationLabels: {
        required: 'public.validations.required',
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
    confirmPassword: new PasswordControl({
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
  };
  //Buttons
  startButtons: ButtonModel[] = [
    { id: 'forget-back', type: 'secondary', text: 'public.back' },
  ];
  endButtons: ButtonModel[] = [
    {
      id: 'forget-next',
      type: 'primary',
      text: 'public.next',
      isDisable: true,
    },
  ];
  //Stepper
  stepper: any = {
    steps: ['Basic Information', 'Challenge Questions', 'Credentials'],
    stepCounter: 1,
    stepText: 'step',
    ofText: 'of',
  };
  token?: string;
  private validateRes: any;

  constructor(
    private router: Router,
    private otpService: VerificationService,
    private userService: UserService,
    private sessionService: SessionService,
    private loadAfterLoginService: LoadAfterLoginService
  ) {}

  private randomizeQuestions() {
    let question1 = Utils.random(0, 3);
    let question2 = Utils.random(0, 3);

    if (question1 === question2) {
      if (question1 === 3) {
        question1--;
      } else {
        question1++;
      }
    }

    this.challengeQuestionsForm[0].controls = {
      question1: new TextInputControl(
        this.challengeQuestionControls[question1]
      ),
      question2: new TextInputControl(
        this.challengeQuestionControls[question2]
      ),
      forget: new ButtonControl({
        order: 5,
        columnCount: 2,
        controlOptions: {
          id: 'forget',
          type: 'outLine',
          text: 'login.forget-answer',
        },
        class:
          'col-4 col-sm-3 col-md-2 col-lg-2 offset-8 offset-sm-9 offset-md-10 offset-lg-10',
      }),
    };
  }

  click(btn: string) {
    if (btn === 'forget-next') {
      this.endButtons[0].showLoading = true;
      if (this.stepper.stepCounter === 1) {
        this.validateUser();
      } else if (this.stepper.stepCounter === 2) {
        this.credentialsQuestionsForm[0].controls =
          this.credentialsQuestionControls;
        this.validateChallengeQuestions();
      } else if (this.stepper.stepCounter === 3) {
        this.confirmResetPassword();
      } else {
        this.stepper.stepCounter++;
      }
    } else if (btn === 'forget-back') {
      if (this.stepper.stepCounter === 1) {
        this.router.navigate(['/']);
      } else {
        this.stepper.stepCounter--;
      }
    }
  }

  onResultChange($event: FormResult[]) {
    if ($event[0].id === 'forget-basicInfo-step')
      this.endButtons[0].isDisable = !$event[0].valid;
    else if ($event[0].id === 'challengeQuestions-step')
      this.endButtons[0].isDisable = !$event[0].valid;
    else if ($event[0].id === 'credentialsQuestions-step')
      this.endButtons[0].isDisable = !$event[0].valid;
  }

  onForgetAnswers(btn: string) {
    if (btn === 'forget') {
      let data: GenerateChallengeAndOTP = { typeAuthentication: 'IVR' };
      this.otpService.showVerification(data);

      this.otpService.onEventTriggered().subscribe({
        next: () => {
          this.router.navigate(['/']);
          this.otpService.setCloseVerification();
        },
      });
    }
  }

  private validateUser() {
    let forgetPasswordValidateUser: ForgetPasswordValidateUser = {
      userId: this.basicInfoForm[0].controls['userId'].value,
      companyId: this.basicInfoForm[0].controls['companyCIC'].value,
    };
    this.userService
      .validateForgetPasswordUser(forgetPasswordValidateUser)
      .subscribe({
        next: () => {
          let otpModel: GenerateChallengeAndOTP = {
            typeAuthentication: 'OTP',
          };
          this.otpService.showVerification(otpModel).subscribe((res) => {
            this.otpValidate(res);
          });
        },
        error: () => {
          this.endButtons[0].showLoading = false;
        },
      });
  }

  private otpValidate(res: RequestValidate) {
    this.challengeQuestionsForm[0].controls = {};
    this.randomizeQuestions();
    if (res.otp) {
      let forgetPasswordValidateOTP: ForgetPasswordValidateOTP = {
        userId: this.basicInfoForm[0].controls['userId'].value,
        companyId: this.basicInfoForm[0].controls['companyCIC'].value,
        otp: res.otp,
      };
      this.userService
        .validateForgetPasswordUserOTP(forgetPasswordValidateOTP)
        .subscribe({
          next: (res) => {
            this.challengeQuestionsForm[0].controls = {};
            this.randomizeQuestions();
            this.validateRes = res;
            this.token = res.token;
            this.endButtons[0].isDisable = true;
            this.stepper.stepCounter++;
            this.endButtons[0].showLoading = false;
          },
          error: () => {
            this.endButtons[0].showLoading = false;
          },
        });
    }
  }

  private validateChallengeQuestions() {
    let questions: QuestionDTO[] = [
      {
        id: this.challengeQuestionsForm[0].controls['question1']?.tempData
          ? this.challengeQuestionsForm[0].controls['question1'].tempData[0]
          : '',
        value: this.challengeQuestionsForm[0].controls['question1'].value,
      },
      {
        id: this.challengeQuestionsForm[0].controls['question2'].tempData
          ? this.challengeQuestionsForm[0].controls['question2'].tempData[0]
          : '',
        value: this.challengeQuestionsForm[0].controls['question2'].value,
      },
    ];

    let validateForgetPasswordQuestion: ValidateForgetPasswordQuestion = {
      userId: this.basicInfoForm[0].controls['userId'].value,
      companyId: this.basicInfoForm[0].controls['companyCIC'].value,
      password: null,
      challengeQuestionsList: new Array<ChallengeQuestion>(),
    };
    if (this.token) {
      this.userService
        .validateChallengeAnswers(
          validateForgetPasswordQuestion,
          questions,
          this.token
        )
        .subscribe({
          next: () => {
            this.stepper.stepCounter++;
            this.endButtons[0].showLoading = false;
          },
          error: () => {
            this.endButtons[0].showLoading = false;
          },
        });
    }
  }

  private confirmResetPassword() {
    let questions: QuestionDTO[] = [
      {
        id: this.challengeQuestionsForm[0].controls['question1']?.tempData
          ? this.challengeQuestionsForm[0].controls['question1'].tempData[0]
          : '',
        value: this.challengeQuestionsForm[0].controls['question1'].value,
      },
      {
        id: this.challengeQuestionsForm[0].controls['question2'].tempData
          ? this.challengeQuestionsForm[0].controls['question2'].tempData[0]
          : '',
        value: this.challengeQuestionsForm[0].controls['question2'].value,
      },
    ];
    let confirmResetPasswordRequest: ConfirmResetPasswordRequest = {
      userId: this.credentialsQuestionsForm[0].controls['userID'].value,
      companyId: this.basicInfoForm[0].controls['companyCIC'].value,
      password:
        this.credentialsQuestionsForm[0].controls['confirmPassword'].value,
      challengeQuestionsList: new Array<ChallengeQuestion>(),
      notifyUser: true,
    };
    if (this.token) {
      this.userService
        .confirmChallengeAnswersAndNewPassword(
          confirmResetPasswordRequest,
          questions,
          this.token
        )
        .subscribe({
          next: (res) => {
            sessionStorage.setItem('token', this.token!);
            this.loadAfterLoginService.load(res).subscribe(() => {
              this.loadAfterLoginService.redirect(res);
              this.sessionService.setSession(
                'timeToLive',
                this.validateRes.tokenValidaityInSecond
              );
            });
          },
          error: () => {
            this.endButtons[0].showLoading = false;
          },
        });
    }
  }

  redirectToLogin() {
    this.router.navigate(['/']);
  }
}
