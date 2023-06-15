import {SummarySectionModel} from "arb-design-library/model/summary-section.model";
import {TranslateService} from "@ngx-translate/core";
import {KeyValueModel} from "../model/rest/common/key-value.model";
import {SummaryItemModel} from "arb-design-library/model/summary-item.model";
import {FutureSecurityLevelsDtolist} from "../model/rest/common/batchResponse";
import {FormModel} from "../model/dto/formModel";
import {AccountControl} from "../model/dto/control/account-control";
import {SummaryItemControl} from "../model/dto/control/sumery-item-control";
import {ServiceLocator} from "../service/base/service-locator.service";
import {DropdownControl} from "../model/dto/control/dropdown-control";
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {DateControl} from "../model/dto/control/date-control";
import {BreadcrumbModel} from "arb-design-library/model/breadcrumb.model";
import {BreadcrumbService} from "../service/base/breadcrumb.service";
import {SecurityDetail} from "../model/rest/common/security-detail.model";
import {StatusLevels} from "../model/dto/statusLevels.model";
import {formatDate} from "@angular/common";
import {TableControl} from "../model/dto/control/table-control";
import {UploadControl} from "../model/dto/control/upload-control";
import {TitleControl} from "../model/dto/control/title-control";
import * as XLSX from "xlsx";
import {AuthenticationUtils} from "./authentication-utils";

export class Utils {


  /**
   * This method return number in certain range
   * @param min  min range to start with
   * @param max  max range to end with
   * */
  public static random(min: number, max: number): number {
    return Math.round((Math.random() * (Math.abs(max - min))) + min);
  }

  /**
   * This method return section of current and next status
   * @param translate  Translate Service
   * @param futureSecurityLevelsDTOList  Future Status DTO List
   * */
  public static getCurrentLevelAndNextLevelSummarySection(translate: TranslateService,
                                                          futureSecurityLevelsDTOList:
                                                            FutureSecurityLevelsDtolist[]):
    SummarySectionModel {

    if (!AuthenticationUtils.isBasic) {
      let nextLevels: any[] = [];
      let currentLevels: any[] = [];

      for (let index = 0; index < futureSecurityLevelsDTOList.length; index++) {
        if (futureSecurityLevelsDTOList[index].status === "I" || futureSecurityLevelsDTOList[index].status === "A") {
          if (AuthenticationUtils.isMakerChecker) {
            if (futureSecurityLevelsDTOList[index].level === 1) {
              currentLevels.push(translate.instant('pendingAuthorization.maker'));
            } else if (futureSecurityLevelsDTOList[index].level === 2) {
              currentLevels.push(translate.instant('pendingAuthorization.checker'));
            }
          } else {
            currentLevels.push(translate.instant('pendingAuthorization.level')
              .concat(' ' + futureSecurityLevelsDTOList[index].level))
          }
        } else if (futureSecurityLevelsDTOList[index].status === "P") {
          if (AuthenticationUtils.isMakerChecker) {
            if (futureSecurityLevelsDTOList[index].level === 1) {
              nextLevels.push(translate.instant('pendingAuthorization.maker'));
            } else if (futureSecurityLevelsDTOList[index].level === 2) {
              nextLevels.push(translate.instant('pendingAuthorization.checker'));
            }
          } else {
            nextLevels.push(translate.instant('pendingAuthorization.level')
              .concat(' ' + futureSecurityLevelsDTOList[index].level))
          }
        }
      }

      if (currentLevels.length > 0) {
        let statusSection: SummarySectionModel = {
          title: {
            id: 'statusTitle',
            title: translate.instant('pendingAuthorization.status'),
          },
          items: [
            {
              title: translate.instant('pendingAuthorization.current-level'),
              subTitle: currentLevels.join(', ')
            }
          ]
        };

        if (nextLevels.length > 0) {
          statusSection.items?.push({
            title: translate.instant('pendingAuthorization.next-levels'),
            subTitle: nextLevels.join(', ')
          })
        }
        return statusSection;
      }
    }
    return {};
  }

  public static getCurrentLevelSummaryItem(translate: TranslateService,
                                           futureSecurityLevelsDTOList:
                                             FutureSecurityLevelsDtolist[] | undefined): SummaryItemModel {

    if (!AuthenticationUtils.isBasic) {
      let currentLevels: any[] = [];

      if (futureSecurityLevelsDTOList) {
        for (let index = 0; index < futureSecurityLevelsDTOList.length; index++) {
          if (futureSecurityLevelsDTOList[index].status === "I" || futureSecurityLevelsDTOList[index].status === "A") {
            if (AuthenticationUtils.isMakerChecker) {
              if (futureSecurityLevelsDTOList[index].level === 1) {
                currentLevels.push(translate.instant('pendingAuthorization.maker'));
              } else if (futureSecurityLevelsDTOList[index].level === 2) {
                currentLevels.push(translate.instant('pendingAuthorization.checker'));
              }
            } else {
              currentLevels.push(translate.instant('pendingAuthorization.level')
                .concat(' ' + futureSecurityLevelsDTOList[index].level))
            }
          }
        }

        if (currentLevels.length > 0) {
          return {
            title: translate.instant('pendingAuthorization.current-level'),
            subTitle: currentLevels.join(', ')
          };
        }
        return {};
      }
    }
    return {};
  }

