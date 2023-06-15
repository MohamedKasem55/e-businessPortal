import {HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest,} from '@angular/common/http'
import {Observable} from 'rxjs'
import {Injectable} from "@angular/core";

@Injectable()
export class AuthHandlerInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<HttpEventType.Response>> {
    const token = sessionStorage.getItem("token")

    let authReq = req
    if (token) {
      const newHeaders = req.headers.set('Authorization', `Bearer ${token}`)
      authReq = req.clone({
        headers: newHeaders,
      })
    }
    return next.handle(authReq)
  }
}
