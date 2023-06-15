import { TitleModel } from 'arb-design-library/model/title.model';
import { TabModel } from 'arb-design-library/model/tab.model';
import { PopupInputModel } from 'app/@core/model/dto/popup.model';
import { ButtonControl } from 'app/@core/model/dto/control/button-control';
import { EmptyControl } from 'app/@core/model/dto/control/empty-control';
import { TextControl } from 'app/@core/model/dto/control/text-control';
import { FormModel } from 'app/@core/model/dto/formModel';
import { AlertModel } from '../../../../@core/model/dto/alert.model';
export const InstallmentDetailsTitle = (): TitleModel => {
  return {
    id: "1",
    type: 'Section',
    title:'finance.installmentDetails',
    showArrow: false,
  }
}

export const pageTitle = (): TitleModel => {
  return {
    id: 'financeTitle',
    type: 'Page',
    title: 'finance.Finance',
  }
}
export const getAlertModel = (): AlertModel => {
  return {
    id: 'doc-alert-model',
    type: 'Critical',
    title: 'accounts.documents.document-fields-validation.doc-eligibility-alert-title',
    message: 'accounts.documents.document-fields-validation.doc-eligibility',
    showClose: true
  }
}
export const ExistApplicationForm = (): PopupInputModel => {
  return {
    image: 'assets/img/warning.svg',
    showAlert: true,
    form: new FormModel(
      {
      id: "ExistApplicationForm",
      controls: {
        text: new TextControl({
          order: 1,
          columnCount: 12,
          label: 'finance.DearCustomer',
          class: "color-arb-primaryText font-h2-bold align-center justify-content-center align-item-center text-align-center"
        }),
        section: new TextControl({
          order: 2,
          columnCount: 12,
          label: 'finance.ExistApplicationNote',
          class: "color-arb-primaryText font-h2-normal align-center justify-content-center align-item-center text-align-center"
        }),
        dashboardbtn: new ButtonControl({
          order: 3,
          columnCount: 6,
          controlOptions: {
            id: "dashboardbtn",
            text: "finance.fleet.GOToDashboard",
            type: 'primary',
          },
        }),
        close: new ButtonControl({
          order: 3,
          columnCount: 6,
          controlOptions: {
            id: "close",
            text: "finance.fleet.btn.Close",
            type: 'danger',
          },
        }),
      }
    }
    ),
  }
}

