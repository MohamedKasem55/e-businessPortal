import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'app/@core/service/base/breadcrumb.service';
import { ModelAndListService } from 'app/@core/service/base/modelAndList.service';
import { FeedbackFilesService } from 'app/@core/service/payments/feedback-files/feedback-files.service';
import { TableHeaderType } from 'arb-design-library';
import { PaginationValueModel } from 'arb-design-library/model/pagination.model';
import { TableHeaderModel } from 'arb-design-library/model/table-header.model';
import { take } from 'rxjs';
import { TabModel } from 'arb-design-library/model/tab.model';
import { FileItem } from '../../../@core/model/rest/payments/feedback-files/feedback-files-res.model';
import { FileData } from '../../../@core/model/rest/common/file-data';

@Component({
  selector: 'app-feedback-files',
  templateUrl: './feedback-files.component.html',
})
export class FeedbackFilesComponent implements OnInit {
  headers: TableHeaderModel[] = [];
  filesInProgressHeader: TableHeaderModel[] = [];
  paginationValue: PaginationValueModel = { page: 1, size: 20 };
  data: Array<FileData> | undefined;
  filesInProgressData!: Array<FileData>;
  total: number = 0;
  fileRef: string | undefined = '';
  exportFileName: string = 'Alrajhi Feedback Files'
  exportFileNameInProgress: string = 'Alrajhi Feedback Files inProgress';
  tabs: TabModel[] = [];
  type: string = '';

  @Output() buttonClicked = new EventEmitter<Object>();

