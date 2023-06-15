import {APP_INITIALIZER, ErrorHandler, Injector, NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {StoreModule} from '@ngrx/store';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {CommonModule, HashLocationStrategy, LOCATION_INITIALIZED, LocationStrategy} from "@angular/common";
import {TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {FirewallHandlerInterceptor} from "./@core/interceptor/firewall.handler.interceptor";
import {AuthHandlerInterceptor} from "./@core/interceptor/auth.handler.interceptor";
import {ResponseHandlerInterceptor} from "./@core/interceptor/response.handler.interceptor";
import {ReactiveFormsModule} from "@angular/forms";
import {ContentTypeInterceptor} from "./@core/interceptor/contenttype.interceptor";
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../environments/environment';
import {LanguageInterceptor} from "./@core/interceptor/language.interceptor";
import {SharedModule} from "./shared/shared.module";
import {VerificationService} from "./@core/service/base/verification.service";
import {CurrencyPipe} from "./@core/pipe/currency.pipe";
import {AmountPipe} from "./@core/pipe/amount.pipe";
import {LoadAfterLoginService} from "./@core/service/base/load-after-login.service";
import {PopupService} from "./@core/service/base/popup.service";
import {ServiceLocator} from "./@core/service/base/service-locator.service";
import {BreadcrumbService} from "./@core/service/base/breadcrumb.service";
import {LoadingInterceptor} from "./@core/interceptor/loading.interceptor";
import {ErrorModalService} from "./@core/service/base/error-modal.service";
import {Router} from "@angular/router";
import {LoadingService} from "./@core/service/base/loading.service";
import {AppErrorHandler} from "./@core/service/base/AppErrorHandler.service";
import {LanguageService} from "./@core/service/base/language.service";
import {NgIdleKeepaliveModule} from "@ng-idle/keepalive";
import {SessionService} from "./@core/service/base/session.service";
import {UserService} from "./@core/service/login/user.service";
import {CryptoService} from "./@core/service/base/crypto.service";
import {ExportPDFService} from "./@core/service/export/export-pdf-service";
import {BrowserModule} from "@angular/platform-browser";
import {BlobTextInterceptor} from "./@core/interceptor/blob-text.interceptor";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {PagesGuard} from "./pages/pages.guard";
import {HoldingCompanyService} from "./@core/service/holding-company/holding-company.service";
import {SubsidiaryService} from "./@core/service/base/subsidiaryService";
import {UserManagementService} from "./@core/service/company-admin/user-management/users-managment.service";
import {NgbPopoverModule} from "@ng-bootstrap/ng-bootstrap";


export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    NoopAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbPopoverModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (httpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    NgIdleKeepaliveModule.forRoot(),
    StoreModule.forRoot({}, {}),
    SharedModule,
    AppRoutingModule,
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
  ],
  declarations: [
    AppComponent,
    CurrencyPipe,
    AmountPipe
  ],
  providers: [
    PagesGuard,
    HoldingCompanyService,
    SubsidiaryService,
    UserManagementService,
    ServiceLocator,
    BreadcrumbService,
    VerificationService,
    PopupService,
    UserService,
    CryptoService,
    SessionService,
    LoadAfterLoginService,
    CurrencyPipe,
    AmountPipe,
    ExportPDFService,
    {
      provide: APP_INITIALIZER,
      useFactory: ApplicationInitializerFactory,
      deps: [LanguageService, Injector],
      multi: true
    },
    {
      provide: 'CURRENCY_PIPE',
      useClass: CurrencyPipe
    },
    {
      provide: 'EXPORT_PDF',
      useClass: ExportPDFService
    },
    {
      provide: 'AMOUNT_PIPE',
      useClass: AmountPipe,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FirewallHandlerInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHandlerInterceptor,
      multi: true,
    }, {
      provide: HTTP_INTERCEPTORS,
      useClass: ResponseHandlerInterceptor,
      multi: true,
      deps: [ErrorModalService, Router, LoadingService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ContentTypeInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LanguageInterceptor,
      multi: true,
      deps: [TranslateService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BlobTextInterceptor,
      multi: true,
      deps: [ErrorModalService]
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
      deps: [LoadingService]
    },
    {
      provide: ErrorHandler, useClass: AppErrorHandler
    }

  ],
  bootstrap: [AppComponent],
  exports: [TranslateModule]
})
export class AppModule {
  constructor(private injector: Injector) {
    ServiceLocator.injector = this.injector;
  }
}

export function ApplicationInitializerFactory(
  lang: LanguageService, injector: Injector) {
  return async () => {
    await injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    try {
      await lang.setLang(null);
      return;
    } catch (err) {
      console.log("Error on load translation files");
      console.log(err);
    }
  };
}
