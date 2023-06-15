import {Component} from '@angular/core';
import {createCheque, createChequePageTitle} from "./create.new.cheque.controls";
import {ButtonModel} from "arb-design-library/model/button.model";
import {FormResult, PageModel} from "../../../@core/model/dto/formModel";
import {SummaryModel} from "arb-design-library/model/summary.model";
import {ResultModal} from "../../../@core/model/dto/result.modal";
import {FormButtonClickOutput} from "../../../shared/form/form.component";
import {AccountControl} from "../../../@core/model/dto/control/account-control";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {ChequesService} from "../../../@core/service/cheques/cheques.service";
import {
  ConfirmCreateChequeReq,
  ValidateChequeRes,
  ValidateCreateChequeReq
} from "../../../@core/model/rest/cheques/create-cheque";
import {Utils} from "../../../@core/utility/Utils";
import {VerificationService} from "../../../@core/service/base/verification.service";
import {AccountsCommonService} from "../../../@core/service/accounts/accounts-common.service";
import {CompanyWorkflowTypeEnum} from 'app/@core/model/rest/company-admin/workflow/company-workflow-type-enum';
import {AuthenticationUtils} from "../../../@core/utility/authentication-utils";
import { PendingActionFactory } from 'app/@core/service/base/pending-action-factory.service';

@Component({
  selector: 'app-create-new-cheque',
  templateUrl: './create-new-cheque.component.html',
})
export class CreateNewChequeComponent {

  pageTitle = createChequePageTitle()

  endButtonList: ButtonModel[] = [{
    id: "Next",
    text: "public.next",
    type: "primary",
    isDisable: true
  }];

  startButtonList: ButtonModel[] = [{
    id: "Back",
    text: "public.back",
    type: "secondary",
    isDisable: false
  }];

  pages: PageModel[] = [];

  summary: SummaryModel = {
    title: {
      id: "summary-title",
      type: 'Section',
      title: "public.summary",
    },
    sections: []
  };

  result: ResultModal = {
    type: 'Success',
    title: 'accounts.cheques.success',
    summary: {},
  };
  private validateChequeRes!: ValidateChequeRes;

  showPendingActions: boolean = AuthenticationUtils.showPendingActions;

  constructor(private accountService: AccountsCommonService,
    private pendingActionFactory: PendingActionFactory,
              private chequeService: ChequesService,
              private verificationService: VerificationService,
              private translate: TranslateService,
              private router: Router) {
    Utils.setBreadcrumb([{
      text: 'accounts.acc',
      url: '/accounts'
    }, {
      text: 'accounts.cheques.title',
      url: '/cheques'
    }, {
      text: 'accounts.cheques.reqNewChequeBook',
      url: ''
    }
    ]);

    this.pages.push(new PageModel(1, createCheque()))
    this.accountService.getSarAccounts().subscribe((res) => {
      let accountControl = (this.pages[0].forms[0].controls['account'] as AccountControl);
      accountControl.controlOptions.options = res.listAlertsPermissionAccount;
    });
  }

  onButtonClick(formButtonClickOutPut:
                  FormButtonClickOutput) {
    switch (formButtonClickOutPut.buttonId) {
      case "arrowTitle":
        void this.router.navigate(['/cheques'])
        break;
      case "Back":
        if (this.pageTitle.stepper?.stepCounter === 1) {
          void this.router.navigate(['/cheques'])
        } else {
          this.pageTitle.stepper!.stepCounter--;
        }
        break;
      case "Next":
        if (this.pageTitle.stepper?.stepCounter === 1) {
          let validateCreateChequeReq: ValidateCreateChequeReq = {
            accountNumber: this.pages[0].forms[0].controls['account'].value.fullAccountNumber,
            chequeType: this.pages[0].forms[0].controls['checkBook'].value.key
          }
          this.chequeService.validateCreateCheque(validateCreateChequeReq).subscribe(
            (res) => {
              this.validateChequeRes = res;
              this.generateSummary()
              this.pageTitle.stepper!.stepCounter++;
            }
          )
        } else if (this.pageTitle.stepper?.stepCounter === 2) {
          let confirmCreateChequeReq: ConfirmCreateChequeReq = {
            batch: this.validateChequeRes.batch,
          }
          if (this.validateChequeRes.batch.futureStatus ===
            'PENDING') {
            this.confirm(confirmCreateChequeReq);
          } else {
            this.verificationService.showVerification(this.validateChequeRes.generateChallengeAndOTP!)
              .subscribe((requestValidate) => {
              confirmCreateChequeReq.requestValidate = requestValidate;
              this.confirm(confirmCreateChequeReq)
            })
          }
        }
        break;
      case "goToCheque":
        void this.router.navigate(['/cheques']);
        break;
      case 'PendingActions':
        Utils.setBreadcrumb([]);
        void this.router.navigate(['/pendingActions/pending-actions-list'])
        break;

    }
  }

  onResultChange(data: FormResult[]) {
    this.endButtonList[0].isDisable = !data[0].valid
  }

  private generateSummary() {
    this.summary.sections = [
      {items: Utils.getFormSummaryItem(this.pages[0].forms[0])}]
    if (this.validateChequeRes.batch.futureSecurityLevelsDTOList!.length! > 0 &&
      this.validateChequeRes.batch.futureStatus !== 'PROCESS') {
      this.summary.sections.push(Utils.getCurrentLevelAndNextLevelSummarySection(this.translate,
        this.validateChequeRes.batch.futureSecurityLevelsDTOList!))
    }
  }

  private confirm(confirmCreateChequeReq: ConfirmCreateChequeReq,
                  ) {
    confirmCreateChequeReq.requestValidate = null;
    this.chequeService.confirmCreateCheque(confirmCreateChequeReq).subscribe(() => {
      this.endButtonList = !this.showPendingActions ? [
          {
            id: 'goToCheque',
            type: 'primary',
            text: 'accounts.cheques.got-to-cheques',
          }
        ] :
        [
          {
            id: 'PendingActions',
            type: 'secondary',
            text: 'transfer.go-to-pending-actions',
          },
          {
            id: 'goToCheque',
            type: 'primary',
            text: 'accounts.cheques.got-to-cheques',
          }
        ]
        if(this.showPendingActions){
          this.pendingActionFactory.fetchPendingActions();
        }
      this.startButtonList = [];
      this.result.summary = this.summary
      this.pageTitle.stepper!.stepCounter++;
    })
  }
}
