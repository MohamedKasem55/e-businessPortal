import {Component, OnDestroy, ViewChild} from '@angular/core';

import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ButtonModel} from "arb-design-library/model/button.model";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap/modal/modal-ref";
import {Subscription} from "rxjs";
import {ValidUserResponse} from "../../../../@core/model/rest/login/ValidUser";
import {UserService} from "../../../../@core/service/login/user.service";
import {LoadAfterLoginService} from "../../../../@core/service/base/load-after-login.service";
import {VerificationService} from "../../../../@core/service/base/verification.service";
import {GenerateChallengeAndOTP, RequestValidate} from "../../../../@core/model/rest/common/otp.model";
import {NumberInputControl} from "../../../../@core/model/dto/control/number-input-control";
import {PasswordControl} from "../../../../@core/model/dto/control/password-control";
import {TextInputControl} from "../../../../@core/model/dto/control/text-input-control";
import {ValidateToken, ValidateUser, ValidateUserOTP} from "../../../../@core/model/rest/login/validate-user";
import {ValidationsEnum} from "../../../../@core/model/dto/validations-enum";
import {FormModel} from "../../../../@core/model/dto/formModel";
import {ButtonControl} from "../../../../@core/model/dto/control/button-control";
import {SelectionControl} from "../../../../@core/model/dto/control/selection-control";
import {SessionService} from "../../../../@core/service/base/session.service";
import {FormButtonClickOutput} from "../../../../shared/form/form.component";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-normal-login',
  templateUrl: './normal-login.component.html',
  styleUrls: ['./normal-login.component.scss']
})
export class NormalLoginComponent implements OnDestroy {


  form: FormModel = new FormModel({
    id: "LoginForm",
    controls: {},
    showDivider: false
  });

  loginStart: boolean = false;

  @ViewChild('termsConditions')
  termsConditions!: any;

  validUserResponse!: ValidUserResponse;

  start: ButtonModel[] = [
    {
      type: "secondary",
      id: "back",
      text: "public.back"
    }
  ];
  end: ButtonModel[] = [
    {
      type: "secondary",
      id: "print",
      text: "public.print"
    },
    {
      type: "primary",
      id: "accept",
      text: "public.acc-TC"
    }];

  modalRef!: NgbModalRef;
  subscriptions: Subscription[] = []
  validUserRes!: string;

