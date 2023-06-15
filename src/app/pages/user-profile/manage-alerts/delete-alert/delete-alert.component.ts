import { Component, OnInit } from '@angular/core';
import { NumberInputControl } from 'app/@core/model/dto/control/number-input-control';
import { SelectionControl } from 'app/@core/model/dto/control/selection-control';
import { TitleControl } from 'app/@core/model/dto/control/title-control';
import { PageModel } from 'app/@core/model/dto/formModel';
import { AlertsAccountResModel } from 'app/@core/model/rest/manage-alerts/alerts-account-res.model';
import { AlertsDeleteReqModel } from 'app/@core/model/rest/manage-alerts/alerts-delete-req.model';
import { AccountAlerts } from 'app/@core/model/rest/manage-alerts/alerts-res.model';
import { ResponseException } from 'app/@core/service/base/responseException';
import { ManageAlertsService } from 'app/@core/service/manage-alerts/manage-alerts.service';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { BaseAlertComponent } from '../base-alert/base-alert.component';
import { deleteForm, errorForm, successForm } from './delete-alert-controls';

@Component({
  selector: 'app-delete-alert',
  templateUrl: '../base-alert/base-alert.component.html',
  styleUrls: []
})
export class DeleteAlertComponent extends BaseAlertComponent implements OnInit {

  alerts: AccountAlerts[]=[]
  resAlerts:AlertsAccountResModel[]=[]


  cancelButton: ButtonModel = {
    id: 'cancel',
    text: 'public.cancel',
    type: 'secondary',
    isDisable: false,
  };
  goDashboardButton: ButtonModel = {
    id: 'dashboard',
    text: 'manage-alerts.goDashboard',
    type: 'secondary',
    isDisable: false,
  };

  goAlertButton: ButtonModel = {
    id: 'alerts',
    text: 'manage-alerts.goAlerts',
    type: 'primary',
    isDisable: false,
  };
  deleteAlertsButton: ButtonModel = {
    id: "Delete",
    text: "public.delete",
    type: "primary"
  }
  routeState: any;


  constructor(private manageAlertsService:ManageAlertsService) {
    super();
    this.pageTitle = {
      id: "manage-alerts",
      title: "manage-alerts.deleteAlerts",
    };


    this.alerts = this.router.getCurrentNavigation()!.extras.state?.['alerts']

  }

  override ngOnInit(): void {
    this.setBreadcrumb([{
      text: 'manage-alerts.userProfile',
      url: ''
    }, {text: 'manage-alerts.title', url: '/user-profile/manage-alerts'},
    {text: 'manage-alerts.deleteAlerts', url: ''}]);
    this.startButtons=[this.cancelButton]
    this.endButtons= [this.deleteAlertsButton]

    this.alerts.forEach(element => {
      this.manageAlertsService.getModifyAccountAlerts(element.accountNumber).subscribe(value => {
        this.resAlerts.push(value)
        if(this.alerts.findIndex(item => item.accountNumber == element.accountNumber)===this.alerts.length-1){
          this.drawPage();
        }
      });

    });

  }

  drawPage() {
    this.pages = [];
    this.pages = [new PageModel(1, deleteForm())];

    this.resAlerts.forEach(element => {

      this.pages[0].forms[0].addControl('alert'+(this.resAlerts.findIndex(item => item.notificationAccount == element.notificationAccount)+1).toString(), new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: "title",
          title: this.translate.instant('manage-alerts.alert')+ ' '+(this.resAlerts.findIndex(item => item.notificationAccount == element.notificationAccount)+1).toString(),
          type: 'Section',
        },
      }))

      this.pages[0].forms[0].addControl(element.notificationAccount, new TitleControl({
        columnCount: 4,
        order: 1,
        controlOptions: {
          id: "account",
          title: 'manage-alerts.account',
          type: 'Section',
          subTitle:element.notificationAccount
        },
      }))

      this.pages[0].forms[0].addControl(element.mobile, new TitleControl({
        columnCount: 4,
        order: 1,
        controlOptions: {
          id: "phone",
          title: 'manage-alerts.phone',
          type: 'Section',
          subTitle:element.mobile
        },
      }))

      this.pages[0].forms[0].addControl(element.language, new TitleControl({
        columnCount: 4,
        order: 1,
        controlOptions: {
          id: "language",
          title: 'manage-alerts.language',
          type: 'Section',
          subTitle:element.language==='A'?'manage-alerts.arabic':'manage-alerts.english'
        },
      }))

      element.notificationList.forEach(item => {
        this.pages[0].forms[0].addControl(item.notificationType,
          new SelectionControl({
            order: 4,
            columnCount: 6,
            required: false,
            controlOptions: {
              title: [{text: this.translate.currentLang==='en'?item.englishDescription:item.arabicDescription}]
            },
            value: item.notificationFlag==='Y'?true:false
          }),
          )
        this.pages[0].forms[0].addControl('amount'+item.notificationType,
          new NumberInputControl({
            order: 4,
            columnCount: 6,
            label: "manage-alerts.amount",
            class: "text-start color-arb-primaryText",
            value: item.notificationAmount.toString(),

          })
          )
      });
    });

    this.pages[0].forms[0].disableControls()

  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput): void {
      switch (formButtonClickOutput.buttonId) {
        case 'cancel':
        case 'alerts':
          this.router.navigateByUrl('/user-profile/manage-alerts')
          break;
        case 'Delete':
          this.deleteAlert()
          break;
        case 'dashboard':
          this.router.navigateByUrl('/')
          break;
      }
  }


  returnDeleteRequest(): AlertsDeleteReqModel {
    const accounts:string[]=[]
    this.resAlerts.forEach(element => {
      accounts.push(element.notificationAccount)
    });
    return {
      deleteAccountList: accounts
    }
  }


  deleteAlert(){
    this.manageAlertsService.deleteAlerts(this.returnDeleteRequest()).subscribe({
      next: (res: any) => {
        this.pages = [new PageModel(1,successForm())];
        this.startButtons=[]
        this.endButtons = [this.goDashboardButton,this.goAlertButton];
      },
      error: (error: ResponseException) => {
        this.pages = [new PageModel(1,errorForm())];
        this.startButtons=[]
        this.endButtons = [this.goDashboardButton,this.goAlertButton];
      }
    });
  }

}
