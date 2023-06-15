import {BoxModel} from 'arb-design-library/model/box.model';
import {TitleModel} from 'arb-design-library/model/title.model';
import {CompanyWorkflowTypeEnum} from "../../../@core/model/rest/company-admin/workflow/company-workflow-type-enum";
import {AuthenticationUtils} from "../../../@core/utility/authentication-utils";

export const getCompanyAdminBoxes = (): BoxModel[] => {
  let boxes: BoxModel[] = [
    {
      id: 'alrajhi-user-management',
      text: 'company-admin.user-management.title',
      subTitle: 'company-admin.user-management.sub-title',
      icon: 'arb-icon-Alrajhi',
      isDisabled: !AuthenticationUtils.hasAccess('UsersMenu'),
      isHidden: !AuthenticationUtils.serviceIsActive('UsersMenu')
    },
    {
      id: 'alrajhi-fees-managment',
      text: 'company-admin.fees.title',
      subTitle: 'company-admin.fees.sub-title',
      icon: 'arb-icon-refundDollarCircleArrow',
      isDisabled: !AuthenticationUtils.hasAccess('FeesAdminMenu'),
      isHidden: !AuthenticationUtils.serviceIsActive('FeesAdminMenu')
    },
    {
      id: 'alert-managment',
      text: 'company-admin.alert-management.alert-management-name',
      subTitle: 'company-admin.alert-management.sub-title',
      icon: 'arb-icon-bell',
      isDisabled: !AuthenticationUtils.hasAccess('AlertsAdminMenu'),
      isHidden: !AuthenticationUtils.serviceIsActive('AlertsAdminMenu')
    },
    {
      id: 'company-config',
      text: 'company-admin.company-configuration.title',
      subTitle: 'company-admin.company-configuration.sub-title',
      icon: 'arb-icon-building',
      isDisabled: !AuthenticationUtils.hasAccess('CustomProperties'),
      isHidden: !AuthenticationUtils.serviceIsActive('CustomProperties')
    },
    {
      id: 'token-managment',
      text: 'company-admin.token-management.name',
      subTitle: 'company-admin.token-management.sub-title',
      icon: 'arb-icon-tokensMedium',
      isDisabled: !AuthenticationUtils.hasAccess('TokensManagementAdmin'),
      isHidden: !AuthenticationUtils.serviceIsActive('TokensManagementAdmin')
    },
    {
      id: 'activity-logs',
      text: 'activityLogs.activitylogsTitle',
      subTitle: 'activityLogs.sub-title',
      icon: ' arb-icon-billClockMedium',
      isDisabled: !AuthenticationUtils.hasAccess('ActivityLogsAdmin'),
      isHidden: !AuthenticationUtils.serviceIsActive('ActivityLogsAdmin')
    },
    {
      id: 'update-cr',
      text: 'update-cr.title',
      subTitle: 'update-cr.subtitle',
      icon: 'arb-icon-Document-Status',
      isDisabled: !AuthenticationUtils.hasAccess('UpdateCR'),
      isHidden: !AuthenticationUtils.serviceIsActive('UpdateCR')
    },
    {
      id: 'change-qtl',
      text: 'change-qtl.title',
      subTitle: 'update-cr.subtitle',

      icon: 'arb-icon-refresh2Arrows',
      isDisabled: !AuthenticationUtils.showQTL,
      isHidden: !AuthenticationUtils.showQTL
    },
  ];
  let company: any = JSON.parse(sessionStorage.getItem("company")!);
  if (!company.companyWorkflowType||company.companyWorkflowType === CompanyWorkflowTypeEnum.WORKFLOW) {
    boxes.push({
      id: 'workflow-management',
      text: 'workflow.workflowManagement',
      subTitle: 'workflow.sub-title',

      icon: 'arb-icon-settings',
      isDisabled: !AuthenticationUtils.hasAccess('WorkflowMenu'),
      isHidden: !AuthenticationUtils.serviceIsActive('WorkflowMenu')
    })
  }
  return boxes
};


export const getCompanyTitleModel = (): TitleModel => {
  return {
    id: 'CompanyAdminTitle1',
    type: 'Page',
    title: 'Company Admin',
  };
};
