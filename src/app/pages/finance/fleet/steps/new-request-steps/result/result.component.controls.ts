import {FormModel} from "app/@core/model/dto/formModel"

export function getResultsControl(): FormModel {
  return new FormModel(
    {
      id: 'result',
      controls: {}
    });
}
