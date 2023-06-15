import { AccountControl } from "app/@core/model/dto/control/account-control";
import { BoxListControl } from "app/@core/model/dto/control/box-list-control";
import { DropdownControl } from "app/@core/model/dto/control/dropdown-control";
import { TitleControl, TitleControlOptions } from "app/@core/model/dto/control/title-control";
import { FormModel } from "app/@core/model/dto/formModel";
import { BoxModel } from "arb-design-library/model/box.model";
import { ButtonModel } from "arb-design-library/model/button.model";
import { PillControl } from './../../../@core/model/dto/control/pill-control';

export const boxList: BoxModel[] = [
  {
    id: "P",
    text: 'Payment',
    icon: 'arb-icon-Smartphone',
    isDisabled: false,
  },
  {
    id: "R",
    text: 'Refund',
    icon: 'arb-icon-bank',
    isDisabled: false,
  }
]


export function moiPaymentsForm(): FormModel {
  return new FormModel({
    id: 'moiPaymentsForm',
    showDivider: true,
    controls: {
      "paymentDetailsTitle": new TitleControl({
        order: 1,
        controlOptions: {
          id: '',
          title: 'payments.configure-payment',
          subTitle: '',
        },
        columnCount: 12,
        hidden: true
      }),
      "listBoxType": new BoxListControl({
        required: true,
        order: 2,
        value: 'P',
        controlOptions: {
          id: 'governmentPaymentList',
          action: 'onSelect',
          box: boxList,
          columnCount: 2
        },
        columnCount: 12,
        class: 'col-12'
      }),
    },
  });
}

export function addedForm(): FormModel {
  return new FormModel({
    id: 'addedForm',
    showDivider: true,
    controls: {
      "title":new  TitleControl ( {
        columnCount: 12,
        order: 2,
        controlOptions: {
          id: "",
          title: '',
          type: 'Section'
        }
      }),
      "paymentPill": new PillControl({
        columnCount: 12,
        order: 3,
        controlOptions: {
          text: '1',
          type: 'Neutral'
        }
      }),
      "serviceType": new DropdownControl({
        label: 'payments.service-type',
        order: 4,
        required: true,
        controlOptions: {
          columnId: "key",
          textField: 'value',
          options: [],
          hasSearch: true,
        },
        columnCount: 4,
        validationLabels: {required: 'payments.service-type-is-required'},
        hidden: false
      }),
      "applicationType": new DropdownControl({
        label: 'payments.application-type',
        order: 5,
        required: true,
        controlOptions: {columnId: "key", textField: 'value',
          hasSearch: true,},
        columnCount: 4,
        validationLabels: {required: 'payments.application-type-is-required'},
        hidden: false
      }),
      "Account": new AccountControl({
        label: 'payments.select-account',
        required: true,
        order: 6,
        value: null,
        controlOptions: {
          columnId: "accountPk",
          textField: ['alias', 'fullAccountNumber'],
          endTextField: 'availableBalance',
          endTextCurrencyField: 'currency',
          options: []
        },
        columnCount: 4,
        validationLabels: {required: 'payments.select-account-is-required'}
      }),

    },
  });
}
export const getEndButtons = (): ButtonModel[] => {
  return [
    {
      id: "moiPayments",
      type: 'primary',
      text: "payments.government.goPayments"
    }
  ]
}

export const deleteButton: ButtonModel = {
  id: 'delete',
  text: '',
  type: "danger",
  isDisable: false,
  prefixIcon: " arb-icon-Trash"
};


// SIT MOCK

export const SelectionTypeNamesP = [
  "eGovSadadType",
  "eGovNationalViolationsApp",
  "eGovCivilDefenseViolationsApp",
  "eGovApplicationTypeAll",
  "eGovLaborImportationApp",
  "eGovSaudiPassportsApp",
  "eGovDrivingLicenseApp",
  "eGovCivilRegistrationApp",
  "eGovAlienControlApp",
  "eGovMotorVehiclesApp",
  "eGovTrafficViolationsApp",
  "eGovViolationsIssuingEntity",
  "eGovVisaTypes",
  "eGovPassportTypes",
  "eGovSadadPassportDuration",
  "eGovLicenseTypeApp",
  "eGovLicenseDurationApp",
  "eGovSadadIssuanceReason",
  "eGovSadadIqamaDuration",
  "eGovSadadJobCategory",
  "eGovSadadVisaDuration",
  "eGovVehicleCardRegisterationReason",
  "eGovPlateIssuanceReason",
  "eGovLicensePlatewithLogo",
  "eGovVehicleRegistrationType",
  "eGovVehicleBodyType"
];

export const SelectionTypeNamesR = [
  "eGovSadadRType",
  "eGovNationalViolationsApp",
  "eGovCivilDefenseViolationsApp",
  "eGovApplicationTypeAll",
  "eGovLaborImportationApp",
  "eGovSaudiPassportsApp",
  "eGovDrivingLicenseApp",
  "eGovCivilRegistrationApp",
  "eGovAlienControlApp",
  "eGovMotorVehiclesApp",
  "eGovTrafficViolationsApp",
  "eGovSadadVisaDuration"
]
