import {Component, OnInit} from '@angular/core';
import {FormModel, PageModel} from 'app/@core/model/dto/formModel';
import { getSearchForm, getTitleEndButtons, selectClaimsForm} from "./claims-controls";
import {AlertModel} from "app/@core/model/dto/alert.model";
import {PopupService} from "../../../@core/service/base/popup.service";
import {PopupOutputModel} from "../../../@core/model/dto/popup.model";
import {TableControl} from "../../../@core/model/dto/control/table-control";
import {FormButtonClickOutput} from "../../../shared/form/form.component";
import { ClaimsService } from 'app/@core/service/point-of-sales/claims/claims.service';
import { RequestListClaimPosManagement } from 'app/@core/model/rest/point_of_sales/claims/request-list-claim';
import { ResponseException } from 'app/@core/service/base/responseException';
import {PosBaseComponent} from "../pos-base/pos-base.component";


@Component({
  selector: 'app-claims',
  templateUrl: '../pos-base/pos-base.component.html',
  styleUrls: []
})

export class ClaimsComponent extends PosBaseComponent{

  override alert!: AlertModel | null;
  searchForm: FormModel = getSearchForm();
  requestListClaimPosManagement!: RequestListClaimPosManagement;


  constructor( private popupService: PopupService, private claimsService: ClaimsService) {
    super();
    this.setBreadcrumb([{
      text: 'pos.dashboard.title',
      url: '/pos'
    }, {text: 'claims.title', url: '/claims'}]);


    this.pageTitle.id = "ClaimsTitle";
    this.pageTitle.title = "claims.title";
    this.pageTitle.stepper!.steps = ["", "", ""];
    this.endButtons[0].showLoading = true;
    this.pages = [new PageModel(1,selectClaimsForm(this.translate))];
    (this.getControl(0, 0, "claimsTable") as TableControl).onFilterClick?.subscribe(() => {
      this.openSearch();
    });
    this.setListTitle()
    this.getTerminalsList()
  }

  setListTitle() {
    this.pageTitle = {
      id: "claimsTitle",
      title: "claims.title",
      stepper: undefined,
      endButtons: getTitleEndButtons(this.translate),
    };
    this.endButtons = [];
  }


  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'AddNewClaim':
        this.router.navigateByUrl('/pos/add-claim').then(() => {
        });
        break;
      case 'edit':
        this.router.navigateByUrl('/pos/edit-claim').then(() => {
        });
        break;
      case 'Back':
        this.router.navigateByUrl('/pos').then(() => {
        });
        break;
      default:
        break;
    }
  }

  openSearch() {
    this.popupService.showPopup({image: '', form: this.searchForm}).subscribe((res: PopupOutputModel) => {
      if (res.buttonId == "search") {
        this.requestListClaimPosManagement = {
          amountFrom: this.searchForm.controls["amountFrom"].value,
          amountTo:this.searchForm.controls["amountTo"].value,
          dateFrom:this.searchForm.controls["dateFrom"].value,
          dateTo:this.searchForm.controls["dateTo"].value,
          page:1,
          rows:20,
          orderType: "ticketNumber",
          order: "asc",
          terminalNumber:this.searchForm.controls["terminalNumber"].value.value,
          ticketNumber:this.searchForm.controls["claimID"].value,
        }
        this.claimsService.getClaims(this.requestListClaimPosManagement).subscribe(key =>{
        })
        this.popupService.dismiss();
       } else if(res.buttonId == "reset"){
        this.popupService.dismiss();
      } else {
        this.popupService.dismiss();
      }
    });

    this.claimsService.searchTerminals().subscribe({
      next: (res) => {
        const filterTypeList: any[] = [];
        Object.keys(res.terminals).forEach((key: string) => {
          filterTypeList.push({key: key, value: res.terminals[key], selected: null})
        })
        this.searchForm.controls["terminalNumber"].controlOptions.options = filterTypeList;
      },
      error: (error: ResponseException) => {
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

  getTerminalsList(){
    const filterTypeList: any[] = [];
    this.claimsService.searchTerminals().subscribe({
      next: (res) => {
        Object.keys(res.terminals).forEach((key: string) => {
          filterTypeList.push({key: key, value: res.terminals[key], selected: null})
        })
        this.getControl(0, 0, "claimsTable").controlOptions.data = res.terminals;
      },
      error: (error: ResponseException) => {
        this.getControl(0, 0, "claimsTable").controlOptions.data =[];
        this.alert = {
          id: "error",
          type: "Critical",
          message: "public.generalError",
          showClose: true
        }
      }
    }
    )
    return filterTypeList;
   }

}

