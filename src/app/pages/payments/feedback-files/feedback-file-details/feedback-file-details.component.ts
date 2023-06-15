import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormModel } from 'app/@core/model/dto/formModel';
import { BreadcrumbService } from 'app/@core/service/base/breadcrumb.service';
import { ModelAndListService } from 'app/@core/service/base/modelAndList.service';
import { FeedbackFilesService } from 'app/@core/service/payments/feedback-files/feedback-files.service';
import { TableHeaderType } from 'arb-design-library';
import { TableHeaderModel } from 'arb-design-library/model/table-header.model';
import { PaginationValueModel } from 'arb-design-library/model/pagination.model';
import { take } from 'rxjs';
import {
  deleteFileDetailsPopUp,
  getFeedbackFileDetailsForm,
} from './feedback-file-details-controls';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { ResponseException } from 'app/@core/service/base/responseException';
import { FileItem } from 'app/@core/model/rest/payments/feedback-files/feedback-files-res.model';
import { PopupService } from '../../../../@core/service/base/popup.service';
import { KeyValueModel } from 'app/@core/model/rest/common/key-value.model';
import { Utils } from 'app/@core/utility/Utils';

export interface FileDetailsData {
  billName: string;
  accountFrom: string;
  billRef: string;
  amount: number;
  process: string;
  status: string;
}

export interface GovFileDetailsData {
  accountNumber: string;
  civilianId: string;
  type: string;
  process: string;
  beneficiaryName: string;
  amount: number;
  status: string;
}

export interface MapElement {
  key: string;
  value: string;
}

@Component({
  selector: 'app-feedback-file-details',
  templateUrl: './feedback-file-details.component.html',
})
export class FeedbackFileDetailsComponent implements OnInit {
  @Input() fileReference: string = '';
  @Input() type: string = '';

