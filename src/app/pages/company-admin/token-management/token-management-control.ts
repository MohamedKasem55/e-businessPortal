import { TitleControl, TitleControlOptions } from '../../../@core/model/dto/control/title-control';
import { FormModel } from "../../../@core/model/dto/formModel";
import { TableControl } from "../../../@core/model/dto/control/table-control";
import { TableHeaderType } from "arb-design-library";
import { SummaryItemControl } from 'app/@core/model/dto/control/sumery-item-control';
import { ButtonModel } from 'arb-design-library/model/button.model';

export function tokenManagmentForm() {
  return new FormModel({
    id: 'token-management',
    controls: {
      "tokenUserListTable": new TableControl({
        columnCount: 12,
        order: 2,
        required: false,
        value: [],
        controlOptions: {
          headers: [
            {
              title: "company-admin.token-management.token-serial",
              type: TableHeaderType.BUTTON,
              fieldName: "tokenSerialNumber",
              controlOptions: [{
                id: "update-token",
                text: "tokenSerialNumber",
                fieldName: "tokenSerialNumber",
              }]
            },
            {
              title: "company-admin.token-management.token-type",
              fieldName: "tokenType",
              type: TableHeaderType.TEXT
            },
            {
              title: "company-admin.token-management.user-id",
              fieldName: "userId",
              type: TableHeaderType.TEXT
            },
            {
              title: "company-admin.token-management.user-name",
              fieldName: "userName",
              type: TableHeaderType.TEXT
            },

          ],
          columnId: "tokenSerialNumber",
          hasCheckbox: false,
          showSearch: true,
          showFilter: false,
          exportFileName: "User Token List",
          pageSizes: [10, 25, 50],
          paginationValue: { page: 1, size: 10 },
          title: 'company-admin.token-management.token-list'
        },
      }),
    }
  });
}


export function tokenManagementSummaryForm() {
  return new FormModel({
    id: 'token-management-summary',
    showDivider: true,
    controls: {
      "summaryTitle": new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: "summary",
          title: 'public.summary',
        }
      }),
      "numberOfOrginizationUser": new SummaryItemControl({
        columnCount: 4,
        order: 2,
        label: 'company-admin.token-management.num-org-user',
      }),
      "numberOfOrgnizationUserWithToken": new SummaryItemControl({
        columnCount: 4,
        order: 2,
        label: 'company-admin.token-management.num-org-user-with-token',
      }),
      "numberOfUnassignedToken": new SummaryItemControl({
        columnCount: 4,
        order: 2,
        label: 'company-admin.token-management.num-unassigned-token',
      })
    }
  });
}

export const getOrderNewTokenButton = (): ButtonModel => {
  return { id: 'OrderNewToken', text: 'company-admin.token-management.order-new-token', type: 'primary' }
}
