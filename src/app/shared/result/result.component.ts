import {Component, Input} from '@angular/core';
import {ResultModal} from "../../@core/model/dto/result.modal";
import {ExportPDFService} from "../../@core/service/export/export-pdf-service";

@Component({
  selector: 'app-result[result]',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent {

  @Input() result!: ResultModal;

  constructor(private exportPDFService: ExportPDFService) {
  }

  export(type: String) {
    if (this.result.summary)
      this.exportPDFService.exportSummary(this.result.title, this.result.summary, type == "PRINT").subscribe();
  }
}
