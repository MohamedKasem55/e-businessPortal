import { Component } from '@angular/core';
import { ButtonControl } from 'app/@core/model/dto/control/button-control';
import { DropdownControl } from 'app/@core/model/dto/control/dropdown-control';
import { NumberInputControl } from 'app/@core/model/dto/control/number-input-control';
import { SummaryItemControl } from 'app/@core/model/dto/control/sumery-item-control';
import { TableControl } from 'app/@core/model/dto/control/table-control';
import { TitleControl } from 'app/@core/model/dto/control/title-control';
import { FormModel, FormResult } from 'app/@core/model/dto/formModel';
import {
  currencesAndSellBuyPrice,
  FxRatesCurrenciesAndIso,
  fxRatesModel,
  FxRatesRequestReq,
  fxRatesRes,
} from 'app/@core/model/rest/fx-rates/fx-rates';
import { BreadcrumbService } from 'app/@core/service/base/breadcrumb.service';
import { FxRatesService } from 'app/@core/service/fx-rates/fx-rates.service';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { TableHeaderType } from 'arb-design-library';
import { summaryControl } from '../../payments/aramco-payment/aramco-payment-control';

@Component({
  selector: 'app-fx-rates',
  templateUrl: './fx-rates.component.html',
  styleUrls: ['./fx-rates.component.scss'],
})
export class FxRatesComponent {
  fxRatesForms: FormModel[] = [];
  currenciesAndIso: FxRatesCurrenciesAndIso[] = [];
  currencesAndSellBuyPrices: currencesAndSellBuyPrice[] = [];
  currencyFromSelected: string = '';
  currencyToSelected: string = '';

  constructor(
    private fxRatesService: FxRatesService,
    private breadcrumbService: BreadcrumbService
  ) {
    this.breadcrumbService.setBreadcrumb([
      {
        text: 'public.fxRatesTitle',
        url: '',
      },
    ]);
    this.fxRatesForms.push(this.getFxRatesCalculationForm());
    this.fxRatesForms.push(this.getFxRatesForm());
    this.getCurrenciesAndIsoList();
    this.getFxRates();
    this.listenToDropDownLists(['currencyFrom', 'currencyTo']);
  }

  getCurrenciesAndIsoList() {
    this.fxRatesService.getRatesList().subscribe({
      next: (result: any) => {
        let currenciesObj = result[0].props;
        let currenciesIsoObj = result[1].props;
        for (const key in currenciesObj) {
          for (const isoKey in currenciesIsoObj) {
            if (key === isoKey) {
              let currencyAndIso: FxRatesCurrenciesAndIso = {
                code: key,
                currecy: currenciesObj[key],
                iso: currenciesIsoObj[key],
                currencyWithIso: `${currenciesIsoObj[key]} - ${currenciesObj[key]}`,
              };
              this.currenciesAndIso.push(currencyAndIso);
            }
          }
        }
        this.fxRatesForms[0].controls['currencyFrom'].controlOptions.options =
          this.currenciesAndIso;
        this.fxRatesForms[0].controls['currencyTo'].controlOptions.options =
          this.currenciesAndIso;
      },
      error: () => {},
    });
  }

  getFxRates() {
    this.fxRatesService.getFxRates().subscribe({
      next: (data: fxRatesRes) => {
        data.fxRatesList.forEach((item: fxRatesModel) => {
          let code = item.currencyCode;
          let record = this.currenciesAndIso.find((row) => row.code === code);
          if (!record?.iso || !record?.currecy) return;
          this.currencesAndSellBuyPrices.push({
            image: 'assets/flags/' + code + '.png',
            currencyCode: code,
            currency: record?.currecy,
            iso: record?.iso,
            buyPrice: item.buyPrice,
            sellPrice: item.sellPrice,
          });
        });
        this.fxRatesForms[1].controls['fxRatesTable'].controlOptions.data =
          this.currencesAndSellBuyPrices;
      },
      error: () => {
        this.fxRatesForms[1].controls['fxRatesTable'].controlOptions.data = [];
      },
    });
  }

