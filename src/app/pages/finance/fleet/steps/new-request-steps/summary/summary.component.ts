import {Component, OnInit} from '@angular/core';
import {PageModel} from 'app/@core/model/dto/formModel';
import {getSummaryControl} from './summary.component.controls';
import {SummaryModel} from 'arb-design-library/model/summary.model';
import {SummarySectionModel} from 'arb-design-library/model/summary-section.model';
import {SummaryItemModel} from 'arb-design-library/model/summary-item.model';
import {CustomerBusinessDetails} from '../../../../../../@core/model/rest/finance/request/business-details';
import { FinanceProductCode } from '../../../../../../@core/model/rest/finance/request/products-codes';
import { ActionCall } from '../../../../../../@core/model/rest/finance/request/action-request-enum';
import { RequestService } from '../../../../../../@core/service/finance/request/request.service';
import { Quotation, Purpose } from '../../../../../../@core/model/rest/finance/request/quotation';
import { AmtDetails } from '../../../../../../@core/model/rest/finance/request/los-summary';
import { FormButtonClickOutput } from '../../../../../../shared/form/form.component';
import { DataService } from '../../../../../../@core/service/finance/data.service';
import { FinalAgreementAcceptance } from '../../../../../../@core/model/rest/finance/request/final-agreement';
import { FinanceBaseComponent } from '../../../../finance-base/finance-base.component';

