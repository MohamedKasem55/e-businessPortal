import { Component } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { PendingActionFactory } from 'app/@core/service/base/pending-action-factory.service';
import { PillModel } from "arb-design-library/model/pill.model";
import { SummaryItemModel } from "arb-design-library/model/summary-item.model";
import { TitleModel } from "arb-design-library/model/title.model";
import { TableControl } from "../../../@core/model/dto/control/table-control";
import { FormResult, PageModel } from "../../../@core/model/dto/formModel";
import { KeyValueModel } from "../../../@core/model/rest/common/key-value.model";
import { GenerateChallengeAndOTP, RequestValidate } from "../../../@core/model/rest/common/otp.model";
import { BeneficiaryModel } from "../../../@core/model/rest/transfer/beneficiary/beneficiary.model";
import { StandingOrderConfirmReq } from "../../../@core/model/rest/transfer/standing-order/standing-order-confirm-req";
import {
  StandingOrderValidateRequest
} from "../../../@core/model/rest/transfer/standing-order/standing-order-validate-request";
import { StandingOrderValidateRes } from "../../../@core/model/rest/transfer/standing-order/standing-order-validate-res";
import { ModelAndListService } from "../../../@core/service/base/modelAndList.service";
import { VerificationService } from "../../../@core/service/base/verification.service";
import { BeneficiariesService } from "../../../@core/service/transfer/beneficiaries/beneficiaries.service";
import { StandingOrderService } from "../../../@core/service/transfer/standing-order/standing-order.service";
import { Utils } from "../../../@core/utility/Utils";
import { FormButtonClickOutput } from "../../../shared/form/form.component";
import { TransferBaseComponent } from "../transfer-base/transfer-base.component";
import {
  getEndButtons,
  standingOrderBeneficiariesTable,
  standingOrderControls,
  standingOrderSummery
} from "./standing-order-controls";

@Component({
  selector: 'app-standing-order',
  templateUrl: '../transfer-base/transfer-base.component.html'
})
export class StandingOrderComponent extends TransferBaseComponent {

  selectedBeneficiaries: any;
  levelOneOrder!: boolean;
  override pageTitle: TitleModel = {
    id: "TransferTitle",
    title: "transfer.standingOrder.name",
    stepper: {
      steps: ["", "", "", ""],
      stepCounter: 1,
      stepText: "public.step",
      ofText: "public.of"
    }
  };

  purposeTypes: KeyValueModel[] = [];
  standingOrderValidateRes!: StandingOrderValidateRes;
  standingOrderBeneficiariesTable!: BeneficiaryModel[];

  constructor(translate: TranslateService,
    private service: StandingOrderService,
    private beneficiariesService: BeneficiariesService,
    private modelAndListService: ModelAndListService,
    private pendingActionFactory: PendingActionFactory,
    private otpService: VerificationService) {
    super();
    this.drawPage();
    this.getEligibleAccounts();

  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    if (formButtonClickOutput.buttonId === 'addNewBen') {
      void this.router.navigate(['/transfer/add-beneficiaries'])
    } else if (formButtonClickOutput.buttonId === 'pendingActions') {
      this.setBreadcrumb([]);
      void this.router.navigate(['/pendingActions'], { queryParams: { pendingAction: 'standingOrders' } })

    } else if (formButtonClickOutput.buttonId === 'transfers') {
      void this.router.navigate(['/transfer'])
    } else if (formButtonClickOutput.buttonId === 'dashboard') {
      void this.router.navigate(['/dashboard'])
    } else if (formButtonClickOutput.buttonId === 'Next') {
      if (this.pageTitle?.stepper?.stepCounter === 1) {
        this.pageTitle.stepper.stepCounter++;
        this.drawActionPage()
        this.endButtons[0].isDisable = true;
      } else if (this.pageTitle?.stepper?.stepCounter === 2) {
        this.handleSummaryForm()
      } else if (this.pageTitle?.stepper?.stepCounter === 3) {
        this.endButtons[0].showLoading = true;
        this.standingOrderValidateRes.standingOrderBatch.futureStatus === "PROCESS" ? this.showOTP() : this.confirm()
      }
    } else {

      if (this.pageTitle.stepper!.stepCounter !== 1
        && this.pageTitle.stepper!.stepCounter !== 4) {
        this.pageTitle.stepper!.stepCounter--;
      } else {
        void this.router.navigate(['/transfer/standing-orders'])
      }
    }

  }

