import { TableControl } from "app/@core/model/dto/control/table-control";
import { TitleControl } from "app/@core/model/dto/control/title-control";
import { FormModel } from "app/@core/model/dto/formModel";
import { TableHeaderType } from "arb-design-library";

export function selectedDeactivateSMSUserForm() {
    return new FormModel({
        id: 'selectedDeactivateSMSUser',
        controls: {
            "selectedUserTable": new TableControl({
                columnCount: 12,
                order: 2,
                required: false,
                value: [],
                controlOptions: {
                    headers: [
                        {
                            type: TableHeaderType.TEXT,
                            title: "company-admin.alert-management.user-id",
                            fieldName: "userId"
                        },
                        {
                            type: TableHeaderType.TEXT,
                            title: "company-admin.alert-management.name",
                            fieldName: "userName"
                        },
                        {
                            type: TableHeaderType.TEXT,
                            title: "company-admin.alert-management.mobile-number",
                            fieldName: "mobileNumber"
                        },
                        {
                            type: TableHeaderType.CHECK_BOX,
                            title: "company-admin.alert-management.alert-privilage",
                            fieldName: "alertPrivileges",
                            //mapObject: privilegeMapping,
                        },
                        {
                            type: TableHeaderType.DATE_TEXT,
                            title: "company-admin.alert-management.reg-date",
                            fieldName: "registrationDate",
                            controlOptions: { format: "dd/MM/yyyy" }
                        },
                        {
                            type: TableHeaderType.DATE_TEXT,
                            title: "company-admin.alert-management.renewal-date",
                            fieldName: "renewalDate",
                            controlOptions: { format: "dd/MM/yyyy" }
                        },
                        {
                            type: TableHeaderType.DATE_TEXT,
                            title: "company-admin.alert-management.expiry-date",
                            fieldName: "expiryDate",
                            controlOptions: { format: "dd/MM/yyyy" }
                        }
                    ],
                    columnId: "customerId",
                    hasCheckbox: false,
                    showSearch: false,
                    showFilter: false,
                    isDisabled: true,
                    exportFileName: "Slected User List",
                    pageSizes: [10, 25, 50],
                    paginationValue: { page: 1, size: 20 },
                    title: 'company-admin.alert-management.deactivate-user-list'
                },
            }),
        }
    });
}
