import { Component } from '@angular/core';
import {
  COM_AD,
  COM_AD_NATIONAL_ADDRESS,
} from 'app/@core/constants/pages-urls-constants';
import { FormResult, PageModel } from 'app/@core/model/dto/formModel';
import {
  GenerateChallengeAndOTP,
  RequestValidate,
} from 'app/@core/model/rest/common/otp.model';
import {
  NationalAddressRegisterNewReq,
  NationalAddressRegisterNewRes,
} from 'app/@core/model/rest/company-admin/national-address/national-address-res';
import { ResponseException } from 'app/@core/service/base/responseException';
import { VerificationService } from 'app/@core/service/base/verification.service';
import { NationalAddressService } from 'app/@core/service/company-admin/national-address/national-address.service';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { SummaryModel } from 'arb-design-library/model/summary.model';
import { CompanyAdminBaseComponent } from '../company-admin-base/company-admin-base.component';
import {
  fillErrorResult,
  fillSuccessResult,
  getEndButtons,
  nationalAddressForm,
} from './national-address-controls';

@Component({
  selector: 'app-national-address',
  templateUrl: '../company-admin-base/company-admin-base.component.html',
  styleUrls: [],
})
export class NationalAddressComponent extends CompanyAdminBaseComponent {
  generateChallengeAndOTP!: GenerateChallengeAndOTP;
  constructor(
    private nationalAddressService: NationalAddressService,
    private otpService: VerificationService
  ) {
    super();

    this.setBreadcrumb([
      {
        text: 'company-admin.name',
        url: `/${COM_AD}`,
      },
      {
        text: 'national-address.title',
        url: `/${COM_AD_NATIONAL_ADDRESS}`,
      },
    ]);

    this.pageTitle = {
      id: 'national-address',
      title: 'national-address.title',
      showArrow: true,
      stepper: {
        steps: ['', '', ''],
        stepCounter: 1,
        stepText: 'public.step',
        ofText: 'public.of',
      },
    };
    this.drawPage();
  }

  drawPage(): void {
    this.nationalAddressService.getRegions().subscribe({
      next: (response) => {
        this.pages = [
          new PageModel(1, nationalAddressForm(response.regionList)),
        ];
        
        this.getControl(0, 0, 'selectRegion').valueChanges.subscribe(
          (formValueChange: any) => {
            this.nationalAddressService
              .getCities(formValueChange.value.key)
              .subscribe({
                next: (response) => {
                  this.getControl(0, 0, 'selectCity').controlOptions.options =
                    response.cityList;
                },
                error: () => {},
              });
          }
        );
      },
      error: () => {},
    });
  }

  override onResultChanged(data: FormResult[]) {
    this.endButtons[0].isDisable = !data[0].valid;
  }

  returnRequestRegister(): NationalAddressRegisterNewReq {
    return {
      nationalAddressDTO: {
        stateProvince: this.getControl(0, 0, 'selectRegion').value.key,
        city: this.getControl(0, 0, 'selectCity').value.key,
        ctryDistrict: this.getControl(0, 0, 'district').value,
        streetName: this.getControl(0, 0, 'streetName').value,
        postalCode: this.getControl(0, 0, 'postalCode').value.toString(),
        additionalNum: this.getControl(0, 0, 'additionalCode').value.toString(),
        buildingNum: this.getControl(0, 0, 'buildingNumber').value.toString(),
        unitNum: this.getControl(0, 0, 'unitNumber').value.toString(),
      },
    };
  }

  showOtp(): void {
    this.otpService
      .showVerification(this.generateChallengeAndOTP)
      .subscribe((res: RequestValidate) => {
        this.register();
      });
  }

  register(): void {
    this.nextButton.showLoading = true;
    this.nationalAddressService
      .register(this.returnRequestRegister())
      .subscribe({
        next: (res: NationalAddressRegisterNewRes) => {
          this.stepperMoveNext();
          this.startButtons = [];
          this.endButtons = getEndButtons();
          this.summary = {};
          this.result = fillSuccessResult();
          const newWelcome = JSON.parse(sessionStorage.getItem('welcome')!);
          newWelcome.nationalAdress = 'Y';
          sessionStorage.setItem('welcome', newWelcome);
        },
        error: (error: ResponseException) => {
          this.stepperMoveNext();
          this.startButtons = [];
          this.endButtons = getEndButtons();
          this.summary = {};
          this.result = fillErrorResult(error.ErrorResponse.errorDescription!);
        },
      });
  }

  backClick(): void {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.router.navigate([`/${COM_AD}`]);
        break;
      case 2:
        this.stepperMoveBack();
        this.endButtons = [this.nextButton];
        break;
    }
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'Next':
        this.summary = this.fillSummary();
        this.stepperMoveNext();
        this.endButtons = [this.confirmButton];
        break;
      case 'Confirm':
        this.generateChallengeAndOTP &&
        this.generateChallengeAndOTP.typeAuthentication
          ? this.showOtp()
          : this.register();
        break;
      case 'arrowTitle':
      case 'Back':
        this.backClick();
        break;
      case 'goToCompanyAdmin':
        this.pages = [];
        this.router.navigate([`/${COM_AD}`]);
        break;
      case 'goToDashboard':
        this.pages = [];
        this.router.navigate(['/dashboard']);
        break;
    }
  }

  fillSummary(): SummaryModel {
    return {
      sections: [
        {
          title: {
            id: 'national-address',
            title: 'national-address.title',
          },
          items: [
            {
              title: 'national-address.select-country',
              subTitle: 'Kingdom of Saudi Arabia',
            },
            {
              title: 'national-address.select-region',
              subTitle: this.getControl(0, 0, 'selectRegion').value.value,
            },
            {
              title: 'national-address.select-city',
              subTitle: this.getControl(0, 0, 'selectCity').value.value,
            },
            {
              title: 'national-address.district',
              subTitle: this.getControl(0, 0, 'district').value,
            },
            {
              title: 'national-address.street-name',
              subTitle: this.getControl(0, 0, 'streetName').value,
            },
            {
              title: 'national-address.postal-code',
              subTitle: this.getControl(0, 0, 'postalCode').value,
            },
            {
              title: 'national-address.additional-code',
              subTitle: this.getControl(0, 0, 'additionalCode').value,
            },
            {
              title: 'national-address.building-number',
              subTitle: this.getControl(0, 0, 'buildingNumber').value,
            },
            {
              title: 'national-address.unit-number',
              subTitle: this.getControl(0, 0, 'unitNumber').value,
            },
          ],
        },
      ],
    };
  }
}
