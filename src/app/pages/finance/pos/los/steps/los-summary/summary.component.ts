import {Component} from '@angular/core';
import {FormModel, PageModel} from 'app/@core/model/dto/formModel';
import {FormButtonClickOutput} from 'app/shared/form/form.component';
import {SummarySectionModel} from 'arb-design-library/model/summary-section.model';
import {SummaryModel} from 'arb-design-library/model/summary.model';
import {getSummaryControl} from './summary.component.controls';
import {FinanceProductCode} from 'app/@core/model/rest/finance/request/products-codes';
import {PosService} from '../../../../../../@core/service/finance/pos/pos.service';
import {DatePipe} from '@angular/common';
import {DocumentInfo} from 'app/@core/model/rest/finance/pos/documents';
import { DataService } from '../../../../../../@core/service/finance/data.service';
import { FinanceBaseComponent } from 'app/pages/finance/finance-base/finance-base.component';
import { confirmDossier } from 'app/@core/model/rest/finance/pos/customerDetails';

@Component({
  templateUrl: '../../../../finance-base/finance-base.component.html',
})
export class LosSummary extends FinanceBaseComponent {
  productKey: string;
  documentCode?: any;
  documentValue?: any;
  allDocuments: DocumentInfo[] = [];
  finishDocument: any[] = [];
  pipe = new DatePipe('en-US');

  constructor(private posService: PosService, private datePipe: DatePipe,
              private financeDataService: DataService
    ) {
    super();
    this.pageTitle.id = 'summary';
    this.pageTitle.title = '';
    this.pageTitle.stepper!.stepCounter = 5;
    this.backButton = {id: 'back', text: 'finance.fleet.btn.back', type: 'secondary'};
    this.startButtons = [this.backButton];
    this.proceedButton = {
      id: 'submitApplication',
      text: 'finance.fleet.btn.submitApplication',
      type: 'primary',
    };
    if (sessionStorage.getItem('productKey')) {
      this.productKey = sessionStorage.getItem('productKey') || '{}';
    } else {
      this.productKey = FinanceProductCode.POS;
    }
    this.endButtons = [this.proceedButton];
  }

  override ngOnInit(): void {
    this.getMandatoyDocument();
  }

  drawPage() {
    this.pages.push(new PageModel(5, getSummaryControl()));
    this.summary = this.fillSummary(false);
  }

