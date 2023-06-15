import {Injectable} from "@angular/core";
import {AbstractBaseService} from "./abstract-base.service";
import {Observable, Subscriber} from "rxjs";
import {Constants} from "./base-urls";
import {Dictionary} from "../../model/dto/dictionary.model";
import {ModelAndListService} from "./modelAndList.service";
import {AccountsCommonService} from "../accounts/accounts-common.service";
import {COM_AD, COM_AD_WORKFLOW} from "../../constants/pages-urls-constants";
import {Store} from "@ngrx/store";
import {addUserInfoAction} from "app/shared/store/shared.action";

@Injectable()
export class LoadAfterLoginService extends AbstractBaseService {


  constructor(
    private modelAndListService: ModelAndListService,
    private accountService: AccountsCommonService,
    private store: Store,
  ) {
    super();
  }

  load(response: any): Observable<void> {
    return new Observable((observer: Subscriber<any>) => {
      if (!sessionStorage.getItem("token")) /// For Reset Password API
        sessionStorage.setItem("token", response.token);
      sessionStorage.setItem("company", JSON.stringify(response.company));
      sessionStorage.setItem("ownershipType", response.company.ownershipeType);
      sessionStorage.setItem("canChangeWorkFlow", response.canChangeWorkFlow);
      sessionStorage.setItem("user", JSON.stringify(response.user));
      this.store.dispatch(
        addUserInfoAction({
          userInfo: response.user,
        })
      );

      const groups = new Dictionary<boolean>()
      for (let i = 0; i < response.groups.length; i++) {
        groups.add(response.groups[i], true)
      }
      sessionStorage.setItem("groups", JSON.stringify(groups));


      const privileges = new Dictionary<boolean>()
      for (let i = 0; i < response.company.privileges.length; i++) {
        privileges.add(response.company.privileges[i].privilegeId, true)
      }

      sessionStorage.setItem("privilegesAuth", JSON.stringify(privileges));
      sessionStorage.setItem("disclaimerList", JSON.stringify(response.disclaimerList));


      let count = 4;

      this.modelAndListService.getList(['currencyIso', 'currencyDecimals', 'currencyType']).subscribe({
        next: () => {
          count--;
          this.checkReturn(count, observer);
        }, error: () => {
          count--;
          this.checkReturn(count, observer);
        }
      });


      this.accountService.getJuridicalState().subscribe({
        next: (result) => {
          sessionStorage.setItem("JuridicalState", result.juridicalState.toString());
          count--;
          this.checkReturn(count, observer);
        }, error: () => {
          sessionStorage.setItem("JuridicalState", "E9999");
          count--;
          this.checkReturn(count, observer);
        }
      });

      this.get(Constants.LOAD_MENU_OPTION_LIST).subscribe(
        {
          next: (response) => {
            const services = new Dictionary<boolean>();
            for (let i = 0; i < response.services.length; i++) {
              services.add(
                response.services[i].description,
                response.services[i].active,
              )
            }
            sessionStorage.setItem("services", JSON.stringify(services));
            count--;
            this.checkReturn(count, observer);
          }, error: () => {
            count--;
            this.checkReturn(count, observer);
          }
        });

      this.get(Constants.WELCOME_PAGE_LIMIT).subscribe(
        {
          next: (response) => {
            sessionStorage.setItem("welcome", JSON.stringify(response));
            count--;
            this.checkReturn(count, observer);
          }, error: () => {
            count--;
            this.checkReturn(count, observer);
          }
        });
    });
  }

  private checkReturn(count: number, observer: Subscriber<any>) {
    if (count == 0) {
      observer.next();
    }
  }


  redirect(res: any) {
    let changeCompanyWorkflow: boolean = false;
    if (res.disclaimerList) {
      res.disclaimerList.forEach((value: any) => {
        if (value.type == 'CHANGE_COMPANY_WORKFLOW_ALERT' && value.show) {
          changeCompanyWorkflow = true;
        }
      });
    }
    if (changeCompanyWorkflow) {
      sessionStorage.setItem("recommendWorkflow", 'true');
      void this.router.navigateByUrl(`${COM_AD}/` + `${COM_AD_WORKFLOW}`);
    } else {
      void this.router.navigateByUrl('/dashboard')
    }
  }
}
