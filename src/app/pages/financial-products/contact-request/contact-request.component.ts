import {Component, OnInit} from '@angular/core';
import {FormResult, PageModel} from 'app/@core/model/dto/formModel';
import {ResultModal} from 'app/@core/model/dto/result.modal';
import {
  ProductType,
  RegionType,
  RegisterInterestReq
} from 'app/@core/model/rest/financial-products/register-interest-req.model';
import {ResponseException} from 'app/@core/service/base/responseException';
import {FinancialProductsService} from 'app/@core/service/financial-products/financial-products.service';
import {FormButtonClickOutput} from 'app/shared/form/form.component';
import {AmountTitleModel} from 'arb-design-library/model/amount-title.model';
import {ButtonModel} from 'arb-design-library/model/button.model';
import {SummaryModel} from 'arb-design-library/model/summary.model';
import {TransactionFollowBase} from "../../../shared/transaction-follow-base/transaction-follow-base";
import {contactForm, titleForm} from './contact-request-contrlos';

@Component({
  selector: 'app-contact-request',
  templateUrl: './contact-request.component.html',
  styleUrls: []
})
export class ContactRequestComponent extends TransactionFollowBase implements OnInit {

  type!: string
  region!: string
  city!: string
  yearly!: string
  name!: string
  phone!: string
  email!: string
  time!: string

  goDashboardButton: ButtonModel = {
    id: 'dashboard',
    text: 'financial-products.goDashboard',
    type: 'secondary',
    isDisable: false,
  };

  goLogin: ButtonModel = {
    id: 'login',
    text: 'financial-products.goLogin',
    type: 'primary',
    isDisable: false,
  };

  goAccountsButton: ButtonModel = {
    id: 'accounts',
    text: 'financial-products.goAccounts',
    type: 'primary',
    isDisable: false,
  };
  isExt: boolean = true;

  constructor(private financialProductsService: FinancialProductsService) {
    super();
    this.isExt = this.router.url.includes("-ext");
    this.location.replaceState("cash-management-products/contact-request")
    this.pageTitle = {
      id: "contact-request",
      title: "financial-products.contactRequest",
      showArrow: true,
      stepper: {
        steps: ["", "", ""],
        stepCounter: 1,
        stepText: "public.step",
        ofText: "public.of"
      },
    };
    this.type = this.router.getCurrentNavigation()?.extras?.state?.['type']
  }

  ngOnInit(): void {
    this.pageTitle.stepper!.steps = ["", "", ""];
    this.setBreadcrumb([{
      text: 'financial-products.title',
      url: ''
    }, {text: 'financial-products.contactRequest', url: ''}]);
    this.startButtons = [this.backButton]
    this.endButtons = [this.proceedButton]
    this.endButtons[0].isDisable = true;

    this.drawPage();

    this.financialProductsService.externalModel("cashManagementRegions").subscribe((data) => {
      const options = this.objectToKeyValue(data.props)

      this.getControl(0, 1, "region").controlOptions.options = options
    });
    this.financialProductsService.externalModel("yearlyIncome").subscribe((data) => {
      const options = this.objectToKeyValue(data.props)
      this.getControl(0, 1, "yearly").controlOptions.options = options
    });
    this.financialProductsService.externalModel("bestTimeToCall").subscribe((data) => {
      const options = this.objectToKeyValue(data.props)

      this.getControl(0, 1, "bestToCall").controlOptions.options = options
    });
    this.financialProductsService.externalModel("cityType").subscribe((data) => {
      const options = this.objectToKeyValue(data.props)

      this.getControl(0, 1, "city").controlOptions.options = options
    });

    if (sessionStorage.getItem("user")) {
      this.getControl(0, 1, "name").setValue(JSON.parse(<string>sessionStorage.getItem('user'))?.userName)
      this.getControl(0, 1, "name").disable()
      this.getControl(0, 1, "phone").setValue(JSON.parse(<string>sessionStorage.getItem('user'))?.mobile)
      this.getControl(0, 1, "phone").disable()
      this.getControl(0, 1, "email").setValue(JSON.parse(<string>sessionStorage.getItem('user'))?.email)
      this.getControl(0, 1, "email").disable()
    }

  }

  override onResultChanged(data: FormResult[]) {
    this.endButtons[0].isDisable = !data[1].valid;
  }

  drawPage() {
    this.pages = [];
    this.pages = [new PageModel(1, titleForm(), contactForm())];
    this.getControl(0, 0, "title").controlOptions.subTitle = this.type


  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput): void {
    switch (formButtonClickOutput.buttonId) {
      case 'arrowTitle':
        this.router.navigateByUrl('/cash-management-products')
        break;
      case 'Proceed':
        if (this.pageTitle.stepper?.stepCounter === 1) {
          this.fillFields()
          this.summary = this.fillSummary()
          this.stepperMoveNext()
          this.startButtons = [this.backButton]
          this.endButtons = [this.proceedButton]
        } else {
          this.register()
        }
        break;
      case 'Back':
        if (this.pageTitle.stepper?.stepCounter === 1) {
          this.router.navigateByUrl('/cash-management-products')
        } else {
          this.stepperMoveBack()
        }
        break;
      case 'Edit':
        this.stepperMoveBack()
        break;
      case 'accounts':
        this.router.navigateByUrl('/accounts')
        break;
      case 'dashboard':
        this.router.navigateByUrl('/')
        break;
      case 'login':
        this.router.navigateByUrl('/login')
        break;
    }
  }

