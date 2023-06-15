import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-help-wizard',
  templateUrl: './help-wizard.component.html',
  styleUrls: []
})
export class HelpWizardComponent implements OnInit {

  @Input() popTitle = "";
  @Input() popText = "";
  @Output() skip: EventEmitter<null> = new EventEmitter<null>();
  @Output() next: EventEmitter<null> = new EventEmitter<null>();

  constructor() {
  }

  ngOnInit(): void {
  }
}
