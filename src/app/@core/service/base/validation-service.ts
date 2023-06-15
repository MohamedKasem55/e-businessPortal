import {Injectable} from '@angular/core';
import {AbstractControl, ValidationErrors, ValidatorFn, Validators,} from '@angular/forms';
import {ValidationsEnum} from '../../model/dto/validations-enum';

@Injectable()
export class ValidationService {
  public getValidation(item: ValidationsEnum, options?: string): ValidatorFn {
    switch (item) {
      case ValidationsEnum.MIN:
        return Validators.min(parseInt(options || '0'));

      case ValidationsEnum.MAX:
        return Validators.max(parseInt(options || '0'));

      case ValidationsEnum.MIN_LENGTH:
        return Validators.minLength(parseInt(options || '0'));

      case ValidationsEnum.MAX_LENGTH:
        return Validators.maxLength(parseInt(options || '0'));

      case ValidationsEnum.ENGLISH_NUMBER_CHARS_ONLY:
        return Validators.pattern(/^[A-Za-z][A-Za-z0-9]*$/);

      case ValidationsEnum.DIGIT_ONLY:
        return Validators.pattern('^[0-9]*$');

      case ValidationsEnum.LOGIN_USER_ID_PASSWORD:
        return Validators.pattern(
          '[^\u0600-\u06ff\u0750-\u077f\ufb50-\ufc3f\ufe70-\ufefc]*'
        );

      case ValidationsEnum.NONE_EMPTY_STRING:
        return Validators.pattern(/([^\s])/);

      case ValidationsEnum.MOBILE_NUMBER:
        return Validators.pattern('^[5][0-9]{8}');

      case ValidationsEnum.MOBILE_NUMBER_WITH_05:
        return Validators.pattern('^[05][0-9]{9}');

      case ValidationsEnum.MOBILE_INT_BEN:
        return Validators.pattern('^0.*');

      case ValidationsEnum.IBAN:
        return Validators.pattern('^[S|s]{1}[A|a]{1}[0-9]{22}');

      case ValidationsEnum.NATIONALID:
        return Validators.pattern('^[0-9]{10}');

      case ValidationsEnum.EMAIL:
        return Validators.pattern('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$');

      case ValidationsEnum.ACCOUNTNUMBER:
        return Validators.pattern(
          '(?:^[0-9]{15}$)|(?:^[0-9]{21}$)|(?:^[0-9]{24}$)|(?:^[SA]{2}([0-9]){22}$)'
        );

      case ValidationsEnum.MOL_ID:
        return Validators.pattern('[0-9]{2}-[0-9]{5,15}$');

      case ValidationsEnum.TRUE:
        return Validators.requiredTrue;

      case ValidationsEnum.ONLY_ALPHABETIC:
        return Validators.pattern('^[a-zA-Z\u0600-\u06FF ]*');


      case ValidationsEnum.ONLY_ARABIC_LETTERS:
        return Validators.pattern('^[\u0600-\u06FF ]*');

      case ValidationsEnum.NO_SPECIAL_CHAR:
        return Validators.pattern('^[a-zA-Z0-9\u0600-\u06FF ]*');

      case ValidationsEnum.ONLY_ENGLISH_LETTERS:
        return Validators.pattern('^[a-zA-Z ]*');

      case ValidationsEnum.INTERNATIONAL_IBAN:
        return (control: AbstractControl): ValidationErrors | null => {
          return this.validateIbanFormat(control, options || '');
        };
      case ValidationsEnum.PASSWORD:
        return Validators.pattern('^(?!.*\\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?!.*[\u0600-\u06ff\u0750-\u077f\ufb50-\ufc3f\ufe70-\ufefc])(?!.*(.)\\1{2,2}).{8,14}$');

      case ValidationsEnum.INTERNATIONAL_ACCOUNT:
        return (control: AbstractControl): ValidationErrors | null => {
          return this.validateAccount(control, options || '');
        };


      case ValidationsEnum.SA_ID_NUMBER:
        return (control: AbstractControl): ValidationErrors | null => {
          return this.getValidatorForSAID(control);
        };

      case ValidationsEnum.UNIQUE:
        return (control: AbstractControl): ValidationErrors | null => {
          return this.uniqueDataValidation(control, options || '');
        };
      case ValidationsEnum.MIN_AGE:
        return (control: AbstractControl): ValidationErrors | null => {
          return this.ValidateMinAge(control, options || '');
        };
    }
  }

