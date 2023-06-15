import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ErrorModalService} from "../../@core/service/base/error-modal.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ErrorBaseResponse} from "../../@core/model/rest/common/base-response";
import {NgbModalOptions} from "@ng-bootstrap/ng-bootstrap/modal/modal-config";

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html'
})
export class ErrorModalComponent implements OnInit {
  @ViewChild('errorModal')
  modal!: TemplateRef<any>;
  errorResponse!: ErrorBaseResponse;
  date = new Date();

  constructor(private errorModalService: ErrorModalService, private modalService: NgbModal) {
    this.onError();
  }

  ngOnInit(): void {
  }

  onError() {
    this.errorModalService.onMessage().subscribe((message: ErrorBaseResponse) => {
        this.errorResponse = message;
        let conf: NgbModalOptions= {
          size:"lg",
          centered:true,
          animation:true
        }
        this.modalService.open(this.modal,conf)
      }
    )
  }

}
