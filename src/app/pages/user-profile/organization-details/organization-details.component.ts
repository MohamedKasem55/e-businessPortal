import { Component, OnInit } from '@angular/core';
import { FormModel, FormResult, PageModel } from 'app/@core/model/dto/formModel';
import { BaseResponse } from 'app/@core/model/rest/common/base-response';
import { OrganizationDetailsResponseModel } from 'app/@core/model/rest/organization-details/organization-details';
import { ModelAndListService } from 'app/@core/service/base/modelAndList.service';
import { OrganizationDetailService } from 'app/@core/service/organization-details/organization-details.service';
import { TransactionFollowBase } from 'app/shared/transaction-follow-base/transaction-follow-base';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { getContactDetailsForm, getOrganizationDetailsForm } from './organization-details-controls';

@Component({
    selector: 'app-organization-details',
    templateUrl: './organization-details.component.html',
})
export class OrganizationDetailsComponent extends TransactionFollowBase implements OnInit {
    receipt: string = '';
    titleButton: ButtonModel = {
        id: "relationShipManager",
        type: 'secondary',
        text: "organizationDetails.relationShipBtnText"
    };
    editBtnContactForm: ButtonModel =
        {
            id: "editBtnContactForm",
            type: "primary",
            text: "public.edit",
            showLoading: false,
            isDisable: false
        };
    saveAndDiscardContactInfo: ButtonModel[] = [
        {
            id: "discard",
            type: "secondary",
            text: "organizationDetails.discard",
            showLoading: false,
        },
        {
            id: "save",
            type: "primary",
            text: "organizationDetails.save",
            showLoading: false,
        },
    ];
    resultBtnContactForm: ButtonModel =
        {
            id: "resultBtnContactForm",
            type: "primary",
            text: "organizationDetails.goToDashBoard",
            showLoading: false,
            isDisable: false
        };
    constructor(
        private OrgDetailService: OrganizationDetailService,
        private modelAndListService: ModelAndListService
    ) {
        super();
        this.setBreadcrumb([{
            text: 'organizationDetails.title',
            url: '/organizationDetails'
        }]);
        this.pageTitle = {
            id: "organizationDetails",
            title: "organizationDetails.title",
            stepper: {
                steps: ["", "", ""],
                stepCounter: 1,
                stepText: "public.step",
                ofText: "public.of"
            },
            subTitle: "",
            endButtons: [this.titleButton],
        };
        this.drawPage();
        this.getPersonalDetails()
    }

    getPersonalDetails() {
        this.OrgDetailService.getOrganizationDetails().subscribe((data: OrganizationDetailsResponseModel) => {
            this.modelAndListService.getList(["cityType", "regionType", "customerIdType", "languages"]).subscribe((modelList: any) => {
                this.getControl(0, 0, "city").setValue(modelList['cityType'][data?.personalDetails?.address?.city]);
                this.getControl(0, 0, "cityRegion").setValue(modelList['regionType'][0]);
                this.getControl(0, 0, "coustomerType").setValue(modelList['customerIdType'][data?.personalDetails?.customerDetails?.customerType]);
                this.getControl(0, 0, "language").setValue(modelList['languages'][data?.personalDetails?.customerDetails?.language]);
            });
            this.getControl(0, 0, "profileNumber").setValue(data?.personalDetails?.profileNumber);
            this.getControl(0, 0, "title").setValue(data?.personalDetails?.customerDetails?.honorificTitle);
            this.getControl(0, 0, "name").setValue(data?.personalDetails?.customerDetails?.customerName);
            this.getControl(0, 0, "address").setValue(data?.personalDetails?.address?.street);
            this.getControl(0, 0, "zipCode").setValue(data?.personalDetails?.address?.zipCode);
            this.getControl(0, 0, "poBox").setValue(data?.personalDetails?.address?.poBox);
            this.getControl(0, 0, "coustomerId").setValue(data?.personalDetails?.customerDetails?.customerId);
            this.getControl(0, 0, "issueDate").setValue(data?.personalDetails?.customerDetails?.issuanceDate);
            this.getControl(0, 0, "issuePlace").setValue(data?.personalDetails?.customerDetails?.issuancePlace);
            this.getControl(0, 0, "country").setValue(data?.personalDetails?.address?.country);

            this.getControl(0, 1, "emailControl").setValue(data?.personalDetails?.customerDetails?.variableData?.personalDetailsMail?.emailAddress);
            this.getControl(0, 1, "mobileNumber").setValue(data?.personalDetails?.customerDetails?.variableData?.personalDetailsMobile?.unvalidatednumber);
            this.getControl(0, 1, "phoneNumber").setValue(data?.personalDetails?.customerDetails?.variableData.personalDetailsPhone.number);
            this.getControl(0, 1, "EXT-phone-number").setValue(data?.personalDetails?.customerDetails?.variableData?.personalDetailsPhone?.extension);
            this.getControl(0, 1, "faxNumber").setValue(data.personalDetails.customerDetails?.variableData?.personalDetailsFax?.number);
            this.getControl(0, 1, "EXT-fax-number").setValue(data?.personalDetails?.customerDetails?.variableData?.personalDetailsFax?.extension);
            this.getControl(0, 1, "work-phone-number").setValue(data?.personalDetails?.customerDetails?.variableData?.personalDetailsWPhone?.number);
            this.getControl(0, 1, "EXT-work-phone-number").setValue(data?.personalDetails?.customerDetails?.variableData?.personalDetailsWPhone?.extension);
            this.setContactType(data?.personalDetails?.customerDetails?.variableData?.selected)
        })
    }

