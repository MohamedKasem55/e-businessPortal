export class LoginConstants {
  static VALIDATE_USER = 'login/validUser';
  static VALIDATE_USER_OTP = 'login/validOTP';
  static VALIDATE_USER_TOKEN = 'login/validToken';
  static QUESTIONS_VALID_USER = 'login/challengeQuestions/validUser';
  static QUESTIONS_VALID_OTP = 'login/challengeQuestions/validOTPToken';
  static VALIDATE_QUESTIONS = 'userManagement/userChallengeQuestions/validateQuestions';
  static CONFIRM_RESET_PASSWORD = 'userManagement/userChallengeQuestions/confirmResetPassword';
  static USER_PROFILE_UPDATE_PSD = "userManagement/userPasswordChallengeQuestions";
  static POST_LOGIN_RENEW_TOKEN = "postLogin/renew";
  static POST_LOGIN_LOG_OUT="postLogin/logout"
}
