export interface ValidateETradeWorkflowReq {
  batchList: CompanyETradeFunction[];
}

export interface CompanyETradeFunction {
  companyEtradeFunctionsPk: number;
  etradeFunction: ETradeFunction;
  limit: number;
  companyEtradeWorkflows: CompanyETradeWorkflow[];
}
export interface ETradeFunction {
  etradeFunctionPk: number;
  functionId: string;
  active: boolean;
  descriptionAr: string;
  descriptionEn: string;
  status: string;
  process: string;
}

export interface CompanyETradeWorkflow {
  companyEtradeWorkflowPk: number;
  amount: number;
  level: number;
}
