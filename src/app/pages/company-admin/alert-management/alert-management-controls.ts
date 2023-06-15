import { ButtonControl } from "app/@core/model/dto/control/button-control";
import { TextInputControl } from "app/@core/model/dto/control/text-input-control";
import { FormModel } from "app/@core/model/dto/formModel";
import { ButtonModel } from "arb-design-library/model/button.model";
import { DateControl } from "app/@core/model/dto/control/date-control";
import { NumberInputControl } from "app/@core/model/dto/control/number-input-control";
import { AbstractControl, ValidationErrors } from "@angular/forms";
import {Utils} from "../../../@core/utility/Utils";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

export const getTitleEndButtons = (): ButtonModel[] => {
  return [
    {
      id: 'register_title',
      type: 'secondary',
      text: 'Register'
    },
    {
    id: 'reports',
    type: 'primary',
    text: 'company-admin.alert-management.report'
  }
];
}

export function getSubscribedUserSearchForm(maxDate:NgbDateStruct) {
  return new FormModel({
    id: 'fromAccountForm',
    controls: {
      "userId": new TextInputControl({
        label: 'company-admin.alert-management.user-id',
        order: 1,
        columnCount: 6,
        value: ''
      }),
      "name": new TextInputControl({
        label: 'company-admin.alert-management.name',
        order: 1,
        columnCount: 6,
        value: ''
      }),
      "mobileNumber": new TextInputControl({
        label: 'company-admin.alert-management.mobile-number',
        order: 2,
        columnCount: 12,
        value: ''
      }),
      "regFromDate": new DateControl({
        label: 'company-admin.alert-management.reg-from-date',
        order: 3,
        columnCount: 6,
      }),
      "regToDate": new DateControl({
        label: 'company-admin.alert-management.reg-to-date',
        order: 3,
        columnCount: 6,
        controlOptions: {
          maxDate: maxDate
        }
      }),
      "expiredFromDate": new DateControl({
        label: 'company-admin.alert-management.exp-from-date',
        order: 4,
        columnCount: 6,
      }),
      "expiredToDate": new DateControl({
        label: 'company-admin.alert-management.exp-to-date',
        order: 4,
        columnCount: 6,
        controlOptions: {
          maxDate: maxDate
        }
      }),
      "renewalFromDate": new DateControl({
        label: 'company-admin.alert-management.renewal-from-date',
        order: 5,
        columnCount: 6,
      }),
      "renewalToDate": new DateControl({
        label: 'company-admin.alert-management.renewal-to-date',
        order: 5,
        columnCount: 6,
        controlOptions: {
          maxDate: maxDate
        }
      }),
      "closeButton": new ButtonControl({
        order: 6,
        columnCount: 4,
        controlOptions: { id: "close", type: 'secondary', text: "public.close" }
      }),
      "cancelButton": new ButtonControl({
        order: 6,
        columnCount: 4,
        controlOptions: { id: "reset", type: 'secondary', text: "public.reset" }
      }),
      "searchButton": new ButtonControl({
        order: 6,
        columnCount: 4,
        controlOptions: { id: "search", type: 'primary', text: "public.search" }
      }),
    },
    formValidator: [{
      validatorFunc: (controls: AbstractControl): ValidationErrors | null => {
        const fromDate = controls.get('expiredFromDate')?.value;
        const toDate = controls.get('expiredToDate')?.value;
        if (fromDate && toDate) {
          const fromDateObj = new Date(fromDate.year, fromDate.month, fromDate.day)
          const toDateObj = new Date(toDate.year, toDate.month, toDate.day)
          if (fromDateObj > toDateObj) {
            return { invalidExpiredDate: "invalidExpiredDate" }
          } else {
            return null;
          }
        }
        else {
          return null;
        }
      },
      errorName: 'invalidExpiredDate',
      errorMessage: 'company-admin.alert-management.expired-date-error'
    },
    {
      validatorFunc: (controls: AbstractControl): ValidationErrors | null => {
        const fromDate = controls.get('regFromDate')?.value;
        const toDate = controls.get('regToDate')?.value;
        if (fromDate && toDate) {
          const fromDateObj = new Date(fromDate.year, fromDate.month, fromDate.day)
          const toDateObj = new Date(toDate.year, toDate.month, toDate.day)
          if (fromDateObj > toDateObj) {
            return { invalidRegDate: "invalidRegDate" }
          } else {
            return null;
          }
        }
        else {
          return null;
        }
      },
      errorName: 'invalidRegDate',
      errorMessage: 'company-admin.alert-management.reg-date-error'
    },
    {
      validatorFunc: (controls: AbstractControl): ValidationErrors | null => {
        const fromDate = controls.get('renewalFromDate')?.value;
        const toDate = controls.get('renewalToDate')?.value;
        if (fromDate && toDate) {
          const fromDateObj = new Date(fromDate.year, fromDate.month, fromDate.day)
          const toDateObj = new Date(toDate.year, toDate.month, toDate.day)
          if (fromDateObj > toDateObj) {
            return { invalidRenewalDate: "invalidRenewalDate" }
          } else {
            return null;
          }
        }
        else {
          return null;
        }
      },
      errorName: 'invalidRenewalDate',
      errorMessage: 'company-admin.alert-management.renewal-date-error'
    }
    ]
  })
}


