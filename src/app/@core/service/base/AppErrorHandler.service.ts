import {ErrorHandler, Injectable} from "@angular/core";

@Injectable()
export class AppErrorHandler implements ErrorHandler {

  public handleError(error: any) {

      // if(!error.ErrorResponse) {
      console.log("App Error: ");
      console.log(error);
      // }
  }
}
