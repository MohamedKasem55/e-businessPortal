import {DatePipe} from '@angular/common';
import {VerificationService} from '../../../../@core/service/base/verification.service';
import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormModel, PageModel} from 'app/@core/model/dto/formModel';
import {SummaryModel} from "arb-design-library/model/summary.model";
import {ResultModal} from 'app/@core/model/dto/result.modal';
import {addClaimForm, claimUploadTextForm} from './add-claim-controls';
import {CurrencyPipe} from 'app/@core/pipe/currency.pipe';
import {GenerateChallengeAndOTP, RequestValidate} from 'app/@core/model/rest/common/otp.model';
import {ClaimsService} from 'app/@core/service/point-of-sales/claims/claims.service';
import {ResponseException} from 'app/@core/service/base/responseException';
import {ModelAndListService} from 'app/@core/service/base/modelAndList.service';
import {FormButtonClickOutput} from "../../../../shared/form/form.component";
import {TransactionListsReqModel} from 'app/@core/model/rest/point_of_sales/claims/transaction-list-re.model';

import {ClaimModel} from 'app/@core/model/rest/point_of_sales/claims/claim.model';
import {ValidateUploadModel} from 'app/@core/model/rest/point_of_sales/claims/validate-upload-model';
import {RequestConfirmClaimPosManagement} from 'app/@core/model/rest/point_of_sales/claims/request-confirm-claim';
import {PosBaseComponent} from "../../pos-base/pos-base.component";
import {ButtonModel} from "arb-design-library/model/button.model";

@Component({
  selector: 'app-add-claim',
  templateUrl: '../../pos-base/pos-base.component.html'
})
export class AddClaimComponent extends PosBaseComponent implements OnInit {

  uploadForm: FormModel = claimUploadTextForm();
  claimsReq!: TransactionListsReqModel;
  selectedClaim!: ClaimModel;
  validateUploadModel!: ValidateUploadModel;
  confirmModel!: RequestConfirmClaimPosManagement;
  generateChallengeAndOTP!: GenerateChallengeAndOTP;

  goBackClaims: ButtonModel = {
    id: 'Claims',
    text: 'claims.goBackClaims',
    type: 'primary',
  };

  goBackDasboard: ButtonModel = {
    id: 'Dashboard',
    text: 'claims.goBackDasboard',
    type: 'secondary',
  };

  constructor(public override translate: TranslateService, private modelAndListService: ModelAndListService, private datePipe: DatePipe,
              private currencyPipe: CurrencyPipe, public otpService: VerificationService,
              private claimsService: ClaimsService
  ) {
    super();

    this.pageTitle.id = "addClaim";
    this.pageTitle.title = "claims.addNewClaim";
    this.pageTitle.stepper!.steps = ["", "", ""];
    this.drawPage();
    this.setBreadcrumb([{
      text: 'pos.dashboard.title',
      url: '/pos'
    }, {
      text: 'claims.title',
      url: '/pos/claims'
    }, {text: 'claims.addNewClaim', url: ''}]);

    this.getTerminalsList();
    this.setOnValueChanges();
    this.selectClaims()

  }

  public terminalID!: String;

  drawPage() {
    this.pages = [];
    this.pages = [new PageModel(1, addClaimForm()), new PageModel(2, this.uploadForm), new PageModel(3)];
  }

  ngOnInit(): void {
    this.nextButton.isDisable = true;
    this.uploadForm?.controls['fileControlInput'].valueChanges.subscribe((value: any) => {

      if (this.uploadForm?.controls['fileControlInput'].value) {
        this.nextButton.isDisable = false;
      }

    })
    this.getControl(0, 0, "claimsTable")?.valueChanges.subscribe((value: any) => {

      if (value.value.length >= 1) {
        this.nextButton.isDisable = false;
      } else {
        this.nextButton.isDisable = true;
      }

    })
  }

  setClaimsReq(value: string) {
    this.claimsReq = {
      fromDate: null,
      merchantNum: null,
      toDate: null,
      page: 1,
      rows: 20,
      terminalID: value,
    };
  }

  setOnValueChanges() {

    this.getControl(0, 0, "terminalNumber").valueChanges.subscribe((value: any) => {

      this.setClaimsReq(value.value.value);
      this.getClaimsList();
    })
  }

  getClaimsList() {
    this.claimsService.getTransactionList(this.claimsReq).subscribe(data => {
      const filterTypeList: any[] = [];
      Object.keys(data.listTrxvsMerchant.items).forEach((key: string) => {
        filterTypeList.push({
          key: key,
          terminalID: data.listTrxvsMerchant.items[key].terminalID,
          date: data.listTrxvsMerchant.items[key].trxnDate,
          amount: data.listTrxvsMerchant.items[key].amountForCur,
          cardType: data.listTrxvsMerchant.items[key].cardTypeDesc,
          status: data.listTrxvsMerchant.items[key].terminalStatusDesc,
          selected: null
        })
      });
      this.getControl(0, 0, "claimsTable").controlOptions.data = filterTypeList;
    })
  }

