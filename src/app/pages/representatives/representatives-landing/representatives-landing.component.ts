import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableHeaderModel } from 'arb-design-library/model/table-header.model';
import { TableHeaderType } from 'arb-design-library';
import { RepresentativesService } from 'app/@core/service/representatives/representatives.service';
import { TitleModel } from 'arb-design-library/model/title.model';
import {
  DetailEvent,
  Representative,
  RepresentativeMapped,
  RequestRepresentativeDelete,
  Status,
} from 'app/@core/model/rest/representatives/representatives-req.model';
import { PopupService } from 'app/@core/service/base/popup.service';
import { ResponseException } from 'app/@core/service/base/responseException';
import { FormModel } from 'app/@core/model/dto/formModel';
import { ButtonControl } from 'app/@core/model/dto/control/button-control';
import { PopupOutputModel } from 'app/@core/model/dto/popup.model';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { DropdownControl } from 'app/@core/model/dto/control/dropdown-control';
import { BreadcrumbService } from 'app/@core/service/base/breadcrumb.service';
import { ServiceLocator } from 'app/@core/service/base/service-locator.service';
import { deleteForm } from '../representatives-add/representatives-add-controls';
import {AuthenticationUtils} from "../../../@core/utility/authentication-utils";

@Component({
  selector: 'app-representatives-landing',
  templateUrl: './representatives-landing.component.html',
})
export class RepresentativesLandingComponent implements OnInit {
  pageTitle: TitleModel = {
    id: 'representatives',
    type: 'Page',
    title: 'representatives.title',
  };

  statuses: Status[] = [
    { key: 'ALL', value: 'All' },
    { key: 'ACTIVE', value: 'Active' },
    { key: 'NOT_ACTIVE', value: 'Inactive' },
    { key: 'EXPIRED', value: 'Expired' },
  ];

  header: TableHeaderModel[] = [
    {
      title: 'representatives.table.name',
      fieldName: 'name',
      type: TableHeaderType.BUTTON,
      controlOptions: {
        id: 'name',
        text: 'name',
      },
    },

    {
      type: TableHeaderType.TEXT,
      title: 'representatives.table.id',
      fieldName: 'repIDNum',
    },
    {
      type: TableHeaderType.TEXT,
      title: 'representatives.table.createdBy',
      fieldName: 'repUsrNm',
    },
    {
      type: TableHeaderType.TEXT,
      title: 'representatives.table.createdDate',
      fieldName: 'repCrtnDate',
    },
    {
      type: TableHeaderType.PILL,
      title: 'representatives.table.status',
      fieldName: 'status',
      controlOptions: {
        NegativeCondition: 'Expired',
        WarningCondition: 'Inactive',
        PositiveCondition: 'Active',
      },
    },
  ];

  addButton: ButtonModel = {
    id: 'addRep',
    type: 'primary',
    text: 'representatives.add.title',
    isDisable: ! AuthenticationUtils.hasAccess('RepresentativesManagement')
  };
  delButton: ButtonModel = {
    id: 'delRep',
    type: 'danger',
    text: 'public.delete',
    prefixIcon: 'arb-icon-Trash',
    isDisable: ! AuthenticationUtils.hasAccess('RepresentativesManagement')
  };

  data!: RepresentativeMapped[] | undefined;

  selectedRepresentative: string[] = [];

  filterForm: FormModel = this.getFilterForm();

  breadcrumbService!: BreadcrumbService;

  isFiltered: boolean = false;

  constructor(
    private representativesService: RepresentativesService,
    private router: Router,
    private popupService: PopupService
  ) {}

  ngOnInit(): void {
    this.getData(this.statuses[0].key);

    this.breadcrumbService = ServiceLocator.injector.get(BreadcrumbService);
    this.breadcrumbService.setBreadcrumb([
      {
        text: 'representatives.title',
        url: '/representatives',
      },
    ]);
  }

