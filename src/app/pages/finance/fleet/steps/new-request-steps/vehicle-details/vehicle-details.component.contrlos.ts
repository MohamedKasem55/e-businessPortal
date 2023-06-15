import {FormModel} from '../../../../../../@core/model/dto/formModel';
import {TitleControl} from '../../../../../../@core/model/dto/control/title-control';
import {LineCardControl} from '../../../../../../@core/model/dto/control/line-card-control';
import {ProgressControl} from '../../../../../../@core/model/dto/control/progress-control';
import {TableControl} from '../../../../../../@core/model/dto/control/table-control';
import {externalData, externalQutationTableHeader} from '../data.controls';


export function vehicleDetailsForm(): FormModel {
  return new FormModel({
    id: 'newRequestForm',
    controls: {
      "vehicleDetailsTitle": new TitleControl({
        columnCount: 12,
        order: 1,
        class: "mt-4 mb-4",
        controlOptions: {
          title: 'finance.fleet.vehicleDetails',
          type: 'Section', id: "",
          subTitle: 'finance.fleet.requests.initialOfferSubTitle'

        },
      }),

      "uploadExternalquotationLineCard": new LineCardControl({
        columnCount: 6,
        order: 2,
        class: "mb-4",
        controlOptions: {
          title: 'finance.fleet.requests.uploadExternalQuotation',
          subTitle: 'finance.fleet.requests.externalQuotationDescription',
          rightIcon: 'arb-icon-chevronRight',
          hasBackground: true,
          avatar: {type: "ico", value: 'arb-icon-arrowUpLine'},
        }
      }),

      "uploadInternalquotationLineCard": new LineCardControl({
        columnCount: 6,
        order: 3,

        controlOptions: {
          title: 'finance.fleet.requests.addInternalQuotation',
          subTitle: 'finance.fleet.requests.addInternalQuotationDescription',
          rightIcon: 'arb-icon-chevronRight',
          hasBackground: true,
          avatar: {type: "ico", value: 'arb-icon-arrowUpLine'}
        }
      }),


      "exQuotationTableTitle": new ProgressControl({
        columnCount: 12,
        order: 4,
        class: 'mb-3',
        controlOptions: {
          title:"finance.fleet.requests.financeEligibilityLimit",
          textEnd:"",
          textBottomEnd:"",
          progress:30,
          progressMax:100
        },
      }),

      "externalQuotationTable": new TableControl({
        columnCount: 12,
        order: 5,
        class: "mb-4",
        controlOptions: {
          headers: externalQutationTableHeader(),
          paginationValue: {page: 1, size: 10},
          data: [],
          showSearch: false,
          columnId: 'externalQutation'
        },
      }),

      "inQuotationTableTitle": new TitleControl({
        columnCount: 12,
        order: 6,
        class: 'mb-3',
        controlOptions: {
          title: 'finance.fleet.requests.internalQuotation',
          type: 'Section', id: "",
        },
      }),

      "internalQuotationTable": new TableControl({
        columnCount: 12,
        order: 7,
        controlOptions: {
          headers: externalQutationTableHeader(),
          paginationValue: {page: 1, size: 10},
          data: externalData(),
          showSearch: false,
          columnId: 'internalQutation'
        },
      }),

    }
  });
}


