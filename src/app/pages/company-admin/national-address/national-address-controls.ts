import { DropdownControl } from 'app/@core/model/dto/control/dropdown-control';
import { NumberInputControl } from 'app/@core/model/dto/control/number-input-control';
import { TextInputControl } from 'app/@core/model/dto/control/text-input-control';
import { FormModel } from 'app/@core/model/dto/formModel';
import { ResultModal } from 'app/@core/model/dto/result.modal';
import { ValidationsEnum } from 'app/@core/model/dto/validations-enum';
import { KeyValueModel } from 'app/@core/model/rest/common/key-value.model';
import { ButtonModel } from 'arb-design-library/model/button.model';

export function nationalAddressForm(regions: KeyValueModel[]): FormModel {
  return new FormModel({
    id: 'national-address',
    controls: {
      selectCountry: new TextInputControl({
        order: 1,
        columnCount: 6,
        label: 'national-address.select-country',
        disable: true,
        value: 'Kingdom of Saudi Arabia',
      }),
      selectRegion: new DropdownControl({
        order: 2,
        columnCount: 6,
        label: 'national-address.select-region',
        required: true,
        controlOptions: {
          columnId: 'key',
          textField: 'value',
          options: regions,
          hasSearch: true
        },
      }),
      selectCity: new DropdownControl({
        order: 3,
        columnCount: 6,
        label: 'national-address.select-city',
        required: true,
        controlOptions: {
          columnId: 'key',
          textField: 'value',
          hasSearch: true
        },
      }),
      district: new TextInputControl({
        order: 4,
        columnCount: 6,
        label: 'national-address.district',
        required: true,
        value: '',
      }),
      streetName: new TextInputControl({
        order: 5,
        columnCount: 6,
        label: 'national-address.street-name',
        required: true,
        value: '',
      }),
      postalCode: new NumberInputControl({
        order: 6,
        columnCount: 6,
        label: 'national-address.postal-code',
        required: true,
        validators: [{ validation: ValidationsEnum.DIGIT_ONLY }],
        value: '',
      }),
      additionalCode: new NumberInputControl({
        order: 7,
        columnCount: 6,
        label: 'national-address.additional-code',
        required: true,
        validators: [{ validation: ValidationsEnum.DIGIT_ONLY }],
        value: '',
      }),
      buildingNumber: new NumberInputControl({
        order: 8,
        columnCount: 6,
        label: 'national-address.building-number',
        required: true,
        validators: [{ validation: ValidationsEnum.DIGIT_ONLY }],
        value: '',
      }),
      unitNumber: new NumberInputControl({
        order: 9,
        columnCount: 6,
        label: 'national-address.unit-number',
        required: true,
        validators: [{ validation: ValidationsEnum.DIGIT_ONLY }],
        value: '',
      }),
    },
  });
}

export const getEndButtons = (): ButtonModel[] => {
  return [
    {
      id: 'goToDashboard',
      type: 'secondary',
      text: 'public.go-to-dashboard',
    },
    {
      id: 'goToCompanyAdmin',
      type: 'primary',
      text: 'national-address.go-to-company-admin',
    },
  ];
};

export function fillSuccessResult(): ResultModal {
  return {
    type: 'Success',
    title: 'national-address.updated',
    summary: undefined,
  };
}

export function fillErrorResult(errString?: string): ResultModal {
  return {
    type: 'Error',
    title: errString || '',
    summary: undefined,
  };
}
