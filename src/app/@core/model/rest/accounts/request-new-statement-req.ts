export class RequestNewStatementReq {
  accountNumber!: string;
  amountFrom?: string | null;
  amountTo?: string | null;
  dateFrom?: string;
  dateTo?: string;
  language!: string;
  type!: "X" | "P";
  typeTransaction!: number;
  filterBySelected?: any[];
}

//"2023-01-03"
