import { Component } from '@angular/core';
import { TextInputControl } from '../../../@core/model/dto/control/text-input-control';
import { PhoneControl } from '../../../@core/model/dto/control/phone-control';
import { ButtonControl } from '../../../@core/model/dto/control/button-control';
import { FormModel } from '../../../@core/model/dto/formModel';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContactUsReq } from '../../../@core/model/rest/contactus/contact-us-req';
import { PreLoginService } from '../../../@core/service/conatct-us/pre-login.service';
import { environment } from '../../../../environments/environment';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { TranslateService } from '@ngx-translate/core';
import { ValidationsEnum } from '../../../@core/model/dto/validations-enum';
import { Router } from '@angular/router';
import { AlertModel } from 'app/@core/model/dto/alert.model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  alert!: AlertModel | null;
  contactUsForm: FormModel[] = [
    new FormModel({
      id: 'contact-us-form',
      controls: {
        contactInfoControls: new TextInputControl({
          required: true,
          validationLabels: {
            required: 'public.validations.required',
          },
        }),
        email: new TextInputControl({
          required: true,
          validators: [{ validation: ValidationsEnum.EMAIL }],
          validationLabels: {
            required: 'public.validations.required',
            pattern: 'public.validations.invalid-format',
          },
        }),
        phoneNumber: new PhoneControl({
          required: true,
          validators: [{ validation: ValidationsEnum.MOBILE_NUMBER_WITH_05 }],
          validationLabels: {
            required: 'public.validations.required',
            pattern: 'public.validations.invalid-format',
          },
        }),
        comments: new TextInputControl({
          required: true,
          validationLabels: {
            required: 'public.validations.required',
          },
        }),
        sendMsgBtn: new ButtonControl({
          controlOptions: {
            id: '',
            type: 'primary',
            text: '',
          },
        }),
      },
    }),
  ];
  contactInfoControls: any = {
    name: {
      key: 'name',
      label: 'public.name',
      required: true,
      order: 1,
      validationLabels: {
        required: 'public.validations.required',
      },
      value: '',
      columnCount: 12,
      class: 'text-start',
    },
    email: {
      key: 'email',
      label: 'public.email',
      required: true,
      order: 1,
      validators: [{ validation: ValidationsEnum.EMAIL }],
      validationLabels: {
        required: 'public.validations.required',
        pattern: 'public.validations.invalid-format',
      },
      value: '',
      columnCount: 12,
      class: 'text-start',
    },
    phoneNumber: {
      key: 'phoneNumber',
      label: 'public.phnNum',
      required: true,
      order: 1,
      validators: [{ validation: ValidationsEnum.MOBILE_NUMBER_WITH_05 }],
      validationLabels: {
        required: 'public.validations.required',
        pattern: 'public.validations.invalid-format',
      },
      value: '',
      columnCount: 12,
      class: 'text-start',
    },
    comments: {
      key: 'comments',
      label: 'public.message',
      required: true,
      order: 1,
      validationLabels: {
        required: 'public.validations.required',
      },
      value: '',
      columnCount: 12,
      class: 'text-start',
    },
  };

  start: ButtonModel[] = [
    {
      type: 'secondary',
      id: 'userResourcesStart',
      text: 'public.back',
    },
  ];

  constructor(
    private modalService: NgbModal,
    private service: PreLoginService,
    private translateService: TranslateService,
    private router: Router
  ) {}

  openContactUs(content: any) {
    this.alert = null;
    this.contactUsForm[0].controls = {};
    this.contactUsForm[0].addControl(
      'name',
      new TextInputControl(this.contactInfoControls['name'])
    );
    this.contactUsForm[0].addControl(
      'email',
      new TextInputControl(this.contactInfoControls['email'])
    );
    this.contactUsForm[0].addControl(
      'phoneNumber',
      new PhoneControl(this.contactInfoControls['phoneNumber'])
    );
    this.contactUsForm[0].addControl(
      'comments',
      new TextInputControl(this.contactInfoControls['comments'])
    );
    this.contactUsForm[0].addControl(
      'sendMsgBtn',
      new ButtonControl({
        order: 4,
        controlOptions: {
          id: 'sendMsg',
          type: 'primary',
          text: 'login.sndMsg',
          isDisable: true,
        },
        columnCount: 12,
      })
    );

    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      modalDialogClass: 'view-enhancement modalHeader',
      centered: true,
      size: 'xl',
    });
  }

  onResultChange($event: any) {
    if ($event[0].id === 'contact-us-form')
      this.contactUsForm[0].controls['sendMsgBtn'].controlOptions.isDisable =
        !$event[0].valid;
  }

  openTermsAndConditions(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      modalDialogClass: 'terms-conditions modalHeader',
      centered: true,
      size: 'xxl',
    });
  }

  sendMessage(templateRef: any) {
    this.contactUsForm[0].controls['sendMsgBtn'].controlOptions!.showLoading =
      true;
    const req: ContactUsReq = {
      email: this.contactUsForm[0].controls['email'].value,
      contactName: this.contactUsForm[0].controls['name'].value,
      mobileNumber: this.contactUsForm[0].controls['phoneNumber'].value,
      comments: this.contactUsForm[0].controls['comments'].value,
    };
    this.service.sendMessage(req).subscribe({
      next: () => {
        this.alert = {
          id: 'send-Message-model',
          type: 'Success',
          title: 'company-admin.user-info.delete-success-title',
          message: this.translateService.instant('help.contactMessage'),
          showClose: true,
        };
        this.contactUsForm[0].controls[
          'sendMsgBtn'
        ].controlOptions!.showLoading = false;
        this.contactUsForm[0].controls['sendMsgBtn'].controlOptions.isDisable =
          false;

        Object.keys(this.contactUsForm[0].controls).forEach((key) => {
          this.contactUsForm[0].controls[key].setValue(null);
        });
      },
      error: (e) => {
        this.alert = {
          id: 'send-Message-model',
          type: 'Critical',
          title: 'public.error',
          message: `${e.statusText}`,
          showClose: true,
        };
        this.contactUsForm[0].controls[
          'sendMsgBtn'
        ].controlOptions!.showLoading = false;
        this.contactUsForm[0].controls['sendMsgBtn'].controlOptions.isDisable =
          false;
      },
    });
  }

  alertClose() {
    this.alert = null;
  }

  goToLink(doc: string) {
    let docURL =
      environment.baseUrl +
      environment.documentContext +
      doc +
      this.translateService.currentLang +
      '.pdf';
    window.open(docURL, '_blank');
  }

  openKYC() {
    let eKYCURL =
      'https://eservice.alrajhibank.com.sa/Business/UpdateSoleInformation/';
    window.open(eKYCURL, '_blank');
  }

  openFinancial() {
    this.router.navigate(['/cash-management-products-ext']);
  }

  close() {
    this.modalService.dismissAll();
  }
}
