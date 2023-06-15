import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FinancialProductsService } from 'app/@core/service/financial-products/financial-products.service';


import { SharedModule } from '../../shared/shared.module';
import { ContactRequestComponent } from './contact-request/contact-request.component';
import { FinancialProductsRoutingModule } from './financial-products-routing.module';
import { ProductsComponent } from './products/products.component';

@NgModule({
  declarations: [
    ProductsComponent,
    ContactRequestComponent
  ],
  imports: [CommonModule, FinancialProductsRoutingModule, SharedModule],
  providers: [
    FinancialProductsService
  ],
})
export class FinancialProductsModule {}
