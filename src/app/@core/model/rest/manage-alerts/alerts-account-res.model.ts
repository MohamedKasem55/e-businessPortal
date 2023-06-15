import { NotificationsList } from "./alerts-res.model"

export interface AlertsAccountResModel {
  notificationList: NotificationsList[]
  mobile: string
  notificationAccount: string
  language: string
}