  // validateIbanFormat(control: AbstractControl, format: string) {
  validateIbanFormat(
    control: AbstractControl,
    format: string
  ): ValidationErrors | null {
    if (control.value.length !== format.length / 2) {
      return {
        customValidator: {
          valid: false,
        },
      };
    }
    for (let i = 0, j = 0; i < control.value.length; i++, j += 2) {
      const meta = format[j];
      const data = format[j + 1];
      const actual = control.value[i];
      if (meta === 'F' && data !== actual) {
        return {
          customValidator: {
            valid: false,
          },
        };
      }
      if (meta === 'V') {
        if (data === 'A' && !this.isAlphabet(actual)) {
          return {
            customValidator: {
              valid: false,
            },
          };
        }
        if (data === 'N' && this.isAlphabet(actual)) {
          return {
            customValidator: {
              valid: false,
            },
          };
        }
      }
    }
    return null;
  }

  isAlphabet(text: string) {
    return text.toLowerCase() !== text.toUpperCase();
  }

  validateAccount(
    control: AbstractControl,
    formats: string
  ): ValidationErrors | null {
    let result: ValidationErrors | null = {
      customValidator: {
        valid: false,
      },
    };
    if (formats) {
      for (const format of JSON.parse(formats)) {
        if (format) {
          if (control.value.length === format.length) {
            let i = 0;
            for (i; i < control.value.length; i++) {
              const data = format[i];
              const actual = control.value[i];
              if (
                (data === 'A' && !this.isAlphabet(actual)) ||
                (data === 'N' && this.isAlphabet(actual))
              ) {
                break;
              }
            }
            if (i == control.value.length) {
              result = null;
              break;
            }
          }
        }
      }
    } else {
      result = null;
    }
    return result;
  }

  getValidatorForSAID(control: AbstractControl): any {
    if (
      control === null ||
      control === undefined ||
      control.value === null ||
      control.value === undefined
    ) {
      return null;
    }
    let id = control.value;
    id = id ? id.trim() : '';
    if (Number(id) === null) {
      return {'incorrecId-Iqama': true};
    }
    if (id.length !== 10) {
      return {'incorrecId-Iqama': true};
    }
    const _type = id.substr(0, 1);
    if (_type !== '2' && _type !== '1') {
      return {'incorrecId-Iqama': true};
    }
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      if (i % 2 === 0) {
        const ZFOdd = String('00' + String(Number(id.substr(i, 1)) * 2)).slice(
          -2
        );
        sum += Number(ZFOdd.substr(0, 1)) + Number(ZFOdd.substr(1, 1));
      } else {
        sum += Number(id.substr(i, 1));
      }
    }
  }

  uniqueDataValidation(control: AbstractControl, options: string): any {
    if (
      !(control === null ||
        control === undefined ||
        control.value === null ||
        control.value === undefined||
        options === undefined ||
        options === '')
    ) {
      let list: any[] = JSON.parse(options);
      if (list.find((value) => value === control.value)) {
        return {
          customValidator: {
            valid: false,
          },
        };
      }
    }
    return null;

  }

  ValidateMinAge(control: AbstractControl, minAge: string) {
    if (
      control === null ||
      control === undefined ||
      control.value === null ||
      control.value === undefined
    ) {
      return null;
    } else {
      let selectedDate = new Date(
        control.value.year,
        control.value.month,
        control.value.day
      );
      let today = new Date();
      let minDate = new Date(today.getFullYear() - Number(minAge), today.getMonth(), today.getDate());
      if (selectedDate <= minDate) {
        return null;
      } else {
        return {
          customValidator: {
            valid: false,
          },
        };
      }
    }
  }
}
