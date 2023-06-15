import {FormModel} from "../../../../../@core/model/dto/formModel";
import {TableControl} from "../../../../../@core/model/dto/control/table-control";
import {TitleControl} from "../../../../../@core/model/dto/control/title-control";
import {TableHeaderModel} from "arb-design-library/model/table-header.model";
import {TableHeaderType} from "arb-design-library";
import {TitleModel} from "arb-design-library/model/title.model";
import {UserDetailsRes} from "../../../../../@core/model/rest/company-admin/user-details/user-details-res";

export const getEditUserPrivilegesForm = (userDtls: UserDetailsRes | null) => {
  return new FormModel({
    id: 'userPrivilegesForm',
    controls: {
      functionalityTable: new TableControl({
        columnCount: 12,
        order: 2,
        controlOptions: {
          title: 'company-admin.user-info.selected-privilege',
          pageSizes: [50, 100],
          columnId: 'id',
          headers: [
            {title: 'Functionality', fieldName: "title", type: TableHeaderType.TEXT},
            {title: 'L1', fieldName: "L1", type: TableHeaderType.CHECK_BOX},
            {title: 'L2', fieldName: "L2", type: TableHeaderType.CHECK_BOX},
            {title: 'L3', fieldName: "L3", type: TableHeaderType.CHECK_BOX},
            {title: 'L4', fieldName: "L4", type: TableHeaderType.CHECK_BOX},
            {title: 'L5', fieldName: "L5", type: TableHeaderType.CHECK_BOX},
          ],
          paginationValue: {
            page: 1,
            size: 50
          }
        }
      }),

    }
  })
}
export const getPrivilegeTableHeaders = (): TableHeaderModel[] => {
  return [
    {title: 'Functionality', fieldName: "title", type: TableHeaderType.TEXT},
    {title: 'L1', fieldName: "L1", type: TableHeaderType.CHECK_BOX},
    {title: 'L2', fieldName: "L2", type: TableHeaderType.CHECK_BOX},
    {title: 'L3', fieldName: "L3", type: TableHeaderType.CHECK_BOX},
    {title: 'L4', fieldName: "L4", type: TableHeaderType.CHECK_BOX},
    {title: 'L5', fieldName: "L5", type: TableHeaderType.CHECK_BOX},
  ];
}
export const getETradeTableHeaders = (): TableHeaderModel[] => {
  return [
    {title: 'Functionality', fieldName: "title", type: TableHeaderType.TEXT},
    {title: 'Initiate', fieldName: "initiate", type: TableHeaderType.CHECK_BOX},
    {title: 'L1', fieldName: "L1", type: TableHeaderType.CHECK_BOX},
    {title: 'L2', fieldName: "L2", type: TableHeaderType.CHECK_BOX},
    {title: 'L3', fieldName: "L3", type: TableHeaderType.CHECK_BOX},
    {title: 'L4', fieldName: "L4", type: TableHeaderType.CHECK_BOX},
    {title: 'L5', fieldName: "L5", type: TableHeaderType.CHECK_BOX},
  ];
}
export const getPrivilegeTitle = (): TitleModel => {
  return {
    id: ' privilegesListTitle',
    type: 'Section',
    title: "company-admin.privileges.selectedPrivileges"
  }
}
export const getETradeTitle = (): TitleModel => {
  return {
    id: ' eTradeTitle ',
    type: 'Section',
    title: "company-admin.privileges.eTrade"
  }
}
