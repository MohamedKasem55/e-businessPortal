import {Component, OnInit} from "@angular/core";
import {CardsBaseComponent} from "../../cards-base/cards-base.component";
import {getBusinessCardDetailsForm, getPaymentDetailsForm} from "./card-reject-control";
import {ResultModal} from "app/@core/model/dto/result.modal";
import {BusinessCardsItem} from "app/@core/model/rest/cards/user-approval/list-res.model";
import {ValidateReqModel} from "app/@core/model/rest/cards/user-approval/validate-req.model";
import {CardsApprovalService} from "app/@core/service/cards/business-cards/cards-approval.service";
import {ValidateResModel} from "app/@core/model/rest/cards/user-approval/validate-res.model";
import {DeleteReqModel} from "app/@core/model/rest/cards/user-approval/delete-req.model";
import {ResponseException} from "app/@core/service/base/responseException";
import {ActivatedRoute} from "@angular/router";
import {UserProfileService} from 'app/@core/service/user-profile/user-profile.service';
import {FormButtonClickOutput} from "../../../../shared/form/form.component";
import {PageModel} from "../../../../@core/model/dto/formModel";
import {SummaryModel} from "arb-design-library/model/summary.model";

@Component({
  selector: 'app-card-reject',
  templateUrl: '../../cards-base/cards-base.component.html',
  styleUrls: []
})

export class CardRejectComponent extends CardsBaseComponent implements OnInit {

  cardDetails!: BusinessCardsItem;
  validateResponse!: ValidateResModel;
  trackDeleteClickButtonEvent: boolean = false;

  constructor(private route: ActivatedRoute, private userProfileService: UserProfileService,
              private cardsApprovalService: CardsApprovalService) {
    super();

    this.setBreadcrumb([
      {
        text: 'cards.cards',
        url: 'cards'
      },
      {
        text: 'cards.request-status',
        url: 'cards/approval'
      },
      {
        text: 'cards.rejects',
        url: ''
      }]);

    this.pageTitle.id = 'complete-details';
    this.pageTitle.title = 'cards.complete-details';
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.cardDetails = JSON.parse(JSON.stringify(history.state))
    if (!this.cardDetails.batchPk) {
      this.router.navigateByUrl("cards/approval");
    }
    this.drawPage();
  }

  drawPage() {
    this.pages = [];
    this.pages = [new PageModel(1, getBusinessCardDetailsForm(this.translate, this.cardDetails),
      getPaymentDetailsForm(this.translate, this.cardDetails))];

    this.endButtons.push(this.deleteButton)
    this.getAndFillAccountList();
    this.registerChangeValueEvents();
    this.setDefaultValueWhileAtInitialization()

  }

  setDefaultValueWhileAtInitialization() {
    if (this.cardDetails && this.cardDetails.paymentOption === "2") {
      this.getControl(0, 1, "amount").enable();
    } else {
      this.getControl(0, 1, "amount").disable();
    }
  }

  registerChangeValueEvents() {
    this.getControl(0, 1, "amountType").valueChanges.subscribe((value: any) => {
      this.paymentTypeRedioButtonChangeListener(value);
    });
  }

  getAndFillAccountList() {
    this.userProfileService.getSARAccountList().subscribe(data => {

      this.getControl(0, 1, "fromAccountControl").controlOptions.options = data.listAlertsPermissionAccount;
      if (data.listAlertsPermissionAccount.length > 0) {
        const matchAccount = data.listAlertsPermissionAccount.find((obj) => {
          return obj.fullAccountNumber === this.cardDetails?.accountNumber;
        });
        this.getControl(0, 1, "fromAccountControl").setValue(matchAccount);
      }
    })
  }

  paymentTypeRedioButtonChangeListener(value: string) {
    if (value === "2") {
      this.getControl(0, 1, "amount").enable();
    } else {
      this.getControl(0, 1, "amount").disable();
    }
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    super.onButtonClick(formButtonClickOutput);

    switch (formButtonClickOutput.buttonId) {
      case 'Next':
        this.onClickNextButton(formButtonClickOutput.buttonId);
        break;
      case 'Confirm':
        this.onClickConfirmButton(formButtonClickOutput.buttonId);
        break;
      case 'Back':
        this.onClickBackButton();
        break;
      case 'NavigateToCardApproval':
        void this.router.navigate(['/cards/approval']);
        break;
      case 'Delete':
        this.onClickDeleteButton(formButtonClickOutput.buttonId);
        break;
      case 'DeleteConfirm':
        this.onClickConfirmDeleteButton(formButtonClickOutput.buttonId);
        break;
    }
  }

