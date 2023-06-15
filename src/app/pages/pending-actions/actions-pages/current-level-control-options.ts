import { endButtons } from './../../accounts/vat-invoice/vat-invoice-controls';
import { TranslateService } from "@ngx-translate/core"
import { TableControl } from "app/@core/model/dto/control/table-control"
import { TextControl } from "app/@core/model/dto/control/text-control"
import { FormModel } from "app/@core/model/dto/formModel"
import { Utils } from "app/@core/utility/Utils"
import { TableHeaderType } from "arb-design-library"
import { TableHeaderModel } from "arb-design-library/model/table-header.model"
import { ButtonControl } from 'app/@core/model/dto/control/button-control';
import { TitleControl } from 'app/@core/model/dto/control/title-control';

export const getCurrentLevelControlOptions = {
  levelFieldName: "level",
  levelText: "payments.userApproval.level",
  statusFieldName: "status",
  statusText: "payments.userApproval.status",
  updaterFieldName: "updater",
  updaterText: "payments.userApproval.userName",
  dateFieldName: "updateDate",
  dateText: "payments.userApproval.date",
  dateFormat: "dd/MM/yyyy"
}

export const getInformationDetailsForm = (translate: TranslateService, data: any) => {
  return new FormModel({
    id: 'idleForm',
    controls: {
      "title": new TitleControl({
        order: 1,
        columnCount: 12,
        label: '',
        class: "color-arb-primaryText font-h2-bold justify-content-center",
        controlOptions: {
          id: "",
          title: '',
          type: 'Section',
          endButtons: [
            {
              id: "close",
              text: "",
              type: "secondary",
              prefixIcon: "arb-icon-xLarge"
            }
          ]
        }
      }),
      tableLevels: new TableControl({
        columnCount: 12,
        order: 5,
        disable: true,
        controlOptions: {
          headers: getLevelsHeader(),
          columnId: "batchSecurityPk",
          hasCheckbox: false,
          showSearch: false,
          data: data,
          showFilter: false,
        },
      }),
    }
  })
}

export function getLevelField(translate: TranslateService, field: string): string {
  let level: string = '';
  level = translate.instant('pending-actions.level') + ' ' + field;
  return level;
}

export function buildDetails(translate: TranslateService, data: any): any {
  data.forEach((element: any) => {
    element['level'] = getLevelField(translate, element['level']);
    element['status'] = element['status'] === 'I' ? translate.instant('pending-actions.initiator') : translate.instant('pending-actions.pending')
    element['updater'] = element['updater'] ? element['updater'] : translate.instant('pending-actions.not-done-yet');

  });
  return data;
}

export function getLevelsHeader(): TableHeaderModel[] {
  return [
    {
      title: "pending-actions.level",
      fieldName: "level",
      type: TableHeaderType.TEXT,
    },
    {
      title: "pending-actions.status",
      fieldName: "status",
      type: TableHeaderType.TEXT,
    },
    {
      title: "pending-actions.action-by",
      fieldName: "updater",
      type: TableHeaderType.TEXT,
    },
    {
      title: "pending-actions.date",
      fieldName: "updateDate",
      type: TableHeaderType.DATE_TEXT,
      controlOptions: { format: 'dd/MM/yyyy' },
    }
  ];
}

export const securityLevelsDTOList = [
  {
    "batchSecurityPk": null,
    "level": 2,
    "status": "I",
    "updater": "27620adm-1",
    "updateDate": "2023-01-31T14:34:39",
    "userPk": null,
    "auditStatus": null,
    "pdfStatus": null
  },
  {
    "batchSecurityPk": null,
    "level": 3,
    "status": "A",
    "updater": "27620adm-1",
    "updateDate": "2023-01-31T14:34:55",
    "userPk": null,
    "auditStatus": null,
    "pdfStatus": null
  },
  {
    "batchSecurityPk": null,
    "level": 4,
    "status": "A",
    "updater": null,
    "updateDate": null,
    "userPk": null,
    "auditStatus": null,
    "pdfStatus": null
  }
];