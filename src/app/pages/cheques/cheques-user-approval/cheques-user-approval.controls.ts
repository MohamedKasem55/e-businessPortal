import {TableHeaderModel} from "arb-design-library/model/table-header.model";
import {TableHeaderType} from "arb-design-library";

const Status = {"I": "status.initiate", "P": "status.pending", "A": "status.approve", "R": "status.rejected"}
const typeCheck = {
  "0": "accounts.cheques.10Pages",
  "2": "accounts.cheques.25Pages",
  "3": "accounts.cheques.50Pages"
}

export const getChequeHeaders = (): TableHeaderModel[] => {
  return [
    {
      title: "public.account-number",
      type: TableHeaderType.TEXT,
      fieldName: "accountNumber",
    },
    {
      title: "accounts.cheques.chequeType",
      type: TableHeaderType.TEXT,
      fieldName: "typeCheck",
      mapObject: typeCheck,
    },
    {
      type: TableHeaderType.DATE_TEXT,
      title: "transfer.userApproval.init-date",
      fieldName: "initiationDate",
      controlOptions: {format: "dd/MM/yyyy"}
    },
    {
      title: "transfer.userApproval.current-status",
      type: TableHeaderType.CURRENT_LEVEL,
      fieldName: "securityLevelsDTOList",
      controlOptions: {
        levelFieldName: "level",
        statusFieldName: "status",
        updaterFieldName: "updater",
        dateFieldName: "updateDate",
        dateFormat: "dd/MM/yyyy"
      },
    },
    {
      title: "transfer.userApproval.next-status",
      type: TableHeaderType.NEXT_LEVEL,
      controlOptions: {completed: "Completed"},
      fieldName: "securityLevelsDTOList"
    },
    {
      title: "public.status",
      type: TableHeaderType.PILL,
      fieldName: "status",
      mapObject: Status,
      controlOptions: {
        PositiveCondition: 'A',
        NegativeCondition: 'R',
        WarningCondition: 'P',
      }
    },
  ]
}

export const getStopChequeHeaders = (): TableHeaderModel[] => {
  return [
    {
      title: "public.account-number",
      type: TableHeaderType.TEXT,
      fieldName: "accountNumber",
    },
    {
      title: "accounts.cheques.chequeNo",
      type: TableHeaderType.TEXT,
      fieldName: "checkNumber",
    },
    {
      type: TableHeaderType.DATE_TEXT,
      title: "transfer.userApproval.init-date",
      fieldName: "initiationDate",
      controlOptions: {format: "dd/MM/yyyy"}
    },
    {
      title: "transfer.userApproval.current-status",
      type: TableHeaderType.CURRENT_LEVEL,
      fieldName: "securityLevelsDTOList",
      controlOptions: {
        levelFieldName: "level",
        statusFieldName: "status",
        updaterFieldName: "updater",
        dateFieldName: "updateDate",
        dateFormat: "dd/MM/yyyy"
      },
    },
    {
      title: "transfer.userApproval.next-status",
      type: TableHeaderType.NEXT_LEVEL,
      controlOptions: {completed: "Completed"},
      fieldName: "securityLevelsDTOList"
    },
    {
      title: "public.status",
      type: TableHeaderType.PILL,
      fieldName: "status",
      mapObject: Status,
      controlOptions: {
        PositiveCondition: 'A',
        NegativeCondition: 'R',
        WarningCondition: 'P',
      }
    },
  ]
}
