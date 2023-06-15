import { TitleControl } from "app/@core/model/dto/control/title-control"
import { FormModel } from "app/@core/model/dto/formModel"
import { PdfControlOptions, PdfViewerControl } from '../../../../../../@core/model/dto/control/pdfviewer-control';

export const getContractCommodityControl = (contractURL: any) => {
    return new FormModel({
        id: 'contractCommodity',
        controls: {
            pageTitle: new TitleControl({
                order: 1, columnCount: 12,
                controlOptions: { id: '', title: 'finance.execution.contractCommodity', type: 'Page' }
            }),
            pdf: new PdfViewerControl({
              columnCount: 12,
              order: 2,
              controlOptions: {
                src: contractURL,
                renderText: true,
                showAll: true,
                autoresize: true,
                zoom: 1.4,
                externalLinkTarget: contractURL
              }
            }),
        }
    })
}
