import {Injectable} from '@angular/core';
import {AbstractBaseService, ContextPath, RequestOption} from "../base/abstract-base.service";
import {ContactUsReq} from "../../model/rest/contactus/contact-us-req";
import {ContactUsConstants} from "./contact-us-urls";

@Injectable()
export class PreLoginService extends AbstractBaseService {

  sendMessage(contactUs: ContactUsReq) {
    return this.post(ContactUsConstants.CONTACT_US, contactUs,{silentError:true});
  }

  getDocument(fileName: string) {
    const options: RequestOption = {contextPath: ContextPath.DOCUMENT_CONTEXT}
    this.getFile(fileName,fileName,true, options)
  }
}
