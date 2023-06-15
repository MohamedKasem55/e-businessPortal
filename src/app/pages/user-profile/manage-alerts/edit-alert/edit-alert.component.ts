import { Component, OnInit } from '@angular/core';
import { NumberInputControl } from 'app/@core/model/dto/control/number-input-control';
import { SelectionControl } from 'app/@core/model/dto/control/selection-control';
import { TitleControl } from 'app/@core/model/dto/control/title-control';
import { PageModel } from 'app/@core/model/dto/formModel';
import { ValidationsEnum } from 'app/@core/model/dto/validations-enum';
import { AlertsAccountResModel } from 'app/@core/model/rest/manage-alerts/alerts-account-res.model';
import { AlertsPutReqModel } from 'app/@core/model/rest/manage-alerts/alerts-put-req.model';
import { AccountAlerts, NotificationsList } from 'app/@core/model/rest/manage-alerts/alerts-res.model';
import { ResponseException } from 'app/@core/service/base/responseException';
import { ManageAlertsService } from 'app/@core/service/manage-alerts/manage-alerts.service';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { BaseAlertComponent } from '../base-alert/base-alert.component';
import { createForm, errorForm, successForm } from './edit-alert-controls';

@Component({
  selector: 'app-edit-alert',
  templateUrl: '../base-alert/base-alert.component.html',
  styleUrls: []
})
export class EditAlertComponent extends BaseAlertComponent implements OnInit {

  numChecked:number=0
  notificationList: NotificationsList[]=[]
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

  saveButton: ButtonModel = {
    id: 'save',
    text: 'manage-alerts.save',
    type: 'primary',
    isDisable: false,
  };


  constructor(private manageAlertsService:ManageAlertsService) {
    super();
    this.pageTitle = {
      id: "manage-alerts",
      title: "manage-alerts.editAlerts",
    };
    this.alerts = this.router.getCurrentNavigation()!.extras.state?.['alerts']
  }

  override ngOnInit(): void {
    this.setBreadcrumb([{
      text: 'manage-alerts.userProfile',
      url: ''
    }, {text: 'manage-alerts.title', url: '/user-profile/manage-alerts'},
    {text: 'manage-alerts.editAlerts', url: ''}]);
    this.startButtons=[this.cancelButton]
    this.endButtons= [this.saveButton]
    this.endButtons[0].isDisable = true;

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
    this.pages = [new PageModel(1, createForm())];
    this.getAlertsEdit()

  }


  getAlertsEdit() {
    this.manageAlertsService.postLanguages(["languages"]).subscribe(
      {
        next: (res) => {
          this.getControl(0, 0, "language").controlOptions.options = Object.entries(res[0].props).map(entry => {
            return {"key": entry[0], "value": entry[1]};
          });
          this.fillAlertData()
        }
      });


  }

  fillAlertData(){
    this.resAlerts.forEach(element => {
      this.getControl(0, 0, "account").setValue(element.notificationAccount);
      this.getControl(0, 0, "phone").setValue(element.mobile);
      this.getControl(0, 0, "language").setValue(element.language==='A'?
      {
        key: "1",
        value: "arabic",
        displayText: "arabic",
      }:
      {
        key: "2",
        value: "english",
        displayText: "english",
      });

      this.pages[0].forms[0].addControl('alert'+(this.resAlerts.findIndex(item => item.notificationAccount == element.notificationAccount)+1).toString(), new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: "title",
          title: this.translate.instant('manage-alerts.alert')+ ' '+(this.resAlerts.findIndex(item => item.notificationAccount == element.notificationAccount)+1).toString(),
          type: 'Section',
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
            validators:[{
              validation: ValidationsEnum.MIN,
              options: item.minValidationAmount.toString()
            },{
              validation: ValidationsEnum.MAX,
              options: item.maxValidationAmount.toString()
            }],
            validationLabels: {
              pattern: 'public.invalid-pattern',
            }
          })
          )

          this.getControl(0, 0, item.notificationType).valueChanges.subscribe(value => {
            this.checked(value.value,item.notificationType);
          });

          this.getControl(0, 0, 'amount'+item.notificationType).valueChanges.subscribe(value => {
            this.filled(item.notificationType);
          });
      });
    })

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
      }
      this.numChecked++
    }
    else{
      this.numChecked--
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
        case 'save':
          this.disableControls()
          this.newNotificationList()
          break;
        case 'Proceed':
          this.editAlert()
          break;
        case 'dashboard':
          this.router.navigateByUrl('/')
          break;
      }
  }

  newNotificationList(){
    for (let index = 0; index < this.resAlerts[0].notificationList.length; index++) {
      const element=this.resAlerts[0].notificationList[index]
      if(this.getControl(0, 0,element.notificationType )){
        this.notificationList.push({defaultValue:this.getControl(0, 0, 'amount'+element.notificationType).value,notificationType:element.notificationType,notificationAmount:this.getControl(0, 0, 'amount'+element.notificationType).value,arabicDescription:element.arabicDescription,englishDescription:element.englishDescription,maxValidationAmount:element.maxValidationAmount,minValidationAmount:element.minValidationAmount,notificationFlag:this.getControl(0, 0,element.notificationType ).value?'Y':'N'})
      }
    }
  }

  disableControls(){
    this.pages[0].forms[0].disableControls()
    this.endButtons=[this.proceedButton]
  }

  returnEditRequest(): AlertsPutReqModel {

    return {
      originalNotificationList: this.resAlerts[0].notificationList,
      notificationList: this.notificationList,
      accountToModify: this.resAlerts[0].notificationAccount,
      language: this.resAlerts[0].language
    }
  }


  editAlert(){

    this.manageAlertsService.putModifyAlerts(this.returnEditRequest()).subscribe({
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
