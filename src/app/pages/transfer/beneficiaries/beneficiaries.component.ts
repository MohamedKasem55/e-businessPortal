import { Component } from '@angular/core';
import { AlertModel } from 'app/@core/model/dto/alert.model';
import { ChipsModel } from 'arb-design-library/model/chip.model';
import { PaginationValueModel } from 'arb-design-library/model/pagination.model';
import { TableControl } from '../../../@core/model/dto/control/table-control';
import { FormModel, PageModel } from '../../../@core/model/dto/formModel';
import { PopupOutputModel } from '../../../@core/model/dto/popup.model';
import { BeneficiariesReqModel } from '../../../@core/model/rest/transfer/beneficiary/beneficiaries-req.model';
import { BeneficiaryDeleteReqModel } from '../../../@core/model/rest/transfer/beneficiary/beneficiary-delete-req.model';
import { BeneficiaryModel } from '../../../@core/model/rest/transfer/beneficiary/beneficiary.model';
import { ModelAndListService } from '../../../@core/service/base/modelAndList.service';
import { PopupService } from '../../../@core/service/base/popup.service';
import { ResponseException } from '../../../@core/service/base/responseException';
import { VerificationService } from '../../../@core/service/base/verification.service';
import { BeneficiariesService } from '../../../@core/service/transfer/beneficiaries/beneficiaries.service';
import { FormButtonClickOutput } from '../../../shared/form/form.component';
import { TransferBaseComponent } from '../transfer-base/transfer-base.component';
import {
  getDeleteForm,
  getSearchForm,
  getTitleEndButtons,
  selectBeneficiariesForm,
} from './beneficiaries-controls';

@Component({
  selector: 'app-beneficiaries-transfer',
  templateUrl: '../transfer-base/transfer-base.component.html',
  styleUrls: [],
})
export class BeneficiariesComponent extends TransferBaseComponent {
  override alert!: AlertModel | null;
  beneficiariesReq!: BeneficiariesReqModel;
  searchForm: FormModel = getSearchForm();
  selectedBeneficiaries: BeneficiaryModel[] = [];
  beneficiaryList: any[] = [];

  constructor(
    private popupService: PopupService,
    private otpService: VerificationService,
    private modelAndListService: ModelAndListService,
    private beneficiariesService: BeneficiariesService
  ) {
    super();
    this.setListTitle();
    this.pages = [new PageModel(1, selectBeneficiariesForm(this.translate))];
    this.endButtons = [
      {
        id: 'edit',
        text: 'public.edit',
        type: 'secondary',
        isDisable: false,
        prefixIcon: 'arb-icon-sign',
      },
      {
        id: 'delete',
        text: 'public.delete',
        type: 'danger',
        isDisable: false,
        prefixIcon: 'arb-icon-Trash',
      },
    ];
    this.setBeneficiariesReq();
    this.updateChips();
    this.setBeneficiariesTitle();

    this.setTableOptions();

    this.setBreadcrumb([
      {
        text: 'transfer.transfer',
        url: '/transfer',
      },
      {
        text: 'public.beneficiaries',
        url: '/transfer',
      },
      { text: 'transfer.beneficiary.list-of-beneficiary', url: '' },
    ]);
    (
      this.getControl(0, 0, 'beneficiariesTable') as TableControl
    ).buttonClicked?.subscribe((res: any) => {
      this.router
        .navigateByUrl('/transfer/edit-beneficiaries', {
          state: {
            beneficiary: [res.row],
            details: true,
          },
        })
        .then(() => {});
    });
  }

  setListTitle() {
    this.pageTitle = {
      id: 'BeneficiariesTitle',
      title: 'public.beneficiaries',
      stepper: undefined,
      showArrow: true,
      endButtons: getTitleEndButtons(this.translate),
    };
    if (!this.showPendingActions) {
      this.pageTitle.endButtons?.shift();
    }
    this.endButtons = [];
  }

  getModifyMessage() {
    this.alert = this.router.getCurrentNavigation()!.extras.state?.['message']
      ? {
          id: 'delete',
          type: 'Success',
          message: 'transfer.beneficiary.beneficiary-modified',
          showClose: true,
        }
      : null;
  }

  setTableOptions() {
    this.modelAndListService
      .getList([
        'currencyIso',
        'backEndCountryCode',
        'beneficiaryCategory',
        'beneficiaryType',
      ])
      .subscribe((res) => {
        this.getControl(
          0,
          0,
          'beneficiariesTable'
        ).controlOptions.headers[2].mapObject = res['beneficiaryType'];
        this.getControl(
          0,
          0,
          'beneficiariesTable'
        ).controlOptions.headers[5].mapObject = res['backEndCountryCode'];
        this.getControl(
          0,
          0,
          'beneficiariesTable'
        ).controlOptions.headers[6].mapObject = res['currencyIso'];
        // this.getControl(0, 0, "beneficiariesTable").controlOptions.headers[7].mapObject = res['beneficiaryCategory'];
        
        this.getBeneficiaries();

        this.searchForm.controls['beneficiaryType'].controlOptions.options =
          Object.keys(res['beneficiaryType']).map((key) => {
            return { key: key, value: res['beneficiaryType'][key] };
          });
        this.searchForm.controls[
          'beneficiaryType'
        ].controlOptions.options.unshift({ key: '', value: 'All' });
      });

    (
      this.getControl(0, 0, 'beneficiariesTable') as TableControl
    ).externalPagination?.subscribe((data: PaginationValueModel) => {
      this.onTablePagination(data);
    });

    (
      this.getControl(0, 0, 'beneficiariesTable') as TableControl
    ).onFilterClick?.subscribe(() => {
      this.openSearch();
    });
  }