  onClickNextButton(id: string) {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.onClickNextButtonActionWithSteperOne();
        this.trackDeleteClickButtonEvent = false;
        break;
    }
  }

  onClickNextButtonActionWithSteperOne() {
    this.stepperMoveNext();
    this.summary = this.fillSummary(false);
    this.endButtons = [this.confirmButton];
  }

  onClickConfirmButton(id: string) {
    this.cardsApprovalService.validateCardsApproval(this.buildValidateRequest()).subscribe({
      next: (res) => {
        this.validateResponse = res;
        this.summaryResult(false, "", false);
      },
      error: (error: ResponseException) => {
        this.summaryResult(true, error.ErrorResponse.errorDescription!, false);
      }
    });
  }

  onClickBackButton() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        void this.router.navigate(['cards/approval']);
        break;
      case 2:
        this.stepperMoveBack();
        this.setDefaultValueOnBackClick();
        this.setDefaultValueWhileAtInitialization();
        this.endButtons = [this.nextButton, this.deleteButton];
        break;
    }
  }

  setDefaultValueOnBackClick() {
    if (this.trackDeleteClickButtonEvent) {
      this.getControl(0, 1, "amountType").setValue(this.cardDetails.paymentOption);
      this.getControl(0, 1, "amount").setValue(this.cardDetails.amount);
    }

  }

  onClickDeleteButton(id: string) {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.onClickDeleteButtonActionWithSteperOne();
        this.trackDeleteClickButtonEvent = true;
        break;
    }
  }

  onClickDeleteButtonActionWithSteperOne() {
    this.stepperMoveNext();
    this.summary = this.fillSummary(true);
    this.endButtons = [this.deleteConfirmButton];
  }

  onClickConfirmDeleteButton(id: string) {
    this.cardsApprovalService.deleteCardsApproval(this.buildpDeleteRequest()).subscribe({
      next: (res) => {
        this.summaryResult(false, "", true);
      },
      error: (error: ResponseException) => {
        this.summaryResult(true, error.ErrorResponse.errorDescription!, true);
      }
    });
  }

  summaryResult(error: boolean, errorMessage: string, usedModelValue: boolean) {
    this.stepperMoveNext();
    this.endButtons = [this.userRequestStatusButton];
    this.startButtons = [];
    this.summary = {};
    this.result = error ? this.fillErrorResult(errorMessage, usedModelValue) : this.fillSuccessResult(usedModelValue);
  }

  fillSuccessResult(usedModelValue: boolean): ResultModal {
    return {
      type: 'Success',
      title: 'transfer.money-successfully-transferred',
      subTitle: 'transfer.own-transfer.between-accounts',
      summary: this.fillSummary(usedModelValue),
    };
  }

  fillErrorResult(errString: string, usedModelValue: boolean): ResultModal {
    return {
      type: 'Error',
      title: errString,
      summary: this.fillSummary(usedModelValue),
    };
  }


  fillSummary(usedModelValue: boolean): SummaryModel {
    return {
      sections: [
        {
          title: {
            id: 'requestStatusRejected',
            title: 'cards.business-cards-details',
          },
          items: [
            {
              title: 'cards.card-holder-name',
              subTitle: this.getControl(0, 0, "cardHolderName").value
            },
            {
              title: 'cards.card-number',
              subTitle: this.getControl(0, 0, "cardNumber").value
            },
            {
              title: 'cards.related-account',
              subTitle: this.getControl(0, 0, "relatedAccountName").value
            }
          ],
        },
        {
          title: {
            id: 'requestStatusRejected',
            title: 'Payment Options Details'
          },
          items: [
            {
              title: 'cards.account',
              subTitle: this.getControl(0, 1, "fromAccountControl").value.alias + ' ' +
                this.getControl(0, 1, "fromAccountControl").value.fullAccountNumber
            },
            {
              title: 'cardsApproval.pay-type',
              subTitle: this.getControl(0, 1, "amountType").controlOptions.options.find((obj: any) => {
                if (usedModelValue) {
                  return obj.id === this.cardDetails.paymentOption
                }
                return obj.id === this.getControl(0, 1, "amountType").value;
              }).title
            },
            {
              title: 'cardsApproval.amount',
              subTitle: usedModelValue ? this.cardDetails.amount : this.getControl(0, 1, "amount").value
            },
            {
              title: 'cards.rejected-reason',
              subTitle: this.getControl(0, 1, "rejectedReason").value
            }

          ],
        }
      ],
    };
  }

  buildValidateRequest(): ValidateReqModel {
    var obj: ValidateReqModel;
    obj = {
      businessCardPaymentBatchDSO: this.cardDetails
    }
    if (obj.businessCardPaymentBatchDSO) {
      obj.businessCardPaymentBatchDSO.amount = this.getControl(0, 1, "amount").value;
      obj.businessCardPaymentBatchDSO.paymentOption = this.getControl(0, 1, "amountType").value;
    }
    return obj;
  }

  buildpDeleteRequest(): DeleteReqModel {
    return {
      businessCardPaymentBatch: this.cardDetails
    }
  }

}