  public static getNextLevelSummaryItem(translate: TranslateService,
                                        futureSecurityLevelsDTOList:
                                          FutureSecurityLevelsDtolist[] | undefined): SummaryItemModel {

    if (!AuthenticationUtils.isBasic) {
      let nextLevels: any[] = [];

      if (futureSecurityLevelsDTOList) {
        for (let index = 0; index < futureSecurityLevelsDTOList.length; index++) {
          if (futureSecurityLevelsDTOList[index].status === "P") {
            if (AuthenticationUtils.isMakerChecker) {
              if (futureSecurityLevelsDTOList[index].level === 1) {
                nextLevels.push(translate.instant('pendingAuthorization.maker'));
              } else if (futureSecurityLevelsDTOList[index].level === 2) {
                nextLevels.push(translate.instant('pendingAuthorization.checker'));
              }
            } else {
              nextLevels.push(translate.instant('pendingAuthorization.level')
                .concat(' ' + futureSecurityLevelsDTOList[index].level))
            }
          }
        }

        if (nextLevels.length > 0) {
          return {
            title: translate.instant('pendingAuthorization.next-levels'),
            subTitle: nextLevels.join(', ')
          };
        } else {
          return {
            title: translate.instant('pendingAuthorization.next-levels'),
            subTitle: translate.instant('payments.userApproval.completed'),
          };
        }
      }
    }
    return {};

  }

  /**
   * This method convert model properties to Key Value Model list
   * @param props  properties object
   * */
  public static getModelList(props: any): KeyValueModel[] {
    return Object.keys(props).map((key) => {
      let KeyValue: KeyValueModel = {key: key, value: props[key]}
      return KeyValue;
    });
  }

  /**
   * This method returns each Currency Icon
   * @param currencyIso  Currency Iso
   * */
  public static getIconByCurrencyIso(currencyIso: string): string {
    switch (currencyIso) {
      case '608':
        return "arb-icon-srCircle";
      case '338':
        return "arb-icon-yenCircle";
      case '760':
        return "arb-icon-poundCircle";
      case '375':
        return "arb-icon-euroCircle";
      case '752':
      case '753':
        return "arb-icon-dollarCircle";
      default:
        return "arb-icon-userInfo";
    }

  }

  public static getAccountAndAlias(accounts: any[], fullAccountNumber: string): string {
    let alias = fullAccountNumber;
    accounts.forEach(item => {
      if (item.fullAccountNumber == fullAccountNumber) {
        alias = item.alias + ' ' + fullAccountNumber;
      }
    });
    return alias;
  }

  public static getToday(): NgbDateStruct {
    let date = new Date();
    return {day: date.getDate(), month: date.getMonth(), year: date.getFullYear()};
  }

  public static getFutureDate(interval: number): NgbDateStruct {
    let date = new Date();
    date.setDate(date.getDate() + interval);
    return {day: date.getDate(), month: date.getMonth(), year: date.getFullYear()};
  }

  public static getFormSummaryItem(form: FormModel): SummaryItemModel[] {
    let itemModels: SummaryItemModel[] = []
    for (let key in form.controls) {
      this.fetchSummaryItems(form, key, itemModels)
    }
    return itemModels;
  }

