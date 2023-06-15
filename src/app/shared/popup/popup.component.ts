import {Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {FormModel} from "../../@core/model/dto/formModel";
import {PopupOutputModel} from "../../@core/model/dto/popup.model";
import {NgbModal, NgbModalConfig} from "@ng-bootstrap/ng-bootstrap";
import {PopupService} from "../../@core/service/base/popup.service";
import {NgbModalOptions} from "@ng-bootstrap/ng-bootstrap/modal/modal-config";
import {FormButtonClickOutput} from "../form/form.component";
import {AlertModel} from "../../@core/model/dto/alert.model";
import {ControlType} from "../../@core/model/dto/control/control.model";
import {TableControl} from "../../@core/model/dto/control/table-control";
import {TableButtonOutputModel} from "arb-design-library/model/table-button-output.model";


@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnChanges {

  @Input() alert?: AlertModel;
  @Input() showAlert: boolean = false;
  @Input() title?: string;
  @Input() image?: string;
  @Input() form?: FormModel;
  @Input() options?: NgbModalOptions;

  @Input() show: boolean = false;
  @Output() onButtonClick: EventEmitter<PopupOutputModel> = new EventEmitter<PopupOutputModel>();

  @ViewChild('popupModal')
  popupModal!: ElementRef;

  constructor(private modalService: NgbModal, private modalConfig: NgbModalConfig, private popupService: PopupService) {
    modalConfig.backdrop = 'static';
    modalConfig.keyboard = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.form && this.show) {

      Object.keys(this.form.controls).forEach((key: string) => {
          if (this.form?.controls[key].type == ControlType.TABLE) {
            (this.form?.controls[key] as TableControl).buttonClicked!.subscribe((res: TableButtonOutputModel)=>{
              this.onButtonClick.emit({
                buttonId: res.buttonId,
                controls: this.form!.controls,
                tableButtonOutputModel: res
              });
            })
          }
        }
      )

      this.openCentered();
    } else {
      this.modalService.dismissAll();
    }
  }

  openCentered() {
    this.modalService.open(this.popupModal, this.options);
  }

  onDismiss() {
    this.popupService.dismiss();
  }

  doPopupButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    this.onButtonClick.emit({
      buttonId: formButtonClickOutput.buttonId,
      controls: this.form!.controls
    });
  }

}
