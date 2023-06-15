import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { StandingOrderValidateRes } from 'app/@core/model/rest/transfer/standing-order/standing-order-validate-res';
import { PendingActionFactory } from 'app/@core/service/base/pending-action-factory.service';
import { SummaryItemModel } from "arb-design-library/model/summary-item.model";
import { SummarySectionModel } from 'arb-design-library/model/summary-section.model';
import { PageModel } from "../../../../@core/model/dto/formModel";
import {
  StandingOrderDeleteEditValidateResponse,
  StandingOrderValidationConfirmRequest
} from "../../../../@core/model/rest/transfer/standing-order/standing-order-delete-validate-request";
import { StandingOrderEditValidateReq } from "../../../../@core/model/rest/transfer/standing-order/standing-order-edit";
import { StandingOrder } from "../../../../@core/model/rest/transfer/standing-order/standing-order-list-res";
import { VerificationService } from "../../../../@core/service/base/verification.service";
import { StandingOrderService } from "../../../../@core/service/transfer/standing-order/standing-order.service";
import { Utils } from "../../../../@core/utility/Utils";
import { FormButtonClickOutput } from "../../../../shared/form/form.component";
import { TransferBaseComponent } from "../../transfer-base/transfer-base.component";
import { getAmountType, getEditDetails, getEditDetailsForm, getEndButtons, getFrequencyObject } from "../standing-order-controls";

@Component({
  selector: 'app-standing-order-edit',
  templateUrl: '../../transfer-base/transfer-base.component.html'
})
export class StandingOrderEditComponent extends TransferBaseComponent {
  selectedStandingOrder!: StandingOrder;
  standingOrderEditValidateRequest!: StandingOrderDeleteEditValidateResponse;
  standingOrderValidateRes!:StandingOrderValidateRes
  levelOneOrder!:boolean;

  constructor(private service: StandingOrderService,
              private verificationService: VerificationService,
              private datePipe: DatePipe,
              private pendingActionFactory: PendingActionFactory,
              ) {
    super();
    if (history.state.standingOrder) {
      this.drawDeleteDetails()
      Utils.setBreadcrumb([
        {text: 'transfer.transfer', url: '/transfer'},
        {text: 'transfer.standingOrder.landing.title', url: '/transfer/standing-orders'},
        {text: 'transfer.standingOrder.detailsView.edit-title', url: ''}
      ]);
    } else {
      void this.router.navigate(['transfer/standing-orders'])
    }
  }

  ngOnInit(): void {

  }

