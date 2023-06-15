import {Component, OnInit} from '@angular/core';
import {TableHeaderModel} from 'arb-design-library/model/table-header.model';
import {Branch} from '../../../../@core/model/rest/finance/request/branch';
import {TableHeaderType} from 'arb-design-library';
import {RequestService} from 'app/@core/service/finance/request/request.service';
import {TitleModel} from 'arb-design-library/model/title.model';
import { KeyValueModel } from 'app/@core/model/rest/common/key-value.model';

@Component({
  selector: 'app-all-branches',
  templateUrl: './all-branches.component.html',
  styleUrls: [],
})
export class AllBranchesComponent implements OnInit {
  headers: TableHeaderModel[] =[];
  pageTitle!: TitleModel;
  sectionTitle!: TitleModel;

  branches!: KeyValueModel[];

  constructor(private requestService: RequestService,
  ) {
    this.headers = [
      {
        title: 'finance.fleet.requests.Branch',
        fieldName: 'branch',
        type: TableHeaderType.TEXT,
      },
      {
        title: 'finance.fleet.requests.Code',
        fieldName: 'code',
        type: TableHeaderType.TEXT,
      },
    ];
    this.pageTitle = {
      id: 'view-branches',
      type: 'Page',
      title:'finance.fleet.requests.ViewBranches',
    };
    this.sectionTitle = {
      id: 'all-branches',
      type: 'Section',
      title: "finance.fleet.requests.AllBranches"
    };
  }

  ngOnInit(): void {
    this.getAllBranches();
  }


  getAllBranches() {
    this.requestService.getAllBranches().subscribe((response: KeyValueModel[]) => {
      this.branches = response;
    })
  }
}
