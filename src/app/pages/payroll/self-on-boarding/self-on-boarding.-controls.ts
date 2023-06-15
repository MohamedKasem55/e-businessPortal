import {AgreementTemplateDTOList} from "../../../@core/model/rest/payroll/self-on-boarding/payroll-agreement-template-list-res";
import {TranslateService} from "@ngx-translate/core";
import {GenericFeatureListModel} from "arb-design-library/model/generic-feature-list.model";
import {FormModel} from "../../../@core/model/dto/formModel";
import {TitleControl} from "../../../@core/model/dto/control/title-control";
import {SummaryItemControl} from "../../../@core/model/dto/control/sumery-item-control";
import {DropdownControl} from "../../../@core/model/dto/control/dropdown-control";
import {TextInputControl} from "../../../@core/model/dto/control/text-input-control";
import {ValidationsEnum} from "../../../@core/model/dto/validations-enum";
import {SelectionControl} from "../../../@core/model/dto/control/selection-control";
import {ResultModal} from "../../../@core/model/dto/result.modal";
import {GenericFeatureListGroupControl} from "../../../@core/model/dto/control/generic-feature-list-group-control";
import {PayrollType} from "../payroll-type";

export function buildFeesBoxesForm(payrollType: string, translate: TranslateService) {
  return new FormModel({
    id: "boxesFromList",
    controls: {
      boxesTitles: new TitleControl({
        order: 1,
        columnCount: 12,
        value: undefined,
        controlOptions: {
          id: 'boxesTitles',
          type: 'Section',
          title: translate.instant('payroll.self-onBoarding.' + payrollType + '.fees-title'),
        },
      }),
      boxesList: new GenericFeatureListGroupControl({
        order: 2,
        columnCount: 12,
        value: "",
        controlOptions: {
          list: []
        },
      })
    }
  });
}

