import {BeneficiaryModel} from "./beneficiary.model";
import {PaginationModel} from "../../common/pagination.model";

export interface BeneficiariesResModel extends PaginationModel {
  beneficiaryList: BeneficiaryModel[],
  remitterCategory: string
}
