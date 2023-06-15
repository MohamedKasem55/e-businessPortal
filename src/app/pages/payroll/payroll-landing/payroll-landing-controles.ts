import {BoxModel} from "arb-design-library/model/box.model";
import {PayrollType} from "../payroll-type";
import {AuthenticationUtils} from "../../../@core/utility/authentication-utils";

export function getPayrollBoxes(): BoxModel[] {
  let box: BoxModel[] = []
  if (AuthenticationUtils.hasAccess('WPS_MENU')) {
    box.push({
        id: PayrollType.WPS,
        text: 'payroll.landing-page.boxes.wps',
        subTitle: "payroll.landing-page.boxes.description.wps",
        icon: 'arb-icon-wps',
        isDisabled: false
      },
      // {
      //   id: PayrollType.WPS_MANAGE,
      //   text: 'Payroll WPS management',
      //   subTitle: 'New Payroll WPS',
      //   icon: 'arb-icon-wps',
      //   isDisabled: false
      // }
    )
  } else if (AuthenticationUtils.hasAccess('WPS_PAYROLL_SELF_ON_BOARDING')) {
    box.push({
      id: PayrollType.WPS_SELF_OB_BOARDING,
      text: 'payroll.landing-page.boxes.wps',
      subTitle: "payroll.landing-page.boxes.description.wps",
      icon: 'arb-icon-wps',
      isDisabled: false
    })
  }

  if (AuthenticationUtils.hasAccess('WPS_PLUS_MENU')) {
    box.push({
        id: PayrollType.WPS_PLUS,
        text: 'payroll.landing-page.boxes.wps-plus',
        subTitle: "payroll.landing-page.boxes.description.wps-plus",
        icon: 'arb-icon-wps',
        isDisabled: false

      }
    )
  } else if (AuthenticationUtils.hasAccess('WPS_PAYROLL_SELF_ON_BOARDING')) {
    box.push({
      id: PayrollType.WPS_PLUS_SELF_OB_BOARDING,
      text: 'payroll.landing-page.boxes.wps-plus',
      subTitle: "payroll.landing-page.boxes.description.wps-plus",
      icon: 'arb-icon-wps',
      isDisabled: false
    })
  }
  // box.push(
  //   {
  //     id: "cards",
  //     text: 'Payroll Cards',
  //     subTitle: 'Payroll Cards',
  //     icon: 'arb-icon-card',
  //     isDisabled: !AuthenticationUtils.hasAccess('PayrollCards')
  //
  //   },
  //   {
  //     id: PayrollType.WMS,
  //     text: 'Payroll WMS',
  //     subTitle: 'Payroll WMS',
  //     icon: 'arb-icon-loopArrowRight',
  //     isDisabled: !AuthenticationUtils.hasAccess('WMSPayrollMenu')
  //
  //   },
  // )
  return box;
}
