import { Component, OnInit } from '@angular/core';
import { addBillForm } from "./add-bill-controls";
import { AddBillService } from "../../../../@core/service/payments/add-bill/add-bill.service";
import { FormResult, PageModel } from "../../../../@core/model/dto/formModel";
import { AddBillValidateReq } from "../../../../@core/model/rest/payments/add-bill/add-bill-validate-req";
import { SummaryModel } from "arb-design-library/model/summary.model";
import { SummarySectionModel } from "arb-design-library/model/summary-section.model";
import { RequestValidate } from "../../../../@core/model/rest/common/otp.model";
import { AddBillValidateRes } from "../../../../@core/model/rest/payments/add-bill/add-bill-validate-res";
import { AddBillConfirmReq } from "../../../../@core/model/rest/payments/add-bill/add-bill-confirm-req";
import { ResponseException } from "../../../../@core/service/base/responseException";
import { ResultModal } from "../../../../@core/model/dto/result.modal";
import { PaymentBaseComponent } from "../../payment-base/payment-base.component";
import { PopupService } from "../../../../@core/service/base/popup.service";
import { VerificationService } from "../../../../@core/service/base/verification.service";
import { FormButtonClickOutput } from "../../../../shared/form/form.component";
import { ValueChangeResult } from "../../../../@core/model/dto/control/control.model";
import { Utils } from "../../../../@core/utility/Utils";
import { PendingActionFactory } from 'app/@core/service/base/pending-action-factory.service';

@Component({
  selector: 'app-add-bill',
  templateUrl: '../../payment-base/payment-base.component.html',
  styleUrls: []
})
export class AddBillComponent extends PaymentBaseComponent implements OnInit {
  private provider: any;
  validateResponse!: AddBillValidateRes;

  constructor(private popupService: PopupService, private otpService: VerificationService, private addBillService: AddBillService, private pendingActionFactory: PendingActionFactory) {
    super();
    this.setBreadcrumb([
      {
        text: 'payments.name',
        url: '/payments'
      },
      {
        text: 'payments.bill-payment.name',
        url: ''
      },
      {
        text: 'payments.bill-payment.add-bill',
        url: ''
      }
    ]);
    this.drawPage()
    this.getProvidersDetails()
    this.onCategoryChange()
  }

  drawPage() {
    this.pageTitle.id = "addBillTitle";
    this.pageTitle.title = "payments.bill-payment.add-bill";
    this.pageTitle.endButtons = []
    this.pageTitle.stepper!.steps = ["", "", ""];
    this.endButtons[0].showLoading = true;
    this.pages = [new PageModel(1, addBillForm())];
  }

  onCategoryChange() {
    this.getControl(0, 0, "providerCategory").valueChanges.subscribe((res: ValueChangeResult) => {
      this.getControl(0, 0, 'providerName').controlOptions.options =
        res.value.billCodes.sort((a: any, b: any) => {
          return a.detailsDescriptionEn.localeCompare(b.detailsDescriptionEn, undefined, {
            numeric: true,
            sensitivity: 'base'
          });
        }
        )
      this.getControl(0, 0, 'providerName').setValue(null)
      this.getControl(0, 0, 'providerName').controlOptions.textField = this.translate.currentLang == "en" ? 'detailsDescriptionEn' : 'detailsDescriptionAr';
    });
  }

  getProvidersDetails() {
    this.addBillService.getProvidersDetails(true).subscribe((res) => {
      this.provider = res.billCodesList.billCodesCategorizedList.reverse()
      this.provider.forEach((item: any, index: number) => {
        item.key = index;
      });
      this.pages[0].forms[0].controls['providerCategory'].controlOptions.options = this.provider
      this.pages[0].forms[0].controls['providerCategory'].controlOptions.textField = this.translate.currentLang == "en" ? 'category.categoryEn' : 'category.categoryAr';
      this.endButtons[0].showLoading = false;
    })

  }

