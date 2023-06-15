import {FormModel} from "../../../../../@core/model/dto/formModel";
import {TextControl} from "../../../../../@core/model/dto/control/text-control";
import {ButtonControl} from "../../../../../@core/model/dto/control/button-control";
import {
  CompanyWorkflowTypeEnum,
  CompanyWorkflowTypeImages
} from "../../../../../@core/model/rest/company-admin/workflow/company-workflow-type-enum";
import {GenericFeatureListModel} from "arb-design-library/model/generic-feature-list.model";
import {PopupInputModel} from "../../../../../@core/model/dto/popup.model";
import {TableHeaderModel} from "arb-design-library/model/table-header.model";
import {TableHeaderType} from "arb-design-library";
import {TitleControl} from "../../../../../@core/model/dto/control/title-control";
import {TableControl} from "../../../../../@core/model/dto/control/table-control";
import {TitleModel} from "arb-design-library/model/title.model";
import {GenericFeatureListGroupControl} from "../../../../../@core/model/dto/control/generic-feature-list-group-control";
import {ButtonModel} from "arb-design-library/model/button.model";

export const getBasicModel = (): GenericFeatureListModel => {
  return {
    id: CompanyWorkflowTypeEnum.BASIC,
    title: "workflow.overview",
    cardImg: CompanyWorkflowTypeImages.BASIC,
    cardTitle:"workflow.basic",
    description: "workflow.basic.description",
    featureTitle:"workflow.features",
    features: [
      {
        icon:"arb-icon-building fs-4 color-arb-secondaryText ",
        text:"workflow.basic-features.feature-1"
      },
      {
        icon:"arb-icon-check fs-4 color-arb-secondaryText ",
        text:"workflow.basic-features.feature-2"
      },
      {
        icon:"arb-icon-heart fs-4 color-arb-secondaryText ",
        text:"workflow.basic-features.feature-3"
      },
      {
        icon:"arb-icon-king fs-4 color-arb-secondaryText ",
        text:"workflow.basic-features.feature-4"
      },
    ],
    featureButton: {
      id: 'switchToBasic',
      type: 'outLine',
      text: 'workflow.get-it-now',
      isDisable: true,
      suffixIcon:"arb-icon-arrowRight arb-icons-ar"
    }
  };
}

export const getMakerCheckerModel = (): GenericFeatureListModel => {
  return {
    id: CompanyWorkflowTypeEnum.MAKER_CHECKER,
    title: "workflow.overview",
    cardImg: CompanyWorkflowTypeImages.MAKER_CHECKER,
    cardTitle: "workflow.makerChecker",
    description: "workflow.checkerMaker.description",
    featureTitle:"workflow.features",
    features: [
      {
        icon:"arb-icon-heart fs-4 color-arb-secondaryText ",
        text:"workflow.checker-maker-features.feature-1"
      },
      {
        icon:"arb-icon-insuranceSharp fs-4 color-arb-secondaryText ",
        text:"workflow.checker-maker-features.feature-2"
      },
      {
        icon:"arb-icon-refresh2Arrows fs-4 color-arb-secondaryText ",
        text:"workflow.checker-maker-features.feature-3"
      },
      {
        icon:"arb-icon-building fs-4 color-arb-secondaryText ",
        text:"workflow.checker-maker-features.feature-4"
      },
    ],
    featureButton: {
      id: 'switchToBasic',
      type: 'outLine',
      text: 'workflow.get-it-now',
      isDisable: true,
      suffixIcon:"arb-icon-arrowRight arb-icons-ar"
    }
  };
}

export const getWorkflowModel = (): GenericFeatureListModel => {
  return {
    id: CompanyWorkflowTypeEnum.WORKFLOW,
    title: "workflow.overview",
    cardImg: CompanyWorkflowTypeImages.WORKFLOW,
    cardTitle: "workflow.workflow",
    description: "workflow.workflow.description",
    featureTitle:"workflow.features",
    features: [
      {
        icon:" arb-icon-filterLarge fs-4 color-arb-secondaryText ",
        text:"workflow.workflow-features.feature-1"
      },
      {
        icon:"arb-icon-paperPenVerification fs-4 color-arb-secondaryText ",
        text:"workflow.workflow-features.feature-2"
      },
      {
        icon:"arb-icon-heart fs-4 color-arb-secondaryText ",
        text:"workflow.workflow-features.feature-3"
      },
      {
        icon:"arb-icon-electricity fs-4 color-arb-secondaryText ",
        text:"workflow.workflow-features.feature-4"
      },
    ],
    featureButton: {
      id: 'switchToBasic',
      type: 'outLine',
      text: 'workflow.get-it-now',
      isDisable: true,
      suffixIcon:"arb-icon-arrowRight arb-icons-ar"
    }
  };
}

