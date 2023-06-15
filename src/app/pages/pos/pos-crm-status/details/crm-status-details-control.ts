import { FormModel } from "../../../../@core/model/dto/formModel";
import { SummaryItemControl } from "../../../../@core/model/dto/control/sumery-item-control";

export function getCRMStatusDetailsForm() {
  return new FormModel({
    id: 'crm-status-details',
    showDivider: true,
    controls: {
      "requestId": new SummaryItemControl({
        columnCount: 4,
        order: 2,
        label: 'pos.maintenance.crm-request-id',

      }),
      "terminalNumber": new SummaryItemControl({
        columnCount: 4,
        order: 2,
        label: 'pos.maintenance.crm-status-terminal-number'
      }),
      "requestType": new SummaryItemControl({
        columnCount: 4,
        order: 2,
        label: 'pos.maintenance.crm-request-type'
      }),
      "city": new SummaryItemControl({
        columnCount: 4,
        order: 2,
        label: 'public.city'
      }),
      "contactName": new SummaryItemControl({
        columnCount: 4,
        order: 2,
        label: 'public.contact-name'
      }),
      "mobileNumber": new SummaryItemControl({
        columnCount: 4,
        order: 2,
        label: 'public.phone-number'
      }),
      "status": new SummaryItemControl({
        columnCount: 4,
        order: 2,
        label: 'pos.maintenance.crm-tbl-status'
      })
    }
  });
}