  feedbackFileDetailsForm: FormModel = getFeedbackFileDetailsForm();
  headers: TableHeaderModel[] = [];
  paginationValue: PaginationValueModel = { page: 1, size: 10 };
  deleteFileDetailsPopUp = deleteFileDetailsPopUp();
  endButtons: ButtonModel[] = [];
  data!: Object[];
  dataToDelete: {} = {};
  exportFileName: string;
  errorList: Array<MapElement> = [];
  processList: Array<MapElement> = [];
  govProcessList: Array<MapElement> = [];
  govTypeList: Array<MapElement> = [];
  process: string = '';
  govProcess: string = '';
  govType: string = '';
  status: string = '';

  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private feedbackFilesService: FeedbackFilesService,
    private modelAndListService: ModelAndListService,
    private route: ActivatedRoute,
    private popupService: PopupService
  ) {
    this.breadcrumbService.setBreadcrumb([
      {
        text: 'payments.name',
        url: '/payments',
      },
      {
        text: 'payments.feedback-files.title',
        url: '/payments/feedback-files',
      },
      {
        text: 'payments.feedback-files.file-details.title',
        url: '',
      },
    ]);

    this.exportFileName = 'Alrajhi Feedback File Details'

    this.modelAndListService
      .getList(['errors', 'billProcess', 'eGovProcess', 'eGovSadadType'])
      .subscribe((res) => {
        this.processList = this.objectToKeyValue(res.billProcess);
        this.errorList = Utils.getErrorsWithoutErrorTable(res.errors);
        this.govProcessList = this.objectToKeyValue(res.eGovProcess);
        this.govTypeList = this.objectToKeyValue(res.eGovSadadType);

        this.feedbackFileDetailsForm.controls['status'].controlOptions.options =
          this.errorList;
        if (this.type == 'government-payments') {
          this.feedbackFileDetailsForm.controls[
            'process'
          ].controlOptions.options = this.govProcess;
        } else {
          this.feedbackFileDetailsForm.controls[
            'process'
          ].controlOptions.options = this.process;
        }

        this.feedbackFileDetailsForm.controls['type'].controlOptions.options =
          this.govType;
      });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((proms: any) => {
      this.fileReference = proms.fileRef;
      this.type = proms.type;
      this.getFile(this.type);
      if (this.type == 'bill') {
        this.endButtons = [
          {
            id: 'delete',
            type: 'danger',
            isDisable: false,
            prefixIcon: 'arb-icon-Trash',
            text: 'public.delete',
          },
        ];
      }
      this.setFeedbackFileDetailsTable(this.type);
    });
  }

  onTitleButtonClick(id: string) {
    if (id == 'arrowTitle') {
      this.router
        .navigate(['/payments/feedback-files'], {
          queryParams: { type: this.type },
        })
        .then(() => {});
    }
  }

  setFeedbackFileDetailsTable(type: string) {
    this.modelAndListService
      .getList(['errors', 'billProcess', 'eGovProcess', 'eGovSadadType'])
      .subscribe((data) => {
        let headers: TableHeaderModel[] = [];
        this.headers = [];
        switch (type) {
          case 'government-payments':
            headers.push({
              title: 'payments.feedback-files.file-details.account-number',
              type: TableHeaderType.TEXT,
              fieldName: 'accountNumber',
            });
            headers.push({
              title: 'payments.feedback-files.file-details.civilian-id',
              type: TableHeaderType.TEXT,
              fieldName: 'civilianId',
            });
            headers.push({
              title: 'payments.feedback-files.file-details.type',
              type: TableHeaderType.TEXT,
              fieldName: 'type',
              mapObject: this.govTypeList,
            });
            headers.push({
              title: 'payments.feedback-files.file-details.process',
              type: TableHeaderType.TEXT,
              fieldName: 'process',
              mapObject: this.govProcessList,
            });
            headers.push({
              title: 'payments.feedback-files.file-details.beneficiary-name',
              type: TableHeaderType.TEXT,
              fieldName: 'beneficiaryName',
            });
            headers.push({
              title: 'payments.feedback-files.file-details.amount',
              type: TableHeaderType.AMOUNT_TEXT,
              fieldName: 'amount',
              controlOptions: {
                currency: 'currency' /*Account Currency*/,
              },
            });
            headers.push({
              title: 'payments.feedback-files.file-details.status',
              type: TableHeaderType.TEXT,
              fieldName: 'status',
              mapObject: this.errorList,
            });
            break;
          default:
            headers.push({
              title: 'payments.feedback-files.file-details.bill-name',
              type: TableHeaderType.TEXT,
              fieldName: 'billName',
            });
            headers.push({
              title: 'payments.feedback-files.file-details.account-from',
              type: TableHeaderType.TEXT,
              fieldName: 'accountFrom',
            });
            headers.push({
              title: 'payments.feedback-files.file-details.bill-reference',
              type: TableHeaderType.TEXT,
              fieldName: 'billRef',
            });
            headers.push({
              title: 'payments.feedback-files.file-details.amount',
              type: TableHeaderType.AMOUNT_TEXT,
              fieldName: 'amount',
              controlOptions: {
                currency: 'currency' /*Account Currency*/,
              },
            });
            headers.push({
              title: 'payments.feedback-files.file-details.process',
              type: TableHeaderType.TEXT,
              fieldName: 'process',
              mapObject: this.processList,
            });
            headers.push({
              title: 'payments.feedback-files.file-details.status',
              type: TableHeaderType.TEXT,
              fieldName: 'status',
              mapObject: this.errorList,
            });

            break;
        }
        this.headers = headers;
        this.getFeedbackFileDetails(this.fileReference, this.type);
      });
  }

  async getFeedbackFileDetails(fileRef: string, type: string) {
    switch (type) {
      case 'bill':
        this.feedbackFilesService
          .getBillFeedbackFileDetails(fileRef)
          .pipe(take(1))
          .subscribe({
            next: (res) => {
              if (res.billPaymentDetailsOutput.listLinesBillPaymentFiles) {
                const list: Array<FileDetailsData> = [];
                res.billPaymentDetailsOutput.listLinesBillPaymentFiles.forEach(
                  (item) => {
                    this.processMapping(item.process);
                    const object = {
                      billName: item.billNameEn,
                      accountFrom: item.accountFrom,
                      billRef: item.billReference,
                      amount: item.amount,
                      process: this.process,
                      status: item.returnCode,
                    };
                    list.push(object);
                    this.data = list;
                    this.process = '';
                  }
                );
              } else {
                this.data = [];
              }
            },
            error: () => {
              this.data = [];
            },
          });
        break;
      case 'government-payments':
        this.feedbackFilesService
          .getGovernmentFeedbackFileDetails(fileRef)
          .pipe(take(1))
          .subscribe({
            next: (res) => {
              if (res.egovSadadDetailsOutputDTO.linesGovSadadFilesList) {
                const listGov: Array<GovFileDetailsData> = [];
                res.egovSadadDetailsOutputDTO.linesGovSadadFilesList.forEach(
                  (item) => {
                    this.govProcessList.find((element: MapElement) => {
                      if (element.key == item.recordType) {
                        this.govProcess = element.value;
                      }
                    });

                    this.govTypeList.find((element: MapElement) => {
                      if (element.key == item.dbDetails?.serviceType) {
                        this.govType = element.value;
                      }
                    });

                    const object = {
                      accountNumber: item.dbDetails.accountNumber,
                      civilianId: item.dbDetails.details[0].value,
                      type: this.govType,
                      process: this.govProcess,
                      beneficiaryName: item.dbDetails.beneficiaryName,
                      amount: item.dbDetails.amount,
                      status: item.returnCode,
                    };
                    listGov.push(object);
                    this.data = listGov;
                  }
                );
              } else {
                this.data = [];
              }
            },
            error: () => {
              this.data = [];
            },
          });
        break;
      case 'esal':
        let fileList: Array<any> = [];
        this.feedbackFilesService
          .getEsalFeedbackFileList(
            this.paginationValue.page,
            this.paginationValue.size
          )
          .pipe(take(1))
          .subscribe({
            next: (res) => {
              fileList = res.fileDownloadListsOutputDTO.downloadableFile.items;
              fileList.find(async (file: FileItem) => {
                this.feedbackFilesService
                  .getEsalFeedbackFileDetails(file)
                  .pipe(take(1))
                  .subscribe({
                    next: (res) => {
                      if (
                        res.sadadInvoiceDetailsOutputDTO
                          .listLinesSadadInvoiceFiles
                      ) {
                        const listEsal: Array<FileDetailsData> = [];
                        res.sadadInvoiceDetailsOutputDTO.listLinesSadadInvoiceFiles.forEach(
                          (item) => {
                            this.processMapping(item.process);

                            const object = {
                              billName: item.billerName,
                              accountFrom: item.accountFrom,
                              billRef: item.billerId,
                              amount: item.amount,
                              process: this.process,
                              status: item.returnCode,
                            };
                            listEsal.push(object);
                            this.data = listEsal;
                          }
                        );
                      } else {
                        this.data = [];
                      }
                    },
                    error: () => {
                      this.data = [];
                    },
                  });
              });
            },
          });
        break;
    }
  }

  onDetailsButtonClick(id: string) {
    if (id == 'delete') {
      const payload = this.dataToDelete;
      switch (this.type) {
        case 'bill':
          this.popupService
            .showPopup(this.deleteFileDetailsPopUp)
            .subscribe((res) => {
              if (res.buttonId === 'close') {
                this.popupService.dismiss();
              } else if (res.buttonId === 'delete') {
                this.feedbackFilesService
                  .deleteBillFeedbackFileDetails(payload as any)
                  .subscribe({
                    next: () => {
                      this.popupService.dismiss();
                      this.data = [];
                      this.router
                        .navigate(['/payments/feedback-files'], {
                          queryParams: { type: 'bill' },
                        })
                        .then(() => {});
                    },
                    error: (error: ResponseException) => {
                      console.log(error);
                    },
                  });
              }
            });
          break;
      }
    }
  }

  getFile(type: string) {
    let fileList: Array<any> = [];
    switch (type) {
      case 'bill':
        this.feedbackFilesService
          .getBillFeedbackFileList(
            this.paginationValue.page,
            this.paginationValue.size
          )
          .pipe(take(1))
          .subscribe({
            next: (res) => {
              fileList = res.fileDownloadListsOutputDTO.downloadableFile.items;
              fileList.find(async (file: FileItem) => {
                if (file.fileReference === this.fileReference) {
                  this.dataToDelete = await file;
                }
              });
            },
          });
        break;
    }
  }

  objectToKeyValue(object: any): KeyValueModel[] {
    let data: KeyValueModel[] = [];
    Object.keys(object).forEach((key) => {
      data.push({ key, value: object[key] });
    });
    return data;
  }

  processMapping(processCode: string) {
    this.processList.find((item: MapElement) => {
      if (item.key == processCode) {
        this.process = item.value;
      }
    });
  }
}