  register() {
    this.financialProductsService.registerInterest(this.returnRequest()).subscribe({
      next: (res: any) => {
        this.result = this.fillSuccessResult();
      },
      error: (error: ResponseException) => {
        this.result = this.fillErrorResult(error.ErrorResponse.errorDescription!);
      }
    });
    this.stepperMoveNext()

    this.startButtons = []
    if (sessionStorage.getItem("user")) {
      this.endButtons = [this.goDashboardButton, this.goAccountsButton]
    }else{
      this.endButtons= [this.goLogin]
    }
  }

  fillSuccessResult(): ResultModal {
    return {
      type: 'Success',
      title: 'financial-products.succesfully',
      subTitle: 'financial-products.thank',
      summary: this.fillSummary(false),
    };
  }

  fillErrorResult(errString: string): ResultModal {
    return {
      type: 'Error',
      title: errString,
      summary: this.fillSummary(false),
    };
  }

  fillFields() {
    this.region = this.getControl(0, 1, "region").value.value
    this.city = this.getControl(0, 1, "city").value.value
    this.yearly = this.getControl(0, 1, "yearly").value.key
    this.name = this.getControl(0, 1, "name").value
    this.phone = this.getControl(0, 1, "phone").value
    this.email = this.getControl(0, 1, "email").value
    this.time = this.getControl(0, 1, "bestToCall").value.key
  }

  fillSummary(showEditButton: boolean = true): SummaryModel {
    let summary: any;
    let subTitle: AmountTitleModel[] = [];
    subTitle.push({
      text: 'financial-products.product',
      amount: this.type,
    })
    summary = {
      title: {
        id: 'SummaryTitle',
        title: 'financial-products.contactRequest',
        subTitle
      },
      sections: [{
        title: {
          id: 'organizationInfo',
          title: 'financial-products.organizationInfo',
          startButtons: showEditButton ? [this.editButton] : [],
        },
        items: [
          {
            title: 'financial-products.region',
            subTitle: this.region
          },
          {
            title: 'financial-products.city',
            subTitle: this.city
          },
          {
            title: 'financial-products.yearlyIncome',
            subTitle: this.getControl(0, 1, "yearly").value.value
          }
        ]
      },
        {
          title: {
            id: 'contactInfo',
            title: 'financial-products.contactInfo',
            startButtons: showEditButton ? [this.editButton] : [],
          },
          items: [
            {
              title: 'financial-products.contactName',
              subTitle: this.name
            },
            {
              title: 'financial-products.phoneNum',
              subTitle: this.phone
            },
            {
              title: 'financial-products.contactEmail',
              subTitle: this.email
            },
            {
              title: 'financial-products.bestToCall',
              subTitle: this.getControl(0, 1, "bestToCall").value.value
            }
          ]
        },
      ]
    }

    return summary;
  }

  returnRequest(): RegisterInterestReq {

    return {
      product: this.getProduct(),
      orgName: '',
      orgId: '',
      region: this.region === 'CENTRAL' ? RegionType.CENTRAL : (this.region === 'WESTERN' ? RegionType.WESTERN : RegionType.EASTERN),
      city: this.city,
      yearlyIncome: this.yearly,
      contactName: this.name,
      contactMobile: this.phone,
      contactEmail: this.email,
      bestTimeToCall: this.time
    }
  }

  getProduct(): ProductType {
    let product: ProductType
    switch (this.type) {
      case 'Cash 24':
        product = ProductType.CASH24
        break;
      case 'Credit Cards':
        product = ProductType.CREDIT_CARDS
        break;
      case 'Business 2 Business':
        product = ProductType.B2B
        break;
      case 'Virtual Account':
        product = ProductType.VIRTUAL_ACCOUNT
        break;
      case 'E-Commerce':
        product = ProductType.ECOMMERCE
        break;
      case 'Point of Sale':
        product = ProductType.POS

        break;
      case 'Cash Pick-up':
        product = ProductType.CASH_PICK_UP

        break;
      case 'payroll':
        product = ProductType.PAYROLL

        break;
      case 'Escrow Account':
        product = ProductType.ESCROW_ACCOUNT

        break;
      case 'Dividend Distribution':
        product = ProductType.DIVIDEND_DISTRIBUTION

        break;
      case 'e-Prepaid Cards':
        product = ProductType.E_PREPAID_CARDS

        break;
      case 'Cash Deposit Machines':
        product = ProductType.CASH_DEPOSIT_MACHINES

        break;
      case 'Payroll Cards':
        product = ProductType.PAYROLL_CARDS

        break;
    }
    return product!
  }

  controlExist(pageIndex: number, formIndex: number, controlKey: string): boolean {
    return this.pages[pageIndex]?.forms[formIndex]?.controls[controlKey] ? true : false;
  }


}
