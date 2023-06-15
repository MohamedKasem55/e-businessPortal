import {Component} from '@angular/core';
import {
  getAmountType,
  getFrequencyObject,
  landingStandingOrderTable,
  standingOrderDetails
} from "../standing-order-controls";
import {Router} from "@angular/router";
import {StandingOrderService} from "../../../../@core/service/transfer/standing-order/standing-order.service";
import {PageModel} from "../../../../@core/model/dto/formModel";
import {TableControl} from "../../../../@core/model/dto/control/table-control";
import {PopupService} from "../../../../@core/service/base/popup.service";
import {StandingOrder} from "../../../../@core/model/rest/transfer/standing-order/standing-order-list-res";
import {Utils} from "../../../../@core/utility/Utils";
import {AuthenticationUtils} from "../../../../@core/utility/authentication-utils";

@Component({
  selector: 'app-standing-order-landing',
  templateUrl: './standing-order-landing.component.html',
  styleUrls: ['./standing-order-landing.component.scss']
})
export class StandingOrderLandingComponent {
  frequencies: any;
  page!: PageModel
  showArrow: boolean = false;
  selectedRow!: StandingOrder;
  showPendingActions: boolean = AuthenticationUtils.showPendingActions;

  constructor(private router: Router,
              private popService: PopupService,
              private service: StandingOrderService) {
    this.drawLanding()
  }

  drawLanding() {
    Utils.setBreadcrumb([
      {text: 'transfer.transfer', url: '/transfer'},
      {text: 'transfer.standingOrder.landing.title', url: ''},
    ]);
    this.page = new PageModel(1, landingStandingOrderTable());
    if (!this.showPendingActions) {
      this.page.forms[0].controls["landingStandingOrderTitle"].controlOptions.endButtons.shift()
    }
    this.getEligibleAccounts();
    this.page.forms[0].controls["account"].valueChanges.subscribe((selectedAccount: any) => {
      this.service.getStandingOrderList(selectedAccount.value.fullAccountNumber).subscribe({
        next: (res) => {
          this.page.forms[0].controls["standingOrderTable"].controlOptions.data = res.standingOrderList;
          this.frequencies = getFrequencyObject();
          this.page.forms[0].controls['standingOrderTable'].controlOptions.headers[4].mapObject = this.frequencies['frequency'];
        },
        error: () => {
          this.page.forms[0].controls["standingOrderTable"].controlOptions.data = [];
        }
      })
    });
    (this.page.forms[0].controls["standingOrderTable"] as TableControl)
      .buttonClicked.subscribe((button) => {
      if (button.buttonId === 'mandateNumber') {

        this.page = new PageModel(1, standingOrderDetails())
        this.page.forms[0].controls['fromAccount'].setValue(button.row.accountFrom)
        this.page.forms[0].controls['toAccount'].setValue(button.row.accountTo)
        this.page.forms[0].controls['amount'].setValue(button.row.amount);
        this.page.forms[0].controls['amtType'].setValue(getAmountType()[button.row.amountOption]);
        this.page.forms[0].controls['freq'].setValue(getFrequencyObject().frequency[button.row.orderType2])
        this.page.forms[0].controls['dayOfTransfer'].setValue(button.row.dayOfMonth)
        this.page.forms[0].controls['remark'].setValue(button.row.remarks)
        this.page.forms[0].controls['dateFrom'].setValue(button.row.dateFrom)
        this.page.forms[0].controls['dateTo'].setValue(button.row.dateTo)
        Utils.setBreadcrumb([
          {text: 'transfer.transfer', url: '/transfer'},
          {text: 'transfer.standingOrder.landing.title', url: '/transfer/standing-orders'},
          {text: 'transfer.standingOrder.detailsView.details', url: ''}
        ]);
      }
      this.selectedRow = button.row;
    })
  }

  getEligibleAccounts() {
    this.service.getEligibleAccounts()
      .subscribe({
        next: (res) => {
          if (res.listAlertsPermissionAccount.length > 0) {
            this.page.forms[0].controls['account']
              .setValue(res.listAlertsPermissionAccount[0])
            this.service.getStandingOrderList(res.listAlertsPermissionAccount[0].fullAccountNumber).subscribe({
              next: (res) => {
                this.page.forms[0].controls["standingOrderTable"].controlOptions.data = res.standingOrderList;
                this.frequencies = getFrequencyObject();
                this.page.forms[0].controls['standingOrderTable'].controlOptions.headers[4].mapObject = this.frequencies['frequency'];
              },
              error: () => {
                this.page.forms[0].controls["standingOrderTable"].controlOptions.data = [];
              }
            })
            this.page.forms[0].controls['account']
              .controlOptions.options = res.listAlertsPermissionAccount;
          } else {
            this.page.forms[0].controls['account']
              .controlOptions.options = res.listAlertsPermissionAccount;
          }
        },
        error: () => {
        }
      });
  }

  clickFormButton(formButtonClickOutput: any) {
    if (formButtonClickOutput.buttonId === 'status') {
      this.router.navigateByUrl('/transfer/approval?type=standingOrder').then(() => {
      });
    } else if (formButtonClickOutput.buttonId === 'add') {
      this.router.navigate(['/transfer/standing-orders/add']).then();
    } else if (formButtonClickOutput.buttonId === 'arrowTitle') {
      if (this.page.forms[0].id === "landingStandingOrderTable") {
        this.router.navigate(['/transfer']).then();
      }
      if (this.page.forms[0].id === "standingOrderDetails") {
        this.drawLanding();
      }
    } else if (formButtonClickOutput.buttonId === 'delete' || formButtonClickOutput.buttonId === 'edit') {
      void this.router.navigate(['/transfer/standing-orders/' + formButtonClickOutput.buttonId], {
        state: {
          standingOrder: this.selectedRow
        }
      });
    }

  }

}
