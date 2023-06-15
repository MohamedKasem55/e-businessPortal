import { Component, OnInit } from '@angular/core';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { RequestService } from '../../../../@core/service/finance/request/request.service';
import { FinanceProductCode } from '../../../../@core/model/rest/finance/request/products-codes';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { LineCardControl } from '../../../../@core/model/dto/control/line-card-control';
import {
  BIFAvatar,
  checkUserHaveInProgressAccount,
  ecommerceAvatar,
  fleetAvatar,
  getParentReviewModel,
  PosAvatar,
} from './requested-finance.component.controller';
import {
  PopupInputModel,
  PopupOutputModel,
} from '../../../../@core/model/dto/popup.model';
import { ProcedureStatusControl } from '../../../../@core/model/dto/control/procedure-status-control';
import { PopupService } from '../../../../@core/service/base/popup.service';
import { Quotation } from '../../../../@core/model/rest/finance/request/quotation';
import {
  TrackApplication,
  UploadQuotation,
  DisbursmentList,
  BusinessDetail,
} from '../../../../@core/model/rest/finance/request/track-application';
import { contractLstRes } from 'app/@core/model/rest/finance/request/requested-finance';
import { TitleModel } from 'arb-design-library/model/title.model';
import { LineCardModel } from 'arb-design-library/model/line-card.model';

@Component({
  selector: 'app-requested-finance',
  templateUrl: './requested-finance.component.html',
})
export class RequestedFinanceComponent implements OnInit {
  public data: any = [];
  public lineCard!: LineCardControl;
  reviewForm: PopupInputModel = getParentReviewModel();
  endButtons: ButtonModel[] = [
    {
      id: 'next',
      type: 'primary',
      text: 'Next',
      showLoading: false,
    },
    {
      id: 'update',
      type: 'secondary',
      text: 'Update',
      showLoading: false,
    },
  ];

  cards: LineCardModel[] = [];

  constructor(
    private requestService: RequestService,
    public translate: TranslateService,
    private router: Router,
    private datePipe: DatePipe,
    private popupService: PopupService
  ) {}

  test(event: any) {
    console.log('card-gp-event=> ', event);
  }
  ngOnInit(): void {
    let data: { category: string } = {
      category: 'PENDING',
    };
    this.requestService.getContractList(data).subscribe((result) => {
      if (result !== null) {
        this.data = result.contractItems;

        this.data.forEach((element: contractLstRes) => {
          if (element.productKey.productCode === FinanceProductCode.FLEET) {
            (element.financeType = 'finance.fleet.newRequest.products.fleet'),
              (element.financeKey = 'financeProduct.fleetFinance');
            element.avatar = fleetAvatar;
            element.pillStatus = {
              text:
                this.requestService.getDossierStatus(element.dossierStatus) ||
                '',
              type:
                element.dossierStatus === 'APS'
                  ? 'Positive'
                  : element.dossierStatus === 'RJC'
                  ? 'Negative'
                  : 'Warning',
            };
          }

          element.currency = 'SAR';
          element.contractDate = this.getDate(element.contractDate);
          if (element.productKey.productCode === FinanceProductCode.POS) {
            (element.financeType = 'finance.fleet.newRequest.products.pos'),
              (element.financeKey = 'financeProduct.posFinance');
            element.avatar = PosAvatar;
            element.pillStatus = {
              text:
                this.requestService.getDossierStatus(element.dossierStatus) ||
                '',
              type:
                element.dossierStatus === 'APS'
                  ? 'Positive'
                  : element.dossierStatus === 'RJC'
                  ? 'Negative'
                  : 'Warning',
            };
          } else if (
            element.productKey.productCode === FinanceProductCode.BIF
          ) {
            (element.financeType = 'finance.fleet.newRequest.products.bif'),
              (element.financeKey = 'financeProduct.bifFinance');
            element.avatar = BIFAvatar;
            element.pillStatus = {
              text:
                this.requestService.getDossierStatus(element.dossierStatus) ||
                '',
              type:
                element.dossierStatus === 'APS'
                  ? 'Positive'
                  : element.dossierStatus === 'RJC'
                  ? 'Negative'
                  : 'Warning',
            };
          } else if (
            element.productKey.productCode === FinanceProductCode.ECOMMERCE
          ) {
            (element.financeType =
              'finance.fleet.newRequest.products.ecommerce'),
              (element.financeKey = 'financeProduct.ecommerceFinance');
            element.avatar = ecommerceAvatar;
            element.pillStatus = {
              text:
                this.requestService.getDossierStatus(element.dossierStatus) ||
                '',
              type:
                element.dossierStatus === 'APS'
                  ? 'Positive'
                  : element.dossierStatus === 'RJC'
                  ? 'Negative'
                  : 'Warning',
            };
          }
        });
        this.data.forEach((element: contractLstRes,index:number) => {
          this.cards.push({...element,
          ...{ id: `requested-finance-card-${index}`,
          title: element.financeType,
          subTitle: `${element.dossierID}`,
          hasBackground: true,
          amountPosition:'left',
          weight:'Bold',
          pill:element.pillStatus,
          currency:element.currency,
          avatar:element.avatar,
          amount:element.amt}})
        });
      }
    });
  }

