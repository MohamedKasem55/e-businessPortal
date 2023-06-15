import { CharityTransferService } from './../../../../@core/service/transfer/charity-transfer/charity-transfer.service';
import { Component, OnInit } from '@angular/core';
import { FormResult, PageModel } from 'app/@core/model/dto/formModel';
import { ResultModal } from 'app/@core/model/dto/result.modal';
import { ModelAndListService } from 'app/@core/service/base/modelAndList.service';
import { PopupService } from 'app/@core/service/base/popup.service';
import { ResponseException } from 'app/@core/service/base/responseException';
import { VerificationService } from 'app/@core/service/base/verification.service';
import { TransferBaseComponent } from '../../transfer-base/transfer-base.component';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { GenerateChallengeAndOTP, RequestValidate } from 'app/@core/model/rest/common/otp.model';
import { SummaryModel } from 'arb-design-library/model/summary.model';
import { ValidateReqModel } from 'app/@core/model/rest/transfer/charity-transfer/validate-req.model';
import { ConfirmReqModel } from 'app/@core/model/rest/transfer/charity-transfer/confirm-req.model';
import { charityForm, getEndButtons } from './single-charity-transfer-controls';
import { Account } from 'app/@core/model/rest/common/account';
import {AccountsCommonService} from "../../../../@core/service/accounts/accounts-common.service";

@Component({
    selector: 'app-single-charity-transfer',
    templateUrl: '../../transfer-base/transfer-base.component.html',
    styleUrls: []
})
export class SingleCharityTransferComponent extends TransferBaseComponent implements OnInit {
    generateChallengeAndOTP!: GenerateChallengeAndOTP;
    selectedAccount!: Account;
    requestValidate!: RequestValidate;
    charityCategories: any[] = [];
    charityOrganization: any[] = [];
    charityGroupAccount: any;
    constructor(private popupService: PopupService, private account: AccountsCommonService,
        private otpService: VerificationService, private modelAndListService: ModelAndListService, private CharityTransferService: CharityTransferService
    ) {
        super();
        this.pageTitle.id = "singleCharityTransfer";
        this.pageTitle.title = "transfer.charity.single-charity-transfer";
        this.pageTitle.showArrow = true;
        this.pageTitle.stepper!.steps = ["", "", ""];
        this.drawPage();
        this.setBreadcrumb([{
            text: 'transfer.transfer',
            url: '/transfer'
        }, {
            text: 'transfer.charity.title',
            url: '/transfer/charity-transfer'
        }, { text: 'transfer.charity.single-charity-transfer', url: '' }]);
        this.getDropdownData()
    }
    drawPage() {
        this.account.getSarAccounts().subscribe((accounts) => {
            this.pages = [];
            this.pages = [new PageModel(1, charityForm(this.translate, accounts.listAlertsPermissionAccount))];
            this.getControl(0, 0, 'fromAccount').valueChanges.subscribe((val) => {
                this.selectedAccount = val.value
                this.getControl(0, 0, "charityCategories").controlOptions.options = this.charityCategories;
                if (this.pages) {
                    this.onCharityCategoriesChange()
                    this.onCharityOrganizationChange()
                }
            })
        });
    }

    override onResultChanged(data: FormResult[]) {
        this.endButtons[0].isDisable = !data[0].valid;
    }

    onCharityCategoriesChange() {
        this.getControl(0, 0, "charityCategories").valueChanges.subscribe((res: any) => {
            this.charityOrganization = res.value['value']['charityGroups'];
            this.getControl(0, 0, "charityOrganization").controlOptions.options = this.charityOrganization;
        });
    }
    onCharityOrganizationChange() {
        this.getControl(0, 0, "charityOrganization").valueChanges.subscribe((res: any) => {
            this.getControl(0, 0, "toBeneficiaryAccount").controlOptions.options = res['value']['charityGroupAccounts'];
        });
    }


    getDropdownData() {
        var result: { key: string; value: { description: string, charityGroups: [], }; }[] = [];
        this.modelAndListService.getList(['charityCategories']).subscribe((res) => {
            Object.keys(res.charityCategories).forEach(key => {
                result.push({ 'key': key, 'value': res.charityCategories[key] });
            });
            this.charityCategories = result;
        });
    }

    ngOnInit(): void {
    }

