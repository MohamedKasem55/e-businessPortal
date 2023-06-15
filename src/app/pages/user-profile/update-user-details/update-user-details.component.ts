import {Component, OnInit} from '@angular/core';
import { Store } from '@ngrx/store';
import {FormResult, PageModel} from 'app/@core/model/dto/formModel';
import {
  LanguageListModel,
  UpdateUserDetailsResponseModel,
  UserDetailsResponseModel
} from 'app/@core/model/rest/update-user-details/update-user-details';
import {CryptoService} from 'app/@core/service/base/crypto.service';
import {UpdateUserDetailService} from 'app/@core/service/update-user-details/update-user-details.service';
import {Utils} from 'app/@core/utility/Utils';
import { SharedStoreFactoryService } from 'app/shared/store/shared-store-factory.service';
import { addUserInfoAction } from 'app/shared/store/shared.action';
import {TransactionFollowBase} from 'app/shared/transaction-follow-base/transaction-follow-base';
import {ButtonModel} from 'arb-design-library/model/button.model';
import {TabModel} from 'arb-design-library/model/tab.model';
import {
  getResetPasswordQuestionsForm,
  getupdateUserDetailsForm,
  geUserUpdateDetailsTabs
} from './update-user-details-controls';

@Component({
  selector: 'app-update-user-details',
  templateUrl: './update-user-details.component.html',
})
export class UpdateUserDetailsComponent extends TransactionFollowBase implements OnInit {
  tabs: TabModel[] = [];
  selectedLanguage: any;
  currentActiveTab: string = '';
  userUpdateReqObj: any;
  languageList: any = [];
  avatarImage: string = '';
  startButton: ButtonModel[] = [
    {
      id: "cancel",
      type: "secondary",
      text: "public.cancel",
      showLoading: false,
    }
  ];

  endButtonForPwdReset: ButtonModel[] = [
    {
      id: "back",
      type: "primary",
      text: "public.back",
      showLoading: false,
    },
    {
      id: "proceed",
      type: "primary",
      text: "public.proceed",
      showLoading: false,
      isDisable: false
    }
  ];

  saveAndDiscard: ButtonModel[] = [
    {
      id: "discard",
      type: "secondary",
      text: "updateUserDetails.discard",
      showLoading: false,
    },
    {
      id: "save",
      type: "primary",
      text: "updateUserDetails.save",
      showLoading: false,
    },
  ];
  endButtonForUserUpdate: ButtonModel =
    {
      id: "editUserDetails",
      type: "primary",
      text: "public.edit",
      showLoading: false,
      isDisable: false
    };
  finalUserDetailsBtn: ButtonModel =
    {
      id: "finalUserDetailsBtn",
      type: "secondary",
      text: "updateUserDetails.updateUserDetailsBtn",
      showLoading: false,
      isDisable: false
    };

  constructor(
    private userDetailService: UpdateUserDetailService,
    private cryptoService: CryptoService,
    private store: Store,
    private sharedStoreService: SharedStoreFactoryService,
  ) {
    super();
    this.setBreadcrumb([{
      text: 'updateUserDetails.userUpdateTitle',
      url: '/userProfile'
    }]);
    this.pageTitle = {
      id: "updateUserDetails",
      title: "",
      stepper: {
        steps: ["", "", ""],
        stepCounter: 1,
        stepText: "public.step",
        ofText: "public.of"
      },
      subTitle: ""
    };
    this.getLanguaguesList();
  }

  getLanguaguesList() {
    if (this.languageList.length === 0) {
      this.userDetailService.getLanguagesList(['languages']).subscribe((data: LanguageListModel[]) => {
        const keys = Object.keys(data[0].props);
        const output = data[0].props;
        for (const key of keys) {
          this.languageList.push({
            key,
            value: output[key],
          })
        }
        this.getControl(0, 0, "language").controlOptions.options = this.languageList;
      });
    }

  }

  ngOnInit(): void {
    this.tabs = geUserUpdateDetailsTabs();
    this.currentActiveTab = this.tabs[0]?.value;
    this.drawUpdateUserDetailsPage();
    this.endButtons = [this.endButtonForUserUpdate];
    this.startButtons = [];
    this.getUserDetails();
  }

