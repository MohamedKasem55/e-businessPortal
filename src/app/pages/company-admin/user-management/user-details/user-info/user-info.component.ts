import {Component, Input, OnChanges, SimpleChanges} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {UserDetailsRes} from "app/@core/model/rest/company-admin/user-details/user-details-res";
import {ModelAndListService} from "app/@core/service/base/modelAndList.service";

import moment from 'moment';
import {ExecutionType} from "../user-main/user-main.controls";
import {DatePipe} from "@angular/common";
import {SummaryItemModel} from "arb-design-library/model/summary-item.model";
import {TitleModel} from "arb-design-library/model/title.model";
import {SummarySectionModel} from "arb-design-library/model/summary-section.model";
import {
  CompanyWorkflowTypeEnum
} from "../../../../../@core/model/rest/company-admin/workflow/company-workflow-type-enum";

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html'
})
export class UserInfoComponent implements OnChanges {


  @Input() userDetails!: UserDetailsRes;
  @Input() editMode?: ExecutionType = ExecutionType.VIEW;
  @Input() workFlowType!: CompanyWorkflowTypeEnum;


  summaryPersonalInfo: SummaryItemModel[] = [];
  summaryContactInfo: SummaryItemModel[] = [];
  summaryAccessInfo: SummaryItemModel[] = [];
  summarySecurity: SummaryItemModel[] = [];


  personalInfoTitle: TitleModel = {id: "2", type: 'Section', title: "company-admin.user-info.personalInfo"};
  infoSection: SummarySectionModel = {items: this.summaryPersonalInfo, title: this.personalInfoTitle};

  contactInfoTitle: TitleModel = {id: "3", type: 'Section', title: "company-admin.user-info.contactInfo"};
  contactSection: SummarySectionModel = {items: this.summaryContactInfo, title: this.contactInfoTitle};

  accessTitle: TitleModel = {id: "4", type: 'Section', title: "company-admin.user-info.accessTime"};
  accessSection: SummarySectionModel = {items: this.summaryAccessInfo, title: this.accessTitle};

  securityTitle: TitleModel = {id: "5", type: 'Section', title: "company-admin.user-info.securityMethod"};
  securitySection: SummarySectionModel = {items: this.summarySecurity, title: this.securityTitle};

  userType: any;
  userStatus: any;
  lockBoxFeesStatus: any;
  process: any;
  languages: any;
  nationalityCode: any;
  companyUserGroups: any;
  authenticationMethod: any;
  sections: SummarySectionModel[] = [];

