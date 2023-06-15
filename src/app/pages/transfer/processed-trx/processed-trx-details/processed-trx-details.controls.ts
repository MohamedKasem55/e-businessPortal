import {TableHeaderModel} from "arb-design-library/model/table-header.model";
import {TableHeaderType} from "arb-design-library";

export const getDetailsTableHeaders = (securityLevelStatus: any): TableHeaderModel[] => {

  return [{
    title: 'User Level',
    type: TableHeaderType.TEXT,
    fieldName: 'level'
  },
    {
      title: 'Status',
      type: TableHeaderType.TEXT,
      fieldName: 'status',
      mapObject: securityLevelStatus
    },
    {
      title: 'User ID',
      type: TableHeaderType.TEXT,
      fieldName: 'updater'
    }, {
      title: 'Date-Time',
      type: TableHeaderType.DATE_TEXT,
      fieldName: 'updateDate',
      controlOptions: {format: 'dd/MM/yyyy HH:mm'}
    }]
}
