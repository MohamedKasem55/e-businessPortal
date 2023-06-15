import { Component } from '@angular/core';
import { PendingActionFactory } from 'app/@core/service/base/pending-action-factory.service';
import { SummaryItemModel } from "arb-design-library/model/summary-item.model";
import { SummarySectionModel } from 'arb-design-library/model/summary-section.model';
import { PageModel } from "../../../../@core/model/dto/formModel";
import {
  StandingOrderDeleteEditValidateResponse, StandingOrderDeleteValidateRequest, StandingOrderValidationConfirmRequest
} from "../../../../@core/model/rest/transfer/standing-order/standing-order-delete-validate-request";
import { StandingOrder } from "../../../../@core/model/rest/transfer/standing-order/standing-order-list-res";
import { VerificationService } from "../../../../@core/service/base/verification.service";
import { StandingOrderService } from "../../../../@core/service/transfer/standing-order/standing-order.service";
import { Utils } from "../../../../@core/utility/Utils";
import { FormButtonClickOutput } from "../../../../shared/form/form.component";
import { TransferBaseComponent } from "../../transfer-base/transfer-base.component";
import { getAmountType, getDeleteDetails, getEndButtons, getFrequencyObject } from "../standing-order-controls";

@Component({
  selector: 'app-standing-order-delete',
  templateUrl: '../../transfer-base/transfer-base.component.html'
})
export class StandingOrderDeleteComponent extends TransferBaseComponent {
  private selectedStandingOrder!: StandingOrder;
  private standingOrderDeleteValidateResponse!: StandingOrderDeleteEditValidateResponse;
  levelOneOrder!: boolean;

  constructor(private service: StandingOrderService, private verificationService: VerificationService, private pendingActionFactory: PendingActionFactory,) {
    super();
    if (history.state.standingOrder) {
      this.drawDeleteDetails()
      Utils.setBreadcrumb([
        { text: 'transfer.transfer', url: '/transfer' },
        { text: 'transfer.standingOrder.landing.title', url: '/transfer/standing-orders' },
        { text: 'transfer.standingOrder.detailsView.title', url: '' }
      ]);
    } else {
      void this.router.navigate(['transfer/standing-orders'])
    }
  }

  changeBtnLabels() {
    if (
      this.standingOrderDeleteValidateResponse?.standingOrderBatch
        ?.futureSecurityLevelsDTOList
    ) {
      const cuurentLevel = Utils.getCurrentLevelSummaryItem(
        this.translate,
        this.standingOrderDeleteValidateResponse.standingOrderBatch
          .futureSecurityLevelsDTOList
      )
      if (!cuurentLevel) {
        return
      }
      if (cuurentLevel && cuurentLevel > 1) {
        this.endButtons[0].text = "go-to-pending-actions"
        this.startButtons[0].text = "go-to-transfers"
      } else {
        this.endButtons[0].text = "Go to Dashboard"
        this.startButtons[0].text = "go-to-transfers"
      }
    }
  }

