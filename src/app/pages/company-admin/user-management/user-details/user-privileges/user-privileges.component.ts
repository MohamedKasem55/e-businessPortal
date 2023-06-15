import {Component, Input, OnChanges} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {TableHeaderModel} from "arb-design-library/model/table-header.model";
import {ExecutionType} from "../user-main/user-main.controls";
import {
  getETradeTableHeaders,
  getETradeTitle,
  getPrivilegeTableHeaders,
  getPrivilegeTitle
} from "./user-privileges.controls";
import {EtradeCompanyDetails} from "../../../../../@core/model/rest/company-admin/user-details/register-user-init";

@Component({
  selector: 'app-user-privileges',
  templateUrl: './user-privileges.component.html'
})
export class UserPrivilegesComponent implements OnChanges {

  @Input() editMode?: ExecutionType = ExecutionType.VIEW;
  @Input() userDetails!: any;
  @Input() eTradeDtls!: EtradeCompanyDetails;

  privilegeTableHeaders: TableHeaderModel[] = getPrivilegeTableHeaders();
  eTradeTableHeaders: TableHeaderModel[] = getETradeTableHeaders();

  privilegeTitle = getPrivilegeTitle();
  eTradeTitle = getETradeTitle();

  privilegesListKeys: any;
  privilegeTableData!: any[];
  eTradeTableData!: any[];
  prepareData = true;

  constructor(private translate: TranslateService) {
  }

  ngOnChanges(): void {
    this.prepareData = true;
    this.viewChanges()
  }

  private viewChanges() {
    this.privilegesListKeys = this.translate.instant("company-admin.privileges.functionality");
    let tempPrivileges = []
    let privilegesAcceptance = []

    for (let [k, v] of Object.entries(this.userDetails.backEndAccountPrivileges)) {
      if (!(v instanceof Array)) {
        let key = k.substring(0, k.indexOf('Privilege')).toLowerCase()
        privilegesAcceptance.push({[key]: v});
      }
    }
    for (let privilege of privilegesAcceptance) {
      let [privilegeKey, v] = Object.entries(privilege)[0]
      if (v) {
        for (let [k, v] of Object.entries(this.userDetails.backEndAccountPrivileges)) {
          if (v instanceof Array && k.toLowerCase().includes(privilegeKey)) {
            tempPrivileges.push({
              id: k,
              title: <string>'company-admin.privileges.functionality.' + k,
              value: this.userDetails.backEndAccountPrivileges[k]
            })
            break;
          }
        }
      }
    }
    this.privilegeTableData = tempPrivileges;

    this.privilegeTableData.forEach((record) => {
      record['L1'] = record.value[0];
      record['L2'] = record.value[1];
      record['L3'] = record.value[2];
      record['L4'] = record.value[3];
      record['L5'] = record.value[4];
    })
    this.prepareData = false;
    if (this.userDetails?.userEtradeFunctions
      && this.userDetails?.userEtradeFunctions?.length > 0) {
      let data = [];
      for (let functions of this.userDetails?.userEtradeFunctions) {
        data.push({
          id: functions.etradeFunction.functionId,
          title: (this.translate.currentLang === 'en') ? functions.etradeFunction.descriptionEn :
            functions.etradeFunction.descriptionAr,
          initiate:functions.initiator,
          L1: functions.level>=1,
          L2: functions.level>=2,
          L3: functions.level>=3,
          L4: functions.level>=4,
          L5: functions.level>=5
        })
      }
      this.eTradeTableData = data;
    }
    this.prepareData = false;
  }
}
