import {CommonModule} from "@angular/common";
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbAccordionModule, NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {StoreModule} from "@ngrx/store";
import {TranslateModule} from "@ngx-translate/core";
import {StatusPipe} from 'app/@core/pipe/status-pipe';
import {ArbDesignLibraryModule} from "arb-design-library";  
import {NgChartsModule} from "ng2-charts";
import {PdfViewerModule} from 'ng2-pdf-viewer'; // Import `PdfViewerModule`.
import {HijriDateFormatPipe} from "../@core/pipe/hijra-date-format-pipe";
import {ModelPipe} from "../@core/pipe/model.pipe";
import {AccountsCommonService} from "../@core/service/accounts/accounts-common.service";
import {ValidationService } from "../@core/service/base/validation-service";
import {
  AccountsPresentationWrapperComponent
} from './accounts-presentation-wrapper/accounts-presentation-wrapper.component';
import {ChartComponent} from './chart/chart.component';
import {ErrorModalComponent} from './error-modal/error-modal.component';
import {FormComponent} from './form/form.component';
import {VerificationComponent} from './otp/verification.component';
import {PdfViewerAComponent} from "./pdf-viewer/pdfviewer.component";
import {PopupComponent} from './popup/popup.component';
import {ResultComponent} from './result/result.component';
import {SelfOnBoardingLandingComponent} from './self-on-boarding-landing/self-on-boarding-landing.component';
import {sharedReducer} from "./store/shared.reducer";
import {TransactionFollowComponent} from "./transaction-follow/transaction-follow.component";
import {ThemeModule, lightTheme, darkTheme} from '../theme';
import {ModalWrapperComponent} from './modal-wrapper/modal-wrapper.component';
import {SharedStoreFactoryService} from './store/shared-store-factory.service';
import {DashboardService} from "app/@core/service/dashboard/dashboard.service";
import {PendingActionsService} from "app/@core/service/pending-actions/pending-actions-service";
import {PendingActionFactory} from "app/@core/service/base/pending-action-factory.service";
import {HelpWizardComponent} from "./help-wizerd/help-wizard.component";
import { CardStatusPipe } from "app/@core/pipe/card-status-pipe";
import { ReviewComponent } from "./review/review.component";

@NgModule({
  declarations: [
    ResultComponent,
    FormComponent,
    TransactionFollowComponent,
    VerificationComponent,
    ErrorModalComponent,
    PopupComponent,
    ModelPipe,
    ChartComponent,
    AccountsPresentationWrapperComponent,
    StatusPipe,
    CardStatusPipe,
    SelfOnBoardingLandingComponent,
    HijriDateFormatPipe,
    PdfViewerAComponent,
    ModalWrapperComponent,
    HelpWizardComponent,
    ReviewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ArbDesignLibraryModule,
    NgChartsModule,
    NgbAccordionModule,
    ThemeModule.forRoot({
      themes: [lightTheme, darkTheme],
      active: 'light'
    }),
    PdfViewerModule,
    StoreModule.forFeature('shared', sharedReducer),
  ],
  exports: [
    ResultComponent,
    FormComponent,
    TransactionFollowComponent,
    TranslateModule,
    VerificationComponent,
    PopupComponent,
    ArbDesignLibraryModule,
    ThemeModule,
    ErrorModalComponent,
    ModelPipe,
    ChartComponent,
    ModalWrapperComponent,
    AccountsPresentationWrapperComponent,
    StatusPipe,
    CardStatusPipe,
    SelfOnBoardingLandingComponent,
    HijriDateFormatPipe,
    PdfViewerAComponent,
    HelpWizardComponent,
  ],
  providers: [
    ValidationService,
    NgbActiveModal,
    AccountsCommonService,
    StatusPipe,
    CardStatusPipe,
    HijriDateFormatPipe,
    SharedStoreFactoryService,
    DashboardService,
    PendingActionsService,
    PendingActionFactory,
  ]
})
export class SharedModule {
}
