import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RepresentativesLandingComponent} from './representatives-landing/representatives-landing.component';
import {RepresentativesRoutingModule} from './representatives-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {RepresentativesService} from 'app/@core/service/representatives/representatives.service';
import {RepresentativesAddComponent} from './representatives-add/representatives-add.component';
import {RepresentativesBaseComponent} from "./representatives-base.component";

@NgModule({
  declarations: [
    RepresentativesBaseComponent,
    RepresentativesLandingComponent,
    RepresentativesAddComponent],
  imports: [
    CommonModule,
    RepresentativesRoutingModule,
    SharedModule
  ],
  providers: [
    RepresentativesService
  ],
})
export class RepresentativesModule {
}
