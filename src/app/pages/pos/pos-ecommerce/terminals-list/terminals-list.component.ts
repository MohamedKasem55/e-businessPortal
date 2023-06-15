import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Region,
  RequestSearchTerminals,
} from 'app/@core/model/rest/pos/e-commerce/terminals-list-req';
import {
  TerminalItem,
  TerminalsListRes,
} from 'app/@core/model/rest/pos/e-commerce/terminals-list-res';
import { BreadcrumbService } from 'app/@core/service/base/breadcrumb.service';
import { ModelAndListService } from 'app/@core/service/base/modelAndList.service';
import { POSTerminalsService } from 'app/@core/service/pos/e-commerce/pos-terminals.service';
import { TableHeaderType } from 'arb-design-library';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { PaginationValueModel } from 'arb-design-library/model/pagination.model';
import { TableHeaderModel } from 'arb-design-library/model/table-header.model';
import { PopupService } from 'app/@core/service/base/popup.service';
import { take } from 'rxjs';
import { FormModel } from 'app/@core/model/dto/formModel';
import { DropdownControl } from 'app/@core/model/dto/control/dropdown-control';
import { ButtonControl } from 'app/@core/model/dto/control/button-control';
import { PopupOutputModel } from 'app/@core/model/dto/popup.model';
import { TextInputControl } from 'app/@core/model/dto/control/text-input-control';
import { KeyValueModel } from 'app/@core/model/rest/common/key-value.model';