  selectClaims() {
    this.getControl(0, 0, "claimsTable").valueChanges.subscribe(value => {
      this.selectedClaim = {
        amount: value.value[0].amount,
        cardType: value.value[0].cardType,
        date: value.value[0].date,
        status: value.value[0].status,
        terminalID: value.value[0].terminalID,
      }
    });
  }

  validateClaims() {
    this.validateUploadModel = {
      accountNumber: 0,
      reconciliationAmount: this.selectedClaim.amount,
      terminalNumber: this.selectedClaim.terminalID,
      transactionAmount: this.selectedClaim.amount,
      transactionDate: new Date
    }

    const formData = new FormData();
    formData.append('json', JSON.stringify(this.validateUploadModel));
    const fileAttached: File = this.uploadForm.controls['fileControlInput'].value;
    formData.append('file', fileAttached);

    this.claimsService.validateClaims(formData).subscribe(res => {
      if (res.errorCode!) {
        if (res.generateChallengeAndOTP) {
          this.confirmModel = {
            batchList: res.batchList,
          }
          this.generateChallengeAndOTP = res.generateChallengeAndOTP;
        }
      }
    })
  }


  showOtp() {
    this.otpService.showVerification(this.generateChallengeAndOTP).subscribe((requestValidate: RequestValidate) => {
      this.result = this.fillSuccessResult();
      this.stepperMoveNext();
    });
  }


  getTerminalsList() {
    const filterTypeList: any[] = [];
    return this.claimsService.searchTerminals().subscribe({
        next: (res) => {
          Object.keys(res.terminals).forEach((key: string) => {
            filterTypeList.push({key: key, value: res.terminals[key], selected: null})
          })
          this.getControl(0, 0, "terminalNumber").controlOptions.options = filterTypeList;
          this.getControl(0, 0, "claimsTable").controlOptions.data = res.terminals;
        },
        error: (error: ResponseException) => {
          this.getControl(0, 0, "claimsTable").controlOptions.data = [];
          this.alert = {
            id: "error",
            type: "Critical",
            message: "public.generalError",
            showClose: true
          }
        }
      }
    )
  }


  confirmClaims() {
    this.claimsService.confirmClaims(this.confirmModel).subscribe({
      next: (res) => {
        this.stepperMoveNext();
        this.summary = {};
        this.result = this.fillSuccessResult();
        this.confirmButton.isDisable = false
      },
      error: (error: ResponseException) => {
        this.stepperMoveNext();
        this.summary = {};
        this.result = this.fillErrorResult("public.generalError");
        this.endButtons = [this.goBackClaims, this.goBackDasboard]
      }
    });
  }

  fillErrorResult(errString: string): ResultModal {
    return {
      type: 'Error',
      title: errString,
      summary: this.fillSummary(),
    };
  }

  nextClick() {
    switch (this.pageTitle.stepper?.stepCounter) {

      case 1:
        this.nextStep()
        this.nextButton.isDisable = true;
        break;
      case 2:
        this.nextStep()
        this.validateClaims();
        break;
      case 3:
        this.pages = [];
        void this.router.navigate(['/pos']);
        break;
    }
  }


  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'Next':
        this.nextClick();
        break;
      case 'Confirm':
        this.nextClick();
        break;
      case 'Edit':
        this.backClick();
        break;
      case 'Claims':
        void this.router.navigate(['/pos/claims']);

        break;
      case 'Dashboard':
        void this.router.navigate(['/dashboard']);
        break;
      case 'Back':
        this.backClick();

    }
  }


  backClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        void this.router.navigate(['/pos/claims']);
        break;
      case 2:
        this.endButtons = [this.nextButton];
        this.stepperMoveBack();
        this.confirmButton.isDisable = true;
        break;
      case 3:
        this.endButtons = [this.nextButton];
        this.summary = this.fillSummary()
        this.stepperMoveBack();

        break;
    }
  }


  nextStep() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.summaryResult()
        this.stepperMoveNext();
        this.confirmButton.isDisable = true;
        break;

      case 2:
        this.summaryResult()
        this.endButtons! = [this.confirmButton]
        this.generateChallengeAndOTP && this.generateChallengeAndOTP.typeAuthentication ? this.showOtp() : this.confirmClaims();
        break;
      default:
        break;
    }
  }

  fillSuccessResult(): ResultModal {
    return {
      type: 'Success',
      title: "claims.titleSuccess",
      summary: this.fillSummary(),
    };
  }


  summaryResult() {
    this.summary = this.fillSummary();
    this.result = this.fillSuccessResult();
  }

  fillSummary(): SummaryModel {
    return {
      sections: [
        {
          title: {
            id: 'paymentSummary',
            title: 'payments.userApproval.govStatus.paymentSummary',
          },
          items: [
            {
              title: 'claims.terminalNumber',
              subTitle: this.selectedClaim.terminalID.toString()
            },
            {
              title: 'claims.date',
              subTitle: this.selectedClaim.date.toString()
            },
            {
              title: 'claims.amount',
              subTitle: this.selectedClaim.amount.toString()
            },
            {
              title: 'claims.cadType',
              subTitle: this.selectedClaim.cardType
            },
            {
              title: 'claims.status',
              subTitle: this.selectedClaim.status
            },
          ],
        }
      ],
    };
  }
}
