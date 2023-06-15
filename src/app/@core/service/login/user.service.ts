import {Injectable} from '@angular/core';
import {AbstractBaseService} from "../base/abstract-base.service";
import {HttpHeaders} from "@angular/common/http";
import {LoginConstants} from "./user-service-urls";
import {CryptoService} from "../base/crypto.service";
import {
  ChallengeQuestion,
  ConfirmResetPasswordRequest,
  FirstTimeLoginPasswordRequest,
  ForgetPasswordValidateOTP,
  ForgetPasswordValidateUser,
  QuestionDTO,
  ValidateForgetPasswordQuestion,
  ValidateToken,
  ValidateUser,
  ValidateUserOTP
} from "../../model/rest/login/validate-user";
import {ValidUserResponse} from "../../model/rest/login/ValidUser";
import {Observable} from "rxjs";
import {ServiceLocator} from "../base/service-locator.service";

@Injectable()
export class UserService extends AbstractBaseService {

  constructor(private cryptoService: CryptoService) {
    super();
  }

  private ValidUserRes: any;

  getValidUserRes(): any {
    return ((this.ValidUserRes?.token) && this.ValidUserRes.token.length > 0) ? this.ValidUserRes : null;
  }

  setValidUserRes(value: any) {
    this.ValidUserRes = value;
  }

  ValidateUser(validateUserRequest: ValidateUser): Observable<ValidUserResponse> {
    validateUserRequest.passwordEn = this.cryptoService.encryptRSA(validateUserRequest.passwordEn);
    return this.post(LoginConstants.VALIDATE_USER, validateUserRequest);
  }

  validateUserAndOTP(validateUserRequest: ValidateUserOTP) {
    validateUserRequest.passwordEn = this.cryptoService.encryptRSA(validateUserRequest.passwordEn);
    return this.post(LoginConstants.VALIDATE_USER_OTP,
      validateUserRequest);
  }

  validateUserToken(validateTokenRequest: ValidateToken) {
    validateTokenRequest.passwordEn = this.cryptoService.encryptRSA(validateTokenRequest.passwordEn);
    return this.post(LoginConstants.VALIDATE_USER_TOKEN,
      validateTokenRequest);
  }

  public validateForgetPasswordUser(forgetPasswordValidateUser: ForgetPasswordValidateUser): Observable<ValidUserResponse> {
    return this.post(LoginConstants.QUESTIONS_VALID_USER, forgetPasswordValidateUser);
  }

  public validateForgetPasswordUserOTP(forgetPasswordValidateOTP: ForgetPasswordValidateOTP): Observable<any> {
    return this.post(LoginConstants.QUESTIONS_VALID_OTP, forgetPasswordValidateOTP);
  }

  public validateChallengeAnswers(validateForgetPasswordQuestion: ValidateForgetPasswordQuestion, questions: QuestionDTO[], token: string): Observable<any> {
    let challenge: ChallengeQuestion[] = [];
    for (const question of questions) {
      if (question.value && question.id) {
        let challengeQuestion: ChallengeQuestion = {
          questionIdStr: this.cryptoService.encryptRSA('' + question.id),
          questionValue: this.cryptoService.encryptRSA(question.value)
        }
        challenge.push(challengeQuestion)
      }
    }
    validateForgetPasswordQuestion.challengeQuestionsList = challenge;

    return this.post(LoginConstants.VALIDATE_QUESTIONS, validateForgetPasswordQuestion,
      {customHeaders: new HttpHeaders().append('Authorization', `Bearer ${token}`)});
  }

  public confirmChallengeAnswersAndNewPassword(confirmResetPasswordRequest: ConfirmResetPasswordRequest, questions: QuestionDTO[], token: string): Observable<any> {

    confirmResetPasswordRequest.challengeQuestionsList = this.getChallengeQuestion(questions)
    confirmResetPasswordRequest.password = this.cryptoService.encryptRSA(confirmResetPasswordRequest.password)

    return this.post(LoginConstants.CONFIRM_RESET_PASSWORD, confirmResetPasswordRequest,
      {customHeaders: new HttpHeaders().append('Authorization', `Bearer ${token}`)})
  }

  public confirmNewPasswordFirstTimeLogin(firstTimeLoginPasswordRequest: FirstTimeLoginPasswordRequest,
                                          questions: QuestionDTO[], token: string): Observable<any> {
    firstTimeLoginPasswordRequest.oldPassword = this.cryptoService.encryptRSA(firstTimeLoginPasswordRequest.oldPassword)
    firstTimeLoginPasswordRequest.password = this.cryptoService.encryptRSA(firstTimeLoginPasswordRequest.password)
    firstTimeLoginPasswordRequest.challengeQuestionsList = this.getChallengeQuestion(questions)
    return this.post(LoginConstants.USER_PROFILE_UPDATE_PSD, firstTimeLoginPasswordRequest,
      {customHeaders: new HttpHeaders().append('Authorization', `Bearer ${token}`)})
  }

  public refreshToken() {
    const body = {
      token: sessionStorage.getItem("token")
    }
    return this.post(LoginConstants.POST_LOGIN_RENEW_TOKEN, body, {hideLoader: true});
  }

  private getChallengeQuestion(questions: QuestionDTO[]): ChallengeQuestion[] {
    let challenge: ChallengeQuestion[] = [];
    for (const question of questions) {
      if (question.value && question.id) {
        let challengeQuestion: ChallengeQuestion = {
          questionIdStr: this.cryptoService.encryptRSA('' + question.id),
          questionValue: this.cryptoService.encryptRSA(question.value)
        }
        challenge.push(challengeQuestion)
      }
    }
    return challenge;
  }

  public logoutUser(): Observable<any> {
    return this.post(LoginConstants.POST_LOGIN_LOG_OUT, {},
      {
        customHeaders: new HttpHeaders().set('Authorization', `Bearer ${sessionStorage.getItem("token")}`),
        silentError: true
      });
  }
}