export function buildApplyForm(payrollType: string): FormModel {
  let form!: FormModel;
  switch (payrollType) {
    case PayrollType.WPS_PLUS:
      form = new FormModel({
        id: "applyUpdateForm",
        controls: {
          pageTitle: new TitleControl({
            order: 2,
            columnCount: 12,
            controlOptions: {
              id: 'pageTitle',
              type: 'Section',
              title: 'payroll.self-onBoarding.wps-plus.agreement-fees',
            },
          }),
          monthlyFees: new SummaryItemControl({
            order: 6,
            columnCount: 6,
            label:'payroll.self-onBoarding.wps.monthly-fees',
            value: ""
          }),
          payrollPlusFees: new SummaryItemControl({
            order: 7,
            columnCount: 6,
            label: 'payroll.self-onBoarding.wps-plus.payroll-plus-fees',
            value: ""
          }),
          chargeAccount: new TitleControl({
            order: 14,
            columnCount: 12,
            controlOptions: {
              id: 'chargeAccount',
              type: 'Section',
              title:  'payroll.self-onBoarding.wps.charge-account',
            },
          }),
          selectChargeAccount: new DropdownControl({
            label: "payroll.self-onBoarding.wps-plus.select-account",
            required: true,
            order: 15,
            columnCount: 6,
            controlOptions: {
              columnId: 'ibanNumber',
              textField: ['alias', 'fullAccountNumber'],
              hasSearch: false,
              endTextField: 'availableBalance',
              endTextCurrencyField: 'currency',
              options: [],
              disabledField: "disabled",
            }

          }),
          molId: new TextInputControl({
            label: "payroll.self-onBoarding.wps-plus.mol_id",
            required: true,
            value: "",
            order: 16,
            columnCount: 6,
            validators: [{ validation: ValidationsEnum.MOL_ID }],
          }),
          // disclaimerTitle: new TitleControl({
          //   order: 18,
          //   columnCount: 12,
          //   controlOptions: {
          //     id: 'disclaimerTitle',
          //     type: 'Section',
          //     title: 'payroll.payroll-wps-plus.self-onBoarding.disclaimer-title',
          //   },
          // }),
          // disclaimer: new LineCardControl({
          //   order: 19,
          //   columnCount: 12,
          //   controlOptions: {
          //     title: 'payroll.payroll-wps-plus.self-onBoarding.disclaimer-text',
          //   },
          // }),
          termsAndConditions: new SelectionControl({
            order: 19,
            columnCount: 12,
            required: true,
            validators: [{ validation: ValidationsEnum.TRUE }],
            controlOptions: {
              title: [{ text: 'payroll.self-onBoarding.wps.terms-conditions', }, {
                text: 'payroll.self-onBoarding.wps.terms-conditions',
                linkId: "termsAndConditionsLink"
              }]
            },
          }),
        }
      });
      break
    case PayrollType.WPS:
      form = new FormModel({
        id: "applyUpdateForm",
        controls: {
          pageTitle: new TitleControl({
            order: 2,
            columnCount: 12,
            controlOptions: {
              id: 'pageTitle',
              type: 'Section',
              title: 'payroll.self-onBoarding.wps.agreement-fees',
            },
          }),
          monthlyFees: new SummaryItemControl({
            order: 6,
            columnCount: 6,
            label:'payroll.self-onBoarding.wps.monthly-fees',
            value: ""
          }),
          recordFees: new SummaryItemControl({
            order: 7,
            columnCount: 6,
            label: 'payroll.self-onBoarding.wps.record-fees',
            value: ""
          }),
          chargeAccount: new TitleControl({
            order: 14,
            columnCount: 12,
            controlOptions: {
              id: 'chargeAccount',
              type: 'Section',
              title: 'payroll.self-onBoarding.wps.charge-account',
            },

          }),
          selectChargeAccount: new DropdownControl({
            label: "payroll.self-onBoarding.wps.select-account",
            required: true,
            order: 15,
            columnCount: 6,
            controlOptions: {
              columnId: 'ibanNumber',
              textField: ['alias', 'fullAccountNumber'],
              hasSearch: false,
              endTextField: 'availableBalance',
              endTextCurrencyField: 'currency',
              options: [],
              disabledField: "disabled",
            }
          }),
          molId: new TextInputControl({
            label: "payroll.self-onBoarding.wps.mol_id",
            required: true,
            value: "",
            order: 16,
            columnCount: 6,
            validators: [{ validation: ValidationsEnum.MOL_ID }],
          }),
          // disclaimerTitle: new TitleControl({
          //   order: 18,
          //   columnCount: 12,
          //   controlOptions: {
          //     id: 'disclaimerTitle',
          //     type: 'Section',
          //     title: 'payroll.payroll-wps.self-onBoarding.disclaimer-title',
          //   },
          // }),
          // disclaimer: new LineCardControl({
          //   order: 19,
          //   columnCount: 12,
          //   controlOptions: {
          //     title: 'payroll.payroll-wps.self-onBoarding.disclaimer-text',
          //   },
          // }),
          termsAndConditions: new SelectionControl({
            order: 19,
            columnCount: 12,
            required: true,
            validators: [{ validation: ValidationsEnum.TRUE }],
            controlOptions: {
              title: [{ text: 'payroll.self-onBoarding.wps.terms-conditions'}, {
                text: 'payroll.self-onBoarding.wps.terms-conditions',
                linkId: "termsAndConditionsLink"
              }]
            },
          }),
        }
      });
      break
  }
  return form
}

export function fillResult(translate: TranslateService): ResultModal {
  return {
    type: 'Success',
    title:  'payroll.self-onBoarding.wps.success-title',
    subTitle: translate.instant( 'payroll.self-onBoarding.wps.success-subTitle'),
    summary: {}
  };
}

