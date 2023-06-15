import { ControlBase, ControlOptions, ControlType } from "./control.model";

export class PdfViewerControl extends ControlBase<null> {
  override controlType = ControlType.PDF_VIEWER;
  override controlOptions!: PdfOptionsModel;

  constructor(options: PdfControlOptions) {
    super(options);
  }
}


export class PdfControlOptions extends ControlOptions<null> {
  override controlOptions!: PdfOptionsModel
}

export interface PdfOptionsModel {
  src: string
  originalSize?: boolean
  renderText?: boolean
  rotation?:number
  showAll?: boolean
  fitToPage?: boolean
  zoom?:number
  stickToPage?: boolean
  externalLinkTarget?:string
  autoresize?: boolean
  showBorders?: boolean
}


