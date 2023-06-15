import { LineCardControl } from "app/@core/model/dto/control/line-card-control";
import { PhoneControl } from "app/@core/model/dto/control/phone-control";
import { ProcedureStatusControl } from "app/@core/model/dto/control/procedure-status-control";
import { SelectionControl } from "app/@core/model/dto/control/selection-control";
import { TableControl } from "app/@core/model/dto/control/table-control";
import { TextControl } from "app/@core/model/dto/control/text-control";
import { TextInputControl } from "app/@core/model/dto/control/text-input-control";
import { TitleControl } from "app/@core/model/dto/control/title-control";
import { FormModel } from "app/@core/model/dto/formModel";
import { ValidationsEnum } from "app/@core/model/dto/validations-enum";
import { TableHeaderType } from "arb-design-library";

export function aliasManagementForm() {
  return new FormModel({
    id: 'aliasManagement',
    controls: {
      "info": new TextControl({
        order: 1,
        columnCount: 12,
        label: "alias-management.info",
        controlOptions: {
          prefixIcon: "arb-icon-exclamationBorder"
        }
      }),
      "number": new LineCardControl({
        order: 2,
        columnCount: 4,
        controlOptions: {
          icon: " arb-icon-document",
          title: "alias-management.regNumber"
        }
      }),
      "mobile": new LineCardControl({
        order: 3,
        columnCount: 4,
        controlOptions: {
          icon: "arb-icon-Smartphone",
          title: "alias-management.mobile"
        }
      }),
      "email": new LineCardControl({
        order: 4,
        columnCount: 4,
        controlOptions: {
          icon: "arb-icon-envelope",
          title: "alias-management.email"
        }
      }),
      "aliasesTable": new TableControl({
        columnCount: 12,
        order: 6,
        controlOptions: {
          headers: [
            {
              title: "alias-management.account",
              fieldName: "fullAccountNumber",
              type: TableHeaderType.BUTTON,
              controlOptions: {id: "accountText", text: "fullAccountNumber"}
            },
            {
              title: "alias-management.aliasName",
              fieldName: "alias",
              type: TableHeaderType.BUTTON,
              controlOptions: {id: "aliasText", text: "alias"}
            }],
          columnId: "accountPk",
          hasCheckbox: false,
          showSearch: true,
          showFilter: false,
          pageSizes: [20, 30, 50, 100],
          paginationValue: {page: 1, size: 50},
          title: 'alias-management.aliases'
        },
      }),
    }
  });
}

export function detailTitleManagementForm() {
  return new FormModel({
    id: 'detailManagement',
    showDivider: true,
    controls: {
      "title": new TitleControl({
        order: 1,
        columnCount: 12,
        label: "alias-management.info",
        controlOptions: {
          id: "info",
          type: 'Section',
          title: "",
          showArrow: false,
          subTitle: "",
          endButtons: [
            {
              id: 'unlinkAllStart',
              type: 'outLine',
              text: 'alias-management.unlinkAll',
              suffixIcon: 'arb-icon-circle color-arb-primaryColor  '
            },
          ],
        }
      }),
    }
  });
}

export function detailManagementForm() {
  return new FormModel({
    id: 'detailManagement',
    controls: {
      "unn": new LineCardControl({
        columnCount: 4,
        order: 1,
        controlOptions: {
          title: '',
          subTitle: '',
          button: {
            id: "button-unn",
            text: "alias-management.unlink",
            type: "outLine",
          },
          hasBackground: true,
          weight: "Bold",
          icon: "arb-icon-circle color-arb-primaryColor ",
        }
      }),
      "mobile": new LineCardControl({
        columnCount: 4,
        order: 1,
        controlOptions: {
          title: '',
          subTitle: '',
          button: {
            id: "button-mobile",
            text: "alias-management.unlink",
            type: "outLine",
          },
          hasBackground: true,
          weight: "Bold",
          icon: "arb-icon-circle color-arb-primaryColor ",
        }
      }),
      "email": new LineCardControl({
        columnCount: 4,
        order: 1,
        controlOptions: {
          title: '',
          subTitle: '',
          button: {
            id: "button-email",
            text: "alias-management.unlink",
            type: "outLine",
          },
          hasBackground: true,
          weight: "Bold",
          icon: "arb-icon-circle color-arb-primaryColor ",
        }
      })
    }
  });
}

