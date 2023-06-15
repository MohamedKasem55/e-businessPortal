import { Component } from "@angular/core";
import { PageModel } from "app/@core/model/dto/formModel";
import { FormButtonClickOutput } from "app/shared/form/form.component";
import { getSellCommodityControl } from "./sell-commodity.component.controls";
import { PosService } from "app/@core/service/finance/pos/pos.service";
import { FinanceProductCode } from "app/@core/model/rest/finance/request/products-codes";
import { PopupInputModel } from "app/@core/model/dto/popup.model";
import { GenerateChallengeAndOTP, RequestValidate } from "app/@core/model/rest/common/otp.model";
import { CheckKeyItems } from "app/@core/model/rest/finance/request/check-key-item";
import { ValidUserResponse } from "app/@core/model/rest/login/ValidUser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { VerificationService } from "app/@core/service/base/verification.service";
import { FinanceBaseComponent } from "app/pages/finance/finance-base/finance-base.component";

@Component({
  templateUrl: '../../../../finance-base/finance-base.component.html',
})

export class SellCommodity extends FinanceBaseComponent {
  override dossierID: string;
  financeAmount: string;
  formModel: any;
  productKey: string;
  contractURL?: string;
  public OTP = false;
  generateChallengeAndOTP!: GenerateChallengeAndOTP;
  CheckKeyItems!: CheckKeyItems;
  eligibleFlg: Boolean | string = true;
  //Popup
  popupInputModel: PopupInputModel = {};
  popupShow: boolean = true;
  validUserResponse!: ValidUserResponse;


  constructor(private posService: PosService, private modalService: NgbModal, private PosService: PosService,
    private otpService: VerificationService) {
    super()
    this.dossierID = sessionStorage.getItem("DOSSIER_ID") || '{}';
    this.financeAmount = sessionStorage.getItem("amt") || '{}';
if (sessionStorage.getItem('productKey')) {
      this.productKey = sessionStorage.getItem('productKey') || '{}';
    } else {
      this.productKey = FinanceProductCode.POS;
    }
    this.pageTitle.id = "sellCommodity";
    this.pageTitle.title = "";
    this.pageTitle.stepper!.stepCounter = 6;
    this.getPrintableDocument();
  }
  drawPage() {
    this.pages = [new PageModel(6, getSellCommodityControl(this.contractURL))];
  }
  override ngOnInit(): void {
    this.drawPage();

  }
  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    this.showOtp()
  }

  getPrintableDocument() {
    const output = {
      file: new Blob(),
      fileName: 'Selling Contract',
    }
    let docReq = {
      dosierId: this.dossierID,
      reportName: FinanceProductCode.POS_SELLING,
      productCode: this.productKey
    }

    this.posService.getPrintableDocuments(docReq).subscribe((data: Blob) => {
      if (data === null) {
      } else {
        output.file = data
        const fileURL = URL.createObjectURL(output.file);
        this.contractURL = fileURL
        window.open(fileURL, '_blank');
      }
    })
  }

  private showOtp() {
    let generateChallengeAndOTP: GenerateChallengeAndOTP;
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

  //       this.requestValidate.challengeNumber = this.generateChallengeAndOTP.challengeCode
  validateUserToken(pin: any) {
    let otp = pin
    this.PosService.sellCommodity(this.dossierID, this.productKey, otp).subscribe((data: any) => {
      void this.router.navigate(['/execution-results']);
    })
  }

}

