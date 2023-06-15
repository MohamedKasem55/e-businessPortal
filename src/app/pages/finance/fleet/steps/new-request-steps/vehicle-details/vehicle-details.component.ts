import {Component, OnInit} from '@angular/core';
import {PageModel} from 'app/@core/model/dto/formModel';
import {vehicleDetailsForm} from './vehicle-details.component.contrlos';
import {FormButtonClickOutput} from '../../../../../../shared/form/form.component';
import {TableControl} from '../../../../../../@core/model/dto/control/table-control';
import {TableButtonOutputModel} from 'arb-design-library/model/table-button-output.model';
import { RequestService } from '../../../../../../@core/service/finance/request/request.service';
import { Quotation, QuotationTableData, Purpose, UploadCustomerQuotation } from '../../../../../../@core/model/rest/finance/request/quotation';
import { FinanceBaseComponent } from '../../../../finance-base/finance-base.component';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: '../../../../finance-base/finance-base.component.html',
  styleUrls: []
})
export class VehicleDetailsComponent extends FinanceBaseComponent implements OnInit {
  exQuotations: Quotation[] = [];
  exQuotationListData: QuotationTableData[] = []
  inQuotationListData: QuotationTableData[] = []
  inQuotation: Quotation[] = [];
  financeEligibiltyLimit!:number;
  remainingLimit: number = 0;
  progressPercentage: Number = 0
  totalPriceForQuotations: number = 0;




  constructor(
    private requestService: RequestService

    ) {
    super()
    this.pageTitle.stepper!.stepCounter = 3;
  }

  override ngOnInit(): void {
    this.drawPage();
    this.financeEligibiltyLimit = parseInt(sessionStorage.getItem('fleetLimit') || "0") !== null ? parseInt(sessionStorage.getItem('fleetLimit') || "0"):0;

    this.exQuotations = sessionStorage.getItem('ExQuotations') ?
      JSON.parse(sessionStorage.getItem('ExQuotations') || "") : [];
    this.inQuotation = sessionStorage.getItem('InQuotations') || "" ?
      JSON.parse(sessionStorage.getItem('InQuotations') || "") : []

    if (this.exQuotations.length === 0) {
      this.pages[0].forms[0].controls['externalQuotationTable'].hidden = true
    }
    if (this.inQuotation.length === 0) {
      this.pages[0].forms[0].controls['inQuotationTableTitle'].hidden = true;
      this.pages[0].forms[0].controls['internalQuotationTable'].hidden = true;
    }

    if (this.inQuotation.length === 0 && this.exQuotations.length === 0) {
      this.pages[0].forms[0].controls['exQuotationTableTitle'].hidden = true;
      this.pages[0].forms[0].controls['exQuotationTableTitle'].setRequired(true)
    }


    this.getQuotationObj(this.exQuotations, 'ex');
    this.getQuotationObj(this.inQuotation, 'in')

  }
  calculateRemainingLimit(quotationValue: number) {

    this.remainingLimit =
        this.financeEligibiltyLimit - quotationValue;
    this.progressPercentage =
        (quotationValue / this.financeEligibiltyLimit) * 100;
    this.remainingLimit < 0 ? this.remainingLimit = -(this.remainingLimit) : this.remainingLimit = this.remainingLimit;


  }
  drawPage() {
    this.pages = [new PageModel(3, vehicleDetailsForm())];
    this.tableButtonClicked()
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    if (formButtonClickOutput.buttonId === 'uploadExternalquotationLineCard') {
      this.router.navigate(['/finance/fleet/upload-external-quotation'])
    }
    if (formButtonClickOutput.buttonId === 'uploadInternalquotationLineCard') {
      this.router.navigate(['/finance/request/internal-quot'])
    }
    if (formButtonClickOutput.buttonId === 'Next') {
      this.nextStep()
    }
    if (formButtonClickOutput.buttonId === 'Back') {
      this.backStep()
    }
  }


  nextStep() {
    let inQuotation = (sessionStorage.getItem('InQuotations'))?  JSON.parse(sessionStorage.getItem('InQuotations') || "") :[]
    let exQuotation = (sessionStorage.getItem('ExQuotations')) ?(JSON.parse(sessionStorage.getItem('ExQuotations') || "")) :[]

    let quotationObj:UploadCustomerQuotation = {
      dossierId:sessionStorage.getItem('DOSSIER_ID') || "",
      quotations:inQuotation.concat(exQuotation)
    }
    this.requestService.uploadCustomerQuotation(quotationObj).subscribe(res=>{
      this.router.navigate(['/finance/fleet/upload-docs']);
    })
  }

  backStep() {
    this.router.navigate(['/finance/fleet/linked-account']);
  }

  getQuotationObj(QuotationsList: Quotation[], ref: string) {
    QuotationsList.forEach((quotation:Quotation, index:number) => {

      let newObj: QuotationTableData = {
        quotationValue:0,
        carQuantity:0
      }
      newObj['qutationName'] = `External Quotation ${quotation.quotationNum + 1}`
      newObj['type'] = (ref === 'ex' ? 'External Quotation' : 'Internal Quotation');
      newObj['index'] = index + 1
      quotation.purposes.forEach((purpose: Purpose) => {
        newObj['quotationValue'] += (+purpose.vehiclePrice * +purpose.vehiclesNum);
        newObj['carQuantity'] += parseInt(purpose.vehiclesNum)
      });
      this.totalPriceForQuotations +=  newObj['quotationValue'];

      if (ref === 'ex') {
        this.exQuotationListData.push(newObj);
        this.pages[0].forms[0].controls['externalQuotationTable'].controlOptions.data = this.exQuotationListData;
      } else {
        this.inQuotationListData.push(newObj);
        this.pages[0].forms[0].controls['internalQuotationTable'].controlOptions.data = this.inQuotationListData;

      }
    });

    this.calculateRemainingLimit(this.totalPriceForQuotations)


  }

  tableButtonClicked() {
    (this.pages[0].forms[0].controls['externalQuotationTable'] as TableControl)
      .buttonClicked.subscribe((row: TableButtonOutputModel) => {

      if (row.buttonId == 'delete') {
        this.exQuotationListData = this.exQuotationListData.filter((data: QuotationTableData, idx: number) => idx !== row.displayedData.index - 1)
        this.exQuotationListData.forEach((quotation: QuotationTableData, index: number) => {
          quotation.index = index + 1
        })
      }
      if(row.buttonId == 'edit'){
        this.router.navigate(['/finance/fleet/upload-external-quotation'], {queryParams: { index: row.displayedData.index-1 },skipLocationChange:false});
      }
      this.pages[0].forms[0].controls['externalQuotationTable'].controlOptions.data = this.exQuotationListData;
    });

    //internalQuotationTable
    (this.pages[0].forms[0].controls['internalQuotationTable'] as TableControl)
    .buttonClicked.subscribe((row: TableButtonOutputModel) => {
    if (row.buttonId == 'delete') {
      this.inQuotationListData = this.inQuotationListData.filter((data: QuotationTableData, idx: number) => idx !== row.displayedData.index - 1)
      this.inQuotationListData.forEach((quotation: QuotationTableData, index: number) => {
        quotation.index = index + 1
      })
    }
    if(row.buttonId == 'edit'){
      this.router.navigate(['/finance/request/internal-quot'], {queryParams: { index: row.displayedData.index-1 },skipLocationChange:false});
    }

    this.pages[0].forms[0].controls['internalQuotationTable'].controlOptions.data = this.inQuotationListData;
  })

  }


}
