import { AvatarModel } from 'arb-design-library/model/avatar.model';
import { PopupInputModel } from '../../../../@core/model/dto/popup.model';
import { FormModel } from '../../../../@core/model/dto/formModel';
import { ButtonControl } from '../../../../@core/model/dto/control/button-control';
import { TextControl } from 'app/@core/model/dto/control/text-control';
import { TranslateService } from '@ngx-translate/core';

export const fleetAvatar: AvatarModel = {
  type: 'ico',
  value: 'arb-icon-car',
};
export const PosAvatar: AvatarModel = {
  type: 'ico',
  value: 'arb-icon-posCard',
};
export const BIFAvatar: AvatarModel = {
  type: 'ico',
  value: 'arb-icon-briefcase',
};
export const ecommerceAvatar: AvatarModel = {
  type: 'ico',
  value: 'arb-icon-basket',
};
export const getParentReviewModel = (): PopupInputModel => {
  let form: FormModel = new FormModel({
    id: 'reviewChildContract',
    controls: {
      cancel: new ButtonControl({
        columnCount: 6,
        order: 2,
        controlOptions: {
          id: 'cancel',
          type: 'secondary',
          text: 'finance.fleet.btn.cancel',
        },
      }),
      finalOffer: new ButtonControl({
        columnCount: 6,
        order: 3,
        controlOptions: {
          id: 'finalOffer',
          type: 'primary',
          text: 'finance.fleet.btn.acceptFinalOffer',
        },
      }),
    },
  });
  return {
    form: form,
  };
};

export const checkUserHaveInProgressAccount = (
  dossierID: string,
  type: string,
  translate: TranslateService
): PopupInputModel => {
  return {
    image: type == 'PEN' ? 'assets/img/warning.svg' : 'assets/img/error.svg',
    showAlert: true,
    form: new FormModel({
      id: 'checkUserHaveInProgressAccountForm',
      controls: {
        text: new TextControl({
          order: 1,
          columnCount: 12,
          label:
            type == 'PEN'
              ? `${translate.instant('finance.fleet.newRequest.inprogressApp')}`
              : `${translate.instant(
                  'finance.fleet.newRequest.completeApplication'
                )} ${dossierID}`,
          class:
            'color-arb-primaryText font-h2-bold align-center justify-content-center align-item-center text-align-center',
        }),
        section: new TextControl({
          order: 2,
          columnCount: 12,
          label:
            type == 'PEN'
              ? `${translate.instant(
                  'finance.fleet.newRequest.yourApp'
                )} ${dossierID} ${translate.instant(
                  'finance.fleet.newRequest.isBeingReviewed'
                )}`
              : `${translate.instant(
                  'finance.fleet.newRequest.callOurCustomer'
                )}`,
          class:
            'color-arb-primaryText font-h2-normal align-center justify-content-center align-item-center text-align-center',
        }),
        close: new ButtonControl({
          order: 3,
          columnCount: 6,
          controlOptions: {
            id: 'close',
            text: 'public.cancel',
            type: 'secondary',
          },
        }),
        dashboardbtn: new ButtonControl({
          order: 3,
          columnCount: 6,
          controlOptions: {
            id: 'dashboardbtn',
            text: 'company-admin.user-info.go-to-dashboard',
            type: 'primary',
          },
        }),
      },
    }),
  };
};
