import {Injectable} from "@angular/core";
import {Observable, Subscriber} from "rxjs";
import {ArbNotosansBoldNormal} from "./pdf-fonts/arb-notosans-bold-normal";
import {ArbNotosansRegularNormal} from "./pdf-fonts/arb-notosans-regular-normal";
import {TranslateService} from "@ngx-translate/core";
import {SummaryModel} from "arb-design-library/model/summary.model";
import {TitleModel} from "arb-design-library/model/title.model";
import {SummaryItemModel} from "arb-design-library/model/summary-item.model";

import jspdf from "jspdf";
import autoTable from "jspdf-autotable";
import "jspdf-autotable";
import {CurrencyPipe} from "../../pipe/currency.pipe";
import {AmountPipe} from "../../pipe/amount.pipe";
import {LoadingService} from "../base/loading.service";


@Injectable({providedIn: "root"})
export class ExportPDFService {

  constructor(private translate: TranslateService,
              private readonly currencyPipe: CurrencyPipe,
              private readonly amountPipe: AmountPipe,
              private loadingService: LoadingService,
  ) {
  }


  exportTable(fileName: string, title: string, data: string[][], headers: string[], print: boolean = false): Observable<null> {
    return new Observable((observer: Subscriber<any>) => {
      fileName = this.translate.instant(fileName);
      title = title.length>0?this.translate.instant(title):'';

      this.loadingService.showLoading("EXPORT");

      let doc = new jspdf('l', 'cm', 'a4');

      headers.forEach((item, index) => {
        if (item)
          headers[index] = this.translate.instant(item);
      });

      let context = this;
      doc.addFileToVFS('arb-notosans-bold-normal.ttf', ArbNotosansBoldNormal.font);
      doc.addFont('arb-notosans-bold-normal.ttf', 'arb-notosans-bold', 'normal');

      doc.addFileToVFS('arb-notosans-regular-normal.ttf', ArbNotosansRegularNormal.font);
      doc.addFont('arb-notosans-regular-normal.ttf', 'arb-notosans-regular', 'normal');


      this.getDataUri('assets/img/arb-logo-b.svg').then((res) => {

        autoTable(doc, {
          didDrawPage: function (data) {
            doc.addImage({
              imageData: res,
              x: 0.5,
              y: 0.5,
              width: 4,
              height: 1.5,
              compression: "NONE",
            });
            doc.setFont("arb-notosans-bold");
            doc.setFontSize(16);
            doc.setDrawColor("#272424");
            doc.text(title, 0.5, 4, {});
          },
          margin: {

            top: 4.5,
            left: 0.5,
            right: 0.5,
            bottom: 0.5,
          },
          styles: {overflow: 'ellipsize', cellWidth: 'wrap'},
          head: [headers],
          body: data,
          showHead: "everyPage",
          bodyStyles: {
            font: "arb-notosans-regular",
            fontSize: 10,
            textColor: "#272424",

          },
          headStyles: {
            fillColor: "#0038FF",
            font: 'arb-notosans-bold',
            fontSize: 12,
            textColor: "#EFF6FF"
          },
          horizontalPageBreak: true,

        });
        context.doPDF(doc, fileName, print).subscribe();
      });

    });
  }


  totals = 0;
  onLoadTotals = 0;

