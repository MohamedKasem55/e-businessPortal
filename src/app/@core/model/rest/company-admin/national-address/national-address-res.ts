import { KeyValueModel } from '../../common/key-value.model';
import { GenerateChallengeAndOTP } from '../../common/otp.model';

export interface NationalAddressRegionsRes {
  generateChallengeAndOTP: GenerateChallengeAndOTP;
  regionList: KeyValueModel[];
}

export interface NationalAddressCitiesRes {
  generateChallengeAndOTP: GenerateChallengeAndOTP;
  cityList: KeyValueModel[];
}

export interface NationalAddressRegisterNewReq {
  nationalAddressDTO: NationalAddressDTO;
}

export interface NationalAddressDTO {
  additionalNum: string;
  buildingNum: string;
  city: string;
  ctryDistrict: string;
  postalCode: string;
  stateProvince: string;
  streetName: string;
  unitNum: string;
}

export interface NationalAddressRegisterNewRes {
  generateChallengeAndOTP: GenerateChallengeAndOTP;
  nationalAddressFlag: string;
}
