import { NotificationsList } from "./alerts-res.model"

export interface AlertsPutReqModel {
  originalNotificationList: NotificationsList[]
  notificationList: NotificationsList[]
  accountToModify: string
  language: string
}