@Component({
  selector: 'app-terminals-list',
  templateUrl: './terminals-list.component.html',
})
export class TerminalsListComponent implements OnInit {
  headers: TableHeaderModel[] = [];
  paginationValue: PaginationValueModel = { page: 1, size: 50 };
  data!: Array<any>;
  total: number = 0;
  exportFileName: string = 'Alrajhi POS List of Terminals';
  searchParams: RequestSearchTerminals = {
    order: '',
    orderType: '',
    region: '',
    city: '',
    accountNumber: '',
    terminalId: '',
    terminalName: '',
    location: '',
    phone: '',
    mobile: '',
    fax: '',
    allTerminals: false,
  };
  combinedFilesButton: ButtonModel = {
    id: 'combinedFilesButton',
    type: 'primary',
    text: 'pos.e-commerce.list-of-terminals.combined-file',
    isDisable: false,
  };
  summaryData: RequestSearchTerminals = {};
  selectedTerminal: TerminalItem[] = [];
  filterForm: FormModel = this.getFilterForm();
  isFiltered: boolean = false;
  accounts: Array<any> = [];
  regions: Region[] = [];
  region: string | undefined = '';
  cities: Array<any> = [];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private modelAndListService: ModelAndListService,
    private posTerminalsService: POSTerminalsService,
    private popupService: PopupService
  ) {
    this.breadcrumbService.setBreadcrumb([
      {
        text: 'pos.dashboard.title',
        url: '/pos',
      },
      {
        text: 'pos.e-commerce.title',
        url: '/pos/e-commerce',
      },
      {
        text: 'pos.e-commerce.list-of-terminals.title',
        url: '',
      },
    ]);

    this.modelAndListService
      .getList(['terminalRegion'])
      .pipe(take(1))
      .subscribe((res) => {
        this.regions = this.objectToKeyValue(res.terminalRegion);
      });
  }

  ngOnInit(): void {
    this.setEcommerceTableHeaders();
    this.fillTerminalsListTable(this.paginationValue, this.searchParams);
  }

  onTitleButtonClick(id: string) {
    switch (id) {
      case 'arrowTitle':
        this.router.navigateByUrl('/pos/e-commerce').then(() => {});
        break;
    }
  }

  setEcommerceTableHeaders() {
    this.modelAndListService
      .getList(['errors', 'terminalRegion'])
      .subscribe((data) => {
        this.headers = [];
        let headers: TableHeaderModel[] = [];

        headers.push({
          title: 'pos.e-commerce.list-of-terminals.terminal-id',
          type: TableHeaderType.BUTTON,
          fieldName: 'terminalId',
          controlOptions: {
            id: 'terminalId',
            text: 'terminalId',
          },
        });
        headers.push({
          title: 'pos.e-commerce.list-of-terminals.terminal-name',
          type: TableHeaderType.TEXT,
          fieldName: 'terminalName',
        });
        headers.push({
          title: 'pos.e-commerce.list-of-terminals.account',
          type: TableHeaderType.TEXT,
          fieldName: 'account',
        });
        headers.push({
          title: 'pos.e-commerce.list-of-terminals.region',
          type: TableHeaderType.TEXT,
          fieldName: 'region',
          mapObject: this.regions,
        });
        headers.push({
          title: 'pos.e-commerce.list-of-terminals.location',
          type: TableHeaderType.TEXT,
          fieldName: 'location',
        });
        headers.push({
          title: 'pos.e-commerce.list-of-terminals.city',
          type: TableHeaderType.TEXT,
          fieldName: 'city',
        });
        headers.push({
          title: 'pos.e-commerce.list-of-terminals.mobile-number',
          type: TableHeaderType.TEXT,
          fieldName: 'mobileNumber',
        });

        this.headers = headers;
      });
  }

  fillTerminalsListTable(
    page: PaginationValueModel,
    searchParams: RequestSearchTerminals
  ) {
    const params: RequestSearchTerminals = {
      page: page.page,
      rows: page.size,
      order: searchParams.order,
      orderType: searchParams.orderType,
      region: searchParams.region,
      city: searchParams.city,
      accountNumber: searchParams.accountNumber,
      terminalId: searchParams.terminalId,
      terminalName: searchParams.terminalName,
      location: searchParams.location,
      phone: searchParams.phone,
      mobile: searchParams.mobile,
      fax: searchParams.fax,
      allTerminals: searchParams.allTerminals,
    };
    this.posTerminalsService
      .getTerminalsList(params)
      .pipe(take(1))
      .subscribe({
        next: (res: TerminalsListRes) => {
          if (res.terminalOutputDto?.size) {
            const list: Array<TerminalItem> = [];
            let account: {
              key: number;
              value: string | undefined;
            } = {
              key: 0,
              value: '',
            };
            let city: {
              key: number;
              value: string | undefined;
            } = {
              key: 0,
              value: '',
            };

            res.terminalOutputDto?.items.forEach(
              (item: TerminalItem, index: number) => {
                this.regions.find((element) => {
                  if (element.key == item.region) {
                    this.region = element.value;
                  }
                });
                const object = {
                  terminalId: item.terminalId,
                  terminalName: item.name,
                  account: item.account,
                  region: this.region,
                  location: item.location,
                  city: item.city,
                  mobileNumber: item.mobile,
                  phone: item.telephone,
                  fax: item.fax,
                  email: item.email,
                  poBox: item.pobox,
                  zipCode: item.zipCode,
                };
                account = {
                  key: index,
                  value: item.account,
                };

                city = {
                  key: index,
                  value: item.city,
                };

                if (
                  this.accounts.find(
                    (element) => element.value === account.value
                  ) === undefined
                ) {
                  this.accounts.push(account);
                }

                if (
                  this.cities.find(
                    (element) => element.value === city.value
                  ) === undefined
                ) {
                  this.cities.push(city);
                }
                list.push(object);
              }
            );
            this.data = list;
          } else {
            this.data = [];
          }
        },
        error: () => {
          this.data = [];
        }
      });
  }

  onFilterClick() {
    this.filterForm.controls['account'].controlOptions.options = this.accounts;
    this.filterForm.controls['region'].controlOptions.options = this.regions;
    this.filterForm.controls['city'].controlOptions.options = this.cities;

    this.popupService
      .showPopup({ image: '', form: this.filterForm })
      .subscribe((res: PopupOutputModel) => {
        switch (res.buttonId) {
          case 'close':
            if (!this.isFiltered) {
              this.filterForm.controls['account'].setValue('');
              this.filterForm.controls['region'].setValue('');
              this.filterForm.controls['city'].setValue('');
              this.filterForm.controls['terminalId'].setValue('');
              this.filterForm.controls['terminalName'].setValue('');
              this.filterForm.controls['location'].setValue('');
              this.filterForm.controls['phone'].setValue('');
              this.filterForm.controls['mobile'].setValue('');
              this.filterForm.controls['fax'].setValue('');
            }
            this.popupService.dismiss();
            break;
          case 'reset':
            this.filterForm.controls['account'].setValue('');
            this.filterForm.controls['region'].setValue('');
            this.filterForm.controls['city'].setValue('');
            this.filterForm.controls['terminalId'].setValue('');
            this.filterForm.controls['terminalName'].setValue('');
            this.filterForm.controls['location'].setValue('');
            this.filterForm.controls['phone'].setValue('');
            this.filterForm.controls['mobile'].setValue('');
            this.filterForm.controls['fax'].setValue('');

            this.searchParams = {
              order: '',
              orderType: '',
              region: '',
              city: '',
              accountNumber: '',
              terminalId: '',
              terminalName: '',
              location: '',
              phone: '',
              mobile: '',
              fax: '',
              allTerminals: false,
            };

            this.fillTerminalsListTable(
              this.paginationValue,
              this.searchParams
            );
            this.isFiltered = false;
            this.popupService.dismiss();
            break;
          case 'search':
            this.searchParams.accountNumber = this.filterForm?.controls[
              'account'
            ].value
              ? this.filterForm?.controls['account'].value['value']
              : '';

            this.searchParams.region = this.filterForm?.controls['region'].value
              ? this.filterForm?.controls['region'].value['key']
              : '';

            this.searchParams.city = this.filterForm?.controls['city'].value
              ? this.filterForm?.controls['city'].value['value']
              : '';

            this.searchParams.terminalId = this.filterForm?.controls[
              'terminalId'
            ].value
              ? this.filterForm?.controls['terminalId'].value
              : '';
            this.searchParams.terminalName = this.filterForm?.controls[
              'terminalName'
            ].value
              ? this.filterForm?.controls['terminalName'].value
              : '';
            this.searchParams.location = this.filterForm?.controls['location']
              .value
              ? this.filterForm?.controls['location'].value
              : '';

            this.searchParams.phone = this.filterForm?.controls['phone'].value
              ? this.filterForm?.controls['phone'].value
              : '';

            this.searchParams.mobile = this.filterForm?.controls['mobile'].value
              ? this.filterForm?.controls['mobile'].value
              : '';
            this.searchParams.fax = this.filterForm?.controls['fax'].value
              ? this.filterForm?.controls['fax'].value
              : '';

            this.fillTerminalsListTable(
              this.paginationValue,
              this.searchParams
            );
            this.isFiltered = true;
            this.popupService.dismiss();
            break;
        }
      });
  }

  getFilterForm(): FormModel {
    return new FormModel({
      id: 'filterForm',
      controls: {
        account: new DropdownControl({
          label: 'pos.e-commerce.list-of-terminals.account',
          order: 1,
          columnCount: 12,
          controlOptions: { columnId: 'key', textField: 'value' },
          value: '',
        }),
        region: new DropdownControl({
          label: 'pos.e-commerce.list-of-terminals.region',
          order: 2,
          columnCount: 12,
          controlOptions: { columnId: 'key', textField: 'value' },
          value: '',
        }),
        city: new DropdownControl({
          order: 3,
          columnCount: 12,
          class: 'text-start color-arb-primaryText ',
          label: 'pos.e-commerce.list-of-terminals.city',
          controlOptions: { columnId: 'key', textField: 'value' },
          value: '',
        }),
        terminalId: new TextInputControl({
          order: 4,
          columnCount: 12,
          class: 'text-start color-arb-primaryText ',
          label: 'pos.e-commerce.list-of-terminals.terminal-id',
          value: '',
        }),
        terminalName: new TextInputControl({
          order: 5,
          columnCount: 12,
          class: 'text-start color-arb-primaryText ',
          label: 'pos.e-commerce.list-of-terminals.terminal-name',
          value: '',
        }),
        location: new TextInputControl({
          order: 6,
          columnCount: 12,
          class: 'text-start color-arb-primaryText ',
          label: 'pos.e-commerce.list-of-terminals.location',
          value: '',
        }),
        phone: new TextInputControl({
          order: 7,
          columnCount: 12,
          class: 'text-start color-arb-primaryText ',
          label: 'pos.e-commerce.list-of-terminals.phone',
          value: '',
        }),
        mobile: new TextInputControl({
          order: 8,
          columnCount: 12,
          class: 'text-start color-arb-primaryText ',
          label: 'pos.e-commerce.list-of-terminals.mobile-number',
          value: '',
        }),
        fax: new TextInputControl({
          order: 9,
          columnCount: 12,
          class: 'text-start color-arb-primaryText ',
          label: 'pos.e-commerce.list-of-terminals.fax-number',
          value: '',
        }),
        close: new ButtonControl({
          order: 10,
          columnCount: 4,
          controlOptions: {
            id: 'close',
            type: 'secondary',
            text: 'public.cancel',
          },
        }),
        reset: new ButtonControl({
          order: 11,
          columnCount: 4,
          controlOptions: {
            id: 'reset',
            type: 'secondary',
            text: 'public.reset',
          },
        }),
        search: new ButtonControl({
          order: 12,
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

  objectToKeyValue(object: any): KeyValueModel[] {
    let data: KeyValueModel[] = [];
    Object.keys(object).forEach((key) => {
      data.push({ key, value: object[key] });
    });
    return data;
  }

  onTerminalClicked(id: any) {
    this.summaryData = id.row;

    this.router
      .navigate(['/pos/e-commerce/terminal-details'], {
        queryParams: this.summaryData,
      })
      .then(() => {});
  }
}
