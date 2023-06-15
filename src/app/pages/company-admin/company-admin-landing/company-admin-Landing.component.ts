import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  COM_AD,
  COM_AD_FEES,
  COM_AD_WORKFLOW,
  COM_AD_WORKFLOW_MANAGEMENT,
} from 'app/@core/constants/pages-urls-constants';
import {BreadcrumbService} from 'app/@core/service/base/breadcrumb.service';
import {BoxModel} from 'arb-design-library/model/box.model';
import {TitleModel} from 'arb-design-library/model/title.model';
import {getCompanyAdminBoxes, getCompanyTitleModel,} from './company-admin-landing.controls';
import {Utils} from '../../../@core/utility/Utils';
import {AuthenticationUtils} from "../../../@core/utility/authentication-utils";

@Component({
  selector: 'app-company-admin-landing',
  templateUrl: './company-admin-landing.component.html',
})
export class CompanyAdminLandingComponent {
  boxes: BoxModel[] = getCompanyAdminBoxes();
  title: TitleModel = getCompanyTitleModel();

  constructor(
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute
  ) {
    Utils.setBreadcrumb([
      {
        text: 'company-admin.name',
        url: `/${COM_AD}`,
      },
    ]);
    this.setChangeWorkflow();
  }

  onBoxSelect(key: string) {
    switch (key) {
      case 'alrajhi-user-management':
        this.router.navigateByUrl(`/${COM_AD}/` + key).then(() => {
        });
        break;
      case 'alrajhi-fees-managment':
        this.router
          .navigate([`/${COM_AD}/` + `/${COM_AD_FEES}`], {relativeTo: this.route})
          .then(() => {
          });
        break;
      case 'alert-managment':
        this.router
          .navigate(['/company-admin/alert-management'], {
            queryParams: {type: 'subscribed'},
          })
          .then(() => {
          });
        break;
      case 'company-config':
        this.router
          .navigate(['/company-admin/company-configuration'])
          .then(() => {
          });
        break;
      case 'token-managment':
        this.router
          .navigate(['/company-admin/token-management'])
          .then(() => {
          });
        break;
      case 'activity-logs':
        this.router.navigate(['/user-profile/activity-logs']).then(() => {
        });
        break;
      case 'workflow-management':
        void this.router.navigateByUrl(`${COM_AD}/` + `${COM_AD_WORKFLOW_MANAGEMENT}`)
        break;
      case 'update-cr':
        void this.router.navigate(['/company-admin/update-cr']);
        break;
      case 'change-qtl':
        void this.router.navigate(['/company-admin/change-qtl']);
        break;

      default:
        break;
    }
  }

  onButtonClick(button: string) {
    switch (button) {
      case 'change-workflow':
        void this.router
          .navigateByUrl(`/${COM_AD}/` + `${COM_AD_WORKFLOW}`)
          .then();
        break;
    }
  }

  private setChangeWorkflow() {
    this.title.endButtons = [];
    let flag: boolean = JSON.parse(sessionStorage.getItem("canChangeWorkFlow")!);
    if (flag) {
      this.title.endButtons = [{
        id: 'change-workflow',
        type: "primary",
        text: 'workflow.change-workflow',
        isDisable : !AuthenticationUtils.isCompanyAdmin
      }];
    }
  }
}
