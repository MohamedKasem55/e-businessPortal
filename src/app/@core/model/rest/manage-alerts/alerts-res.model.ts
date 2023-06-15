
export interface AlertsResModel {
  size: number
  page: number
  total: number
  expiryDate: Date
  accountWithAlertsList : AccountAlerts[]
}

export interface AccountAlerts {
  accountNumber: string
  subscriptionDate: Date
  subscriptionType: string
  notificationAmountType: string
  language: string
  notificationsNumber: number
  notificationsList : NotificationsList[]
}

export interface NotificationsList {
  notificationType: string
  notificationAmount: number
  notificationFlag: string
  englishDescription: string
  arabicDescription: string
  defaultValue: number
  minValidationAmount: number
  maxValidationAmount: number
}