    drawPage() {
        this.pages = [];
        this.pages = [new PageModel(1, getOrganizationDetailsForm(), getContactDetailsForm())];
    }


    ngOnInit(): void {
        this.endButtons = [this.editBtnContactForm];
        this.startButtons = [];
        this.getControl(0, 1, "receipt")
            .valueChanges.subscribe((typeSelected) => {
                this.getContactType(typeSelected.value);
            });
    }

    setContactType(type: string | null) {
        switch (type) {
            case 'personalDetailsMobile':
                this.getControl(0, 1, "receipt").setValue('mobile');
                break;
            case 'personalDetailsMail':
                this.getControl(0, 1, "receipt").setValue('email');
                break;
            case 'personalDetailsPhone':
                this.getControl(0, 1, "receipt").setValue('phone');
                break;
            case 'personalDetailsFax':
                this.getControl(0, 1, "receipt").setValue('fax');
                break;
            case 'personalDetailsWPhone':
                this.getControl(0, 1, "receipt").setValue('workPhone');
                break;
            default:
                this.getControl(0, 1, "receipt").setValue('mobile');
                break;
        }
    }

    getContactType(type: string) {
        switch (type) {
            case 'mobile':
                this.receipt = 'personalDetailsMobile';
                break;
            case 'email':
                this.receipt = 'personalDetailsMail';
                break;
            case 'phone':
                this.receipt = 'personalDetailsPhone';
                break;
            case 'fax':
                this.receipt = 'personalDetailsFax';
                break;
            case 'workPhone':
                this.receipt = 'personalDetailsWPhone';
                break;
            default:
                this.receipt = 'personalDetailsMobile';
                break;
        }
    }

    showAndHideContactForm() {
        this.getControl(0, 1, "emailControl").enable();
        this.getControl(0, 1, "mobileNumber").enable();
        this.getControl(0, 1, "phoneNumber").enable();
        this.getControl(0, 1, "EXT-phone-number").enable();
        this.getControl(0, 1, "faxNumber").enable();
        this.getControl(0, 1, "EXT-fax-number").enable();
        this.getControl(0, 1, "work-phone-number").enable();
        this.getControl(0, 1, "EXT-work-phone-number").enable();
        this.getControl(0, 1, "receipt").enable();
        this.endButtons = this.saveAndDiscardContactInfo;
        this.startButtons = [];
    }

    discardChangesContactForm() {
        this.endButtons = [this.editBtnContactForm];
        this.startButtons = [];
        this.getPersonalDetails();
        this.getControl(0, 1, "emailControl").disable();
        this.getControl(0, 1, "mobileNumber").disable();
        this.getControl(0, 1, "phoneNumber").disable();
        this.getControl(0, 1, "EXT-phone-number").disable();
        this.getControl(0, 1, "faxNumber").disable();
        this.getControl(0, 1, "EXT-fax-number").disable();
        this.getControl(0, 1, "work-phone-number").disable();
        this.getControl(0, 1, "EXT-work-phone-number").disable();
        this.getControl(0, 1, "receipt").disable();
    }

