import {Component, OnInit} from '@angular/core';
import {TextInputControl} from "../../../../@core/model/dto/control/text-input-control";
import {FormModel, FormResult} from "../../../../@core/model/dto/formModel";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../../@core/service/login/user.service";
import {
  ChallengeQuestion,
  FirstTimeLoginPasswordRequest,
  QuestionDTO
} from "../../../../@core/model/rest/login/validate-user";
import {PasswordControl} from "../../../../@core/model/dto/control/password-control";
import {ButtonModel} from "arb-design-library/model/button.model";
import {PhoneControl} from "../../../../@core/model/dto/control/phone-control";
import {LoadAfterLoginService} from "../../../../@core/service/base/load-after-login.service";
import {ValidationsEnum} from "../../../../@core/model/dto/validations-enum";

@Component({
  selector: 'app-first-time-login',
  templateUrl: './first-time-login.component.html',
  styleUrls: ['./first-time-login.component.scss']
})
export class FirstTimeLoginComponent implements OnInit {
  resetPasswordForm: FormModel[] = [
    new FormModel({id: "reset-password-form", controls: {}})
  ]
  securityQuestionsForm: FormModel[] = [
    new FormModel({id: "questions-form", controls: {}})
  ];

  startButtons: ButtonModel[] = [{id: "back", type: "secondary", text: "Back"}];
  endButtons: ButtonModel[] = [{id: "next", type: "primary", text: "Next", isDisable: true}];

  stepper: any = {
    steps: ["login.new-psd", "login.sec-quest"],
    stepCounter: 1,
    stepText: 'public.step',
    ofText: 'public.of'
  };

  private validUserResponse: any;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private loadAfterLoginService: LoadAfterLoginService) {

    this.buildForms()
    if (!userService.getValidUserRes()) {
      this.router.navigate(['/']).then();
    } else {
      this.validUserResponse = userService.getValidUserRes();
      userService.setValidUserRes(null);
    }
  }

  ngOnInit(): void {
  }

  onResultChange(obj: FormResult[]) {
    if (obj[0].id === 'reset-password-form') {
      this.endButtons[0].isDisable = !obj[0].valid;
    } else if (obj[0].id === 'questions-form') {
      this.endButtons[0].isDisable = !obj[0].valid;
    }

  }

  click(id: string) {
    if (id === 'back') {
      if (this.stepper.stepCounter === 1)
        this.router.navigate(['/']).then();
      else {
        this.stepper.stepCounter--;
        this.endButtons[0].showLoading = false;
      }
    } else {

      if (this.stepper.stepCounter === 1) {
        this.stepper.stepCounter++;
      } else if (this.stepper.stepCounter === 2) {
        this.endButtons[0].showLoading = true;
        this.saveNewPassword();
      }
    }
  }

  private buildForms() {
    this.resetPasswordForm[0].addControl('oldPassword',
      new PasswordControl(
        {
          label: "login.lst-six-digits",
          required: true,
          columnCount: 12,
          validationLabels: {required: "Last 6 digits of ID/IQAMA Password is required"},
          value: ""
        }
      ));
    this.resetPasswordForm[0].addControl('password',
      new PasswordControl(
        {
          label: "login.new-psd",
          required: true,
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
          columnCount: 12,
          value: ""
        }
      ));
    this.resetPasswordForm[0].addControl('confirmPassword',
      new PasswordControl(
        {
          label: "login.new-cnf-psd",
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
          required: true,
          columnCount: 12,
          value: ""
        }
      ));


    this.securityQuestionsForm[0].addControl('favFood',
      new TextInputControl(
        {
          label: "login.favFood",
          required: true,
          validationLabels: {required: "Favourite food is required"},
          columnCount: 12,
          value: ""
        }
      ));
    this.securityQuestionsForm[0].addControl('favBook',
      new TextInputControl(
        {
          label: "login.favBook",
          validationLabels: {required: "Favourite book is required"},
          required: true,
          columnCount: 12,
          value: ""
        }
      ));
    this.securityQuestionsForm[0].addControl('medianName',
      new TextInputControl(
        {
          label: "login.maidenName",
          validationLabels: {required: "Name is required"},
          required: true,
          columnCount: 12,
          value: ""
        }
      ));
    this.securityQuestionsForm[0].addControl('phoneNumber',
      new PhoneControl(
        {
          label: "login.phoneNum",
          validationLabels: {required: "Phone number is required"},
          required: true,
          columnCount: 12,

          value: ""
        }
      ));
  }

  saveNewPassword() {
    let questions: QuestionDTO[] = [];
    for (let x = 0; x < Object.keys(this.securityQuestionsForm[0].controls).length; x++) {
      let question: QuestionDTO = {
        id: (x + 1).toString(),
        value: this.securityQuestionsForm[0].controls
          [Object.keys(this.securityQuestionsForm[0].controls)[x]].value
      }
      questions.push(question)
    }
    let firstTimeLoginPasswordRequest: FirstTimeLoginPasswordRequest = {
      password: this.resetPasswordForm[0].controls['password'].value,
      oldPassword: this.resetPasswordForm[0].controls['oldPassword'].value,
      challengeQuestionsList: new Array<ChallengeQuestion>(),
    }
    this.userService.confirmNewPasswordFirstTimeLogin(firstTimeLoginPasswordRequest, questions, this.validUserResponse.token).subscribe({
      next: (value) => {
        this.loadAfterLoginService.load(this.validUserResponse).subscribe(() => {
          this.loadAfterLoginService.redirect(this.validUserResponse);
        });
        this.endButtons[0].showLoading = false;
        this.endButtons[0].isDisable = true;
        this.router.navigate(['/dashboard'])
      },
      error: (err) => {
        this.endButtons[0].showLoading = false;
        this.endButtons[0].isDisable = false;
      }
    })
  }
}

enum Questions {
  favFood = 1, favBook = 2, maidenName = 3, phoneNumber = 4
}