  override onResultChanged(data: FormResult[]): void {
    let valid = true;
    data.forEach(item => {
      valid = valid && item.valid;
    })
    if (data[0].id !== "standingOrderBeneficiariesTable")
      this.endButtons[0].isDisable = !valid;
  }

  drawPage() {
    Utils.setBreadcrumb([
      { text: 'transfer.transfer', url: '/transfer' },
      { text: 'transfer.standingOrder.landing.title', url: '/transfer/standing-orders/' },
      { text: 'transfer.standingOrder.add-new', url: '' },
    ]);
    this.pages = [new PageModel(1, standingOrderBeneficiariesTable())];
    this.getControl(0, 0, "accountFrom").valueChanges.subscribe((selectedAccount: any) => {
      this.getStandingOrdersBeneficiaries(selectedAccount.value.fullAccountNumber);
      this.endButtons[0].isDisable = true;
    });
    this.getControl(0, 0, "standingOrderBeneficiariesTable")
      .valueChanges.subscribe((value: any) => {
        this.endButtons[0].isDisable = (value.value.length != 1);
        if (value.value.length === 1) {
          this.selectedBeneficiaries = value.value[0];
          this.drawActionPage();
        }
      });

  }

  getEligibleAccounts() {
    this.endButtons[0].showLoading = true;
    this.service.getEligibleAccounts()
      .subscribe({
        next: (res) => {
          this.pages[0].forms[0].controls['accountFrom']
            .controlOptions.options = res.listAlertsPermissionAccount;
          this.endButtons[0].showLoading = false;
          this.endButtons[0].isDisable = true;
          this.pages[0].forms[0].controls['accountFrom'].setValue(res.listAlertsPermissionAccount[0]);
          this.getStandingOrdersBeneficiaries(res.listAlertsPermissionAccount[0].fullAccountNumber);
        },
        error: () => {
          this.endButtons[0].showLoading = false;
        }
      });
  }

  getPurposeTypes() {
    this.endButtons[0].showLoading = true;
    this.modelAndListService.getModel("purposeType").subscribe(
      {
        next: (response) => {
          for (const key in response.purposeType) {
            let obj: KeyValueModel = {
              key: key,
              value: response.purposeType[key]
            }
            this.purposeTypes.push(obj);
          }
          this.pages[1].forms[0].controls['purpose'].controlOptions.options = this.purposeTypes;
          this.endButtons[0].showLoading = false;
        },
        error: () => {
          this.endButtons[0].showLoading = false;
        }
      }
    )
  }

  showOTP() {
    this.otpService.showVerification(this.standingOrderValidateRes?.generateChallengeAndOTP).subscribe((requestValidate: RequestValidate) => {
      this.confirm(requestValidate);
    });
  }

  private getStandingOrdersBeneficiaries(accountNumber: string) {
    this.endButtons[0].isDisable = true;
    this.service.getBeneficiariesList(accountNumber).subscribe({
      next: (res) => {
        this.modelAndListService.getModel('currency').subscribe((countries) => {
          (this.pages[0].forms[0]!.controls['standingOrderBeneficiariesTable'] as TableControl).controlOptions.headers[4].mapObject = countries['currency'];
          this.standingOrderBeneficiariesTable = res.beneficiaryList;
          this.getControl(0, 0, "standingOrderBeneficiariesTable").controlOptions.data = this.standingOrderBeneficiariesTable;
        })
      },
      error: () => {
        this.getControl(0, 0, "standingOrderBeneficiariesTable").controlOptions.data = [];
      }
    })
  }

  private drawActionPage() {
    let form = standingOrderControls(Utils.getToday());
    form.controls["pill"].controlOptions.text = "STANDING ORDER";
    form.controls["benTitle"].controlOptions.title = this.selectedBeneficiaries.beneficiaryFullName;
    form.controls["benTitle"].controlOptions.subTitle = this.selectedBeneficiaries.bankName + " - " + this.selectedBeneficiaries.beneficiaryAccountCode;
    this.pages[1] = new PageModel(2, form);
    this.getPurposeTypes();

  }

