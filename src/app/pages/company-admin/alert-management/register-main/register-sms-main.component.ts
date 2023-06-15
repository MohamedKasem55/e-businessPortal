import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormResult, PageModel } from "app/@core/model/dto/formModel";
import { ResponseException } from "app/@core/service/base/responseException";
import { SmsAlertService } from "app/@core/service/company-admin/alert-mangement/sms-alert.service";
import { FormButtonClickOutput } from "app/shared/form/form.component";
import { getRegistrationTypeForm } from "./register-sms-main-controls";
import { CompanyAdminBaseComponent } from "../../company-admin-base/company-admin-base.component";
import { TitleModel } from "arb-design-library/model/title.model";
import {
  getUserBaseBackButton, getUserBaseCancelButton,
  getUserBaseNextButton,
  getUserBasePageTitle
} from "../../company-admin-base/company-admin-base.controls";
import { ButtonModel } from "arb-design-library/model/button.model";
import { SmsAlertSoloPropertyRes } from "app/@core/model/rest/company-admin/alert-management/sms-solo-property-res";

@Component({
  selector: 'app-alert-management-register-main',
  templateUrl: '../../company-admin-base/company-admin-base.component.html',
  styleUrls: []
})
export class AlertManagmentRegisterationMainComponent extends CompanyAdminBaseComponent implements OnInit {

  override pageTitle: TitleModel = getUserBasePageTitle();
  override backButton: ButtonModel = getUserBaseBackButton();
  override nextButton: ButtonModel = getUserBaseNextButton();
  cancelButton: ButtonModel = getUserBaseCancelButton();

  slectedOption!: string;
  soloPropertyRes!: SmsAlertSoloPropertyRes;

  constructor(
    public override router: Router,
    private alertService: SmsAlertService,) {
    super();
    this.endButtons = [];
    this.startButtons = [];
  }

  ngOnInit(): void {
    this.alertService.getSoloProperty().subscribe(
      {
        next: (res) => {
          this.soloPropertyRes = res;
          if (this.soloPropertyRes.user)
            this.drawPages()
          else {
            this.router.navigateByUrl("/company-admin/alert-management-sms-register-user", { state: this.soloPropertyRes }).then(() => {
            });
          }
        },
        error: (error: ResponseException) => {
        }
      })
  }

  drawPages() {
    this.setBreadcrumb([
      {
        text: 'company-admin.name',
        url: '/company-admin',
      },
      {
        text: 'company-admin.alert-management.alert-management-name',
        url: '/company-admin/alert-management',
        queryParams: { type: 'subscribed' }
      },
      {
        text: 'company-admin.alert-management.register',
        url: ''
      },
    ]);

    this.pageTitle.id = "alert-management-register";
    this.pageTitle.showArrow = true;
    this.pageTitle.title = "company-admin.alert-management.alert-management-name";
    this.pageTitle.endButtons = []
    this.pageTitle.stepper = undefined;
    this.startButtons = [this.cancelButton];
    this.endButtons = [this.nextButton];
    this.endButtons[0].isDisable = false;
    let page: PageModel = new PageModel(1);
    page.addForm(getRegistrationTypeForm());
    this.pages.push(page);
    this.getControl(0, 0, "registrationType").valueChanges.subscribe((value: any) => {
      console.log("Received Event");
      console.log(value);
      this.slectedOption = value.value;
    });
  }

  override onResultChanged(data: FormResult[]): void {
    let valid = true;
    data.forEach(item => {
      valid = valid && item.valid;
    })
    this.endButtons[0].isDisable = !valid;
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput): void {
    console.log(formButtonClickOutput.buttonId);
    switch (formButtonClickOutput.buttonId) {
      case 'Cancel':
        this.router.navigate(['/company-admin']).then(() => { });
        break;
      case 'Next':
        if (this.slectedOption === "0") {
          this.router.navigateByUrl("/company-admin/alert-management-sms-register-admin", { state: this.soloPropertyRes }).then(() => {
          });
        } else if (this.slectedOption === "1") {
          this.router.navigateByUrl("/company-admin/alert-management-sms-register-user", { state: this.soloPropertyRes }).then(() => {
          });
        }
        break;
      case 'arrowTitle':
        this.router
          .navigate(['/company-admin/alert-management'], { queryParams: { type: 'subscribed' } })
          .then(() => {
          });
        break;
    }
  }

}
