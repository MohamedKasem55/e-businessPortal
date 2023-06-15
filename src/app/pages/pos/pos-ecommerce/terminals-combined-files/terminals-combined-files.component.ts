import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonControl } from 'app/@core/model/dto/control/button-control';
import { DateControl } from 'app/@core/model/dto/control/date-control';
import { DropdownControl } from 'app/@core/model/dto/control/dropdown-control';
import { FormModel } from 'app/@core/model/dto/formModel';
import { PopupOutputModel } from 'app/@core/model/dto/popup.model';
import {
  Period,
  SearchTerminalCombinedFileReq,
  TerminalStatementDownloadReq,
} from 'app/@core/model/rest/pos/e-commerce/terminal-statement-req';
import { FileDownloadData } from 'app/@core/model/rest/pos/e-commerce/terminal-statement-res';
import { SearchTerminalStatementsReq } from 'app/@core/model/rest/pos/e-commerce/terminals-list-req';
import { BreadcrumbService } from 'app/@core/service/base/breadcrumb.service';
import { ModelAndListService } from 'app/@core/service/base/modelAndList.service';
import { PopupService } from 'app/@core/service/base/popup.service';
import { POSTerminalsService } from 'app/@core/service/pos/e-commerce/pos-terminals.service';
import { TableHeaderType } from 'arb-design-library';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { PaginationValueModel } from 'arb-design-library/model/pagination.model';
import { TableHeaderModel } from 'arb-design-library/model/table-header.model';
import { 
  TerminalStatementDownloadDTO, 
  DisplayedTerminalStatementList, 
} from 'app/@core/model/rest/pos/e-commerce/terminal-statement-res';
import { lastValueFrom, take } from 'rxjs';

