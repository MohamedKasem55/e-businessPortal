import { FormModel } from '../../../../@core/model/dto/formModel';
import { TitleControl } from '../../../../@core/model/dto/control/title-control';
import { DividerControl } from '../../../../@core/model/dto/control/divider-control';
import { TextControl } from '../../../../@core/model/dto/control/text-control';
import { EmptyControl } from '../../../../@core/model/dto/control/empty-control';
import { SelectionControl } from '../../../../@core/model/dto/control/selection-control';
import { ImageControl } from '../../../../@core/model/dto/control/image-control';
import { RequestService } from '../../../../@core/service/finance/request/request.service';

export const requiredDocForm = (
  image: string,
  productName: string,
  desc: string,
  productCode: string,
  amount: string,
  requestService:RequestService
) => {
  return new FormModel({
    id: 'RequiredDocsForm',
    controls: {
      fleetFinance: new TitleControl({
        columnCount: 8,
        order: 1,
        controlOptions: {
          id: 'business-cards-details-title',
          title: productName,
          type: 'Section',
        },
      }),
      requiredDocs: new TitleControl({
        columnCount: 4,
        order: 2,
        controlOptions: {
          id: 'business-cards-details-title',
          title: 'Required Documents',
        },
      }),
      divider: new DividerControl({
        columnCount: 8,
        order: 3,
      }),

      dividerSec: new DividerControl({
        columnCount: 4,
        order: 4,
      }),
      image: new ImageControl({
        columnCount: 8,
        order: 5,

        controlOptions: {
          class: '',
          src: image,
        },
      }),

      amount: new TextControl({
        order: 13,
        columnCount: 8,
        label: amount,
        hidden: productCode != 'FLEET_FINANCE_COMMERCIAL_VEHICLE',
        class: ' color-arb-primaryText',
      }),
      title5: new TextControl({
        order: 13,
        columnCount: 8,
        label: desc,
        class: ' color-arb-primaryText',
      }),
      termsAndConditions: new SelectionControl({
        order: 14,
        columnCount: 8,
        controlOptions: {
          title: [
            {
              text: 'finance.fleet.newRequest.iAgreeWith',
            },
            {
              text: 'finance.fleet.newRequest.termsConditions',
              linkId:"terms"
            },
          ],
          value: true,
          textOnStart: false,
        },
      }),
      subTitle: new TextControl({
        order: 15,
        columnCount: 12,
        label:
          'finance.fleet.requests.RequiredDocsSubDesc',
        class: 'color-arb-secondaryText font-body-light text-start',
      }),
    },
  });
};