  getUserDetails() {
    this.userDetailService.getUserDetails().subscribe((data: UserDetailsResponseModel) => {
      this.getControl(0, 0, "emailControl").setValue(data.email);
      this.getControl(0, 0, "confirmEmailControl").setValue(data.email);
      this.avatarImage = data.image;
      // this.getControl(0, 0, "image").setValue(data.img ? data.img:'');
      this.languageList.forEach((element: any) => {
        if (data['language'] === element.key) {
          this.selectedLanguage = element;
        }
      });
      this.getControl(0, 0, "language").setValue(this.selectedLanguage);
    });
  }

  tabChanged(tabValue: string) {
    this.currentActiveTab = tabValue;
    this.loadCurrentTabData();
    if (this.currentActiveTab === 'userUpdate') {
      this.endButtons = [this.endButtonForUserUpdate];
      this.startButtons = [];
      this.discardUserDetails();
    } else if (this.currentActiveTab === 'updateResetPasswordQuestion') {
      this.endButtons = this.endButtonForPwdReset;
      this.startButtons = this.startButton;
    }
    this.pageTitle.stepper = {
      steps: ["", "", ""],
      stepCounter: 1,
      stepText: "public.step",
      ofText: "public.of"
    };
    this.summary = {};
  }

  loadCurrentTabData() {
    switch (this.currentActiveTab) {
      case 'userUpdate':
        this.drawUpdateUserDetailsPage();
        break;
      case 'updateResetPasswordQuestion':
        this.resetPasswordPage();
        break;
    }
  }

  override onButtonClick(formButtonClickOutput: any) {
    switch (formButtonClickOutput.buttonId) {
      case 'editUserDetails':
        this.enableUserUpdateFormFields();
        break;
      case 'discard':
        this.discardUserDetails();
        break;
      case 'save':
        this.updateUserDetails();
        break;
      case 'finalUserDetailsBtn':
        this.discardUserDetails();
        break;
      case 'proceed':
        this.updatePasswordQuestions();
        break;
      case 'back':
        this.backClick();
        break;
      case 'cancel':
        this.router.navigate(['/dashboard']);
        break;
      default:
        break;
    }
  }

  backClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.router.navigate(['/dashboard']);
        break;
      case 2:
        this.stepperMoveBack();
        break;
    }
  }

  discardUserDetails() {
    this.pageTitle.stepper = {
      steps: ["", "", ""],
      stepCounter: 1,
      stepText: "public.step",
      ofText: "public.of"
    };
    this.endButtons = [this.endButtonForUserUpdate];
    this.summary = {};
    if (this.pageTitle.stepper?.stepCounter !== 1) {
      this.stepperMoveBack();
    }
    if (this.currentActiveTab === 'updateResetPasswordQuestion') {
      this.endButtons = this.endButtonForPwdReset;
      this.startButtons = this.startButton;
      this.getControl(0, 0, "foodControl").setValue('');
      this.getControl(0, 0, "bookControl").setValue('');
      this.getControl(0, 0, "mothersMaidenName").setValue('');
      this.getControl(0, 0, "mobileNumber").setValue('');
    } else {
      this.getUserDetails();
      this.getControl(0, 0, "emailControl").disable();
      this.getControl(0, 0, "confirmEmailControl").disable();
      this.getControl(0, 0, "language").disable();
      this.getControl(0, 0, "image").hidden = true;
      this.getControl(0, 0, "language").controlOptions.options = this.languageList;
      this.getControl(0, 0, "language").setValue(this.selectedLanguage);
    }
  }

  enableUserUpdateFormFields() {
    this.endButtons = this.saveAndDiscard;
    this.getControl(0, 0, "emailControl").enable();
    this.getControl(0, 0, "confirmEmailControl").enable();
    this.getControl(0, 0, "language").enable();
    this.getControl(0, 0, "image").hidden = false;
  }

  async updateUserDetails() {
    if (this.pageTitle.stepper?.stepCounter == 1) {
      this.summary = {
        title: {
          id: "",
          title: "public.summary"
        },
        sections: [
          {
            items: [
              {
                title: "updateUserDetails.email",
                subTitle: this.getControl(0, 0, "emailControl").value
              },
              {
                title: "updateUserDetails.confirEmail",
                subTitle: this.getControl(0, 0, "confirmEmailControl").value
              },
              {
                title: "updateUserDetails.language",
                subTitle: this.getControl(0, 0, "language").value.value
              },
              {
                title: "updateUserDetails.image",
                subTitle: this.getControl(0, 0, "image").value ? this.getControl(0, 0, "image").value.name : null
              }
            ]
          }
        ]
      }
      this.stepperMoveNext();
    } else {
      if (this.getControl(0, 0, "image").value) {
        await Utils.blobToBase64(this.getControl(0, 0, "image").value).then(res => {
          this.userUpdateReqObj = {
            image: res,
            language: this.getControl(0, 0, "language").value.key,
            mail: this.getControl(0, 0, "emailControl").value,
            repeatMail: this.getControl(0, 0, "confirmEmailControl").value,
            uploadImage: true
          };
        });
      } else {
        this.userUpdateReqObj = {
          image: null,
          language: this.getControl(0, 0, "language").value.key,
          mail: this.getControl(0, 0, "emailControl").value,
          repeatMail: this.getControl(0, 0, "confirmEmailControl").value,
          uploadImage: false
        };
      }
      this.userDetailService.updateUserDetails(this.userUpdateReqObj)
      .subscribe(async(data: UpdateUserDetailsResponseModel) => {
        if (this.userUpdateReqObj.uploadImage && this.userUpdateReqObj.image) {
        const user = await this.sharedStoreService.getUserStoredInfo();
        user && this.store.dispatch(
          addUserInfoAction({
            userInfo: {...user, userImage: this.userUpdateReqObj.image},
          })
        );
        }
        this.result = {
          title: "updateUserDetails.success",
          summary: this.summary,
          type: "Success",
          subTitle: "updateUserDetails.successMessage"
        }
        this.stepperMoveNext();
        this.endButtons = [this.finalUserDetailsBtn];
      });
    }
  }

  updatePasswordQuestions() {
    if (this.pageTitle.stepper?.stepCounter == 1) {
      this.summary = {
        title: {
          id: "",
          title: "public.summary"
        },
        sections: [
          {
            items: [
              {
                title: "updateUserDetails.food",
                subTitle: this.getControl(0, 0, "foodControl").value
              },
              {
                title: "updateUserDetails.book",
                subTitle: this.getControl(0, 0, "bookControl").value
              },
              {
                title: "updateUserDetails.MothersName",
                subTitle: this.getControl(0, 0, "mothersMaidenName").value
              },
              {
                title: "updateUserDetails.mobileNumber",
                subTitle: this.getControl(0, 0, "mobileNumber").value
              }
            ]
          }
        ]
      }
      this.stepperMoveNext();
    } else {
      let Obj = {
        challengeQuestionsList: this.buildChallengeQuestionList()
      };
      this.userDetailService.updatePasswordQuestions(Obj).subscribe((data: UpdateUserDetailsResponseModel) => {
        this.result = {
          title: "updateUserDetails.success",
          summary: this.summary,
          type: "Success",
          subTitle: "updateUserDetails.successMessage"
        }
        this.stepperMoveNext();
        this.startButtons = [];
        this.endButtons = [this.finalUserDetailsBtn];
      });
    }
  }

  buildChallengeQuestionList() {
    const challengeQuestionsList = [{
      questionIdStr: this.cryptoService.encryptRSA("1"),
      questionValue: this.cryptoService.encryptRSA(this.getControl(0, 0, "foodControl").value)
    },
      {
        questionIdStr: this.cryptoService.encryptRSA("2"),
        questionValue: this.cryptoService.encryptRSA(this.getControl(0, 0, "bookControl").value)
      },
      {
        questionIdStr: this.cryptoService.encryptRSA("3"),
        questionValue: this.cryptoService.encryptRSA(this.getControl(0, 0, "mothersMaidenName").value)
      },
      {
        questionIdStr: this.cryptoService.encryptRSA("4"),
        questionValue: this.cryptoService.encryptRSA(this.getControl(0, 0, "mobileNumber").value)
      }];
    return challengeQuestionsList;
  }

  drawUpdateUserDetailsPage() {
    this.pages = [];
    this.pages = [new PageModel(1, getupdateUserDetailsForm())];
  }

  resetPasswordPage() {
    this.pages = [];
    this.pages = [new PageModel(1, getResetPasswordQuestionsForm())];
  }

  override onResultChanged(data: FormResult[]): void {
    let valid = true;
    data.forEach(item => {
      valid = valid && item.valid;
    })
    if (this.currentActiveTab === 'updateResetPasswordQuestion') {
      this.endButtons[1].isDisable = !valid;
    } else if (this.currentActiveTab === 'userUpdate' && this.endButtons[1]?.id == 'save') {
      this.endButtons[1].isDisable = !valid;
    }
  }

}