  isApproved(status: any) {
    return status === 'APS' || status === 'APD' || status === 'CTD';
  }

  showDetails(data: any) {
    if (this.canProceed(data)) {
      localStorage.setItem(
        'FINANCE_PRODUCT_EXECUTION',
        JSON.stringify({
          dossierID: data.dossierID,
          amount: data.amt,
          productCode: data.productKey.productCode,
          status: data.firstDisbursmentDossierStatus,
          hasDisbursmentDossier: data.hasDisbursmentDossier,
        })
      );
      this.router.navigate(['/financeProduct/details/execution']);
    }
  }

  getDate(date: any) {
    if (date.timestamp) {
      return this.datePipe.transform(new Date(date.timestamp), 'dd/MM/yyyy');
    } else {
      return '';
    }
  }

  canProceed(row: any) {
    if (row.financeKey === 'financeProduct.posFinance') {
      if (row.hasDisbursmentDossier) {
        const dossierStatus = row.firstDisbursmentDossierStatus;
        return (
          dossierStatus === 'DDP' ||
          dossierStatus === 'DBD' ||
          dossierStatus === 'DCS' ||
          dossierStatus === 'DDW' ||
          dossierStatus === 'DSS'
        );
      } else {
        return this.isApproved(row.dossierStatus);
      }
    } else {
      return false;
    }
  }
  onDismiss() {
    this.popupService.dismiss();
  }

