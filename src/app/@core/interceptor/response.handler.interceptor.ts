import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse,} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, tap, timeout} from 'rxjs';
import {Router} from "@angular/router";
import {ResponseException} from "../service/base/responseException";
import {ErrorModalService} from "../service/base/error-modal.service";
import {LoadingService} from "../service/base/loading.service";


@Injectable()
export class ResponseHandlerInterceptor implements HttpInterceptor {


  constructor(private errorModalService: ErrorModalService,
              private router: Router,
              private loadingService: LoadingService) {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(timeout(60000)).pipe(
      tap({
        next: (next: HttpEvent<any>) => {
          try {
            if (next instanceof HttpResponse) {
              //TODO handle Responses for V2 API

              let output
              try {
                output = JSON.parse(next.body)
              } catch (e) {
                output = next.body
              }
              if (output?.errorCode === "0") {
                delete output['errorCode'];
                delete output['errorDescription'];
                delete output['errorResponse'];
                return output;
              } else if (output.errorCode && output.errorCode !== "0") {
                //handle -* ex:-1
                if (!isWhiteListError(req.url) && !req.headers.has('silentError')) {
                  this.handleErrorCodes(output)
                }
                throw new ResponseException("Error", output);
              }
            }
          } catch (e) {
            throw e;
          }
        },
        error: (error) => {
          if (!isWhiteListError(req.url) && !req.headers.has('silentError'))
            switch (error.status) {
              case 401:
                sessionStorage.clear();
                this.router.navigate(['/login']).then(r => {
                });
                break;
              case 400:
                if (error.error) {
                  const output = JSON.parse(error.error)
                  this.handleErrorCodes(output)
                } else {
                  this.handleErrorCodes({
                    errorCode: "",
                    errorDescription: "public.generalError",
                    errorResponse: {}
                  });
                }
                break;
              default:
                this.loadingService.hideLoading(req.url);
                this.handleErrorCodes({
                  errorCode: "",
                  errorDescription: "public.generalError",
                  errorResponse: {}
                });
                break;
            }
        }
      })
    )
  }

  private handleErrorCodes(output: any) {
    this.errorModalService.setMessage(output);
  }

}


export function isWhiteListError(service: string): boolean {

  const services = [
    "companyDetails/juridicalState",
  ];

  let flag = false;
  services.forEach(item => {
    if (service.includes(item)) {
      flag = true;
    }
  });
  return flag
}

