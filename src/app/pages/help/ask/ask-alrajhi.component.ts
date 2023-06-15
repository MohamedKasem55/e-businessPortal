import { Component } from '@angular/core';
import { TransactionFollowBase } from 'app/shared/transaction-follow-base/transaction-follow-base';
import { FormResult, PageModel } from 'app/@core/model/dto/formModel';
import { askDetailsForm, getResultFormPopup } from './ask-alrajhi-controls';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { PopupService } from 'app/@core/service/base/popup.service';
import { AskAlRajhiService } from 'app/@core/service/ask/ask-alrajhi.service';
import { PopupOutputModel } from 'app/@core/model/dto/popup.model';
import { serviceAndProblemModel } from 'app/@core/model/rest/ask/ask-alrajhi/service-problem-res.model';
import { askAlRajhiResModel } from 'app/@core/model/rest/ask/ask-alrajhi/ask-alrajhi-res.model';
@Component({
  selector: 'app-ask-alrajhi',
  templateUrl: './ask-alrajhi.component.html',
})
export class AskAlRajhiComponent extends TransactionFollowBase {
  askResponseForm = getResultFormPopup();
  servicesList: any = [];
  problemsList: any = [];
  ticketNumber:any;

  constructor(
     private popupService: PopupService, 
     private askService: AskAlRajhiService,
     ) {
    super();
    this.pageTitle = {
      id: "ask-al-Rajhi",
      title: "help.ask-alrajhi",
      subTitle: "help.subTitle",
    }
    this.drawPage();
    this.setBreadcrumb([{
      text: 'help.title',
      url: '/help'
    },
    { text: 'help.ask-alrajhi', url: '' }]);
    this.getAskServiceNames();
    this.getAskProblemNames();
    this.nextButton.text = this.translate.instant("help.send");
  }

  drawPage() {
    this.pages = [];
    this.pages = [new PageModel(1, askDetailsForm())];
  }

  getAskServiceNames() {
    this.askService.getServiceAndProblemList(['askToAlRajhiService']).subscribe((res: serviceAndProblemModel[]) => {
      const keys = Object.keys(res[0].props);
      const output = res[0].props;
      for (const key of keys) {
        this.servicesList.push({
          key,
          value: output[key],
        })
      }
      this.getControl(0, 0, "service").controlOptions.options = this.servicesList;
    });
  }

  getAskProblemNames() {
    this.askService.getServiceAndProblemList(['askToAlRajhiServiceProblem']).subscribe((res: serviceAndProblemModel[]) => {
      const keys = Object.keys(res[0].props);
      const output = res[0].props;
      for (const key of keys) {
        this.problemsList.push({
          key,
          value: output[key],
        })
      }
      this.getControl(0, 0, "problem").controlOptions.options = this.problemsList;
    });
  }

  nextClick() {
    // this.ticketNumber = null;
    const FormData = {
      comments: this.getControl(0, 0, "description").value,
      contactName: this.getControl(0, 0, "CoustomerName").value,
      email: this.getControl(0, 0, "email").value,
      mobileNumber: "0" + this.getControl(0, 0, "mobile").value,
      problemValue: this.getControl(0, 0, "problem").value.key,
      serviceValue: this.getControl(0, 0, "service").value.key,
    };
    this.askService.submitData(FormData).subscribe((submitResponse:askAlRajhiResModel[]) => {
      if (submitResponse) {
        // this.ticketNumber = submitResponse.ticketCode;
        // this.askResponseForm.form!.controls['ticketNumber'].label = this.translate.instant('help.ticketMessage') +  this.ticketNumber;
        this.popupService.showPopup(this.askResponseForm).subscribe((model: PopupOutputModel) => {
          if (model.buttonId === "goToDashBoard") {
            this.router.navigate(['/dashboard']);
            this.popupService.dismiss();
            this.setBreadcrumb([{
              text: 'help.dashboard',
              url: '/dashboard'
            }]);
          } else {
            this.popupService.dismiss();
          }
        });
      }
    });

  }

  backClick() {
    this.router.navigate(['/help']);
  }

  override onResultChanged(data: FormResult[]): void {
    let valid = true;
    data.forEach(item => {
      valid = valid && item.valid;
    })
    this.endButtons[0].isDisable = !valid;
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'Next':
        this.nextClick();
        break;
      case 'Back':
        this.backClick();
        break;
    }
  }
}
