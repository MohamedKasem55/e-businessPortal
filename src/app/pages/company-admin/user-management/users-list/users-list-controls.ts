import { ButtonControl } from 'app/@core/model/dto/control/button-control';
import { DropdownControl } from 'app/@core/model/dto/control/dropdown-control';
import { TextInputControl } from 'app/@core/model/dto/control/text-input-control';
import { FormModel } from 'app/@core/model/dto/formModel';
import { TableHeaderType } from 'arb-design-library';
import { TableHeaderModel } from 'arb-design-library/model/table-header.model';
import { TitleModel } from 'arb-design-library/model/title.model';

export const getSearchForm = () => {
  return new FormModel({
    id: 'fromAccountForm',
    controls: {
      userId: new TextInputControl({
        label: 'company-admin.users-list.loginID',
        order: 1,
        columnCount: 6,
        value: '',
      }),
      userName: new TextInputControl({
        label: 'company-admin.users-list.englishName',
        order: 2,
        columnCount: 6,
        value: '',
      }),
      iqama: new TextInputControl({
        label: 'company-admin.users-list.nationalID',
        order: 3,
        columnCount: 6,
        value: '',
      }),
      userType: new DropdownControl({
        label: 'company-admin.users-list.userType',
        order: 4,
        columnCount: 6,
        controlOptions: {
          hasSearch: true,
          columnId: 'key',
          textField: 'value',
        },
        value: '',
      }),
      city: new TextInputControl({
        label: 'public.city',
        order: 5,
        columnCount: 6,
        value: '',
      }),
      region: new TextInputControl({
        label: 'financial-products.region',
        order: 6,
        columnCount: 6,
        value: '',
      }),
      mobileNumber: new TextInputControl({
        label: 'public.mobile',
        order: 7,
        columnCount: 6,
        value: '',
      }),
      department: new TextInputControl({
        label: 'company-admin.users-list.department',
        order: 8,
        columnCount: 6,
        value: '',
      }),
      cancel: new ButtonControl({
        order: 9,
        columnCount: 4,
        controlOptions: {
          id: 'cancel',
          type: 'secondary',
          text: 'public.cancel',
        },
      }),
      reset: new ButtonControl({
        order: 10,
        columnCount: 4,
        controlOptions: {
          id: 'reset',
          type: 'secondary',
          text: 'public.reset',
        },
      }),
      searchButton: new ButtonControl({
        order: 11,
        columnCount: 4,
        controlOptions: {
          id: 'search',
          type: 'primary',
          text: 'public.search',
        },
      }),
    },
  });
};

export const getTableHeadersList = (): TableHeaderModel[] => {
  return [
    {
      title: '',
      type: TableHeaderType.AVATAR,
      fieldName: 'userImage',
      controlOptions: { type: 'img', avatar: 'assets/img/profile.svg' },
    },
    {
      title: 'company-admin.users-list.loginID',
      type: TableHeaderType.BUTTON,
      fieldName: 'userId',
      controlOptions: { text: 'userId', id: 'editUserId' },
    },
    {
      title: 'company-admin.users-list.userType',
      type: TableHeaderType.TEXT,
      fieldName: 'type',
    },
    {
      title: 'company-admin.users-list.englishName',
      type: TableHeaderType.TEXT,
      fieldName: 'userName',
    },
    {
      title: 'company-admin.users-list.nationalID',
      type: TableHeaderType.TEXT,
      fieldName: 'idIqama',
    },
    {
      title: 'company-admin.users-list.empCompID',
      type: TableHeaderType.TEXT,
      fieldName: 'empRef',
    },
    {
      title: 'company-admin.users-list.status',
      type: TableHeaderType.PILL,
      fieldName: 'userStatus',
      controlOptions: {
        PositiveCondition: 'A',
        NegativeCondition: 'B',
        WarningCondition: 'I',
        NeutralCondition: 'E',
      },
    },
  ];
};

export const getPageTitle = (): TitleModel => {
  return {
    id: ' UserManagment1',
    type: 'Page',
    title: 'company-admin.users-list.title1',
    endButtons: [
      {
        id: 'addUser',
        type: 'primary',
        text: 'company-admin.users-list.addUser',
        prefixIcon: 'arb-icon-userAdd',
      },
    ],
  };
};
export const getSectionTitle = (): TitleModel => {
  return {
    id: ' UserManagment2',
    type: 'Section',
    title: 'company-admin.users-list.title2',
  };
};
export const getExportFileName = (): string => {
  return 'users';
};
