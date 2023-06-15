import {TableHeaderType} from "arb-design-library";
import {TableHeaderModel} from "arb-design-library/model/table-header.model";

export const feesTableHeader =(feesTypeLookup:any,feesCodeLookup:any): TableHeaderModel[]=>{
  return [{
    title: 'company-admin.fees.table-headers.fees-type',
    type: TableHeaderType.TEXT,
    fieldName: 'feesType',
    mapObject: feesTypeLookup,
  }, {
    title: 'company-admin.fees.table-headers.code',
    type: TableHeaderType.TEXT,
    fieldName: 'feesCode',
    mapObject: feesCodeLookup,
  }, {
    title: 'company-admin.fees.table-headers.total-fee',
    type: TableHeaderType.TEXT,
    fieldName: 'totalFee',
  },
    {
      title: 'company-admin.fees.table-headers.fee',
      type: TableHeaderType.TEXT,
      fieldName: 'fee',
    },
    {
      title: 'company-admin.fees.table-headers.vat',
      type: TableHeaderType.TEXT,
      fieldName: 'vat',
    }
  ];
}