@Component({
  selector: 'app-summary',
  templateUrl: '../../../../finance-base/finance-base.component.html',
  styleUrls: [],
})
export class SummaryComponent
  extends FinanceBaseComponent
  implements OnInit {
  totalFinanceAmount: number = 0;
  businessDetails!: CustomerBusinessDetails;
  amtDetails!: AmtDetails;
  externalQuotationList:Quotation[] = [];
  internalQuotationList:Quotation[]= [];
  purposeOfUseList: {txt:string,purposeOfUse:string}[] = [];
  documentationUploaded:{title:string,name:string}[] = [];
  linkedAccount!: string;



  constructor(
    private requestService: RequestService,
    private financeDataService:DataService

  ) {

    super();

    this.nextButton = {
      id: "submit",
      text: 'finance.fleet.requests.submitApplication',
      type: "primary",
    };
    this.pageTitle.stepper!.stepCounter = 6;

    sessionStorage.getItem('accountNum') ?
      this.linkedAccount = sessionStorage.getItem('accountNum') || "" : "";


    sessionStorage.getItem('businessDetails') ?
      this.businessDetails = JSON.parse(
        sessionStorage.getItem('businessDetails') || ''
      ) : "";


    sessionStorage.getItem('ExQuotations') ?
      this.externalQuotationList = JSON.parse(
        sessionStorage.getItem('ExQuotations') || ''
      ) : "";

    sessionStorage.getItem('InQuotations') ?
      this.internalQuotationList = JSON.parse(
        sessionStorage.getItem('InQuotations') || ''
      ) : "";

    sessionStorage.getItem('documentUploadedVal') ?
      this.documentationUploaded = JSON.parse(
        sessionStorage.getItem('documentUploadedVal') || ''
      ) : "";

    sessionStorage.getItem('amtDetails') ?
      this.amtDetails = JSON.parse(
        sessionStorage.getItem('amtDetails') || ''
      ) : "";

    this.purposeOfUseList = this.financeDataService.purposeOfUse;
    this.pageTitle.stepper!.stepCounter = 6;
    this.drawPage();
  }

  override ngOnInit(): void {
  }

  drawPage() {
    this.pages = [new PageModel(0, getSummaryControl())];
    this.summary = this.generateSummary();
  }

  generateSummary(): SummaryModel {
    let sections: SummarySectionModel[] = [];
    sections.push(this.getAmtDetails())
    sections.push(this.getLinkedAccount());

    sections.push(this.getBusinessDetailsSummary());
    sections = [...sections, ...this.getQuotation('ex')]
    sections = [...sections, ...this.getQuotation('in')];
    this.getUploadDocs()
    sections.push(this.getUploadDocs())

    return {sections: sections}
  }

  getBusinessDetailsSummary(): SummarySectionModel {

    return {
      title: {
        id: "businessDetails",
        title: 'finance.fleet.requests.businessDetails'
      }, items: [
        {
          title: 'finance.fleet.requests.dateEstablishment',
          subTitle: this.businessDetails.establishmentDate
        },
        {
          title: 'finance.fleet.requests.businessActivity',
          subTitle: this.businessDetails.businessActivities
        },
        {
          title: 'finance.fleet.requests.numberOfBusiness',
          subTitle: this.businessDetails.businessOutletsNum
        },
        {
          title:'finance.fleet.requests.typeBusiness',
          subTitle: this.businessDetails.businessType as string
        },
        {
          title: 'finance.fleet.requests.typeBranches',
          subTitle: this.businessDetails.businessOutletsType
        },
        {
          title: 'finance.fleet.requests.primaryBusinessLocation',
          subTitle: this.businessDetails.businessLocation as string
        },
      ]
    }
  }

  getLinkedAccount() {
    return {
      title: {
        id: "linkedAccount",
        title: 'finance.fleet.requests.finacneAccountAndBusiness'
      },
      items: [
        {title: 'finance.fleet.requests.accountNumber', subTitle: this.linkedAccount},
      ]
    }
  }

  getQuotation(ref: string): SummarySectionModel[] {
    let quotationSummary: SummarySectionModel[] = [];
    let quotationList = (ref === 'ex' ? this.externalQuotationList : this.internalQuotationList)


    quotationList.forEach((quotation: Quotation, qIndex: number) => {
      quotation.purposes.forEach((purpose: Purpose, pIndex: number) => {
        quotationSummary.push(
          {
            title: {
              id: `p_${qIndex}_${pIndex}`,
              title: ref === 'ex' ? `External Quotation ${qIndex + 1} (Purpose ${pIndex + 1})` : `Internal Quotation ${qIndex + 1}`
            },
            items: [
              {title: 'finance.fleet.requests.purposeUse', subTitle: purpose.purposeOfUse},
              {title: 'finance.fleet.requests.brandName', subTitle: purpose.brandName},
              {title: 'finance.fleet.requests.quantity', subTitle: purpose.vehiclesNum},
              {
                title:'finance.fleet.requests.purposeofUseValue',
                subTitle: `${purpose.purposeValue} ${this.translate.instant('finance.fleet.requests.sar')}`
              },
            ]
          }
        )
      })
    });
    return quotationSummary
  }


  getUploadDocs() {
    var documents: SummaryItemModel[] = []
    this.documentationUploaded.forEach((document: {title:string,name:string}) => {
      documents.push(
        {title: document.title, subTitle: document.name},
      )
    });

    return {
      title: {
        id: `documents`,
        title:'finance.fleet.requests.Documentation'
      },
      items: documents
    }
  }

  getAmtDetails(): SummarySectionModel {
    return {
      title: {
        id: "amtDetails",
        title:'finance.fleet.requests.amountDetails'
      }, items: [
        {
          title: 'finance.fleet.requests.requestedFinancingAmount',
          subTitle: (this.amtDetails?.requestedAmt != undefined) ? `${this.amtDetails?.requestedAmt} ${this.translate.instant('sar')}` :`--- ${this.translate.instant('sar')}`
        },
        {
          title: 'finance.fleet.requests.totalAdminFees',
          subTitle: (this.amtDetails?.totalAdminFee!=undefined) ? this.amtDetails?.totalAdminFee as string || "" : '---'
        },
        {
          title:'finance.fleet.requests.totalRepaymentAmt',
          subTitle: (this.amtDetails?.totalREPmtAmt!=undefined) ? `${this.amtDetails?.totalREPmtAmt} ${this.translate.instant('sar')}`: `--- ${this.translate.instant('sar')}`
        },
        {
          title: 'finance.fleet.requests.totalDownPmt',
          subTitle: (this.amtDetails?.DownPmt!=undefined)? `${this.amtDetails?.DownPmt} ${this.translate.instant('sar')}`: `--- ${this.translate.instant('sar')}`
        },
      ]
    }
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    if (formButtonClickOutput.buttonId === 'Next') {
      this.nextStep()
    }
    if (formButtonClickOutput.buttonId === 'Back') {
      this.backStep()
    }
  }

  nextStep() {
    this.submitApplication()
  }

  backStep() {
    this.router.navigate(['/finance/fleet/init-offer']);
  }

  submitApplication() {
    let acceptInitialOffer:FinalAgreementAcceptance ={
      dosierID: sessionStorage.getItem('DOSSIER_ID') || "",
      body:{
        accepted: true,
        initialOffer:true,
        productCode: FinanceProductCode.FLEET,
        action:ActionCall.InitialOffer
      }
    }
    this.requestService.setFinalAgreementAcceptance(acceptInitialOffer).subscribe(response=>{
      this.router.navigate(['/finance/fleet/result'])
    },)
  }
}
