import {SelectionControl} from "app/@core/model/dto/control/selection-control";
import {EmptyControl} from "app/@core/model/dto/control/empty-control";
import {DropdownControl} from "app/@core/model/dto/control/dropdown-control";
import {FormModel} from "app/@core/model/dto/formModel";
import {NumberInputControl} from "app/@core/model/dto/control/number-input-control";
import {ValidationsEnum} from "app/@core/model/dto/validations-enum";
import {TextControl} from "../../../@core/model/dto/control/text-control";
import {DividerControl} from "../../../@core/model/dto/control/divider-control";
import {AuthenticationUtils} from "../../../@core/utility/authentication-utils";


export function companyConfigForm(): FormModel {
  return new FormModel({
    id: 'companyConfigDetailsForm',
    controls: {
      resetPasswordSelection: new SelectionControl({
        controlOptions: {
          textOnStart: true,
          title: [
            {
              text: 'company-admin.company-configuration.resetPasswordSelection',
            }
          ],
          type: "toggle",

        },
        required: false,
        order: 1,
        columnCount: 6,
      }),
      empty1: new EmptyControl({
        order: 1,
        columnCount: 6,
      }),
      multiActionPerTransaction: new SelectionControl({
        controlOptions: {
          textOnStart: true,
          title: [
            {
              text: 'company-admin.company-configuration.single-action-per-trx-user',
            }
          ],
          type: "toggle",
        },
        required: false,
        order: 2,
        columnCount: 6,
      }),
      hint: new TextControl({
        columnCount: 12,
        order: 3,
        label: 'company-admin.company-configuration.single-action-per-trx-user-hint',
        controlOptions: {
          prefixIcon: "arb-icon-exclamationBorder fs-4 color-arb-primaryColor",
        }
      }),
      empty: new EmptyControl({
        order: 3,
        columnCount: 12,
      }),
      divider: new DividerControl({
        order: 3,
        columnCount: 12,
      }),

      "companyWorkFlowDrop": new DropdownControl({
        label: 'company-admin.company-configuration.companyWorkFlowType',
        hidden: AuthenticationUtils.isBasic|| AuthenticationUtils.isMakerChecker,
        required: !AuthenticationUtils.isBasic || !AuthenticationUtils.isMakerChecker,
        disable: true,
        order: 8,
        controlOptions: {columnId: "key", textField: 'value'},
        columnCount: 6,
        validationLabels: {required: 'company-admin.company-configuration.validationLable.workFlowTypeRequired'}
      }),
      empty3: new EmptyControl({
        order: 9,
        columnCount: 6,
        hidden: AuthenticationUtils.isBasic|| AuthenticationUtils.isMakerChecker,
      }),
      "vatRegistrationNumberInput": new NumberInputControl({
        hidden: false,
        disable: false,
        label: 'company-admin.company-configuration.vatRegistrationNumber',
        required: false,
        order: 10,
        value: '',
        columnCount: 6,
        validators: [
          {validation: ValidationsEnum.MAX_LENGTH, options: "15"},
        ],
        validationLabels: {
          required: 'company-admin.company-configuration.validationLable.vatNumberRequired',
          maxLength: "company-admin.company-configuration.validationLable.vat-max-length"
        }
      }),
    }
  });
}

