import {FormModel} from '../../../../../../@core/model/dto/formModel';
import {TitleControl} from '../../../../../../@core/model/dto/control/title-control';
import { SummaryModel } from 'arb-design-library/model/summary.model';

export const getSummaryControl = () => {
  return new FormModel(
    {
      id: 'summary',
      controls: {
        pageTitle: new TitleControl({

          order: 1,
          columnCount: 12,
          controlOptions: {
            id: 'initialOfferTitle', title: 'Summary',
            type: 'Page'
          }
        }),

      }
    })
}


