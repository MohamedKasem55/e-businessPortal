export interface AlertModel {
  id: string;
  type: 'Critical' | 'Normal' | 'Success' | 'Auxiliary';
  title?: string;
  message: string | string[];
  action?: string;
  showClose?: boolean;
}
