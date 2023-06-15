import { AbstractControl, ValidationErrors } from "@angular/forms";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { ButtonControl } from "app/@core/model/dto/control/button-control";
import { DateControl } from "app/@core/model/dto/control/date-control";
import { DropdownControl } from "app/@core/model/dto/control/dropdown-control";
import { TableControl } from "app/@core/model/dto/control/table-control";
import { TextInputControl } from "app/@core/model/dto/control/text-input-control";
import { FormModel } from "app/@core/model/dto/formModel";
import { TableHeaderType } from "arb-design-library";

export function crmStatusForm(): FormModel {
  return new FormModel({
    id: 'crmStatusForm',
    controls: {
      "crmStatusTable": new TableControl({
        columnCount: 12,
        order: 1,
        required: false,
        value: [],
        controlOptions: {
          headers: [
            {
              title: "pos.maintenance.crm-request-id",
              fieldName: "ticketNumber",
              type: TableHeaderType.BUTTON,
              controlOptions: {
                id: "status",
                text: "ticketNumber"
              }
            },
            {
              title: "pos.maintenance.crm-submitted-date",
              fieldName: "initiationDate",
              type: TableHeaderType.DATE_TEXT,
              controlOptions: { format: 'dd/MM/yyyy' }
            },
            {
              title: "pos.maintenance.crm-request-type",
              fieldName: "posCRMStatusType",
              type: TableHeaderType.TEXT,
              mapObject:{}
            },
            {
              title: "pos.maintenance.crm-tbl-status",
              fieldName: "statusTicket",
              type: TableHeaderType.TEXT
            },
          ],
          columnId: "ticketNumber",
          hasCheckbox: false,
          showSearch: true,
          showFilter: true,
          pageSizes: [10, 25, 50],
          paginationValue: { page: 1, size: 10 },
          exportFileName: "CRM Status"
        },
      }),
    },
  })
}

export function getSearchForm(maxDate:NgbDateStruct) {
  return new FormModel({
    id: 'crmStatusSearchForm',
    controls: {
      "requestId": new TextInputControl({
        label: 'pos.maintenance.crm-request-id',
        order: 1,
        columnCount: 6,
        value: ''
      }),
      "requestType": new DropdownControl({
        label: 'pos.maintenance.crm-selected-type',
        order: 1,
        controlOptions: {
          textField: 'value',
          columnId:"key",
          hasSearch: true,
        },
        columnCount: 6,
    }),
      "fromDate": new DateControl({
        label: 'pos.maintenance.crm-from-date',
        order: 2,
        columnCount: 6,
      }),
      "toDate": new DateControl({
        label: 'pos.maintenance.crm-to-date',
        order: 2,
        columnCount: 6,
        controlOptions: {
          maxDate: maxDate
        }
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
    },
    formValidator: [
    {
      validatorFunc: (controls: AbstractControl): ValidationErrors | null => {
        const fromDate = controls.get('fromDate')?.value;
        const toDate = controls.get('toDate')?.value;
        if (fromDate && toDate) {
          const fromDateObj = new Date(fromDate.year, fromDate.month, fromDate.day)
          const toDateObj = new Date(toDate.year, toDate.month, toDate.day)
          if (fromDateObj > toDateObj) {
            return { invalidDate: "invalidDate" }
          } else {
            return null;
          }
        } else {
          return null;
        }
      },
      errorName: 'invalidDate',
      errorMessage: 'payments.esal.date-validation-message'
    }
    ]
  })
}