  constructor(private translate: TranslateService,
              private datePipe: DatePipe,
              private modelAndListService: ModelAndListService) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.userDetails)
      this.getStaticModels()
  }


  private getStaticModels() {
    this.modelAndListService.getList([
      "userType",
      "userStatus",
      "lockBoxFeesStatus",
      "process",
      "companyUserGroups",
      "languages",
      "nationalityCode"
    ]).subscribe((models) => {
      this.userType = models.userType
      this.userStatus = models.userStatus
      this.lockBoxFeesStatus = models.lockBoxFeesStatus
      this.process = models.process;
      this.companyUserGroups = models.companyUserGroups;
      this.nationalityCode = models.nationalityCode;
      this.languages = models.languages;
      this.setSummary()

    })
  }

  private setSummary() {
    if (this.workFlowType === CompanyWorkflowTypeEnum.MAKER_CHECKER) {
      let items = []
      if (this.userDetails.companyUserDetails.maker) {
        items.push({title: "  ", subTitle: 'company-admin.user-info.maker'})
      }
      if (this.userDetails.companyUserDetails.checker) {
        items.push({title: "  ", subTitle: 'company-admin.user-info.checker'})
      }
      if (items.length > 0) {
        this.sections.push({
            title: {
              id: "userType",
              type: 'Section',
              title: 'company-admin.user-info.workflow-type',
            },
            items: items
          }
        )
      }
    }
    this.summaryPersonalInfo.push(
      {title: "company-admin.user-info.name", subTitle: this.userDetails.companyUserDetails!.userName},
      {title: "company-admin.user-info.userNameArabic", subTitle: this.userDetails.companyUserDetails!.userNameArabic},
      {title: "company-admin.user-info.nickname", subTitle: this.userDetails.companyUserDetails!.nickname},
      {title: "company-admin.user-info.loginId", subTitle: this.userDetails.companyUserDetails!.userId},
      {title: "company-admin.user-info.EmpCompID", subTitle: this.userDetails.companyUserDetails!.empRef},
      {title: "company-admin.user-info.userType", subTitle: this.userType[this.userDetails.companyUserDetails!.type]},
      {title: "company-admin.user-info.nationalIDNum", subTitle: this.userDetails.companyUserDetails!.idIqama},
      {title: "company-admin.user-info.nationalIdExpiry", subTitle: this.userDetails.companyUserDetails!.natIDExpiry},
      {title: "company-admin.user-info.department", subTitle: this.userDetails.companyUserDetails!.department},
      {title: "company-admin.user-info.city", subTitle: this.userDetails.companyUserDetails!.city},
      {title: "company-admin.user-info.region", subTitle: this.userDetails.companyUserDetails!.region},
      {title: "company-admin.user-info.birthdate", subTitle: this.userDetails.companyUserDetails!.birthDate},
      {
        title: "company-admin.user-info.nationality",
        subTitle: this.nationalityCode[this.userDetails.companyUserDetails!.nationality]
      },
      {
        title: "company-admin.user-info.lang",
        subTitle: this.languages[this.userDetails.companyUserDetails!.preferedLanguage]
      },
      {
        title: "company-admin.user-info.status",
        subTitle: this.userStatus[this.userDetails.companyUserDetails!.status]
      });

    this.summaryContactInfo.push(
      {title: "company-admin.user-info.mobNum", subTitle: this.userDetails.companyUserDetails!.mobile},
      {title: "company-admin.user-info.secondMobNum", subTitle: this.userDetails.companyUserDetails!.secondMobile},
      {title: "company-admin.user-info.email", subTitle: this.userDetails.companyUserDetails!.email},
      {title: "company-admin.user-info.secEmail", subTitle: this.userDetails.companyUserDetails!.secondEmail},
      {title: "company-admin.user-info.facebook", subTitle: this.userDetails.companyUserDetails!.socialFacebook},
      {title: "company-admin.user-info.instagram", subTitle: this.userDetails.companyUserDetails!.socialInstagram},
      {title: "company-admin.user-info.twitter", subTitle: this.userDetails.companyUserDetails!.socialTwitter},
      {title: "company-admin.user-info.linkedIn", subTitle: this.userDetails.companyUserDetails!.socialLinkedin}
    );

    let daysOfWeek: string = "";
    if (this.userDetails.companyUserDetails!.daysOfWeek) {
      this.userDetails.companyUserDetails!.daysOfWeek.sort((a, b)=>{return a.dayValue-b.dayValue})
      this.userDetails.companyUserDetails!.daysOfWeek.forEach((day: any, index: any) => {
        daysOfWeek += this.translate.instant('public.day.' + day.dayValue);
        daysOfWeek += (index === this.userDetails.companyUserDetails!.daysOfWeek.length - 1) ? "" : ", ";

      })
    }
    this.summaryAccessInfo.push(
      {
        title: "company-admin.user-info.fromTime",
        subTitle: (this.userDetails.companyUserDetails!.accessFrom) ?
          this.datePipe.transform('2030-05-5 ' + this.userDetails.companyUserDetails!.accessFrom, 'HH:mm')! : ""
      },
      {
        title: "company-admin.user-info.toTime",
        subTitle: (this.userDetails.companyUserDetails!.accessTo) ?
          this.datePipe.transform('2030-05-5 ' + this.userDetails.companyUserDetails!.accessTo, 'HH:mm')! : ''
      },
      {title: "company-admin.user-info.days", subTitle: daysOfWeek});

    this.summarySecurity.push(
      {
        title: "company-admin.user-info.method",
        subTitle: "company-admin.user-details." + this.userDetails.companyUserDetails!.authenticationMethod
      },
      {title: "company-admin.user-info.createdBy", subTitle: this.userDetails.companyUserDetails!.createdBy},
      {title: "company-admin.user-info.approvedBy", subTitle: ""});

    this.sections.push(this.infoSection, this.contactSection, this.accessSection, this.securitySection)
  }
}
