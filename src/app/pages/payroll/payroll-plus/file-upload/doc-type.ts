export interface DocType {
  key: DocKey;
  value: String
}

export enum DocKey {
  REQUEST_OPEN_ACCOUNT_FILE = "RequestOpenAccount",
  PAYROLL_CARD_MIGRATION_FILE = "PayrollCardMigration",
  SALARY_FILE = "SalaryFile"
}
