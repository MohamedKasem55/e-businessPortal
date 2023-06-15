import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { VerificationService } from "app/@core/service/base/verification.service";
import { GenerateChallengeAndOTP, RequestValidate } from 'app/@core/model/rest/common/otp.model';
import { BreadcrumbService } from 'app/@core/service/base/breadcrumb.service';
import { FormModel } from 'app/@core/model/dto/formModel';
import { getreviewControls } from './review.controls';
import { LoadingService } from 'app/@core/service/base/loading.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService } from 'app/@core/service/accounts/accounts.service';
import { AccountsCommonService } from 'app/@core/service/accounts/accounts-common.service';
import { dataGroupList, dataGroupRes } from 'app/pages/accounts/BFM/bfm-dashboard/bfm-dashboard-controls';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
})
export class ReviewComponent implements OnInit {
  lang: string = ""
  chosenBank:{id:string,name:string}={id:"",name:""}
  endButtons: Array<ButtonModel> = []
  startButtons: Array<ButtonModel> = []
  reviewControls: Array<Array<FormModel>> = [[],[]]
  //otp
  generateChallengeAndOTP: GenerateChallengeAndOTP = { typeAuthentication: "OTP" }
  list: Array<List> = []
  constructor(
    private location: Location,
    private verificationService: VerificationService,
    private breadcrumbService: BreadcrumbService,
    private activatedRoute: ActivatedRoute,
    private accountsService: AccountsCommonService,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.initiatePage()
  }
  initiatePage() {
    this.lang = this.translate.currentLang
    this.getStateFromRoute()
    this.setPageButtons()
  }
  getStateFromRoute() {
    this.activatedRoute.queryParams.subscribe(data => {
      this.updateBreadCrumbs(data['previousRoute'])
      this.chosenBank ={
        id:data['chosenBankId'] || null,
        name:data['chosenBankName'] || null
      }      
      this.updateBankView()
    })
  }

  updateBankView() {
    this.accountsService.getDataGroupList(this.chosenBank.id).subscribe((response: dataGroupRes) => {
      this.updateList(response)
      this.updateReviewControl()
    })
  }
  updateList(response: dataGroupRes){
    response.dataGroupsList.forEach((el: dataGroupList) => {
      let obj:List = {
        id:el.dataGroupId,
        title:{
          text: this.lang == "en" ? el.descriptionEN : el.descriptionAR ,
          prefixIcon :icons[el.dataGroupId] 
        },
        content:""
      }
      this.list.push(obj)
    })
  }
  updateReviewControl(){
    let bankInfo = {
      name: this.chosenBank.name,
      description: `For you to use the service, Alrajhi needs to access information from your account at ${this.chosenBank.name}`,
      imageSrc: "assets/banksLogo/005.png"
    }      
    this.reviewControls = getreviewControls(bankInfo)
  }
  setPageButtons() {
    this.endButtons = [{ id: "connectBank", text: "Connect With Bank", type: "primary" }]
    this.startButtons = [{ id: "back", text: "Back", type: "secondary" }]
  }
  btnClickHandler(btn: string) {
    console.log(btn)
    switch (btn) {
      case "back":
      case "arrowTitle":
        this.location.back()
        break;
      case "connectBank":
        this.connectBankHandler()
        break;
      default:
        break;
    }
  }
  connectBankHandler() {
    this.verificationService
      .showVerification(this.generateChallengeAndOTP)
      .subscribe((res) => {
        console.log(res)
      });
  }
  updateBreadCrumbs(previous:string){
    if(previous == "BFM")
      this.breadcrumbService.setBreadcrumb([
        {
            "text": "Accounts",
            "url": "/accounts"
        },
        {
            "text": "Business Finance Manager",
            "url": "/accounts/bfm"
        },
        {
            "text": "Review",
            "url": "/review"
        }
    ])
  }
}

interface List {
  id: string,
  title: {
    text: string,
    prefixIcon: string,
  },
  content: string
}
const icons:any = {
  ACCOUNT_DETAILS : "arb-icon-userInfo",
  ACCOUNT_TRANSACTIONS : "arb-icon-Two-Arrows",
  REGULAR_PAYMENTS : "arb-icon-withdrawalMoney",
  PARTY_DETAILS : "arb-icon-document",
}
const list =[
  {
    id: "1",
    title: {
      text: "Account Details",
      prefixIcon: "arb-icon-userInfo",
    },
    content:
      "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.",
  },
  {
    id: "2",
    title: {
      text: "Account Transactions",
      prefixIcon: "arb-icon-Two-Arrows",
    },
    content:
      "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.",
  },
  {
    id: "3",
    title: {
      text: "Your Regular Payment",
      prefixIcon: "arb-icon-withdrawalMoney",
    },
    content:
      "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.",
  },
  {
    id: "4",
    title: {
      text: "Contact and Party Details",
      prefixIcon: "arb-icon-document",
    },
    content:
      "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.",
  },
]
