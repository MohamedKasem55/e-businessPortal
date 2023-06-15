import { Account } from "../common/account";

export interface AlertsAddPostReqModel {
  notificationList: NotificationAlert[]
  listAccountWithoutAlertsSelected: Account[]
  language: string
}

export interface NotificationAlert {
  notificationType: string
  defaultValue: string
  notificationAmount: string
}
