import { Component } from '@angular/core';
import { createChequePageTitle } from "../create-new-cheque/create.new.cheque.controls";
import { ButtonModel } from "arb-design-library/model/button.model";
import { FormResult, PageModel } from "../../../@core/model/dto/formModel";
import { SummaryModel } from "arb-design-library/model/summary.model";
import { ResultModal } from "../../../@core/model/dto/result.modal";
import { FormButtonClickOutput } from "../../../shared/form/form.component";
import { deleteCheque, deleteChequePageTitle } from "./stop.cheque.controls";
import { AccountControl } from "../../../@core/model/dto/control/account-control";
import { ChequesService } from "../../../@core/service/cheques/cheques.service";
import { VerificationService } from "../../../@core/service/base/verification.service";
import { Router } from "@angular/router";
import { Cheque } from "../../../@core/model/rest/cheques/cheques-list";
import { SummaryItemModel } from "arb-design-library/model/summary-item.model";
import { TranslateService } from "@ngx-translate/core";
import { Utils } from "../../../@core/utility/Utils";
import { ValidateChequeRes } from "../../../@core/model/rest/cheques/create-cheque";
import { ConfirmDeleteChequeReq, ValidateDeleteChequeReq } from "../../../@core/model/rest/cheques/delete-cheque";
import { BatchDTO } from "../../../@core/model/rest/common/batchResponse";
import { RequestValidate } from "../../../@core/model/rest/common/otp.model";
import { AccountsCommonService } from "../../../@core/service/accounts/accounts-common.service";
import { CompanyWorkflowTypeEnum } from 'app/@core/model/rest/company-admin/workflow/company-workflow-type-enum';
import {AuthenticationUtils} from "../../../@core/utility/authentication-utils";

@Component({
  selector: 'app-stop-cheque',
  templateUrl: './stop-cheque.component.html',
})
export class StopChequeComponent {

  pageTitle = deleteChequePageTitle()

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
  validateChequeRes!: ValidateChequeRes;
  showPendingActions: boolean = AuthenticationUtils.showPendingActions;

  constructor(private accountService: AccountsCommonService,
    private chequeService: ChequesService,
    private verificationService: VerificationService,
    private translate: TranslateService,
    private router: Router) {
    this.pages.push(new PageModel(1, deleteCheque()));

    this.accountService.getSarAccounts().subscribe((res) => {
      let accountControl = (this.pages[0].forms[0].controls['account'] as AccountControl);
      accountControl.controlOptions.options = res.listAlertsPermissionAccount;
    });
  }

  onButtonClick(formButtonClickOutPut: FormButtonClickOutput) {
    switch (formButtonClickOutPut.buttonId) {
      case "Back":
        void this.router.navigate(['/cheques'])
        break;
      case "goToCheque":
        void this.router.navigate(['/cheques']);
        break;
      case "Next":
        let validateDeleteCheque: ValidateDeleteChequeReq = {
          accountNumber: this.pages[0].forms[0].controls['account'].value.fullAccountNumber,
          chequeNumber: this.pages[0].forms[0].controls['chequeNumber'].value,
          stopMode: this.pages[0].forms[0].controls['checkBook'].value.key
        }

        switch (this.pageTitle.stepper?.stepCounter) {
          
          case 1:
            this.generateSummary()
            this.pageTitle.stepper!.stepCounter++

              this.chequeService.validateDeleteCheque(validateDeleteCheque).subscribe((validateChequeRes) => {
                this.validateChequeRes = validateChequeRes;
            if (this.validateChequeRes.batch.futureSecurityLevelsDTOList &&
              this.validateChequeRes.batch.futureSecurityLevelsDTOList?.length > 0) {
              this.summary.sections!.push(
                Utils.getCurrentLevelAndNextLevelSummarySection(this.translate,
                  this.validateChequeRes.batch.futureSecurityLevelsDTOList)
              );
            }
          })
            break;
          case 2:
            this.summary.sections
            this.chequeService.validateDeleteCheque(validateDeleteCheque).subscribe((validateChequeRes) => {
              this.validateChequeRes = validateChequeRes;
              let confirmDeleteChequeReq: ConfirmDeleteChequeReq = {
                batch: this.validateChequeRes.batch,
                requestValidate: {}
              }
           
              if (validateChequeRes.batch.futureStatus === BatchDTO.FutureStatusEnum.PENDING) {
                this.confirm(confirmDeleteChequeReq);
              } else {
                this.verificationService.showVerification(validateChequeRes.generateChallengeAndOTP!).subscribe((requestValidate) => {
                  confirmDeleteChequeReq.requestValidate = requestValidate;
                  this.confirm(confirmDeleteChequeReq);
                })
              }
            })
        }
        break;
      case 'PendingActions':
        Utils.setBreadcrumb([]);
        void this.router.navigate(['/pendingActions/pending-actions-list'])
        break;
    }
  }

  private generateSummary() {
    this.summary.sections = [{ items: Utils.getFormSummaryItem(this.pages[0].forms[0]) }];
  }

  onResultChange(data: FormResult[]) {
    this.endButtonList[0].isDisable = !data[0].valid
  }

  confirm(confirmDeleteChequeReq: ConfirmDeleteChequeReq) {
    this.chequeService.confirmDeleteCheque(confirmDeleteChequeReq).subscribe(() => {
      this.result.summary = this.summary
      this.pageTitle.stepper!.stepCounter++;
      this.endButtonList = !this.showPendingActions?[
        {
          id: 'goToCheque',
          type: 'primary',
          text: 'accounts.cheques.got-to-cheques',
        }
      ]:
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
      this.startButtonList = [];
    })
  }


}
