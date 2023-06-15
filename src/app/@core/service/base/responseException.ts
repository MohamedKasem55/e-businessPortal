import {ErrorBaseResponse} from "../../model/rest/common/base-response";

export class ResponseException extends Error {
  ErrorResponse: ErrorBaseResponse

  constructor(message: string, ErrorResponse: ErrorBaseResponse) {
    super(message);
    this.ErrorResponse = ErrorResponse
  }
}