    showOtp() {
        this.otpService.showVerification(this.generateChallengeAndOTP).subscribe((requestValidate: RequestValidate) => {
            this.confirmCharityTransfer(requestValidate);
        });
    }

    nextClick() {
        switch (this.pageTitle.stepper?.stepCounter) {
            case 1:
                this.validateCharityTransfer();
                break;
            case 2:
                this.generateChallengeAndOTP && this.generateChallengeAndOTP.typeAuthentication ? this.showOtp() : this.confirmCharityTransfer();
                break;
            case 3:
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
            case 'Back':
                this.backClick();
                break;
            case 'goToDashboard':
                this.setBreadcrumb([]);
                void this.router.navigate(['/dashboard'])
                break;
            case 'goToCommunityServices':
                this.pages = [];
                void this.router.navigate(['/transfer/charity-transfer']);
                break;
            case 'arrowTitle':
                this.router.navigate(['/transfer/charity-transfer']).then();
                break
        }
    }

    validateCharityTransfer() {
        this.CharityTransferService.validateCharityTransfer(this.returnRequestValidateCharityTransfer()).subscribe({
            next: (res: any) => {
                this.generateChallengeAndOTP = res.generateChallengeAndOTP;
                this.summary = this.fillSummary();
                this.stepperMoveNext();
                this.endButtons = [this.confirmButton];
            },
            error: (error: ResponseException) => {
            }
        });
    }

    confirmCharityTransfer(requestValidate?: RequestValidate) {
        this.nextButton.showLoading = true;
        this.CharityTransferService.confirmCharityTransfer(this.returnRequestConfirmCharityTransfer(requestValidate)).subscribe(
            {
                next: (res) => {
                    this.stepperMoveNext();
                    this.startButtons = [];
                    this.endButtons = getEndButtons();
                    this.summary = {};
                    this.result = this.fillSuccessResult();
                },
                error: (error: ResponseException) => {
                    this.stepperMoveNext();
                    this.startButtons = [];
                    this.endButtons = getEndButtons();
                    this.summary = {};
                    this.result = this.fillErrorResult(error.ErrorResponse.errorDescription!);
                }
            });
    }

    backClick() {
        switch (this.pageTitle.stepper?.stepCounter) {
            case 1:
                void this.router.navigate(['/transfer/charity-transfer']);
                break;
            case 2:
                this.endButtons = [this.nextButton];
                this.stepperMoveBack();
                break;
        }
    }

    returnRequestValidateCharityTransfer(): ValidateReqModel {
        return {}
    }
    returnRequestConfirmCharityTransfer(requestValidate?: RequestValidate): ConfirmReqModel {
        return {
            accountFrom: this.getControl(0, 0, "fromAccount").value.fullAccountNumber,
            transferAmount: this.getControl(0, 0, "amount").value,
            remarks: this.getControl(0, 0, "remarks").value,
            accountTo: this.getControl(0, 0, "toBeneficiaryAccount").value.account,
            requestValidate: requestValidate ? requestValidate : {}
        }
    }
    fillSummary(showEditButton: boolean = false): SummaryModel {
        return {
            title: {
                id: 'SummaryTitle',
                title: 'public.summary',
            },
            sections: [
                {
                    items: [
                        {
                            title: 'transfer.charity.transfer-amount',
                            subTitle: this.getControl(0, 0, "amount").value,
                            currency: "608",
                        },
                        {
                            title: 'transfer.charity.from-account',
                            subTitle: this.getControl(0, 0, "fromAccount").value.fullAccountNumber + ' - ' + this.getControl(0, 0, "fromAccount").value.alias
                        },
                        {
                            title: 'transfer.charity.to-beneficiary-account',
                            subTitle: this.getControl(0, 0, "toBeneficiaryAccount").value.displayText,
                        },
                        {
                            title: 'transfer.charity.charity-categories',
                            subTitle: this.getControl(0, 0, "charityCategories").value.displayText,
                        },
                        {
                            title: 'transfer.charity.charity-organization',
                            subTitle: this.getControl(0, 0, "charityOrganization").value.description,
                        },
                        {
                            title: 'transfer.charity.remarks',
                            subTitle: this.getControl(0, 0, "remarks").value,
                        },
                    ]
                }
            ]
        }
    }

    fillSuccessResult(): ResultModal {
        return {
            type: 'Success',
            title: "transfer.charity.charity-successfully-proccessed",
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


}
