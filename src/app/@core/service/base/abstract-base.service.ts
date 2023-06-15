import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {ServiceLocator} from "./service-locator.service";
import {map} from "rxjs/operators";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractBaseService {
  protected baseUrl = environment.baseUrl
  protected bfmBaseUrl = environment.bfmUrl;
  protected appContext = environment.serviceContext;
  protected documentContext = environment.documentContext;
  protected hubContext = environment.businessHubContext;

  protected http: HttpClient = ServiceLocator.injector.get(HttpClient);
  protected router: Router = ServiceLocator.injector.get(Router);

  constructor() {
  }

  public setAppContext(value: any) {
    sessionStorage.setItem("Environment", JSON.stringify(value));
  }


  protected get(url: string, options?: RequestOption): Observable<any> {
    return this.http.get(this.getContext(options) + url, this.getRequestOptions(options));
  }

  protected post(url: string, body: any, options?: RequestOption): Observable<any> {
    return this.http.post(this.getContext(options) + url, body, this.getRequestOptions(options));
  }

  protected put(url: string,
                body: any,
                options?: RequestOption): Observable<any> {
    return this.http.put(this.getContext(options) + url, body, this.getRequestOptions(options))
  }

  protected delete(url: string, body: any, options?: RequestOption): Observable<any> {
    return this.http.delete(this.getContext(options) + url, {body});
  }

  private getContext(requestOption: RequestOption | undefined): string {

    let appContext = this.appContext;
    let baseUrl = this.baseUrl;
    if (sessionStorage.getItem("Environment")) {
      let environment = JSON.parse(sessionStorage.getItem("Environment")!);
      appContext = environment ? environment.serviceContext : this.appContext;
      baseUrl = environment ? environment.baseUrl : this.baseUrl;
    }

    if (requestOption?.contextPath) {
      switch (requestOption?.contextPath) {
        case ContextPath.BUSINESS_HUB_CONTEXT:
          return baseUrl + appContext + this.hubContext;
        case ContextPath.DOCUMENT_CONTEXT:
          return baseUrl + this.documentContext;
        case ContextPath.BFM_CONTEXT:
          return this.bfmBaseUrl;
      }
    } else {
      return baseUrl + appContext;
    }
  }


  protected getFile(name: string, url: string = 'template/download', isOpen?: boolean, options?: RequestOption) {
    const output = {file: new Blob(), fileName: ''}
    const data = {name: name}
    options = {...options, ...{responseType: 'blob'}}
    return this.post(url, data, options)
      .pipe(map((res) => {
        output.file = res;
        output.fileName = data.name;
        return output;
      })).subscribe({
        next: (res) => {
          if (!isOpen) {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(res.file);
            link.download = res.fileName;
            link.click();
            link.remove();
          } else {
            const fileURL = URL.createObjectURL(res.file);
            window.open(fileURL, '_blank');
          }
        },
        error: () => {
        }
      })
  }

  private getRequestOptions(requestOption: RequestOption | undefined): any {
    if (!requestOption) {
      requestOption = {};
    }

    if (!requestOption.customHeaders) {
      if (requestOption.hideLoader && requestOption.silentError) {
        requestOption.customHeaders = new HttpHeaders().set("hideLoading", "true").set("silentError", "true")
      } else {
        if (requestOption.hideLoader) {
          requestOption.customHeaders = new HttpHeaders().set("hideLoading", "true")
        }
        if (requestOption.silentError) {
          requestOption.customHeaders = new HttpHeaders().set("silentError", "true")
        }
      }
    } else {
      if (requestOption.hideLoader) {
        requestOption.customHeaders.append("hideLoading", "true");
      }

      if (requestOption.silentError) {
        requestOption.customHeaders.append("silentError", "true");
      }
    }

    let headers: HttpHeaders = requestOption.customHeaders || new HttpHeaders();
    let params: HttpParams = requestOption.requestParams ? requestOption.requestParams : new HttpParams();
    let responseType: string = requestOption.responseType ? requestOption?.responseType : '';
    return {headers, params, responseType};

  }
}

export interface RequestOption {
  requestParams?: HttpParams;
  customHeaders?: HttpHeaders;
  contextPath?: ContextPath;
  responseType?: string,
  hideLoader?: boolean,
  silentError?: boolean
}

export enum ContextPath {
  DOCUMENT_CONTEXT = "DOCUMENT_CONTEXT",
  BUSINESS_HUB_CONTEXT = "BUSINESS_HUB_CONTEXT",
  BFM_CONTEXT = "BFM_CONTEXT",
}
