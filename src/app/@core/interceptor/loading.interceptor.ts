import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, timeout} from 'rxjs';
import {tap} from 'rxjs/operators';
import {LoadingService} from "../service/base/loading.service";

@Injectable({providedIn: 'root'})
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingService) {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {

    if (req.headers.getAll("hideLoading")) {
      if (req.headers.getAll("hideLoading")![0] == "true") {
        req.headers.delete("hideLoading");
      } else {
        this.loadingService.showLoading(req.url);
      }
    } else {
      this.loadingService.showLoading(req.url);
    }

    return next.handle(req).pipe(timeout(60000)).pipe(
      tap({
        next: (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this.loadingService.hideLoading(req.url);
          }
        },
        error: (err: any) => {
          if (err instanceof HttpErrorResponse) {
            this.loadingService.hideLoading(req.url);
          }
        }
      }));
  }
}



