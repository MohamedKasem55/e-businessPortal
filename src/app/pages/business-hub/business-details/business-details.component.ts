import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreadcrumbService } from 'app/@core/service/base/breadcrumb.service';
import { BusinessHubService } from 'app/@core/service/business-hub/business-hub.service';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { GenericFeatureListModel } from 'arb-design-library/model/generic-feature-list.model';

@Component({
  selector: 'app-business-details',
  templateUrl: './business-details.component.html',
  styleUrls: ['./business-details.component.scss']
})
export class BusinessDetailsComponent implements OnInit {

  productDetailsList: GenericFeatureListModel[] = [];
  featureDetailsEndButtons: ButtonModel[] = [];
  lineCards: any[] = [];
  constructor(private router: Router, private breadcrumbService: BreadcrumbService, private businessHubService: BusinessHubService) { }

  ngOnInit(): void {
    this.setBreadCrumb();
    this.initProductDetails();
    this.checkSubscriptionAccessbility(history.state.product?.id)
  }
  setBreadCrumb() {
    this.breadcrumbService.setBreadcrumb([
      {
        text: 'businessHub.businessHubTitle',
        url: '/business-hub'
      },
      {
        text: history.state.product?.title,
        url: ''
      }
    ]);
  }

  checkSubscriptionAccessbility(feature: string) {
    this.businessHubService.hasAccess(feature).subscribe((response) => {
      this.featureDetailsEndButtons.push({
        id: 'subscriptionButton',
        text: 'businessHub.subscribe',
        type: 'primary',
        isDisable: response.errorCode === '0' && response.subscriptionStatus.canSubscribe
          ? false
          : true,
      });
    });
  }

  initProductDetails() {
    if (!history.state?.product) this.router.navigate(['/business-hub']).then(_ => { });
    else {

      this.lineCards = history.state.product.features;
      delete history.state.product.features;
      delete history.state.product.featureButton;
      this.productDetailsList.push(history.state.product);
    }
  }

  onBackArrowClicked() {
    this.router.navigate(['/business-hub']);
  }

  onSubscribe() {
    this.router.navigate(['/business-hub/subscription-flow'],
      {
        state: {
          id: history.state.product?.id,
        },
      }
    );
    sessionStorage.setItem('subscriptionProductDetailsTitle', history.state.product?.title);
  }

}