  private drawDeleteDetails() {
    this.pageTitle = {
      id: "deleteStandingOrder",
      title: "transfer.standingOrder.detailsView.edit",
      showArrow: true,
      stepper: {
        steps: ["", "", ""],
        stepCounter: 1,
        stepText: "public.step",
        ofText: "public.of"
      }
    };
    this.endButtons[0].isDisable = false;
    this.selectedStandingOrder = history.state.standingOrder
    this.pages.push(new PageModel(1, getEditDetails()))
    this.showDetails()
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {

    switch (formButtonClickOutput.buttonId) {
      case "arrowTitle":
        void this.router.navigate(['transfer/standing-orders'])
        break;
      case "transfers":
        void this.router.navigate(['/transfer'])
        break;
      case "dashboard":
        void this.router.navigate(['/dashboard'])
        break;
      case "pendingActions":
        this.setBreadcrumb([]);
        void this.router.navigate(['/pendingActions'], {queryParams: {pendingAction: 'standingOrders'}})
          break;
      case "Back":
        if (this.pageTitle.stepper && this.pageTitle.stepper.stepCounter === 1) {
          void this.router.navigate(['transfer/standing-orders'])
        } else {
          this.pageTitle.stepper!.stepCounter--;
        }
        break;
      case "Next":
        switch (this.pageTitle.stepper!.stepCounter) {
          case 1:
            this.pages[1] = new PageModel(2, getEditDetailsForm());
            this.pageTitle.stepper!.stepCounter++;
            this.showDetails();
            break;
          case 2:
            let standingOrderEditValidateReq: StandingOrderEditValidateReq = {
              standingOrderDetail: this.selectedStandingOrder,
              dateMounth: this.selectedStandingOrder.dayOfMonth,
              amount: this.selectedStandingOrder.amount!,
              amountOption: this.selectedStandingOrder.amountOption,
              dateFrom: this.selectedStandingOrder.dateFrom,
              dateTo: this.pages[1].forms[0].controls['dateTo'].value.year + '-' +
                this.pages[1].forms[0].controls['dateTo'].value.month + '-' +
                this.pages[1].forms[0].controls['dateTo'].value.day
            }
            this.service.validateStandingOrderEdit(standingOrderEditValidateReq).subscribe((res) => {
              this.standingOrderEditValidateRequest = res;
              let standingOrderValidationConfirmRequest: StandingOrderValidationConfirmRequest =
                {standingOrderBatch: this.standingOrderEditValidateRequest.standingOrderBatch!}
              if (res.standingOrderBatch.nextStatus === "100" && res.generateChallengeAndOTP) {
                this.verificationService.showVerification(res.generateChallengeAndOTP).subscribe((ReqValidate) => {
                  standingOrderValidationConfirmRequest.requestValidate = ReqValidate
                  this.confirm(standingOrderValidationConfirmRequest);
                })
              } else {
                this.confirm(standingOrderValidationConfirmRequest);
              }
            })
            break;
        }
        break;
    }
  }

  private showDetails() {
    if (this.pageTitle.stepper && this.pageTitle.stepper.stepCounter) {
      this.pages[this.pageTitle.stepper.stepCounter - 1].forms[0]
        .controls['fromAccount'].setValue(this.selectedStandingOrder.accountFrom)
      this.pages[this.pageTitle.stepper.stepCounter - 1].forms[0]
        .controls['toAccount'].setValue(this.selectedStandingOrder.accountTo)
      this.pages[this.pageTitle.stepper.stepCounter - 1].
        forms[0].controls['amtType'].setValue(getAmountType()
        [this.selectedStandingOrder.amountOption]);
      this.pages[this.pageTitle.stepper.stepCounter - 1].forms[0].controls['freq'].
        setValue(getFrequencyObject().frequency[this.selectedStandingOrder.orderType2])
      this.pages[this.pageTitle.stepper.stepCounter - 1].forms[0]
        .controls['amount'].setValue(this.selectedStandingOrder.amount)
      this.pages[this.pageTitle.stepper.stepCounter - 1].forms[0]
        .controls['dayOfTransfer'].setValue(this.selectedStandingOrder.dayOfMonth)
      this.pages[this.pageTitle.stepper.stepCounter - 1].forms[0]
        .controls['remark'].setValue(this.selectedStandingOrder.remarks)
      this.pages[this.pageTitle.stepper.stepCounter - 1].forms[0]
        .controls['dateFrom'].setValue(this.selectedStandingOrder.dateFrom)
      this.pages[this.pageTitle.stepper.stepCounter - 1].forms[0]
        .controls['dateTo'].setValue(this.selectedStandingOrder.dateTo)
    }
  }

  private confirm(confirmRequest: StandingOrderValidationConfirmRequest) {
    this.service.confirmStandingOrderEdit(confirmRequest).subscribe(() => {
      this.summary = {
        title: {
          id: "summary-title",
          type: 'Section',
          title: "public.summary",
        },
        sections: []
      }
      let form = this.pages[0].forms[0];
      form.controls['dateTo'].setValue(confirmRequest.standingOrderBatch?.dateTo)
      let itemModels: SummaryItemModel[] = [];
      itemModels.push(...this.getFormSummaryItem(form));
      itemModels[itemModels.length-1].subTitle=this.datePipe.transform(this.pages[1].forms[0].controls['dateTo'].value.year + '-' +
      this.pages[1].forms[0].controls['dateTo'].value.month + '-' +
      this.pages[1].forms[0].controls['dateTo'].value.day,'yyyy-MM-dd')!
      this.summary.sections!.push({
        items: itemModels
      })
      if (this.standingOrderEditValidateRequest.standingOrderBatch.futureSecurityLevelsDTOList!.length > 0) {
        const section:SummarySectionModel=Utils.getCurrentLevelAndNextLevelSummarySection(this.translate,
          this.standingOrderEditValidateRequest.standingOrderBatch.futureSecurityLevelsDTOList!)
          if(this.standingOrderEditValidateRequest.standingOrderBatch.futureSecurityLevelsDTOList!.length === 1){
            section.items?.push({
              title: 'pendingAuthorization.next-levels',
              subTitle:'pendingAuthorization.completed'
            })
          }
        this.summary.sections!.push(section);
      }
      if (this.standingOrderEditValidateRequest.standingOrderBatch.futureStatus === "PENDING") {
        this.pendingActionFactory.fetchPendingActions();
      }
      this.result = {
        type: "Success",
        title: "transfer.standingOrder.detailsView.deleteSuccess",
        summary: this.summary,
      }


      this.pageTitle.stepper!.stepCounter++;

      this.levelOneOrder = (this.standingOrderEditValidateRequest.standingOrderBatch.futureSecurityLevelsDTOList?.length ===1 &&
        this.standingOrderEditValidateRequest.standingOrderBatch.pdfSecurityLevelsDTOList?.length === 0)
      this.startButtons = [];
      this.endButtons = [];
      this.endButtons = getEndButtons(this.showPendingActions,this.levelOneOrder)
      })
  }
}