  override onResultChanged(data: FormResult[]): void {
    let valid = true;
    data.forEach(item => {
      valid = valid && item.valid;
    })
    this.endButtons[0].isDisable = !valid;
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'Next':
      case 'Confirm':
        this.nextClick()
        break;
      case 'Back':
      case 'Edit':
        this.backClick();
        break;
      case 'Payments':
        void this.router.navigate(['/payments'])
        break;
      case 'pay-added-bill':
        this.payAddedBill();
        break;
      case 'PendingActions':
        void this.router.navigate(["/pendingActions/pending-actions-list"]);
        break;

    }
  }

  nextClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.validateAddBill();
        break;
      case 2:
        this.validateResponse.billAddBatch.futureSecurityLevelsDTOList.length > 1 ? this.confirmAddBill() : this.showOtp();
        break;
    }
  }

  backClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        void this.router.navigate(['/payments/bill-payment']);
        break;
      case 2:
        this.stepperMoveBack();
        this.endButtons = [this.nextButton]
        break;
    }
  }

  private validateAddBill() {
    let addBillValidateReq: AddBillValidateReq = {
      billReference: this.getControl(0, 0, 'subscriptionNumber').value,
      billCodeSelected: this.getControl(0, 0, 'providerName').value.billCode,
      newNickName: this.getControl(0, 0, 'nickName').value
    }
    this.addBillService.validateAddBill(addBillValidateReq).subscribe((res) => {
      this.validateResponse = res
      this.stepperMoveNext()
      this.summary = this.fillSummary()
      this.endButtons = [this.confirmButton]
    })
  }


  fillSummary(showEditButton: boolean = true): SummaryModel {
    let sections: SummarySectionModel[] = [];
    this.pages[0].forms.forEach((item, index) => {
      sections.push({
        title: {
          id: 'addBillDetail' + (index + 1),
          title: 'payments.add-bill.bill-details',
          startButtons: showEditButton ? [this.editButton] : [],
        },
        items: [
          {
            title: 'payments.add-bill.category',
            subTitle: this.translate.currentLang == "en" ? item.controls["providerCategory"].value.category.categoryEn : item.controls["providerCategory"].value.category.categoryAr
          },
          {
            title: 'payments.add-bill.subscription-number',
            subTitle: item.controls["subscriptionNumber"].value,
          },
          {
            title: 'payments.add-bill.provider',
            subTitle: this.translate.currentLang == "en" ? item.controls["providerName"].value.detailsDescriptionEn : item.controls["providerName"].value.detailsDescriptionAR
          },
          {
            title: 'payments.add-bill.nickName',
            subTitle: item.controls["nickName"].value
          },
        ]
      });
      sections.push(Utils.getCurrentLevelAndNextLevelSummarySection(this.translate, this.validateResponse.billAddBatch.futureSecurityLevelsDTOList));
    });
    return {
      title: {
        id: 'SummaryTitle',
        title: 'public.summary',
      },
      sections: sections
    }

  }

  private confirmAddBill(requestValidate?: RequestValidate) {
    this.addBillService.confirmAddBill(this.getConfirmRequest(requestValidate)).subscribe(
      {
        next: (res) => {
          this.stepperMoveNext();
          this.summary = {};
          this.endButtons = res && res['hasNextApprovalLevel'] ? [this.pendingActionsButton, this.paymentsButton] : [this.pendingActionsButton, this.paymentsButton, {
            id: 'pay-added-bill',
            text: 'payments.add-bill.pay-added-bill',
            type: 'primary'
          }];
          this.startButtons = [];
          this.result = this.fillSuccessResult();
          if(res.hasNextApprovalLevel)
            this.pendingActionFactory.fetchPendingActions();

        },
        error: (error: ResponseException) => {

        }
      })
  }

  showOtp() {
    this.otpService.showVerification(this.validateResponse.generateChallengeAndOTP).subscribe((requestValidate: RequestValidate) => {
      this.confirmAddBill(requestValidate);
    });
  }

  getConfirmRequest(requestValidate?: RequestValidate): AddBillConfirmReq {
    return {
      requestValidate: requestValidate,
      billAddBatch: this.validateResponse.billAddBatch
    }
  }


  fillSuccessResult(): ResultModal {
    return {
	 type: this.validateResponse.billAddBatch.futureStatus==='PENDING' ?'Pending':'Success',
     title: this.validateResponse.billAddBatch.futureStatus==='PENDING'?'payments.aramco-payment.peandingAuthMessage' :'payments.add-bill.add-successfully',
     summary: this.fillSummary(false),
    };
  }

  fillErrorResult(errString: string): ResultModal {
    return {
      type: 'Error',
      title: errString,
      summary: this.fillSummary(false),
    };
  }

  private payAddedBill() {
    void this.router.navigate(['/payments/bill-payment'], { state: { billRef: this.getControl(0, 0, 'subscriptionNumber').value } })
  }

}
