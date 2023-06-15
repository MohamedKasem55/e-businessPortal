import { Component } from '@angular/core';
import { requiredDocForm } from "./request-required-doc.component.control";
import { PageModel } from "../../../../@core/model/dto/formModel";
import {ActivatedRoute } from '@angular/router';
import { MandatoryDocuments, MandatoryDocumentsResponse, DocumentInfo } from '../../../../@core/model/rest/finance/request/mandatory-documents';
import { FormButtonClickOutput } from "../../../../shared/form/form.component";
import { ValueChangeResult } from "../../../../@core/model/dto/control/control.model";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { GenericFeatureListControl } from "../../../../@core/model/dto/control/generic-feature-list-control";
import { FinanceProductCode } from '../../../../@core/model/rest/finance/request/products-codes';
import { GenerateChallengeAndOTP, RequestValidate } from 'app/@core/model/rest/common/otp.model';
import { VerificationService } from '../../../../@core/service/base/verification.service';
import { PosService } from '../../../../@core/service/finance/pos/pos.service';
import { RequestService } from '../../../../@core/service/finance/request/request.service';
import { FinanceBaseComponent } from '../../finance-base/finance-base.component';

@Component({
  selector: 'app-request-required-doc',
  templateUrl: '../../finance-base/finance-base.component.html',
  styleUrls: []
})
export class RequestRequiredDocComponent extends FinanceBaseComponent {

  public productName = '';
  public mandatoryDocuments: DocumentInfo[] = []
  public requiredDocsList: any = []
  public OTP = false
  public productInfo: any;
  public productCode: any;
  generateChallengeAndOTP: any;
  CheckKeyItems: any;
  productKey: any;
  constructor(
    public activeRoute: ActivatedRoute,
    private otpService: VerificationService,
    private PosService: PosService,
    private requestService: RequestService,


  ) {
    super();
    this.pageTitle = { id: '', title: '' }
if (!sessionStorage.getItem('productKey')) {
      this.productKey = sessionStorage.getItem('productKey');
    } else {
      this.productKey = FinanceProductCode.POS;
    }
  }


  drawPage(image: string, productName: string, desc: string, productCode: string, amount: string) {
    this.pages = [new PageModel(1, requiredDocForm(image, productName, desc, productCode, amount,this.requestService))]
    // this.service.getDocument('AlRajhi_Business_FAQ_V2.4_ar.pdf')
  }

  override ngOnInit() {
    this.getControl(1, 0, 'contract')
    this.getControl(1, 0, 'contract')?.valueChanges?.subscribe((res: ValueChangeResult) => {
    })
    this.activeRoute.queryParams
      .subscribe((params: any) => {
          this.productName = params.productName;
          if (this.productName == 'bif') {
            this.productCode = FinanceProductCode.BIF;
            this.drawPage('assets/img/bif.png', 'finance.products.bif', "finance.bifDesc", FinanceProductCode.BIF, '250000')
          } else if (this.productName == 'ecommerce') {
            this.productCode = FinanceProductCode.ECOMMERCE;
            this.drawPage('assets/img/e-commerce.png', 'finance.products.eCommerce', "finance.eCommerceDesc", FinanceProductCode.ECOMMERCE, '5000000')
          } else if (this.productName == 'fleet') {
            this.productCode = FinanceProductCode.FLEET;
            this.drawPage('assets/img/required-docs.svg', 'finance.products.fleet', "finance.requiredDocsDesc1", FinanceProductCode.FLEET, '')
          }
          this.getRequiredDocs();
        }
      )
    this.getRequiredDocs();
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'Next':
        this.nextClick()
        break;
      case 'Back':
        this.goBack();
        break;
      case 'terms':
        this.requestService.getDocument('AlRajhi_Business_FAQ_V2.4_en.pdf')
        break;
    }
  }

  nextClick() {
    if (this.productKey === FinanceProductCode.POS || this.productKey === FinanceProductCode.BIF || this.productKey === FinanceProductCode.ECOMMERCE) {
      this.PosService.initiate(this.productKey).subscribe((res) => {
        this.generateChallengeAndOTP = res.generateChallengeAndOTP;
        this.showOtp();
      })
    }else if(this.productKey === FinanceProductCode.FLEET) {
      this.showOtp();
    }
  }

  goBack() {
    this.router.navigate(['/finance/request/select-product']);
  }

  getRequiredDocs() {
    this.requestService.getMandatoryDocs().subscribe((res:MandatoryDocumentsResponse) => {
      if (res === null) {
        this.router.navigate(['/']).then(() => {
        })
      } else {
        if (res.documentInfos) {

          this.mandatoryDocuments = res.documentInfos
          this.mandatoryDocuments.map((element: any, index) => {
            this.requiredDocsList.push({text: element.description})
          })
          this.pages[0].forms[0].addControl("required docs", new GenericFeatureListControl({
            columnCount: 4,
            order: 5,
            controlOptions: <any>{
              title: "Required Documents",
              icon: "arb-icon-userGroup",
              features: this.requiredDocsList
            }
          }))
        }
      }
    })
  }

  validateUserToken(pin: any) {
    let otp = pin
    this.PosService.validateInitialOffer(otp, this.productKey).subscribe((data: any) => {
      if(this.productKey === FinanceProductCode.FLEET){
        void this.router.navigate(['/finance/fleet/business-details']);
      }else {
        void this.router.navigate(['/finance/pos']);
      }
    })
  }

  private showOtp() {
    let generateChallengeAndOTP: GenerateChallengeAndOTP
    if (this.generateChallengeAndOTP !== undefined) {
      generateChallengeAndOTP = this.generateChallengeAndOTP;
    } else {
      generateChallengeAndOTP = {
        typeAuthentication: 'OTP'
      }
    }

    this.otpService.showVerification(generateChallengeAndOTP).subscribe((data: RequestValidate) => {
      this.onOtpCompleted(data);
    });

    this.otpService.onDismiss().subscribe(() => {
    });
  }

  private onOtpCompleted(data: RequestValidate) {
    this.validateUserToken(data.otp);
  }

}