  exportSummary(fileName: string, summaryModel: SummaryModel, print: boolean = false, isRTL: boolean = false): Observable<null> {

    fileName = this.translate.instant(fileName);

    return new Observable((observer: Subscriber<any>) => {
      this.loadingService.showLoading("EXPORT");
      this.totals = 0;
      this.onLoadTotals = 0;

      let doc = new jspdf('p', 'cm', 'a4');

      doc.addFileToVFS('arb-notosans-bold-normal.ttf', ArbNotosansBoldNormal.font);
      doc.addFont('arb-notosans-bold-normal.ttf', 'arb-notosans-bold', 'normal');

      doc.addFileToVFS('arb-notosans-regular-normal.ttf', ArbNotosansRegularNormal.font);
      doc.addFont('arb-notosans-regular-normal.ttf', 'arb-notosans-regular', 'normal');

      doc.setFont("arb-notosans-bold");
      doc.setFillColor("#272424");
      doc.setTextColor("#272424");
      doc.setDrawColor("#272424");

      let x = 0.5;
      if (isRTL) {
        x = 20.5
      }


      let context = this;

      this.getDataUri('assets/img/arb-logo-b.svg').then((image) => {

        doc.addImage({
          imageData: image,
          x: isRTL ? 16.5 : x,
          y: 0.5,
          width: 4,
          height: 1.5,
          compression: "NONE",
        });


        let nextY = 4;

        if (summaryModel.title) {
          nextY = context.addTitle(summaryModel.title, doc, x, nextY, isRTL);
          nextY = nextY - 0.5;
          context.addLine(doc, nextY);
          nextY = nextY + 1;
        }


        if (summaryModel.sections) {


          summaryModel.sections.forEach((item, summaryIndex) => {

            if (nextY > 20) {
              nextY = 4;
              this.addPageHeaderImage(doc, image, isRTL);
            }

            if (item.pill) {
              doc.setTextColor("#72788E");
              doc.setFont("arb-notosans-regular");
              doc.setFontSize(12);
              doc.text(item.pill.text, x, nextY, {align: isRTL ? "right" : "left"});
              nextY = this.getNextY(nextY, 1, doc, image, isRTL);
            }

            if (item.title) {
              doc.setTextColor("#272424");
              doc.setFont("arb-notosans-bold");
              nextY = context.addTitle(item.title, doc, x, nextY, isRTL);
            }

            if (item.items) {
              nextY = nextY - 2;


              item.items.forEach((summaryItem, index) => {
                let newX = index % 2 == 0 ? x : 11;
                nextY = index % 2 == 0 ? nextY = this.getNextY(nextY, 2, doc, image, isRTL) : nextY;

                if (summaryItem.title) {
                  context.totals++;

                  context.loadImage(doc, fileName, summaryItem, newX, nextY, print);
                  if (summaryItem.image) {
                    newX = newX + 1.3;
                  }

                  doc.setFont("arb-notosans-regular");
                  doc.setTextColor("#72788E");
                  doc.setFontSize(10);
                  doc.text(context.translate.instant(summaryItem.title), newX, nextY, {
                    align: isRTL ? "right" : "left",
                    maxWidth: 10
                  });
                  doc.setFontSize(13);
                  doc.setTextColor("#272424");
                  let text = '';
                  if (summaryItem.currency) {
                    text = summaryItem.subTitle ? context.amountPipe.transform(summaryItem.subTitle, "A", summaryItem.currency) + context.amountPipe.transform(summaryItem.subTitle, "F", summaryItem.currency) + ' ' + (context.currencyPipe.transform(summaryItem.currency)) : "";
                  } else {
                    text = summaryItem.subTitle ? context.translate.instant(summaryItem.subTitle) : '';
                  }
                  doc.text(text, newX, nextY + 0.8, {align: isRTL ? "right" : "left", maxWidth: 10});
                }
              });
              nextY = this.getNextY(nextY, 2, doc, image, isRTL);
            }


            if (item.table) {
              const table = (document.getElementById('summary_section_' + summaryIndex)!.getElementsByClassName("table-data")[0] as HTMLElement) || new HTMLElement();
              if (table) {
                let data = this.getTableData(table);
                let headers = this.getTableHeader(table);
                this.addTable(doc, headers, data, nextY, image);
                nextY = (doc as any).lastAutoTable.finalY + 1;
              }
            }
            context.addLine(doc, nextY);
            nextY++;
          });
          if (!this.totals) {
            context.doPDF(doc, fileName, print).subscribe();
          }
        } else {
          context.doPDF(doc, fileName, print).subscribe();
        }

      });


    });


  }

  getNextY(y: number, count: number, doc: jspdf, image: string, isRTL: boolean): number {
    if (y > 27) {
      this.addPageHeaderImage(doc, image, isRTL);
      return 4
    } else {
      return y + count;
    }
  }

  addPageHeaderImage(doc: jspdf, image: string, isRTL: boolean) {
    doc.addPage();
    doc.addImage({
      imageData: image,
      x: isRTL ? 16.5 : 0.5,
      y: 0.5,
      width: 4,
      height: 1.5,
      compression: "NONE",
    });
  }

  private addTitle(title: TitleModel, doc: any, x: number, nextY: number, isRTL: boolean): number {
    if (title.title) {
      doc.setTextColor("#272424");
      doc.setFontSize(18);
      doc.text(this.translate.instant(title.title) || "", x, nextY, {align: isRTL ? "right" : "left"});
      nextY++;
    }
    if (title.subTitle) {
      doc.setTextColor("#72788E");
      doc.setFont("arb-notosans-regular");
      doc.setFontSize(14);
      if (typeof title.subTitle == "string") {
        doc.text(this.translate.instant(title.subTitle) || "", x, nextY, {align: isRTL ? "right" : "left"});
        nextY++;
      } else {
        let text = "";
        title.subTitle.forEach(item => {
          text = text + (item.text ? this.translate.instant(item.text) : "") + " " + this.amountPipe.transform(item.amount, "A", item.currency || '') +
            this.amountPipe.transform(item.amount, "F", item.currency || '') + ' ' + this.currencyPipe.transform(item.currency || '')
        });
        doc.text(text, x, nextY, {align: isRTL ? "right" : "left"});
        nextY++;
      }
    }

    if (title.amount) {
      doc.setTextColor("#272424");
      doc.setFont("arb-notosans-regular");
      doc.setFontSize(12);
      doc.text(this.amountPipe.transform(title.amount, "A", title.currency || '') + this.amountPipe.transform(title.amount, "F", title.currency || '') + ' ' + this.currencyPipe.transform(title.currency || '')
        , x, nextY, {align: isRTL ? "right" : "left"});
      nextY++;
    }
    return nextY;
  }

