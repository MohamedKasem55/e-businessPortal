import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RepresentativesAddComponent } from './representatives-add/representatives-add.component';
import { RepresentativesLandingComponent } from './representatives-landing/representatives-landing.component';
import {PagesGuard} from "../pages.guard";

const routes: Routes = [
  {
    path: '',
    component: RepresentativesLandingComponent,
  },
  {
    path: 'addRepresentative',
    component: RepresentativesAddComponent,
    canActivate: [PagesGuard],
    data: {service: 'RepresentativesManagement'},
  },
  {
    path: 'representativeDetail',
    component: RepresentativesAddComponent,
    canActivate: [PagesGuard],
    data: {service: 'RepresentativesManagement'},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RepresentativesRoutingModule {}
