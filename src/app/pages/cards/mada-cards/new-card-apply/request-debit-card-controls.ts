import {ButtonModel} from 'arb-design-library/model/button.model';
import {FormModel} from 'app/@core/model/dto/formModel';
import {TitleControl} from 'app/@core/model/dto/control/title-control';
import {EmptyControl} from 'app/@core/model/dto/control/empty-control';
import {DropdownControl} from 'app/@core/model/dto/control/dropdown-control';
import {SelectionControl} from 'app/@core/model/dto/control/selection-control';
import {Utils} from "../../../../@core/utility/Utils";

export const editAccoutButton: ButtonModel = {
  id: 'edit-account-btn',
  text: 'public.edit',
  type: 'secondary',
};

export function selectAccountForm() {
  return new FormModel({
    id: 'selectAccountFrom',
    controls: {
      cardDetails: new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: '',
          title: 'cards.new-card.card-details',
        },
      }),
      linkedAccount: new DropdownControl({
        label: 'cards.new-card.linked-account',
        hidden: false,
        required: true,
        order: 2,
        controlOptions: {columnId: "key", textField: 'value'},
        columnCount: 6,
        validationLabels: {
          required: Utils.translateWithParams(
            'public.is-required',
            {field: 'cards.new-card.linked-account'}
          ),
        },
      }),
      embosingNames: new DropdownControl({
        label: 'cards.new-card.embossing-name',
        hidden: false,
        required: true,
        order: 3,
        controlOptions: {columnId: "key", textField: 'value'},
        columnCount: 6,
        validationLabels: {
          required: Utils.translateWithParams(
            'public.is-required',
            {field: 'cards.new-card.embossing-name'}
          ),
        },
      }),
      empty: new EmptyControl({
        columnCount: 12,
        order: 4,
      }),
      terms: new SelectionControl({
        label: 'cards.new-card.accept-terms',
        controlOptions: {
          title: [
            {
              text: 'cards.new-card.accept-terms',
              linkId: 'terms-link',
            },
          ],
        },
        required: true,
        order: 5,
        value: true,
        columnCount: 6,
      }),
    },
  });
}

export function branchForm() {
  return new FormModel({
    id: 'branch-form',
    showDivider: true,
    controls: {
      pickupOffice: new TitleControl({
        columnCount: 12,
        hidden: true,
        order: 1,
        controlOptions: {
          id: '',
          title: 'cards.new-card.pick-up-office',
        },
      }),
      city: new DropdownControl({
        label: 'cards.new-card.pick-up-city',
        hidden: true,
        required: true,
        order: 2,
        controlOptions: {columnId: "key", textField: 'value', hasSearch: true},
        columnCount: 6,
        validationLabels: {
          required: Utils.translateWithParams(
            'public.is-required',
            {field: 'cards.new-card.pick-up-city'}
          ),
        },
      }),
      branch: new DropdownControl({
        label: 'cards.new-card.pick-up-branch',
        hidden: true,
        required: true,
        order: 3,
        controlOptions: {columnId: "key", textField: 'value', hasSearch: true},
        columnCount: 6,
        validationLabels: {
          required: Utils.translateWithParams(
            'public.is-required',
            {field: 'cards.new-card.pick-up-branch'}
          ),
        },
      }),
      empty: new EmptyControl({
        columnCount: 12,
        order: 4,
      }),
    },
  });
}

