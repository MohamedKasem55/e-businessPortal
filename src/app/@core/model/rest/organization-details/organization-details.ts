import { GenerateChallengeAndOTP } from "../common/otp.model";

export interface OrganizationDetailsResponseModel {
    errorCode: string;
    errorDescription: string;
    errorResponse: any;
    generateChallengeAndOTP: GenerateChallengeAndOTP;
    personalDetails: PersonalDetails
}

export interface PersonalDetails {
    address: AddressDetails;
    customerDetails: CustomerDetails;
    profileNumber?: number;
}

export interface AddressDetails {
    city: string;
    country: string;
    countryAlpha: string | null;
    countryName?: string | null;
    poBox?: string;
    region: string;
    state: string | null;
    street: string;
    zipCode: string;
}

export interface CustomerDetails {
    customerFamilyName: string;
    customerId: string;
    customerName: string;
    customerType: string;
    honorificTitle: string;
    issuanceDate: string;
    issuancePlace: string;
    language: string;
    variableData: variableData;
}

export interface variableData {
    personalDetailsEmpty: null;
    personalDetailsFax: PersonalDetailsFax;
    personalDetailsMail: PersonalDetailsMail;
    personalDetailsMobile: PersonalDetailsMobile;
    personalDetailsPhone: PersonalDetailsPhone;
    personalDetailsWPhone: PersonalDetailsWPhone;
    selected: string | null;
}

export interface PersonalDetailsMail {
    emailAddress:string;
    recepFlag:string;
    type:string;
}
export interface PersonalDetailsMobile {
    areaCode:string;
    interCode:string;
    recepFlag:string;
    type:string;
    unvalidatednumber:string;
  }

  export interface PersonalDetailsPhone {
    extension:string;
    interCode:string;
    number:string;
    recepFlag :string;
    type:string;
    unvalidatedareaCode:string;
  }
  export interface PersonalDetailsFax {
    extension:string;
    interCode:string;
    number:string;
    recepFlag :string;
    type:string;
    unvalidatedareaCode:string;
  }
  export interface PersonalDetailsWPhone {
    extension:string;
    interCode:string;
    number:string;
    recepFlag :string;
    type:string;
    unvalidatedareaCode:string;
  }

export interface UpdateContactDetailsRequestModel {
    email: string
    fax: string
    faxAreaCode: string
    faxExtension: string
    mobileNumber: string
    phoneNumber: string
    phoneNumberAreaCode: string
    phoneNumberExtension: string
    selectedProperty: string
    workNumber: string
    workNumberAreaCode: string
    workNumberExtension: string
}
