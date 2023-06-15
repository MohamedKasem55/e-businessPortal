export interface companyWorkFlowTypeModel {
    key: string,
    location: string,
    name: string,
    props: props

}

export interface props {
   [key:string]:string;
}


export interface CompanyParametersReq {
  resetPasswordPushNotification?: boolean;
  vatNumber: number;
  companyWorkflowType?: string;
}
