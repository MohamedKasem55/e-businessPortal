import { Account } from "../common/account"
import { NotificationsList } from "./alerts-res.model"

export interface AlertsAddResModel {
  listAccountWithoutAlerts: Account[]
  notificationList: NotificationsList[]
  mobile: string
}
