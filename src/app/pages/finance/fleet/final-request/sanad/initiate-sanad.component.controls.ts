import {LineCardControl} from "app/@core/model/dto/control/line-card-control"
import {TitleControl} from "app/@core/model/dto/control/title-control"
import {FormModel} from "app/@core/model/dto/formModel"
import {GenericFeatureListControl} from "../../../../../@core/model/dto/control/generic-feature-list-control";
import {ImageControl} from "../../../../../@core/model/dto/control/image-control";

export const InitiateSanadControl = () => {
  return new FormModel({
    id: 'initiateSanad',
    controls: {
      pageTitle: new TitleControl({
        order: 1, columnCount: 12,
        controlOptions: {id: '', title: 'finance.fleet.requests.InitiateSANADProcess', type: 'Page'}
      }),
      card: new LineCardControl({
        order: 2, columnCount: 12,
        controlOptions: {
          title: 'finance.fleet.requests.SANADDesc',
          icon: "arb-icon-exclamationBorder"
        }
      }),
      image: new ImageControl({
        columnCount: 3,
        order: 3,

        controlOptions: {
          class: '',
          src: 'assets/img/contract.png'
        }
      }),
      sanad: new GenericFeatureListControl({
        columnCount: 5,
        order: 4,
        controlOptions: <any>{
          title: "finance.fleet.requests.sanadSteps",
          icon: "arb-icon-userGroup",
          features: [
            {text: 'finance.fleet.requests.SANAD1'},
            {text: 'finance.fleet.requests.SANAD2'},
            {text: 'finance.fleet.requests.SANAD3'},
            {text: 'finance.fleet.requests.SANAD4'},
            {text: 'finance.fleet.requests.SANAD5'},
          ]
        }
      })
    }
  })
}
