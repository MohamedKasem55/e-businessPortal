import { Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';

import {Router} from "@angular/router";
import {TabModel} from "arb-design-library/model/tab.model";
import {TitleModel} from "arb-design-library/model/title.model";
import {TranslateService} from "@ngx-translate/core";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ButtonModel} from "arb-design-library/model/button.model";
import {FormModel} from "../../../@core/model/dto/formModel";
import {ButtonControl} from "../../../@core/model/dto/control/button-control";
import {BoxModel} from "arb-design-library/model/box.model";
import {environment} from "../../../../environments/environment";
import {AbstractBaseService} from "../../../@core/service/base/abstract-base.service";
import {Idle} from "@ng-idle/core";
import {Keepalive} from "@ng-idle/keepalive";

@Component({
  selector: 'app-pre-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('openOnlineAccount')
  openOnlineAccountTemplate!: TemplateRef<any>;


  @ViewChild('videoRef') video!: ElementRef;

  showVideo: boolean = false;
  environment = environment.environments;

  selectedTab = "Login";

  forms!: FormModel[];

  tabModels: TabModel[] = [
    {text: "login.login", value: 'Login'},
    {text: 'login.loginId', value: 'LoginWithID'}
  ];
  title: TitleModel = {
    id: "LoginTitle",
    title: "login.login",
    subTitle: "public.welcome",
    type: "Page"
  }

  formModel: FormModel[] = [];
  boxModels: BoxModel[] = [
    {id: "fl", text: "login.fl", icon: "arb-icon-userAccounts", isDisabled: false},
    {id: "sp", text: "login.sp", icon: "arb-icon-userInsideFrame", isDisabled: false},
    {id: "oc", text: "login.oc", icon: "arb-icon-userLogo", isDisabled: false},
    {id: "moc", text: "login.moc", icon: "arb-icon-userGroup", isDisabled: false}
  ]
  button: ButtonModel[] = [{
    id: 'Select',
    type: 'primary',
    text: 'public.select',
    isDisable: true
  }]
  selectedCompanyType!: string;

  constructor(private router: Router, private translate: TranslateService,
              private modalService: NgbModal,
              private abstractBaseService: AbstractBaseService,
              private idle: Idle,
              private keepalive: Keepalive,) {

    this.reset()
    this.formModel.push(new FormModel({
      id: "registration",
      controls: {
        registerBtn: new ButtonControl({
          order: 1,
          controlOptions:
            {
              id: "register",
              type: 'outLine',
              text: 'login.register',
            },
          columnCount: 6,
          staticColumnCount:true,
          class: "button-start"
        }),
        openOnlineAccBtn: new ButtonControl({
          order: 1,
          controlOptions:
            {
              id: "openOnlineAcc",
              type: 'outLine',
              text: "login.opnOnlineAcc",
            },
          columnCount: 6,
          staticColumnCount:true,
          class: "button-end"
        })
      },
    }));
  }

  reset(){
    sessionStorage.clear();
    this.modalService.dismissAll();
    this.idle.stop();
    this.idle.ngOnDestroy();
    this.keepalive.ngOnDestroy();
  }

  canShowVideo() {
    if (!localStorage.getItem("ARB_Business_Video")) {
      this.showVideo = true;
      setTimeout(() => {
        this.video!.nativeElement.addEventListener('error', (e: any) => {
          this.showVideo = false;
          localStorage.setItem("ARB_Business_Video", "true");
        });
      });

      setTimeout(() => {
        this.showVideo = false;
        localStorage.setItem("ARB_Business_Video", "true");
      }, 12000)
    }
  }

  videoEnd() {
    this.showVideo = false;
    localStorage.setItem("ARB_Business_Video", "true");
  }

  ngOnInit(): void {
   // this.canShowVideo();
  }


  changeTabs(value: string) {
    this.selectedTab = value
  }

  onClick(event: any) {
    if (event.buttonId === 'register') {
      window.open('https://eservice.alrajhibank.com.sa/business-eRegistration/' + this.translate.currentLang)
    } else if (event.buttonId === 'openOnlineAcc') {
      this.modalService.open(this.openOnlineAccountTemplate, {
        ariaLabelledBy: 'modal-basic-title',
        modalDialogClass: 'modalHeader',
        centered: true,
        size: "lg"
      })
    }
  }

  onlineAccountOpening() {
    if (this.selectedCompanyType == "fl" || this.selectedCompanyType == "sp" || this.selectedCompanyType == "oc") {
      if (this.translate.currentLang === 'en') {
        window.open(
          'https://eservice.alrajhibank.com.sa/business-accountopening/?lang=en',
        )
      } else {
        window.open(
          'https://eservice.alrajhibank.com.sa/business-accountopening/?lang=ar',
        )
      }
    } else {
      if (this.translate.currentLang === 'en') {
        window.open(
          ' https://www.alrajhibank.com.sa/en/corporate/opencurrentaccountcorporate',
        )
      } else {
        window.open(
          ' https://www.alrajhibank.com.sa/ar/corporate/opencurrentaccountcorporate',
        )
      }

    }
  }

  onValueChange(event: any) {
    this.selectedCompanyType = event
    this.button[0].isDisable = false;
  }

  onDismiss(modalOpenOnlineAccount: any) {
    this.button[0].isDisable = true;
    this.selectedCompanyType = ""
    modalOpenOnlineAccount.dismiss('Cross click')
  }

  changeEnvironment(item: any) {
    this.abstractBaseService.setAppContext(item.value);
  }


}
