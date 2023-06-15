export interface BillDeleteReq {
  billsToDelete:BillsToDelete[]
}
export interface BillsToDelete{
  billCode:string;
  billCodeSelected:string;
  billReference:number;
}
