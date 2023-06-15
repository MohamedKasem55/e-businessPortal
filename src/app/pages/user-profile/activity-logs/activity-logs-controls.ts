import {ButtonControl} from 'app/@core/model/dto/control/button-control';
import {
  CalenderType,
  DateControl,
} from 'app/@core/model/dto/control/date-control';
import {DropdownControl} from 'app/@core/model/dto/control/dropdown-control';
import {FormModel} from 'app/@core/model/dto/formModel';
import {TabModel} from 'arb-design-library/model/tab.model';

export const getActivityTabs = () => {
  const activityTabs: TabModel[] = [];
  activityTabs.push(
    {
      text: 'activityLogs.activitylogsTitle',
      value: 'acivityLogs',
    },
    {
      text: 'activityLogs.requestedFiles',
      value: 'requestedFiles',
    }
  );

  return activityTabs;
};

export function getActivityLogsFilterForm() {
  return new FormModel({
    id: 'activityLogsFilter',
    controls: {
      fromDate: new DateControl({
        columnCount: 6,
        order: 1,
        label: 'activityLogs.fromDate',
        controlOptions: {
          displayPattern: 'dd/MM/yyyy',
          type: CalenderType.GREGORIAN,
        },
        value: '',
      }),
      toDate: new DateControl({
        columnCount: 6,
        order: 2,
        label: 'activityLogs.toDate',
        controlOptions: {
          displayPattern: 'dd/MM/yyyy',
          type: CalenderType.GREGORIAN,
        },
        value: '',
      }),
      operationsList: new DropdownControl({
        label: 'activityLogs.operations',
        required: false,
        order: 3,
        columnCount: 8,
        controlOptions: {
          columnId: 'key',
          textField: 'value',
          hasSearch: true,
        },
        value: '',
      }),
      authorizersList: new DropdownControl({
        label: 'activityLogs.authorizers',
        required: false,
        order: 4,
        columnCount: 4,
        controlOptions: {
          columnId: 'key',
          textField: 'value',
        },
        value: '',
      }),
      usersList: new DropdownControl({
        label: 'activityLogs.users',
        hidden: true,
        order: 5,
        columnCount: 2,
        controlOptions: {
          columnId: 'userId',
          textField: 'userId',
          hasSearch: true,
        },
        value: '',
      }),
      cancelButton: new ButtonControl({
        order: 6,
        columnCount: 4,
        controlOptions: {
          id: 'cancel',
          type: 'secondary',
          text: 'public.cancel',
        },
      }),
      resetButton: new ButtonControl({
        order: 7,
        columnCount: 4,
        controlOptions: {
          id: 'reset',
          type: 'secondary',
          text: 'public.reset',
        },
      }),
      searchButton: new ButtonControl({
        order: 8,
        columnCount: 4,
        controlOptions: {
          id: 'search',
          type: 'primary',
          text: 'public.search',
        },
      }),
    },
  });
}