  private handleSummaryForm() {
    let standingOrderValidateRequest: StandingOrderValidateRequest = {
      accountNumberForm: this.getControl(0, 0, 'accountFrom').value.fullAccountNumber,
      accountNumberTo: this.selectedBeneficiaries.beneficiaryAccount.fullAccountNumber,
      amountType: this.getControl(1, 0, 'amountType').value.id,
      beneficiaryAccount: this.selectedBeneficiaries.beneficiaryAccount.fullAccountNumber,
      beneficiaryId: this.selectedBeneficiaries.beneficiaryId,
      bg: this.getControl(1, 0, 'amount').value,
      dateFrom: this.getControl(1, 0, 'startDate').value.year + '-' +
        this.getControl(1, 0, 'startDate').value.month + '-' +
        this.getControl(1, 0, 'startDate').value.day,
      dateTo: this.getControl(1, 0, 'endDate').value.year + '-' +
        this.getControl(1, 0, 'endDate').value.month + '-' +
        this.getControl(1, 0, 'endDate').value.day,
      dayMonth: this.getControl(1, 0, 'dayOfTransfer').value,
      name: this.selectedBeneficiaries.name,
      purpose: this.getControl(1, 0, 'purpose').value.key,
      remarks: this.getControl(1, 0, 'remarks').value,
      onType1: false,
      onType2: true,
      orderType1: null,
      orderType2: this.getControl(1, 0, 'freq').value.id.toString(),
      ownAccountsFlag: "N"
    };
    this.service.validateStandingOrder(standingOrderValidateRequest).subscribe({
      next: (res) => {
        this.standingOrderValidateRes = res;
        this.summary = standingOrderSummery();
        this.setSummaryDetails();
        this.pageTitle.stepper!.stepCounter++;
        this.endButtons[0].showLoading = false;
      },
      error: () => {
        this.endButtons[0].showLoading = false;
      }
    })
  }

  private confirm(otp?: RequestValidate) {
    let standingOrderConfirmReq: StandingOrderConfirmReq = {
      requestValidate: otp ? otp : null,
      ...this.standingOrderValidateRes
    }
    this.service.confirmStandingOrder(standingOrderConfirmReq).subscribe({
      next: () => {
        
        for (let section of this.summary.sections!) {
          if(section && section.title && section.title.startButtons) section.title!.startButtons = [];
        }

        this.result = {
          type: this.levelOneOrder ? "Success" : 'Pending',
          title: this.levelOneOrder ? "transfer.standingOrder.success" : 'public.pendingAuthMessage',
          summary: this.summary,
        }
        this.pageTitle.stepper!.stepCounter++;
        this.endButtons[0].showLoading = false;
        if (this.standingOrderValidateRes.standingOrderBatch.futureStatus === "PENDING") {
          this.pendingActionFactory.fetchPendingActions();
        }
      },
      error: () => {
        this.result.type = "Error";
        this.pageTitle.stepper!.stepCounter++;
        this.endButtons[0].showLoading = false;
      }
    });
    this.startButtons = [];
    this.endButtons = [];
    this.levelOneOrder = (this.standingOrderValidateRes.standingOrderBatch.futureSecurityLevelsDTOList?.length === 1 &&
      this.standingOrderValidateRes.standingOrderBatch.pdfSecurityLevelsDTOList?.length === 0)
    this.endButtons = getEndButtons(this.showPendingActions, this.levelOneOrder)
  }

  private setSummaryDetails() {
    let form = this.pages[1].forms[0];
    let pill: PillModel = {
      text: form.controls["pill"].controlOptions.text,
      type: "Neutral",
    };
    let title: TitleModel = {
      id: form.controls["pill"].controlOptions.text,
      title: form.controls["benTitle"].controlOptions.title,
      subTitle: form.controls["benTitle"].controlOptions.subTitle,
      startButtons: [{
        id: "edit-btn",
        type: 'secondary',
        text: 'Edit'
      }]
    };
    let itemModels: SummaryItemModel[] = [];
    itemModels.push(...this.getFormSummaryItem(form));
    this.summary?.sections?.push({
      pill: pill,
      title: title,
      items: itemModels
    });
    if (this.standingOrderValidateRes.standingOrderBatch.futureSecurityLevelsDTOList!.length > 0) {
      this.summary?.sections?.push(Utils.getCurrentLevelAndNextLevelSummarySection(this.translate,
        this.standingOrderValidateRes.standingOrderBatch.futureSecurityLevelsDTOList!));
    }
    this.summary.title!.amount = form.controls['amount'].value;
  }

}
