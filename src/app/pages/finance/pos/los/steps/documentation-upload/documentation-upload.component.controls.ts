import {LineCardControl} from 'app/@core/model/dto/control/line-card-control';
import {TitleControl} from 'app/@core/model/dto/control/title-control';
import {FormModel} from 'app/@core/model/dto/formModel';

export const getDocumentationUploadControl = () => {
  return new FormModel({
    id: 'documentationUpload',
    controls: {
      pageTitle: new TitleControl({
        order: 1,
        columnCount: 12,
        controlOptions: {
          id: 'documentationUploadTitle',
          title: 'finance.pos.los.documentUploadTitle',
          type: 'Page',
        },
      }),
      requiredDocuments: new LineCardControl({
        order: 1,
        columnCount: 12,
        controlOptions: {
          title:
            'finance.pos.los.requiredDocuments',
        },
      }),
      documentationTitle: new TitleControl({
        order: 2,
        columnCount: 12,
        class: 'pt-4 pb-4',
        controlOptions: {
          id: 'documentationId',
          title: 'finance.pos.los.documentationTitle',
          type: 'Section',
        },
      }),
      documentationSubTitle: new TitleControl({
        order: 3,
        columnCount: 12,
        controlOptions: {
          id: 'documentationSubTitleId',
          subTitle: 'finance.pos.los.documentationSubTitle',
          type: 'Section',
        },
      }),
      accountStatementInfo: new LineCardControl({
        order: 8,
        columnCount: 6,
        controlOptions: {
          title:
            'finance.pos.los.accountStatementInfo',
        },
      }),
      posStatementInfo: new LineCardControl({
        order: 8,
        columnCount: 6,
        controlOptions: {
          title:
            'finance.pos.los.posStatementInfo',
        },
      }),
      documentationSubTitle2: new TitleControl({
        order: 8,
        columnCount: 12,
        controlOptions: {
          id: 'documentationSubTitleId',
          subTitle: 'finance.pos.los.documentationSubTitle2',
          type: 'Section',
        },
      }),
    },
  });
};
