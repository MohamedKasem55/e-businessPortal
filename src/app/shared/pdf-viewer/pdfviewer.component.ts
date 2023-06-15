import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdfviewer.component.html',
  styleUrls: ['./pdfviewer.component.scss']
})
export class PdfViewerAComponent {

  @Input() src: string = "";
  @Input() originalSize: boolean=true;
  @Input() renderText: boolean=true;
  @Input() rotation:number = 0
  @Input() showAll: boolean=true;
  @Input() fitToPage: boolean=true;
  @Input() zoom:number = 1
  @Input() stickToPage: boolean=true;
  @Input() externalLinkTarget:string ="blank"
  @Input() autoresize: boolean=true;
  @Input() showBorders: boolean=false;

}
