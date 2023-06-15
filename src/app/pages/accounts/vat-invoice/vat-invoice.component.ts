import {Component, OnInit} from '@angular/core';
import {FormModel, FormResult} from "../../../@core/model/dto/formModel";
import {TranslateService} from "@ngx-translate/core";
import {endButtons, getVatInvoiceForm, MONTHS_NAME} from "./vat-invoice-controls";
import {DatePipe} from "@angular/common";
import {Router} from "@angular/router";
import {AccountsService} from "../../../@core/service/accounts/accounts.service";


@Component({
  selector: 'app-vat-invoice',
  templateUrl: './vat-invoice.component.html',
})
export class VatInvoiceComponent implements OnInit {

  forms: FormModel = getVatInvoiceForm()
  months: any[] = [];
  actualDate: Date = new Date();
  years: any[] = [];
  endButtons = endButtons()

  constructor(private translate: TranslateService,
              private accountService: AccountsService,
              private datePipe: DatePipe,
              private router: Router) {
    this.buildMonthsAndYears();
    this.forms.controls['month'].controlOptions.options = this.months
    this.forms.controls['year'].controlOptions.options = this.years
  }


  ngOnInit(): void {

  }


  private buildMonthsAndYears() {
    this.months = [];
    this.years = [];
    for (const month of MONTHS_NAME) {
      this.months.push({key: month.key, value: this.translate.instant('public.months.' + month.value)});
    }
    let year = this.actualDate.getFullYear()
    let years = []
    for (let i = 0; i < 6; i++) {
      if (year >= 2018) {
        years.push(new Date())
        years[i].setFullYear(year)
      }
      year--
    }
    for (let year of years) {
      this.years.push({
        key: this.datePipe.transform(year, "yyyy")
        , value: this.datePipe.transform(year, "yyyy")
      })
    }
  }

  doButtonClick(id: any) {
    if (id === "arrowTitle") {
      this.router.navigate(['/accounts'])
    }
    if (id === "download") {
      this.accountService.getVatInvoice
      (this.forms.controls['month'].value.key, this.forms.controls['year'].value.key)
    }
  }

  onResultChange(form: FormResult[]) {
    this.endButtons[0].isDisable = !form[0].valid
  }
}
