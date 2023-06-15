import { Component, OnInit } from '@angular/core';
import { NumberInputControl } from 'app/@core/model/dto/control/number-input-control';
import { SelectionControl } from 'app/@core/model/dto/control/selection-control';
import { PageModel } from 'app/@core/model/dto/formModel';
import { ValidationsEnum } from 'app/@core/model/dto/validations-enum';
import { AlertsAddPostReqModel, NotificationAlert } from 'app/@core/model/rest/manage-alerts/alerts-add-post-req.model';
import { AlertsReqModel } from 'app/@core/model/rest/manage-alerts/alerts-req.model';
import { ResponseException } from 'app/@core/service/base/responseException';
import { ManageAlertsService } from 'app/@core/service/manage-alerts/manage-alerts.service';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { BaseAlertComponent } from '../base-alert/base-alert.component';
import { createForm, errorForm, successForm } from './create-alert-controls';

@Component({
  selector: 'app-create-alert',
  templateUrl: '../base-alert/base-alert.component.html',
  styleUrls: []
})
export class CreateAlertComponent extends BaseAlertComponent implements OnInit {

  listAccount: any[] = [];
  alertsReq!:AlertsReqModel
  numChecked:number=0
  notificationList: NotificationAlert[]=[]

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


  constructor(private manageAlertsService:ManageAlertsService) {
    super();
    this.pageTitle = {
      id: "manage-alerts",
      title: "manage-alerts.createAlerts",
    };
    this.getAlertsAdd()
  }

  override ngOnInit(): void {
    this.setBreadcrumb([{
      text: 'manage-alerts.userProfile',
      url: ''
    }, {text: 'manage-alerts.title', url: '/user-profile/manage-alerts'},
    {text: 'manage-alerts.createAlerts', url: ''}]);
    this.startButtons=[this.cancelButton]
    this.endButtons= [this.nextButton]
    this.endButtons[0].isDisable = true;


    this.drawPage();

  }

  drawPage() {
    this.pages = [];
    this.pages = [new PageModel(1, createForm())];

  }


  setAlertsReq(page?:number, rows?:number) {
    this.alertsReq = {
      page: page || 1,
      rows: rows || 20,
    };
  }

  getAlertsAdd() {
    this.manageAlertsService.getAlertsAdd().subscribe(
      {
        next: (res) => {
          this.getControl(0, 0, "account").controlOptions.options = res.listAccountWithoutAlerts;
          this.getControl(0, 0, "phone").setValue(res.mobile);
          res.notificationList.forEach(element => {
            this.pages[0].forms[0].addControl(element.notificationType,
              new SelectionControl({
                order: 4,
                columnCount: 6,
                required: false,
                controlOptions: {
                  title: [{text: this.translate.currentLang==='en'?element.englishDescription:element.arabicDescription}]
                },
              }),
              )
            this.pages[0].forms[0].addControl('amount'+element.notificationType,
              new NumberInputControl({
                order: 4,
                columnCount: 6,
                label: "manage-alerts.amount",
                class: "text-start color-arb-primaryText",
                value: "",
                validators:[{
                  validation: ValidationsEnum.MIN,
                  options: element.minValidationAmount.toString()
                },{
                  validation: ValidationsEnum.MAX,
                  options: element.maxValidationAmount.toString()
                }],
                validationLabels: {
                  pattern: 'public.invalid-pattern',
                }
              })
              )

              this.getControl(0, 0, element.notificationType).valueChanges.subscribe(value => {
                this.checked(value.value,element.notificationType);
              });

              this.getControl(0, 0, 'amount'+element.notificationType).valueChanges.subscribe(value => {
                this.filled(element.notificationType);
              });
          });
        }
      });

      this.manageAlertsService.postLanguages(["languages"]).subscribe(
        {
          next: (res) => {
            this.getControl(0, 0, "language").controlOptions.options = Object.entries(res[0].props).map(entry => {
              return {"key": [entry[0]], "value": entry[1]};
            });;
          }
        });


  }


  filled(type:string){
    if(!this.getControl(0, 0,'amount'+type).value){
      this.endButtons[0].isDisable=true
    }
    else{
      if(this.getControl(0, 0, type).value){
        this.endButtons[0].isDisable=false
      }
    }

  }

  checked(value: boolean,type:string){
    if(value){
      if(this.getControl(0, 0, 'amount'+type).value){
        this.endButtons[0].isDisable=false
        const index = this.notificationList.findIndex((item) => item.notificationType === type);
        if (index === -1) {
          this.notificationList.push({defaultValue:this.getControl(0, 0, 'amount'+type).value,notificationType:type,notificationAmount:this.getControl(0, 0, 'amount'+type).value})
        }
      }
      this.numChecked++
    }
    else{
      this.numChecked--
      const index = this.notificationList.findIndex((item) => item.notificationType === type);
      if (index !== -1) {
        this.notificationList.splice(index, 1);
      }
      if(this.numChecked<1){
        this.endButtons[0].isDisable=true
      }
    }

  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput): void {
      switch (formButtonClickOutput.buttonId) {
        case 'cancel':
        case 'alerts':
          this.router.navigateByUrl('/user-profile/manage-alerts')
          break;
        case 'Next':
          this.disableControls()
          break;
        case 'Proceed':
          this.createAlert()
          break;
        case 'dashboard':
          this.router.navigate(['/dashboard']).then();
          break;
      }
  }

  disableControls(){
    this.pages[0].forms[0].disableControls()
    this.endButtons=[this.proceedButton]
  }

  returnCreateRequest(): AlertsAddPostReqModel {
    return {
      notificationList: this.notificationList,
      listAccountWithoutAlertsSelected:[this.getControl(0, 0, "account").value],
      language: this.getControl(0, 0, "language").value.value==='english'?'en':'ar'
    }
  }


  createAlert(){
    this.manageAlertsService.postAlertsAdd(this.returnCreateRequest()).subscribe({
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