  getData(statusCode: string): void {
    if (AuthenticationUtils.hasAccess('RepresentativesManagement')) {
      this.representativesService.getList(statusCode).subscribe({
        next: (response) => {
          this.data = response.representativeInfo.map((item) => ({
            repID: item.repID,
            name: `${item.repGivenName} ${item.repFamilyName}`,
            repIDNum: item.repIDNum,
            repUsrNm: item.repUsrNm,
            repCrtnDate: item.repCrtnDate,
            status: this.mapStatus(item.repSttsCd),
          }));
        },
        error: () => {
          this.data = [];
        },
      });
    }
    else {
      this.data = [];
    }
  }

  mapStatus(status: string): string {
    return this.statuses[
      this.statuses.findIndex((element) => element.key === status)
    ].value;
  }

  navigateAdd(event?: DetailEvent): void {
    if (event) {
      this.router.navigate(['/representatives/representativeDetail'], {
        state: { rep: event!.row.repID },
      });
    } else {
      this.router.navigate(['/representatives/addRepresentative']);
    }
  }

  onFilterClick(): void {
    this.filterForm.controls['status'].controlOptions.options = this.statuses;

    this.popupService
      .showPopup({ image: '', form: this.filterForm })
      .subscribe((res: PopupOutputModel) => {
        switch (res.buttonId) {
          case 'cancel':
            if (!this.isFiltered) {
              this.filterForm.controls['status'].setValue('');
            }
            this.popupService.dismiss();
            break;
          case 'reset':
            this.filterForm.controls['status'].setValue('');
            this.getData(this.statuses[0].key);
            this.isFiltered = false;
            this.popupService.dismiss();
            break;
          case 'search':
            let reqParams;
            res.controls!['status'].value
              ? (reqParams = res.controls!['status'].value['key'])
              : null;
            this.data=undefined
            this.getData(reqParams);
            this.isFiltered = true;
            this.popupService.dismiss();
            break;
        }
      });
  }

  onTrashClicked(): void {
    const popupContent = {
      form: deleteForm(),
      image: 'assets/img/warning.svg',
    };

    const body: RequestRepresentativeDelete[] = [];
    this.selectedRepresentative.forEach((element) => {
      body?.push({
        repAuthId: element,
        repDelReason: 'Delete',
      });
    });

    this.popupService
      .showPopup(popupContent)
      .subscribe((res: PopupOutputModel) => {
        if (res.buttonId === 'delete') {
          this.popupService.dismiss();

          this.representativesService.deleteRepresentative(body).subscribe({
            next: () => {
              this.selectedRepresentative.forEach((repAuthId) => {
                this.data = this.data?.filter(
                  (element) => element.repID !== repAuthId
                );
              });
              this.popupService.dismiss();
              window.scrollTo(0, 0);
            },
            error: (error: ResponseException) => {
              console.log(error);
              window.scrollTo(0, 0);
            },
          });
        } else {
          this.popupService.dismiss();
        }
      });
  }

  selectRep(event: Representative[]): void {
    if (event?.length) {
      this.delButton.isDisable = false;
      event.forEach((element) => {
        this.selectedRepresentative?.push(element.repID);
      });
    } else {
      this.delButton.isDisable = true;
      this.selectedRepresentative = [];
    }
  }

  getFilterForm(): FormModel {
    return new FormModel({
      id: 'filterForm',
      controls: {
        status: new DropdownControl({
          label: 'public.status',
          order: 1,
          columnCount: 12,
          controlOptions: { columnId: 'key', textField: 'value' },
          value: '',
        }),
        cancelButton: new ButtonControl({
          order: 2,
          columnCount: 4,
          controlOptions: {
            id: 'cancel',
            type: 'secondary',
            text: 'public.cancel',
          },
        }),
        resetButton: new ButtonControl({
          order: 3,
          columnCount: 4,
          controlOptions: {
            id: 'reset',
            type: 'secondary',
            text: 'public.reset',
          },
        }),
        searchButton: new ButtonControl({
          order: 4,
          columnCount: 4,
          controlOptions: {
            id: 'search',
            type: 'primary',
            text: 'public.search',
          },
        }),
      },
    });
  }
}