  getFxRatesForm() {
    return new FormModel({
      id: 'fxRatesForm',
      controls: {
        fxRatesTable: new TableControl({
          columnCount: 12,
          order: 4,
          required: true,
          controlOptions: {
            headers: [
              {
                title: 'Currency Code',
                fieldName: 'iso',
                type: TableHeaderType.LINE_CARD,
                controlOptions: {
                  image: 'image',
                },
              },
              {
                title: 'Currency Name',
                fieldName: 'currency',
                type: TableHeaderType.TEXT,
              },
              {
                title: 'Buy Price',
                fieldName: 'buyPrice',
                type: TableHeaderType.TEXT,
              },
              {
                title: 'Sell Price',
                fieldName: 'sellPrice',
                type: TableHeaderType.TEXT,
              },
            ],
            columnId: 'currencyCode',
            showSearch: true,
            pageSizes: [10, 25],
            paginationValue: { page: 1, size: 10 },
            title: 'public.currencies'
          },
        }),
      },
    });
  }

  getFxRatesCalculationForm() {
    return new FormModel({
      id: 'fxRatesCalculationForm',
      controls: {
        convertorTitle: new TitleControl({
          order: 1,
          columnCount: 12,
          controlOptions: {
            id: 'convertorTitle',
            title: 'public.convertorTitle',
          },
        }),
        currencyFrom: new DropdownControl({
          label: 'public.from',
          required: true,
          order: 2,
          columnCount: 4,
          validationLabels: { required: "public.validations.required", },
          controlOptions: {
            columnId: 'code',
            textField: ['currencyWithIso'],
            options: [],
            hasSearch: true,
          },
        }),
        currencyTo: new DropdownControl({
          label: 'public.to',
          required: true,
          order: 3,
          columnCount: 4,
          validationLabels: {  required: "public.validations.required" },
          controlOptions: {
            columnId: 'code',
            textField: ['currencyWithIso'],
            options: [],
            hasSearch: true,
          },
        }),
        amount: new NumberInputControl({
          label: 'public.amount',
          required: true,
          order: 4,
          columnCount: 2,
          validationLabels: {  required: "public.validations.required" },
          value: '',
        }),
        calculateButton: new ButtonControl({
          order: 5,
          columnCount: 2,
          controlOptions: {
            id: 'calculateBtn',
            type: 'primary',
            text: 'public.calculate',
            isDisable: true,
          },
        }),
        calculationTitle: new TitleControl({
          order: 6,
          columnCount: 12,
          hidden: true,
          controlOptions: {
            id: 'calculationTitle',
            title: 'public.calculationTitle',
          },
        }),
        exchangeValue: new SummaryItemControl({
          columnCount: 3,
          order: 7,
          label: 'public.exchangeValue',
          value: '',
          hidden: true,
        }),
        targetAmount: new SummaryItemControl({
          columnCount: 3,
          order: 8,
          label: 'public.targetAmount',
          value: '',
          hidden: true,
        }),
      },
    });
  }

  listenToDropDownLists(values: string[]) {
    values.forEach((value) => {
      this.fxRatesForms[0].controls[value].valueChanges.subscribe({
        next: () => {
          const selectedValue =
            this.fxRatesForms[0].controls[value].value?.code;
          if (value === 'currencyFrom')
            this.currencyFromSelected = selectedValue;
          else this.currencyToSelected = selectedValue;
        },
        error: () => {},
      });
    });
  }

  onBtnClicked(formButtonClickOutput: FormButtonClickOutput) {
    if (formButtonClickOutput.buttonId === 'calculateBtn') {
      this.calculateRates();
    }
  }

  calculateRates() {
    let request: FxRatesRequestReq = {
      baseAmount: this.fxRatesForms[0].controls['amount'].value,
      fromCurrencyCode: this.currencyFromSelected,
      toCurrencyCode: this.currencyToSelected,
    };
    this.fxRatesService.getFxRates(request).subscribe({
      next: (result: fxRatesRes) => {
        this.renderCalculationResults(result);
      },
      error: () => {},
    });
  }

  renderCalculationResults(result: fxRatesRes) {
    this.fxRatesForms[0].controls['calculationTitle'].hidden = false;
    this.fxRatesForms[0].controls['exchangeValue'].hidden = false;
    this.fxRatesForms[0].controls['exchangeValue'].setValue(
      result.exchangeValue
    );
    this.fxRatesForms[0].controls['targetAmount'].hidden = false;
    this.fxRatesForms[0].controls['targetAmount'].setValue(result.targetAmount);
  }

  onResultChanged(formResult: FormResult[]) {
    this.fxRatesForms[0].controls['calculateButton'].controlOptions.isDisable =
      !formResult[0].valid;
  }
}
