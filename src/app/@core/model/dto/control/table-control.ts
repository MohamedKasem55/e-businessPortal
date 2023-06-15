import {ControlBase, ControlOptions, ControlType} from "./control.model";
import {TableHeaderModel} from "arb-design-library/model/table-header.model";
import {EventEmitter} from "@angular/core";
import {TableSortOutputModel} from "arb-design-library/model/table-sort-output.model";
import {TableButtonOutputModel} from "arb-design-library/model/table-button-output.model";
import {PaginationValueModel} from "arb-design-library/model/pagination.model";
import {TableInputChangeModel, TableUpdateValue} from "arb-design-library/model/table-input-change.model";

export class TableControl extends ControlBase<any> {
  override controlType = ControlType.TABLE;
  override controlOptions!: TableOptions;

  readonly onFilterClick: EventEmitter<null>;
  readonly buttonClicked: EventEmitter<TableButtonOutputModel>;
  readonly externalPagination: EventEmitter<PaginationValueModel>;
  readonly externalSort: EventEmitter<TableSortOutputModel>;
  readonly onInputChange: EventEmitter<TableInputChangeModel>;
  private updateValueEvent: EventEmitter<TableUpdateValue[]>;
  readonly onCheckBoxColumnChange: EventEmitter<any>;

  updateValues(values: TableUpdateValue[]) {
    this.updateValueEvent.emit(values);
  }

  constructor(options: TableControlOptions) {
    super(options);
    this.externalSort = new EventEmitter<TableSortOutputModel>();
    this.buttonClicked = new EventEmitter<TableButtonOutputModel>();
    this.externalPagination = new EventEmitter<PaginationValueModel>();
    this.onFilterClick = new EventEmitter<null>();
    this.onInputChange = new EventEmitter<TableInputChangeModel>();
    this.updateValueEvent = new EventEmitter<TableUpdateValue[]>();
    this.onCheckBoxColumnChange = new EventEmitter<any>();
  }
}

export class TableControlOptions extends ControlOptions<any> {
  override controlOptions!: TableOptions;

  constructor() {
    super();
  }
}


interface TableOptions {
  showSearch?: boolean;
  showFilter?: boolean;
  filterIsActive?: boolean;
  headers: TableHeaderModel[];
  data?: any[] | undefined;
  hasCheckbox?: boolean;
  columnId: string;
  selectedValues?: any[];
  showSortAndPin?: boolean;
  maxDisplayRow?: number;
  ShowMoreText?: string;
  ShowLessText?: string;
  paginationValue?: PaginationValueModel;
  total?: number;
  visibleRangeLength?: number;
  pageSizes?: number[];
  isExternalSort?: boolean;
  exportFileName?: string;
  isDisabled?: boolean;
  title?:string;
}
