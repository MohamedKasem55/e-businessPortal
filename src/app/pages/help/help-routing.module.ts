import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AskAlRajhiComponent } from './ask/ask-alrajhi.component';
import { HelpLandingComponent } from './help-landing/help-landing.component';

const routes: Routes = [
    {
      path: '',
      component: HelpLandingComponent,
    },
    {
      path: 'ask-al-rajhi',
      component: AskAlRajhiComponent,
    },
  
  ];
  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpRoutingModule {}