  addLine(doc: any, y: number) {
    doc.setFont("arb-notosans-regular");
    doc.setLineWidth(0.01);
    doc.line(0.5, y, 20.5, y, 'S');
  }

  private doPDF(doc: any, fileName: string, print: boolean): Observable<null> {
    return new Observable((observer: Subscriber<any>) => {
      if (!print) {
        doc.save(fileName + ".pdf", {returnPromise: true}).then(() => {
          this.loadingService.hideLoading("EXPORT");
          observer.next();
        });
      } else {
        doc.autoPrint();
        window.open(doc.output('bloburl', {filename: fileName}));
        this.loadingService.hideLoading("EXPORT");
        observer.next();
      }
    });
  }

  private getDataUri(url: string): Promise<string> {
    return new Promise(resolve => {

      if (url) {
        let image = new Image();
        image.setAttribute('crossOrigin', 'anonymous'); //getting images from external domain

        image.onload = function () {
          let canvas = document.createElement('canvas');
          canvas.width = image.width * 32;
          canvas.height = image.height * 32;


          //next three lines for white background in case png has a transparent background
          let ctx = canvas.getContext('2d')!;
          ctx.fillStyle = '#fff';  /// set white fill style
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          canvas.getContext('2d')!.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 1));
        };

        image.src = url;
      } else {
        resolve("");
      }
    });
  }


  private loadImage(doc: any, fileName: string, summaryItem: SummaryItemModel, x: number, y: number, print: boolean) {
    this.getDataUri(summaryItem.image || '').then((res) => {
      if (res) {
        doc.addImage({
          imageData: res,
          x: x,
          y: y - 0.3,
          width: 1.2,
          height: 1.2,
          compression: "NONE",
          format: "JPEG"
        });

      }
      this.onLoadTotals++;
      if (this.onLoadTotals == this.totals)
        this.doPDF(doc, fileName, print).subscribe()
    });

  }


  getTableData(table: HTMLElement): string[][] {
    let data: string[][] = [];
    for (let row = 0; row < table.children[1].children.length; row++) {
      let itemRow: string[] = [];
      let cell = 0;
      for (cell; cell < table.children[1].children[row].children.length; cell++) {
        let input = table.children[1].children[row].children[cell].querySelector('input');
        if (input) {
          if (input.type == "checkbox") {
            if (input.value)
              itemRow.push(this.translate.instant(input.value ? input.value === 'true' ? 'public.checked' : 'public.unChecked' : 'public.unChecked'));
          } else {
            itemRow.push(input.value ? input.value : '');
          }
        } else {
          itemRow.push(table.children[1].children[row].children[cell].textContent || '');
        }
      }
      data.push(itemRow);
    }
    return data;
  }

  getTableHeader(table: HTMLElement): string[] {
    let headers: string[] = [];
    for (let cell = 0; cell < table.children[0].children[0].children.length; cell++) {
      headers.push(table.children[0].children[0].children[cell].textContent || '');
    }
    return headers;
  }


  addTable(doc: jspdf, headers: string[], data: string[][], y: number, image: string) {
    autoTable(doc, {

      didDrawPage: function (data) {
        doc.addImage({
          imageData: image,
          x: 0.5,
          y: 0.5,
          width: 4,
          height: 1.5,
          compression: "NONE",
        });
        doc.setFont("arb-notosans-bold");
        doc.setFontSize(16);
        doc.setDrawColor("#272424");
      },
      margin: {
        top: 4.5,
        left: 0.5,
        right: 0.5,
      },
      styles: {overflow: 'ellipsize', cellWidth: 'wrap'},
      head: [headers],
      body: data,
      startY: y,
      showHead: "everyPage",
      bodyStyles: {
        font: "arb-notosans-regular",
        fontSize: 10,
        textColor: "#272424",

      },
      headStyles: {
        fillColor: "#0038FF",
        font: 'arb-notosans-bold',
        fontSize: 12,
        textColor: "#EFF6FF"
      },
      horizontalPageBreak: true,

    });
  }

}
