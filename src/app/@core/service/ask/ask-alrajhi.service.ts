import { Injectable } from '@angular/core';
import { AbstractBaseService } from "../base/abstract-base.service";
import { AskAlRajhiConstants } from './ask-alrajhi.urls';
import { Observable } from "rxjs";
import { serviceAndProblemModel } from 'app/@core/model/rest/ask/ask-alrajhi/service-problem-res.model';
import { askAlRajhiResModel } from 'app/@core/model/rest/ask/ask-alrajhi/ask-alrajhi-res.model';

@Injectable()
export class AskAlRajhiService extends AbstractBaseService {

    getServiceAndProblemList(req: any): Observable<serviceAndProblemModel[]> {
        const data = { names: req }
        return this.post(AskAlRajhiConstants.SERVICE_PROBLEM, data);
    }

    submitData(req: any): Observable<askAlRajhiResModel[]> {
        return this.post(AskAlRajhiConstants.ASK_SUBMIT, req);
    }
}