  setBeneficiariesTitle() {
    this.getControl(0, 0, 'beneficiariesTable').valueChanges.subscribe(
      (value) => {
        this.selectedBeneficiaries = value.value;
        this.updateChips();
      }
    );
  }

  setBeneficiariesReq(options: BeneficiariesReqModel = {}) {
    this.beneficiariesReq = {
      erNumber: '',
      filterBankCode: '',
      filterBenefName: options.filterBenefName || '',
      filterCriteria: options.filterCriteria || 'beneficiary',
      filterCurrency: '',
      page: options.page || 1,
      pageSize: '',
      rows: options.rows || 10,
      type: options.type,
    };
  }

  getBeneficiaries() {
    this.beneficiariesService
      .getBeneficiaries(this.beneficiariesReq)
      .subscribe({
        next: (data) => {
          this.beneficiaryList = data.beneficiaryList;
          this.beneficiaryList.forEach((item) => {
            item.beneficiaryIdErn = item.beneficiaryId + item.ernumber;
          });
          this.getControl(0, 0, 'beneficiariesTable').controlOptions.data =
            this.beneficiaryList;
          this.getControl(0, 0, 'beneficiariesTable').controlOptions.total =
            data.total;
        },
        error: () => {
          this.getControl(0, 0, 'beneficiariesTable').controlOptions.data = [];
        },
      });
  }

  updateChips() {
    let chips: ChipsModel[] = [];
    this.selectedBeneficiaries.forEach((item) => {
      chips.push({
        id: item.beneficiaryId,
        label: item.beneficiaryFullName,
        showClose: true,
      });
    });
    this.getControl(0, 0, 'selectedBeneficiariesTitle').controlOptions.chips =
      chips;
    if (this.selectedBeneficiaries.length > 0) {
      this.endButtons[0].isDisable = false;
      this.endButtons[1].isDisable = false;
    } else {
      this.endButtons[0].isDisable = true;
      this.endButtons[1].isDisable = true;
    }
  }

  onTablePagination(data: PaginationValueModel) {
    this.setBeneficiariesReq({ page: data.page, rows: data.size });
    this.getBeneficiaries();
  }

  openSearch() {
    this.popupService
      .showPopup({ image: '', form: this.searchForm })
      .subscribe((res: PopupOutputModel) => {
        if (res.buttonId == 'search') {
          this.popupService.dismiss();
          this.setBeneficiariesReq({
            page: 1,
            rows: 10,
            filterBenefName: res.controls!['beneficiaryName'].value,
            type: res.controls!['beneficiaryType'].value.key,
          });
          this.getBeneficiaries();
          this.getControl(
            0,
            0,
            'beneficiariesTable'
          ).controlOptions.filterIsActive =
            res.controls!['beneficiaryName'].value ||
            res.controls!['beneficiaryType'].value.key;
        } else if (res.buttonId == 'reset') {
          this.popupService.dismiss();
          res.controls!['beneficiaryName'].setValue('');
          res.controls!['beneficiaryType'].setValue('');
          this.setBeneficiariesReq();
          this.getBeneficiaries();
        } else {
          this.popupService.dismiss();
        }
      });
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'arrowTitle':
        this.router.navigateByUrl('/transfer').then(() => {});
        break;
      case 'UserApprovalStatus':
        this.router
          .navigateByUrl('/transfer/approval?type=beneficiary')
          .then(() => {});
        break;
      case 'AddNewBeneficiary':
        this.router.navigateByUrl('/transfer/add-beneficiaries').then(() => {});
        break;
      case 'edit':
        this.router
          .navigateByUrl('/transfer/edit-beneficiaries', {
            state: {
              beneficiary: this.selectedBeneficiaries,
              details: false,
            },
          })
          .then(() => {});
        break;
      case 'Back':
        this.router.navigateByUrl('/transfer').then(() => {});
        break;
      case 'delete':
        this.openDelete();
        break;
      default:
        this.deleteChips(formButtonClickOutput.buttonId);
        break;
    }
  }

  deleteChips(id: string) {
    const idx = this.selectedBeneficiaries.findIndex(
      (item) => item.beneficiaryId == id
    );
    if (idx >= 0) {
      this.selectedBeneficiaries.splice(idx, 1);
    }
    this.getControl(0, 0, 'beneficiariesTable').setValue(
      this.selectedBeneficiaries
    );
    this.updateChips();
  }

  openDelete() {
    this.popupService
      .showPopup({
        image: 'assets/img/warning.svg',
        form: getDeleteForm(),
      })
      .subscribe((res: PopupOutputModel) => {
        if (res.buttonId == 'delete') {
          this.popupService.dismiss();
          this.selectedBeneficiaries.forEach(
            (item: BeneficiaryModel, index) => {
              let data: BeneficiaryDeleteReqModel = {
                beneficiaryId: item.beneficiaryId,
                ernumber: item.ernumber,
              };
              this.beneficiariesService.deleteBeneficiary(data).subscribe({
                next: (res) => {
                  this.alert = {
                    id: 'delete',
                    type: 'Success',
                    message: 'transfer.beneficiary.beneficiary-deleted',
                    showClose: true,
                  };
                  if (index + 1 == this.selectedBeneficiaries.length) {
                    this.getBeneficiaries();
                    this.selectedBeneficiaries = [];
                    this.updateChips();
                  }
                },
                error: (error: ResponseException) => {
                  this.alert = {
                    id: 'delete',
                    type: 'Critical',
                    message: error.message,
                    showClose: true,
                  };
                  if (index + 1 == this.selectedBeneficiaries.length) {
                    this.getBeneficiaries();
                    this.selectedBeneficiaries = [];
                    this.updateChips();
                  }
                },
              });
            }
          );
        } else {
          this.popupService.dismiss();
        }
      });
  }
}