  goToChildContracts(buttonId: string, item: any) {
    console.log("item=>",item);

    sessionStorage.setItem('DOSSIER_ID', item.dossierID);
    sessionStorage.setItem('amt', item.amt);
    if (item.dossierStatus === 'PEN' || item.dossierStatus === 'RJC') {
      this.popupService
        .showPopup(
          checkUserHaveInProgressAccount(item.dossierID, item.dossierStatus,this.translate)
        )
        .subscribe((res: PopupOutputModel) => {
          if (res.buttonId == 'dashboardbtn') {
            this.router.navigate(['/dashboard']);
            this.onDismiss();
          } else {
            this.onDismiss();
          }
        });
    }
    console.log("item.financeKey=> ",item.financeKey);

    if (item.financeKey === 'financeProduct.fleetFinance') {
      if (item.childContracts.length > 0) {
        sessionStorage.setItem('parent_data', JSON.stringify(item));
        //call Track Application
        this.router.navigate(['/finance/request/child-dossiers'], {
          queryParams: { item: JSON.stringify(item) },
          skipLocationChange: true,
        });
      } else {
        sessionStorage.setItem('DOSSIER_ID', item.dossierID);
        this.getTrackApplicationData(item.dossierID);

        switch (item.dossierStatus) {
          case 'BDS':
            {
              this.router.navigate(['/finance/fleet/vehicle-details']);
            }
            break;
          case 'UFQ':
            {
              this.router.navigate(['/finance/fleet/upload-docs']);
            }
            break;
          case 'RDU':
            {
              this.router.navigate(['/finance/fleet/init-offer']);
            }
            break;
          case 'UAP':
            {
              //callingTrackApplicationAPI
              this.router.navigate(['/finance/fleet/summary']);
            }
            break;
          case 'FOI': {
            this.reviewForm.form?.addControl(
              'status',
              new ProcedureStatusControl({
                columnCount: 12,
                order: 1,
                controlOptions: {
                  type: 'Success',
                  title:
                    this.requestService?.getDossierStatus(item.dossierStatus) ||
                    '',
                  subTitle:`${this.translate.instant('finance.YOURAPPLICATION_Dossier')} ${item.dossierID} ${this.translate.instant('finance.Finalized')}`
                },
              })
            );
            this.popupService
              .showPopup(this.reviewForm)
              .subscribe((res: PopupOutputModel) => {
                if (res.buttonId === 'cancel') {
                  this.popupService.dismiss();
                }
                if (res.buttonId === 'finalOffer') {
                  this.router.navigate(['/finance/fleet/final-offer']);
                  this.popupService.dismiss();
                }
              });
            break;
          }
        }
      }
    } else if (item.financeKey === 'financeProduct.posFinance') {
      if (item?.childContracts.length > 0) {
        sessionStorage.setItem('parent_data', JSON.stringify(item));
        //call Track Application
        sessionStorage.setItem(
          'accountNum',
          this.requestService.TrackApplicationData.offer.acctNum
        );
        this.router.navigate(['/finance/request/child-dossiers'], {
          queryParams: { item: JSON.stringify(item) },
          skipLocationChange: true,
        });
      } else {
        sessionStorage.setItem('DOSSIER_ID', item.dossierID);
        switch (item.dossierStatus) {
          case 'DDP':
            {
              this.router.navigate(['/finance/pos/final-offer']);
            }
            break;
          case 'DDW':
            {
              this.router.navigate(['/finance/pos/contract-commodity']);
            }
            break;
          case 'DBD':
            {
              this.router.navigate(['/finance/pos/commodity-details']);
            }
            break;
          case 'DCS':
            {
              this.router.navigate(['/finance/pos/commodity-purchase']);
            }
            break;
          case 'DSS':
            {
              this.router.navigate(['/finance/pos/initiate-sanad']);
            }
            break;
        }
      }
    }
  }

  getCardDetails(cardId:string){
    let cardItem  = this.cards.find((element:any)=>{
      return element.id ===cardId
    });
    this.goToChildContracts(cardId,cardItem);
  }

  getTrackApplicationData(dossierID: string) {
    if (sessionStorage.getItem('DOSSIER_ID')) {
      this.requestService
        .getTrackingDataInquiry(dossierID)
        .subscribe((res: TrackApplication) => {
          this.requestService.setTrackApplicationData(res);
          this.setSessionData(res);
        });
    }
  }

  setSessionData(trackData: TrackApplication) {
    let externalQuotationList: UploadQuotation[] = [];
    let internalQuotationList: UploadQuotation[] = [];

    trackData.uploadedQuotationData?.forEach((element: UploadQuotation) => {
      if (element.quotationType === 'Internal') {
        internalQuotationList.push(element);
      } else {
        externalQuotationList.push(element);
      }
    });
    sessionStorage.setItem(
      'businessDetails',
      JSON.stringify(
        this.convertTrackAppToBusinessObj(
          trackData.creditLine.disbursmentList[0].posDetail
        )
      )
    );
    sessionStorage.setItem(
      'TExQuotations',
      JSON.stringify(externalQuotationList)
    );
    sessionStorage.setItem(
      'TInQuotations',
      JSON.stringify(internalQuotationList)
    );
    sessionStorage.setItem(
      'accountNum',
      trackData.creditLine.disbursmentList[0].posDetail
    );
    sessionStorage.setItem(
      'TrackDocuments',
      JSON.stringify(trackData.creditLine?.disbursmentList[0].documentsLst)
    );
    sessionStorage.setItem(
      'fleetLimit',
      JSON.stringify(trackData.creditLine?.totalAmt)
    );
  }

  convertTrackAppToBusinessObj(posDetail: BusinessDetail) {
    return {
      establishmentDate: posDetail.firstRePymtDate.startDate,
      businessActivities: posDetail.businessModel,
      businessLocation: posDetail.businessLocation,
      businessOutletsNum: posDetail.branchesNumber,
      businessType: posDetail.businessType,
      businessOutletsType: posDetail.branchType,
    };
  }
}