  private drawDeleteDetails() {
    this.pageTitle = {
      id: "deleteStandingOrder",
      title: "transfer.standingOrder.detailsView.title",
      stepper: {
        steps: ["", ""],
        stepCounter: 1,
        stepText: "public.step",
        ofText: "public.of"
      }
    };
    this.endButtons[0].isDisable = false;
    this.selectedStandingOrder = history.state.standingOrder
    this.pages.push(new PageModel(1, getDeleteDetails()))
    this.pages[0].forms[0].controls['fromAccount'].setValue(this.selectedStandingOrder.accountFrom)
    this.pages[0].forms[0].controls['toAccount'].setValue(this.selectedStandingOrder.accountTo)
    this.pages[0].forms[0].controls['amtType'].setValue(getAmountType()
    [this.selectedStandingOrder.amountOption]);
    this.pages[0].forms[0].controls['freq'].setValue(getFrequencyObject().frequency
    [this.selectedStandingOrder.orderType2])
    this.pages[0].forms[0].controls['amount'].setValue(this.selectedStandingOrder.amount)
    this.pages[0].forms[0].controls['dayOfTransfer'].setValue(this.selectedStandingOrder.dayOfMonth)
    this.pages[0].forms[0].controls['remark'].setValue(this.selectedStandingOrder.remarks)
    this.pages[0].forms[0].controls['dateFrom'].setValue(this.selectedStandingOrder.dateFrom)
    this.pages[0].forms[0].controls['dateTo'].setValue(this.selectedStandingOrder.dateTo)
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    if (formButtonClickOutput.buttonId === "Back") {
      if (this.pageTitle.stepper!.stepCounter === 1) {
        void this.router.navigate(['/transfer/standing-orders']);
      }
    } else if (formButtonClickOutput.buttonId === "Next") {
      let selectedStandingOrder: StandingOrderDeleteValidateRequest = {
        standingOrderDetail: this.selectedStandingOrder
      }
      this.service.validateStandingOrderDelete(selectedStandingOrder).subscribe((res) => {
        this.standingOrderDeleteValidateResponse = res;
        let standingOrderDeleteValidateRequest: StandingOrderValidationConfirmRequest =
          { standingOrderBatch: this.standingOrderDeleteValidateResponse.standingOrderBatch }
        if (res.standingOrderBatch.nextStatus === "100" && res.generateChallengeAndOTP) {
          this.verificationService.showVerification(res.generateChallengeAndOTP).subscribe((ReqValidate) => {
            standingOrderDeleteValidateRequest.requestValidate = ReqValidate
            this.confirm(standingOrderDeleteValidateRequest);
          })
        } else {
          this.confirm(standingOrderDeleteValidateRequest);
        }
      })
    } else if (formButtonClickOutput.buttonId === "transfers") {
      void this.router.navigate(['/transfer']);
    } else if (formButtonClickOutput.buttonId === "dashboard") {
      void this.router.navigate(['/dashboard']);
    } else if (formButtonClickOutput.buttonId === "pendingActions") {
      void this.router.navigate(['/pendingActions/pending-actions-list']);
    }
    this.changeBtnLabels()
  }
  private setSummaryDetails() {
    this.summary = {
      title: {
        id: "summary-title",
        type: 'Section',
        title: "public.summary",
      },
      sections: []
    }
    let form = this.pages[0].forms[0];
    let itemModels: SummaryItemModel[] = [];
    itemModels.push(...this.getFormSummaryItem(form));
    this.summary.sections!.push({
      items: itemModels
    })
    if (this.standingOrderDeleteValidateResponse.standingOrderBatch.futureSecurityLevelsDTOList!.length > 0) {
      const section: SummarySectionModel = Utils.getCurrentLevelAndNextLevelSummarySection(this.translate,
        this.standingOrderDeleteValidateResponse.standingOrderBatch.futureSecurityLevelsDTOList!)
      if (this.standingOrderDeleteValidateResponse.standingOrderBatch.futureSecurityLevelsDTOList!.length === 1) {
        section.items?.push({
          title: 'pendingAuthorization.next-levels',
          subTitle: 'pendingAuthorization.completed'
        })
      }
      if (this.standingOrderDeleteValidateResponse.standingOrderBatch.futureStatus === "PENDING") {
        this.pendingActionFactory.fetchPendingActions();
      }
      this.summary.sections!.push(section);
    }
    this.result = {
      type: "Success",
      title: "transfer.standingOrder.detailsView.deleteSuccess",
      summary: this.summary,
    }
    this.pageTitle.stepper!.stepCounter++;
    this.endButtons[0].showLoading = false;
  }

  private confirm(standingOrderDeleteValidateRequest: StandingOrderValidationConfirmRequest) {
    this.service.confirmStandingOrderDelete(standingOrderDeleteValidateRequest).subscribe(() => {
      this.startButtons = [];
      this.levelOneOrder = (this.standingOrderDeleteValidateResponse.standingOrderBatch.futureSecurityLevelsDTOList?.length === 1 &&
        this.standingOrderDeleteValidateResponse.standingOrderBatch.pdfSecurityLevelsDTOList?.length === 0)
      this.endButtons = getEndButtons(this.showPendingActions, this.levelOneOrder)
      this.setSummaryDetails()
    })
  }
}