export const getChangeWorkflowPopupForm = (): PopupInputModel => {
  return {
    image: 'assets/img/warning.svg',
    form: new FormModel({
      id: 'changeWorkflowForm',
      controls: {
        "changeWorkflowTitle": new TextControl({
          label: 'workflow.change-workflow-popup-title',
          required: false,
          order: 1,
          columnCount: 12,
          class: 'font-h1-bold align-items-center',
        }),
        "changeWorkflowSubtitle": new TextControl({
          label: 'workflow.change-workflow-popup-subtitle',
          required: false,
          order: 2,
          columnCount: 12,
        }),
        hint: new TextControl({
          columnCount: 12,
          order: 3,
          label: 'workflow.change-workflow-popup-hint',
          class: "mt-2 fs-4 color-arb-secondaryText",
          controlOptions: {
            prefixIcon: "arb-icon-exclamationBorder fs-4 color-arb-secondaryText",
          }
        }),
        "cancelButton": new ButtonControl({
          order: 5,
          columnCount: 6,
          controlOptions: {
            id: "cancel",
            type: 'secondary',
            text: "public.cancel"
          }
        }),
        "changeWorkflowButton": new ButtonControl({
          order: 6,
          columnCount: 6,
          controlOptions: {
            id: "changeWorkflow",
            type: 'primary',
            text: "public.confirm"
          }
        }),
      }
    }),
  }
}

export const getChangeWorkflowForm = (): FormModel => {
  return new FormModel({
    id: 'genericForm',
    controls: {
      changeWorkflow: new GenericFeatureListGroupControl({
        columnCount: 12,
        order: 2,
        required: true,
        controlOptions: {
          list: [],

        }
      }),
    }
  })

}

export const createBaseCheckerPageTitle = (): TitleModel => {
  return {
    id: "workflowTitle",
    type: 'Page',
    title: 'workflow.change-workflow',
    stepper: undefined
  }
}

export const createMakerCheckerPageTitle = (): TitleModel => {
  return {
    id: "workflowTitle",
    type: 'Page',
    title: 'workflow.change-workflow',
    stepper: {
      steps: ['', '', ''],
      stepCounter: 1,
      stepText: "public.step",
      ofText: "public.of"
    }
  }

}

export const getMakerCheckerForm = (): FormModel => {
  return new FormModel({
    id: 'makerCheckerForm',
    controls: {
      makerChecker: new TableControl({
        columnCount: 12,
        order: 3,
        required: true,
        controlOptions: {
          title: 'workflow.set-user-levels',
          columnId: 'userId',
          headers: getUsersListTableHeaders(),
        }
      }),
    },
  })
}

export const getUsersListTableHeaders = (): TableHeaderModel[] => {

  let headers: TableHeaderModel[] = [];
  headers.push({
    title: "company-admin.users-list.loginID",
    type: TableHeaderType.TEXT,
    fieldName: "userId",
  });
  headers.push({
    title: "public.name",
    type: TableHeaderType.TEXT,
    fieldName: "userName",
  });
  headers.push({
    type: TableHeaderType.CHECK_BOX,
    title: "company-admin.user-info.maker",
    fieldName: "maker",
  });
  headers.push({
    type: TableHeaderType.CHECK_BOX,
    title: "company-admin.user-info.checker",
    fieldName: "checker",
  });


  return headers;
}

export const getRecommendationMakerCheckerWarning = (): TextControl => {
  return new TextControl({
    columnCount: 12,
    order: 4,
    label: 'workflow.recommend-basic-warning',
    class: "mt-2 fs-4 color-arb-secondaryText",
    controlOptions: {
      prefixIcon: "arb-icon-exclamationBorder fs-4 color-arb-secondaryText",
    }
  })
}

export const getKeepCurrentTypeButton = (): ButtonModel => {
  return {
    id: 'keepMeAsIs',
    type: 'primary',
    text: 'workflow.keep-me-as-is',
  }
}
