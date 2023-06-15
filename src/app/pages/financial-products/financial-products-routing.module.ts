import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactRequestComponent } from './contact-request/contact-request.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
  },
  {
    path: 'contact-request',
    component: ContactRequestComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialProductsRoutingModule {}
