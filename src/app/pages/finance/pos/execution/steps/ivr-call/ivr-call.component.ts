import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PopupInputModel, PopupOutputModel } from '../../../../../../@core/model/dto/popup.model';
import { IVRCallModel } from './IVR-Call.component.controller';
import { PopupService } from 'app/@core/service/base/popup.service';
import { FinanceProductCode } from 'app/@core/model/rest/finance/request/products-codes';
import { RequestService } from '../../../../../../@core/service/finance/request/request.service';
import { IvrRes } from '../../../../../../@core/model/rest/finance/request/IvrRes';
import { IvrStateRequest } from '../../../../../../@core/model/rest/finance/request/IvrStateRequest';
import { IvrStateRes } from '../../../../../../@core/model/rest/finance/request/IvrStateRes';
import { IvrRequest } from '../../../../../../@core/model/rest/finance/request/IvrRequest';
import { FinalAgreementAcceptance } from '../../../../../../@core/model/rest/finance/request/final-agreement';
import { FinanceBaseComponent } from 'app/pages/finance/finance-base/finance-base.component';

@Component({
  selector: 'app-ivr-call-pos',
  templateUrl: '../../../../finance-base/finance-base.component.html',
})
export class IvrCallComponent extends FinanceBaseComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>()
  navigationScreen: string = '/'
  ivrStateRes!: IvrStateRes;
  callFinished: boolean = false
  callBtnState: boolean = false
  //Popup
  IVRCallModel: PopupInputModel = IVRCallModel()

  showSpinner: boolean = false;


  constructor(private popupService: PopupService, private requestService: RequestService) {
    super();
    this.popupService.showPopup(this.IVRCallModel).subscribe((res: PopupOutputModel) => {
    });
  }

  override ngOnInit(): void {
    this.InitiateIvrCall()
  }

  onPopupButtonClick(data: PopupOutputModel) {
    this.popupService.onPopupButtonClick(data);
  }

  InitiateIvrCall(): void {
    let ivrPayload: IvrRequest = {
      productCode: FinanceProductCode.POS,
      identifier: sessionStorage.getItem("DOSSIER_ID"),
      digitalSignatureActions: FinanceProductCode.POS,
    }
    this.requestService
      .initiateIvrCall(ivrPayload)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (respData: IvrRes) => {
          if (respData !== null) {
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
          } else {
            // this.router.navigate(['/'])
          }
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
            void this.router.navigate(['/finance/pos/initiate-sanad'])
          } else {
            this.router.navigate(['/finance/pos/contract-commodity'])
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