  getMandatoyDocument() {
    this.posService.getMandatoryDocs(this.productKey).subscribe((res) => {
      this.allDocuments = res.documentInfos;
      this.allDocuments?.forEach((element: any, index: number) => {
        this.documentCode = element.documentCode;
        this.documentValue = element.name;
        this.finishDocument.push({
          title: this.documentValue,
          subTitle:
            this.financeDataService?.getPosForms[3]?.controls[this.documentCode]
              ?.value['name'],
        });
      });
      this.drawPage();
    });
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'submitApplication':
        this.confirmOpenDossier();
        break;
      case 'back':
        void this.router.navigate(['/finance/pos/doc-upload']);
        break;
    }
  }

  fillSummary(showEditButton: boolean = true): SummaryModel {
    let sections: SummarySectionModel[] = [];
    this.financeDataService.getPosForms.forEach((item: FormModel, index) => {
      if (index == 0) {
        sections.push({
          title: {
            id: item.controls['pageTitle'].controlOptions.id,
            title: item.controls['pageTitle'].controlOptions.title,
          },
          items: [
            {
              title: 'public.account-number',
              subTitle: item.controls['selectAccount'].value['value'],
            },
            {
              title: 'finance.pos.los.numberBusinessBranches',
              subTitle: item.controls['numberBusinessBranches'].value,
            },
            {
              title: 'finance.pos.los.primaryBusinessLocation',
              subTitle:
                item.controls['primaryBusinessLocation'].value['branch'],
            },
            {
              title: 'finance.pos.los.businessModelSalesPattern',
              subTitle: item.controls['businessModelSalesPattern'].value,
            },
          ],
        });
      }
      if (index == 1) {
        sections.push({
          title: {
            id: item.controls['pageTitle'].controlOptions.id,
            title:
              item.controls['currentYearTitle'].controlOptions.title +
              ' ' +
              item.controls['pageTitle'].controlOptions.title,
          },
          items: [
            {
              title: 'finance.pos.los.currentYearTitle',
              subTitle:
                item.controls['currentYearFrom'].value.day +
                '-' +
                item.controls['currentYearFrom'].value.month +
                '-' +
                item.controls['currentYearFrom'].value.year,
            },
            {
              title: 'finance.pos.los.currentYearTo',
              subTitle:
                item.controls['currentYearTo'].value.day +
                '-' +
                item.controls['currentYearTo'].value.month +
                '-' +
                item.controls['currentYearTo'].value.year,
            },
            {
              title: 'finance.pos.los.currentSalesTurnover',
              subTitle: item.controls['currentSalesTurnover'].value,
            },
            {
              title: 'finance.pos.los.currentNetProfit',
              subTitle: item.controls['currentNetProfit'].value,
            },
          ],
        });
        sections.push({
          title: {
            id: item.controls['pageTitle'].controlOptions.id,
            title:
              item.controls['lastYearTitle'].controlOptions.title +
              ' ' +
              item.controls['pageTitle'].controlOptions.title,
          },
          items: [
            {
              title: 'finance.pos.los.lastYearTitle',
              subTitle:
                item.controls['lastYearFrom'].value.day +
                '-' +
                item.controls['lastYearFrom'].value.month +
                '-' +
                item.controls['lastYearFrom'].value.year,
            },
            {
              title: 'finance.pos.los.lastYearTo',
              subTitle:
                item.controls['lastYearTo'].value.day +
                '-' +
                item.controls['lastYearTo'].value.month +
                '-' +
                item.controls['lastYearTo'].value.year,
            },
            {
              title: 'finance.pos.los.lastSalesTurnover',
              subTitle: item.controls['lastSalesTurnover'].value,
            },
            {
              title: 'finance.pos.los.lastNetProfit',
              subTitle: item.controls['lastNetProfit'].value,
            },
          ],
        });
      }
      if (index == 2) {
        sections.push({
          title: {
            id: item.controls['pageTitle'].controlOptions.id,
            title: item.controls['pageTitle'].controlOptions.title,
          },
          items: [
            {
              title: 'finance.pos.los.requestedAmount',
              subTitle: item.controls['requestedAmount'].value,
            },
            {
              title: 'finance.pos.los.repaymentPeriod',
              subTitle: item.controls['repaymentPeriod'].value['branch'],
            },
            {
              title: 'finance.pos.los.installmentAmount',
              subTitle: item.controls['installmentAmount'].value,
            },
            {
              title: 'finance.pos.los.profiltRate',
              subTitle: item.controls['profiltRate'].value,
            },
            {title: 'finance.pos.los.adminFee', subTitle: item.controls['adminFee'].value},
          ],
        });
      }
      if (index == 3) {
        sections.push({
          title: {
            id: item.controls['pageTitle'].controlOptions.id,
            title: item.controls['pageTitle'].controlOptions.title,
          },
          items: this.finishDocument,
        });
      }
    });
    return {
      sections: sections,
    };
  }

  confirmOpenDossier() {
    let formsData = this.financeDataService.getPosForms;
    /*-------------------------------[PAYLOAD]-----------------------------------*/
    let data: confirmDossier = {
      financeProductCode: this.productKey,
      businessLocation:
        formsData[0]?.controls['primaryBusinessLocation']?.value['code'],
      accountNumber: formsData[0]?.controls['selectAccount']?.value['key'],
      startDateInfo: formsData[2]?.controls['initiationDate']?.value,
      financingAmt: formsData[2]?.controls['requestedAmount'].value,
      profitRate: formsData[2]?.controls['profiltRate'].value,
      feesPercentage: formsData[2]?.controls['adminFee'].value,
      rePymtPeriod: formsData[2]?.controls['repaymentPeriod'].value['code'],
      businessOutletsNum:
      formsData[0]?.controls['numberBusinessBranches']?.value,
      businessOutletsType:
        formsData[0]?.controls['typeBranches']?.value['code'],
      businessModelSalesDesc:
      formsData[0]?.controls['businessModelSalesPattern']?.value,
      currentYearFromDate:
        formsData[1].controls['currentYearFrom'].value['year'] +
        '-' +
        formsData[1].controls['currentYearFrom'].value['month'] +
        '-' +
        formsData[1].controls['currentYearFrom'].value['day'],

      currentYearToDate:
        formsData[1].controls['currentYearTo'].value['year'] +
        '-' +
        formsData[1].controls['currentYearTo'].value['month'] +
        '-' +
        formsData[1].controls['currentYearTo'].value['day'],

      currentYearAcctType: '001',
      currentYearSalesTurnOver:
      formsData[1].controls['currentSalesTurnover'].value,
      currentYearNetProfit: formsData[1].controls['currentNetProfit'].value,
      currentYearGrossProfit: formsData[1].controls['currentGrossProfit'].value,

      lastYearFromDate:
        formsData[1].controls['lastYearFrom'].value['year'] +
        '-' +
        formsData[1].controls['lastYearFrom'].value['month'] +
        '-' +
        formsData[1].controls['lastYearFrom'].value['day'],

      lastYearToDate:
        formsData[1].controls['lastYearTo'].value['year'] +
        '-' +
        formsData[1].controls['lastYearTo'].value['month'] +
        '-' +
        formsData[1].controls['lastYearTo'].value['day'],

      lastYearGrossProfit: formsData[1].controls['currentGrossProfit'].value,
      lastYearAcctType: '001',
      lastYearSalesTurnOver: formsData[1].controls['lastGrossProfit'].value,
      lastYearNetProfit: formsData[1].controls['lastNetProfit'].value,
      lastYearFullYearAcct: false,
    };

    /*-------------------------------[SUBMIT]-----------------------------------*/
    this.posService.confirmOpenDossier(data).subscribe((result) => {
      if (result === null) {
      } else {
        let dossierId: string;
        if (result.dossierId && result.dossierId !== '') {
          dossierId = result.dossierId;
        } else {
          dossierId = result.batchId;
        }
        sessionStorage.setItem('DOSSIERID', dossierId);
        this.uploadFiles(dossierId);
        void this.router.navigate(['/finance/pos/los-results']);
      }
    });
  }

  uploadFiles(dossierId: any) {
    let formsData = this.financeDataService.getPosForms;

    this.allDocuments.forEach((element) => {
      const file = formsData[3].controls[element.documentCode].value;
      this.posService.convertFileToURL(file).then((dataURL) => {
        this.posService
          .attachDocument(dossierId, element.documentCode, file, dataURL)
          .subscribe((result: any) => {
            if (result === null) {
            } else {
              if (result.errorCode !== '0') {
              } else {
              }
            }
          });
      });
    });
  }
}