@Component({
  selector: 'app-terminals-combined-files',
  templateUrl: './terminals-combined-files.component.html',
})
export class TerminalsCombinedFilesComponent implements OnInit {
  headers: TableHeaderModel[] = [];
  paginationValue: PaginationValueModel = { page: 1, size: 50 };
  displayedData!: Array<any>;
  total: number = 0;
  exportFileName: string = 'Alrajhi POS Terminal Statement';
  searchParams: SearchTerminalStatementsReq = {
    dateFrom: '',
    dateTo: '',
    period: 'D',
    allTerminals: true,
  };
  downloadButton: ButtonModel = {
    id: 'downloadButton',
    type: 'primary',
    text: 'pos.e-commerce.terminal-statement.download',
    isDisable: true,
  };
  terminalInfo: Array<any> = [];
  selectedTerminal: FileDownloadData[] = [];
  filterForm: FormModel = this.getFilterForm();
  isFiltered: boolean = false;
  terminalList: FileDownloadData[] = [];
  period: Period[] = [
    {
      key: 'D',
      value: 'public.period.daily',
    },
    {
      key: 'W',
      value: 'public.period.weekly',
    },
    {
      key: 'M',
      value: 'public.period.monthly',
    },
  ];
  lastDate: string = '';
  currentDate: string = '';

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
        text: 'pos.e-commerce.terminal-statement.title',
        url: '',
      },
    ]);
    this.dateFormatting();
  }

  ngOnInit(): void {
    this.searchParams.selectedTerminals = history.state.selectedTerminals || [];
    this.setTerminalStatementTableHeaders();
    this.initiateTerminalStatementTable();
  }

  onTitleButtonClick(id: string) {
    switch (id) {
      case 'arrowTitle':
        this.router
          .navigateByUrl('/pos/e-commerce/terminal-statement')
          .then(() => {});
        break;
    }
  }

  setTerminalStatementTableHeaders() {
    this.modelAndListService.getList(['errors']).subscribe((data) => {
      this.headers = [];
      let headers: TableHeaderModel[] = [];
      headers.push({
        title: 'pos.e-commerce.terminal-statement.download-statement',
        type: TableHeaderType.TEXT,
        fieldName: 'downloadStatement',
      });
      headers.push({
        title: 'pos.e-commerce.list-of-terminals.terminal-id',
        type: TableHeaderType.TEXT,
        fieldName: 'terminalId',
      });
      headers.push({
        title: 'pos.e-commerce.terminal-statement.date-received',
        type: TableHeaderType.TEXT,
        fieldName: 'dateReceived',
      });

      this.headers = headers;
    });
  }

  async initiateTerminalStatementTable() {
    this.searchParams.allTerminals =
      !this.searchParams.selectedTerminals?.length;
    const dailyTerminalStatement = await this.getTerminalStatementList(
      this.searchParams,
      'Daily'
    );
    const weeklyTerminalStatement = await this.getTerminalStatementList(
      this.searchParams,
      'Weekly'
    );
    const monthyTerminalStatement = await this.getTerminalStatementList(
      this.searchParams,
      'Monthly'
    );
    this.displayedData = [
      ...dailyTerminalStatement,
      ...weeklyTerminalStatement,
      ...monthyTerminalStatement,
    ];
  }

  async getTerminalStatementList(
    searchParams: SearchTerminalCombinedFileReq,
    period: string = ''
  ): Promise<DisplayedTerminalStatementList[]> {
    const params: SearchTerminalCombinedFileReq = {
      dateFrom: searchParams.dateFrom || this.lastDate,
      dateTo: searchParams.dateTo || this.currentDate,
      period: period[0] || searchParams.period,
      allTerminals: searchParams.allTerminals,
      selectedTerminals: searchParams.selectedTerminals,
    };
    try {
      const resultList: TerminalStatementDownloadDTO = await lastValueFrom(
        this.posTerminalsService
          .getTerminalStatementCombinedFile(params)
          .pipe(take(1))
      );
      return (
        resultList &&
        this.formatDisplayedStatments(resultList, period || 'Daily')
      );
    } catch (error) {
      return [];
    }
  }

  formatDisplayedStatments(
    statements: TerminalStatementDownloadDTO | undefined,
    periodType: string
  ) {
    if (statements && statements.outputDTO.size) {
      const list: DisplayedTerminalStatementList[] = [];
      statements.outputDTO.fileList?.forEach((item) => {
        item.type = periodType;
        const displayedItem: DisplayedTerminalStatementList = {
          downloadStatement: item.fileName!,
          terminalId: 'POS',
          dateReceived: item.dataReceived!,
        };
        list.push(displayedItem);
      });
      this.terminalList = statements.outputDTO.fileList;
      return list;
    }
    return [];
  }

  onFilterClick() {
    this.filterForm.controls['period'].controlOptions.options = this.period;

    this.popupService
      .showPopup({ image: '', form: this.filterForm })
      .subscribe(async(res: PopupOutputModel) => {
        switch (res.buttonId) {
          case 'close':
            if (!this.isFiltered) {
              this.filterForm.controls['dateFrom'].setValue('');
              this.filterForm.controls['dateTo'].setValue('');
              this.filterForm.controls['period'].setValue('');
            }
            this.popupService.dismiss();
            break;
          case 'reset':
            this.filterForm.controls['dateFrom'].setValue('');
            this.filterForm.controls['dateTo'].setValue('');
            this.filterForm.controls['period'].setValue('');

            this.searchParams.dateFrom = this.lastDate;
            this.searchParams.dateTo = this.currentDate;
            this.searchParams.period = 'D';

            this.displayedData = await this.getTerminalStatementList(this.searchParams);
            this.isFiltered = false;
            this.popupService.dismiss();
            break;
          case 'search':
            this.searchParams.dateFrom = this.filterForm.controls['dateFrom']
              .value
              ? res?.controls['dateFrom'].value.year +
                '-' +
                res?.controls['dateFrom'].value.month +
                '-' +
                res?.controls['dateFrom'].value.day
              : this.lastDate;

            this.searchParams.dateTo = this.filterForm.controls['dateFrom']
              .value
              ? res?.controls['dateFrom'].value.year +
                '-' +
                res?.controls['dateFrom'].value.month +
                '-' +
                res?.controls['dateFrom'].value.day
              : this.currentDate;

            this.searchParams.period = this.filterForm?.controls['period'].value
              ? this.filterForm?.controls['period'].value['key']
              : 'D';

            this.displayedData = await this.getTerminalStatementList(this.searchParams);
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
        dateFrom: new DateControl({
          order: 1,
          columnCount: 12,
          label: 'pos.e-commerce.terminal-statement.date-from',
          class: 'text-start color-arb-primaryText ',
        }),
        dateTo: new DateControl({
          order: 2,
          columnCount: 12,
          label: 'pos.e-commerce.terminal-statement.date-to',
          class: 'text-start color-arb-primaryText ',
        }),
        period: new DropdownControl({
          label: 'pos.e-commerce.terminal-statement.period',
          order: 3,
          columnCount: 12,
          controlOptions: { columnId: 'key', textField: 'value' },
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

  selectTerminal(event: any) {
    if (event?.length) {
      this.downloadButton.isDisable = false;
      this.selectedTerminal = [];
      event.forEach((item: any) => {
        const downloadFile: FileDownloadData | undefined =
          this.terminalList.find(
            (element) => item.downloadStatement === element.fileName
          );
        if (downloadFile) {
          this.selectedTerminal?.push(downloadFile);
        }
      });
    } else {
      this.downloadButton.isDisable = true;
      this.selectedTerminal = [];
    }
  }

  onDownloadClicked() {
    const params: TerminalStatementDownloadReq = {
      periodStr: this.searchParams.period || 'D',
      downloadFiles: this.selectedTerminal,
    };
    this.posTerminalsService.downloadTerminalStatements(params);
  }

  dateFormatting() {
    let cDate = new Date();
    let lDate = new Date();
    const lastYDate = lDate.setFullYear(lDate.getFullYear() - 1);
    this.lastDate = formatDate(lastYDate, 'yyyy-MM-dd', 'en-US');
    this.currentDate = formatDate(cDate, 'yyyy-MM-dd', 'en-US');
  }
}
