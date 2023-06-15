import { TableControl } from "app/@core/model/dto/control/table-control";
import { TitleControl } from "app/@core/model/dto/control/title-control";
import { FormModel } from "app/@core/model/dto/formModel";
import { TableHeaderType } from "arb-design-library";

export function alertsListForm() {
  return new FormModel({
    id: 'aliasManagement',
    controls: {
      "alertsTable": new TableControl({
        columnCount: 12,
        order: 2,
        controlOptions: {
          headers: [
            {
              title: "manage-alerts.accounts",
              fieldName: "accountNumber",
              type: TableHeaderType.TEXT,
            },
            {
              title: "manage-alerts.subscriptionDate",
              fieldName: "subscriptionDate",
              type: TableHeaderType.TEXT,
            }],
          columnId: "accountPk",
          hasCheckbox: true,
          showSearch: true,
          showFilter: true,
          pageSizes: [20, 30, 50, 100],
          paginationValue: {page: 1, size: 50},
          title: 'manage-alerts.alertList'
        },
      }),
    }
  });
}
