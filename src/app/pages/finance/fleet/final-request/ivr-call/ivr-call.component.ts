import {Component, OnInit} from '@angular/core';
import {PopupService} from "../../../../../@core/service/base/popup.service";
import {IvrRequest} from "../../../../../@core/model/rest/finance/request/IvrRequest";
import {FinanceProductCode} from "../../../../../@core/model/rest/finance/request/products-codes";
import {Subject, takeUntil} from "rxjs";
import {IvrStateRequest} from "../../../../../@core/model/rest/finance/request/IvrStateRequest";
import {IvrRes} from "../../../../../@core/model/rest/finance/request/IvrRes";
import {IvrStateRes} from "../../../../../@core/model/rest/finance/request/IvrStateRes";
import {GenerateChallengeAndOTP, RequestValidate} from "../../../../../@core/model/rest/common/otp.model";
import {VerificationService} from "../../../../../@core/service/base/verification.service";
import { FinalAgreementAcceptance } from '../../../../../@core/model/rest/finance/request/final-agreement';
import { RequestService } from '../../../../../@core/service/finance/request/request.service';
import { FinanceBaseComponent } from '../../../finance-base/finance-base.component';


@Component({
  selector: 'app-ivr-call',
  templateUrl: '../../../finance-base/finance-base.component.html',
})
export class IvrCallComponent extends FinanceBaseComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>()
  navigationScreen: string = '/'
  ivrStateRes!: IvrStateRes
  callFinished: boolean = false
  callBtnState: boolean = false
  generateChallengeAndOTP: GenerateChallengeAndOTP = {
    typeAuthentication: 'IVR'
  };

  showSpinner: boolean = false;

  constructor(private popupService: PopupService,
              private ivrService: VerificationService,
              private requestService:RequestService
              ) {
    super();
  }

  override ngOnInit(): void {
    this.InitiateIvrCall()
  }


  InitiateIvrCall(): void {
    let ivrPayload: IvrRequest = {
      productCode: FinanceProductCode.FLEET,
      identifier: sessionStorage.getItem("DOSSIER_ID"),
      digitalSignatureActions: FinanceProductCode.FLEET,
    }
    this.requestService
      .initiateIvrCall(ivrPayload)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (respData: IvrRes) => {
            this.ivrService.showVerification(this.generateChallengeAndOTP).subscribe((requestValidate: RequestValidate) => {});
            let count = 0
            let ivrStatePayload: IvrStateRequest = {
              bankTrxnRef: respData?.bankTrxnRef,
            }
            let reCallApi = setInterval(() => {
              count++
              if (count > 1) {
                this.callStateStatus(ivrStatePayload)
              }
              if (this.callFinished || count == 4) {
                clearInterval(reCallApi)
              }
            }, 10000)
        }
      )
  }

  callStateStatus(ivrData: IvrStateRequest) {
    this.requestService
      .digitalSignatureStatus(ivrData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (respData: IvrStateRes) => {
          if (respData) {
            this.ivrStateRes = respData
            this.callBtnState = true
            this.navigationScreen = '/financeProduct/fleet/request/ivr-result'
          } else {
            this.router.navigate(['/finance'])
          }
        }
      )
  }

  recallTime(event: any) {
    event ? this.InitiateIvrCall() : null
    this.callFinished = event
  }

  back(): void {
  }

  forward(): void {
    this.setIVRStatus()
    this.router.navigate([this.navigationScreen])
  }

  setIVRStatus() {

    let acceptInitialOffer:FinalAgreementAcceptance = {
      dosierID: sessionStorage.getItem('DOSSIER_ID') || "",
      body: {
        accepted: true,
        initialOffer: false,
        action: FinanceProductCode.FIRST_IVR
      }
    }
    this.requestService.setFinalAgreementAcceptance(acceptInitialOffer).subscribe(response => {
      if (response === null) {
        this.router.navigate(['/']).then(() => {
        });
      } else {
        this.router.navigate(['/finance/fleet/request/finish'])
      }
    }, error => {
      this.router.navigate(['/']).then(() => {
      })
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }

}
