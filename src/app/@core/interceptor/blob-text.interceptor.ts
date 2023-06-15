import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {ResponseException} from "../service/base/responseException";
import {ErrorModalService} from "../service/base/error-modal.service";

@Injectable()
export class BlobTextInterceptor implements HttpInterceptor {

  constructor(private errorModalService: ErrorModalService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap({
        next: async (next: HttpEvent<any>) => {
          try {
            if (next instanceof HttpResponse) {
              let output
              try {
                output = JSON.parse(next.body)
              } catch (e) {
                output = next.body
              }
              if (output instanceof Blob && output.type === "text/xml") {
                output.text().then((text) => {
                  const error = JSON.parse(text);
                  this.handleErrorCodes(error)
                  throw new ResponseException("Error", error);
                });

              }
            }
          } catch (e) {
            throw e;
          }
        }
      })
    )
  }

  private handleErrorCodes(output: any) {
    this.errorModalService.setMessage(output);
  }

}
