import {DropdownControl} from '../../../../../../@core/model/dto/control/dropdown-control';
import {TitleControl} from '../../../../../../@core/model/dto/control/title-control';
import {FormModel} from '../../../../../../@core/model/dto/formModel';
import {KeyValueModel} from '../../../../../../@core/model/rest/common/key-value.model';

export function LinkedAccount(accountList: KeyValueModel[] | [], accountValue?: KeyValueModel, disable?: boolean): FormModel {
  return new FormModel(
    {
      id: 'linkedAccount',
      controls: {
        "linkedAccountTitle": new TitleControl({
          columnCount: 12,
          order: 1,
          class: "mt-4 mb-4",
          controlOptions: {
            title: 'finance.fleet.requests.linkedAccount',
            type: 'Section', id: "",
            subTitle: 'finance.fleet.requests.linkedAccountNote'
          },
        }),

        "linkAccount": new DropdownControl({
          order: 5,
          columnCount: 4,
          label: "finance.fleet.requests.account",
          class: "text-start color-arb-primaryText ",
          value: accountValue,

          required: true,
          validationLabels: {required: 'Required Field'},
          controlOptions: {
            columnId: "key",
            textField: "value",
            options: accountList
          }
        }),

      }
    });
}