  constructor(
    private router: Router,
    private modelAndListService: ModelAndListService,
    private feedbackFilesService: FeedbackFilesService,
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.breadcrumbService.setBreadcrumb([
      {
        text: 'payments.name',
        url: '/payments',
      },
      {
        text: 'payments.feedback-files.title',
        url: '',
      },
    ]);

    this.setTabs();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.tabChanged(params.type);
      this.type = this.type ? params.type : 'bill';
      this.setFeedbackFilesTableHeaders();
      this.setFilesInProgressTableHeaders();
      this.getFeedbackFilesData(this.paginationValue, this.type);
    });
  }

  setTabs() {
    this.tabs.push({
      text: 'payments.feedback-files.tabs.bill-payments',
      value: 'bill',
    });
    this.tabs.push({
      text: 'payments.feedback-files.tabs.government-payments',
      value: 'government-payments',
    });
    this.tabs.push({
      text: 'payments.feedback-files.tabs.esal',
      value: 'esal',
    });
  }

  onTitleButtonClick(id: string) {
    switch (id) {
      case 'arrowTitle':
        this.router.navigateByUrl('/payments').then(() => {});
        break;
    }
  }

  tabChanged(id: string) {
    this.type = id;
    this.data = undefined;
    switch (this.type) {
      case 'bill':
        this.location.replaceState('/payments/feedback-files?type=bill');
        this.getFeedbackFilesData(this.paginationValue, this.type);
        break;
      case 'government-payments':
        this.location.replaceState(
          '/payments/feedback-files?type=government-payments'
        );
        this.getFeedbackFilesData(this.paginationValue, this.type);
        break;
      case 'esal':
        this.location.replaceState('/payments/feedback-files?type=esal');
        this.getFeedbackFilesData(this.paginationValue, this.type);
        break;
    }
  }

  setFeedbackFilesTableHeaders() {
    this.modelAndListService.getList(['errors']).subscribe((data) => {
      this.headers = [];
      let headers: TableHeaderModel[] = [];

      headers.push({
        title: 'payments.feedback-files.file-name',
        type: TableHeaderType.BUTTON,
        fieldName: 'fileName',
        controlOptions: {
          id: 'fileName',
          text: 'fileName',
        },
      });
      headers.push({
        title: 'payments.feedback-files.creation-date',
        type: TableHeaderType.TEXT,
        fieldName: 'creationDate',
      });
      headers.push({
        title: 'payments.feedback-files.payment-date',
        type: TableHeaderType.TEXT,
        fieldName: 'paymentDate',
      });

      this.headers = headers;
    });
  }

  setFilesInProgressTableHeaders() {
    this.modelAndListService.getList(['errors']).subscribe((data) => {
      this.filesInProgressHeader = [];
      let filesInProgressHeader: TableHeaderModel[] = [];

      filesInProgressHeader.push({
        title: 'payments.feedback-files.file-name',
        type: TableHeaderType.TEXT,
        fieldName: 'fileName',
      });
      filesInProgressHeader.push({
        title: 'payments.feedback-files.creation-date',
        type: TableHeaderType.TEXT,
        fieldName: 'creationDate',
      });
      filesInProgressHeader.push({
        title: 'payments.feedback-files.payment-date',
        type: TableHeaderType.TEXT,
        fieldName: 'paymentDate',
      });

      this.filesInProgressHeader = filesInProgressHeader;
    });
  }

  setData(res: any) {
    switch (this.type) {
      case 'government-payments':
        if (res.fileDownloadListsOutputDTO.downloadableFile) {
          const list: Array<FileData> = [];
          res.fileDownloadListsOutputDTO.downloadableFile.forEach(
            (item: FileItem) => {
              const object = {
                fileName: item.fileName,
                creationDate: item.requestDate,
                paymentDate: item.transfaerDate,
                fileReference: item.fileReference,
              };
              list.push(object);
            }
          );
          this.data = list;
        } else {
          this.data = [];
        }

        if (res.fileDownloadListsOutputDTO.filesInProcess?.size) {
          const list: Array<FileData> = [];
          res.fileDownloadListsOutputDTO.filesInProcess.items.forEach(
            (item: FileItem) => {
              const object = {
                fileName: item.fileName,
                creationDate: item.requestDate,
                paymentDate: item.transfaerDate,
              };
              list.push(object);
            }
          );
          this.filesInProgressData = list;
        } else {
          this.filesInProgressData = [];
        }
        break;
      default:
        if (res.fileDownloadListsOutputDTO.downloadableFile?.size) {
          const list: Array<FileData> = [];
          res.fileDownloadListsOutputDTO.downloadableFile.items.forEach(
            (item: FileItem) => {
              const object = {
                fileName: item.fileName,
                creationDate: item.requestDate,
                paymentDate: item.transfaerDate,
                fileReference: item.fileReference,
              };
              list.push(object);
            }
          );
          this.data = list;
        } else {
          this.data = [];
        }

        if (res.fileDownloadListsOutputDTO.filesInProcess?.size) {
          const list: Array<FileData> = [];
          res.fileDownloadListsOutputDTO.filesInProcess.items.forEach(
            (item: FileItem) => {
              const object = {
                fileName: item.fileName,
                creationDate: item.requestDate,
                paymentDate: item.transfaerDate,
              };
              list.push(object);
            }
          );
          this.filesInProgressData = list;
        } else {
          this.filesInProgressData = [];
        }
        break;
    }
  }

  getFeedbackFilesData(page: PaginationValueModel, type: string) {
    switch (type) {
      case 'bill':
        this.feedbackFilesService
          .getBillFeedbackFileList(page.page, page.size)
          .pipe(take(1))
          .subscribe({
            next: (res) => {
              this.setData(res);
            },
            error: () => {
              this.data = [];
              this.total = 0;
            },
          });
        break;
      case 'government-payments':
        this.feedbackFilesService
          .getGovernmentFeedbackFileList(page.page, page.size)
          .pipe(take(1))
          .subscribe({
            next: (res) => {
              this.setData(res);
            },
            error: () => {
              this.data = [];
              this.total = 0;
            },
          });
        break;
      case 'esal':
        this.feedbackFilesService
          .getEsalFeedbackFileList(page.page, page.size)
          .pipe(take(1))
          .subscribe({
            next: (res) => {
              this.setData(res);
            },
            error: () => {
              this.data = [];
              this.total = 0;
            },
          });
        break;
    }
  }

  onFileClicked(fileData: {
    buttonId: string;
    displayedData: {
      creationDate: string;
      fileName: string;
      isRowChecked: boolean;
      paymentDate: string;
    };
    row: {
      creationDate: string;
      fileName: string;
      fileReference: string;
      paymentDate: string;
    };
  }) {
    const fileName: string = fileData.displayedData.fileName;

    const fileFound = this.data?.find((file: FileData) => {
      if (file.fileName === fileName) {
        return file;
      } else {
        return null;
      }
    });

    this.fileRef = fileFound?.fileReference;
    if (this.fileRef) {
      this.goToFileDetails(this.fileRef, this.type);
    }
  }

  goToFileDetails(fileRef: string, type: string) {
    this.router
      .navigate(['/payments/feedback-files/feedback-file-details/'], {
        queryParams: { fileRef, type },
      })
      .then(() => {});
  }
}
