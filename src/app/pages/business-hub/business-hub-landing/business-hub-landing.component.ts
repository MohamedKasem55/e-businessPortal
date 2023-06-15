import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BreadcrumbService} from 'app/@core/service/base/breadcrumb.service';
import {BusinessHubService} from 'app/@core/service/business-hub/business-hub.service';
import {BoxModel} from 'arb-design-library/model/box.model';
import {ButtonModel} from 'arb-design-library/model/button.model';
import {GenericFeatureListModel} from 'arb-design-library/model/generic-feature-list.model';
import {AuthenticationUtils} from "../../../@core/utility/authentication-utils";

@Component({
  selector: 'app-business-hub-landing',
  templateUrl: './business-hub-landing.component.html',
  styleUrls: ['./business-hub-landing.component.scss']
})
export class BusinessHubLandingComponent implements OnInit {

  productsList: GenericFeatureListModel[] = [];
  productsListToShow!: GenericFeatureListModel[];
  boxes: BoxModel[] = [];
  featureButton!: ButtonModel;
  noError!: boolean;
  constructor(
    private businessHubService: BusinessHubService,
    private router: Router,
    private breadcrumbService: BreadcrumbService
  ) {
  }

  ngOnInit(): void {
    this.setBreadCrumb();
    this.featureButton = {
      id: 'details',
      text: 'public.details',
      type: 'outLine'
    }
    this.initBoxes();
    this.initZidProduct();
    this.initQoyodProduct();
  }

  setBreadCrumb() {
    this.breadcrumbService.setBreadcrumb([{
      text: 'businessHub.businessHubTitle',
      url: ''
    }]);
  }

  initBoxes() {
    this.boxes.push(
      {
        id: "all",
        text: 'All',
        icon: 'arb-icon-Alrajhi',
        isDisabled: false
      },
      {
        id: "accounting",
        text: 'Accounting',
        icon: 'arb-icon-Alrajhi',
        isDisabled: false
      },
      {
        id: "ecommerce",
        text: 'E-commerce',
        icon: ' arb-icon-saudiBold',
        isDisabled: false
      },
    );
  }

  onFeatureClicked(id: string) {
    this.router.navigate(['/business-hub/details'], {
      state: {
        product: this.productsList.find(item => item.id === id),
      }
    });
  }

  onBoxSelected(id: string) {
    switch (id) {
      case 'all':
        this.productsListToShow = [...this.productsList];
        break;
      case 'accounting':
        this.productsListToShow = [...this.productsList.filter(item => item.id === 'qoyod')];
        break;
      case 'ecommerce':
        this.productsListToShow = [...this.productsList.filter(item => item.id === 'zid')];
        break;
      default:
        break;
    }
  }

  onBackArrowClicked() {
    this.router.navigate(['/dashboard']);
  }


  initZidProduct() {
    this.businessHubService.getConfig('zid').subscribe(response => {
      let priceAfterDiscount = `${(response?.configuration?.subscriptionTotalFees).toFixed(2).toString()} sar / year`;
      let zidProduct = {
        id: 'zid',
        cardImg: 'assets/img/zid_image.png',
        title: 'businessHub.zid',
        subTitle: !parseInt(priceAfterDiscount) ? 'Free' : priceAfterDiscount,
        isDeleted: true,
        amount: response?.configuration?.oldFees,
        description: 'businessHub.zid-desc',
        currency: 'sar',
        perDuration: 'year',
        featureButton: this.featureButton,
        features: [
          {
            text: "businessHub.zid-feature-1",
            icon: "arb-icon-other fs-4 color-arb-secondaryText"
          },
          {
            text: "businessHub.zid-feature-2",
            icon: "arb-icon-Bill fs-4 color-arb-secondaryText"
          },
          {
            text: "businessHub.zid-feature-3",
            icon: "arb-icon-exhangeCircleArrows fs-4 color-arb-secondaryText"
          },
          {
            text: "businessHub.zid-feature-4",
            icon: "arb-icon-document fs-4 color-arb-secondaryText"
          },
        ]
      }
      this.productsList.push(zidProduct);
      this.productsListToShow = [...this.productsList];
    });
  }

  initQoyodProduct() {
    this.businessHubService.getConfig('qoyod').subscribe(response => {
      let priceAfterDiscount = `${(response?.configuration?.subscriptionTotalFees).toFixed(2).toString()} sar / year`;
      let qoyodProduct = {
        id: 'qoyod',
        cardImg: 'assets/img/qoyod_image.png',
        title: 'businessHub.qoyod',
        subTitle: !parseInt(priceAfterDiscount) ? 'Free' : priceAfterDiscount,
        isDeleted: true,
        description: 'businessHub.qoyod-desc',
        currency: 'sar',
        amount: response?.configuration?.oldFees,
        perDuration: 'year',
        featureButton: this.featureButton,
        features: [
          {
            text: "businessHub.qoyod-feature-1",
            icon: "arb-icon-other fs-4 color-arb-secondaryText"
          },
          {
            text: "businessHub.qoyod-feature-2",
            icon: "arb-icon-Bill fs-4 color-arb-secondaryText"
          },
          {
            text: "businessHub.qoyod-feature-3",
            icon: "arb-icon-exhangeCircleArrows fs-4 color-arb-secondaryText"
          },
          {
            text: "businessHub.qoyod-feature-4",
            icon: "arb-icon-document fs-4 color-arb-secondaryText"
          },
        ]
      }
      this.productsList.push(qoyodProduct);
      this.productsListToShow = [...this.productsList];
    });
  }


}
