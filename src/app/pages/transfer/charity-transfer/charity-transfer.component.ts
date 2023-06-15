import {CharityTransferService} from './../../../@core/service/transfer/charity-transfer/charity-transfer.service';
import {Component, OnInit} from '@angular/core';
import {PopupService} from "../../../@core/service/base/popup.service";
import {FormModel, PageModel} from 'app/@core/model/dto/formModel';
import {ModelAndListService} from 'app/@core/service/base/modelAndList.service';
import {VerificationService} from 'app/@core/service/base/verification.service';
import {TransferBaseComponent} from '../transfer-base/transfer-base.component';
import {PaginationValueModel} from 'arb-design-library/model/pagination.model';
import {FormButtonClickOutput} from 'app/shared/form/form.component';
import {getSearchForm, getTitleEndButtons, searchData, singleCharityForm} from './charity-transfer-controls';
import {AlertModel} from 'app/@core/model/dto/alert.model';
import {PopupOutputModel} from 'app/@core/model/dto/popup.model';
import {TableControl} from 'app/@core/model/dto/control/table-control';

@Component({
  selector: 'app-charity-transfer',
  templateUrl: '../transfer-base/transfer-base.component.html',
  styleUrls: []
})
export class CharityTransferComponent extends TransferBaseComponent implements OnInit {
  override alert!: AlertModel | null;
  charityTransferBatchList: any[] = [];
  charityCategories: any = [];
  searchForm: FormModel = getSearchForm();

  constructor(private popupService: PopupService,
              private otpService: VerificationService, private modelAndListService: ModelAndListService,
              private charityTransferService: CharityTransferService) {
    super();
    this.setListTitle()
    this.pages = [new PageModel(1, singleCharityForm(this.translate))];
    this.startButtons = [];
    this.getCharityList();
    this.setBreadcrumb([{
      text: 'transfer.transfer',
      url: '/transfer'
    }, {
      text: 'transfer.charity.title',
      url: '/transfer'
    }]);
    (this.getControl(0, 0, "charityTransferTable") as TableControl).onFilterClick?.subscribe(() => {
      this.openSearch();
    });
    this.getDropdownData()
  }

  ngOnInit(): void {
  }

  setListTitle() {
    this.pageTitle = {
      id: "communityService",
      title: "transfer.charity.title",
      stepper: undefined,
      showArrow: true,
      endButtons: getTitleEndButtons(this.translate),
    };
    this.endButtons = [];
  }

  onTablePagination(data: PaginationValueModel) {
    let searchParams: searchData = {
      maxRecs: data.size,
      offset: data.page
    }
    this.getCharityList(searchParams);
  }

  openSearch() {
    this.fillFilters()
    this.searchForm.controls['charityCategoriesType'].valueChanges.subscribe((val) => {
      this.searchForm.controls['charityOrganization'].controlOptions.options = val['value']['value']['value']['charityGroups']
      ;
    })
    this.popupService.showPopup({image: '', form: this.searchForm}).subscribe((res: PopupOutputModel) => {
      if (res.buttonId == "search") {
        this.popupService.dismiss();
        let searchParams: searchData = {
          charityCategoryPk: res.controls['charityCategoriesType'].value ? res.controls['charityCategoriesType'].value.value.key : null,
          charityGroupId: res.controls!["charityOrganization"].value.groupId ? res.controls!["charityOrganization"].value.groupId : null,
        }
        this.getCharityList(searchParams);
      } else if (res.buttonId == "reset") {
        res.controls!['charityCategoriesType'].setValue('')
        res.controls!["charityOrganization"].setValue('')
        this.getCharityList();
        this.popupService.dismiss();
      } else {
        this.popupService.dismiss();
      }
    });
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'singleCharityTransfer':
        this.router.navigateByUrl('/transfer/single-charity-transfer').then(() => {
        });
        break;
      case 'arrowTitle':
        this.router.navigateByUrl('/transfer').then(() => {
        });
        break;
      default:
        break;
    }
  }

  getCharityList(dataSearch?: searchData) {
    let baseParams: searchData = {
      maxRecs: dataSearch?.maxRecs ? dataSearch?.maxRecs : 20,
      offset: dataSearch?.offset ? dataSearch?.offset : 1
    }
    let params = {
      ...baseParams,
      ...(dataSearch?.charityCategoryPk) && {charityCategoryPk: dataSearch.charityCategoryPk},
      ...(dataSearch?.charityGroupId) && {charityGroupId: dataSearch.charityGroupId},
    }

    this.charityTransferService.charityTransferList(params).subscribe({
      next: data => {
      this.charityTransferBatchList = data['charityTransferBatchList'];

      this.getControl(0, 0, "charityTransferTable").controlOptions.data = this.charityTransferBatchList;
      this.getControl(0, 0, "charityTransferTable").controlOptions.total = data.total;
      this.getControl(0, 0, "charityTransferTable").controlOptions.paginationValue = {
        page: dataSearch ? dataSearch.offset : 1,
        size: dataSearch ? dataSearch.maxRecs : 20
      }
    },
    error: () => {
      this.getControl(0, 0, "charityTransferTable").controlOptions.data = [];
    }});
  }


  getDropdownData() {
    var result: { key: string; value: { description: string, charityGroups: [], }; }[] = [];
    this.modelAndListService.getModel('charityCategories').subscribe((res) => {
      Object.keys(res.charityCategories).forEach(key => {
        result.push({'key': key, 'value': res.charityCategories[key]});
      });
      this.charityCategories = result;
    });

    (this.getControl(0, 0, "charityTransferTable") as TableControl).externalPagination?.subscribe((data: PaginationValueModel) => {
      this.onTablePagination(data);
    });
  }

  fillFilters() {
    this.getControl(0, 0, "charityTransferTable").controlOptions.headers[2].mapObject = this.charityCategories['value'];
    this.searchForm.controls['charityCategoriesType'].controlOptions.options = this.objectToKeyValue(this.charityCategories);
  }
}
