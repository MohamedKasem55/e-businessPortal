import {Component, ElementRef, ViewChild} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {VerificationService} from "./@core/service/base/verification.service";
import {GenerateChallengeAndOTP, RequestValidate} from "./@core/model/rest/common/otp.model";
import {PopupInputModel, PopupOutputModel} from "./@core/model/dto/popup.model";
import {PopupService} from "./@core/service/base/popup.service";
import {LanguageService} from "./@core/service/base/language.service";
import {LoadingService} from "./@core/service/base/loading.service";
import {Keepalive} from "@ng-idle/keepalive";
import {DEFAULT_INTERRUPTSOURCES, Idle} from "@ng-idle/core";
import {Router} from "@angular/router";
import {SessionService} from "./@core/service/base/session.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UserService} from "./@core/service/login/user.service";
import {getIdleForm} from "./app.component.controls";
import {KeyValue} from "@angular/common";
import {ThemeService} from "./theme";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {


  //OTP
  generateChallengeAndOTP!: GenerateChallengeAndOTP;


  //Popup
  popupInputModel: PopupInputModel = {};
  popupShow!: boolean;

  showSpinner: boolean = false;
  close: any = null;

  @ViewChild('idleModal')
  idleModal!: ElementRef;

  constructor(
    private translate: TranslateService,
    private sessionService: SessionService,
    private idle: Idle,
    private keepalive: Keepalive,
    private router: Router,
    private verificationService: VerificationService, private popupService: PopupService,
    private modalService: NgbModal,
    private userService: UserService,
    private loadingService: LoadingService,
    private themeService: ThemeService,
  ) {
    this.themeService.initiatTheme();

    ThemeService.onThemeChanged.subscribe(() => {
     document.getElementsByTagName("body")[0]!.style.backgroundColor= this.themeService.getActiveTheme().properties['--arb-secondaryCard'];
    });

    this.verificationService.onVerificationChangeDisplay().subscribe((data: GenerateChallengeAndOTP) => {
      this.generateChallengeAndOTP = structuredClone(data);
    });
    this.verificationService.closeVerification().subscribe({
      next: () => {
        this.close = !this.close;
      }
    })

    this.popupService.onShowPopupChange().subscribe((data: PopupInputModel) => {
      data.options = data.options || {centered: true};
      this.popupInputModel = data;
      this.popupShow = true;

    });

    this.popupService.onDismiss().subscribe((data) => {
      this.popupShow = false;
    });

    this.loadingService.onShowLoadingChange().subscribe((data) => {
      setTimeout(() => {
        this.showSpinner = data;
      });
    });

    this.initIdle();


  }


  onOtpCompleted(data: RequestValidate) {
    this.verificationService.setVerification(data);
  }

  onOtpDismiss() {
    this.verificationService.setDismiss();
  }

  onPopupButtonClick(data: PopupOutputModel) {
    this.popupService.onPopupButtonClick(data);
  }

  onEventTrigger(type: any) {
    this.verificationService.setEvent(type);
  }

  private initIdle() {
    if (sessionStorage.getItem("timeToLive")) {
      this.setIdleSettings(parseInt(sessionStorage.getItem("timeToLive")!));
    }
    this.sessionService.onSessionChanged().subscribe((val: KeyValue<string, string>) => {
      if (val.key == "timeToLive")
        this.setIdleSettings(parseInt(val.value));
    })
  }

  private setIdleSettings(timeToLive: number) {
    const TIMEOUT_PERIOD_SECONDS = 60;
    this.idle.setIdle(600);
    this.idle.setTimeout(TIMEOUT_PERIOD_SECONDS);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => {
      this.idle.stop();
    });


    //interval to force update token before token timeout - 60
    timeToLive = timeToLive <= 60 ? 61 : timeToLive; // handle negative value
    this.keepalive.interval(timeToLive - 60);
    this.keepalive.onPing.subscribe(() => {
      this.executeRefreshToken();
    });

    //Idle Time out Warning 60
    this.idle.onTimeoutWarning.subscribe((time: number) => {
      if (time === TIMEOUT_PERIOD_SECONDS) {
        this.popupService.showPopup({
            image: 'assets/img/warning.svg',
            form: getIdleForm(this.translate)
          }).subscribe((model: PopupOutputModel) => {
            if (model.buttonId === "renewButton") {
              this.popupService.dismiss();
            } else {
              this.endUserSession()
            }
        })
      }
    });

    // Time out
    this.idle.onTimeout.subscribe(() => {
      this.endUserSession()
    });
    this.idle.watch();

  }

  endUserSession() {
    this.modalService.dismissAll();
    this.idle.stop();
    this.idle.ngOnDestroy();
    this.keepalive.ngOnDestroy();
    void this.router.navigate(['/login']);
  }

  private executeRefreshToken() {
    this.userService.refreshToken()
    .subscribe({
      next: (res) => {
        // const currentTime = new Date().getTime() + 2 * 60 * 60 * 1000; // current time GMT+2
        // const sessionTimeInSeconds =
        //   (new Date(res.expirationTimestamp).getTime() -
        //     new Date(currentTime).getTime()) /
        //   1000;
        // this.sessionService.setSession(
        //   'timeToLive',
        //   sessionTimeInSeconds.toString()
        // );
        sessionStorage.setItem('token', res.token);
        this.popupService.dismiss();
        this.idle.watch();
      },
      error: () => {
        this.endUserSession();
      }
    });
  }
}