  constructor(private loginService: UserService, private router: Router,
              private sessionService: SessionService,
              private otpService: VerificationService, private modalService: NgbModal,
              private loadAfterLoginService: LoadAfterLoginService) {

    this.form.addControl("companyOrganizationID", new NumberInputControl({
      label: "login.orgProf",
      required: true,
      order: 1,
      validators: [
        {validation: ValidationsEnum.MAX_LENGTH, options: "10"},
        {validation: ValidationsEnum.DIGIT_ONLY}
      ],
      validationLabels: {required: "Company Organization ID is required", maxLength: "Max length is 10"},
      value: localStorage.getItem("companyOrganizationID") || "",
      columnCount: 12,
    }));

    this.form.addControl("userId", new TextInputControl({
      label: "login.userId",
      required: true,
      order: 2,
      validators: [
        {validation: ValidationsEnum.MAX_LENGTH, options: "30"},
        {validation: ValidationsEnum.LOGIN_USER_ID_PASSWORD}
      ],
      validationLabels: {required: "public.validations.required", maxLength: "Max length is 30"},
      value: localStorage.getItem("userId") || "",
      columnCount: 12,
    }));

    this.form.addControl("password", new PasswordControl({
      label: "login.password",
      required: true,
      order: 3,
      validators: [
        {validation: ValidationsEnum.MIN_LENGTH, options: "4"},
        {validation: ValidationsEnum.MAX_LENGTH, options: "30"},
        {validation: ValidationsEnum.LOGIN_USER_ID_PASSWORD}
      ],
      validationLabels: {required: "public.validations.required", maxLength: "Max length is 30"},
      value: '',
      columnCount: 12,

    }));

    this.form.addControl("rememberMe", new SelectionControl({
      label: "login.rememberMe",
      controlOptions: {
        title: [{text: "login.rememberMe"}],
      },
      required: true,
      order: 4,
      value: !!localStorage.getItem("companyOrganizationID"),
      columnCount: 6,
      staticColumnCount: true,

    }));

    this.form.addControl("forget", new ButtonControl({
      order: 5,
      columnCount: 6,
      staticColumnCount: true,
      controlOptions:
        {
          id: "forget",
          type: 'outLine',
          text: 'login.fgPsd',
        },
      class: "button-end"
    }));

    this.form.addControl("loginBtn", new ButtonControl({
      order: 6,
      controlOptions:
        {
          id: "login",
          type: 'primary',
          text: 'login.login',
          isDisable: true
        },
      columnCount: 12
    }));


    this.form.onSubmit.subscribe(() => {
      if (!this.loginStart)
        this.onClick({buttonId: 'login'})
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onClick(formButtonClickOutput: FormButtonClickOutput) {
    this.loginStart = true;
    if (formButtonClickOutput.buttonId === 'login') {
      this.form.controls['loginBtn']!.controlOptions!.showLoading = true;
      let req: ValidateUser = {
        companyId: this.form.controls['companyOrganizationID']?.value,
        userId: this.form.controls['userId']?.value,
        passwordEn: this.form.controls['password']?.value,
      }

      !environment.production && console.log("password", this.form.controls['password']?.value);
      this.loginService.ValidateUser(req).subscribe({
        next: (res: ValidUserResponse) => {
          if (this.form.controls['rememberMe']?.value == true) {
            localStorage.setItem("companyOrganizationID", this.form.controls['companyOrganizationID']?.value);
            localStorage.setItem("userId", this.form.controls['userId']?.value);

          } else {
            if (localStorage.getItem("companyOrganizationID") == this.form.controls['companyOrganizationID']?.value &&
              localStorage.getItem("userId") == this.form.controls['userId']?.value) {
              localStorage.removeItem("companyOrganizationID");
              localStorage.removeItem("userId");
            }
          }
          this.validUserResponse = res;
          this.showOtp()
        },
        error: () => {
          this.loginStart = false;
          this.form.controls['loginBtn']!.controlOptions!.showLoading = false;
        }
      })
    } else if (formButtonClickOutput.buttonId === 'forget') {
      void this.router.navigateByUrl('/forget-password');
    }
  }

  validateUserAndOTP(pin: any) {
    let req: ValidateUserOTP = {
      companyId: this.form.controls['companyOrganizationID']?.value,
      userId: this.form.controls['userId']?.value,
      passwordEn: this.form.controls['password']?.value,
      otp: pin
    }
    this.loginService.validateUserAndOTP(req).subscribe({
      next: (res: any) => {
        if (res.token == "-1") {
          location.reload();
        } else {
          sessionStorage.setItem("token", res.token)
          if (res.user.firstLogin) {
            this.validUserRes = res;
            this.openTermsAndConditions(this.termsConditions);
            this.loginStart = false;
          } else {
            this.loadAfterLoginService.load(res).subscribe(() => {
              this.loadAfterLoginService.redirect(res);
            });
          }
          this.sessionService.setSession("timeToLive", res.tokenValidaityInSecond);
          if (res.company?.subsidiaries?.length > 0) {
            sessionStorage.setItem("subsidiaries", JSON.stringify(res.company?.subsidiaries));
          }
        }
      },
      error: () => {
        this.loginStart = false;
        this.form.controls['loginBtn']!.controlOptions!.showLoading = false;
      }
    })
  }

  private showOtp() {
    let generateChallengeAndOTP: GenerateChallengeAndOTP
    if (this.validUserResponse.softToken) {
      generateChallengeAndOTP = {
        typeAuthentication: 'CHALLENGE',
        qrcode: this.validUserResponse.challenge.challengeCode,
        challengeCode: this.validUserResponse.challenge.challengeCode
      }
    } else {
      generateChallengeAndOTP = {
        typeAuthentication: 'OTP'
      }
    }

    this.otpService.showVerification(generateChallengeAndOTP).subscribe((data: RequestValidate) => {
      this.onOtpCompleted(data);
    });

    this.otpService.onDismiss().subscribe(() => {
      this.form.controls['loginBtn'] !.controlOptions!.showLoading = false;
      this.loginStart = false;
    });
  }

  private onOtpCompleted(data: RequestValidate) {
    if (!this.validUserResponse.softToken) {
      this.validateUserAndOTP(data.otp);
    } else {
      this.validateUserToken(data.challengeResponse)
    }
  }

  validateUserToken(pin: any) {
    let req: ValidateToken = {
      companyId: this.form.controls['companyOrganizationID']?.value,
      userId: this.form.controls['userId']?.value,
      passwordEn: this.form.controls['password']?.value,
      challenge: this.validUserResponse.challenge.challengeCode,
      response: pin
    }
    this.loginService.validateUserToken(req).subscribe({
      next: (res) => {
        if (res.user.firstLogin) {
          this.validUserRes = res
          this.openTermsAndConditions(this.termsConditions)
        } else {
          sessionStorage.setItem("token", res.token)
          this.loadAfterLoginService.load(res).subscribe(() => {
            this.loadAfterLoginService.redirect(res);
          });
        }
        this.sessionService.setSession("timeToLive", res.tokenValidaityInSecond);
      },
      error: () => {
        this.form.controls['loginBtn']!.controlOptions!.showLoading = false;
        this.loginStart = false;
      }
    })
  }

  openTermsAndConditions(content: any) {
    this.modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      modalDialogClass: 'terms-conditions footer-fix modalHeader',
      centered: true,
      size: "xl"
    });

    this.subscriptions.push(
      this.modalRef.closed.subscribe(() => {
        this.form.controls['loginBtn']!.controlOptions!.showLoading = false;
      }));
  }

  clickBtn(btnId: string) {
    if (btnId === 'accept') {
      this.loginService.setValidUserRes(this.validUserRes);
      void this.router.navigateByUrl('/first-time-login');
      this.modalService.dismissAll();
    }
    this.form.controls['loginBtn']!.controlOptions!.showLoading = false;
  }

  getFormValidity(event: any) {
    if (event[0].id === 'LoginForm') {
      this.form.controls['loginBtn']!.controlOptions!.isDisable = !event[0].valid;
    }
  }
}
