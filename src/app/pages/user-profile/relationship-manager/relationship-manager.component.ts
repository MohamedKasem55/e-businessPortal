import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ServiceLocator} from 'app/@core/service/base/service-locator.service';
import {RelationshipManagerService} from 'app/@core/service/relationship-manager/relationship-manager.service';
import {SummaryItemModel} from 'arb-design-library/model/summary-item.model';
import {SummarySectionModel} from 'arb-design-library/model/summary-section.model';
import {Router} from "@angular/router";

@Component({
  selector: 'app-relationship-manager',
  templateUrl: './relationship-manager.component.html',
  styleUrls: ['./relationship-manager.component.scss']
})
export class RelationshipManagerComponent implements OnInit {
  summaryDetails: SummaryItemModel[] = [];
  translate!: TranslateService;
  isEmptyDetails: boolean = true;

  title!: string;

  section: SummarySectionModel = {
    items: this.summaryDetails
  }


  constructor(private relationshipManagerService: RelationshipManagerService,private router: Router) {
    this.translate = ServiceLocator.injector.get(TranslateService);
  }


  ngOnInit(): void {
    this.title = this.translate.instant("preferences.relationshipManager");
    this.getRelationshipManagerDetails();
  }

  getRelationshipManagerDetails() {
    this.relationshipManagerService.getRelationShipManagerDetails()
      .subscribe({
        next: (data: any) => {
          if (!data || !data.relationshipManagerInfoDTO || Object.keys(data.relationshipManagerInfoDTO).length === 0) {
            this.isEmptyDetails = true;
            return;
          }
          this.isEmptyDetails = false;
          this.summaryDetails.push(
            {
              title: this.translate.instant("preferences.relationshipManager"),
              subTitle: data.relationshipManagerInfoDTO?.userFullName
            },
            {
              title: this.translate.instant("preferences.email"),
              subTitle: data.relationshipManagerInfoDTO?.mail
            },
            {
              title: this.translate.instant("preferences.phone"),
              subTitle: data.relationshipManagerInfoDTO?.telephoneNumber
            }
          );
        },
        error: () => {
          this.isEmptyDetails = true;
        },
      });
  }

  onArrowClicked(){
    this.router.navigate(['dashboard']);
  }
}