    override onButtonClick(formButtonClickOutput: any) {
        switch (formButtonClickOutput.buttonId) {
            case 'editBtnContactForm':
                this.showAndHideContactForm();
                break;
            case 'discard':
                this.discardChangesContactForm();
                break;
            case 'save':
                this.saveContactInfo();
                break;
            case 'cancel':
                this.backClick();
                break;
            case 'resultBtnContactForm':
                this.router.navigate(['/dashboard']);
                break;
            default:
                break;
        }
    }

    saveContactInfo() {
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
                                title: "organizationDetails.contactType",
                                subTitle: this.getControl(0, 1, "receipt").value
                            },
                            {
                                title: "public.email",
                                subTitle: this.getControl(0, 1, "emailControl").value
                            },
                            {
                                title: "organizationDetails.mobileNumber",
                                subTitle: this.getControl(0, 1, "mobileNumber").value
                            },
                            {
                                title: "organizationDetails.phoneNumber",
                                subTitle: this.getControl(0, 1, "phoneNumber").value
                            },
                            {
                                title: "organizationDetails.EXT-phone-number",
                                subTitle: this.getControl(0, 1, "EXT-phone-number").value
                            },
                            {
                                title: "organizationDetails.faxNumber",
                                subTitle: this.getControl(0, 1, "faxNumber").value
                            },
                            {
                                title: "organizationDetails.EXT-fax-number",
                                subTitle: this.getControl(0, 1, "EXT-fax-number").value
                            },
                            {
                                title: "organizationDetails.work-phone-number",
                                subTitle: this.getControl(0, 1, "work-phone-number").value
                            },
                            {
                                title: "organizationDetails.EXT-work-phone-number",
                                subTitle: this.getControl(0, 1, "EXT-work-phone-number").value
                            }
                        ]
                    }
                ]
            }
            this.stepperMoveNext();
            this.saveAndDiscardContactInfo[0].id = 'cancel';
            this.saveAndDiscardContactInfo[0].text = 'organizationDetails.back';
            this.saveAndDiscardContactInfo[1].text = 'organizationDetails.confirm';
        } else {
            const req = {
                email: this.getControl(0, 1, "emailControl").value,
                fax: this.getControl(0, 1, "faxNumber").value,
                faxAreaCode: "06",
                faxExtension: this.getControl(0, 1, "EXT-fax-number").value,
                mobileNumber: this.getControl(0, 1, "mobileNumber").value,
                phoneNumber: this.getControl(0, 1, "phoneNumber").value,
                phoneNumberAreaCode: "01",
                phoneNumberExtension: this.getControl(0, 1, "EXT-work-phone-number").value,
                selectedProperty: this.receipt,
                workNumber: this.getControl(0, 1, "work-phone-number").value,
                workNumberAreaCode: "05",
                workNumberExtension: this.getControl(0, 1, "EXT-work-phone-number").value
            };
            
            this.OrgDetailService.updateContactFormDetails(req).subscribe((data: BaseResponse) => {
                this.result = {
                    title: "updateUserDetails.success",
                    summary: this.summary,
                    type: "Success",
                    subTitle: "updateUserDetails.successMessage"
                }
                this.stepperMoveNext();
                this.endButtons = [this.resultBtnContactForm];
            });
        }
    }

    backClick() {
        switch (this.pageTitle.stepper?.stepCounter) {
            case 1:
                this.router.navigate(['/dashboard']);
                break;
            case 2:
                this.saveAndDiscardContactInfo[0].id = 'discard';
                this.saveAndDiscardContactInfo[0].text = 'organizationDetails.discard';
                this.saveAndDiscardContactInfo[1].text = 'organizationDetails.save';
                this.stepperMoveBack();
                break;
        }
    }

    override onResultChanged(data: FormResult[]): void {
        let valid = true;
        data.forEach(item => {
            valid = valid && item.valid;
        })
        if (this.endButtons.length > 1 && data[1].id == 'contactDetailsForm') {
            this.endButtons[1].isDisable = !valid;
        }

    }

}
