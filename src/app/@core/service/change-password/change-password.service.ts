import {Injectable} from "@angular/core";
import {AbstractBaseService} from "../base/abstract-base.service";
import {CryptoService} from "../base/crypto.service";
import {Observable} from "rxjs";


@Injectable()
export class ChangePasswordService extends AbstractBaseService {

  constructor(private cryptoService: CryptoService) {
    super();
  }

  changePassword(details: any): Observable<null> {
    details.oldPassword = this.cryptoService.encryptRSA(details.oldPassword);
    details.password = this.cryptoService.encryptRSA(details.password);
    return this.post('userProfile/updatePassword', details);
  }
}







