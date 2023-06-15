import {Injectable} from '@angular/core';
import {AbstractBaseService} from "../../base/abstract-base.service";
import {Observable} from "rxjs";
import {Constants} from "./ips-service-urls";
import {ParticipantBankResModel} from "../../../model/rest/transfer/IPS/participant-bank-res..model";

@Injectable()
export class IPSTransferService extends AbstractBaseService {


  getIPSConfig() {
    return this.get(Constants.IPS_QUICK_TRANSFER);
  }

  getParticipantBank(): Observable<ParticipantBankResModel> {
    return this.get(Constants.IPS_PARTICIPANT_BANKS);
  }
}
