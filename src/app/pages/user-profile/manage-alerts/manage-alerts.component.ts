import { Component, OnInit } from '@angular/core';
import { TableControl } from 'app/@core/model/dto/control/table-control';
import { PageModel } from 'app/@core/model/dto/formModel';
import { AlertsReqModel } from 'app/@core/model/rest/manage-alerts/alerts-req.model';
import { AccountAlerts } from 'app/@core/model/rest/manage-alerts/alerts-res.model';
import { ManageAlertsService } from 'app/@core/service/manage-alerts/manage-alerts.service';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { PaginationValueModel } from 'arb-design-library/model/pagination.model';
import { BaseAlertComponent } from './base-alert/base-alert.component';
import { alertsListForm } from './manage-alerts-controls';

@Component({
  selector: 'app-manage-alerts',
  templateUrl: './base-alert/base-alert.component.html',
  styleUrls: []
})
export class ManageAlertsComponent extends BaseAlertComponent implements OnInit {

  listAccount: any[] = [];
  alertsReq!:AlertsReqModel
  selectedAlerts: AccountAlerts[] = [];


  editAlertsButton: ButtonModel = {
    id: 'Edit',
    text: 'public.edit',
    type: 'primary',
  };
  deleteAlertsButton: ButtonModel = {
    id: "Delete",
    text: "public.delete",
    type: "secondary"
  }
  createAlertButton: ButtonModel = {
    id: "create",
    text: "manage-alerts.createAlerts",
    type: "primary"
  }

  constructor(private manageAlertsService:ManageAlertsService) {
    super();
    this.pageTitle = {
      id: "manage-alerts",
      title: "manage-alerts.title",
      endButtons:[this.createAlertButton]
    };
    this.setAlertsReq()
    this.getAlerts()
  }

  override ngOnInit(): void {
    this.setBreadcrumb([{
      text: 'manage-alerts.userProfile',
      url: ''
    }, {text: 'manage-alerts.title', url: ''}]);
    this.startButtons=[]
    this.endButtons= [this.deleteAlertsButton,this.editAlertsButton]
    this.endButtons[0].isDisable = true;
    this.endButtons[1].isDisable = true;


    this.drawPage();

  }

  drawPage() {
    this.pages = [];
    this.pages = [new PageModel(1, alertsListForm())];

    (this.getControl(0, 0, "alertsTable") as TableControl).externalPagination?.subscribe((data: PaginationValueModel) => {
      this.onTablePagination(data);
    });

    this.getControl(0, 0, "alertsTable").valueChanges.subscribe(value => {
      this.selectedAlerts = value.value;
      this.updateButton();
    });
  }

  updateButton(){
    if (this.selectedAlerts.length > 0) {
      this.endButtons[0].isDisable = false;
      this.endButtons[1].isDisable = false;
    } else {
      this.endButtons[0].isDisable = true;
      this.endButtons[1].isDisable = true;
    }
  }

  onTablePagination(data: PaginationValueModel) {
    this.setAlertsReq(data.page,data.size );
    this.getAlerts();
  }

  setAlertsReq(page?:number, rows?:number) {
    this.alertsReq = {
      page: page || 1,
      rows: rows || 20,
    };
  }

  getAlerts() {
    this.manageAlertsService.postAlerts(this.alertsReq).subscribe(
      {
        next: (res) => {
          this.listAccount = res.accountWithAlertsList;
          this.getControl(0, 0, "alertsTable").controlOptions.data = this.listAccount;
          this.getControl(0, 0, "alertsTable").controlOptions.total = res.total;
        },
        error: () => {
          this.nextButton.showLoading = false;
          this.getControl(0, 0, "alertsTable").controlOptions.data = [];
        }
      });

  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput): void {
      switch (formButtonClickOutput.buttonId) {
        case 'create':
          this.router.navigateByUrl('/user-profile/manage-alerts/create')
          break;
        case 'Edit':
          this.router.navigateByUrl('/user-profile/manage-alerts/edit', { state: { alerts: this.selectedAlerts } }).then(() => {
          });
          break;
        case 'Delete':
          this.router.navigateByUrl('/user-profile/manage-alerts/delete', { state: { alerts: this.selectedAlerts } }).then(() => {
          });
          break;
        case 'accounts':
          this.router.navigateByUrl('/accounts')
          break;
        case 'dashboard':
          this.router.navigateByUrl('/')
          break;
      }
  }

}
