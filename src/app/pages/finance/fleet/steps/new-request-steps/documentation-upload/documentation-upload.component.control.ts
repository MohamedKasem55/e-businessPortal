import {FormModel} from '../../../../../../@core/model/dto/formModel';
import {TitleControl} from '../../../../../../@core/model/dto/control/title-control';
import {LineCardControl} from '../../../../../../@core/model/dto/control/line-card-control';


export const documentationUploadControl = () => {
  return new FormModel({
    id: 'DocumentationUploadForm',
    controls: {
      fleetFinance: new TitleControl({
        columnCount: 12,
        order: 1,
        class: "pb-3",
        controlOptions: {
          id: "business-cards-details-title",
          title: 'finance.products.fleet',
          type: 'Page'
        }
      }),
      "bankDocs": new TitleControl({
        columnCount: 12,
        order: 2,
        controlOptions: {
          id: "business-cards-details-title",
          title: 'finance.fleet.requests.BankDocumentationUpload',
          type: 'Section'
        }
      }),
      "requiredInfo": new LineCardControl({
        columnCount: 12,
        order: 3,
        controlOptions: {
          title: 'finance.fleet.requests.documentationUploadNote',
          icon: "arb-icon-exclamationBorder"
        }
      }),
      "docsUpload": new TitleControl({
        columnCount: 12,
        order: 4,
        class: "pb-3",
        controlOptions: {
          id: "business-cards-details-title",
          title: 'finance.fleet.requests.DocumentationUpload',
          type: 'Section'
        }
      }),

    }
  })
}
