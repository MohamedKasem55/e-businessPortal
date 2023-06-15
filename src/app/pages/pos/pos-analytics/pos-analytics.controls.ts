import { ButtonControl } from "app/@core/model/dto/control/button-control";
import { DateControl } from "app/@core/model/dto/control/date-control";
import { DropdownControl } from "app/@core/model/dto/control/dropdown-control";
import { TableControl } from "app/@core/model/dto/control/table-control";
import { TextInputControl } from "app/@core/model/dto/control/text-input-control";
import { TitleControl } from "app/@core/model/dto/control/title-control";
import { FormModel } from "app/@core/model/dto/formModel";
import { TableHeaderType } from "arb-design-library";

export function getSearchForm() {
  return new FormModel({
    id: 'fromAccountForm',
    controls: {
      "startDate": new DateControl({
        label: "pos.dashboard.analytics.startDate",
        required: true,
        order: 2,
        columnCount: 6,

      }),
      "endDate": new DateControl({
        label:  "pos.dashboard.analytics.endDate",
        required: true,
        order: 2,
        columnCount: 6,

      }),
      
      "cancelButton": new ButtonControl({
        order: 3,
        columnCount: 4,
        controlOptions: {
          id: "cancel",
          type: 'secondary',
          text: "public.cancel"
        }
      }),
      "resetButton": new ButtonControl({
        order: 4,
        columnCount: 4,
        controlOptions: {
          id: "reset",
          type: 'secondary',
          text: "public.reset"
        }
      }),
      "searchButton": new ButtonControl({
        order: 5,
        columnCount: 4,
        controlOptions: {
          id: "search",
          type: 'primary',
          text: "public.search"
        }
      }),
    }
  })
}