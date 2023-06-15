import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {ButtonModel} from "arb-design-library/model/button.model";
import {SelfOnBoardingLineCardsModel} from "../../@core/model/dto/self-on-boarding-line-cards-model";
import {FormButtonClickOutput} from "../form/form.component";

@Component({
  selector: 'app-self-on-boarding-landing[title][lineCards]',
  templateUrl: './self-on-boarding-landing.component.html'
})
export class SelfOnBoardingLandingComponent implements OnChanges {
  @Input()
  title!: string;

  @Input()
  showButtons: boolean = true
  @Input()
  lineCards: SelfOnBoardingLineCardsModel[] = [];
  @Output() onButtonClick = new EventEmitter<FormButtonClickOutput>();

  buttons: ButtonModel[] = [{id: "Subscribe", type: "primary", text: "public.subscribe"}];


  constructor() {
  }

  ngOnInit(): void {
  }

  doButtonClick($event: string) {
    this.onButtonClick.emit({buttonId: $event})
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.showButtons) {
      this.buttons = [];
    }
  }
}