export function oneDetailForm() {
  return new FormModel({
    id: 'oneDetail',
    controls: {
      "mobile": new PhoneControl({
        order: 1,
        columnCount: 4,
        label: "alias-management.phone",
        class: "text-start color-arb-primaryText",
        value: "",
        hidden: true,
        controlOptions: {phonePrefix:"+966"},
        validators: [{ validation: ValidationsEnum.MOBILE_NUMBER }],
        validationLabels: {
          required: 'help.mobile-is-required',
          maxLength: 'help.mobile-max-length',
          translateOptions: { "0": '9' },
          pattern: 'help.mobile-format'
        }
      }),
      "unn": new TextInputControl({
        order: 1,
        columnCount: 4,
        label: "alias-management.unnNumber",
        class: "text-start color-arb-primaryText",
        value: "",
        hidden: true,
        validators: [{validation: ValidationsEnum.MIN_LENGTH, options: "10"}, {
          validation: ValidationsEnum.MAX_LENGTH,
          options: "10"
        }],
        validationLabels: {
          pattern: 'public.invalid-pattern',
        }
      }),
      "email": new TextInputControl({
        order: 1,
        columnCount: 4,
        label: "alias-management.email",
        class: "text-start color-arb-primaryText",
        value: "",
        hidden: true,
        validators: [{validation: ValidationsEnum.MIN_LENGTH, options: "5"}, {
          validation: ValidationsEnum.MAX_LENGTH,
          options: "30"
        }, {validation: ValidationsEnum.EMAIL}],
        validationLabels: {
          pattern: 'public.invalid-pattern',
        }
      }),
    }
  });
}

export function resonsForm() {
  return new FormModel({
    id: 'reasons',
    controls: {
      "status": new ProcedureStatusControl({
        order: 1,
        columnCount: 12,
        controlOptions: {
          type: 'Warning',
          title: 'alias-management.sureToUnlink',
          subTitle: 'alias-management.note'
        }
      }),
      "aliasManagementTitle": new TitleControl({
        columnCount: 12,
        order: 2,
        controlOptions: {
          id: "",
          title: 'alias-management.pleaseSelect',
          type: 'Section',
        },
      }),
      "notSatisfied": new SelectionControl({
        order: 4,
        columnCount: 12,
        required: false,
        validators: [],
        controlOptions: {
          title: [{text: 'alias-management.notSatisfied'}]
        },
      }),
      "privacyConcern": new SelectionControl({
        order: 4,
        columnCount: 12,
        required: false,
        validators: [],
        controlOptions: {
          title: [{text: 'alias-management.privacyConcern'}]
        },
      }),
      "notFriendy": new SelectionControl({
        order: 4,
        columnCount: 12,
        required: false,
        validators: [],
        controlOptions: {
          title: [{text: 'alias-management.notFriendy'}]
        },
      }),
      "other": new SelectionControl({
        order: 4,
        columnCount: 12,
        required: false,
        validators: [],
        controlOptions: {
          title: [{text: 'alias-management.other'}]
        },
      }),
    }
  });
}

export function successForm() {
  return new FormModel({
    id: 'reasons',
    controls: {
      "status": new ProcedureStatusControl({
        order: 1,
        columnCount: 12,
        controlOptions: {
          type: 'Success',
          title: 'alias-management.successfully',
          subTitle: 'alias-management.note'
        }
      })
    }
  });
}

export function errorForm() {
  return new FormModel({
    id: 'reasons',
    controls: {
      "status": new ProcedureStatusControl({
        order: 1,
        columnCount: 12,
        controlOptions: {
          type: 'Error',
          title: 'alias-management.error',
          subTitle: 'alias-management.tryAgain'
        }
      })
    }
  });
}
