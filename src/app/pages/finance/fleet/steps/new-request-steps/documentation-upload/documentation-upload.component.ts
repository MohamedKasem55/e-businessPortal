import {Component} from '@angular/core';
import {documentationUploadControl} from "./documentation-upload.component.control";
import {AbstractControl, FormGroup, ValidationErrors} from "@angular/forms";
import {PageModel} from 'app/@core/model/dto/formModel';
import {UploadControl} from '../../../../../../@core/model/dto/control/upload-control';
import {FormButtonClickOutput} from '../../../../../../shared/form/form.component';
import { RequestService } from '../../../../../../@core/service/finance/request/request.service';
import { RequiredDocs, DocumentInfo } from '../../../../../../@core/model/rest/finance/request/documentation-upload';
import { DocumentList } from '../../../../../../@core/model/rest/finance/request/track-application';
import { FinanceBaseComponent } from '../../../../finance-base/finance-base.component';
import { Utils } from '../../../../../../@core/utility/Utils';


@Component({
  selector: 'app-documentation-upload',
  templateUrl: '../../../../finance-base/finance-base.component.html',
  styleUrls: []
})
export class DocumentationUploadComponent extends FinanceBaseComponent {

  public requiredDocsList: DocumentList[] = []
  public documentUploadedLst: {title:string,name:string}[] = []
  uploadForm: FormGroup | undefined
  dossierId!: string;
  file!: File;
  documentList:DocumentList[] = [];
  trackDocs:DocumentList[] =[];

  constructor(
    private requestService: RequestService

  ) {
    super();
    this.pageTitle.stepper!.stepCounter = 4;

    this.dossierId = sessionStorage.getItem("DOSSIER_ID") ||"";
    this.pageTitle = {id: '', title: ''};
    this.drawPage()
    this.nextButton.isDisable = true
  }


  drawPage() {
    this.pages = [new PageModel(1, documentationUploadControl())]
  }

  override ngOnInit() {
    this.documentList = (sessionStorage.getItem('TrackDocuments'))? JSON.parse(sessionStorage.getItem('TrackDocuments') || "") : this.documentList;
    this.getControl(0, 0, 'DocumentationUploadForm')
    if (this.requestService.getFilteredRequiredDocs(this.documentList).length > 0 ){
        this.getFilterdDocsTrackApp(this.documentList)
    }else{
        this.getRequiredDocs();
    }
  }

  getRequiredDocs() {
    this.requestService.getMandatoryDocs().subscribe((res:RequiredDocs) => {
      res.documentInfos.map((element: DocumentList) => {
        this.requiredDocsList.push(element)
        this.pages[0].forms[0].addControl(<string>element.documentCode, new UploadControl({
          label: <string>element.description,
          hidden: false,
          required: true,
          value: "",
          order: 5,
          columnCount: 3,
          controlOptions: {acceptedTypes: [".txt", ".png", ".pdf", ".xlsx", ".jpg"]},
          validationLabels: {required: 'File Is Required'}
        }));

        this.pages[0].forms[0].controls[element.documentCode || ""]?.valueChanges.subscribe((elm) => {
          this.onFileSelected(elm.value, element.documentCode || "")
        })
      })
    })
  }

  getFilterdDocsTrackApp(docList: DocumentList[]) {
    this.requestService.getFilteredRequiredDocs(docList).map((element) => {
      this.requiredDocsList.push(element)
    })
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'Next':
        this.nextClick();
        break;

      case 'Back':
        this.backClick();
        break;

      case 'PendingActions':
        break;

    }
  }

  nextClick() {
    this.router.navigate(['/finance/fleet/init-offer'])
  }

  backClick() {
    this.router.navigate(['/finance/fleet/vehicle-details'])
  }

  onFileSelected(event: File, inputId: string) {
    this.file = event;
    let fileSize = this.file?.size / 1024 / 1024


    if (this.file && fileSize <= 5) {

     Utils.blobToBase64(this.file).then((dataURL: any) => {
        this.requestService.uploadDocument(this.dossierId, inputId?.toString(), this.file, dataURL).subscribe((res) => {
          this.documentUploadedLst.push({title: inputId, name: this.file.name})

          sessionStorage.setItem('documentUploadedVal', JSON.stringify(this.documentUploadedLst))
          this.pages[0].forms[0].errorsUpdate.hasError = true
          this.pages[0].forms[0].setErrors([]);

          this.validateForm()

        })
      })
    } else {
      this.clearForm()
      this.clearInputVal(inputId)
    }

  }

  validateForm() {
    this.pages[0].forms[0]?.errors?.length === 0 && this.pages[0].forms[0].errorsUpdate.hasError ? this.nextButton.isDisable = false : this.nextButton.isDisable = true
  }

  clearForm() {
    this.pages[0].forms[0].setErrors(["true"]);
    this.documentUploadedLst.pop()
  }

  clearInputVal(inputId: string) {
    this.pages[0].forms[0].errorsUpdate.hasError = false
    this.pages[0].forms[0]?.addFormValidator({
      validatorFunc: (controls: AbstractControl): ValidationErrors | null => {
        const documentCode = controls.get(inputId)?.value;
        if (documentCode) {
          return {errorUpload: "errorUpload"}
        } else {
          return null;
        }
      },
      errorName: 'errorUpload',
      errorMessage: 'finance.fleet.newRequest.FIleUploadError'
    })

    this.pages[0].forms[0].controls[inputId]?.setValue('')
  }
}
