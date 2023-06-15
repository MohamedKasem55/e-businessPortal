import {Component, OnInit} from '@angular/core';
import {BoxModel} from 'arb-design-library/model/box.model';
import {BreadcrumbModel} from 'arb-design-library/model/breadcrumb.model';
import {Router} from '@angular/router';
import {BreadcrumbService} from '../../../../@core/service/base/breadcrumb.service';
import {TranslateService} from '@ngx-translate/core';
import {RequestService} from 'app/@core/service/finance/request/request.service';
import {GenerateChallengeAndOTP} from 'app/@core/model/rest/common/otp.model';
import {PopupService} from 'app/@core/service/base/popup.service';
import {PopupInputModel, PopupOutputModel,} from 'app/@core/model/dto/popup.model';
import {getIneligibleUserForm} from './finance-products.component.controls';
import {TextControl} from '../../../../@core/model/dto/control/text-control';
import {ButtonControl} from '../../../../@core/model/dto/control/button-control';
import {ExistApplicationForm} from "../finance-landing/finance-landing.component.controls";
import {FinanceProductCode} from "../../../../@core/model/rest/finance/request/products-codes";
import {CheckKeyItem} from "../../../../@core/model/rest/finance/request/preliminaryCheck";
import { AuthenticationUtils } from '../../../../@core/utility/authentication-utils';

@Component({
  selector: 'app-finance-products',
  templateUrl: './finance-products.component.html',
  styleUrls: ['./finance-products.component.scss'],
})
export class FinanceProductsComponent {
  errorList: string[] = [];
  generateChallengeAndOTP!: GenerateChallengeAndOTP;
  CheckKeyItems!: CheckKeyItem;
  eligibleFlg: Boolean | string = true;
  authenticationService = AuthenticationUtils
  //Popup
  popupInputModel: PopupInputModel = {};
  popupShow: boolean = true;
  public products: BoxModel[] = [
    {
      id: 'pos',
      text: 'finance.products.pos',
      subTitle: `'finance.products.posDesc'`,
      isDisabled: !this.authenticationService.canActive('POSFinance', [], []),
      icon: 'arb-icon-posCard',
    },
    {
      id: 'bif',
      text: 'finance.products.bif',
      subTitle: 'finance.products.bifFinanceDesc',
      isDisabled: !this.authenticationService.canActive('BIFfinance', [], []),
      icon: 'arb-icon-briefcase',
    },
    {
      id: 'ecommerce',
      text: 'finance.products.eCommerce',
      subTitle: 'finance.products.eCommerceFinanceDesc',
      isDisabled: !this.authenticationService.canActive('Ecommerce', [], []),
      icon: 'arb-icon-cart',
    },
    {
      id: 'fleet',
      text: 'finance.products.fleet',
      subTitle: 'finance.products.fleetDesc',
      isDisabled: !this.authenticationService.canActive('FleetFinance', [], []),
      icon: 'arb-icon-posCard',
    },
  ];

  constructor(
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    public translate: TranslateService,
    private popupService: PopupService,
    private requestService: RequestService
  ) {
  }



  setBreadcrumb(breadcrumb: BreadcrumbModel[]) {
    this.breadcrumbService.setBreadcrumb(breadcrumb);

    //ineligible User Popup
    this.popupService.onShowPopupChange().subscribe((data: PopupInputModel) => {
      data.options = data.options || {centered: false};
      this.popupInputModel = data;
      this.popupShow = true;
    });

    this.popupService.onDismiss().subscribe((data) => {
      this.popupShow = false;
    });
    // this.dismissPopup();
  }

  selectProduct(productID: string) {
    if (productID == 'fleet') {
      this.validateEligibility(productID)

      sessionStorage.setItem(
        'checkKeyItems',
        JSON.stringify(this.CheckKeyItems)
      );
      sessionStorage.setItem(
        'generateChallengeAndOTP',
        JSON.stringify(this.generateChallengeAndOTP)
      );
    } else if (productID == 'pos') {
      this.router.navigate(['/finance/pos'], {
        queryParams: {productName: 'financeProduct.posFinance'},
      });
    } else {
      this.router.navigate(['/finance/request/required-Docs'], {
        queryParams: {productName: productID},
      });
    }
  }

  validateEligibility(productID: string) {
    this.requestService.validateEligibility().subscribe((res) => {
      if (res === null) {
        this.router.navigate(['/']).then(() => {
        })
      } else {
        this.CheckKeyItems = res?.checkKeyItems[0]
        this.errorList = res?.errorList
        this.generateChallengeAndOTP = res?.generateChallengeAndOTP
        this.requestService.removeFleetSessionDB()
        if (!this.CheckKeyItems?.eligibleFlg || !this.CheckKeyItems?.maxIndicativeAmt ||
          this.CheckKeyItems?.maxIndicativeAmt === '0') {

          sessionStorage.setItem('fleetLimit', this.CheckKeyItems?.maxIndicativeAmt.toString())

          this.router.navigate(['/finance/request/required-Docs'], {
            queryParams: {productName: productID},
          });

        } else {
          sessionStorage.setItem('fleetLimit', this.CheckKeyItems?.maxIndicativeAmt.toString())

          this.router.navigate(['/finance/request/required-Docs'], {
            queryParams: {productName: productID},
          });
        }
      }
    })
  }

  onDismis() {
    this.popupService.dismiss();
  }
  convertErrorListToControlObj(errorList: string[]) {
    let newFormObj = {};
    let order = 6;
    errorList.forEach((error, index) => {
      newFormObj = {
        ...newFormObj,
        ...{
          ['reason' + (index + 1)]: new TextControl({
            order: order,
            columnCount: 12,
            label: `${index + 1}. ${error}`,
            class: 'color-arb-secondaryText font-body-light text-start',
          }),
        },
      };
      order++;
    });
    // Add button
    newFormObj = {
      ...newFormObj,
      ...{
        gobackdashboard: new ButtonControl({
          order: order,
          columnCount: 6,
          controlOptions: {
            id: 'gobackdashboard',
            type: 'primary',
            text: 'finance.fleet.btn.backToDashboard',
          },
        }),
        goToBranch: new ButtonControl({
          order: order,
          columnCount: 6,
          controlOptions: {
            id: 'goToBranch',
            type: 'secondary',
            text: 'finance.fleet.btn.signBranch',
          },
        })
      },
    };
    getIneligibleUserForm(this.translate)['_controls'] = {
      ...getIneligibleUserForm(this.translate)['_controls'],
      ...newFormObj,
    };
  }

  openPopup() {
    this.popupService
      .showPopup({
        image: 'assets/img/error.svg',
        form: getIneligibleUserForm(this.translate),
      })
      .subscribe((model: PopupOutputModel) => {
        if (model.buttonId === 'gobackdashboard') {
          this.popupService.dismiss();
          this.router.navigate(['/finance']);
        } else {
          this.router.navigate(['/finance/request/all-branches']);
          this.popupService.dismiss();
        }
      });
  }

  onPopupButtonClick(data: PopupOutputModel) {
    this.popupService.onPopupButtonClick(data);
  }
}