export function getExpiredSearchForm(maxDate:NgbDateStruct) {
  return new FormModel({
    id: 'fromAccountForm',
    controls: {
      "userId": new TextInputControl({
        label: 'company-admin.alert-management.user-id',
        order: 1,
        columnCount: 6,
        value: ''
      }),
      "name": new TextInputControl({
        label: 'company-admin.alert-management.name',
        order: 1,
        columnCount: 6,
        value: ''
      }),
      "mobileNumber": new TextInputControl({
        label: 'company-admin.alert-management.mobile-number',
        order: 2,
        columnCount: 12,
        value: ''
      }),
      "maxSmsCountFrom": new NumberInputControl({
        label: 'company-admin.alert-management.max-sms-count-from',
        order: 3,
        columnCount: 6,
        value: ''
      }),
      "maxSmsCountTo": new NumberInputControl({
        label: 'company-admin.alert-management.max-sms-count-to',
        order: 3,
        columnCount: 6,
        value: ''
      }),
      "smsReachedCountFrom": new NumberInputControl({
        label: 'company-admin.alert-management.sms-reached-from',
        order: 4,
        columnCount: 6,
        value: ''
      }),
      "smsReachedCountTo": new NumberInputControl({
        label: 'company-admin.alert-management.sms-reached-to',
        order: 4,
        columnCount: 6,
        value: ''
      }),
      "expiredFromDate": new DateControl({
        label: 'company-admin.alert-management.exp-from-date',
        order: 5,
        columnCount: 6,
      }),
      "expiredToDate": new DateControl({
        label: 'company-admin.alert-management.exp-to-date',
        order: 5,
        columnCount: 6,
        controlOptions: {
          maxDate: maxDate
        }
      }),
      "closeButton": new ButtonControl({
        order: 6,
        columnCount: 4,
        controlOptions: { id: "close", type: 'secondary', text: "public.close" }
      }),
      "cancelButton": new ButtonControl({
        order: 6,
        columnCount: 4,
        controlOptions: { id: "reset", type: 'secondary', text: "public.reset" }
      }),
      "searchButton": new ButtonControl({
        order: 6,
        columnCount: 4,
        controlOptions: { id: "search", type: 'primary', text: "public.search" }
      }),
    },
    formValidator: [{
      validatorFunc: (controls: AbstractControl): ValidationErrors | null => {
        const fromDate = controls.get('expiredFromDate')?.value;
        const toDate = controls.get('expiredToDate')?.value;
        if (fromDate && toDate) {
          const fromDateObj = new Date(fromDate.year, fromDate.month, fromDate.day)
          const toDateObj = new Date(toDate.year, toDate.month, toDate.day)
          if (fromDateObj > toDateObj) {
            return { invalidExpiredDate: "invalidExpiredDate" }
          } else {
            return null;
          }
        }
        else {
          return null;
        }
      },
      errorName: 'invalidExpiredDate',
      errorMessage: 'company-admin.alert-management.expired-date-error'
    },
    {
      validatorFunc: (controls: AbstractControl): ValidationErrors | null => {
        const fromCount = controls.get('maxSmsCountFrom')?.value;
        const toCount = controls.get('maxSmsCountTo')?.value;
        if (fromCount && toCount && Number(fromCount) > Number(toCount)) {
          return { invalidSmsCount: "invalidSmsCount" }
        } else {
          return null;
        }
      },
      errorName: 'invalidSmsCount',
      errorMessage: 'company-admin.alert-management.sms-max-count-error'
    },
    {
      validatorFunc: (controls: AbstractControl): ValidationErrors | null => {
        const fromCount = controls.get('smsReachedCountFrom')?.value;
        const toCount = controls.get('smsReachedCountTo')?.value;
        if (fromCount && toCount && Number(fromCount) > Number(toCount)) {
          return { invalidSmsReachedCount: "invalidSmsReachedCount" }
        } else {
          return null;
        }
      },
      errorName: 'invalidSmsReachedCount',
      errorMessage: 'company-admin.alert-management.sms-reached-count-error'
    }
    ]
  })
}

export function getUnsubscribedSearchForm() {
  return new FormModel({
    id: 'fromAccountForm',
    controls: {
      "userId": new TextInputControl({
        label: 'company-admin.alert-management.user-id',
        order: 1,
        columnCount: 6,
        value: ''
      }),
      "name": new TextInputControl({
        label: 'company-admin.alert-management.name',
        order: 1,
        columnCount: 6,
        value: ''
      }),
      "mobileNumber": new TextInputControl({
        label: 'company-admin.alert-management.mobile-number',
        order: 2,
        columnCount: 12,
        value: ''
      }),
      "closeButton": new ButtonControl({
        order: 9,
        columnCount: 4,
        controlOptions: { id: "close", type: 'secondary', text: "public.close" }
      }),
      "cancelButton": new ButtonControl({
        order: 9,
        columnCount: 4,
        controlOptions: { id: "reset", type: 'secondary', text: "public.reset" }
      }),
      "searchButton": new ButtonControl({
        order: 9,
        columnCount: 4,
        controlOptions: { id: "search", type: 'primary', text: "public.search" }
      }),
    }
  })
}