  public static getSummaryWithTablesSections(form: FormModel): SummarySectionModel[] {
    let sectionModels: SummarySectionModel[] = [];
    let summarySectionModel: SummarySectionModel = {};
    let itemModels: SummaryItemModel[] = []
    for (let key in form.controls) {
      if (!form.controls[key].hidden) {
        if (form.controls[key] instanceof TableControl) {
          if (itemModels.length > 0) {
            let summarySectionModel: SummarySectionModel = {
              items: itemModels
            };
            sectionModels.push(summarySectionModel);
            itemModels = [];
          }
          summarySectionModel = Object.create({});
          summarySectionModel.table = {
            data: form.controls[key].controlOptions.data,
            columnId: form.controls[key].controlOptions.columnId,
            headers: form.controls[key].controlOptions.headers,
            isDisabled: true,
            maxDisplayRow: 1000
          }
          sectionModels.push(summarySectionModel)
        }
        else if (form.controls[key] instanceof DropdownControl) {
          if ((form.controls[key] as DropdownControl).controlOptions.isCheckboxList && form.controls[key].value) {
            let summarySectionModel: SummarySectionModel = {
              title: {
                id: "checkBoxSummary",
                title: form.controls[key].label,
                chips: []
              }
            };
            for (let selected of form.controls[key].value) {
              if (selected.id)
                summarySectionModel.title!.chips!.push({
                  id: selected.id,
                  label: (selected.displayText) ? selected.displayText : selected.title,
                  showClose: false
                })
            }
            if (summarySectionModel.title?.chips?.length != 0) {
              sectionModels.push(summarySectionModel);
              itemModels = [];
            }
          }
        }
        else if (form.controls[key] instanceof TitleControl) {
          if (itemModels.length > 0) {
            summarySectionModel.items = itemModels;
            sectionModels.push(summarySectionModel)
            itemModels = []
          }
          summarySectionModel = {
            title: {
              id: 'section-' + key,
              title: (form.controls[key] as TitleControl).controlOptions.title,
              type: "Section"
            }
          };
        }
        else {
          this.fetchSummaryItems(form, key, itemModels)
        }
      }
    }
    if (itemModels.length > 0) {
      summarySectionModel = {
        items: itemModels
      };
      sectionModels.push(summarySectionModel);
    }
    return sectionModels;
  }

  public static isEmptyOrNullList(list: any[]): boolean {
    return list.length === 0 || !list
  }

  public static setBreadcrumb(breadcrumb: BreadcrumbModel[]) {
    let breadcrumbService: BreadcrumbService = ServiceLocator.injector.get(BreadcrumbService)
    breadcrumbService.setBreadcrumb([]);
    breadcrumbService.setBreadcrumb(breadcrumb);
  }

  public static getErrorsWithoutErrorTable(data: any) {
    let newData: any = {};
    Object.keys(data).forEach(key => {
      if (key == "errorTable.E000") {
        newData["null"] = data[key];
      } else {
        let value = data[key];
        key = key.replace("errorTable.", "");
        newData[key] = value
      }
    });
    return newData;
  }

  public static getErrorsWithErrorTable(data: any, translate: TranslateService) {
    data["errorTable.null"] = translate.instant("public.sentToBank");
    return data;
  }

  public static getOrderFilterType(filterTypeObject: any): any[] {
    let orderFilters = filterTypeObject.order.split(',');
    let orderList: any[] = [];
    orderFilters.forEach((order: any) => {
      const comboItem = {
        key: order,
        value: filterTypeObject[order],
      }
      orderList.push(comboItem);
    })

    return orderList;
  }

