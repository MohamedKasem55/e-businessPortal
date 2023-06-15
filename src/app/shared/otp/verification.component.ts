import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Verification} from "arb-design-library/model/verification.model";
import {NgbActiveModal, NgbModal, NgbModalConfig} from "@ng-bootstrap/ng-bootstrap";
import {TranslateService} from "@ngx-translate/core";
import {GenerateChallengeAndOTP, RequestValidate} from "../../@core/model/rest/common/otp.model";
import {Utils} from "../../@core/utility/Utils";

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent {

  @Input('close')
  set setClose(close: boolean) {
    this.modalService.dismissAll();
    this.activeModal.close();
  }

  generateChallengeAndOTP!: GenerateChallengeAndOTP;

  @Input('generateChallengeAndOTP')
  set setGenerateChallengeAndOTP(challengeAndOTP: GenerateChallengeAndOTP) {
    this.generateChallengeAndOTP = challengeAndOTP;
    if (challengeAndOTP) {
      let login = this.translateService.instant('login');
      switch (challengeAndOTP.typeAuthentication) {
        case "OTP":
          this.verification = {
            type: 'OTP',
            header: login['otp-title'],
            desc: login['otp-desc'],
            showError: false,
            errorMsg: login['otp-error-message'],
            countDesc: login['otp-count-desc'],
            maskedNum: this.getMaskedMobile(challengeAndOTP),
            timeToLive: challengeAndOTP.timeToLive || 420,
            actionText: login['otp-action-message'],

          }
          break;
        case "CHALLENGE":
          this.verification = {
            type: 'SFTK',
            showError: false,
            errorMsg: login['sftk-error-message'],
            header: login['sftk-title'],
            desc: login['sftk-desc'],
            actionText: login['sftk-action-message'],
            challengeResponseCodeSFTK: challengeAndOTP.challengeCode,
            challengeSFTK: challengeAndOTP.challengeCode,
          }
          break;
        case "IVR":
          this.verification = {
            type: 'IVR',
            showError: false,
            errorMsg: login['otp-error-message'],
            header: login['ivr-title'],
            desc: login['ivr-desc'],
            actionText: login['ivr-recall-desc'],
            receivedCallActionText: login["receivedCallAction"],
            maskedNum: this.getMaskedMobile(challengeAndOTP),
            timeToLive: challengeAndOTP.timeToLive || 420,
          }
          break;

      }
      this.openCentered();
    }
  }

  private getMaskedMobile(challengeAndOTP: GenerateChallengeAndOTP): string {
    if (challengeAndOTP.mobileNumber) {
      if (!challengeAndOTP.mobileNumber.includes("X")) {
        return Utils.mask(challengeAndOTP.mobileNumber, 3);
      } else {
        return challengeAndOTP.mobileNumber;
      }

    }
    return " +966 *** ******";
  }

  @Output()
  onEventTrigger: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  onComplete: EventEmitter<RequestValidate> = new EventEmitter<RequestValidate>();

  @Output()
  onDismiss: EventEmitter<null> = new EventEmitter<null>();

  @Output()
  onTimeOut: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('verificationModal')
  verificationModal!: ElementRef;

  verification!: Verification;

  validateResponse!: RequestValidate;


  constructor(private modalService: NgbModal, private modalConfig: NgbModalConfig, private activeModal: NgbActiveModal, private translateService: TranslateService) {

    modalConfig.backdrop = 'static';
    modalConfig.keyboard = false;
  }


  openCentered() {
    this.modalService.open(this.verificationModal, {centered: true, size: "lg"});
  }

  completeVerification(response: string) {
    if (this.generateChallengeAndOTP.typeAuthentication == 'OTP') {
      this.validateResponse = {
        otp: response,
        password: '',
        response: '',
        challengeNumber: '',
      }
    } else if (this.generateChallengeAndOTP.typeAuthentication === 'CHALLENGE') {
      this.validateResponse = {
        otp: '',
        password: '',
        response: '',
        challengeNumber: this.generateChallengeAndOTP.challengeCode,
        challengeResponse: response
      }
    } else {
      this.validateResponse = {
        otp: '',
        password: '',
        response: '',
        challengeNumber: '',
      }
    }
    this.modalService.dismissAll();
    this.onComplete.emit(this.validateResponse);
  }

  dismissModal() {
    this.modalService.dismissAll();
    this.onDismiss.emit();
  }

  timeOut() {
    this.onTimeOut.emit(true);
  }
}
