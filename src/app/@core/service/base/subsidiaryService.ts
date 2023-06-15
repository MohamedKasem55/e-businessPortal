import {SwitchCompanyReq} from "../../model/rest/holding-company/switch-company-req";
import {ResponseException} from "./responseException";
import {RibbonItemModel} from "arb-design-library/model/ribbon-item.model";
import {Router} from "@angular/router";
import {LoadAfterLoginService} from "./load-after-login.service";
import {SessionService} from "./session.service";
import {HoldingCompanyService} from "../holding-company/holding-company.service";
import {Injectable} from "@angular/core";
import {SubsidiariesModel} from "../../model/dto/subsidiaries";


@Injectable()
export class SubsidiaryService {

  subsidiariesModel: SubsidiariesModel = {};

  constructor(private router: Router, private loadAfterLoginService: LoadAfterLoginService, private sessionService: SessionService,
              private holdingCompanyService: HoldingCompanyService) {
  }

  getSubsidiaryList(): SubsidiariesModel {
    if (JSON.parse(sessionStorage.getItem("subsidiaries")!)) {
      this.setRibbonItems(JSON.parse(sessionStorage.getItem("subsidiaries")!));
      let company = JSON.parse(sessionStorage.getItem('company')!);
      this.subsidiariesModel.holdingId = company.profileNumber;
      this.subsidiariesModel.subsidiaries?.push({
        title: company.companyName,
        id: this.subsidiariesModel.holdingId || '',
        image: '',
        subtitle: this.subsidiariesModel.holdingId || '',
      })
      this.subsidiariesModel.currentSubsidiaryId = JSON.parse(<string>sessionStorage.getItem('company'))?.profileNumber;
    }
    return this.subsidiariesModel
  }

  changeCurrentCompany(id: string) {
    this.subsidiariesModel.currentSubsidiaryId = id;
    let req: SwitchCompanyReq = {
      companyId: id
    }
    this.holdingCompanyService.switchCompanyHoldingOrSubsidiary(req).subscribe({
        next: (response) => {
          this.subsidiariesModel.subsidiaries = [];
          this.setRibbonItems(response.company?.subsidiaries)
          if (sessionStorage.getItem("Environment")) {
            let environment = sessionStorage.getItem("Environment")!;
            sessionStorage.clear();
            sessionStorage.setItem("Environment", environment)
          } else {
            sessionStorage.clear();
          }
          this.loadAfterLoginService.load(response).subscribe(() => {
            sessionStorage.setItem("token", response.token) // newToken
            this.router.navigate(['/dashboard'])
            this.sessionService.setSession("timeToLive", response.tokenValidaityInSecond);
          });
        },
        error: (error: ResponseException) => {
        }
      }
    )
  }

  private setRibbonItems(subsidiaries: any) {
    this.subsidiariesModel.subsidiaries = [];
    subsidiaries.forEach((current: any) => {
      let ribbonItem: RibbonItemModel = {
        id: current.profileNumber,
        title: current.companyName, // need to be short name under 20 characters
        subtitle: current.profileNumber,
        //TODO: set the image when BE is sending it (current.image)
        image: ''
      }
      this.subsidiariesModel.subsidiaries!.push(ribbonItem)
    })
  }
}