  public static checkRegex(str: string) {
    const checkSpecial = /[*@!#%&()^~{}]+/.test(str);
    const checkUpper = /[A-Z]+/.test(str);
    return checkUpper && checkSpecial;
  }

  public static getLevels(securityLevels: SecurityDetail[], translate: TranslateService): StatusLevels {
    let status = ''
    let nextStatus = ''
    for (let index = 0; index < securityLevels.length; index++) {
      const batchSecurityDTO: SecurityDetail = securityLevels[index]
      if (batchSecurityDTO.status == 'I' || batchSecurityDTO.status == 'A') {
        status = status + ' L' + batchSecurityDTO.level
      } else {
        nextStatus = nextStatus + ' L' + batchSecurityDTO.level
      }
    }
    status = status + '\t'

    if (nextStatus == '') {
      if (translate.currentLang == 'en') {
        nextStatus = translate
          .instant('public.completed')
      } else {
        nextStatus = translate
          .instant('public.completed')
      }
    }
    return new StatusLevels(status, nextStatus);
  }

  public static getDateFormatted(date: { year: number, month: number, day: number }, format: string): any | null {
    if(!date) return null
    return formatDate(new Date(date.year + "/" + date.month + "/" + date.day), format, 'en-US');
  }

  public static getObjectFromFormControls(form: FormModel,
                                          configMap: [string, string][],
                                          objectType: any): any {
    configMap.forEach((mappingArray) => {
      let controlKey = mappingArray[0];
      let mappedKey = mappingArray[1];
      let control = form.controls[controlKey];
      objectType[mappedKey] = (control && control.value) ?
        control.value : null;
    });
    return objectType;
  }

  public static blobToBase64(blob: Blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  public static changeControlsState(formModel: FormModel,
                                    controlsName: string[],
                                    show: boolean,
  ) {
    controlsName.forEach((control: any) => {
      let controlItem = formModel.controls[control];
      try {
        (!show) ? controlItem.setValue("") : "";
        (!show) ? controlItem.disable() : controlItem.enable();
        (!show) ? controlItem.hidden = true : controlItem.hidden = false;
      } catch (e) {
        console.log('Control does not exist')
      }
    });
  }


  public static getPendingActionIcon(type: string): string {
    switch (type) {
      case 'pos':
        return 'arb-icon-posSetting';
      case 'bills':
        return 'arb-icon-Bill';
      case 'moi':
        return 'arb-icon-goverment';
      case 'cards':
        return 'arb-icon-card';
      case 'transfer':
        return 'arb-icon-Two-Arrows';
      case 'beneficiary':
        return 'arb-icon-Users';
      case 'chequebook':
        return 'arb-icon-book';
      case 'wpsPayroll':
        return 'arb-icon-wps';
      case 'balanceCertificate':
        return 'arb-icon-Doc-with-badge';
      case 'aramco':
        return 'arb-icon-logoAramco';
      case 'standingOrders':
        return 'arb-icon-refresh2Arrows';
      case  'payroll':
        return 'arb-icon-documentWithPlusText';
      default:
        return 'arb-icon-watch';
    }
  }

  private static fetchSummaryItems(form: FormModel, key: string, itemModels: SummaryItemModel[]) {
    if (!form.controls[key].hidden) {
      if (typeof form.controls[key]?.value === 'string' || typeof form.controls[key]?.value === 'number') {
        if (form.controls[key]?.label) {
          let summaryItemModel: SummaryItemModel = {
            title: form.controls[key]?.label,
            subTitle: form.controls[key].value.toString(),
          }
          itemModels.push(summaryItemModel);
        }
      } else if (form.controls[key] instanceof UploadControl) {

      } else if (form.controls[key] instanceof AccountControl) {
        let summaryItemModel: SummaryItemModel = {
          title: "public.account",
          subTitle: (form.controls[key].value.alias) ?
            form.controls[key].value.alias + ' - ' +
            form.controls[key].value.fullAccountNumber
            : form.controls[key].value.fullAccountNumber,
        }
        itemModels.push(summaryItemModel);
      } else if (form.controls[key] instanceof DropdownControl) {
        if (!(form.controls[key] as DropdownControl).controlOptions.isCheckboxList) {
          if (form.controls[key].value) {
            let summaryItemModel: SummaryItemModel = {
              title: form.controls[key].label,
              subTitle: form.controls[key].value[form.controls[key].controlOptions.textField]
            }
            itemModels.push(summaryItemModel);
          }
        } else if (form.controls[key] instanceof SummaryItemControl) {
          let summaryItemModel: SummaryItemModel = {
            title: form.controls[key].label,
            subTitle: (form.controls[key].controlOptions && form.controls[key].controlOptions.value) ?
              form.controls[key].controlOptions.value : form.controls[key].value,
            currency: (form.controls[key].controlOptions && form.controls[key].controlOptions.currency) ?
              form.controls[key].controlOptions.currency : null
          }
          itemModels.push(summaryItemModel);
        } else if (form.controls[key] instanceof DateControl) {
          if (form.controls[key].value) {
            let summaryItemModel: SummaryItemModel = {
              title: form.controls[key].label,
              subTitle: form.controls[key].value.year + '-' +
                form.controls[key].value.month + '-' + form.controls[key].value.day,
            }
            itemModels.push(summaryItemModel);
          }
        }
      }
    }
  }

  public static scrollTop() {
    setTimeout(() => {
      document.getElementsByClassName('mainApp')[0].scrollTo(0, 0);
    })
  }

  public static convertExcelToJson(file: File, columns: string[]): Promise<any[]> {
    return new Promise(function (resolve, reject) {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (event) => {
        if (event.target != null) {
          let binaryData = event.target.result;
          let workBook = XLSX.read(binaryData, {type: 'binary'});
          workBook.SheetNames.forEach((sheet: any) => {
            const jsonData = XLSX.utils.sheet_to_json(workBook.Sheets[sheet], {
              header: columns,
              blankrows: false
            }); //replace file header with input columns
            jsonData.splice(0, 1); //remove file header
            resolve(jsonData);
          });
        }
        reject();
      };
    });
  }

  public static saveDownloadedBlobFile(response: any, fileName: string) {
    const downloadUrl = URL.createObjectURL(response)
    const link = document.createElement('a')
    link.download = fileName
    link.href = downloadUrl
    document.body.appendChild(link)
    link.click()
  }

  static getTranslation(key: string, params?: any): string {
    return ServiceLocator.injector.get(TranslateService).instant(key, params);
  }

  static translateWithParams(key: string, params?: any): string {
    const translatedParams: any = {};
    Object.keys(params).forEach(key => {
      //data.push({ key, value: object[key] });
      translatedParams[key] = ServiceLocator.injector.get(TranslateService).instant(params[key]);
    });
    return ServiceLocator.injector.get(TranslateService).instant(key, translatedParams);
  }

  static mask(text: string, umMaskLength: number):string {
    if (text) {
      return text.slice(0, (-1 * umMaskLength))
          .replace(/./g, '*')
        + text.slice((-1 * umMaskLength))
    }
    return ""
  }

}

