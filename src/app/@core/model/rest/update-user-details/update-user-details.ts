import { GenerateChallengeAndOTP } from "../common/otp.model";

export interface UserDetailsResponseModel {
    email:string;
    errorCode: string;
    errorDescription: string;
    errorResponse: any;
    generateChallengeAndOTP: GenerateChallengeAndOTP;
    image: string;
    language:string;
    userChallengeQuestions:ChallengeList[]
}

export interface ChallengeList {
    questionId?: string;
    questionIdStr: string;
    questionValue: string;
    userChallengeQuestionPk?:number;
    userFk?:number;
}

export interface LanguageListModel {
    key: string,
    location: string,
    name: string,
    props: props

}

export interface props {
   [key:string]:string;
}

export interface UpdateUserDetailsResponseModel {
    errorCode: string;
    errorDescription: string;
    errorResponse: any;
    generateChallengeAndOTP: GenerateChallengeAndOTP;
}

export interface UserDetailsRequestModel {
    image: string | null;
    language:string;
    mail:string;
    repeatMail:string
    uploadImage:boolean;
}

export interface UpdateChallengeQuestionRequestModel {
    challengeQuestionsList:ChallengeList[]
}
