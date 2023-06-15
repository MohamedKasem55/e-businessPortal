import {TableHeaderModel} from 'arb-design-library/model/table-header.model';
import {TableHeaderType} from 'arb-design-library';
import {CustomerBusinessDetails} from 'app/@core/model/rest/finance/request/business-details';

export var businessTypes!: any;
export var branchesTypes!: any;
export var businessLocations!: any;
export const externalQutationTableHeader = (): TableHeaderModel[] => {
  return [
    {
      title: '',
      fieldName: 'index',
      type: TableHeaderType.TEXT,
    },
    {
      title: 'finance.fleet.requests.quotationName',
      fieldName: 'qutationName',
      type: TableHeaderType.TEXT,
    },

    {
      title: 'finance.fleet.requests.type',
      fieldName: 'type',
      type: TableHeaderType.TEXT,
    },
    {
      title: 'finance.fleet.requests.quotationValue',
      fieldName: 'quotationValue',
      type: TableHeaderType.TEXT,
    },
    {
      title: 'finance.fleet.requests.carQuantity',
      fieldName: 'carQuantity',
      type: TableHeaderType.TEXT,
    },

    {
      title: '',
      fieldName: 'edit-action',
      type: TableHeaderType.BUTTON,
      controlOptions: {
        id: "edit",
        prefixIcon: "arb-icon-edit",
      }
    },
    {
      title: '',
      fieldName: 'delete-action',
      type: TableHeaderType.BUTTON,
      controlOptions: {
        id: "delete",
        prefixIcon: "arb-icon-Trash",
      }
    },

  ];
}

export const externalData = () => {
  return []
}

export const defaultBusinessDetails = (): CustomerBusinessDetails => {
  return {
    branchType: "",
    businessActivity: "",
    businessLocation: "",
    businessOutletsNum: "",
    businessType: "",
    establishmentDate: ""
  }
}


