import { ButtonControl } from "app/@core/model/dto/control/button-control";
import { TextInputControl } from "app/@core/model/dto/control/text-input-control";
import { FormModel } from "app/@core/model/dto/formModel";
import { DateControl } from "app/@core/model/dto/control/date-control";
import { NumberInputControl } from "app/@core/model/dto/control/number-input-control";
import { AbstractControl, ValidationErrors } from "@angular/forms";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

export function getSmsReportsSearchForm(maxDate:NgbDateStruct) {
  return new FormModel({
    id: 'fromAccountForm',
    controls: {
      "userId": new TextInputControl({
        label: 'company-admin.alert-management.user-id',
        order: 1,
        columnCount: 4,
        value: ''
      }),
      "name": new TextInputControl({
        label: 'company-admin.alert-management.name',
        order: 1,
        columnCount: 4,
        value: ''
      }),
      "mobileNumber": new TextInputControl({
        label: 'company-admin.alert-management.mobile-number',
        order: 1,
        columnCount: 4,
        value: ''
      }),
      "regFromDate": new DateControl({
        label: 'company-admin.alert-management.reg-from-date',
        order: 2,
        columnCount: 6,
      }),
      "regToDate": new DateControl({
        label: 'company-admin.alert-management.reg-to-date',
        order: 2,
        columnCount: 6,
        controlOptions: {
          maxDate: maxDate
        }
      }),
      "expiredFromDate": new DateControl({
        label: 'company-admin.alert-management.exp-from-date',
        order: 3,
        columnCount: 6,
      }),
      "expiredToDate": new DateControl({
        label: 'company-admin.alert-management.exp-to-date',
        order: 3,
        columnCount: 6,
        controlOptions: {
          maxDate:  maxDate
        }
      }), "maxSmsCountFrom": new NumberInputControl({
        label: 'company-admin.alert-management.max-sms-count-from',
        order: 4,
        columnCount: 6,
        value: ''
      }),
      "maxSmsCountTo": new NumberInputControl({
        label: 'company-admin.alert-management.max-sms-count-to',
        order: 4,
        columnCount: 6,
        value: ''
      }),
      "smsReachedCountFrom": new NumberInputControl({
        label: 'company-admin.alert-management.sms-reached-from',
        order: 5,
        columnCount: 6,
        value: ''
      }),
      "smsReachedCountTo": new NumberInputControl({
        label: 'company-admin.alert-management.sms-reached-to',
        order: 5,
        columnCount: 6,
        value: ''
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
          return { invalidReachedSmsCount: "invalidReachedSmsCount" }
        } else {
          return null;
        }
      },
      errorName: 'invalidRechedSmsCount',
      errorMessage: 'company-admin.alert-management.sms-reached-count-error'
    }
    ]
  })
}
