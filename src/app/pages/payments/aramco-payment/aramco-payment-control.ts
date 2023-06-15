import { TitleControl, TitleControlOptions } from '../../../@core/model/dto/control/title-control';
import { ValidationsEnum } from '../../../@core/model/dto/validations-enum';
import { FormModel } from "../../../@core/model/dto/formModel";
import { TranslateService } from "@ngx-translate/core";
import { TableControl } from "../../../@core/model/dto/control/table-control";
import { PillControlOptions } from "../../../@core/model/dto/control/pill-control";
import { TableHeaderType } from "arb-design-library";

export function selectBeneficiariesForm(translate: TranslateService) {
  return new FormModel({
    id: 'selectBeneficiaries',
    controls: {
      "beneficiariesTable": new TableControl({
        columnCount: 12,
        order: 2,
        required: true,
        value: [],
        controlOptions: {
          headers: [
            {
              title: "payments.aramco-payment.tableHeader.aramcoPassNumber",
              fieldName: "customerId",
              type: TableHeaderType.TEXT
            },
            {
              title: "payments.aramco-payment.tableHeader.beneficiary",
              fieldName: "customerName",
              type: TableHeaderType.TEXT
            }
          ],
          columnId: "customerId",
          hasCheckbox: true,
          showSearch: true,
          showFilter: false,
          exportFileName: "Aramco Beneficiary List",
          pageSizes: [10, 25, 50],
          paginationValue: { page: 1, size: 20 },
          title: 'payments.aramco-payment.selectedBeneficiaryTitle'
        },
      }),
    }
  });
}

export const paymentDetailTitle: TitleControlOptions = {
  columnCount: 12,
  order: 1,
  controlOptions: {
    id: "",
    title: '',
    amount: ""
  }
}

export const fromAccountControl = {
  label: 'public.from',
  required: true,
  order: 2,
  value: null,
  options: [],
  columnCount: 6,
  validationLabels: { required: 'transfer.account-is-required' }
}

export const amountControl = {
  label: 'public.amount',
  required: true,
  order: 2,
  value: '',
  columnCount: 6,
  controlOptions: {
    currency: ""
  },
  validators: [{ validation: ValidationsEnum.MIN, options: "1" }],
  validationLabels: {
    min: "transfer.amount-is-required",
    required: 'transfer.amount-is-required'
  }
}

export const pillControl: PillControlOptions = {
  columnCount: 12,
  order: 3,
  controlOptions: {
    text: '',
    type: 'Neutral'
  }
};

export const beneficiaryNameTitle: TitleControlOptions = {
  columnCount: 12,
  order: 4,
  controlOptions: {
    id: "beneficiaryNameTitle",
    title: ''
  }
}

export const summaryControl = {
  columnCount: 6,
  order: 6,
  label: '',
  value: ''
}
