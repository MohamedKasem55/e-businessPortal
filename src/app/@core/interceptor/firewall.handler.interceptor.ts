import {HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http'
import {Observable, tap} from 'rxjs'
import {Injectable} from "@angular/core";

@Injectable()
export class FirewallHandlerInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<HttpEventType.Response>> {
    return next.handle(req).pipe(
      tap({
        next: (next: HttpEvent<any>) => {
          if (next && next instanceof HttpResponse) {
            if (next.headers) {
              const contentType = next.headers.get('Content-Type');
              if (contentType &&
                (contentType?.indexOf('text/html') !== -1 || contentType?.indexOf('application/html') >= 0)) {
                //TODO handle firewall response
                if (next.body.includes('Your Support ID:')) {

                } else {
                }
              }
            }
          }
        }
      })
    )
  }
}
