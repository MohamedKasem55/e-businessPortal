import {Component, OnDestroy, ViewChild} from '@angular/core';

import {Router} from "@angular/router";

import {QRCodeComponent} from "angularx-qrcode";
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
import {ValidateToken, ValidateUser, ValidateUserOTP} from "../../../../@core/model/rest/login/validate-user";
import {ValidationsEnum} from "../../../../@core/model/dto/validations-enum";
import {FormModel} from "../../../../@core/model/dto/formModel";
import {ButtonControl} from "../../../../@core/model/dto/control/button-control";
import {SelectionControl} from "../../../../@core/model/dto/control/selection-control";
import {SessionService} from "../../../../@core/service/base/session.service";
import {FormButtonClickOutput} from "../../../../shared/form/form.component";
import {DropdownControl} from "../../../../@core/model/dto/control/dropdown-control";

@Component({
  selector: 'app-login-with-id',
  templateUrl: './login-with-id.component.html',
  styleUrls: ['./login-with-id.component.scss']
})
export class LoginWithIDComponent implements OnDestroy {

  @ViewChild('codeComponent', {static: false})
  codeComponent!: QRCodeComponent;

  @ViewChild('termsConditions')
  termsConditions!: any;

  form: FormModel = new FormModel({
    id: "LoginForm",
    controls: {},
    showDivider: false,
  });

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
      text: "login.acc-TC"
    }];
  modalRef!: NgbModalRef;
  subscriptions: Subscription[] = [];
  loginStart: boolean = false;
  isMultiUserSelect = false;
  validUserRes: any;


  constructor(private loginService: UserService, private router: Router,
              private modalService: NgbModal,
              private otpService: VerificationService,
              private sessionService: SessionService,
              private loadAfterLoginService: LoadAfterLoginService) {


    this.form.addControl("civilianID", new NumberInputControl({
      label: "login.civId",
      value: localStorage.getItem("civilianID") || "",
      required: true,
      order: 1,
      validators: [
        {validation: ValidationsEnum.MAX_LENGTH, options: "10"},
        {validation: ValidationsEnum.DIGIT_ONLY}
      ],
      validationLabels: {required: "Civilian ID is required", maxLength: "Max length is 10"},
      columnCount: 12,
    }));
    this.form.addControl("password", new PasswordControl({
      label: "login.password",
      value: "",
      required: true,
      order: 1,
      validators: [
        {validation: ValidationsEnum.MIN_LENGTH, options: "4"},
        {validation: ValidationsEnum.MAX_LENGTH, options: "30"},
        {validation: ValidationsEnum.LOGIN_USER_ID_PASSWORD}
      ],
      validationLabels: {
        required: "public.validations.required",
        pattern: "public.validations.password",

      },
      columnCount: 12,

    }));
    this.form.addControl("rememberMe", new SelectionControl({
      label: "login.rememberMe",
      controlOptions: {
        title: [{text: "login.rememberMe"}],
      },
      required: true,
      order: 10,
      value: !!localStorage.getItem("civilianID"),
      columnCount: 6,
      staticColumnCount: true,

    }));
    this.form.addControl("forget", new ButtonControl({
      order: 11,
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
      order: 12,
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
      if (this.isMultiUserSelect) {
        let req: ValidateUser = {
          companyId: this.form.controls['selectUsername'].value.profileNumber,
          passwordEn: this.form.controls['password']?.value,
          userId: this.form.controls['selectUsername'].value.userId
        }
        this.loginService.ValidateUser(req).subscribe({
          next: (res) => {
            if (this.form.controls['rememberMe']?.value === true) {
              localStorage.setItem("civilianID", this.form.controls['civilianID']?.value);
            } else {
              if (localStorage.getItem("civilianID") == this.form.controls['civilianID']?.value) {
                localStorage.removeItem("civilianID");
              }
            }
            this.validUserResponse = res;
            this.showOtp();

          },
          error: () => {
            this.form.controls['loginBtn']!.controlOptions!.showLoading = false;
          }
        })
      } else {
        let req: ValidateUser = {
          nationalId: this.form.controls['civilianID']?.value,
          passwordEn: this.form.controls['password']?.value,
        }
        this.loginService.ValidateUser(req).subscribe({
          next: (res) => {

            if (this.form.controls['rememberMe']?.value == true) {
              localStorage.setItem("civilianID", this.form.controls['civilianID']?.value);
            } else {
              if (localStorage.getItem("civilianID") == this.form.controls['civilianID']?.value) {
                localStorage.removeItem("civilianID");
              }
            }
            this.validUserResponse = res;
            if (this.validUserResponse.companyList && this.validUserResponse.companyList.length > 0) {
              this.isMultiUserSelect = true
              this.form.controls['password']!.hidden = true;
              this.form.controls['civilianID']!.hidden = true;
              this.form.addControl("selectCivId", new DropdownControl({
                label: "login.select-CIC",
                required: true,
                order: 1,
                validationLabels: {required: "CIC is required"},
                columnCount: 12,
                controlOptions: {
                  textField: "profileNumber",
                  options: res.companyList,
                  columnId: "profileNumber"
                }
              }));
              this.form.addControl("selectUsername", new DropdownControl({
                label: "login.selectUserName",
                required: true,
                order: 1,
                validationLabels: {
                  required: "public.validations.required",
                },
                columnCount: 12,
                controlOptions: {
                  textField: "username",
                  options: [],
                  columnId: "userId"
                }
              }));
              if (this.validUserResponse.companyList.length === 1) {
                this.form.controls["selectCivId"]!.setValue(res.companyList[0]);
                this.form.controls["selectUsername"]!.controlOptions.options = res.companyList[0].users;
                this.form.controls["selectUsername"]!.setValue(res.companyList[0].users[0]);
                this.showOtp();
              }
              this.form.controls["selectCivId"].valueChanges.subscribe((res) => {
                this.form.controls["selectUsername"]!.setValue(null)
                this.form.controls["selectUsername"]!.controlOptions.options = res.value.users;
              })
              this.form.controls['loginBtn']!.controlOptions!.showLoading = false;
            } else {
              this.isMultiUserSelect = false
              this.showOtp();
            }
          },
          error: () => {
            this.loginStart = false;
            this.form.controls['loginBtn']!.controlOptions!.showLoading = false;
          }
        })
      }
    } else if (formButtonClickOutput.buttonId === 'forget') {
      void this.router.navigateByUrl('/forget-password');
    }
  }

  validateUserOTP(pin: any) {
    let req: ValidateUserOTP;
    if (this.isMultiUserSelect) {
      req = {
        companyId: this.form.controls['selectUsername'].value.profileNumber,
        passwordEn: this.form.controls['password']?.value,
        userId: this.form.controls['selectUsername'].value.userId,
        otp: pin
      }
    } else {
      req = {
        companyId: this.validUserResponse.companyList[0].profileNumber,
        userId: this.validUserResponse.companyList[0].users[0].userId,
        passwordEn: this.form.controls['password']?.value,
        otp: pin
      }
    }
    this.loginService.validateUserAndOTP(req).subscribe({
      next: (res) => {
        if (res.token == "-1") {
          location.reload();
        } else {
          if (res.user.firstLogin) {
            this.validUserRes = res;
            this.openTermsAndConditions(this.termsConditions);
            this.loginStart = false;
          } else {
            sessionStorage.setItem("token", res.token)
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
        this.form.controls['loginBtn']!.controlOptions!.showLoading = false;
      }
    })
  }

  validateUserToken(pin: any) {
    let req: ValidateToken = {
      companyId: this.validUserResponse.companyList[0].profileNumber,
      userId: this.validUserResponse.companyList[0].users[0].userId,
      passwordEn: this.form.controls['password']?.value,
      challenge: this.validUserResponse.challenge.challengeCode,
      response: pin
    }
    this.loginService.validateUserToken(req).subscribe({
      next: (res) => {
        if (res.user.firstLogin) {
          this.validUserRes = res;
          this.openTermsAndConditions(this.termsConditions);
          this.loginStart = false;
        } else {
          sessionStorage.setItem("token", res.token)
          this.loadAfterLoginService.load(res).subscribe(() => {
            this.loadAfterLoginService.redirect(res);
          });
        }
        this.sessionService.setSession("timeToLive", res.tokenValidaityInSecond);
      },
      error: () => {
        this.loginStart = false;
        this.form.controls['loginBtn']!.controlOptions!.showLoading = false;
      }
    })
  }

  private showOtp() {
    let generateChallengeAndOTP: GenerateChallengeAndOTP;
    if (!this.validUserResponse.softToken) {
      generateChallengeAndOTP = {
        typeAuthentication: 'OTP'
      }
    } else {
      generateChallengeAndOTP = {
        typeAuthentication: 'CHALLENGE',
        qrcode: this.validUserResponse.challenge.challengeCode,
        challengeCode: this.validUserResponse.challenge.challengeCode
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
    if (!this.validUserResponse.softToken)
      this.validateUserOTP(data.otp);
    else
      this.validateUserToken(data.challengeResponse)
  }

  openTermsAndConditions(content: any) {
    this.modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      modalDialogClass: 'terms-conditions footer-fix',
      centered: true,
      size: "xl"
    });

    this.subscriptions.push(
      this.modalRef.closed.subscribe(() => {
        this.form.controls['loginBtn']!.controlOptions!.showLoading = false;
      }));
  }

  getFormValidity(event: any) {
    if (event[0].id === 'LoginForm') {
      this.form.controls['loginBtn']!.controlOptions!.isDisable = !event[0].valid;
    }
  }

  clickBtn(btnId: any) {
    if (btnId === 'accept') {
      this.loginService.setValidUserRes(this.validUserRes);
      setTimeout(() => {
        void this.router.navigateByUrl('/first-time-login');
        this.modalService.dismissAll();
      })
    }
    this.form.controls['loginBtn']!.controlOptions!.showLoading = false;
  }
}
