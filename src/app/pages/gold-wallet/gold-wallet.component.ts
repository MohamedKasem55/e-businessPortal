import { Component, OnInit } from "@angular/core";
import { AlertModel } from "app/@core/model/dto/alert.model";
import { PopupOutputModel } from "app/@core/model/dto/popup.model";
import { PopupService } from "app/@core/service/base/popup.service";
import { GoldWalletService } from "app/@core/service/gold-wallet/gold-wallet.service";
import { GoldWalletBaseComponent } from "./gold-wallet-base/gold-wallet-base.component";
import { getErrorForm } from "./gold-wallet-control";
import {AuthenticationUtils} from "../../@core/utility/authentication-utils";
import {Utils} from "../../@core/utility/Utils";

@Component({
  selector: 'app-gold-wallet',
  templateUrl: './gold-wallet-base/gold-wallet-base.component.html',
  styleUrls: []
})

export class GoldWalletComponent extends GoldWalletBaseComponent implements OnInit {
  override alert!: AlertModel | null;
  constructor(private goldWalletService: GoldWalletService,private popupService: PopupService) {
    super();
    this.hasAccess = AuthenticationUtils.hasAccess('GoldWallet')
    if (this.hasAccess) {
      this.goldWalletService.getOnBoardInitiate().subscribe((res: any) => {
        if (!res.eligible) {
          this.showErrorModal()
        } else {
          if (res.hasExistingWallet) {
            void this.router.navigate(['/gold-wallet/dashboard']);
          } else if (!res.hasExistingWallet) {
            void this.router.navigate(['/gold-wallet/on-boarding']);
          }
        }
      });
    }
    else {
      this.result = {
        type: "Warning",
        title: Utils.translateWithParams(
          'public.company-admin-only',{field: 'gold-wallet.title'}),
        summary: undefined
      }
    }
  }

  override ngOnInit(): void {
    super.ngOnInit();


  }


  private showErrorModal() {

    this.popupService.showPopup( {image: 'assets/img/error.svg',
    form: getErrorForm()}).subscribe((res: PopupOutputModel) => {
      switch (res.buttonId) {
        default:
          this.popupService.dismiss()
          this.router.navigateByUrl("/dashboard").then(() => {
          });
          break;
      }

    });
  }

}
