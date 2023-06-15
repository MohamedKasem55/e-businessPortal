import {User} from "./user-operation-request";

export interface ResUserManagementValidate {
  user: User
  hasNextApprovalLevel: boolean
}

