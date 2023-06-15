import { DropdownControl } from "app/@core/model/dto/control/dropdown-control";
import { FormModel } from "app/@core/model/dto/formModel";
import { TableControl } from 'app/@core/model/dto/control/table-control';
import { TableHeaderType } from 'arb-design-library';
import { UploadControl } from 'app/@core/model/dto/control/upload-control';

export function addClaimForm(): FormModel {
  return new FormModel({
    id: 'claimAddForm',
    controls: {
      "terminalNumber": new DropdownControl({
        label: 'claims.terminalNumber',
        hidden: false,
        required: false,
        order: 2,
        controlOptions: {
          columnId: "key",
          textField: 'value',
          hasSearch: false
        }
      }), "claimsTable": new TableControl({
        columnCount: 12,
        order: 3,
        required: true,
        value: [],
        controlOptions: {
          exportFileName: "claims",
          headers: [
            { title: "claims.terminalID", fieldName: "terminalID", type: TableHeaderType.TEXT },
            { title: "claims.date", fieldName: "date", type: TableHeaderType.TEXT },
            { title: "claims.amount", fieldName: "amount", type: TableHeaderType.TEXT },
            { title: "claims.cardType", fieldName: "cardType", type: TableHeaderType.TEXT },
            { title: "claims.status", fieldName: "status", type: TableHeaderType.TEXT },

          ],
          columnId: "claimId",
          hasCheckbox: true,
          showSearch: true,
          showFilter: false,
          pageSizes: [10, 15]
        },
      }),
    }
  });
}


export function claimUploadTextForm(): FormModel {
  return new FormModel({
    id: 'claimsUploadForm',
    showDivider: true,
    controls: {
      "fileControlInput": new UploadControl({
        label: 'claims.fileAttachment',
        hidden: false,
        required: true,
        value: "",
        order: 4,
        columnCount: 6,
        controlOptions: { acceptedTypes: [".txt"] },
        validationLabels: { required: 'claims.required' }
      }),
    }
  });
}
