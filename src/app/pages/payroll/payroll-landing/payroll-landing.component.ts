import {Component, OnInit} from '@angular/core';
import {TitleModel} from "arb-design-library/model/title.model";
import {BoxModel} from "arb-design-library/model/box.model";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {PayrollPagesNames} from "../payroll-pages-names";
import {getPayrollBoxes} from "./payroll-landing-controles";
import {PayrollType} from "../payroll-type";
import {PayrollAgreementsService} from "../payroll-agreemnts-service";
import {BreadcrumbService} from "../../../@core/service/base/breadcrumb.service";
import {AuthenticationUtils} from "../../../@core/utility/authentication-utils";

@Component({
  selector: 'app-payroll-landing',
  templateUrl: './payroll-landing.component.html'
})
export class PayrollLandingComponent implements OnInit {

  boxes !: BoxModel[];
  showPendingActions: boolean = AuthenticationUtils.showPendingActions;

  title: TitleModel = {
    id: "payrollTitle",
    type: "Page",
    title: "Payroll",
    endButtons: [
        // {
      //   id: "downloadFile",
      //   type: "secondary",
      //   text: "payroll.landing-page.buttons.file-download"
      // },
      // {
      //   id: PayrollPagesNames.APPROVAL_STATUS,
      //   type: "secondary",
      //   text: "payroll.approvalStatus"
      // },
      {
        id: PayrollPagesNames.PROCESSED_FILES,
        type: "secondary",
        text: "payroll.processedFiles.name",
      }
    ]
  }


  constructor(private router: Router, private translate: TranslateService,
              private payrollAgreementsService: PayrollAgreementsService,
              private breadcrumbService: BreadcrumbService) {
    this.boxes = getPayrollBoxes()
    this.breadcrumbService.setBreadcrumb([])
  }


  ngOnInit(): void {
  }

  onTitleButtonsClick(buttonId: string) {
    switch (buttonId) {
      case PayrollPagesNames.PROCESSED_FILES:
      case PayrollPagesNames.APPROVAL_STATUS:
        void this.router.navigate([PayrollPagesNames.PAYROLL , buttonId])
        break
    }
  }

  onBoxSelect(key: string) {
    switch (key) {
      case PayrollType.WPS:
      case PayrollType.WMS:
      case PayrollType.WPS_PLUS:
      case PayrollType.STANDARD:
        void this.router.navigate(['payroll/employee/list', key])
        break
      case PayrollType.WPS_SELF_OB_BOARDING:
        void this.router.navigate(['payroll/', PayrollPagesNames.SELF_ON_BOARDING, PayrollType.WPS],
          {state: {firstTime: !AuthenticationUtils.hasAccess('WPS_PLUS_MENU')}})
        break
      case PayrollType.WPS_PLUS_SELF_OB_BOARDING:
        void this.router.navigate(['payroll/', PayrollPagesNames.SELF_ON_BOARDING, PayrollType.WPS_PLUS],
          {state: {firstTime: !AuthenticationUtils.hasAccess('WPS_MENU')}})
        break
      case PayrollType.WPS_MANAGE:
        this.payrollAgreementsService.companyPayrollAgreementTemplateList.subscribe(res => {
          res.companyPayrollAgreementDTOS.forEach((item: any) => {
            if (item.status === "ACTIVE") {
              void this.router.navigate(['payroll/', PayrollPagesNames.SELF_ON_BOARDING, PayrollType.WPS],
                {state: {data: item}})
            } else {
              void this.router.navigate(['payroll/', PayrollPagesNames.SELF_ON_BOARDING, PayrollType.WPS])
            }
          })
        })
        break
    }

  }

}
