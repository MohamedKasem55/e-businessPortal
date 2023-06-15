export interface ValidateUser {
  nationalId?: string;
  companyId?: string;
  userId?: string;
  passwordEn: string;
}

export interface ValidateUserOTP {
  nationalId?: string;
  companyId?: string;
  userId?: string;
  passwordEn: string;
  otp: string;
}

export interface ValidateToken {
  companyId: string;
  userId: string;
  passwordEn: string;
  challenge: string;
  response: string;
}

export interface ForgetPasswordValidateUser {
  companyId?: string;
  userId?: string;
}

export interface ForgetPasswordValidateOTP {
  companyId: string;
  userId: string;
  otp: string
}

export interface ValidateForgetPasswordQuestion {
  challengeQuestionsList: ChallengeQuestion[];
  companyId: string;
  userId: string;
  password: null
}

export interface ChallengeQuestion {
  questionIdStr?: string
  questionValue?: string
}

export interface QuestionDTO {
  id?: string
  value?: string
}

export interface ConfirmResetPasswordRequest {
  challengeQuestionsList: ChallengeQuestion[];
  companyId: string;
  userId: string;
  password: string;
  notifyUser: true
}


export interface FirstTimeLoginPasswordRequest {
  oldPassword: string;
  password: string;
  challengeQuestionsList: ChallengeQuestion[];
}
