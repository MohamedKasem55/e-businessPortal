import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChequesComponent} from "./landing/cheques.component";
import {CreateNewChequeComponent} from "./create-new-cheque/create-new-cheque.component";
import {StopChequeComponent} from "./stop-cheque/stop-cheque.component";
import {ChequesUserApprovalComponent} from "./cheques-user-approval/cheques-user-approval.component";

const routes: Routes = [
  {
    path: "",
    component: ChequesComponent
  },
  {
    path: "create",
    component: CreateNewChequeComponent
  },
  {
    path: "delete",
    component: StopChequeComponent
  },
  {
    path: "request-status",
    component: ChequesUserApprovalComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChequesRoutingModule {
}