export function buildGenericFeatureListModels(templateDTOLists: AgreementTemplateDTOList[], payrollType: string, isFirstTime: boolean, translate: TranslateService): GenericFeatureListModel[] {
  let genericFeatureListModels: GenericFeatureListModel[] = [];
  switch (payrollType) {
    case PayrollType.WPS:
      templateDTOLists.forEach((itm: AgreementTemplateDTOList, index: number) => {
        let boxNumber = index + 1;
        if (isFirstTime) {
          genericFeatureListModels.push({
            id: ("box:" + boxNumber),
            title: ("box " + boxNumber),
            description: (translate.instant("payroll.self-onBoarding.wps.generic-feature-description.from") + ' ' +
              itm.employeeCountMinimum + ' ' + translate.instant("payroll.self-onBoarding.wps.generic-feature-description.to") + ' ' +
              itm.employeeCountMaximum + ' ' + translate.instant("payroll.self-onBoarding.wps.generic-feature-description.employees")),
            features: [
              {
                icon: "arb-icon-billAmount",
                text: translate.instant('payroll.self-onBoarding.wps.monthly-fees'),
                amount: (itm.monthlyFees).toString(),
                currency: "SAR"
              },
              {
                icon: "arb-icon-saudiDollar",
                text: translate.instant('payroll.self-onBoarding.wps.local-fees'),
                amount: (itm.localTxFees).toString(),
                currency: "SAR"
              },
              {
                icon: "arb-icon-Alrajhi",
                text: translate.instant("payroll.self-onBoarding.wps.rajhi-fees"),
                amount: (itm.rajhiTxFees).toString(),
                currency: "SAR"
              }
            ],
            featureButton: {
              id: "ApplyNowButton",
              text: "payroll.self-onBoarding.wps.apply-now",
              type: "outLine",
            }
          })
        } else {
          genericFeatureListModels.push({
            id: ("box:" + boxNumber),
            title: ("box " + boxNumber),
            description: (translate.instant("payroll.self-onBoarding.wps.generic-feature-description.from") + ' ' +
              itm.employeeCountMinimum + ' ' + translate.instant("payroll.self-onBoarding.wps.generic-feature-description.to") + ' ' +
              itm.employeeCountMaximum + ' ' + translate.instant("payroll.self-onBoarding.wps.generic-feature-description.employees")),
            features: [
              {
                icon: "arb-icon-saudiDollar",
                text: translate.instant('payroll.self-onBoarding.wps.local-fees'),
                amount: (itm.localTxFees).toString(),
                currency: "SAR"
              },
              {
                icon: "arb-icon-Alrajhi",
                text: translate.instant("payroll.self-onBoarding.wps.rajhi-fees"),
                amount: (itm.rajhiTxFees).toString(),
                currency: "SAR"
              }
            ],
            featureButton: {
              id: "ApplyNowButton",
              text: "payroll.self-onBoarding.wps.apply-now",
              type: "outLine",
            }
          })
        }

      })
      break
    case PayrollType.WPS_PLUS:
      templateDTOLists.forEach((itm: AgreementTemplateDTOList, index: number) => {
        let boxNumber = index + 1;
        if (isFirstTime) {
          genericFeatureListModels.push({
            id: ("box:" + boxNumber),
            title: ("box " + boxNumber),
            description: (translate.instant("payroll.self-onBoarding.wps-plus.generic-feature-description.from") + ' ' +
              itm.employeeCountMinimum + ' ' + translate.instant("payroll.self-onBoarding.wps-plus.generic-feature-description.to") + ' ' +
              itm.employeeCountMaximum + ' ' + translate.instant("payroll.self-onBoarding.wps-plus.generic-feature-description.employees")),
            features: [
              // {
              //   icon: "arb-icon-billAmount",
              //   text: translate.instant("payroll.self-onBoarding.wps-plus.monthly-fees"),
              //   amount: (itm.monthlyFees).toString(),
              //   currency: "SAR"
              // },
              {
                icon: "arb-icon-documentWithPlusText",
                text: translate.instant("payroll.self-onBoarding.wps-plus.payroll-plus-fees"),
                amount: (itm.blueCollarRajhiFee).toString(),
                currency: "SAR"
              }
            ],
            featureButton: {
              id: "ApplyNowButton",
              text: "payroll.self-onBoarding.wps-plus.apply-now",
              type: "outLine",
            }
          })
        } else {
          genericFeatureListModels.push({
            id: ("box:" + boxNumber),
            title: ("box " + boxNumber),
            description: (translate.instant("payroll.self-onBoarding.wps-plus.generic-feature-description.from") + ' ' +
              itm.employeeCountMinimum + ' ' + translate.instant("payroll.self-onBoarding.wps-plus.generic-feature-description.to") + ' ' +
              itm.employeeCountMaximum + ' ' + translate.instant("payroll.self-onBoarding.wps-plus.generic-feature-description.employees")),
            features: [
              {
                icon: "arb-icon-documentWithPlusText",
                text: translate.instant("payroll.self-onBoarding.wps-plus.payroll-plus-fees"),
                amount: (itm.blueCollarRajhiFee).toString(),
                currency: "SAR"
              }
            ],
            featureButton: {
              id: "ApplyNowButton",
              text: "payroll.self-onBoarding.wps-plus.apply-now",
              type: "outLine",
            }
          })
        }

      })
      break

  }

  return genericFeatureListModels;
}
