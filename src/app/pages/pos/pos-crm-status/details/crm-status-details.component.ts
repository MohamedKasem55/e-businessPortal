import { Component, OnInit } from "@angular/core";
import { getCRMStatusDetailsForm } from "./crm-status-details-control";
import { BusinessCardsItem } from "app/@core/model/rest/cards/user-approval/list-res.model";
import { ValidateResModel } from "app/@core/model/rest/cards/user-approval/validate-res.model";
import { FormButtonClickOutput } from "../../../../shared/form/form.component";
import { PageModel } from "../../../../@core/model/dto/formModel";
import { PosBaseComponent } from "../../pos-base/pos-base.component";
import { ModelAndListService } from "app/@core/service/base/modelAndList.service";
import { Router } from "@angular/router";
import { POS_CRM_STATUS } from "app/@core/constants/pages-urls-constants";
import { StatusItem } from "app/@core/model/rest/pos/crm-status/crm-status-res";


@Component({
  selector: 'crm-status-details',
  templateUrl: '../../pos-base/pos-base.component.html',
  styleUrls: []
})

export class CRMStatusDetailsComponent extends PosBaseComponent implements OnInit {

  cardDetails!: BusinessCardsItem;
  validateResponse!: ValidateResModel;

  posCRMStatusTypes: any;
  cities: any;
  crmStatusDetails!: StatusItem

  constructor(
    public override router: Router,
    private modelAndListService: ModelAndListService) {
    super();
    this.setBreadcrumb([
      {
        text: 'pos.dashboard.title',
        url: '/pos'
      },
      {
        text: 'pos.maintenance.crm-status-details',
        url: ''
      },
    ]);
    this.pageTitle = {
      id: 'crm-status-id',
      title: 'pos.maintenance.request-details',
      type: 'Page',
      showArrow: true,
    };
    this.pages = [
      new PageModel(1, getCRMStatusDetailsForm())
    ]
    this.endButtons = [];
    this.startButtons = [this.backButton];

  }

  ngOnInit(): void {

    if (!history.state?.crmStatusDetails) {
      this.router.navigate([`pos/${POS_CRM_STATUS}`]);
    } else {
      this.crmStatusDetails = history.state?.crmStatusDetails;
      this.modelAndListService
        .getList(['cityType', 'posCRMStatusType'])
        .subscribe((models: any) => {
          for (let key of Object.keys(models)) {
            switch (key) {
              case 'cityType':
                this.cities = models[key];
                break;
              case 'posCRMStatusType':
                this.posCRMStatusTypes = models[key];
                break;
            }
          }
          this.drawPage();
        });
    }
  }

  drawPage() {
    this.getControl(0, 0, "requestId").setValue(this.crmStatusDetails.ticketNumber)
    this.getControl(0, 0, "terminalNumber").setValue(this.crmStatusDetails.terminalNumber)
    this.getControl(0, 0, "requestType").setValue(this.posCRMStatusTypes[this.crmStatusDetails.typeRequest])
    this.getControl(0, 0, "city").setValue(this.cities[this.crmStatusDetails.city])
    this.getControl(0, 0, "contactName").setValue(this.crmStatusDetails.contactName)
    this.getControl(0, 0, "mobileNumber").setValue(this.crmStatusDetails.mobile)
    this.getControl(0, 0, "status").setValue(this.crmStatusDetails.statusTicket)
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'back':
      case 'arrowTitle':
        this.backClick();
        break;
    }
  }

  backClick() {
    this.router.navigate(["/pos/crm-status"]);
  }
}
