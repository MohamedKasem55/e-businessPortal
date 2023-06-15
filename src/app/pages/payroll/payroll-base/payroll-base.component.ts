import {FormResult, PageModel} from "../../../@core/model/dto/formModel";
import {TranslateService} from "@ngx-translate/core";
import {ServiceLocator} from "../../../@core/service/base/service-locator.service";
import {BreadcrumbService} from "../../../@core/service/base/breadcrumb.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {ButtonModel} from "arb-design-library/model/button.model";
import {ControlBase} from "../../../@core/model/dto/control/control.model";
import {ModelAndListService} from "../../../@core/service/base/modelAndList.service";
import {AlertModel} from "../../../@core/model/dto/alert.model";
import {VerificationService} from "../../../@core/service/base/verification.service";
import {PopupService} from "../../../@core/service/base/popup.service";
import {WpsPayrollService} from "../payroll-wps/wps-payroll-service";
import {TitleModel} from "arb-design-library/model/title.model";
import {PayrollAgreementsService} from "../payroll-agreemnts-service";
import {WpsPlusPayrollService} from "../payroll-plus/wps-plus-payroll.service";
import { Utils } from "app/@core/utility/Utils";


export class PayrollBaseComponent {

  breadcrumbService!: BreadcrumbService;
  translate!: TranslateService;
  modelAndListService!: ModelAndListService;
  additionalRefundButton!: ButtonModel;
  pendingActionsButton!: ButtonModel;
  router: Router;
  activateRouter: ActivatedRoute;
  alertModel!: AlertModel;
  verificationService: VerificationService;
  popService: PopupService;
  wpsService: WpsPayrollService
  wpsPlusPayrollService: WpsPlusPayrollService
  payrollAgreementsService: PayrollAgreementsService
  cancelButton: ButtonModel = {
    id: 'Cancel',
    text: 'public.cancel',
    type: "secondary"
  }
  payrollButton: ButtonModel = {id: "goToPayroll", text: 'payroll.payroll-wps.buttons.go-back-to-wps', type: "primary"}
  dashboardButton:ButtonModel={id:"goToDashBoard",text:'public.go-to-dashboard',type:"primary"}


  constructor() {
    this.breadcrumbService = ServiceLocator.injector.get(BreadcrumbService);
    this.translate = ServiceLocator.injector.get(TranslateService);
    this.router = ServiceLocator.injector.get(Router)
    this.modelAndListService = ServiceLocator.injector.get(ModelAndListService)
    this.activateRouter = ServiceLocator.injector.get(ActivatedRoute)
    this.verificationService = ServiceLocator.injector.get(VerificationService)
    this.popService = ServiceLocator.injector.get(PopupService)
    this.wpsService = ServiceLocator.injector.get(WpsPayrollService)
    this.payrollAgreementsService = ServiceLocator.injector.get(PayrollAgreementsService)
    this.wpsPlusPayrollService = ServiceLocator.injector.get(WpsPlusPayrollService);
  }

  protected getPayrollType(): string {
    let stringType = this.router.url.split('/').pop()
    stringType = (stringType) ? stringType : ''
    return stringType;
  }

  stepperMoveNext(pageTitle: TitleModel) {
    pageTitle.stepper!.stepCounter++;
    Utils.scrollTop();
  }

  stepperMoveBack(pageTitle: TitleModel) {
    pageTitle.stepper!.stepCounter--;
    Utils.scrollTop();
  }

  getControl(pages: PageModel[], pageIndex: number, formIndex: number, controlKey: string): ControlBase<any> {
    return pages[pageIndex]?.forms[formIndex]?.controls[controlKey];
  }

  goBackToPayroll(extras?: NavigationExtras) {
    void this.router.navigate(['/payroll/employee/list', this.getPayrollType()], extras)
  }

  goToPayrollLanding() {
    void this.router.navigateByUrl("payroll")
  }
  goToDashBoard(){
    void this.router.navigateByUrl("dashboard")
  }

  onResultChanged(forms: FormResult[], endButtons: ButtonModel[]): void {
    let valid: boolean[] = [];
    forms.forEach(form => {
      if (form.valid) {
        valid.push(true)
      } else {
        valid.push(false)
      }
    })
    for (let button of endButtons) {
      button.isDisable = valid.includes(false);
    }
  }
}
